import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

export function TypeScriptIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" {...props}>
      <rect width="24" height="24" rx="4" fill="#3178C6" />
      <path
        d="M14.7 18.5c-.7.4-1.5.6-2.4.6-2.3 0-3.6-1.3-3.6-3.4 0-2.2 1.4-3.5 3.7-3.5.8 0 1.5.2 2.1.5v1.8c-.6-.4-1.2-.6-1.9-.6-1.3 0-2 .7-2 1.8s.7 1.8 2 1.8c.7 0 1.4-.2 2.1-.6v1.6zm4.9-5.7v7.2h-1.9v-7.2h-2.4v-1.6h6.7v1.6h-2.4z"
        fill="#FFFFFF"
        display="none"
      />
      <path
        d="M1.5 1.5h21v21h-21z"
        fill="#3178C6"
      />
      <path
        d="M13.8 17.2c.6.4 1.4.7 2.3.7 1.3 0 2.1-.7 2.1-1.6 0-1-.6-1.5-2.1-2.1-2-.8-3.3-1.8-3.3-3.6 0-2 1.6-3.5 4.1-3.5 1.1 0 2 .3 2.7.7l-.7 1.7c-.6-.4-1.3-.6-2-.6-1.3 0-1.9.7-1.9 1.5 0 .9.6 1.4 2.2 2 2.1.8 3.3 1.9 3.3 3.7 0 2.1-1.6 3.6-4.4 3.6-1.3 0-2.4-.3-3.1-.8l.7-1.7zm-4-8.5v10.3H7.6V8.7H4.2V7.1h9.1v1.6H9.8z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function ReactIcon(props: IconProps) {
  return (
    <svg viewBox="-11.5 -10.23174 23 20.46348" className="w-4 h-4" {...props}>
      <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
      <g stroke="#61DAFB" strokeWidth="1" fill="none">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  );
}

export function ThreeJsIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" {...props}>
      <path d="M20.25 4.5l-8.25 15L3.75 4.5h16.5zm-8.25 3.35L7.38 16.5h9.24L12 7.85z" />
    </svg>
  );
}

export function NextJsIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" {...props}>
      <circle cx="12" cy="12" r="11" fill="#000000" stroke="#FFFFFF" strokeWidth="1.2" />
      <path
        d="M8.5 7.5v9h2.2v-5.2l5.4 5.2h2.4V7.5h-2.2v5.1L10.9 7.5H8.5z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function AngularIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" {...props}>
      <path
        d="M12 2.5L3.5 5.5l1.3 11.2L12 21.5l7.2-4.8 1.3-11.2L12 2.5z"
        fill="#DD0031"
      />
      <path
        d="M12 4.6l5.7 12.8h-2.1l-1.1-2.9h-5l-1.1 2.9H6.3L12 4.6zm-1.8 8.1h3.6L12 7.8l-1.8 4.9z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function TailwindIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="#38BDF8" className="w-4 h-4" {...props}>
      <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z" />
    </svg>
  );
}

export function ViteIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" {...props}>
      <path
        d="M21.7 4.2L12.5 21.6c-.2.4-.8.4-1 0L2.3 4.2c-.3-.5.1-1.1.7-1l9 1.5 9-1.5c.6-.1 1 .5.7 1z"
        fill="url(#vite-grad)"
      />
      <path
        d="M13.2 3.8l-5 9.8 4.2-.6-3 6.8 7.8-11.4-4.2.6.2-5.2z"
        fill="#FFD62E"
      />
      <defs>
        <linearGradient id="vite-grad" x1="2" y1="3" x2="22" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#41D1FF" />
          <stop offset="1" stopColor="#BD34FE" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function WebGLIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" {...props}>
      <path d="M2.5 19.5L12 3l9.5 16.5H2.5z" fill="#990000" />
      <path d="M12 6.8l6.2 10.7H5.8L12 6.8z" fill="#FFFFFF" />
      <path d="M12 9.5l3.8 6.5H8.2L12 9.5z" fill="#990000" />
    </svg>
  );
}

