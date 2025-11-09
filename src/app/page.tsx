"use client";

import { Suspense } from 'react';
import SmokeyCursor from "@/components/lightswind/smokey-cursor";
import LiquidChrome from '@/components/LiquidChrome';
import SplitText from "@/components/SplitText";
import { Poppins } from 'next/font/google'
import Galaxy from '@/components/Galaxy';
import BlurText from '@/components/BlurText';
import ScrollFloat from '@/components/ScrollFloat';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  display: 'swap', // Better font loading performance
})

const handleAnimationComplete = () => {
  console.log('All letters have animated!');
};

// Loading fallback for the liquid chrome
const ChromeLoader = () => (
  <div className="fixed inset-0 z-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
);

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-30 pointer-events-auto">
        <div className="flex justify-between items-center px-6 sm:px-8 md:px-12">
          <div className={`${poppins.className} text-white text-lg tracking-wider`}>
            VB
          </div>
          
          <div className="hidden md:flex space-x-8">
            <a href="#work" className={`${poppins.className} text-white hover:text-gray-300 transition-colors duration-300 font-medium tracking-wide text-sm`}>
              ABOUT
            </a>
            <a href="#about" className={`${poppins.className} text-white hover:text-gray-300 transition-colors duration-300 font-medium tracking-wide text-sm`}>
              SELECTED WORKS
            </a>
          </div>
          
          <button className={`${poppins.className} text-white hover:text-gray-300 transition-colors duration-300 font-medium tracking-wide text-sm`}>
            LET'S CHAT
          </button>
          
          {/* Mobile menu button */}
          <button className="md:hidden text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Fullscreen interactive background */}
      <Suspense fallback={<ChromeLoader />}>
        <div className="fixed inset-0 z-0">
          <Galaxy 
            mouseRepulsion={true}
            mouseInteraction={true}
            density={1}
            glowIntensity={0.3}
            saturation={0}
            hueShift={140}
            twinkleIntensity={0.3}
            rotationSpeed={0.1}
            repulsionStrength={2}
            autoCenterRepulsion={0}
            starSpeed={0.5}
            transparent={true}
          />
        </div>
      </Suspense>
       
      {/* Hero content */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen pointer-events-none px-4">
        <div className="text-center space-y-6 pointer-events-auto">
          {/* Animated text */}
          <BlurText
            text="Virgil Barcelon"
            delay={150}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className={`${poppins.className} text-white font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl drop-shadow-2xl tracking-tight leading-tight`}
          />
          
          <p className={`
            ${poppins.className}
            text-gray-300
            font-medium
            text-lg sm:text-xl md:text-2xl
            drop-shadow-lg
            tracking-wide
            animate-fade-in-delay
          `}>
            Full-Stack Developer
          </p>
          
          {/* Call to action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 pointer-events-auto justify-center items-center">
            <button className={`
              ${poppins.className}
              px-8 py-3
              bg-white/10 backdrop-blur-sm
              border border-white/20
              text-white font-semibold
              rounded-full
              hover:bg-white/20 hover:scale-105
              transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-white/50
            `}>
              View Projects
            </button>
            
            <button className={`
              ${poppins.className}
              px-8 py-3
              bg-white text-gray-900
              font-semibold
              rounded-full
              hover:bg-gray-100 hover:scale-105
              transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-white/50
            `}>
              Get In Touch
            </button>
          </div>
        </div>
      </section>
      
      {/* <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className={`${poppins.className} text-white font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight`}>
            About Me
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-left">
              <p className={`${poppins.className} text-gray-300 text-lg leading-relaxed`}>
                I'm a passionate full-stack developer with expertise in modern web technologies. 
                I love creating beautiful, interactive experiences that push the boundaries of what's possible on the web.
              </p>
              
              <p className={`${poppins.className} text-gray-300 text-lg leading-relaxed`}>
                With a strong foundation in React, Next.js, and cutting-edge animation libraries, 
                I bring ideas to life through code and creativity.
              </p>
              
              <div className="space-y-4">
                <h3 className={`${poppins.className} text-white font-semibold text-xl`}>
                  Technologies I Work With:
                </h3>
                <div className="flex flex-wrap gap-3">
                  {['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL'].map((tech) => (
                    <span 
                      key={tech}
                      className={`${poppins.className} px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm rounded-full`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="w-64 h-64 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
                <span className={`${poppins.className} text-white text-6xl font-bold`}>VB</span>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Projects Section */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className={`${poppins.className} text-white font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-center mb-16`}>
            Selected Works
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((project) => (
              <div 
                key={project}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
              >
                <div className="aspect-video bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-xl mb-4 flex items-center justify-center">
                  <span className={`${poppins.className} text-white text-2xl font-bold`}>
                    Project {project}
                  </span>
                </div>
                
                <h3 className={`${poppins.className} text-white font-semibold text-xl mb-2`}>
                  Amazing Project {project}
                </h3>
                
                <p className={`${poppins.className} text-gray-300 text-sm leading-relaxed mb-4`}>
                  A brief description of this incredible project that showcases modern web development techniques.
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {['React', 'TypeScript', 'Tailwind'].map((tech) => (
                    <span 
                      key={tech}
                      className={`${poppins.className} px-3 py-1 bg-white/10 text-white text-xs rounded-full`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className={`${poppins.className} text-white font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight mb-8`}>
            Let's Work Together
          </h2>
          
          <p className={`${poppins.className} text-gray-300 text-xl leading-relaxed max-w-2xl mx-auto`}>
            Ready to bring your ideas to life? I'm always excited to work on new projects and collaborate with amazing people.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
            <button className={`
              ${poppins.className}
              px-12 py-4
              bg-white text-gray-900
              font-semibold text-lg
              rounded-full
              hover:bg-gray-100 hover:scale-105
              transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-white/50
            `}>
              Send Message
            </button>
            
            <button className={`
              ${poppins.className}
              px-12 py-4
              bg-white/10 backdrop-blur-sm
              border border-white/20
              text-white font-semibold text-lg
              rounded-full
              hover:bg-white/20 hover:scale-105
              transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-white/50
            `}>
              Download CV
            </button>
          </div>
        </div>
      </section>
      
    </main>
  );
}