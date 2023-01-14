import React from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Login from './components/Login';
import Timeline from './components/Timeline';
import Navbar from './components/Navbar';
import Enroll from './components/Enroll';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <div class="flex flex-col h-screen">
        <Navbar />
        <div className='mb-auto h-10'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/enroll" element={<Enroll />} />
          </Routes>
        </div>
        {/* <Footer /> */}
      </div>
    </BrowserRouter>
  );
}

export default App;
