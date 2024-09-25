import { View, Text, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import OpenAI from "openai";
import { definitionReturnExample } from '../constants';
import PronunciationButton from '../components/PronunciationButton';
import ImageGallery from '../components/ImageGallery';
import Meaning from '../components/Meanings';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const tabList = [
    {
        id:0,
        tabName:'DEFINITION'
    },

    {
        id:1,
        tabName:'IMAGE'
    }
]


const DefinitionScreen = ({navigation, route}) => {
    const iniWord = route.params.searchedWord
    const [searchedWord, setSearchedWord] = useState(iniWord)
    const [definition, setDefinition] = useState(null)
    const [imagesResult, setImagesResults] = useState([])
    const [isLoadingDef, setIsLoadingDef] = useState(false)
    const [isLoadingPic, setIsLoadingPic] = useState(false)
    const [searchBarWord, setSearchBarWord] = useState('')
    //divide the response into different parts
    const [phonetics, setPhonetics] = useState(null)
    const [meanings, setMeanings] = useState(null)
   
    //the structure of a word for saving will be containing 
    //phonetics, meanings, imgUrl, timeStamp
    const handleSavingWord = async ({imgUrl}) => {
        if (!searchedWord || !meanings) return;

        
        const user = auth.currentUser
        
        if(user){
            const userId = user.uid
            const wordData = {
                phonetics: phonetics,
                meanings: meanings,
                imgUrl:imgUrl,
                timeStamp: new Date().toISOString(),
            }

            try {
                await setDoc(doc(db, 'users', userId, 'wordList', searchedWord), wordData)
                console.log('Word saved successfully!');
                navigation.navigate('WordList'); 
            } catch (error) {
                console.error('Error saving word:', error);
            }

        }

        
    }
    

    const inputRef = useRef(null)

    const CHATGPT_KEY = process.env.EXPO_PUBLIC_CHATGPT_KEY
    const IMAGE_SEARCH_KEY = process.env.EXPO_PUBLIC_IMAGE_SEARCH_KEY

    const openai = new OpenAI(
    {
        apiKey: CHATGPT_KEY,
        dangerouslyAllowBrowser: true,
    }
    );


    
    const [tabId, setTabId] = useState(0)


    //Filter the phonetic value
    function getObjectWithAudio(arr) {
        // Check for the first object with a non-empty audio property
        const objWithAudio = arr.find(item => item.audio && item.audio.trim() !== '');
      
        // If found, return that object, otherwise return the first object in the array
        return objWithAudio || arr[0];
    }

    
    

    //Update each part once the definition has been updated 
    useEffect(() => {

    if(definition?.meanings)
    {
        setMeanings(definition.meanings)
    }
    if(definition?.phonetics)
    {
        const phoneticVal = getObjectWithAudio(definition.phonetics)
        setPhonetics(phoneticVal)

    }

    }, [definition])
    
    
    
    //Alternative way to fetchWord, implementing openai api
    const fetchWordDefinitionFromAi = async (word) => {
        setIsLoadingDef(true);
        try {
            const completion = await openai.chat.completions.create({
                messages: [
                    { "role": "system", "content": "You are an English teacher." },
                    {
                        "role": "user",
                        "content": `define word ${word}. return me in this format ${JSON.stringify(definitionReturnExample)}`,
                    },
                ],
                model: "gpt-4o-mini",
            });
    
            const response = completion.choices[0].message.content;
            console.log("OpenAI Response:", response); // Debugging line
    
            // Attempt to clean the response if necessary
            const cleanedResponse = response.trim();
    
            // Check if the cleaned response looks like JSON
            if (cleanedResponse.startsWith('{') && cleanedResponse.endsWith('}')) {
                const responseParsed = JSON.parse(cleanedResponse);
                setMeanings(responseParsed?.meanings);
            } else {
                console.error('Invalid JSON format:', cleanedResponse);
                // Handle invalid JSON format as needed
            }
        } catch (error) {
            console.error('Error in handleAISearch:', error);
        } finally {
            setIsLoadingDef(false); // Ensure loading state is reset
        }
    };

    
    const fetchWordDefinition = async ()=>{
        setIsLoadingDef(true)
        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchedWord}`)
        const rs = await res.json()
        if(rs.length > 0)
        {
            setDefinition(rs[0])
            setIsLoadingDef(false)

        }  
        else{
            fetchWordDefinitionFromAi(searchedWord)
        }
    }

    const handleSearchImage = async (urlWord) => {
        setIsLoadingPic(true)
        try {
            
            const response = await fetch(`https://serpapi.com/search.json?engine=google_images&q=${urlWord}&api_key=${IMAGE_SEARCH_KEY}`);
            const data = await response.json();
            if(data?.images_results)
            {
                // setImagesResults(data?.images_results)
                setImagesResults(data.images_results)
                setIsLoadingPic(false)
            }
    
            
        } catch (error) {
            console.log(error);
        }
    }
    
    

    useEffect(() => {
        fetchWordDefinition()
        handleSearchImage(searchedWord)
    }, [searchedWord])

    const handleSearch = () => {
        if (searchBarWord.trim()) {
            setSearchedWord(searchBarWord)
            setSearchBarWord('')
            if(inputRef?.current){
                inputRef.current.blur()
            }
        }
    };
    

    return (
    <View className="flex-1 p-6 py-12">

        

       <View className="flex-row justify-between">
        <TouchableOpacity 
                onPress={()=>{
                    navigation.goBack()
                }}
            >
                <Text>BACK</Text>
            </TouchableOpacity>
        <TouchableOpacity 
            onPress={()=>{
               fetchWordDefinitionFromAi(searchedWord)
            }}
        >
            <Text>AI Search</Text>
        </TouchableOpacity>
       </View>

       {/* Search Bar */}
       <View className="flex-row mb-4">
                <TextInput
                ref={inputRef}
                    style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10 }}
                    placeholder="Search for a word..."
                    value={searchBarWord}
                    onChangeText={setSearchBarWord}
                />
                <TouchableOpacity onPress={handleSearch} style={{ marginLeft: 10 }}>
                    <View className="bg-blue-500 p-3 rounded">
                        <Text className="text-white font-semibold">Search</Text>
                    </View>
                </TouchableOpacity>
            </View>

        <View className=" flex-row justify-between">
            <Text className="text-2xl font-bold">
                {searchedWord}
            </Text>
            {
                phonetics && (
                    <View className=" ">
                        <Text>{phonetics.text}</Text>
                        <PronunciationButton audioUrl={phonetics?.audio} />
                    </View>
                )
            }
        </View>

        {/* TABBAR */}
        <View className="flex border-b-2 mb-4 flex-row justify-between">
            {
                tabList.map(tabItem => (
                    <TouchableOpacity
                        key={tabItem.id}
                        onPress={()=>{
                            setTabId(tabItem.id)
                        }}
                    >
                        <Text>
                            {
                                tabItem.tabName
                            }
                        </Text>
                    </TouchableOpacity>
                ))
            }
        </View>

        {
            tabId === 0 && (
                <View className="flex-1 flex  relative">
            {
                meanings && !isLoadingDef ? (
                    <Meaning meanings={meanings} />
                ):(
                   <View className="flex-1 justify-center items-center">
                        <ActivityIndicator />  
                    </View>
                )
            }
            {/* <TouchableOpacity style={{height:50, width:50}} className="bg-red-500 flex justify-center items-center rounded-full  absolute bottom-2 right-2">
                <Text className=" font-semibold text-white">
                    Save
                </Text>
            </TouchableOpacity> */}
        </View>
            )
        }
        {
            tabId === 1 && (
                <View className="flex-1  relative">
                    {
                        imagesResult.length > 0 && !isLoadingPic ? (
                            <ImageGallery onSaveWord={handleSavingWord} images_result={imagesResult} />
                        ):(
                            <Text>Searching images...</Text>
                        )
                    }
                </View>
            )
        }

    </View>
  )
}

export default DefinitionScreen