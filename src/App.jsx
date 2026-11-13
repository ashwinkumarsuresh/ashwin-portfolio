import React, { lazy, Suspense, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SelectedWork from './components/SelectedWork';
import DigitalTwinCaseStudy from './components/DigitalTwinCaseStudy';
import Experience from './components/Experience';
import Footer from './components/Footer';
import ChatLauncher from './components/ChatLauncher';

// /atlas is its own page; it loads on demand so the map data and d3-geo stay
// out of the home page bundle. Firebase Hosting already rewrites every path to
// index.html, so no router is needed for one extra page.
const AtlasPage = lazy(() => import('./pages/AtlasPage'));
const isAtlasPath = (pathname) => /^\/atlas\/?$/.test(pathname);

function App() {
  const onAtlas = isAtlasPath(window.location.pathname);

  // Coming back from /atlas to /#section: the sections render after the
  // browser's own fragment scroll, so scroll once they exist.
  useEffect(() => {
    if (onAtlas || !window.location.hash) return;
    const el = document.getElementById(window.location.hash.slice(1));
    if (el) el.scrollIntoView();
  }, [onAtlas]);

  return (
    <div className="bg-paper min-h-screen text-ink">
      <Navbar />
      <main>
        {onAtlas ? (
          <Suspense fallback={<div className="min-h-screen" />}>
            <AtlasPage />
          </Suspense>
        ) : (
          <>
            <Hero />
            <SelectedWork />
            <DigitalTwinCaseStudy />
            <Experience />
          </>
        )}
      </main>
      <Footer />
      <ChatLauncher />
    </div>
  );
}

export default App;
