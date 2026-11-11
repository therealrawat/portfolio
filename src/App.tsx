import { lazy, Suspense, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import BrandTicker from './components/BrandTicker';
import ValueProp from './components/ValueProp';
import Preloader from './components/Preloader';
import { ViewModeProvider, useViewMode } from './context/ViewModeContext';

const loadProjects = () => import('./components/Projects');
const loadProductMindset = () => import('./components/ProductMindset');
const loadTechStack = () => import('./components/TechStack');
const loadTestimonials = () => import('./components/Testimonials');
const loadExperience = () => import('./components/Experience');
const loadFooter = () => import('./components/Footer');
const AIAssistant = lazy(() => import('./components/AIAssistant'));
const GameWorld = lazy(() => import('./components/game3d/GameWorld'));

const Projects = lazy(loadProjects);
const ProductMindset = lazy(loadProductMindset);
const TechStack = lazy(loadTechStack);
const Testimonials = lazy(loadTestimonials);
const Experience = lazy(loadExperience);
const Footer = lazy(loadFooter);

function MainContent() {
  const { mode } = useViewMode();
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
      {loading && mode === '2d' && <Preloader />}

      <AnimatePresence mode="wait">
        {mode === '3d' ? (
          <motion.div
            key="3d-mode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-screen h-screen overflow-hidden"
          >
            <Suspense
              fallback={
                <div className="w-screen h-screen bg-[#090807] flex flex-col items-center justify-center gap-4 text-white">
                  <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
                    Initializing 3D Executive HQ...
                  </span>
                </div>
              }
            >
              <GameWorld />
            </Suspense>

            {/* AIAssistant available in 3D mode */}
            <Suspense fallback={null}>
              <AIAssistant />
            </Suspense>
          </motion.div>
        ) : (
          <motion.div
            key="2d-mode"
            initial={{ opacity: 0 }}
            animate={{ opacity: loading ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="transition-opacity duration-1000"
          >
            <Navigation />
            <main>
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <ViewModeProvider>
      <MainContent />
    </ViewModeProvider>
  );
}
