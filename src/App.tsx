import Navigation from './components/Navigation';
import Hero from './components/Hero';
import ValueProp from './components/ValueProp';
import Projects from './components/Projects';
import ProductMindset from './components/ProductMindset';
import TechStack from './components/TechStack';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';
import Experience from './components/Experience';
import Preloader from './components/Preloader';
import { useEffect, useState } from 'react';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Match this with the Preloader timer + transition
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] selection:bg-white/10">
      <Preloader />
      
      <main className={`transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        <Navigation />
        <Hero />
        <ValueProp />
        <Projects />
        <ProductMindset />
        <TechStack />
        <Experience />
        <Footer />
        <AIAssistant />
      </main>
    </div>
  );
}

export default App;
