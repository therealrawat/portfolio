import Navigation from './components/Navigation';
import Hero from './components/Hero';
import ValueProp from './components/ValueProp';
import Preloader from './components/Preloader';
import { lazy, Suspense, useEffect, useState } from 'react';

const loadProjects = () => import('./components/Projects');
const loadProductMindset = () => import('./components/ProductMindset');
const loadTechStack = () => import('./components/TechStack');
const loadTestimonials = () => import('./components/Testimonials');
const loadExperience = () => import('./components/Experience');
const loadFooter = () => import('./components/Footer');
const AIAssistant = lazy(() => import('./components/AIAssistant'));

const Projects = lazy(loadProjects);
const ProductMindset = lazy(loadProductMindset);
const TechStack = lazy(loadTechStack);
const Testimonials = lazy(loadTestimonials);
const Experience = lazy(loadExperience);
const Footer = lazy(loadFooter);

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
        <Suspense fallback={null}>
          <Projects />
        </Suspense>
        <Suspense fallback={null}>
          <ProductMindset />
        </Suspense>
        <Suspense fallback={null}>
          <TechStack />
        </Suspense>
        <Suspense fallback={null}>
          <Testimonials />
        </Suspense>
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
        {!loading && (
          <Suspense
            fallback={
              <div
                className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-white/5 border border-white/10 pointer-events-none motion-safe:animate-pulse"
                aria-hidden
              />
            }
          >
            <AIAssistant />
          </Suspense>
        )}
      </main>
    </div>
  );
}

export default App;
