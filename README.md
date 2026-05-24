# 📖 Lorebound

**Lorebound**
*Turn your study material into an after class adventure. Your knowledge is your weapon.*

---

## Project Description

### Overview

Lorebound is an AI-powered web application that transforms students' study material into an interactive role-playing game experience. Instead of passively re-reading notes or grinding through flashcards after class, students upload their study PDF, name a character, choose a world, and are immediately dropped into a living narrative — where every question they answer correctly advances their story, and every wrong answer costs them a life and earns them an explanation.

The application is designed for **after-class, single-session studying** — a focused 15–30 minute experience that reinforces what was just learned through active recall wrapped in engaging storytelling.

---

### The Problem

After-class studying is one of the most important and most neglected stages of learning. Students know they *should* review their material, but conventional methods — re-reading notes, Quizlet sets, or static practice tests — offer no motivation, no engagement, and no consequence for wrong answers. The result is passive skimming rather than genuine recall.

The gap Lorebound fills is simple: **students don't avoid studying because the material is hard — they avoid it because it's boring.**

---

### The Solution

Lorebound solves this by combining three proven learning techniques with generative AI:

**1. Active Recall** — Instead of reading, students are challenged with questions directly generated from their own material, forcing genuine memory retrieval.

**2. Consequence-Based Learning** — The Hearts system means wrong answers have a cost. Stakes — even fictional ones — increase engagement and focus.

**3. Immediate Corrective Feedback** — When a student answers incorrectly, the AI doesn't just mark it wrong and move on. It pauses the story, explains the concept clearly, and then continues. The mistake becomes a teaching moment embedded in the narrative.

These three elements are wrapped inside a **Gemini-powered generative narrative** that is unique to every student's character name, chosen world, and study material — making every session feel personal and immersive.

---

### How It Works

```
Student uploads PDF + sets character name & world
        ↓
Gemini reads the PDF and builds a narrative world from the content
        ↓
Story begins — the character enters a world themed around the student's input
        ↓
At key story beats, the AI generates a multiple-choice question from the PDF
        ↓
  Correct answer → story advances, hearts maintained
  Wrong answer   → heart lost + AI explains the concept → story continues
        ↓
Session ends when hearts reach 0 or the material is covered
```

---

### Core Features

#### 🎭 Generative Narrator
Google Gemini acts as a live storyteller. It reads the uploaded PDF and generates a unique narrative world based on the student's character name and world description. No two sessions produce the same story — the AI adapts the setting, tone, and characters to match the student's input.

#### 📄 PDF-to-Quest Integration
The student's study material is the source of truth. Gemini extracts key concepts, definitions, and facts from the uploaded PDF and converts them into multiple-choice challenges that appear organically within the story. There are no pre-written question banks — every question is generated live from the student's actual material.

#### ❤️ Hearts & Consequence System
Students begin with a set number of hearts — their health within the story. Correct answers keep the narrative moving forward. Wrong answers cost a heart and trigger a narrative setback (the character faces a challenge, loses ground, or encounters an obstacle). When all hearts are lost, the adventure ends. This system creates low-stakes but real consequences that keep students alert and engaged.

#### 💬 Real-Time Corrective Explanations
This is the most educationally significant feature. When a student answers incorrectly, the AI does not simply reveal the right answer. It pauses the story and delivers a clear, contextual explanation of why the correct answer is right and what the student misunderstood — using language grounded in the student's own study material. Learning happens at the point of failure.

#### ⚡ Streaming Responses
Gemini's responses are delivered word-by-word in real time, giving the session the feeling of a live storytelling experience rather than a static quiz. This pacing is intentional — it maintains immersion and gives students time to absorb the narrative before each challenge.

---

### Technologies Used

| Layer | Technology |
|---|---|
| AI / LLM | Google Gemini API |
| PDF Processing | Gemini Document Understanding (native PDF input) |
| Streaming | Gemini streaming API |
| Frontend | HTML, CSS, JavaScript, React, Vite |
| Hosting | Netlify |
| Language | Arabic / English bilingual support |

---

### Hackathon Theme Alignment

**Primary Theme: Education Technology**

Lorebound directly addresses one of the most persistent challenges in education — student engagement during self-directed study. It does not replace the classroom or the teacher. It specifically targets the *after-class* window, the period where retention is most at risk and motivation is lowest.

The project demonstrates:
- A meaningful, real-world problem with a clear target user (students at any level)
- An original application of generative AI beyond chatbot use cases
- A functional, working prototype with end-to-end flow
- Accessibility considerations (bilingual support, simple onboarding)
- Scalability potential across subjects, languages, and education levels

---

### Impact

| Metric | Impact |
|---|---|
| Target Users | Students at secondary and university level |
| Use Case | After-class review sessions (15–30 min) |
| Subject Coverage | Any subject with a PDF — fully universal |
| Language Reach | English and Arabic |
| Learning Outcome | Active recall, corrective feedback, engagement |

Every student, regardless of subject or level, has study material in PDF format. Study RPG requires no integration with institutional systems, no teacher setup, and no prior configuration. A student can go from uploading a PDF to answering questions inside their personalized story in under two minutes.

---

### Future Roadmap

While the current version is scoped as a single-session, after-class tool, the architecture supports meaningful expansion:

- **Session summary** — A post-game report showing which questions were missed and which concepts need review
- **Voice narration** — Text-to-speech for the story segments to deepen immersion
- **Multiplayer study mode** — Competing with classmates using the same PDF
- **LMS integration** — Connecting with platforms like Google Classroom or Moodle for direct material import

---

## How to Use

1.  **Enter Character Details:** When the web app loads, provide your character's name and describe the world they live in (e.g., Cyberpunk City, High Fantasy Realm).
2.  **Set Difficulty:** Choose your starting number of "Hearts" (3, 6, or 12).
3.  **Upload Study Material:** Select a PDF file containing the information you need to learn.
4.  **Start Adventure:** Engage with the narrator. When prompted with a multiple-choice question, pick your choice to progress.

## Installation and Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/naif-bin-dair/Lorebound.git
    cd Lorebound
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root directory and add any the necessary configuration
    ```dotenv
    VITE_GEMINI_API_KEY="enter the key here"
    ```

4.  **Run the web app server:**
    ```bash
    npm run dev
    ```

---

### Demo Link

*https://study-rp-g.netlify.app*