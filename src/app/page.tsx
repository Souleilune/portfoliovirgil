"use client";

import { useState, useEffect, useRef } from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

const projects = [
  {
    id: 1,
    year: "2025",
    title: "TechSync",
    description: "A developer collaboration platform for sharing code and ideas.",
    tech: ["React", "Node.js", "Supabase", "Vercel", "Render", "Gemini AI"],
    link: "https://techsync-dev.vercel.app"
  },
  {
    id: 2,
    year: "2025",
    title: "Fluffychoo.co",
    description: "Point of sale system for a micro bakery shop.",
    tech: ["Next.js", "Tailwind CSS", "Supabase", "Vercel"],
    link: "fluffychoo.vercel.app"
  },
  {
    id: 3,
    year: "2025",
    title: "Beware",
    description: "Corruption awareness platform for the Philippines.",
    tech: ["Next.js", "Tailwind CSS", "Supabase", "Vercel", "Gemini AI"],
    link: "bewarebyvirgil.vercel.app"
  },
  {
    id: 4,
    year: "2024",
    title: "SurrealBot",
    description: "Chat Companion as Web Extension",
    tech: ["Javascript", "HTML", "CSS", "Flask", "Python", "ManifestV3", "Ollama"],
    link: "#"
  },
  {
    id: 5,
    year: "2024",
    title: "3Whites",
    description: "Powerlifting mobile application for tracking lifts and progress.",
    tech: ["Kotlin", "Android Studio", "Firebase", "YOLO11n"],
    link: "#"
  }
];

