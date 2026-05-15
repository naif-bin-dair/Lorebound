import './App.css'
import { GoogleGenAI } from "@google/genai";
import { useState, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

function App() {
  const [textValue, setTextValue] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);

  const openModal = () => modalRef.current?.showModal();
  const closeModal = () => modalRef.current?.close();

  const fileToGenerativePart = async (file) => {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  };

  const handleStream = async (promptParts) => {
    setLoading(true);
    
    try {
      const chat = ai.chats.create({
        model: "gemini-3.1-flash-lite",
        history: history,
        config: {
          systemInstruction: `You are a narrator for an adventure game that the user is playing to help them study and revise their knowlegde in a fun way.
          at first you will be provided information about the users character, the world, and study material as a PDF file.
          you will then use this information to create a story for the user to follow. the story will be a series of choices that the user can make to progress through the story and the user can only succeed 
          in them if you ask the user a multiple choice question aobut the study material and he answers it correctly,
          if they answer incorrectly you will tell them the correct answer and why it is the correct answer and why their answer is wrong then create a bad outcome for the user in the story.
          the story will be a series of events that the user can experience to help them study the material they are learning and alawys at the start of every response show the characters status like location number of current hearts and other information to help the user visulize the story in their mind,
          and if they get enough bad outcomes they will lose the game and have to start over with a new story, but when they lose you will tell them that they lost and don't ask if they want to play again and don't let them to replay the same character even if they ask you.`,
        },
      });

      setHistory(prev => [...prev, { role: "user", parts: promptParts }, { role: "model", parts: [{ text: "" }] }]);

      const chatResponse = await chat.sendMessageStream({ message: promptParts });

      for await (const chunk of chatResponse) {
        setHistory(prev => {
          const newText = prev[prev.length -1].parts[0].text + chunk.text;
          return [...prev.slice(0,-1), { role: "model", parts: [{ text: newText }] }]
        });
      }
      
    } catch (error) {
      console.error("error:", error);
    } finally {
      setLoading(false);
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    closeModal();
    const elements = e.target.elements;
    const fileInput = elements.studyFile.files[0];
    
    const message = `My character is ${elements.character.value},
     and he lives in ${elements.world.value}. 
     and my study material is the pdf file that has been sent, 
     and I want to have ${elements.hearts.value} hearts in the story.`;

    const promptParts = [{ text: message }];
    if (fileInput) {
      const filePart = await fileToGenerativePart(fileInput);
      promptParts.push(filePart);
    }

    await handleStream(promptParts);
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !loading) {
      e.preventDefault();
      setTextValue("");
      await handleStream([{ text: e.target.value }]);
    }
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  useEffect(()=>{
    openModal();
  }, []);

  useEffect(() => {
    if (history.length > 0) {
      scrollToBottom();
    }
  }, [history]);


  return (
    <>
      <div id='overall'>
        <dialog ref={modalRef} id="modal-window">
          <form onSubmit={handleSubmit}>
            <div className='form-group'>
              <h2>Enter your character details</h2>
              <div id='form-row'>
                <div className='form-group'>
                  <label>Character Name</label>
                  <input
                    id="characterName"
                    name="character"
                    type="text"
                    required
                  />
                </div>

                <div className='form-group'>
                  <label>What is the character's world?</label>
                  <input
                    id="world"
                    name="world"
                    type="text"
                    required
                  />
                </div>
              </div>

              <div className='form-group'>
                <label>Hearts</label>
                <select id="hearts" name="hearts" required>
                  <option value="">Select a Number</option>
                  <option value="3">3</option>
                  <option value="6">6</option>
                  <option value="12">12</option>
                </select>
              </div>

              <div className='form-group'>
                <label>Upload Study PDF</label>
                <input 
                  type="file" 
                  name="studyFile" 
                  accept="application/pdf"
                  required
                />
              </div>
              <button type="submit" className="submit-btn">Start Adventure</button>
            </div>
          </form>
        </dialog>
        <h1>Study RPG</h1>
        <div className='response-container'>
          {history && history.length > 0 && history.map(({role, parts}, index) => (
            role === "user" ? (<p key={index} className='user-prompt'>{parts[0].text}</p>) :
             (<div className='ai-response' key={index}>
                <Markdown remarkPlugins={[remarkGfm]} skipHtml>{parts[0].text || "..."}</Markdown>
              </div>)
          ))}
        </div>
        <div className="prompt-area">
          <textarea
            name="prompt area"
            id="text-prompt-area"
            placeholder="Enter your choice"
            onKeyDown={handleKeyPress}
            value={textValue}
            onChange={(e) => setTextValue(`${e.target.value}`)}
            style={{
              minWidth: '200px',
              minHeight: '30px',
              resize: 'none',
              overflow: 'hidden'
            }}
          />
          <p id='start-text'>the gray boxes are your inputs and the black boxes are the AI responses.</p>
          <div id='scroll-box'></div>
        </div>
      </div>
    </>
  )
}

export default App