import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Text,
} from "react-native";

const ImageGallery = ({ images_result, onSaveWord, fetchMoreImages, page }) => {
  const handleLoadMore = () => {
    if (fetchMoreImages) {
      fetchMoreImages();
    }
  };

  const handleImagePress = (imgUrl) => {
    Alert.alert(
      "Save Word",
      "Do you want to save this word with the selected image?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Save",
          onPress: () => onSaveWord({ imgUrl }),
        },
      ]
    );
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
    height: 150,
    resizeMode: "cover",
  },
});

export default ImageGallery;
