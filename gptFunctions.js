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
        console.error('Invalid JSON format:', e);
        return null;
      }
    }
  
    return null; // Return null if no content is found
  }
  

export const fetchDefinition = async (openai, word, language = 'English') => {

    if(!word) return 
    // Adjust the pr  ompt based on whether a specific definition is provided
    const userPrompt = `what's the definition of "${word}", in ${language}

    return my in JSON format like this
        {
        "id": "sample",
        "meanings": [
          {
            "antonyms": ["if applicable"],
            "definitions": [
              "if applicable",
              "if applicable",
              "if applicable"
            ],
            "partOfSpeech": "if applicable",
            "synonyms": ["if applicable"]
          }
        ],
        "phonetics": {
          "text": "/ˈkʌlpəbəl/"
        }
    }

    use ~ to wrap the return, Do not include any additional characters within "~" symbols`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a language teacher." },
        { role: "user", content: userPrompt },
      ],
    });

    const responseText = completion.choices[0].message.content;
    // Split response by newline and remove empty lines, then set as conversation array
    const responseObject = convertJsonToObject(responseText)
    console.log(JSON.stringify(responseObject))
    return responseObject
  };