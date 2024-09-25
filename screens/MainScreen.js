import { View, Text, KeyboardAvoidingView, TouchableWithoutFeedback, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'

//wordSuggestionApi = https://api.datamuse.com/sug?s=d&max=40


const MainScreen = ({navigation}) => {

  const [inputText, setInputText] = useState("")
  const [wordSuggestion, setWordSuggestion] = useState([])

  const searchWord = (word)=>{
    setInputText("")
    navigation.navigate("Definition",{
      searchedWord:word
    })
  }

  useEffect(() => {

    const fetchWordSuggestion = async ()=>{
      
      const res = await fetch(`https://api.datamuse.com/sug?s=${inputText}&max=40`)
      const rs = await res.json()
      if(rs.length > 0) setWordSuggestion(rs)
      else  setWordSuggestion([])
    }

    if(inputText.length == 0)
    {
      return setWordSuggestion([])
    }
    fetchWordSuggestion()

  }, [inputText])
  
  
  return (
    <TouchableWithoutFeedback>
        <KeyboardAvoidingView className='flex-1 justify-start items-center pt-10'>
            <Text className="text-lg font-bold">Search your word</Text>
            <TextInput
              className="text-lg"
                placeholder='search...'
                value={inputText}
                onChangeText={setInputText}
            />
            {
              wordSuggestion.length > 0 && (
                <View className="border px-6">
                  {
                    wordSuggestion.slice(0,12).map((wordItem,index) => {
                      if(wordItem.word.length > 1 && wordItem.word.split(" ").length == 1)
                      {
                        return(
                          <TouchableOpacity
                          key={`${wordItem.word}-${index}`}
                            onPress={()=>{
                              searchWord(wordItem.word)
                            }}
                          >
                            <Text className="text-lg font-semibold">{wordItem.word}</Text>
                          </TouchableOpacity>
                        )
                      }
                    }
                    )
                  }
              </View>
              )
            }
            {/* <TouchableOpacity>
              <Text>Search</Text>
            </TouchableOpacity> */}
        </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
    
  )
}

export default MainScreen