export function DotNetIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" {...props}>
      <circle cx="12" cy="12" r="10.5" fill="#512BD4" />
      <path
        d="M6 15.5V8.5h2.2l2.8 4.2V8.5h1.8v7h-2.1l-2.9-4.3v4.3H6zm8.8-5h2.5v1.6h-2.5v1.8h2.8v1.6H13V8.5h4.6v1.6h-2.8v.4zm3.8 5v-1.6h1.6v1.6h-1.6z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function PythonIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" {...props}>
      <path
        d="M11.9 2c-3.1 0-5.1.7-5.1 2.9v2.1h5.3v.7H4.4C2.3 7.7 2 9.5 2 12.3c0 2.7.9 4.3 2.5 4.6v-2.3c0-2.6 1.8-2.6 3.8-2.6h3.6V9.8c0-2.3 2-2.3 4.2-2.3h1.8c.8-3.4-1.9-5.5-6-5.5zm-1.8 1.7c.5 0 .9.4.9.9 0 .5-.4.9-.9.9-.5 0-.9-.4-.9-.9 0-.5.4-.9.9-.9z"
        fill="#3776AB"
      />
      <path
        d="M12.1 22c3.1 0 5.1-.7 5.1-2.9V17h-5.3v-.7h7.7c2.1 0 2.4-1.8 2.4-4.6 0-2.7-.9-4.3-2.5-4.6v2.3c0 2.6-1.8 2.6-3.8 2.6h-3.6v2.2c0 2.3-2 2.3-4.2 2.3H6.1c-.8 3.4 1.9 5.5 6 5.5zm1.8-1.7c-.5 0-.9-.4-.9-.9 0-.5.4-.9.9-.9.5 0 .9.4.9.9 0 .5-.4.9-.9.9z"
        fill="#FFD43B"
      />
    </svg>
  );
}

export function FastApiIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" {...props}>
      <circle cx="12" cy="12" r="10.5" fill="#059669" />
      <path
        d="M12.5 4.5L6.5 13.5h4.5l-1 6 7-9.5h-4.5z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function NodeJsIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" {...props}>
      <path
        d="M12 2l8.7 5v10L12 22 3.3 17V7L12 2z"
        fill="#5FA04E"
      />
      <path
        d="M12 5.5l5.6 3.2v6.5L12 18.5l-5.6-3.3V8.7L12 5.5z"
        fill="#333333"
      />
      <path
        d="M10 9.5v3.8c0 .8.6 1.4 1.4 1.4s1.4-.6 1.4-1.4v-3.8h1.4v3.8c0 1.6-1.2 2.8-2.8 2.8s-2.8-1.2-2.8-2.8V9.5H10z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function DockerIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="#2496ED" className="w-4 h-4" {...props}>
      <path d="M13.9 8.2h2.2v2.2h-2.2V8.2zm-2.8 0h2.2v2.2h-2.2V8.2zm-2.8 0h2.2v2.2H8.3V8.2zm-2.8 0h2.2v2.2H5.5V8.2zm5.6-2.8h2.2v2.2h-2.2V5.4zm-2.8 0h2.2v2.2H8.3V5.4zm8.4 2.8h2.2v2.2h-2.2V8.2zM23 12.8c-.5-.4-1.4-.5-2.2-.2-.2-.5-.6-1-1.1-1.3l-.8-.5-.5.8c-.3.5-.4 1.1-.3 1.7-.8.5-2.1.5-3.1.2H2.2c-.4 1.8.2 3.8 1.6 5.1 1.6 1.5 3.9 2.2 6.2 2.2 6.5 0 11.8-3.9 13-8.2z" />
    </svg>
  );
}

export function KubernetesIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="#326CE5" className="w-4 h-4" {...props}>
      <path d="M12 2l8.7 5v10L12 22 3.3 17V7L12 2zm0 2.2L5.2 8.4v7.2L12 19.8l6.8-4.2V8.4L12 4.2zm0 3.3a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z" />
    </svg>
  );
}

export function PostgresIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="#4169E1" className="w-4 h-4" {...props}>
      <path d="M12 2C6.5 2 2 6.5 2 12c0 3.2 1.5 6 3.9 7.8.4-.6.8-1.4 1-2.2-.6-.5-1-1.3-1-2.2 0-1.7 1.3-3 3-3 .6 0 1.2.2 1.6.5 1-1.5 2.6-2.5 4.5-2.5 3 0 5.4 2.4 5.4 5.4 0 2.2-1.3 4.1-3.2 4.9.4.9.9 1.6 1.5 2.2 3-1.6 5.1-4.7 5.1-8.4 0-5.5-4.5-10-9.8-10zm-3.1 8.5c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5z" />
    </svg>
  );
}

