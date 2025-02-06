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
    9. The JSON should contain a "storyName" (prompt an appropriate name for this story) and a "story" field with the generated passage.
  
    JSON format:
    ~{
      "storyName": "Story generated with <selectedWords>",
      "story": "Your generated passage using <selectedWords> naturally in a well-structured and engaging context."
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
