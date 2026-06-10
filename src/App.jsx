import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SelectedWork from './components/SelectedWork';
import DigitalTwinCaseStudy from './components/DigitalTwinCaseStudy';
import Experience from './components/Experience';
import Footer from './components/Footer';
import ChatLauncher from './components/ChatLauncher';

function App() {
  return (
    <div className="bg-paper min-h-screen text-ink">
      <Navbar />
      <main>
        <Hero />
        <SelectedWork />
        <DigitalTwinCaseStudy />
        <Experience />
      </main>
      <Footer />
      <ChatLauncher />
    </div>
  );
}

export default App;
