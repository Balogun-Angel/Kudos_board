import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import BoardPage from "./Pages/BoardPage";
import './App.css';

function App() {
  const [darkMode, setDarkMode]=useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if(darkMode){
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    }else{
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");

    }
  }, [darkMode]);
  return (
    <div className={darkMode ? "dark" : "light"}>
    <Router>
      <Routes>
        <Route path="/" element={<Home  darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/board/:id" element={<BoardPage darkMode={darkMode} setDarkMode={setDarkMode} />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
