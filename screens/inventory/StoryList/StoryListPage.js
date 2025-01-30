import React from "react";
import { ScrollView } from "react-native";

import StoryFolderItem, {
  StoryFolderItemLoading,
} from "./components/StoryFolderItem";

const StoryListPage = ({ isGeneratingStory }) => {
  const mockStoryList = [
    {
      lastEditedTimeStamp: "2025-01-30T21:06:21.656Z",
      storyWords: [
        {
          id: "confide",
          imgUrl:
            "https://www.wikihow.com/images/thumb/9/9b/Get-People-to-Confide-in-You-Step-3-Version-2.jpg/v4-460px-Get-People-to-Confide-in-You-Step-3-Version-2.jpg.webp",
          phonetics: {
            audio: "",
            text: "/kənˈfaɪd/",
          },
          timeStamp: "2025-01-30T18:15:51.071Z",
          meanings: [
            {
              antonyms: [],
              definitions: [
                {
                  synonyms: [],
                  antonyms: [],
                  definition: "To trust, have faith (in).",
                },
                {
                  example: "I confide this mission to you alone.",
                  antonyms: [],
                  synonyms: [],
                  definition:
                    "To entrust (something) to the responsibility of someone.",
                },
                {
                  synonyms: [],
                  example:
                    "I could no longer keep this secret alone; I decided to confide in my brother.",
                  antonyms: [],
                  definition:
                    "To take (someone) into one's confidence, to speak in secret with. ( + in)",
                },
                {
                  synonyms: [],
                  definition: "To say (something) in confidence.",
                  example:
                    "After several drinks, I confided my problems to the barman.",
                  antonyms: [],
                },
              ],
              partOfSpeech: "verb",
              synonyms: [],
            },
          ],
        },
        {
          id: "corrupt",
          imgUrl:
            "https://www.wrm.org.uy/sites/default/files/styles/529_x_353_exactly/public/images/Curruption_apaisada.jpg?itok=zpecEd-Y",
          phonetics: {
            text: "/kəˈɹʌpt/",
            sourceUrl:
              "https://commons.wikimedia.org/w/index.php?curid=2100358",
            audio:
              "https://api.dictionaryapi.dev/media/pronunciations/en/corrupt-us.mp3",
            license: {
              name: "BY-SA 3.0",
              url: "https://creativecommons.org/licenses/by-sa/3.0",
            },
          },
          timeStamp: "2025-01-30T14:40:05.187Z",
          meanings: [
            {
              synonyms: [],
              antonyms: [],
              partOfSpeech: "verb",
              definitions: [
                {
                  antonyms: [],
                  definition:
                    "To make corrupt; to change from good to bad; to draw away from the right path; to deprave; to pervert.",
                  synonyms: [],
                },
                {
                  definition:
                    "To become putrid, tainted, or otherwise impure; to putrefy; to rot.",
                  synonyms: [],
                  antonyms: [],
                },
                {
                  synonyms: [],
                  definition:
                    "To debase or make impure by alterations or additions; to falsify.",
                  example: "to corrupt a book",
                  antonyms: [],
                },
                {
                  antonyms: [],
                  definition: "To waste, spoil, or consume; to make worthless.",
                  synonyms: [],
                },
              ],
            },
            {
              synonyms: ["corrupted"],
              partOfSpeech: "adjective",
              antonyms: [],
              definitions: [
                {
                  definition:
                    "In a depraved state; debased; perverted; morally degenerate; weak in morals.",
                  synonyms: [],
                  example:
                    "The government here is corrupt, so we'll emigrate to escape them.",
                  antonyms: [],
                },
                {
                  example:
                    "It turned out that the program was corrupt - that's why it wouldn't open.",
                  synonyms: [],
                  definition:
                    "Abounding in errors; not genuine or correct; in an invalid state.",
                },
                {
                  synonyms: [],
                  definition:
                    "In a putrid state; spoiled; tainted; vitiated; unsound.",
                  antonyms: [],
                },
              ],
            },
          ],
        },
        {
          id: "propaganda",
          timeStamp: "2025-01-28T15:38:01.810Z",
          meanings: [
            {
              antonyms: [],
              synonyms: ["presstitution"],
              definitions: [
                {
                  antonyms: [],
                  definition:
                    "A concerted set of messages aimed at influencing the opinions or behavior of large numbers of people.",
                  synonyms: ["presstitution"],
                },
              ],
              partOfSpeech: "noun",
            },
          ],
          phonetics: {
            license: {
              url: "https://creativecommons.org/licenses/by-sa/3.0",
              name: "BY-SA 3.0",
            },
            sourceUrl:
              "https://commons.wikimedia.org/w/index.php?curid=1770020",
            audio:
              "https://api.dictionaryapi.dev/media/pronunciations/en/propaganda-us.mp3",
            text: "[ˌpɹɑp.ə.ˈɡæn.də]",
          },
          imgUrl:
            "https://exhibitions.ushmm.org/storage/914/f87130c8-ba94-11ec-bc82-0a86e68a834f.jpeg",
        },
      ],
    },
    {
      lastEditedTimeStamp: "2025-01-30T21:02:21.058Z",
      storyWords: [
        {
          id: "confide",
          imgUrl:
            "https://www.wikihow.com/images/thumb/9/9b/Get-People-to-Confide-in-You-Step-3-Version-2.jpg/v4-460px-Get-People-to-Confide-in-You-Step-3-Version-2.jpg.webp",
          phonetics: {
            audio: "",
            text: "/kənˈfaɪd/",
          },
          timeStamp: "2025-01-30T18:15:51.071Z",
          meanings: [
            {
              antonyms: [],
              definitions: [
                {
                  synonyms: [],
                  antonyms: [],
                  definition: "To trust, have faith (in).",
                },
                {
                  example: "I confide this mission to you alone.",
                  antonyms: [],
                  synonyms: [],
                  definition:
                    "To entrust (something) to the responsibility of someone.",
                },
                {
                  synonyms: [],
                  example:
                    "I could no longer keep this secret alone; I decided to confide in my brother.",
                  antonyms: [],
                  definition:
                    "To take (someone) into one's confidence, to speak in secret with. ( + in)",
                },
                {
                  synonyms: [],
                  definition: "To say (something) in confidence.",
                  example:
                    "After several drinks, I confided my problems to the barman.",
                  antonyms: [],
                },
              ],
              partOfSpeech: "verb",
              synonyms: [],
            },
          ],
        },
        {
          id: "dwindle",
          meanings: [
            {
              definitions: [
                {
                  antonyms: [],
                  definition:
                    "To decrease, shrink, diminish, reduce in size or intensity.",
                  synonyms: [],
                },
                {
                  definition: "To fall away in quality; degenerate, sink.",
                  synonyms: [],
                  antonyms: [],
                },
                {
                  synonyms: [],
                  definition: "To lessen; to bring low.",
                  antonyms: [],
                },
                {
                  antonyms: [],
                  definition: "To break up or disperse.",
                  synonyms: [],
                },
              ],
              partOfSpeech: "verb",
              synonyms: [],
              antonyms: [],
            },
          ],
          timeStamp: "2025-01-30T17:45:42.683Z",
          imgUrl:
            "https://www.risk.net/sites/default/files/styles/landscape_750_463/public/2024-03/fcm-risk.jpg.webp?h=bd3ff802&itok=S_AUfIRC",
          phonetics: {
            sourceUrl:
              "https://commons.wikimedia.org/w/index.php?curid=75730375",
            license: {
              name: "BY-SA 4.0",
              url: "https://creativecommons.org/licenses/by-sa/4.0",
            },
            audio:
              "https://api.dictionaryapi.dev/media/pronunciations/en/dwindle-au.mp3",
          },
        },
      ],
    },
  ];

  return (
    <ScrollView className="flex-1 w-full   px-2 py-4">
      {isGeneratingStory && <StoryFolderItemLoading />}
      {mockStoryList.map((storyItem, index) => (
        <StoryFolderItem storyItem={storyItem} key={index} />
      ))}
    </ScrollView>
  );
};

export default StoryListPage;
