// WordItem.js
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Modal, TouchableOpacity } from 'react-native';

const WordItem = ({ imgUrl, word, phonetics }) => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <View style={styles.itemContainer}>
                    <Image source={{ uri: imgUrl }} style={styles.image} />
                    <View style={styles.textContainer}>
                        <Text style={styles.word}>{word}</Text>
                        {phonetics && phonetics.text && (
                            <Text style={styles.phonetics}>{phonetics.text}</Text>
                        )}
                    </View>
                </View>
            </TouchableOpacity>

            {/* Modal for zoomable image */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity style={styles.modalBackground} onPress={() => setModalVisible(false)}>
                    <Image source={{ uri: imgUrl }} style={styles.modalImage} />
                </TouchableOpacity>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
    },
    image: {
        width: 50, // Adjust width as needed
        height: 50, // Adjust height as needed
        borderRadius: 25, // Optional: rounded image
        marginRight: 10,
    },
    textContainer: {
        flex: 1, // Take the remaining space
    },
    word: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    phonetics: {
        fontSize: 14,
        color: '#666',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Semi-transparent background
    },
    modalImage: {
        width: '100%', // Full width
        height: '100%', // Full height
        resizeMode: 'contain', // Maintain aspect ratio
    },
});

export default WordItem;
