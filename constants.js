export const definitionReturnExample = {
  meanings: [
    {
      partOfSpeech: "noun",
      definitions: [
        {
          definition: "....",
          synonyms: [],
          antonyms: [],
        },
        {
          definition: "...",
          synonyms: [],
          antonyms: [],
        },
      ],
      synonyms: [],
      antonyms: [],
    },
  ],
};

export const synonymGroupExample = [
  {
    generalDef: "Attractive or pleasing in appearance",
    synonyms: ["attractive", "beautiful", "handsome", "charming"],
  },
  {
    generalDef: "Intense or aggressive in appearance or behavior",
    synonyms: ["fierce", "ferocious", "untamed"],
  },
  {
    generalDef: "Sophisticated and refined in manner",
    synonyms: ["urbane", "civilized"],
  },
];

export function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export // Main function to reorganize words and add groupColor
function reorganizeWords(wordList, groupings) {
  const wordMap = new Map();
  // First, map the words by their ID for easy lookup
  wordList.forEach((wordObj) => {
    wordMap.set(wordObj.id, wordObj);
  });

  // Prepare the result array
  let organizedWords = [];

  // Process each group in the second input
  groupings.forEach((group) => {
    const groupColor = getRandomColor(); // Assign random color to this group
    group.forEach((word) => {
      if (wordMap.has(word)) {
        let wordObj = wordMap.get(word);
        wordObj.groupColor = groupColor; // Add groupColor attribute
        organizedWords.push(wordObj);
      }
    });
  });

  return organizedWords;
}
