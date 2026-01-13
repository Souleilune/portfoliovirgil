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

interface MediumArticle {
  title: string;
  link: string;
  pubDate: string;
  author: string;
  description?: string;
}

export default function Home() {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isThemeAnimating, setIsThemeAnimating] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [mediumUsername, setMediumUsername] = useState('gil-bourboin');
  const [articles, setArticles] = useState<MediumArticle[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [articlesError, setArticlesError] = useState<string | null>(null);
  const [currentArticleSlide, setCurrentArticleSlide] = useState(0);
  const [articleTouchStart, setArticleTouchStart] = useState(0);
  const [articleTouchEnd, setArticleTouchEnd] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const articlesCarouselRef = useRef<HTMLDivElement>(null);
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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % projects.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle arrow keys if not typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if (e.key === 'ArrowLeft') {
        // Navigate articles carousel if it has items, otherwise navigate projects
        if (articles.length > 0) {
          setCurrentArticleSlide((prev) => (prev - 1 + articles.length) % articles.length);
        } else {
          setCurrentSlide((prev) => (prev - 1 + projects.length) % projects.length);
        }
      } else if (e.key === 'ArrowRight') {
        // Navigate articles carousel if it has items, otherwise navigate projects
        if (articles.length > 0) {
          setCurrentArticleSlide((prev) => (prev + 1) % articles.length);
        } else {
          setCurrentSlide((prev) => (prev + 1) % projects.length);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [articles.length]);

  const fetchMediumArticles = async (username: string) => {
    setArticlesLoading(true);
    setArticlesError(null);
    
    try {
      const response = await fetch(`/api/medium?username=${encodeURIComponent(username)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch articles');
      }
      
      setArticles(data.articles || []);
      setCurrentArticleSlide(0);
    } catch (error) {
      setArticlesError(error instanceof Error ? error.message : 'Failed to fetch articles');
      setArticles([]);
    } finally {
      setArticlesLoading(false);
    }
  };

  const handleFetchArticles = () => {
    if (mediumUsername.trim()) {
      fetchMediumArticles(mediumUsername.trim());
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });
    } catch {
      return dateString;
    }
  };

  const nextArticleSlide = () => {
    if (articles.length > 0) {
      setCurrentArticleSlide((prev) => (prev + 1) % articles.length);
    }
  };

  const prevArticleSlide = () => {
    if (articles.length > 0) {
      setCurrentArticleSlide((prev) => (prev - 1 + articles.length) % articles.length);
    }
  };

  const goToArticleSlide = (index: number) => {
    setCurrentArticleSlide(index);
  };

  const handleArticleTouchStart = (e: React.TouchEvent) => {
    setArticleTouchStart(e.targetTouches[0].clientX);
  };

  const handleArticleTouchMove = (e: React.TouchEvent) => {
    setArticleTouchEnd(e.targetTouches[0].clientX);
  };

  const handleArticleTouchEnd = () => {
    if (!articleTouchStart || !articleTouchEnd) return;
    const distance = articleTouchStart - articleTouchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextArticleSlide();
    }
    if (isRightSwipe) {
      prevArticleSlide();
    }
  };

  return (
    <div className={`${inter.className} bg-white dark:bg-[#0a0a0a] text-black dark:text-white min-h-screen transition-colors duration-300`}>

      {/* Floating Top Navigation Bar */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] sm:w-auto sm:min-w-[400px] max-w-2xl">
        <div className="flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6 py-2.5 sm:py-3.5 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-1 sm:gap-3 flex-1 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => scrollTo('intro')}
              className="text-xs sm:text-sm font-medium text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-all duration-200 px-3 sm:px-4 py-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 whitespace-nowrap"
            >
              Intro
            </button>
            <button
              onClick={() => scrollTo('work')}
              className="text-xs sm:text-sm font-medium text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-all duration-200 px-3 sm:px-4 py-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 whitespace-nowrap"
            >
              Work
            </button>
            <button
              onClick={() => scrollTo('writing')}
              className="text-xs sm:text-sm font-medium text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-all duration-200 px-3 sm:px-4 py-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 whitespace-nowrap"
            >
              Writing
            </button>
            <button
              onClick={() => scrollTo('about')}
              className="text-xs sm:text-sm font-medium text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-all duration-200 px-3 sm:px-4 py-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 whitespace-nowrap"
            >
              About
            </button>
          </div>
          <button
            onClick={toggleTheme}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-black/20 dark:border-white/20 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 hover:scale-110 active:scale-95 transition-all duration-300 flex-shrink-0 relative ${isThemeAnimating ? 'animate-spin-once' : ''}`}
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
      <main className="pt-12 sm:pt-20">
        {/* Intro Section */}
        <section 
          id="intro"
          ref={(el) => { sectionRefs.current['intro'] = el; }}
          className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-12 pt-6 sm:pt-16 pb-20 sm:pb-32"
        >
          <div className="max-w-4xl w-full">
            <div className="mb-6 sm:mb-8">
              <span className="text-xs sm:text-sm text-black/40 dark:text-white/40 font-light tracking-wider uppercase">
                Full-Stack Developer
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light leading-[0.9] mb-8 sm:mb-12 tracking-tight">
              Virgil
              <br />
              <span className="text-black/60 dark:text-white/60">Barcelon</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-black/60 dark:text-white/60 font-light max-w-2xl leading-relaxed">
              I craft digital stories, life experiences, and documenting my Machine Learning journey in Medium. 
              Specializing in modern web applications and creative technical solutions.
            </p>
            <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row gap-4 sm:gap-6">
              <a 
                href="#work"
                onClick={(e) => { e.preventDefault(); scrollTo('work'); }}
                className="text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors border-b border-black/20 dark:border-white/20 hover:border-black/40 dark:hover:border-white/40 pb-1"
              >
                View Work →
              </a>
              <a 
                href="https://medium.com/@gil-bourboin"
                className="text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors border-b border-black/20 dark:border-white/20 hover:border-black/40 dark:hover:border-white/40 pb-1"
              >
                View Articles →
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

            {/* Carousel Container */}
            <div className="relative">
              {/* Carousel Wrapper */}
              <div 
                ref={carouselRef}
                className="relative overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
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
                        className="min-w-full flex-shrink-0 px-2 sm:px-4"
                      >
                        <div
                          onMouseEnter={() => setHoveredProject(project.id)}
                          onMouseLeave={() => setHoveredProject(null)}
                          onClick={handleClick}
                          className="group relative border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 transition-all duration-500 p-6 sm:p-8 md:p-12 cursor-pointer bg-white/50 dark:bg-[#0a0a0a]/50 hover:bg-white/80 dark:hover:bg-[#0a0a0a]/80 rounded-lg"
                        >
                          <div className="flex flex-col gap-4 sm:gap-6">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="text-xs sm:text-sm text-black/40 dark:text-white/40 font-light mb-2 sm:mb-3">
                                  {project.year}
                                </div>
                                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light mb-3 sm:mb-4 group-hover:text-black/80 dark:group-hover:text-white/80 transition-colors">
                                  {project.title}
                                </h3>
                                <p className="text-sm sm:text-base md:text-lg text-black/50 dark:text-white/50 font-light mb-4 sm:mb-6 leading-relaxed max-w-2xl">
                                  {project.description}
                                </p>
                              </div>
                              <div className="flex-shrink-0">
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-black/20 dark:border-white/20 flex items-center justify-center transition-all duration-500 ${
                                  hoveredProject === project.id ? 'bg-black/5 dark:bg-white/10 scale-110' : ''
                                }`}>
                                  <svg 
                                    className="w-5 h-5 sm:w-6 sm:h-6 text-black/40 dark:text-white/40" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 sm:gap-3">
                              {project.tech.map((tech) => (
                                <span
                                  key={tech}
                                  className="text-[10px] sm:text-xs text-black/30 dark:text-white/30 font-light px-2 sm:px-3 py-1 border border-black/10 dark:border-white/10 rounded-full"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-8 md:-translate-x-12 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-black/20 dark:border-white/20 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-sm items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 z-10"
                aria-label="Previous slide"
              >
                <svg 
                  className="w-5 h-5 sm:w-6 sm:h-6 text-black/60 dark:text-white/60" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-8 md:translate-x-12 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-black/20 dark:border-white/20 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-sm items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 z-10"
                aria-label="Next slide"
              >
                <svg 
                  className="w-5 h-5 sm:w-6 sm:h-6 text-black/60 dark:text-white/60" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Slide Indicators */}
              <div className="flex justify-center gap-2 mt-8 sm:mt-12">
                {projects.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentSlide === index
                        ? 'bg-black/60 dark:bg-white/60 w-8'
                        : 'bg-black/20 dark:bg-white/20 hover:bg-black/40 dark:hover:bg-white/40'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Writing Section */}
        <section 
          id="writing"
          ref={(el) => { sectionRefs.current['writing'] = el; }}
          className="min-h-screen pt-12 pb-20 sm:py-32 px-4 sm:px-6 md:px-12"
        >
          <div className="max-w-6xl mx-auto">
            <div className="mb-12 sm:mb-16 md:mb-24">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-4">Writing</h2>
              <div className="w-16 sm:w-24 h-px bg-black/20 dark:bg-white/20 mb-4"></div>
              <p className="text-sm sm:text-base text-black/50 dark:text-white/50 font-light">
                Recent stories from Medium
              </p>
            </div>

            {/* Search Bar */}
            <div className="mb-8 sm:mb-12 flex flex-col sm:flex-row gap-4 items-start sm:items-end">
              <div className="flex-1 w-full">
                <label htmlFor="medium-username" className="block text-xs sm:text-sm text-black/40 dark:text-white/40 font-light mb-2">
                  Medium Username
                </label>
                <input
                  id="medium-username"
                  type="text"
                  value={mediumUsername}
                  onChange={(e) => setMediumUsername(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleFetchArticles();
                    }
                  }}
                  placeholder="gil-bourboin"
                  className="w-full px-4 py-2 sm:py-3 border border-black/20 dark:border-white/20 bg-white/50 dark:bg-[#0a0a0a]/50 rounded-lg text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:border-black/40 dark:focus:border-white/40 transition-colors"
                />
              </div>
              <button
                onClick={handleFetchArticles}
                disabled={articlesLoading || !mediumUsername.trim()}
                className="px-6 py-2 sm:py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-light text-sm sm:text-base hover:bg-black/80 dark:hover:bg-white/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {articlesLoading ? 'Fetching...' : 'Fetch Stories'}
              </button>
            </div>

            {/* Error Message */}
            {articlesError && (
              <div className="mb-8 p-4 border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{articlesError}</p>
              </div>
            )}

            {/* Articles Carousel */}
            {articles.length > 0 && (
              <div className="relative">
                {/* Carousel Wrapper */}
                <div 
                  ref={articlesCarouselRef}
                  className="relative overflow-hidden"
                  onTouchStart={handleArticleTouchStart}
                  onTouchMove={handleArticleTouchMove}
                  onTouchEnd={handleArticleTouchEnd}
                >
                  <div 
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentArticleSlide * 100}%)` }}
                  >
                    {articles.map((article, index) => {
                      const handleArticleClick = () => {
                        window.open(article.link, '_blank', 'noopener,noreferrer');
                      };

                      return (
                        <div
                          key={index}
                          className="min-w-full flex-shrink-0 px-2 sm:px-4"
                        >
                          <div
                            onClick={handleArticleClick}
                            className="group relative border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 transition-all duration-500 p-6 sm:p-8 md:p-12 cursor-pointer bg-white/50 dark:bg-[#0a0a0a]/50 hover:bg-white/80 dark:hover:bg-[#0a0a0a]/80 rounded-lg"
                          >
                            <div className="flex flex-col gap-4 sm:gap-6">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="text-xs sm:text-sm text-black/40 dark:text-white/40 font-light mb-2 sm:mb-3">
                                    {article.author}
                                  </div>
                                  <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light mb-3 sm:mb-4 group-hover:text-black/80 dark:group-hover:text-white/80 transition-colors">
                                    {article.title}
                                  </h3>
                                  <p className="text-xs sm:text-sm text-black/40 dark:text-white/40 font-light">
                                    {formatDate(article.pubDate)}
                                  </p>
                                </div>
                                <div className="flex-shrink-0">
                                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-black/20 dark:border-white/20 flex items-center justify-center transition-all duration-500 group-hover:bg-black/5 dark:group-hover:bg-white/10 group-hover:scale-110">
                                    <svg 
                                      className="w-5 h-5 sm:w-6 sm:h-6 text-black/40 dark:text-white/40" 
                                      fill="none" 
                                      stroke="currentColor" 
                                      viewBox="0 0 24 24"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={prevArticleSlide}
                  className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-8 md:-translate-x-12 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-black/20 dark:border-white/20 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-sm items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 z-10"
                  aria-label="Previous article"
                >
                  <svg 
                    className="w-5 h-5 sm:w-6 sm:h-6 text-black/60 dark:text-white/60" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextArticleSlide}
                  className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-8 md:translate-x-12 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-black/20 dark:border-white/20 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-sm items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 z-10"
                  aria-label="Next article"
                >
                  <svg 
                    className="w-5 h-5 sm:w-6 sm:h-6 text-black/60 dark:text-white/60" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Slide Indicators */}
                <div className="flex justify-center gap-2 mt-8 sm:mt-12">
                  {articles.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToArticleSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        currentArticleSlide === index
                          ? 'bg-black/60 dark:bg-white/60 w-8'
                          : 'bg-black/20 dark:bg-white/20 hover:bg-black/40 dark:hover:bg-white/40'
                      }`}
                      aria-label={`Go to article ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!articlesLoading && articles.length === 0 && !articlesError && (
              <div className="text-center py-12">
                <p className="text-sm sm:text-base text-black/40 dark:text-white/40 font-light">
                  Enter a Medium username and click &quot;Fetch Stories&quot; to load articles
                </p>
              </div>
            )}
          </div>
        </section>

        {/* About Section */}
        <section 
          id="about"
          ref={(el) => { sectionRefs.current['about'] = el; }}
          className="min-h-screen pt-12 pb-20 sm:py-32 px-4 sm:px-6 md:px-12 flex items-center"
        >
          <div className="max-w-4xl mx-auto w-full">
            <div className="mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-4">About</h2>
              <div className="w-16 sm:w-24 h-px bg-black/20 dark:bg-white/20"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-16">
              <div>
                <p className="text-base sm:text-lg text-black/60 dark:text-white/60 font-light leading-relaxed mb-6 sm:mb-8">
                  I&apos;m partially a full-stack developer passionate about creating clever digital experiences. 
                  With medium expertise in static and dynamic modern web technologies, I bring ideas either to life or lifeless 
                  through clean code or absurd prompts.
                </p>
                <p className="text-base sm:text-lg text-black/60 dark:text-white/60 font-light leading-relaxed">
                  Every project is an opportunity to solve interesting problems and push the 
                  boundaries of what&apos;s possible on the web. I believe in writing in general as I write in Medium 
                  and this also includes proper documentation in each codebase.
                </p>
              </div>
              
              <div>
                <h3 className="text-xs sm:text-sm text-black/40 dark:text-white/40 font-medium mb-4 sm:mb-6 uppercase tracking-wider">
                  Skills & Technologies
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <p className="text-xs sm:text-sm text-black/30 dark:text-white/30 mb-1 sm:mb-2 font-light">Frontend</p>
                    <p className="text-sm sm:text-base text-black/60 dark:text-white/60 font-light">React, Next.js, TypeScript, Tailwind CSS</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-black/30 dark:text-white/30 mb-1 sm:mb-2 font-light">Backend</p>
                    <p className="text-sm sm:text-base text-black/60 dark:text-white/60 font-light">Node.js, PostgreSQL, REST APIs, Express.js</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-black/30 dark:text-white/30 mb-1 sm:mb-2 font-light">Tools</p>
                    <p className="text-sm sm:text-base text-black/60 dark:text-white/60 font-light">Git, CI/CD, RoboFlow, Gemini AI, Jupyter Notebook, Google Colab</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 sm:mt-16 pt-12 sm:pt-16 border-t border-black/5 dark:border-white/5">
              <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-8">
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
        <footer className="py-8 sm:py-12 px-4 sm:px-6 md:px-12 border-t border-black/5 dark:border-white/5">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 text-xs sm:text-sm text-black/30 dark:text-white/30 font-light">
            <span>© {new Date().getFullYear()} Virgil Barcelon</span>
            <span>Built with Next.js & Tailwind CSS</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
