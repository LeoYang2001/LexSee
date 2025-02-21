import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  SectionList,
} from "react-native";

const ImageList = ({
  images_result,
  selectedImgs,
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

  const renderImageItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        handleImagePress(item.link);
      }}
      style={styles.imageContainer}
    >
      <Image source={{ uri: item.link }} style={styles.image} />
    </TouchableOpacity>
  );

  const sections = [
    {
      title: "Top Views",
      data: selectedImgs,
      renderItem: ({ item, index }) => {
        console.log(index);
        const label = (() => {
          switch (index) {
            case 0:
              return "Most selected";
            case 1:
              return "Second most selected";
            case 2:
              return "Third most selected";
            default:
              return "other";
          }
        })();
        return (
          <TouchableOpacity
            onPress={() => {
              handleImagePress(item.imgUrl);
            }}
            style={styles.imageContainer}
          >
            <Image source={{ uri: item.imgUrl }} style={styles.image} />
            <View
              style={{
                borderTopLeftRadius: 10,
                borderBottomRightRadius: 10,
                backgroundColor: "#250C0430",
              }}
              className="absolute right-0 bottom-0 p-2"
            >
              <Text className="text-white">{label}</Text>
            </View>
          </TouchableOpacity>
        );
      },
    },
    {
      title: "Images",
      data: images_result,
      renderItem: ({ item }) => (
        <FlatList
          data={images_result} // Data for images
          renderItem={renderImageItem} // Image rendering function
          keyExtractor={(item, index) => index.toString()}
          numColumns={2} // Two images per row
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => (
            <View style={{ padding: 10 }}>
              <ActivityIndicator animating size="small" />
            </View>
          )}
        />
      ),
    },
  ];

  return (
    <>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) =>
          item.link ? (
            renderImageItem({ item }) // Render images for the Images section
          ) : (
            <View style={{ padding: 10 }}>
              {/* Render static content for Top Views */}
              <Text>demo</Text>
            </View>
          )
        }
        renderSectionHeader={({ section }) => <></>}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => (
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
