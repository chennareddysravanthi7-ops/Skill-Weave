import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "./components/Navbar";
import Chatbot from "./components/Chatbot";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import QuizPage from "./pages/QuizPage";
import MLResultPage from "./pages/MLResultPage";
import LearningContentPage from "./pages/LearningContentPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import StudentLoginPage from "./pages/StudentLoginPage";
import AdminLoginPage from "./pages/AdminLoginPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/result" element={<MLResultPage />} />
          <Route path="/learning" element={<LearningContentPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/student-login" element={<StudentLoginPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
        </Routes>
        <Chatbot />
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
