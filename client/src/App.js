import React from 'react'
import { Routes, Route, BrowserRouter} from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Login from './components/Login';
import Timeline from './components/Timeline';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
    <Navbar/>
    <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/timeline" element={<Timeline />} />
    </Routes>
    <Footer/>
    </BrowserRouter>
  );
}

export default App;
