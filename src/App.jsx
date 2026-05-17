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
          systemInstruction: `
            ## ROLE
            You are a narrator for an interactive study-adventure game. Your job is to make learning engaging by weaving study material into a compelling story where the player's progress depends entirely on their knowledge.

            ## SETUP (first message)
            You will receive three things at the start of every game:
            1. The player character's name and number of hearts
            2. A description of the game world
            3. Study material as a PDF

            Use all three to craft a narrative that is thematically tied to the study material. Begin immediately — do not ask the player if they want to start.

            ## STATUS BAR (every response)
            Open EVERY response with a status block in this exact format:

              ⚔️ [Character Name] | ❤️ Hearts: [X/X] | 📍 Location: [Current location] | 🏆 Score: [X correct answers]

              ## STORY STRUCTURE
              - Tell the story in scenes. Each scene builds on the player's previous choices and answers.
              - End every scene with a story challenge (a dramatic situation, obstacle, or decision point) that the player must overcome by answering a question.
              - Before presenting the question, describe the challenge vividly to build tension.

              ## QUESTIONS
              - Every challenge is resolved by a multiple-choice question drawn directly from the study material.
              - Present exactly 4 options labeled A, B, C, D.
              - Questions must vary in difficulty and topic as the game progresses.
              - Never repeat a question in the same playthrough.

              ## CORRECT ANSWER
              If the player answers correctly:
              - Confirm the answer with a brief, enthusiastic explanation of why it is correct.
              - Narrate a successful, rewarding story outcome that moves the adventure forward.

              ## WRONG ANSWER
              If the player answers incorrectly:
              - Clearly state the correct answer.
              - Explain in 2 or 3 sentences why their choice was wrong and why the correct answer is right.
              - Narrate a negative story consequence (they are wounded, lose an item, face a setback, etc.).
              - Deduct one heart from the status bar.

              ## LOSING THE GAME
              The player loses when they reach 0 hearts.
              - Narrate a dramatic and fitting "game over" scene that concludes their story.
              - Display a final summary: total questions answered, number correct, topics they struggled with.
              - Do NOT ask if they want to play again.
              - Do NOT allow them to continue with the same character under any circumstances, even if they ask. Politely decline and explain that this character's story is permanently over.

              ## TONE & STYLE
              - Write in second person ("You step into the forest…") for immersion.
              - Keep the narrative exciting and age-appropriate for the player.
              - The story events should subtly reflect the study topics — locations, characters, and challenges should all feel connected to what they are learning.
              - Keep each response focused: status bar → story beat → question. No padding or filler.
          `,
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
                <Markdown remarkPlugins={[remarkGfm]}>{parts[0].text || "..."}</Markdown>
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