import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from "react-native";

const ImageList = ({
  images_result,
  onSaveWord,
  fetchMoreImages,
  page,
  handleConfirmPop,
}) => {
  const handleLoadMore = () => {
    if (fetchMoreImages) {
      fetchMoreImages();
    }
  };

  const handleImagePress = (imgUrl) => {
    handleConfirmPop(imgUrl);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        handleImagePress(item.link);
      }}
      style={styles.imageContainer}
    >
      <Image source={{ uri: item.link }} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <>
      {/* ConfirmBtn Here:  */}

      <FlatList
        data={images_result}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => (
          // Loading indicator for pagination
          <View style={{ padding: 10 }}>
            <ActivityIndicator animating size="small" />
          </View>
        )}
      />
    </>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    margin: 5,
  },
  image: {
    width: "100%",
    height: 170,
    resizeMode: "cover",
    borderRadius: 10,
  },
});

export default ImageList;
