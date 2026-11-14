export type PageRoute = 'home' | 'about' | 'projects';

export function getCurrentRoute(): PageRoute {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();

  if (path === '/about' || hash === '#about' || hash === '#/about') {
    return 'about';
  }
  if (path === '/projects' || hash === '#projects-page' || hash === '#/projects') {
    return 'projects';
  }
  return 'home';
}

export function navigateTo(route: PageRoute, sectionId?: string) {
  if (typeof window === 'undefined') return;

  if (route === 'about') {
    window.history.pushState({}, '', '/about');
  } else if (route === 'projects') {
    window.history.pushState({}, '', '/projects');
  } else {
    window.history.pushState({}, '', sectionId ? `/#${sectionId}` : '/');
  }

  window.dispatchEvent(new Event('app-route-change'));

  if (route === 'about' || route === 'projects') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (sectionId) {
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 120);
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