export function RedisIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="#DC382D" className="w-4 h-4" {...props}>
      <path d="M2.5 8.5L12 4l9.5 4.5-9.5 4.5L2.5 8.5zm0 4.5L12 17.5l9.5-4.5V15L12 19.5 2.5 15V13zm0 4.5L12 22l9.5-4.5V19.5L12 24 2.5 19.5V17.5z" />
    </svg>
  );
}

export function GoogleCloudIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" {...props}>
      <path
        d="M19.4 10.4c-.6-2.7-3-4.6-5.8-4.6-2.1 0-4 1.1-5 2.7-.4-.1-.8-.2-1.2-.2-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5h11.6c2.2 0 4-1.8 4-4 0-2-1.5-3.7-3.6-3.9z"
        fill="#4285F4"
      />
      <circle cx="8" cy="13" r="3" fill="#EA4335" />
      <circle cx="14" cy="9.5" r="3.2" fill="#FBBC05" />
      <circle cx="18" cy="13.5" r="2.8" fill="#34A853" />
    </svg>
  );
}

export function GeminiIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" {...props}>
      <path
        d="M12 2C12 7.5 7.5 12 2 12c5.5 0 10 4.5 10 10 0-5.5 4.5-10 10-10-5.5 0-10-4.5-10-10z"
        fill="url(#gemini-glow)"
      />
      <defs>
        <linearGradient id="gemini-glow" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9B72CF" />
          <stop offset="0.5" stopColor="#5B7CFA" />
          <stop offset="1" stopColor="#2E6CF6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function OpenAiIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="#FFFFFF" className="w-4 h-4" {...props}>
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 8.765a4.476 4.476 0 0 1 2.34-1.974v5.679a.776.776 0 0 0 .388.677l5.842 3.37-2.02 1.168a.076.076 0 0 1-.067 0L4.02 14.89a4.5 4.5 0 0 1-1.68-6.125zm16.597 3.855l-5.833-3.37 2.02-1.163a.076.076 0 0 1 .068 0l4.803 2.795a4.5 4.5 0 0 1-.676 8.105v-5.679a.79.79 0 0 0-.382-.688zm2.01-3.023l-.141-.085-4.773-2.782a.776.776 0 0 0-.785 0L9.409 10.1v-2.33a.076.076 0 0 1 .033-.062l4.84-2.794a4.499 4.499 0 0 1 6.665 4.674zM12 14.218L9.43 12.733 12 11.248l2.57 1.485L12 14.218z" />
    </svg>
  );
}

export function GitIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="#F05032" className="w-4 h-4" {...props}>
      <path d="M21.6 10.9L13.1 2.4c-.6-.6-1.5-.6-2.1 0l-2 2 2.6 2.6c.6-.2 1.3 0 1.8.5.5.5.7 1.2.5 1.8l2.5 2.5c.6-.2 1.3 0 1.8.5.7.7.7 1.8 0 2.5-.7.7-1.8.7-2.5 0-.6-.6-.7-1.4-.4-2.1L12.5 10v4.7c.2.1.4.3.5.5.7.7.7 1.8 0 2.5-.7.7-1.8.7-2.5 0-.7-.7-.7-1.8 0-2.5.2-.2.4-.4.6-.5V9.9c-.2-.1-.4-.3-.6-.5-.6-.6-.7-1.4-.4-2.1L7.5 4.7 2.4 9.8c-.6.6-.6 1.5 0 2.1l8.5 8.5c.6.6 1.5.6 2.1 0l8.5-8.5c.6-.6.6-1.4.1-2z" />
    </svg>
  );
}

