import { useState, useEffect, useRef } from 'react';
import { Project, CarouselAxis, resolveProjectImages } from './types';
import { INITIAL_PROJECTS } from './data';
import { RotaryCarousel, playKachaSound } from './components/RotaryCarousel';
import { ProjectDetail } from './components/ProjectDetail';
import { DashboardManager } from './components/DashboardManager';
import { InteractiveTagline } from './components/InteractiveTagline';
import { InteractiveRandomButton } from './components/InteractiveRandomButton';
import { Sun, Moon, Info, Sparkles, X, Mail, Volume2, VolumeX, Shuffle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Customization parameters
  const [axis, setAxis] = useState<CarouselAxis>('Y');
  const [rotationSpeed, setRotationSpeed] = useState<number>(0.8);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isCVOpen, setIsCVOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  // Background Audio State & Ref
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cursor pointer halo follow state
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const [showCursor, setShowCursor] = useState(false);

  // Guide completion states
  const [taglineScratched, setTaglineScratched] = useState(false);
  const [bottomPanelHovered, setBottomPanelHovered] = useState(false);
  const [leftDragDone, setLeftDragDone] = useState(false);
  const [rightDragDone, setRightDragDone] = useState(false);

  useEffect(() => {
    const handleTaglineScratched = () => {
      setTaglineScratched(true);
    };

    const handleBottomPanelHovered = () => {
      setBottomPanelHovered(true);
    };

    const handleLeftDrag = () => {
      setLeftDragDone(true);
    };

    const handleRightDrag = () => {
      setRightDragDone(true);
    };

    window.addEventListener('guide-tagline-scratched', handleTaglineScratched);
    window.addEventListener('guide-bottom-panel-done', handleBottomPanelHovered);
    window.addEventListener('guide-left-drag-done', handleLeftDrag);
    window.addEventListener('guide-right-drag-done', handleRightDrag);

    return () => {
      window.removeEventListener('guide-tagline-scratched', handleTaglineScratched);
      window.removeEventListener('guide-bottom-panel-done', handleBottomPanelHovered);
      window.removeEventListener('guide-left-drag-done', handleLeftDrag);
      window.removeEventListener('guide-right-drag-done', handleRightDrag);
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!mediaQuery.matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setShowCursor(true);
    };
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') || 
        target.closest('[role="button"]') ||
        target.classList.contains('cursor-pointer') || 
        target.closest('.cursor-pointer')
      ) {
        setIsHoveringClickable(true);
      } else {
        setIsHoveringClickable(false);
      }
    };

    const handleMouseLeaveWindow = () => {
      setShowCursor(false);
    };

    const handleMouseEnterWindow = () => {
      setShowCursor(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.addEventListener('mouseenter', handleMouseEnterWindow);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
    };
  }, []);

  const handleEnter = () => {
    playKachaSound();
    setHasEntered(true);
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.log("Autoplay blocked or audio load failed. User action will toggle it: ", err);
        });
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.log("Audio playback failed: ", err);
          });
      }
    }
  };

  // Load custom projects from localStorage and merge with latest presets
  useEffect(() => {
    const saved = localStorage.getItem('rotary-projects');
    if (saved) {
      try {
        const savedProjects = JSON.parse(saved) as Project[];
        // Filter out any older presets to allow the newer, expanded INITIAL_PROJECTS to take pre-installed precedence.
        // This ensures the user's manual edits inside data.ts are immediately active on refresh.
        const initialIds = INITIAL_PROJECTS.map(p => p.id);
        const customProjects = savedProjects.filter(p => !initialIds.includes(p.id));
        
        setProjects([...customProjects, ...INITIAL_PROJECTS]);
      } catch (e) {
        setProjects(INITIAL_PROJECTS);
      }
    } else {
      setProjects(INITIAL_PROJECTS);
    }

    // Default to system dark mode or stored preference
    const storedTheme = localStorage.getItem('rotary-theme');
    if (storedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      // Warm minimal is default
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('rotary-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('rotary-theme', 'light');
    }
  };

  // Create project callback
  const handleCreateProject = (newProj: Project) => {
    const updated = [newProj, ...projects];
    setProjects(updated);
    localStorage.setItem('rotary-projects', JSON.stringify(updated));
  };

  // Reset to initial set
  const handleResetProjects = () => {
    if (window.confirm('确定要还原为 Penny Bi 的官方内置收藏吗？如果您曾自拟卡，它们将被清除。')) {
      setProjects(INITIAL_PROJECTS);
      localStorage.removeItem('rotary-projects');
      // Clear stamp local storage too
      INITIAL_PROJECTS.forEach(p => {
        localStorage.removeItem(`stamps-${p.id}`);
      });
      alert('已还原官方内置收藏卡集。');
    }
  };

  const [randomSpinTrigger, setRandomSpinTrigger] = useState(0);

  const handleRandomPage = () => {
    playKachaSound();
    const validProjects = projects.filter(p => p.category.toLowerCase() !== 'notes');
    if (validProjects.length === 0) return;
    
    // Close other modal overlays to show the fast spin layout cleanly
    setIsHelpOpen(false);
    setIsCVOpen(false);
    setIsContactOpen(false);
    
    if (selectedProject) {
      setSelectedProject(null);
    }
    setRandomSpinTrigger(prev => prev + 1);
  };

  const getTooltipContent = () => {
    // If cover is active, do not show tooltips
    if (!hasEntered) return null;
    
    // Check if overlays or drawers are open
    if (selectedProject || isCVOpen || isContactOpen || isDashboardOpen || isHelpOpen) {
      return null;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Region 1: Left area representing the sidebar tagline block
    const isLeftZone = mousePos.x < 380 && mousePos.y > 60 && mousePos.y < height - 60;
    if (isLeftZone && !taglineScratched) {
      return "Hover to scratch and reveal tagline";
    }

    // Region 2: To the right of the bookshelf -> Switch to the bottom-right interactive prompt
    const isRightOfBookshelf = mousePos.x > width - 380;
    if (isRightOfBookshelf && !bottomPanelHovered) {
      return "Hover bottom-right to reveal action panel";
    }

    // Region 3: Below the bookshelf
    const isBelowBookshelf = mousePos.x >= 380 && mousePos.x <= width - 380 && mousePos.y > height - 200;
    if (isBelowBookshelf) {
      if (leftDragDone && rightDragDone) {
        return null;
      }
      return (
        <span className="flex flex-col gap-0.5 text-left">
          {!leftDragDone && <span>Left-Click & Drag: Spin single page slide</span>}
          {!rightDragDone && <span>Right-Click & Drag: Rotate 3D space perspective</span>}
        </span>
      );
    }

    return null;
  };

  // Filter projects dynamically with active URL resolution
  const resolvedAllProjects = projects.map(resolveProjectImages);
  const filteredProjects = resolvedAllProjects.filter((p) => {
    // Exclude the 'Notes' category containing the CV bio from the rotating shelf entirely as requested
    if (p.category.toLowerCase() === 'notes') return false;
    
    if (activeCategory === 'ALL') return true;
    return p.category.toLowerCase() === activeCategory.toLowerCase();
  });

  const categories = ['ALL', 'DESIGN', 'ART', 'TECH'];

  return (
    <div className={`h-screen max-h-screen bg-[#F6F5F2] dark:bg-[#0D0D10] transition-colors duration-500 text-[#1A1A1A] dark:text-zinc-55 flex flex-col justify-between overflow-hidden relative`} id="app-root-wrapper">
      
      {/* Background audio element loaded from public path */}
      <audio ref={audioRef} src="/bg.mp3" loop />
      
      {/* Studio Overhead Spotlight Cone referenced from the user image */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.95)_0%,_rgba(255,255,255,0)_75%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.05)_0%,_rgba(0,0,0,0)_75%)] pointer-events-none select-none z-0" id="studio-overhead-spotlight" />
      
      {/* Blurry, misty main view content – becomes fully clear upon entering */}
      <div 
        className={`flex-1 flex flex-col justify-between transition-all duration-[2000ms] ease-out relative ${
          !hasEntered 
            ? 'blur-[28px] opacity-20 pointer-events-none select-none scale-[0.98]' 
            : 'blur-none opacity-100 scale-100'
        }`}
        id="app-focused-main-shell"
      >
        {/* Absolute Minimal Top Nav - Title in top-left, menu line below it */}
        <div className="absolute top-4 inset-x-0 px-6 flex flex-col items-start gap-2.5 z-40 select-none" id="minimal-top-nav">
          {/* Top Row: Title */}
          <div className="h-6 flex items-center justify-start">
            {hasEntered && (
              <motion.div
                layoutId="floating-brand-title"
                className="font-serif text-[12px] sm:text-[14px] font-bold text-[#1A1A1A] dark:text-zinc-150 tracking-[0.2em] uppercase whitespace-nowrap"
                id="site-title-rendered"
                transition={{ type: 'spring', damping: 25, stiffness: 95 }}
              >
                Penny's Portfolio
              </motion.div>
            )}
          </div>

          {/* Bottom Row / Menu Bar Line */}
          <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-3 font-mono text-[9px] tracking-widest text-[#1A1A1A]/50 dark:text-zinc-400" id="menu-bar-line">
            {/* Categories */}
            <div className="flex gap-4 sm:gap-6 items-center flex-wrap justify-center sm:justify-start" id="minimal-cats">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => { playKachaSound(); setActiveCategory(cat); }}
                  className={`cursor-pointer pb-0.5 border-b transition-all duration-300 uppercase ${
                    activeCategory === cat
                      ? 'border-[#1A1A1A] text-[#1A1A1A] font-bold dark:border-white dark:text-white'
                      : 'border-transparent hover:text-[#1A1A1A] dark:hover:text-white'
                  }`}
                  id={`min-tab-${cat.toLowerCase()}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Action cluster including CV, Contact and Background Music */}
            <div className="flex items-center gap-4 sm:gap-5" id="minimal-actions">
              <button 
                type="button" 
                onClick={() => { playKachaSound(); setIsCVOpen(true); }} 
                className="cursor-pointer hover:text-[#1A1A1A] dark:hover:text-white transition-opacity font-medium flex items-center gap-1.5 uppercase"
                id="min-btn-cv"
              >
                CV
              </button>
              <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800" />
              <button 
                type="button" 
                onClick={() => { playKachaSound(); setIsContactOpen(true); }} 
                className="cursor-pointer hover:text-[#1A1A1A] dark:hover:text-white transition-opacity font-medium flex items-center gap-1.5 uppercase"
                id="min-btn-contact"
              >
                CONTACT
              </button>
              <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800" />
              <button 
                type="button" 
                onClick={() => { playKachaSound(); togglePlay(); }} 
                className="cursor-pointer hover:text-[#1A1A1A] dark:hover:text-white transition-all font-medium flex items-center gap-1.5 uppercase"
                id="min-btn-music"
                title={isPlaying ? "PAUSE MUSIC" : "PLAY MUSIC"}
              >
                {isPlaying ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 animate-pulse text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-600 dark:text-emerald-400">MUSIC ON</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 opacity-60" />
                    <span>MUSIC OFF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Descriptive tagline text on the left, requested by the user */}
        <InteractiveTagline />

      {/* Centerpiece 3D Rotary Folder Carousel workspace */}
      <main className="flex-1 w-full flex flex-col justify-center" id="main-content-carousel">
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center" id="empty-projects-state">
            <Info className="w-8 h-8 text-[#1A1A1A]/20 dark:text-zinc-700 mb-2 stroke-[1.2]" />
            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
              该分类下暂无收藏卡片 / CATEGORY EMPTY
            </p>
            <button
              type="button"
              onClick={() => setIsDashboardOpen(true)}
              className="mt-4 border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-zinc-900 px-4 py-2 rounded-none font-mono text-[9px] font-bold tracking-widest cursor-pointer transition-all uppercase"
              id="empty-state-btn-add"
            >
              + 自建一页卡牌 / ADD CUSTOM STACK
            </button>
          </div>
        ) : (
          <RotaryCarousel 
            projects={filteredProjects}
            onProjectClick={(p) => setSelectedProject(p)}
            axis={axis}
            setAxis={setAxis}
            rotationSpeed={rotationSpeed}
            activeCategory={activeCategory}
            selectedProjectId={selectedProject?.id || null}
            triggerRandomSpin={randomSpinTrigger}
          />
        )}
      </main>

      {/* Floating Interactive Play Guide (玩法指南 Help overlay) */}
      {isHelpOpen && (
        <div 
          className="fixed inset-0 z-50 bg-zinc-950/45 backdrop-blur-xs flex items-center justify-center p-4 select-none"
          onClick={() => setIsHelpOpen(false)}
          id="guide-overlay"
        >
          <div 
            className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-none p-6 border border-[#1A1A1A]/10 dark:border-white/10 shadow-xs flex flex-col gap-6"
            onClick={(e) => e.stopPropagation()}
            id="guide-box-modal"
          >
            <div className="flex justify-between items-center border-b border-[#1A1A1A]/10 dark:border-white/10 pb-3" id="guide-header">
              <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A] dark:text-zinc-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#1A1A1A]/70 animate-pulse" />
                三轴旋转式收藏库 / SYSTEM MANUAL
              </span>
              <button
                type="button"
                onClick={() => { playKachaSound(); setIsHelpOpen(false); }}
                className="p-1 border border-transparent hover:border-[#1A1A1A]/10 text-zinc-400 hover:text-zinc-950 transition-colors rounded-none"
                id="btn-close-guide"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-col gap-4 text-xs text-[#1A1A1A]/70 dark:text-zinc-400" id="guide-steps-list">
              <div className="flex items-start gap-3" id="guide-step-1">
                <div className="h-5 w-5 border border-[#1A1A1A]/30 dark:border-white/30 flex items-center justify-center text-[9px] font-mono font-bold text-zinc-800 dark:text-zinc-200 shrink-0 select-none">
                  01
                </div>
                <div>
                  <h5 className="text-[#1A1A1A] dark:text-zinc-150 font-bold tracking-wider uppercase text-[10px]">悬停即静 / HOVER TO PAUSE</h5>
                  <p className="text-[11px] text-[#1A1A1A]/60 dark:text-zinc-500 mt-1 leading-relaxed">
                    鼠标移入屏幕中央的 3D 收藏轮盘时，转动将<b>立即停止</b>，方便您随心停在特定的作品档案卡槽。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3" id="guide-step-2">
                <div className="h-5 w-5 border border-[#1A1A1A]/30 dark:border-white/30 flex items-center justify-center text-[9px] font-mono font-bold text-zinc-800 dark:text-zinc-200 shrink-0 select-none">
                  02
                </div>
                <div>
                  <h5 className="text-[#1A1A1A] dark:text-zinc-150 font-bold tracking-wider uppercase text-[10px]">拖拽旋转 / DRAG TO ROTATE</h5>
                  <p className="text-[11px] text-[#1A1A1A]/60 dark:text-zinc-500 mt-1 leading-relaxed">
                    在卡盘或屏幕空白处<b>按住并拖拽</b>即可精细抚拨转盘；点击顶部的分类，卡牌将在3D阻尼中重新组算分布。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3" id="guide-step-3">
                <div className="h-5 w-5 border border-[#1A1A1A]/30 dark:border-white/30 flex items-center justify-center text-[9px] font-mono font-bold text-zinc-800 dark:text-zinc-200 shrink-0 select-none">
                  03
                </div>
                <div>
                  <h5 className="text-[#1A1A1A] dark:text-zinc-150 font-bold tracking-wider uppercase text-[10px]">盖戳拟件 / SEALS & EDITING</h5>
                  <p className="text-[11px] text-[#1A1A1A]/60 dark:text-zinc-500 mt-1 leading-relaxed">
                    点击任意作品卡即可进入详情纸页，您可以用红蓝印章在纸页上盖戳。您也可以使用右上角<b>“自拟卡”</b>增设您创意的卡档案！
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3" id="guide-step-4">
                <div className="h-5 w-5 border border-[#1A1A1A]/30 dark:border-white/30 flex items-center justify-center text-[9px] font-mono font-bold text-zinc-800 dark:text-zinc-200 shrink-0 select-none">
                  04
                </div>
                <div>
                  <h5 className="text-[#1A1A1A] dark:text-zinc-150 font-bold tracking-wider uppercase text-[10px]">传动机枢变轨 / TRIPLE AXIS SWITCH</h5>
                  <p className="text-[11px] text-[#1A1A1A]/60 dark:text-zinc-500 mt-1 leading-relaxed">
                    在轮盘底端切换 <b>水平(Y)、垂直(X)、平铺(Z)</b> 三轴转换机枢，体验三维圆柱形卡盘、桌案 Rolodex 滚轮或平铺圆盘三种完全不同的视效变换。
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => { playKachaSound(); setIsHelpOpen(false); }}
              className="w-full bg-transparent hover:bg-[#1A1A1A] hover:text-white border border-[#1A1A1A] text-[#1A1A1A] dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-zinc-950 font-bold py-2.5 rounded-none font-mono text-[9px] tracking-widest cursor-pointer text-center uppercase transition-all"
              id="btn-close-guide-submit"
            >
              UNDERSTOOD, ENTER / 开始触摸
            </button>
          </div>
        </div>
      )}

      {/* Standalone CV / Biography Overlay Portal */}
      {isCVOpen && (
        <div 
          className="fixed inset-0 z-50 bg-zinc-950/45 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsCVOpen(false)}
          id="cv-overlay-portal"
        >
          <div 
            className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-none p-6 sm:p-8 border border-[#1A1A1A]/10 dark:border-white/10 shadow-lg flex flex-col gap-6 max-h-[85vh] overflow-y-auto scrollbar-none select-text"
            onClick={(e) => e.stopPropagation()}
            id="cv-box-modal"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-[#1A1A1A]/10 dark:border-white/10 pb-4" id="cv-header">
              <div className="flex flex-col gap-1 text-left">
                <span className="font-mono text-[8px] uppercase tracking-[0.2em] font-bold text-amber-700 dark:text-amber-400">
                  PORTFOLIO DOSSIER & C.V.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => { playKachaSound(); setIsCVOpen(false); }}
                  className="p-1.5 border border-transparent hover:border-[#1A1A1A]/10 dark:hover:border-white/15 text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors rounded-none cursor-pointer"
                  id="btn-close-cv"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Profile Intro Segment */}
            <div className="flex flex-col gap-2 pb-5 border-b border-[#1A1A1A]/10 dark:border-white/10" id="cv-profile-intro">
              <h4 className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100 font-sans">
                Penny Bi
              </h4>
              <p className="text-[10px] sm:text-[10.5px] font-sans font-medium text-amber-750 dark:text-amber-400 uppercase tracking-widest leading-none">
                建筑背景的跨媒介创作者、设计师与教育者 / CROSS-MEDIA CREATOR, DESIGNER & EDUCATOR
              </p>
              <p className="text-[11px] sm:text-[11.5px] text-stone-650 dark:text-zinc-350 font-sans font-light leading-relaxed text-justify mt-1">
                毕业于哈佛大学设计学院，实践横跨建筑、空间、影像与数字媒介，关注身体、感知与技术如何共同塑造空间体验。本网站是一座持续更新的个人画廊，用以呈现作品、实验与研究过程。
              </p>
            </div>

            {/* Timelines and Focus Area Split-Col Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-5 border-b border-[#1A1A1A]/10 dark:border-white/10" id="cv-experience-and-focus">
              
              {/* Experience */}
              <div className="flex flex-col gap-2.5">
                <span className="font-mono text-[7.5px] font-bold text-stone-400 dark:text-zinc-500 uppercase tracking-widest">
                  CORE TIMELINE // 核心经历
                </span>
                <ul className="space-y-2 text-[10.5px] text-stone-750 dark:text-zinc-300 font-sans list-none pl-0">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold text-[9px] mt-0.5 shrink-0">■</span>
                    <span>
                      <strong className="text-zinc-900 dark:text-zinc-100 font-bold font-sans">哈佛大学设计学院</strong><br />
                      建筑学硕士（M.Arch II）
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold text-[9px] mt-0.5 shrink-0">■</span>
                    <span>
                      <strong className="text-zinc-900 dark:text-zinc-100 font-bold font-sans">MIT</strong><br />
                      跨校选修（Shape Grammar）
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold text-[9px] mt-0.5 shrink-0">■</span>
                    <span>
                      <strong className="text-zinc-900 dark:text-zinc-100 font-bold font-sans">如恩设计研究室（Neri&Hu）｜ OMA 纽约事务所</strong><br />
                      建筑与空间设计师
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold text-[9px] mt-0.5 shrink-0">■</span>
                    <span>
                      <strong className="text-zinc-900 dark:text-zinc-100 font-bold font-sans">厦门大学嘉庚学院</strong><br />
                      建筑学教师
                    </span>
                  </li>
                </ul>
              </div>

              {/* Focus */}
              <div className="flex flex-col gap-2.5 sm:border-l border-[#1A1A1A]/10 dark:border-white/10 sm:pl-6">
                <span className="font-mono text-[7.5px] font-bold text-stone-400 dark:text-zinc-500 uppercase tracking-widest">
                  PRACTICE FOCUS // 实践方向
                </span>
                <ul className="space-y-2 text-[10.5px] text-stone-750 dark:text-zinc-300 font-sans list-none pl-0">
                  <li className="flex items-start gap-2">
                    <span className="text-zinc-400 dark:text-zinc-650 text-[9px] mt-0.5 shrink-0">□</span>
                    <span>建筑与室内设计（文化、剧场、商业、酒店）</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-zinc-400 dark:text-zinc-650 text-[9px] mt-0.5 shrink-0">□</span>
                    <span>空间概念与叙事 / Spatial Narrative</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-zinc-400 dark:text-zinc-650 text-[9px] mt-0.5 shrink-0">□</span>
                    <span>建成项目与落地协调 / Execution Coordinations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-zinc-400 dark:text-zinc-650 text-[9px] mt-0.5 shrink-0">□</span>
                    <span>数字媒介与实验性创作 / Digital Media</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-zinc-400 dark:text-zinc-650 text-[9px] mt-0.5 shrink-0">□</span>
                    <span>教学与设计研究 / Design Research</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* Technical Capabilities Matrix */}
            <div className="flex flex-col gap-3 pb-2" id="cv-skills-matrix">
              <span className="font-mono text-[7.5px] font-bold text-stone-400 dark:text-zinc-500 uppercase tracking-widest">
                TECHNICAL CAPABILITIES // 技能清单
              </span>
              
              <div className="grid grid-cols-2 gap-4 text-[10px] leading-relaxed">
                
                <div className="flex flex-col gap-1 border-r border-[#1A1A1A]/5 dark:border-white/5 pr-4">
                  <span className="font-extrabold uppercase text-amber-700 dark:text-amber-500 border-b border-stone-200 dark:border-zinc-800 pb-0.5 font-sans justify-start text-left">
                    设计与建模 // Modeling
                  </span>
                  <span className="text-stone-700 dark:text-zinc-350 font-sans mt-1 text-left">
                    AutoCAD · Rhino · Grasshopper<br/>
                    SketchUp · Revit
                  </span>
                </div>

                <div className="flex flex-col gap-1 text-left">
                  <span className="font-extrabold uppercase text-amber-700 dark:text-amber-500 border-b border-stone-200 dark:border-zinc-800 pb-0.5 font-sans">
                    视觉与表达 // Vis
                  </span>
                  <span className="text-stone-700 dark:text-zinc-350 font-sans mt-1">
                    Figma · Photoshop · Illustrator · InDesign<br/>
                    Lightroom<br/>
                    Enscape · V-Ray · Twinmotion
                  </span>
                </div>

                <div className="flex flex-col gap-1 border-r border-[#1A1A1A]/5 dark:border-white/5 pr-4 mt-2 text-left">
                  <span className="font-extrabold uppercase text-amber-700 dark:text-amber-500 border-b border-stone-200 dark:border-zinc-800 pb-0.5 font-sans">
                    数字与新媒介 // Interactive
                  </span>
                  <span className="text-stone-700 dark:text-zinc-350 font-sans mt-1">
                    Touchdesigner · AIGC(Midjourney, Nano Banana, Runway, Pika……) · AI coding tool(ChatGPT, Gemini, Coze, Codex……）
                  </span>
                </div>

                <div className="flex flex-col gap-1 mt-2 text-left">
                  <span className="font-extrabold uppercase text-amber-700 dark:text-amber-500 border-b border-stone-200 dark:border-zinc-800 pb-0.5 font-sans">
                    语言 // Languages
                  </span>
                  <span className="text-stone-700 dark:text-zinc-350 font-sans mt-1 font-bold">
                    中文 (Chinese) · English (English)
                  </span>
                </div>

              </div>
            </div>

            {/* Quick Contact Link inside CV */}
            <div className="bg-stone-50 dark:bg-zinc-850 p-4 border border-[#1A1A1A]/5 dark:border-white/5 text-center flex flex-col sm:flex-row justify-between items-center gap-2 mt-1" id="cv-interactive-footer">
              <span className="text-[10px] text-stone-550 dark:text-zinc-400 font-sans font-light text-left">
                感觉这些背景方向与您的课题或项目相契合？ / Looking for collaboration?
              </span>
              <a 
                href="mailto:jingyibi93@gmail.com" 
                className="text-[10px] font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 uppercase tracking-wider font-mono shrink-0"
              >
                <Mail className="w-3 h-3" />
                SEND PROPOSAL / 投递提案
              </a>
            </div>

            <button
              type="button"
              onClick={() => { playKachaSound(); setIsCVOpen(false); }}
              className="w-full bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 font-bold py-2.5 rounded-none font-mono text-[9px] tracking-widest cursor-pointer text-center uppercase transition-all mt-1"
              id="btn-close-cv-bottom"
            >
              CLOSE DOSSIER / 关闭简历
            </button>
          </div>
        </div>
      )}

      {/* Contact Portal Overlay */}
      {isContactOpen && (
        <div 
          className="fixed inset-0 z-50 bg-zinc-950/45 backdrop-blur-xs flex items-center justify-center p-4 select-none"
          onClick={() => setIsContactOpen(false)}
          id="contact-overlay"
        >
          <div 
            className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-none p-6 border border-[#1A1A1A]/10 dark:border-white/10 shadow-xs flex flex-col gap-5 text-center sm:text-left"
            onClick={(e) => e.stopPropagation()}
            id="contact-box-modal"
          >
            <div className="flex justify-between items-center border-b border-[#1A1A1A]/10 dark:border-white/10 pb-3" id="contact-header">
              <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A] dark:text-zinc-200 flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                CONTACT PORTAL / 联系通道
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => { playKachaSound(); setIsContactOpen(false); }}
                  className="p-1 border border-transparent hover:border-[#1A1A1A]/10 text-zinc-400 hover:text-zinc-950 transition-colors rounded-none"
                  id="btn-close-contact"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4 text-xs font-sans text-[#1A1A1A]/70 dark:text-zinc-400" id="contact-details-box">
              <div className="space-y-1">
                <span className="font-mono text-[7px] font-bold text-[#1A1A1A]/40 dark:text-zinc-500 uppercase tracking-widest block font-sans">CREATOR // 创作者</span>
                <p className="text-[14px] font-bold text-[#1A1A1A] dark:text-white">Penny Bi</p>
                <p className="text-[10px] text-stone-500 dark:text-zinc-400 leading-normal font-sans">Architectural & Cross-media Designer & Educator</p>
              </div>

              <div className="space-y-1">
                <span className="font-mono text-[7px] font-bold text-[#1A1A1A]/40 dark:text-zinc-500 uppercase tracking-widest block font-sans">EMAIL // 电子邮箱</span>
                <a 
                  href="mailto:jingyibi93@gmail.com" 
                  className="text-[12px] font-bold text-amber-700 dark:text-amber-400 hover:underline inline-flex items-center gap-1.5"
                  id="contact-email-link"
                >
                  <Mail className="w-3.5 h-3.5" />
                  jingyibi93@gmail.com
                </a>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-[#1A1A1A]/10 dark:border-white/10 pt-3 text-left">
                <div>
                  <span className="font-mono text-[7px] font-bold text-[#1A1A1A]/40 dark:text-zinc-500 uppercase tracking-widest block font-sans">LOCATION // 驻地</span>
                  <p className="text-[11px] font-bold text-[#1A1A1A]/95 dark:text-zinc-200">Shanghai, China</p>
                </div>
                <div>
                  <span className="font-mono text-[7px] font-bold text-[#1A1A1A]/40 dark:text-zinc-500 uppercase tracking-widest block font-sans">COOP STATUS // 合作状态</span>
                  <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-500" />
                    Open to Proposals
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => { playKachaSound(); setIsContactOpen(false); }}
              className="w-full bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 font-bold py-2 rounded-none font-mono text-[9px] tracking-widest cursor-pointer text-center uppercase transition-all"
              id="btn-close-contact-submit"
            >
              CLOSE WINDOW / 关闭
            </button>
          </div>
        </div>
      )}

      {/* Project details drawer overlay */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetail 
            project={resolveProjectImages(selectedProject)}
            onClose={() => setSelectedProject(null)}
            isPlaying={isPlaying}
            onMusicToggle={togglePlay}
          />
        )}
      </AnimatePresence>

      {/* Creative dashboard settings & create project form */}
      <DashboardManager 
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        axis={axis}
        setAxis={setAxis}
        rotationSpeed={rotationSpeed}
        setRotationSpeed={setRotationSpeed}
        onCreateProject={handleCreateProject}
        onResetProjects={handleResetProjects}
      />

      {/* Drawer Ticket: Open a random page / 随机抽阅 */}
      {hasEntered && !selectedProject && !isCVOpen && !isContactOpen && !isDashboardOpen && !isHelpOpen && (
        <InteractiveRandomButton 
          onClick={handleRandomPage} 
        />
      )}

      {/* Footer Branding copyright bar */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-mono text-zinc-400 select-none pb-8" id="footer-copyright-bar">
        <div className="flex items-center gap-1.5" id="footer-logo">
          <span>&copy; 2026 PENNY BI CREATIVE PORTFOLIO</span>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <span className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors uppercase">
            ROTARY ARCHIVE MECHANISM V1.5
          </span>
        </div>
        
        <div className="flex gap-4 items-center" id="footer-links">
          <span>DESIGNED FOR INTERACTIVE ARCHIVES</span>
          <div className="h-1 w-1 bg-[#1A1A1A]/10 dark:bg-zinc-800" />
          <span>STANDALONE PAPER CRAFT STYLE</span>
        </div>
      </footer>
      </div>

      {/* Landing overlay cover - Styled elegantly after the custom picture with heavy fog/blur */}
      {!hasEntered && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#F2F1ED]/40 dark:bg-[#070709]/50 backdrop-blur-md" id="landing-cover-container">
          <div 
            className="relative w-[92vw] max-w-[540px] aspect-[1.6/1] bg-[#DFDEDB]/55 dark:bg-[#121215]/65 border border-white/20 shadow-[0_0_150px_45px_rgba(0,0,0,0.12)] dark:shadow-[0_0_150px_45px_rgba(0,0,0,0.85)] flex flex-col justify-between p-6 sm:p-10 rounded-none text-center overflow-hidden transition-all duration-1000"
            id="landing-cover-card"
          >
            {/* Fog/Smoky vignette mimicking the attached photo exactly with radial overlays */}
            <div className="absolute inset-0 bg-radial-[circle_copy,_rgba(240,239,235,0.25)_10%,_rgba(225,220,215,0.78)_60%,_rgba(205,200,195,0.96)_100%] dark:bg-radial-[circle_copy,_rgba(20,20,25,0.25)_10%,_rgba(15,15,18,0.82)_60%,_rgba(10,10,12,0.98)_100%] pointer-events-none opacity-95 mix-blend-multiply dark:mix-blend-normal" />
            
            {/* Inner artistic technical print border frame lines */}
            <div className="absolute inset-4 border border-[#1A1A1A]/5 dark:border-white/5 pointer-events-none" />

            {/* Core Display Typography Segment: Metabolism layout counterpart */}
            <div className="flex flex-col items-center justify-center my-auto z-10">
              <motion.div
                layoutId="floating-brand-title"
                className="font-serif text-[21px] sm:text-[27px] md:text-[30px] font-bold text-[#1A1A1A] dark:text-zinc-150 tracking-[0.24em] uppercase text-center mr-[-0.24em]"
                id="landing-brand-title"
                transition={{ type: 'spring', damping: 24, stiffness: 90 }}
              >
                Penny's Portfolio
              </motion.div>
            </div>

            {/* Click to trigger entrance and flying flight animation */}
            <div className="flex flex-col items-center gap-5 mt-auto mb-2 z-10">
              <button
                type="button"
                onClick={handleEnter}
                className="cursor-pointer px-10 py-3 border border-[#1A1A1A]/10 dark:border-white/10 hover:border-[#1A1A1A]/80 dark:hover:border-white/80 bg-[#F6F5F2]/40 dark:bg-[#0D0D10]/40 hover:bg-white dark:hover:bg-zinc-950 transition-all duration-500 font-serif text-[9.5px] tracking-[0.4em] uppercase text-[#1A1A1A]/80 dark:text-zinc-300 hover:text-black dark:hover:text-white mr-[-0.4em] shadow-sm hover:shadow-md hover:translate-y-[-1px] active:translate-y-0"
                id="landing-enter-button"
              >
                E N T E R   /   进 入
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Absolute cursor halo following the pointer */}
      {showCursor && (
        <motion.div
          className="fixed top-0 left-0 w-32 h-32 rounded-full pointer-events-none z-[99999]"
          animate={{
            x: mousePos.x - 64,
            y: mousePos.y - 64,
            scale: isHoveringClickable ? 1.4 : 1,
            opacity: isHoveringClickable ? 1.0 : 0.85,
          }}
          transition={{
            type: "spring",
            damping: 28,
            stiffness: 260,
            mass: 0.3,
          }}
          style={{
            background: isDarkMode 
              ? 'radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.18) 42%, rgba(255,255,255,0) 70%)'
              : 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.45) 35%, rgba(255,255,255,0) 70%)',
            mixBlendMode: isDarkMode ? 'screen' : 'normal',
          }}
        />
      )}

      {/* Screen-Wide Smooth Cursor Follow Tooltip helper */}
      {showCursor && getTooltipContent() && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[100000] px-1 py-1 rounded-none bg-transparent flex flex-col items-start gap-0.5"
          animate={{
            x: mousePos.x + 16,
            y: mousePos.y + 24,
          }}
          transition={{
            type: "spring",
            damping: 32,
            stiffness: 300,
            mass: 0.2,
          }}
        >
          <div className="font-sans text-[9.5px] leading-relaxed text-zinc-400/90 dark:text-zinc-500/90 select-none text-left font-medium tracking-wide">
            {getTooltipContent()}
          </div>
        </motion.div>
      )}
    </div>
  );
}
