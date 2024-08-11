import 'regenerator-runtime/runtime';// It should be at the top of the file to reolve the error :(Rgenerator-runtime/runtime)

import { createContext, useState } from "react";
import run from "../config/gemini";

// To include Speech Recognition functionality
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

export const Context = createContext();

const ContextProvider = (props) => {

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
      } = useSpeechRecognition();

    const [input, setInput] = useState("")
    const [recentPrompt, setRecentPrompt] = useState("")
    const [prevPrompts, setPrevPrompts] = useState([])
    const [showResult, setShowResult] = useState(false)
    const [loading, setLoading] = useState(false)
    const [resultData, setResultData] = useState("")

    const delayPara = (index,nextWord) => {
        setTimeout(() => {
            setResultData(prev => prev + nextWord)
        }, 75*index);
    }

    const newChat = () => {
        setLoading(false)
        setShowResult(false)
    }

    const onSent = async (prompt) =>{

        setResultData("")
        setLoading(true)
        setShowResult(true)
        let response;
        if (prompt !== undefined) {
            response = await run(prompt)
            setRecentPrompt(prompt)
            // setPrevPrompts(prev => [...prev, prompt])
        }
        else{
            setPrevPrompts(prev => [...prev, input])
            setRecentPrompt(input)
            response =  await run(input)
        }

        let responseArray = response.split("**")
        let newResponse = "" ;
        for(let i =0; i < responseArray.length; i++){
            if(i === 0 || i%2 !== 1){
                newResponse += responseArray[i]
            }
            else{
                newResponse += "<b>"+responseArray[i]+"</b>"
            }
        }
        let newResponse2 = newResponse.split("*").join("</br>")
        let newResponseArray = newResponse2.split(" ")
        for(let i = 0; i <newResponseArray.length; i++){
            const nextWord = newResponseArray[i]
            delayPara(i,nextWord+" ")
        }
        setLoading(false)
        setInput("")
    }
    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        recentPrompt,
        setRecentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat,
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
        SpeechRecognition
    }
    // onSent("What is the full form of HTML")

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;