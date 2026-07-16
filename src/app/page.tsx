"use client";

import { useState, useEffect, useRef, type MouseEvent } from 'react';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import {
  Building2,
  Calendar,
  CheckCircle2,
  BookOpen,
  ArrowUpRight,
  Mail,
  Github,
} from 'lucide-react';
import TiltedCard from '@/components/TiltedCard';
import SideRays from '@/components/SideRays';

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
    link: "https://techsync-dev.vercel.app",
    image: "/work/techsync.png"
  },
  {
    id: 2,
    year: "2025",
    title: "Fluffychoo.co",
    description: "Point of sale system for a micro bakery shop.",
    tech: ["Next.js", "Tailwind CSS", "Supabase", "Vercel"],
    link: "fluffychoo.vercel.app",
    image: "/work/fluffychoo.png"
  },
  {
    id: 3,
    year: "2025",
    title: "Beware",
    description: "Corruption awareness platform for the Philippines.",
    tech: ["Next.js", "Tailwind CSS", "Supabase", "Vercel", "Gemini AI"],
    link: "bewarebyvirgil.vercel.app",
    image: "/work/beware.png"
  },
  {
    id: 4,
    year: "2024",
    title: "SurrealBot",
    description: "Chat Companion as Web Extension",
    tech: ["Javascript", "HTML", "CSS", "Flask", "Python", "ManifestV3", "Ollama"],
    link: "#",
    image: "/work/surrealbot.png"
  },
  {
    id: 5,
    year: "2024",
    title: "3Whites",
    description: "Powerlifting mobile application for tracking lifts and progress.",
    tech: ["Kotlin", "Android Studio", "Firebase", "YOLO11n"],
    link: "#",
    image: "/work/3whites.png"
  }
];

interface Experience {
  company: string;
  role: string;
  duration: string;
  highlights: string[];
}

const experiences: Experience[] = [
  {
    company: "Think Safe Training, Consultancy and Services Corporation",
    role: "IT Intern",
    duration: "Jan 2026 – Jun 2026",
    highlights: [
      "Created and maintained tracking spreadsheets for laptop cleaning schedules, intern pending tasks, and document monitoring.",
      "Maintained and updated company website content, applying internal brand standards and conducting pre-publish quality checks across web and social media platforms.",
      "Provided direct support to users under time pressure, diagnosing and resolving hardware, software, and connectivity issues with clear, calm communication.",
      "Developed intern guidelines and documentation to standardize processes and improve onboarding efficiency.",
      "Managed digital content and platform presence, coordinating across web, social, and communication tools to ensure consistent, on-brand client-facing output.",
    ],
  },
];

const skillGroups = [
  {
    title: 'Frontend',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
  },
  {
    title: 'Backend',
    skills: ['Node.js', 'PostgreSQL', 'REST APIs', 'Express.js'],
  },
  {
    title: 'Tools & ML',
    skills: ['Git', 'CI/CD', 'RoboFlow', 'Gemini AI', 'Jupyter', 'Colab'],
  },
  {
    title: 'Also into',
    skills: ['Kotlin', 'YOLO', 'Supabase', 'Chrome Extensions'],
  },
];

const marqueeSkills = [
  'React', 'Next.js', 'TypeScript', 'Tailwind', 'Node.js', 'PostgreSQL',
  'Supabase', 'Gemini AI', 'Kotlin', 'YOLO', 'Flask', 'Ollama',
  'Vercel', 'Render', 'Git', 'Firebase', 'Python', 'Android',
];

