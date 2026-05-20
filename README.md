# Study RPG

Study RPG is a Gemini-powered adventure game designed to make studying interactive and engaging. the web app transforms your study materials (PDFs) into a dynamic narrative where your knowledge determines your character's fate.

## Features

*   **Generative Narrator:** Uses Google Gemini to craft a unique story based on your character name and world description.
*   **PDF-to-Quest Integration:** Upload any study PDF, and the AI will generate challenges and multiple-choice questions directly from the content.
*   **Health & Consequence System:** Manage your "Hearts." Correct answers advance the plot, while mistakes lead to health loss and narrative setbacks.
*   **Real-time Explanations:** If you answer a question incorrectly, the AI explains the concepts to ensure you learn from your mistakes before the story continues.

## How to Use

1.  **Enter Character Details:** When the web app loads, provide your character's name and describe the world they live in (e.g., Cyberpunk City, High Fantasy Realm).
2.  **Set Difficulty:** Choose your starting number of "Hearts" (3, 6, or 12).
3.  **Upload Study Material:** Select a PDF file containing the information you need to learn.
4.  **Start Adventure:** Engage with the narrator. When prompted with a multiple-choice question, pick your choice to progress.

## Installation and Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/naif-bin-dair/StudyRPG.git
    cd Study-Adventure
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


