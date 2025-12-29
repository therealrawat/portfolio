import Navigation from './components/Navigation';
import Hero from './components/Hero';
import ValueProp from './components/ValueProp';
import Projects from './components/Projects';
import ProductMindset from './components/ProductMindsset';
import TechStack from './components/TechStack';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navigation />
      <Hero />
      <ValueProp />
      <Projects />
      <ProductMindset />
      <TechStack />
      <Footer />
      <AIAssistant />
    </div>
  );
}

export default App;
