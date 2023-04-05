import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Dashboard from './pages/Dashboard/Dashboard';
import Todo from './pages/Dashboard/Todo';
import Whiteboard from './pages/Dashboard/Whiteboard';
import Milestone from './pages/Dashboard/Milestone';
import Album from './pages/Dashboard/Album/Album';
import Calendar from './pages/Dashboard/Calendar';
import Financial from './pages/Dashboard/Financial';
import FamilyMemberForm from './pages/Family/Family';
import SmartInput from './pages/AI/SmartInput';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Dashboard />} />
      </Route>
      <Route path="todo" element={<Todo />} />
      <Route path="album" element={<Album />} />
      <Route path="whiteboard" element={<Whiteboard />} />
      <Route path="milestone" element={<Milestone />} />
      <Route path="calendar" element={<Calendar />} />
      <Route path="financial" element={<Financial />} />
      <Route path="family" element={<FamilyMemberForm />} />
      <Route path="ai" element={<SmartInput />} />
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
