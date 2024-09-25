import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';

const ImageGallery = ({ images_result, onSaveWord }) => {
 
    const [data, setData] = useState(images_result.slice(0, 20)); // Initial data
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const handleImagePress = (imgUrl) => {
        Alert.alert(
            "Save Word",
            "Do you want to save this word with the selected image?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Save",
                    onPress: () => onSaveWord({ imgUrl })
                }
            ]
        );
    };

    const loadMoreImages = () => {
        if (loading || data.length >= images_result.length) return;

        setLoading(true);
        setTimeout(() => {
            const newPage = page + 1;
            const nextImages = images_result.slice(0, newPage * 20);
            setData(nextImages);
            setPage(newPage);
            setLoading(false);
        }, 500); // Simulating network delay
    };

    useEffect(() => {
        setData(images_result.slice(0, 20)); // Reset data on prop change
        setPage(1); // Reset page on prop change
    }, [images_result]);

    const renderItem = ({ item }) => (
        <TouchableOpacity 
        onPress={()=>{
            handleImagePress(item.thumbnail)
        }}
        style={styles.imageContainer}>
            <Image source={{ uri: item.thumbnail }} style={styles.image} />
        </TouchableOpacity>
    );

    return (
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
            onEndReached={loadMoreImages}
            onEndReachedThreshold={0.1}
            ListFooterComponent={loading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
        />
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        margin: 5,
    },
    image: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
    },
});

export default ImageGallery;