export function FigmaIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" {...props}>
      <path d="M8 2h4v5H8c-1.4 0-2.5-1.1-2.5-2.5S6.6 2 8 2z" fill="#F24E1E" />
      <path d="M12 2h4c1.4 0 2.5 1.1 2.5 2.5S17.4 7 16 7h-4V2z" fill="#FF7262" />
      <path d="M12 7h4c1.4 0 2.5 1.1 2.5 2.5S17.4 12 16 12h-4V7z" fill="#1ABCFE" />
      <path d="M8 7h4v5H8c-1.4 0-2.5-1.1-2.5-2.5S6.6 7 8 7z" fill="#A259FF" />
      <path d="M8 12h4v5H8c-1.4 0-2.5-1.1-2.5-2.5S6.6 12 8 12z" fill="#0ACF83" />
    </svg>
  );
}

export function SqlServerIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" {...props}>
      <path
        d="M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3v12c0 1.7-3.6 3-8 3s-8-1.3-8-3V6z"
        fill="#CC292B"
      />
      <ellipse cx="12" cy="6" rx="8" ry="3" fill="#E65355" />
      <path
        d="M4 10c0 1.7 3.6 3 8 3s8-1.3 8-3v2c0 1.7-3.6 3-8 3s-8-1.3-8-3v-2zm0 4c0 1.7 3.6 3 8 3s8-1.3 8-3v2c0 1.7-3.6 3-8 3s-8-1.3-8-3v-2z"
        fill="#AA1C1E"
      />
    </svg>
  );
}

export function SupabaseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" {...props}>
      <path
        d="M13.2 22.8c-.7.9-2.1.4-2.1-.8V13H3.6c-1.3 0-1.9-1.6-.9-2.4L13.5 1.2c.7-.9 2.1-.4 2.1.8V11h7.5c1.3 0 1.9 1.6.9 2.4l-10.8 9.4z"
        fill="#3ECF8E"
      />
    </svg>
  );
}

export function GsapIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" {...props}>
      <circle cx="12" cy="12" r="10.5" fill="#88CE02" />
      <path
        d="M8.5 7.5c-2.2 0-3.5 1.5-3.5 3.5 0 2.2 1.6 3.5 3.8 3.5 1.4 0 2.3-.5 2.9-1.1v-1.8H9v-1.4h4.4v4.2c-1.2 1.1-2.8 1.7-4.7 1.7-3.2 0-5.5-2.2-5.5-5.1 0-2.9 2.1-5.1 5.3-5.1 1.8 0 3.2.6 4.2 1.6l-1.1 1.2c-.8-.8-1.8-1.2-3.1-1.2z"
        fill="#000000"
      />
    </svg>
  );
}

// Map helper to quickly resolve a tech name to its SVG icon
export function getTechIcon(name: string, className = "w-4 h-4") {
  const props = { className };
  switch (name.toLowerCase()) {
    case 'typescript':
      return <TypeScriptIcon {...props} />;
    case 'react':
      return <ReactIcon {...props} />;
    case 'three.js':
      return <ThreeJsIcon {...props} />;
    case 'next.js':
      return <NextJsIcon {...props} />;
    case 'angular':
      return <AngularIcon {...props} />;
    case 'tailwind css':
      return <TailwindIcon {...props} />;
    case 'vite':
      return <ViteIcon {...props} />;
    case 'webgl':
      return <WebGLIcon {...props} />;
    case '.net core':
    case '.net':
      return <DotNetIcon {...props} />;
    case 'fastapi':
      return <FastApiIcon {...props} />;
    case 'node.js':
      return <NodeJsIcon {...props} />;
    case 'python':
      return <PythonIcon {...props} />;
    case 'postgresql':
      return <PostgresIcon {...props} />;
    case 'sql server':
      return <SqlServerIcon {...props} />;
    case 'redis':
      return <RedisIcon {...props} />;
    case 'docker':
      return <DockerIcon {...props} />;
    case 'kubernetes':
      return <KubernetesIcon {...props} />;
    case 'google cloud':
      return <GoogleCloudIcon {...props} />;
    case 'gemini ai':
      return <GeminiIcon {...props} />;
    case 'openai':
      return <OpenAiIcon {...props} />;
    case 'supabase':
      return <SupabaseIcon {...props} />;
    case 'git':
      return <GitIcon {...props} />;
    case 'figma':
      return <FigmaIcon {...props} />;
    case 'gsap':
      return <GsapIcon {...props} />;
    default:
      return null;
  }
}

