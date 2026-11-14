import { lazy, Suspense, useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import BrandTicker from './components/BrandTicker';
import ValueProp from './components/ValueProp';
import Preloader from './components/Preloader';

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

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Preloader timer for standard editorial mode
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] selection:bg-orange-500/25 text-white">
      {/* 2D Preloader only shown once on initial standard load */}
      {loading && <Preloader />}

      <Navigation />
      <main className={`transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        <Hero />
        <BrandTicker />
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
      </main>

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
    </div>
  );
}
