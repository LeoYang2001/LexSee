import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Meaning = ({ meanings }) => {
    return (
        <View style={styles.container}>
            {meanings.map((meaning, index) => (
                <View key={index} style={styles.meaningContainer}>
                    <Text style={styles.partOfSpeech}>{meaning.partOfSpeech}</Text>
                    {meaning.definitions.map((def, defIndex) => (
                        <View key={defIndex} style={styles.definitionContainer}>
                            <Text style={styles.definition}>{def.definition}</Text>
                            {def.synonyms?.length > 0 && (
                                <Text style={styles.synonyms}>
                                    Synonyms: {def.synonyms.join(', ')}
                                </Text>
                            )}
                            {def.antonyms.length > 0 && (
                                <Text style={styles.antonyms}>
                                    Antonyms: {def.antonyms.join(', ')}
                                </Text>
                            )}
                        </View>
                    ))}
                    {meaning.synonyms.length > 0 && (
                        <Text style={styles.synonyms}>
                            Overall Synonyms: {meaning.synonyms.join(', ')}
                        </Text>
                    )}
                    {meaning.antonyms.length > 0 && (
                        <Text style={styles.antonyms}>
                            Overall Antonyms: {meaning.antonyms.join(', ')}
                        </Text>
                    )}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#fff',
    },
    meaningContainer: {
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 10,
    },
    partOfSpeech: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
    },
    definitionContainer: {
        marginBottom: 5,
    },
    definition: {
        fontSize: 14,
        color: '#333',
    },
    synonyms: {
        fontSize: 12,
        color: '#666',
    },
    antonyms: {
        fontSize: 12,
        color: '#666',
    },
});

export default Meaning;
