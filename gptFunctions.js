function convertJsonToObject(str) {
  // Extract content between ~ symbols
  const regex = /~([\s\S]+)~/;
  const match = str.match(regex);

  if (match) {
    // Clean up the string to ensure valid JSON format
    let jsonString = match[1]
      .replace(/([a-zA-Z0-9_]+):/g, '"$1":') // Add quotes around keys
      .replace(/'([^']+)'/g, '"$1"'); // Replace single quotes with double quotes

    try {
      // Parse the cleaned string as JSON
      return JSON.parse(jsonString);
    } catch (e) {
      console.error("Invalid JSON format:", e);
      return null;
    }
  }

  return null; // Return null if no content is found
}

export const fetchDefinition = async (openai, word, language = "English") => {
  if (!word) return;
  // Adjust the pr  ompt based on whether a specific definition is provided
  const userPrompt = `
    Provide the definition of the word "${word}" in ${language}. Return the output as a valid JSON object strictly adhering to the following format:

    {
      "id": "sample",
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
  console.log(JSON.stringify(responseObject));
  return responseObject;
};
