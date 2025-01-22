import { useSelector } from "react-redux";

export const getSavedWords = useSelector((state) => {
  try {
    return JSON.parse(state.userInfo.savedWordList); // Parse the stringified word list
  } catch (error) {
    console.log("Error parsing savedWordList:", error);
    return [];
  }
});
