import { lazy, Suspense, useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import BrandTicker from './components/BrandTicker';
import ValueProp from './components/ValueProp';
import Preloader from './components/Preloader';
import ClickSpark from './components/reactbits/ClickSpark';
import GhostCursor from './components/reactbits/GhostCursor';
import { getCurrentRoute, type PageRoute } from './utils/navigation';

const loadAboutMe = () => import('./components/AboutMe');
const loadProjectsPage = () => import('./components/ProjectsPage');
const loadProjects = () => import('./components/Projects');
const loadProductMindset = () => import('./components/ProductMindset');
const loadTechStack = () => import('./components/TechStack');
const loadTestimonials = () => import('./components/Testimonials');
const loadExperience = () => import('./components/Experience');
const loadFooter = () => import('./components/Footer');
const AIAssistant = lazy(() => import('./components/AIAssistant'));

const AboutMe = lazy(loadAboutMe);
const ProjectsPage = lazy(loadProjectsPage);
const Projects = lazy(loadProjects);
const ProductMindset = lazy(loadProductMindset);
const TechStack = lazy(loadTechStack);
const Testimonials = lazy(loadTestimonials);
const Experience = lazy(loadExperience);
const Footer = lazy(loadFooter);

export default function App() {
  const [loading, setLoading] = useState(true);
  const [currentRoute, setCurrentRoute] = useState<PageRoute>(getCurrentRoute);

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

  return (
    <ClickSpark
      sparkColor={['#8B5CF6', '#FFFFFF', '#C4B5FD', '#A78BFA']}
      sparkSize={9}
      sparkRadius={28}
      sparkCount={9}
      duration={420}
      className="min-h-screen bg-[#070709] selection:bg-violet-600/35 selection:text-white text-white relative"
    >
      {/* GhostCursor Smoke Trail from ReactBits */}
      <GhostCursor
        color="#8B5CF6"
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

      {/* Preloader */}
      {loading && <Preloader />}

      <Navigation />

      <main className={`transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {currentRoute === 'about' ? (
          <Suspense fallback={null}>
            <AboutMe />
            <Footer />
          </Suspense>
        ) : currentRoute === 'projects' ? (
          <Suspense fallback={null}>
            <ProjectsPage />
            <Footer />
          </Suspense>
        ) : (
          <>
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
    </ClickSpark>
  );
}
