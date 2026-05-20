import './StudyRPGPage.css';
import { GoogleGenAI } from "@google/genai";
import { useState, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import EmojiBackground from '../components/EmojiBackground';
import { useLanguage } from '../i18n/useLanguage';

const GEMINI_API_KEY = import.meta.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export default function StudyRPGPage() {
  const { t } = useLanguage();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiError, setAiError] = useState(false);
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
          systemInstruction: t.systemInstruction,
        },
      });

      setHistory(prev => [...prev, { role: "user", parts: promptParts }, { role: "model", parts: [{ text: "" }] }]);

      const chatResponse = await chat.sendMessageStream({ message: promptParts });

      for await (const chunk of chatResponse) {
        setHistory(prev => {
          const newText = prev[prev.length - 1].parts[0].text + chunk.text;
          return [...prev.slice(0, -1), { role: "model", parts: [{ text: newText }] }];
        });
      }
    } catch (error) {
      console.error("error:", error);
      setAiError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    closeModal();
    const elements = e.target.elements;
    const fileInput = elements.studyFile.files[0];

    const message = t.game.startPrompt(
      elements.character.value,
      elements.world.value,
      elements.hearts.value,
    );

    const promptParts = [{ text: message }];
    if (fileInput) {
      const filePart = await fileToGenerativePart(fileInput);
      promptParts.push(filePart);
    }

    await handleStream(promptParts);
  };

  const handleKeyPress = async (choice) => {
    if (!loading) {
      await handleStream([{ text: choice }]);
    }
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    openModal();
  }, []);

  useEffect(() => {
    if (history.length > 0) {
      scrollToBottom();
    }
  }, [history]);

  return (
    <div id="overall">
      <EmojiBackground />
      <dialog ref={modalRef} id="modal-window">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <h2>{t.game.modalTitle}</h2>
            <div id="form-row">
              <div className="form-group">
                <label>{t.game.characterName}</label>
                <input
                  id="characterName"
                  name="character"
                  type="text"
                  required
                />
              </div>

              <div className="form-group">
                <label>{t.game.world}</label>
                <input
                  id="world"
                  name="world"
                  type="text"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>{t.game.hearts}</label>
              <select id="hearts" name="hearts" required>
                <option value="">{t.game.selectHearts}</option>
                <option value="3">3</option>
                <option value="6">6</option>
                <option value="12">12</option>
              </select>
            </div>

            <div className="form-group">
              <label>{t.game.uploadPdf}</label>
              <input
                type="file"
                name="studyFile"
                accept="application/pdf"
                required
              />
            </div>
            <button type="submit" className="submit-btn">{t.game.startAdventure}</button>
          </div>
        </form>
      </dialog>
      <h1>{t.appTitle}</h1>
      <div className="response-container">
        {history && history.length > 0 && history.map(({ role, parts }, index) => (
          role === "user" ? (
            <p key={index} className="user-prompt">{parts[0].text}</p>
          ) : (
            <div className="ai-response" key={index}>
              <Markdown remarkPlugins={[remarkGfm]}>
                {!aiError ? parts[0].text || t.game.loading : t.game.aiError}
              </Markdown>
            </div>
          )
        ))}
      </div>
      <div className="prompt-area">
        <div className="choice-buttons">
          {[`${t.game.first}`, `${t.game.second}`, `${t.game.third}`, `${t.game.fourth}`].map((choice) => (
            <button
              key={choice}
              type="button"
              className="choice-btn"
              onClick={() => handleKeyPress(choice)}
              disabled={loading}
            >
              {choice}
            </button>
          ))}
        </div>
        <p id="start-text">{t.game.helpText}</p>
        <div id="scroll-box"></div>
      </div>
    </div>
  );
}
