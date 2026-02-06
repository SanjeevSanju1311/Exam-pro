# ExamPro - Professional Assessment Platform

ExamPro is a modern, comprehensive web-based examination and assessment platform designed to streamline the testing process for both teachers and students. Built with **React 19**, **TypeScript**, and **Vite**, it offers a fast, responsive, and secure environment for conducting online exams.

## 🚀 Key Features

### 👨‍🏫 For Teachers
*   **Intuitive Dashboard**: Centralized hub to manage exams and view reports.
*   **Exam Creation Suite**: 
    *   Create detailed exams with custom titles, descriptions, and schedules.
    *   Set strict durations and start times.
    *   **Question Bank**: Add multiple-choice questions (MCQs) with flexible scoring (positive and negative marking).
    *   Configure 4 options per question with a simple radio–button selection for the correct answer.
*   **Advanced Analytics**:
    *   **Performance Overview**: View average scores, pass/fail ratios, and attendance.
    *   **Visual Charts**: Bar charts for question difficulty analysis and Pie charts for results distribution.
    *   **Time Analysis**: Track average completion time, fastest/slowest submissions.
    *   **Insight Highlights**: Automatically identify the "Most Answered Correctly" and "Critical Learning Gap" questions.
    *   **Individual Reports**: Detailed table view of every student's score, rank, and status.

### 👨‍🎓 For Students
*   **Student Dashboard**: View available exams and past attempts.
*   **Exam Interface**:
    *   Distraction-free exam taking environment.
    *   Real-time timer countdown.
    *   Question navigation palette.
*   **Assessment History**: content review of past performance.

### 🛡️ Security & Proctoring
*   **Tab Switch Detection**: The system monitors and logs if a student switches tabs during the exam, flagging potential academic dishonesty in the analytics report.

## 🛠️ Technology Stack

*   **Frontend**: React 19 (Hooks, Context), TypeScript
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS
*   **Icons**: Lucide React
*   **Charts**: Recharts
*   **State/Storage**: LocalStorage (for persistence in this demo version)

## � Project Structure

```bash
exampro/
├── src/
│   ├── components/
│   │   └── Navbar.tsx       # Navigation bar
│   ├── views/
│   │   ├── Login.tsx        # Authentication page
│   │   ├── TeacherDashboard.tsx
│   │   ├── StudentDashboard.tsx
│   │   ├── ExamCreator.tsx  # Exam creation interface
│   │   ├── ExamTaker.tsx    # Student exam interface
│   │   └── TeacherAnalytics.tsx
│   ├── App.tsx              # Main routing & state
│   ├── types.ts             # TypeScript standard interfaces
│   └── storage.ts           # Local persistence helper
├── public/
├── index.html
└── package.json
```

## �📦 Installation & Setup

Follow these steps to set up the project locally.

### Prerequisites
*   Node.js (v16 or higher)
*   npm or yarn

### Steps

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/exampro.git
    cd exampro
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env.local` file in the root directory. You can use the example below:
    ```env
    gemini_api_key=YOUR_API_KEY_HERE
    ```
    *(Note: Currently prepared for future AI integration)*

4.  **Run the Development Server**
    ```bash
    npm run dev
    ```

5.  **Open in Browser**
    Navigate to `http://localhost:5173` to view the application.

## 🖥️ Usage Guide

### Logging In
The application uses a simulated login system for demonstration:
*   **Teacher Role**: Select 'Teacher', enter your name.
*   **Student Role**: Select 'Student', enter your name and Roll Number.

### Creating an Exam (Teacher)
1.  Log in as a Teacher.
2.  Click **"Create New Exam"**.
3.  Fill in the Exam Details (Title, Schedule, Duration).
4.  Add Questions (Text, Options, Marks, Negative Marking).
5.  Click **"Publish Examination"**.

### Taking an Exam (Student)
1.  Log in as a Student.
2.  Select an exam from the "Available Exams" list.
3.  Complete the questions within the time limit.
4.  Submit to view your immediate score (if configured).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Credits

**Designed and Developed by [Sanjeev]**
