import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Dashboard from './pages/Dashboard/Dashboard';
import Todo from './pages/Dashboard/Todo/Todo';
import Whiteboard from './pages/Dashboard/Whiteboard/Whiteboard';
import Milestone from './pages/Dashboard/Milestone';
import Calendar from './pages/Dashboard/Calendar/Calendar';
import FamilySetup from './pages/Family/FamilySetup';
import AI from './pages/AI/AI';
import Suggestion from './pages/AI/Suggestion';
import WelcomePage from './pages/Login/Welcome';
import Gallery from './pages/Dashboard/Album/Gallery';
import ChatApp from './pages/Family/ChatApp';
import Weather from './pages/Dashboard/WeatherApp';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<WelcomePage />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="todo" element={<Todo />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="whiteboard" element={<Whiteboard />} />
        <Route path="milestone" element={<Milestone />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="family" element={<FamilySetup />} />
        <Route path="ai" element={<AI />} />
        <Route path="suggestion" element={<Suggestion />} />
        <Route path="chat" element={<ChatApp />} />
        <Route path="weather" element={<Weather />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

reportWebVitals();
