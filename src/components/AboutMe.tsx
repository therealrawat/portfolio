import Lanyard from './reactbits/Lanyard';

export default function AboutMe() {
  return (
    <div className="min-h-screen bg-[#070709] text-white relative selection:bg-white/20 selection:text-white">
      {/* Ambient Gradient Glows */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-white/[0.03] blur-[160px] rounded-full z-0" />
      <div className="pointer-events-none absolute bottom-20 right-10 w-[600px] h-[600px] bg-white/[0.02] blur-[180px] rounded-full z-0" />

      {/* Full-screen 3D Lanyard Hero hanging directly from the very top of the screen */}
      <div className="w-full h-screen relative z-10">
        <Lanyard
          frontImage="/card-front.jpeg"
          backImage="/card-back.png"
          strapImage="/strap.png"
          cardColor="#ffffff"
          finish="matte"
          metal="silver"
          orientation="portrait"
          size={0.65}
          strapLength={0.32}
          breeze={0.35}
          elasticity={0.45}
          damping={0.45}
          interactive={true}
          intro={true}
        />
      </div>

      {/* Clean content area ready for your custom story */}
      <div className="max-w-4xl mx-auto px-6 py-20 relative z-10">
        {/* You can write your story content here */}
      </div>
    </div>
  );
}
