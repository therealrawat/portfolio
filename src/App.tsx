import { lazy, Suspense, useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import ValueProp from './components/ValueProp';
import Preloader from './components/Preloader';
import GhostCursor from './components/reactbits/GhostCursor';
import { getCurrentRoute, type PageRoute } from './utils/navigation';
import { getCursorActive, toggleCursorActive } from './utils/cursorState';

const loadAboutMe = () => import('./components/AboutMe');
const loadProjectsPage = () => import('./components/ProjectsPage');
const loadProjects = () => import('./components/Projects');
const loadTechStack = () => import('./components/TechStack');
const loadTestimonials = () => import('./components/Testimonials');
const loadExperience = () => import('./components/Experience');
const loadFooter = () => import('./components/Footer');
const AIAssistant = lazy(() => import('./components/AIAssistant'));

const AboutMe = lazy(loadAboutMe);
const ProjectsPage = lazy(loadProjectsPage);
const Projects = lazy(loadProjects);
const TechStack = lazy(loadTechStack);
const Testimonials = lazy(loadTestimonials);
const Experience = lazy(loadExperience);
const Footer = lazy(loadFooter);

export default function App() {
  const [loading, setLoading] = useState(true);
  const [currentRoute, setCurrentRoute] = useState<PageRoute>(getCurrentRoute);
  const [cursorActive, setCursorActiveState] = useState<boolean>(getCursorActive);

  useEffect(() => {
    const handleCursorSync = () => {
      setCursorActiveState(getCursorActive());
    };
    window.addEventListener('ghost-cursor-changed', handleCursorSync);
    return () => {
      window.removeEventListener('ghost-cursor-changed', handleCursorSync);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const syncRoute = () => {
      setCurrentRoute(getCurrentRoute());
    };

    window.addEventListener('popstate', syncRoute);
    window.addEventListener('app-route-change', syncRoute);

    return () => {
      window.removeEventListener('popstate', syncRoute);
      window.removeEventListener('app-route-change', syncRoute);
    };
  }, []);

  const isAbout = currentRoute === 'about';

  return (
    <div
      className={`min-h-screen relative transition-colors duration-500 ${
        isAbout
          ? 'bg-[#f5f5f7] selection:bg-black/15 selection:text-black text-black'
          : 'bg-[#070709] selection:bg-white/20 selection:text-white text-white'
      }`}
    >
      {/* GhostCursor Smoke Trail from ReactBits */}
      {cursorActive && (
        <GhostCursor
          color="#b497cf"
          theme={isAbout ? 'light' : 'dark'}
          size={75}
          trailLength={45}
          inertia={0.5}
          turbulence={0.45}
          drift={0.25}
          bloomStrength={0.55}
          grainIntensity={0}
          clickPuff={true}
          zIndex={30}
          className="fixed inset-0 pointer-events-none"
        />
      )}

      {/* Preloader */}
      {loading && <Preloader />}

      <Navigation />

      <main className={`transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {currentRoute === 'about' ? (
          <Suspense fallback={null}>
            <AboutMe />
            <Footer theme="light" />
          </Suspense>
        ) : currentRoute === 'projects' ? (
          <Suspense fallback={null}>
            <ProjectsPage />
            <Footer />
          </Suspense>
        ) : (
          <>
            <Hero />
            <ValueProp />
            <Suspense fallback={null}>
              <TechStack />
            </Suspense>
            <Suspense fallback={null}>
              <Experience />
            </Suspense>
            <Suspense fallback={null}>
              <Projects />
            </Suspense>
            <Suspense fallback={null}>
              <Testimonials />
            </Suspense>
            <Suspense fallback={null}>
              <Footer />
            </Suspense>
          </>
        )}
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

      {/* Manual Ghost Cursor Quick-Toggle Pill (Bottom-Left) */}
      {!loading && (
        <div className="fixed bottom-6 left-6 z-40 hidden sm:block pointer-events-auto">
          <button
            onClick={() => toggleCursorActive()}
            title={cursorActive ? 'Disable Ghost Cursor trail' : 'Enable Ghost Cursor trail'}
            className={`group flex items-center gap-2.5 px-3 py-1.5 rounded-xl backdrop-blur-xl border text-xs font-mono transition-all duration-300 shadow-xl cursor-pointer ${
              cursorActive
                ? isAbout
                  ? 'bg-black/90 border-black/30 text-white shadow-[0_4px_20px_rgba(0,0,0,0.15)]'
                  : 'bg-[#0c0c12]/85 border-white/30 text-white hover:border-white/60 shadow-[0_4px_20px_rgba(255,255,255,0.12)]'
                : isAbout
                  ? 'bg-white/90 border-black/10 text-neutral-600 hover:text-black hover:border-black/20'
                  : 'bg-[#0c0c12]/85 border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
            }`}
          >

            <span className="text-[11px] font-medium">Click Me</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                cursorActive
                  ? isAbout ? 'bg-white/20 text-white' : 'bg-white/15 text-white'
                  : isAbout ? 'bg-black/5 text-neutral-600' : 'bg-white/5 text-neutral-500'
              }`}
            >
              {cursorActive ? '-' : '+'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
