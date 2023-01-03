import React from 'react'
import { Routes, Route, BrowserRouter} from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Login from './components/Login';
import Timeline from './components/Timeline';


function App() {
  return (
    <BrowserRouter>
    <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/timeline" element={<Timeline />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