export default function Home() {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const scrollTo = (id: string) => {
    const element = sectionRefs.current[id];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={`${inter.className} bg-white dark:bg-[#0a0a0a] text-black dark:text-white min-h-screen transition-colors duration-300`}>
      {/* Fixed Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-full w-20 flex flex-col items-center justify-between py-12 z-50 border-r border-black/10 dark:border-white/5 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-sm">
        <div className="flex flex-col gap-8">
          <button
            onClick={() => scrollTo('intro')}
            className="text-xs font-medium text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors writing-vertical-rl rotate-180"
          >
            Intro
          </button>
          <button
            onClick={() => scrollTo('work')}
            className="text-xs font-medium text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors writing-vertical-rl rotate-180"
          >
            Work
          </button>
          <button
            onClick={() => scrollTo('about')}
            className="text-xs font-medium text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors writing-vertical-rl rotate-180"
          >
            About
          </button>
          <button
            onClick={toggleTheme}
            className="mt-8 w-10 h-10 rounded-full border border-black/20 dark:border-white/20 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <svg className="w-5 h-5 text-black/60 dark:text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-black/60 dark:text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
        <div className="text-xs text-black/20 dark:text-white/20 font-light">
          VB
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-20">
        {/* Intro Section */}
        <section 
          id="intro"
          ref={(el) => { sectionRefs.current['intro'] = el; }}
          className="min-h-screen flex items-center justify-center px-12 py-32"
        >
          <div className="max-w-4xl">
            <div className="mb-8">
              <span className="text-sm text-black/40 dark:text-white/40 font-light tracking-wider uppercase">
                Full-Stack Developer
              </span>
            </div>
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-light leading-[0.9] mb-12 tracking-tight">
              Virgil
              <br />
              <span className="text-black/60 dark:text-white/60">Barcelon</span>
            </h1>
            <p className="text-xl text-black/60 dark:text-white/60 font-light max-w-2xl leading-relaxed">
              I craft digital stories and life experiences in Medium and documenting my Machine Learning journey. 
              Specializing in modern web applications and creative technical solutions.
            </p>
            <div className="mt-16 flex gap-6">
              <a 
                href="#work"
                onClick={(e) => { e.preventDefault(); scrollTo('work'); }}
                className="text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors border-b border-black/20 dark:border-white/20 hover:border-black/40 dark:hover:border-white/40 pb-1"
              >
                View Work →
              </a>
              <a 
                href="#contact"
                onClick={(e) => { e.preventDefault(); scrollTo('about'); }}
                className="text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors border-b border-black/20 dark:border-white/20 hover:border-black/40 dark:hover:border-white/40 pb-1"
              >
                Get in Touch →
              </a>
            </div>
          </div>
        </section>

        {/* Work Section */}
        <section 
          id="work"
          ref={(el) => { sectionRefs.current['work'] = el; }}
          className="min-h-screen py-32 px-12"
        >
          <div className="max-w-6xl mx-auto">
            <div className="mb-24">
              <h2 className="text-5xl md:text-6xl font-light mb-4">Selected Work</h2>
              <div className="w-24 h-px bg-black/20 dark:bg-white/20"></div>
            </div>

            <div className="space-y-1">
              {projects.map((project, index) => {
                const handleClick = () => {
                  if (project.link && project.link !== '#') {
                    const url = project.link.startsWith('http') 
                      ? project.link 
                      : `https://${project.link}`;
                    window.open(url, '_blank', 'noopener,noreferrer');
                  }
                };

                return (
                <div
                  key={project.id}
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                  onClick={handleClick}
                  className="group relative border-b border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20 transition-all duration-500 py-8 cursor-pointer"
                >
                  <div className="flex items-start gap-12">
                    <div className="w-20 text-sm text-black/30 dark:text-white/30 font-light">
                      {project.year}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl md:text-4xl font-light mb-3 group-hover:text-black/80 dark:group-hover:text-white/80 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-black/50 dark:text-white/50 text-lg font-light mb-4 max-w-2xl leading-relaxed">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {project.tech.map((tech) => (
                          <span
                            key={tech}
                            className="text-xs text-black/30 dark:text-white/30 font-light px-3 py-1 border border-black/10 dark:border-white/10 rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="w-12 flex items-center justify-center">
                      <div className={`w-8 h-8 rounded-full border border-black/20 dark:border-white/20 flex items-center justify-center transition-all duration-500 ${
                        hoveredProject === project.id ? 'bg-black/5 dark:bg-white/10 scale-110' : ''
                      }`}>
                        <svg 
                          className="w-4 h-4 text-black/40 dark:text-white/40" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover indicator line */}
                  <div 
                    className={`absolute left-0 top-0 h-full w-px bg-black/20 dark:bg-white/20 transition-all duration-500 ${
                      hoveredProject === project.id ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section 
          id="about"
          ref={(el) => { sectionRefs.current['about'] = el; }}
          className="min-h-screen py-32 px-12 flex items-center"
        >
          <div className="max-w-4xl mx-auto">
            <div className="mb-16">
              <h2 className="text-5xl md:text-6xl font-light mb-4">About</h2>
              <div className="w-24 h-px bg-black/20 dark:bg-white/20"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-16">
              <div>
                <p className="text-lg text-black/60 dark:text-white/60 font-light leading-relaxed mb-8">
                  I&apos;m partially a full-stack developer passionate about creating clever digital experiences 
                  With medium expertise in static and dynamic modern web technologies, I bring ideas either to life or lifeless 
                  through clean code or absurd prompts.
                </p>
                <p className="text-lg text-black/60 dark:text-white/60 font-light leading-relaxed">
                  Every project is an opportunity to solve interesting problems and push the 
                  boundaries of what&apos;s possible on the web. I believe in writing in general as I write in Medium 
                  and this also includes proper documentation in each codebase.
                </p>
              </div>
              
              <div>
                <h3 className="text-sm text-black/40 dark:text-white/40 font-medium mb-6 uppercase tracking-wider">
                  Skills & Technologies
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-black/30 dark:text-white/30 mb-2 font-light">Frontend</p>
                    <p className="text-black/60 dark:text-white/60 font-light">React, Next.js, TypeScript, Tailwind CSS</p>
                  </div>
                  <div>
                    <p className="text-sm text-black/30 dark:text-white/30 mb-2 font-light">Backend</p>
                    <p className="text-black/60 dark:text-white/60 font-light">Node.js, PostgreSQL, REST APIs, Express.js</p>
                  </div>
                  <div>
                    <p className="text-sm text-black/30 dark:text-white/30 mb-2 font-light">Tools</p>
                    <p className="text-black/60 dark:text-white/60 font-light">Git, CI/CD, RoboFlow, Gemini AI, Jupyter Notebook, Google Colab</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16 pt-16 border-t border-black/5 dark:border-white/5">
              <div className="flex gap-8">
                <a 
                  href="mailto:virgildelacruz15@gmail.com"
                  className="text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors border-b border-black/20 dark:border-white/20 hover:border-black/40 dark:hover:border-white/40 pb-1"
                >
                  Email
                </a>
                <a 
                  href="https://www.linkedin.com/in/virgil-barcelon-066a42312"
                  className="text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors border-b border-black/20 dark:border-white/20 hover:border-black/40 dark:hover:border-white/40 pb-1"
                >
                  LinkedIn
                </a>
                <a 
                  href="https://github.com/Souleilune"
                  className="text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors border-b border-black/20 dark:border-white/20 hover:border-black/40 dark:hover:border-white/40 pb-1"
                >
                  GitHub
                </a>
                <a 
                  href="#"
                  className="text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors border-b border-black/20 dark:border-white/20 hover:border-black/40 dark:hover:border-white/40 pb-1"
                >
                  Resume
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-12 border-t border-black/5 dark:border-white/5">
          <div className="max-w-6xl mx-auto flex justify-between items-center text-sm text-black/30 dark:text-white/30 font-light">
            <span>© {new Date().getFullYear()} Virgil Barcelon</span>
            <span>Built with Next.js & Tailwind CSS</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
