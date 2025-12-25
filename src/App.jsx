import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CoreExpertise from './components/CoreExpertise';
import KeyAchievements from './components/KeyAchievements';
import Experience from './components/Experience';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';

function App() {
  return (
    <div className="bg-slate-900 min-h-screen text-white selection:bg-gold-500/30 selection:text-gold-400">
      <Navbar />
      <main>
        <Hero />
        <CoreExpertise />
        <KeyAchievements />
        <Experience />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}

export default App;