const aboutStats = [
  { value: '5+', label: 'Projects shipped' },
  { value: '12+', label: 'Tools in rotation' },
  { value: '∞', label: 'Late-night deploys' },
  { value: 'PH', label: 'Based in' },
];

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isThemeAnimating, setIsThemeAnimating] = useState(false);
  // ── Reading progress ──
  const [readingProgress, setReadingProgress] = useState(0);
  const [isInWritingSection, setIsInWritingSection] = useState(false);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const aboutRef = useRef<HTMLElement | null>(null);

  // ── About section mouse parallax ──
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const blob1X = useTransform(springX, [0, 1], [-40, 40]);
  const blob1Y = useTransform(springY, [0, 1], [-30, 30]);
  const blob2X = useTransform(springX, [0, 1], [50, -50]);
  const blob2Y = useTransform(springY, [0, 1], [40, -40]);
  const blob3X = useTransform(springX, [0, 1], [-25, 25]);
  const blob3Y = useTransform(springY, [0, 1], [35, -35]);

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
      const currentScrollY = window.scrollY;

      // ── Reading progress: scoped to Writing section ──
      const writingEl = sectionRefs.current['writing'];
      if (writingEl) {
        const { top, height } = writingEl.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Section is considered "active" once its top enters the viewport
        // and until its bottom leaves
        const sectionTop = currentScrollY + top;
        const sectionBottom = sectionTop + height;
        const scrollStart = sectionTop - windowHeight;
        const scrollEnd = sectionBottom - windowHeight;

        if (currentScrollY >= scrollStart && currentScrollY <= scrollEnd) {
          setIsInWritingSection(true);
          const progress = Math.min(
            100,
            Math.max(
              0,
              ((currentScrollY - scrollStart) / (scrollEnd - scrollStart)) * 100
            )
          );
          setReadingProgress(progress);
        } else {
          setIsInWritingSection(false);
          setReadingProgress(currentScrollY < scrollStart ? 0 : 100);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsThemeAnimating(true);
    // Delay theme change to allow smooth transition
    setTimeout(() => {
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
    }, 300); // Change theme at midpoint of animation
    setTimeout(() => setIsThemeAnimating(false), 600);
  };

  const scrollTo = (id: string) => {
    const element = sectionRefs.current[id];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleAboutMouseMove = (e: MouseEvent<HTMLElement>) => {
    const el = aboutRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <div className={`${inter.className} bg-white dark:bg-[#0a0a0a] text-black dark:text-white min-h-screen transition-colors duration-300`}>

      {/* ── Reading progress bar ── */}
      <div
        className="reading-progress-bar"
        style={{
          width: `${readingProgress}%`,
          opacity: isInWritingSection ? 1 : 0,
        }}
        aria-hidden="true"
      />

      {/* Floating Top Navigation Bar */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] sm:w-auto sm:min-w-[400px] max-w-2xl">
        <div className="flex items-center gap-10 sm:gap-16 px-2 sm:px-3 py-1.5 sm:py-2 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-1 sm:gap-3 flex-1 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => scrollTo('intro')}
              className="text-xs sm:text-sm font-medium text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-all duration-200 px-3 sm:px-4 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 whitespace-nowrap"
            >
              Intro
            </button>
            <button
              onClick={() => scrollTo('work')}
              className="text-xs sm:text-sm font-medium text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-all duration-200 px-3 sm:px-4 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 whitespace-nowrap"
            >
              Work
            </button>
            <button
              onClick={() => scrollTo('writing')}
              className="text-xs sm:text-sm font-medium text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-all duration-200 px-3 sm:px-4 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 whitespace-nowrap"
            >
              Experience
            </button>
            <button
              onClick={() => scrollTo('about')}
              className="text-xs sm:text-sm font-medium text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-all duration-200 px-3 sm:px-4 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 whitespace-nowrap"
            >
              About
            </button>
          </div>
          <button
            onClick={toggleTheme}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-black/20 dark:border-white/20 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 hover:scale-110 active:scale-95 transition-all duration-300 flex-shrink-0 relative ${isThemeAnimating ? 'animate-spin-once' : ''}`}
            aria-label="Toggle theme"
          >
            <div className="relative w-4 h-4 sm:w-5 sm:h-5">
              {/* Sun Icon */}
              <svg 
                className={`absolute inset-0 w-full h-full text-black/60 dark:text-white/60 transition-opacity duration-300 ${theme === 'dark' ? 'opacity-0' : 'opacity-100'}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              {/* Moon Icon */}
              <svg 
                className={`absolute inset-0 w-full h-full text-black/60 dark:text-white/60 transition-opacity duration-300 ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </div>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {/* Intro Section */}
        <section 
          id="intro"
          ref={(el) => { sectionRefs.current['intro'] = el; }}
          className="relative hero-grain min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-12 pt-6 sm:pt-16 pb-20 sm:pb-32"
        >
          {/* Ambient light rays — dark mode only */}
          <div className="hidden dark:block absolute inset-0 overflow-hidden">
            <SideRays
              speed={2.5}
              rayColor1="#ffffff"
              rayColor2="#9ca3af"
              intensity={2}
              spread={2}
              origin="top-right"
              tilt={0}
              saturation={1.5}
              blend={0.75}
              falloff={1.6}
              opacity={1}
            />
          </div>

          <div className="max-w-4xl w-full text-center">
            <div className="mb-6 sm:mb-8">
              <span className="text-xs sm:text-sm text-black/40 dark:text-white/40 font-light tracking-wider uppercase">
                Full-Stack Developer
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light leading-[0.9] mb-8 sm:mb-12 tracking-tight">
              Virgil <span className="text-black/60 dark:text-white/60">Barcelon</span>
              <br />
              
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-black/60 dark:text-white/60 font-light max-w-2xl mx-auto leading-relaxed">
              I craft digital stories, project experiences, and documenting my Machine Learning journey. 
              Specializing in modern web applications and creative technical solutions.
            </p>
            <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
              <a 
                href="#work"
                onClick={(e) => { e.preventDefault(); scrollTo('work'); }}
                className="text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors border-b border-black/20 dark:border-white/20 hover:border-black/40 dark:hover:border-white/40 pb-1"
              >
                View Work →
              </a>
              <a 
                href="#writing"
                onClick={(e) => { e.preventDefault(); scrollTo('writing'); }}
                className="text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors border-b border-black/20 dark:border-white/20 hover:border-black/40 dark:hover:border-white/40 pb-1"
              >
                View Experience →
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
          className="min-h-screen pt-12 pb-20 sm:py-32 px-4 sm:px-6 md:px-12"
        >
          <div className="max-w-6xl mx-auto">
            <div className="mb-12 sm:mb-16 md:mb-24">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-4">Selected Work</h2>
              <div className="w-16 sm:w-24 h-px bg-black/20 dark:bg-white/20"></div>
            </div>

            {/* Project Collage */}
            <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[220px] sm:auto-rows-[260px] gap-4 sm:gap-5">
              {projects.map((project, index) => {
                const projectUrl = project.link && project.link !== '#'
                  ? project.link.startsWith('http')
                    ? project.link
                    : `https://${project.link}`
                  : null;
                const tileClasses = [
                  'md:col-span-7 md:row-span-2',
                  'md:col-span-5',
                  'md:col-span-5',
                  'md:col-span-6',
                  'md:col-span-6',
                ];

                return (
                  <a
                    key={project.id}
                    href={projectUrl || undefined}
                    target={projectUrl ? '_blank' : undefined}
                    rel={projectUrl ? 'noopener noreferrer' : undefined}
                    aria-disabled={!projectUrl}
                    className={`group relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-black/30 dark:hover:border-white/30 hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-white/5 ${tileClasses[index]}`}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.08),transparent_38%),linear-gradient(135deg,rgba(255,255,255,0.92),rgba(0,0,0,0.04))] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_38%),linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.01))]" />

                    {project.image ? (
                      <div className="absolute inset-x-4 top-4 bottom-24 overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0a0a0a] shadow-xl">
                        <Image
                          src={project.image}
                          alt={`${project.title} frontpage preview`}
                          fill
                          sizes="(min-width: 768px) 50vw, 100vw"
                          className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 dark:from-black/40 transition-opacity duration-500 group-hover:opacity-0" />

                        {/* Hover reveal: stack over preview */}
                        <div
                          className="absolute inset-0 z-10 flex flex-col justify-end p-3 sm:p-4 opacity-0 translate-y-2 pointer-events-none transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0 [@media(hover:none)]:opacity-100 [@media(hover:none)]:translate-y-0"
                          aria-hidden="true"
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100" />
                          <div className="relative">
                            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-white/55 font-light mb-2">
                              Stack
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {project.tech.map((tech) => (
                                <span
                                  key={tech}
                                  className="text-[10px] sm:text-xs px-2 py-1 rounded-md border border-white/20 bg-white/10 text-white/90 font-light backdrop-blur-sm"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-x-4 top-4 bottom-24 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-black/15 dark:border-white/15 bg-black/[0.03] dark:bg-white/[0.04] px-4">
                        <span className="text-sm text-black/35 dark:text-white/35 font-light">Preview coming soon</span>
                        <div className="flex flex-wrap justify-center gap-1.5">
                          {project.tech.map((tech) => (
                            <span
                              key={tech}
                              className="text-[10px] px-2 py-1 rounded-md border border-black/10 dark:border-white/10 text-black/45 dark:text-white/45 font-light"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6 bg-gradient-to-t from-white via-white/95 to-white/0 dark:from-[#0a0a0a] dark:via-[#0a0a0a]/95 dark:to-[#0a0a0a]/0">
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <h3 className="text-2xl sm:text-3xl font-light group-hover:text-black/75 dark:group-hover:text-white/75 transition-colors">
                            {project.title}
                          </h3>
                          <p className="mt-2 text-sm text-black/50 dark:text-white/50 font-light line-clamp-2">
                            {project.description}
                          </p>
                          <div className="mt-2 text-xs text-black/40 dark:text-white/40 font-light">
                            {project.year}
                          </div>
                        </div>
                        <div className="hidden sm:flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-black/15 dark:border-white/15 bg-white/70 dark:bg-white/[0.04] transition-all duration-500 group-hover:scale-110 group-hover:bg-black/5 dark:group-hover:bg-white/10">
                          <svg
                            className="h-5 w-5 text-black/45 dark:text-white/45"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M17 7H8M17 7v9" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section 
          id="writing"
          ref={(el) => { sectionRefs.current['writing'] = el; }}
          className="min-h-screen pt-12 pb-20 sm:py-32 px-4 sm:px-6 md:px-12"
        >
          <div className="max-w-6xl mx-auto">
            <div className="mb-12 sm:mb-16 md:mb-24">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-4">Experience</h2>
              <div className="w-16 sm:w-24 h-px bg-black/20 dark:bg-white/20 mb-4"></div>
              <p className="text-sm sm:text-base text-black/50 dark:text-white/50 font-light">
                Where I&apos;ve worked and what I&apos;ve built
              </p>
            </div>

            {/* Fishbone timeline */}
            <div className="relative">
              {/* Spine */}
              <div
                className="absolute left-4 sm:left-1/2 top-2 bottom-2 w-px bg-black/10 dark:bg-white/10 sm:-translate-x-1/2"
                aria-hidden="true"
              />

              <div className="space-y-16 sm:space-y-20">
                {experiences.map((exp, index) => {
                  const isRight = index % 2 === 1;

                  return (
                    <div key={index} className="relative">
                      {/* Node on spine */}
                      <span
                        className="absolute left-4 sm:left-1/2 top-2 w-3 h-3 -translate-x-1/2 rounded-full bg-white dark:bg-[#0a0a0a] border-2 border-black/50 dark:border-white/50 z-10"
                        aria-hidden="true"
                      />

                      {/* Rib connecting spine to card — desktop only */}
                      <span
                        className={`hidden sm:block absolute top-[14px] h-px bg-black/15 dark:bg-white/15 w-10 md:w-14 ${
                          isRight ? 'left-1/2' : 'right-1/2'
                        }`}
                        aria-hidden="true"
                      />

                      <motion.div
                        initial={{ opacity: 0, x: isRight ? 40 : -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className={`pl-12 sm:pl-0 sm:w-[calc(50%-2.5rem)] md:w-[calc(50%-3.5rem)] ${
                          isRight ? 'sm:ml-auto' : 'sm:mr-auto'
                        } border border-black/10 dark:border-white/10 rounded-2xl p-6 sm:p-8 md:p-10 bg-white/50 dark:bg-[#0a0a0a]/50 hover:border-black/30 dark:hover:border-white/30 transition-colors duration-500`}
                      >
                        <div className="flex flex-col gap-3 mb-6 sm:mb-8">
                          <div>
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-black/40 dark:text-white/40 font-light mb-2 sm:mb-3 uppercase tracking-wider">
                              <Building2 className="w-4 h-4 flex-shrink-0" />
                              <span>{exp.company}</span>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-light">
                              {exp.role}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-black/40 dark:text-white/40 font-light">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            <span>{exp.duration}</span>
                          </div>
                        </div>

                        <ul className="space-y-3 sm:space-y-4">
                          {exp.highlights.map((point, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -16 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true, amount: 0.3 }}
                              transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
                              className="flex items-start gap-3 text-sm sm:text-base text-black/60 dark:text-white/60 font-light leading-relaxed"
                            >
                              <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-black/30 dark:text-white/30" />
                              <span>{point}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section
          id="about"
          ref={(el) => {
            sectionRefs.current['about'] = el;
            aboutRef.current = el;
          }}
          onMouseMove={handleAboutMouseMove}
          className="relative min-h-screen overflow-hidden pt-16 pb-24 sm:py-32 px-4 sm:px-6 md:px-12"
        >
          {/* Parallax ambient blobs */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 sm:w-[28rem] sm:h-[28rem] rounded-full bg-black/[0.04] dark:bg-white/[0.05] blur-3xl"
            style={{ x: blob1X, y: blob1Y }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/3 -right-32 w-80 h-80 sm:w-[32rem] sm:h-[32rem] rounded-full bg-black/[0.03] dark:bg-white/[0.04] blur-3xl"
            style={{ x: blob2X, y: blob2Y }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 left-1/3 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-black/[0.035] dark:bg-white/[0.035] blur-3xl"
            style={{ x: blob3X, y: blob3Y }}
          />

          <div className="relative max-w-6xl mx-auto w-full z-10">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="mb-12 sm:mb-16 md:mb-20"
            >
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight mb-4">
                The dev{' '}
                <span className="text-black/35 dark:text-white/35 italic">behind</span>
                <br className="hidden sm:block" />
                the unusual commits
              </h2>
              <div className="w-16 sm:w-24 h-px bg-black/20 dark:bg-white/20" />
            </motion.div>

            {/* Hero row: photo + bio */}
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center mb-14 sm:mb-20">
              {/* Photo stage */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="lg:col-span-5 relative flex justify-center"
              >
                {/* Floating chips around photo */}
                <motion.span
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-2 left-0 sm:left-4 z-20 text-[10px] sm:text-xs px-3 py-1.5 rounded-full border border-black/15 dark:border-white/15 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md text-black/60 dark:text-white/60 font-light shadow-sm"
                >
                  Full-stack
                </motion.span>
                <motion.span
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute top-16 right-0 sm:right-2 z-20 text-[10px] sm:text-xs px-3 py-1.5 rounded-full border border-black/15 dark:border-white/15 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md text-black/60 dark:text-white/60 font-light shadow-sm"
                >
                  ML curious
                </motion.span>
                <motion.span
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute bottom-10 left-0 sm:left-2 z-20 text-[10px] sm:text-xs px-3 py-1.5 rounded-full border border-black/15 dark:border-white/15 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md text-black/60 dark:text-white/60 font-light shadow-sm"
                >
                  Writes on Medium
                </motion.span>
                <motion.span
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                  className="absolute bottom-2 right-2 sm:right-6 z-20 text-[10px] sm:text-xs px-3 py-1.5 rounded-full border border-black/15 dark:border-white/15 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md text-black/60 dark:text-white/60 font-light shadow-sm"
                >
                  Ships at 2am
                </motion.span>

                <div className="relative z-10">
                  <TiltedCard
                    imageSrc="/dev.jpg"
                    altText="Virgil Barcelon - Full-Stack Developer"
                    captionText="Virgil Barcelon"
                    containerHeight="300px"
                    containerWidth="300px"
                    imageHeight="300px"
                    imageWidth="300px"
                    rotateAmplitude={14}
                    scaleOnHover={1.12}
                    showMobileWarning={false}
                    showTooltip={true}
                    displayOverlayContent={true}
                    overlayContent={
                      <p className="text-white text-sm sm:text-base font-medium px-4 py-2 bg-black/30 rounded-2xl backdrop-blur-md mt-8 ml-4 border border-white/10">
                        hasta la vista
                      </p>
                    }
                  />
                </div>
              </motion.div>

              {/* Bio */}
              <motion.div
                initial={{ opacity: 0, x: 32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
                className="lg:col-span-7 space-y-6"
              >
                <p className="text-xl sm:text-2xl md:text-3xl font-light leading-snug tracking-tight text-black/80 dark:text-white/80">
                  I craft digital stories, ship full-stack apps, and document the chaos of learning machine learning
                  <span className="text-black/40 dark:text-white/40"> preferably with clean code, occasionally with absurd prompts.</span>
                </p>
                <p className="text-base sm:text-lg text-black/55 dark:text-white/55 font-light leading-relaxed">
                  Every project is a chance to solve something interesting and stretch what the web can do.
                  I leave real documentation in codebases, and sometimes treat side projects like
                  crazy inventions.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href="https://medium.com/@virgildelacruz15"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-black/15 dark:border-white/15 bg-black text-white dark:bg-white dark:text-black text-sm font-medium hover:scale-[1.03] active:scale-95 transition-transform"
                  >
                    <BookOpen className="w-4 h-4" />
                    Read my writing
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                  <a
                    href="mailto:virgildelacruz15@gmail.com"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-black/15 dark:border-white/15 text-sm font-light text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:border-black/30 dark:hover:border-white/30 transition-colors"
                  >
                    Say hello
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Stats — single panel, index + value (no icon cards) */}
            <div className="mb-14 sm:mb-20 rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden">
              <div className="grid grid-cols-2 lg:grid-cols-4">
                {aboutStats.map((stat, i) => (
                  <div
                    key={stat.label}
                    className={`relative px-5 py-7 sm:px-7 sm:py-9 ${
                      i % 2 === 1
                        ? 'border-l border-black/10 dark:border-white/10'
                        : ''
                    } ${
                      i >= 2
                        ? 'border-t border-black/10 dark:border-white/10 lg:border-t-0'
                        : ''
                    } ${
                      i > 0
                        ? 'lg:border-l lg:border-black/10 lg:dark:border-white/10'
                        : ''
                    }`}
                  >
                    <span className="block font-mono text-[10px] sm:text-[11px] tracking-widest text-black/30 dark:text-white/30 mb-4 sm:mb-5">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-4xl sm:text-5xl font-light tracking-tight leading-none mb-3 tabular-nums">
                      {stat.value}
                    </p>
                    <p className="text-xs sm:text-sm text-black/45 dark:text-white/45 font-light">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills — simple editorial list */}
            <div className="mb-16 sm:mb-20 max-w-3xl">
              <h3 className="text-xs sm:text-sm text-black/40 dark:text-white/40 font-medium uppercase tracking-wider mb-8 sm:mb-10">
                Skills & Technologies
              </h3>
              <div className="divide-y divide-black/10 dark:divide-white/10">
                {skillGroups.map((group) => (
                  <div
                    key={group.title}
                    className="grid grid-cols-1 sm:grid-cols-[8rem_1fr] gap-2 sm:gap-8 py-5 sm:py-6 first:pt-0 last:pb-0"
                  >
                    <p className="text-xs sm:text-sm text-black/35 dark:text-white/35 font-light pt-0.5">
                      {group.title}
                    </p>
                    <p className="text-sm sm:text-base text-black/65 dark:text-white/65 font-light leading-relaxed">
                      {group.skills.join('  ·  ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Infinite marquee */}
            <div className="relative mb-16 sm:mb-20 py-4 border-y border-black/5 dark:border-white/5 overflow-hidden">
              <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-white dark:from-[#0a0a0a] to-transparent z-10" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-white dark:from-[#0a0a0a] to-transparent z-10" />
              <div className="about-marquee flex w-max gap-8 sm:gap-12">
                {[...marqueeSkills, ...marqueeSkills].map((skill, i) => (
                  <span
                    key={`${skill}-${i}`}
                    className="text-sm sm:text-base font-light text-black/30 dark:text-white/30 whitespace-nowrap uppercase tracking-[0.2em]"
                  >
                    {skill}
                    <span className="ml-8 sm:ml-12 text-black/15 dark:text-white/15">✦</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Closing CTA panel */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden"
            >
              <div className="grid lg:grid-cols-[1.2fr_1fr]">
                {/* Copy */}
                <div className="p-8 sm:p-10 md:p-12 lg:border-r border-black/10 dark:border-white/10">
                  <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-black/40 dark:text-white/40 mb-3 font-light">
                    Open for collabs
                  </p>
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight leading-[1.1] mb-4">
                    Got a crazy idea that needs a crazy builder?
                  </h3>
                  <p className="text-sm sm:text-base font-light text-black/50 dark:text-white/50 leading-relaxed max-w-md">
                    Whether it&apos;s a product, a weird prototype, or a problem that needs code.
                    Let&apos;s talk.
                  </p>
                </div>

                {/* Contact rows */}
                <div className="divide-y divide-black/10 dark:divide-white/10">
                  <a
                    href="mailto:virgildelacruz15@gmail.com"
                    className="group flex items-center justify-between gap-4 px-8 sm:px-10 py-6 sm:py-7 hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-black/40 dark:text-white/40" />
                      <span className="text-sm sm:text-base font-light text-black/70 dark:text-white/70">
                        Email me
                      </span>
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-black/30 dark:text-white/30 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                  <a
                    href="https://github.com/Souleilune"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 px-8 sm:px-10 py-6 sm:py-7 hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <Github className="w-4 h-4 text-black/40 dark:text-white/40" />
                      <span className="text-sm sm:text-base font-light text-black/70 dark:text-white/70">
                        GitHub
                      </span>
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-black/30 dark:text-white/30 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 sm:py-12 px-4 sm:px-6 md:px-12 border-t border-black/5 dark:border-white/5">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 text-xs sm:text-sm text-black/30 dark:text-white/30 font-light">
            <span>© {new Date().getFullYear()} Virgil Barcelon</span>
            <span>Built with Next.js & Tailwind CSS</span>
          </div>
        </footer>

        {/* FAB Component - daisyUI */}
        <div className="fab fab-flower fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
          {/* a focusable div with tabindex is necessary to work on all browsers. role="button" is necessary for accessibility */}
          <div tabIndex={0} role="button" className="btn btn-circle btn-lg">
            <svg
              aria-label="Open contact menu"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>

          {/* Main Action button replaces the original button when FAB is open */}
          <button className="fab-main-action btn btn-circle btn-lg bg-black dark:bg-white text-white dark:text-black">
            <svg
              aria-label="Close contact menu"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* buttons that show up when FAB is open */}
          {/* Email */}
          <div className="tooltip tooltip-left" data-tip="Email">
            <a
              href="mailto:virgildelacruz15@gmail.com"
              className="btn btn-circle btn-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
                aria-label="Email"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </a>
          </div>

          {/* GitHub */}
          <div className="tooltip tooltip-left" data-tip="GitHub">
            <a
              href="https://github.com/Souleilune"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-circle btn-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-6 h-6"
                aria-label="GitHub"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>

          {/* LinkedIn */}
          <div className="tooltip" data-tip="LinkedIn">
            <a
              href="https://www.linkedin.com/in/virgil-barcelon-066a42312"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-circle btn-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-6 h-6"
                aria-label="LinkedIn"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}