import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register";
import Meetings from "./pages/Meetings";
import Chat from "./pages/Chat";
import Calendar from "./pages/Calendar";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      {window.location.pathname !== "/" &&
        window.location.pathname !== "/register" && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/meetings" element={<Meetings />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/chat/:meetingid" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
