function convertJsonToObject(str) {
  // Extract content between ~ symbols
  const regex = /~([\s\S]+)~/;
  const match = str.match(regex);

  if (match) {
    // Clean up the string by removing ~ symbols
    let jsonString = match[1].trim(); // Ensure no extra spaces or newlines

    // Log the content to check if it's still valid
    console.log("Cleaned JSON String:", jsonString);

    // Try parsing the string directly as JSON
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.error("Invalid JSON format:", e);
      console.error("Response:", jsonString); // Log the raw string to check for format issues
      return null;
    }
  }

  return null; // Return null if no content is found
}

export const fetchDefinition = async (openai, word, language = "English") => {
  if (!word) return;
  // Adjust the prompt based on whether a specific definition is provided
  const userPrompt = `
    Provide the definition of the word "${word}" in ${language}. Return the output as a valid JSON object strictly adhering to the following format:

    {
      "id": "${word}",
      "meanings": [
        {
          "antonyms": ["if applicable in ${language}"],
          "definition": "if applicable in ${language}",
          "partOfSpeech": "if applicable in ${language}",
          "synonyms": ["if applicable in ${language}"]
        },
        {
          more definition if applicable
        }
      ],
      "phonetics": {
        "text": "if applicable in ${language}"
      }
    }

    Special Instructions:
    1. If the language is "${language}" and it is not English, return all content (including definitions, synonyms, antonyms, part of speech, and phonetics) localized in ${language}.
    2. Wrap the entire JSON response between "~" symbols (e.g., ~{...}~).
    3. Ensure all JSON keys are properly quoted.
    4. Return only the JSON object wrapped with "~". Avoid adding explanations, comments, or any text outside the JSON object.

    If any field (e.g., synonyms, antonyms, phonetics) is not applicable, use an empty string ("") or an empty array ([]).
    `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You are a language teacher." },
      { role: "user", content: userPrompt },
    ],
  });

  const responseText = completion.choices[0].message.content;
  // Split response by newline and remove empty lines, then set as conversation array
  const responseObject = convertJsonToObject(responseText);
  return responseObject;
};

export const fetchStory = async (
  openai,
  selectedWords,
  language = "English"
) => {
  if (selectedWords?.length < 1) return;

  const formattedWords = selectedWords.join(",");
  const userPrompt = `
  I have just learned the following words: ${formattedWords}. Please generate a short but detailed and engaging passage that naturally includes all these words in ${language}. This passage should help me consolidate my understanding and self-test the meanings of these words.

  Special Instructions:
    1. Write the passage entirely in ${language}.
    2. Ensure the passage is at least 6-8 sentences long, providing enough context for each word to be clearly understood.
    3. Wrap each of the provided words in "<>" to highlight them.
    4. Use simple, natural language suitable for a learner of ${language}, avoiding unnecessary complexity.
    5. Make the passage meaningful and engaging, with a logical flow and a real-world or imaginative scenario where the words fit naturally.
    6. **Return only a properly formatted JSON object**. Do not include any extra text, explanations, or comments outside the JSON object.
    7. **Strictly adhere to JSON syntax**. Ensure that the JSON keys are quoted correctly and the structure is valid. Wrap the entire JSON response between "~" symbols (e.g., ~{...}~).
    8. Do not include any additional characters or words that are not part of the JSON response.
    9. The JSON should contain the following keys:
      - "storyName": A name for the story based on the selected words.
      - "story": The passage with selected words wrapped in "<>".
      - "storyPieces": An array that splits the passage into each word, space, and punctuation mark separately. Ensure that the selected words are wrapped in "<>", while other words and punctuation are kept as they are.
  
  JSON format:
  ~{
    "storyName": "A name for the story based on the selected words",
    "story": "Your generated passage where each selected word is wrapped in < >.",
    "storyPieces": ["word1", " ", "word2", ",", " ", "<selectedWord>", " ", "word3", "."]
  }~
`;
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You are a language teacher." },
      { role: "user", content: userPrompt },
    ],
  });
  const responseText = completion.choices[0].message.content;

  // Split response by newline and remove empty lines, then set as conversation array
  const responseObject = convertJsonToObject(responseText);
  return responseObject;
};

export const fetchConversation = async (
  openai,
  word,
  language = "English",
  definition = null
) => {
  console.log("Fetching conversation...");

  try {
    if (!openai || !openai.chat || !openai.chat.completions) {
      throw new Error("Invalid OpenAI instance provided.");
    }

    if (!word) {
      throw new Error("No words selected for conversation generation.");
    }

    // Adjust the prompt based on whether a specific definition is provided
    const userPrompt = definition
      ? `Create a conversation between two people in **${language}** using the word "${word}" and its specific definition: "${definition}". 

Please follow these rules:
- The conversation must be entirely in **${language}**.
- Limit the conversation to a maximum of 8 lines.
- Each line should start and end with the "~" character.
- Do not include any additional characters before or after the "~" symbols.
- Keep the dialogue casual and natural, and use the word "${selectedWords}" in a way that reflects the provided definition.

Example format (in ${language}):
~Hey, did you see the movie last night?~
~Yeah, I did! The plot was a bit obscure, though.~
~Yeah, I know what you mean. The director is famous for creating obscure movies.~

Please respond using this format exactly, with no more than 8 lines.`
      : `Create a conversation between two people in **${language}** using the word "${word}". 

Please follow these rules:
- The conversation must be entirely in **${language}**.
- Limit the conversation to a maximum of 8 lines.
- Each line should start and end with the "~" character.
- Do not include any additional characters before or after the "~" symbols.
- Keep the dialogue casual and natural, and use the word "${word}" at least once.

Example format (in ${language}):
~Hey, did you see the movie last night?~
~Yeah, I did! The plot was a bit obscure, though.~
~Yeah, I know what you mean. The director is famous for creating obscure movies.~

Please respond using this format exactly, with no more than 8 lines.`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: userPrompt },
      ],
    });

    // Validate response
    if (!completion || !completion.choices || completion.choices.length === 0) {
      throw new Error("No response received from OpenAI.");
    }

    const responseText = completion.choices[0].message.content;
    console.log("AI Response:", responseText);

    // Process and format the conversation lines
    const conversationLines = responseText
      .split("\n")
      .filter(
        (line) => line.trim().startsWith("~") && line.trim().endsWith("~")
      )
      .map((line) => line.trim().slice(1, -1)); // Removes "~" from start and end

    return conversationLines;
  } catch (error) {
    console.error("Error fetching conversation:", error.message);
    return [];
  }
};
