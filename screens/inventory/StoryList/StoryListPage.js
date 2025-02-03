import React from "react";
import { ScrollView } from "react-native";

import StoryFolderItem, {
  StoryFolderItemLoading,
} from "./components/StoryFolderItem";
import { useSelector } from "react-redux";

const StoryListPage = ({ isGeneratingStory, navigation }) => {
  const savedStoryList = useSelector((state) => state.userInfo.savedStoryList);

  return (
    <ScrollView className="flex-1 w-full   px-2 py-4">
      {isGeneratingStory && <StoryFolderItemLoading />}
      {savedStoryList.map((storyItem) => (
        <StoryFolderItem
          navigation={navigation}
          storyItem={storyItem}
          key={storyItem.id}
        />
      ))}
    </ScrollView>
  );
};

export default StoryListPage;
