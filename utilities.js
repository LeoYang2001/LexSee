import { useSelector } from "react-redux";

export const getSavedWords = useSelector((state) => {
  try {
    return state.userInfo.savedWordList; // Parse the stringified word list
  } catch (error) {
    console.log("Error parsing savedWordList from get saved word:", error);
    return [];
  }
});
