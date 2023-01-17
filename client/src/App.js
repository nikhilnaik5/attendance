import React from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Login from './components/Login';
import Timeline from './components/Timeline';
import Navbar from './components/Navbar';
import Enroll from './components/Enroll';
import Footer from './components/Footer';
import Absent from './components/Absent';
import Register from './components/Register';
import Landing from './components/Landing';

function App() {
  return (
    <BrowserRouter>
    <div className='flex flex-col h-screen'>
    <Navbar />
      <div className='mb-auto'>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/enroll" element={<Enroll />} />
        <Route path="/absent" element={<Absent />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      </div>
      <Footer/>
    </div>
    </BrowserRouter>
  );
}

export default App;
