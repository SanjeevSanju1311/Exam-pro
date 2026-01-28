# Exam Pro - Professional Assessment Platform

Exam Pro is a modern, responsive web application designed to streamline the examination and assessment process. It provides distinct interfaces for Teachers and Students, facilitating seamless exam creation, participation, and performance analysis.

## 🚀 Features

### For Teachers
- **Dashboard**: Overview of recent activities and quick actions.
- **Exam Creation**: Intuitive interface to create exams with multiple question types.
- **Analytics**: visualized performance data using charts (powered by Recharts) to track student progress.

### For Students
- **Dashboard**: View available exams and past attempts.
- **Exam Interface**: Distraction-free environment for taking exams.
- **Results**: Instant feedback and detailed attempt history.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: React Hooks & Local Storage

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SanjeevSanju1311/Exam-pro.git
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key.

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 📝 Usage

- **Login**: The app uses a simulation login (since it uses LocalStorage).
- **Teacher Role**: Login as a teacher to create content.
- **Student Role**: Login as a student to take exams.
