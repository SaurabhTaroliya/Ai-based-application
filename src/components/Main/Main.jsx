import { assets } from '../../assets/assets';
import { Context } from '../../context/context';
import './Main.css';
import React, { useContext, useEffect } from 'react'

const Main = () => {

    const {prevPrompts,
        setPrevPrompts,
        onSent,
        recentPrompt,
        setRecentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
        SpeechRecognition,
        responseType,
        imageUrl} = useContext(Context)

        if (!browserSupportsSpeechRecognition) {
            return <span>Browser doesn't support speech recognition.</span>;
          }

    useEffect(()=>{
        setInput(transcript)
        console.log(transcript)
    },[transcript])

  return (
    <div className="main">
        <div className="nav">
            <p>Gemini</p>
            <img src={assets.user_icon} alt="user-icon" />
        </div>
        <div className="main-container">

            {!showResult
            ?
                <>
                    <div className="greet">
                <p><span>Hello, Dev.</span></p>
                <p>How can I help today?</p>
            </div> 
            <div className="cards">
                <div className="card">
                    <p>Suggest beautiful places to see on an upcoming road trip</p>
                    <img src={assets.compass_icon} alt="" />
                </div>
                <div className="card">
                    <p>Briefly summarize this concept: Urban planning</p>
                    <img src={assets.bulb_icon} alt="" />
                </div>
                <div className="card">
                    <p>Brainstrom team bonding activities for our work retreat</p>
                    <img src={assets.message_icon} alt="" />
                </div>
                <div className="card">
                    <p>Improve the readability of the following code</p>
                    <img src={assets.code_icon} alt="" />
                </div>
            </div>
                </>
            : <div className='result'>
                <div className="result-title">
                    <img id='profile-img' src={assets.user_icon} alt="" />
                    <p>{recentPrompt}</p>
                </div>
                <div className="result-data">
                    <img src={assets.gemini_icon} alt="" />
                    {loading
                    ?<div className='loader'>
                        <hr />
                        <hr />
                        <hr />
                    </div>
                    : <div className="response">
                        {responseType === "image" ? <img id='imgUrl' src={imageUrl} alt="" /> : <p dangerouslySetInnerHTML={{__html:resultData}} ></p>  }
                    </div>
                    // <p dangerouslySetInnerHTML={{__html:resultData}} ></p>
                    
                    }   
                </div>
            </div>
            }

           
            <div className="main-bottom">
                <div className="search-box">
                    <input onChange={(e)=>setInput(e.target.value)} value={input} type="text" placeholder='Enter a prompt here' />
                    <div>
                        <img src={assets.gallery_icon} alt="" />
                        <img onClick={SpeechRecognition.startListening} src={assets.mic_icon} alt="" />
                        <img onClick={()=>onSent(input)} src={assets.send_icon} alt="" />
                    </div>
                </div>
                <p className="bottom-info">
                    Gemini may display inaccurate info, including about people, so double-check its responses. Your privacy and Gemini Apps
                </p>
            </div>
        </div>
    </div>
  )
}

export default Main