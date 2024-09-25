import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; // Adjust the path based on your structure
import { collection, onSnapshot } from 'firebase/firestore';
import { auth } from '../firebase'; // Import auth to get the current user's UID
import WordItem from '../components/WordItem';

const WordListScreen = () => {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser; // Get the current user

    if (user) {
      const userId = user.uid; // Get the current user's UID
      const wordListRef = collection(db, 'users', userId, 'wordList'); // Reference to the user's wordList subcollection

      // Subscribe to the words in the user's wordList collection
      const unsubscribe = onSnapshot(wordListRef, (snapshot) => {
        const wordsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setWords(wordsData);
        setLoading(false);
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
    } else {
      setLoading(false); // If there's no user, stop loading
    }
  }, []);

  const renderItem = ({ item }) => (
    <WordItem
        imgUrl={item.imgUrl}
        word={item.id} // Assuming 'id' is the word
        phonetics={item.phonetics}
    />
);


  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={words}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false} // Hide vertical scroll indicator
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
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
});

export default WordListScreen;
