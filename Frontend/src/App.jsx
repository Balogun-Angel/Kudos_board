import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import BoardPage from "./Pages/BoardPage";
import './App.css';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/board/:id" element={<BoardPage />} /> 
        {/* <Route path="*" element={<NotFound />} />  */}
      </Routes>
    </Router>
  );
}

export default App;
