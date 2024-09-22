// import 'regenerator-runtime/runtime';// It should be at the top of the file to reolve the error :(Rgenerator-runtime/runtime)

// import { createContext, useState, useEffect } from "react";
// import run from "../config/gemini";

// // To include Speech Recognition functionality
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
// import query from '../config/huggingFace';

// export const Context = createContext();

// const ContextProvider = (props) => {

//     const {
//         transcript,
//         listening,
//         resetTranscript,
//         browserSupportsSpeechRecognition
//       } = useSpeechRecognition();

//     const [input, setInput] = useState("")
//     const [recentPrompt, setRecentPrompt] = useState("")
//     const [prevPrompts, setPrevPrompts] = useState([])
//     const [showResult, setShowResult] = useState(false)
//     const [loading, setLoading] = useState(false)
//     const [resultData, setResultData] = useState("")
//     let [responseType, setResponseType] = useState("text")
//     let [imageUrl, setImageUrl] = useState("")

//     const delayPara = (index,nextWord) => {
//         setTimeout(() => {
//             setResultData(prev => prev + nextWord)
//         }, 75*index);
//     }

//     const newChat = () => {
//         setLoading(false)
//         setShowResult(false)
//     }

//     const onSent = async (prompt) =>{

//         setResultData("")
//         setLoading(true)
//         setShowResult(true)
//         let response;
//         if (prompt !== undefined) {
//             console.log("-------------inside if----------------");

//             if (prompt.includes("image")) {
//                 setResponseType("iamge")
//                 console.log(responseType)
                
//                 // response = await query(prompt)
//                 // setImageUrl(response)
//             }else{
//                 response = await run(prompt)
//             }

//             setRecentPrompt(prompt)
//             setPrevPrompts(prev => [...prev, prompt])
//         }
//         else{
//             console.log("-----------------inside else---------------");

//             setPrevPrompts(prev => [...prev, input])
//             setRecentPrompt(input)

//             if (prompt.includes("image")) {
//                 setResponseType("image")
//                 console.log(responseType)
//                 // response = await query(input)
//                 // setImageUrl(response)
//             }else{
//                 response = await run(input)
//             }
//         }

//         if (!prompt.includes("image") ){
//             let responseArray = response.split("**")
//             let newResponse = "" ;
//             for(let i =0; i < responseArray.length; i++){
//                 if(i === 0 || i%2 !== 1){
//                     newResponse += responseArray[i]
//                 }
//                 else{
//                     newResponse += "<b>"+responseArray[i]+"</b>"
//                 }
//             }
//             let newResponse2 = newResponse.split("*").join("</br>")
//             let newResponseArray = newResponse2.split(" ")
//             for(let i = 0; i <newResponseArray.length; i++){
//                 const nextWord = newResponseArray[i]
//                 delayPara(i,nextWord+" ")
//         }
//         }

        
//         setLoading(false)
//         setInput("")
//         setResponseType("text")
//         setImageUrl("")
//     }
//     const contextValue = {
//         prevPrompts,
//         setPrevPrompts,
//         onSent,
//         recentPrompt,
//         setRecentPrompt,
//         showResult,
//         loading,
//         resultData,
//         input,
//         setInput,
//         newChat,
//         transcript,
//         listening,
//         resetTranscript,
//         browserSupportsSpeechRecognition,
//         SpeechRecognition,
        
//     }
//     // onSent("What is the full form of HTML")

//     return (
//         <Context.Provider value={contextValue}>
//             {props.children}
//         </Context.Provider>
//     )
// }

// export default ContextProvider;




import 'regenerator-runtime/runtime'; // Ensure the top import to resolve the runtime error

import { createContext, useState, useEffect } from "react";
import run from "../config/gemini";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import query from '../config/huggingFace';

export const Context = createContext();

const ContextProvider = (props) => {
    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [responseType, setResponseType] = useState("text");
    const [imageUrl, setImageUrl] = useState("");

    // Helper function to display text slowly
    const delayPara = (index, nextWord) => {
        setTimeout(() => {
            setResultData(prev => prev + nextWord);
        }, 75 * index);
    };

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
        setInput("");
        setRecentPrompt("");
        setResultData("");
        setImageUrl("");
        setResponseType("text");
    };

    const handlePromptType = (prompt) => {
        // Check if the prompt contains "image" to determine responseType
        if (prompt.includes("image")) {
            setResponseType("image");
            return true;  // Indicates image response
        } else {
            setResponseType("text");
            return false; // Indicates text response
        }
    };

    const onSent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);
        
        // Determine if it's an image or text prompt before making API calls
        const isImagePrompt = handlePromptType(prompt);
        let response;

        // Make the appropriate API call based on responseType
        try {
            if (isImagePrompt) {
                response = await query(prompt);  // Assuming query returns an image URL
                setImageUrl(response);
            } else {
                response = await run(prompt);  // Handles text response
            }

            // Set recent prompt and previous prompts
            setRecentPrompt(prompt);
            setPrevPrompts(prev => [...prev, prompt]);
            
            if (response && responseType === "text") {
                // Handle displaying the text response word by word
                let responseArray = response.split("**");
                let formattedResponse = responseArray.map((text, index) =>
                    index % 2 === 1 ? `<b>${text}</b>` : text
                ).join("");
                
                let splitResponse = formattedResponse.split(" ");
                splitResponse.forEach((word, i) => delayPara(i, word + " "));
            }
        } catch (error) {
            console.error("Error fetching the response:", error);
        }

        setLoading(false);
        setInput("");
    };

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
        SpeechRecognition,
        responseType,
        imageUrl,
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;
