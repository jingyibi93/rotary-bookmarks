import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Project } from '../types';
import { X, Calendar, Briefcase, Tag, Share2, Sparkles, Eye, Trash2, ArrowLeft, ArrowUp, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { playPaperClickSound, playKachaSound } from './RotaryCarousel';

const optimizeImgUrl = (url: string, width = 600, quality = 80) => {
  if (!url) return '';
  if (url.includes('images.unsplash.com')) {
    if (url.includes('?')) {
      return `${url}&w=${width}&q=${quality}`;
    }
    return `${url}?auto=format&fit=crop&w=${width}&q=${quality}`;
  }
  return url;
};

const getEmbedDetails = (url: string) => {
  if (!url) return null;
  
  // Bilibili pattern
  const bvMatch = url.match(/(BV[a-zA-Z0-9]{10})/i);
  if (bvMatch) {
    return {
      type: 'bilibili',
      embedUrl: `https://player.bilibili.com/player.html?bvid=${bvMatch[1]}&high_quality=1&danmaku=0&page=1&as_wide=1&autoplay=1&t=1`,
      title: 'Bilibili Video'
    };
  }
  
  // YouTube pattern
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=1`,
      title: 'YouTube Video'
    };
  }

  // Generic direct video file pattern
  if (url.match(/\.(mp4|webm|ogg|mov)(?:\?|$)/i)) {
    return {
      type: 'direct',
      url: url,
      title: 'Video Player'
    };
  }

  return null;
};

const cleanChineseFromField = (text: string | null | undefined, isArt: boolean): string => {
  if (!text) return '';
  if (!isArt) return text;
  
  // Checks if a segment contains any Chinese character
  const containsChinese = (s: string) => /[\u4e00-\u9fa5]/.test(s);

  if (text.includes('//')) {
    const parts = text.split('//');
    const englishParts = parts.filter(p => !containsChinese(p)).map(p => p.trim());
    if (englishParts.length > 0) {
      return englishParts.join(' ');
    }
  }
  
  if (text.includes('/')) {
    const parts = text.split('/');
    const englishParts = parts.filter(p => !containsChinese(p)).map(p => p.trim());
    if (englishParts.length > 0) {
      return englishParts.join(' / ');
    }
  }
  
  // Regex to remove all Chinese characters
  let cleanText = text.replace(/[\u4e00-\u9fa5]+/g, '').trim();
  // Clean dangling delimiters / spaces / empty parenthesis
  cleanText = cleanText
    .replace(/\s*\/\s*\/\s*/g, ' / ')
    .replace(/\s*\/\s*$/g, '')
    .replace(/^\s*\/\s*/g, '')
    .replace(/\(\s*\)/g, '')
    .replace(/\[\s*\]/g, '')
    .trim();
    
  return cleanText || text;
};

interface ProjectDetailProps {
  project: Project | null;
  onClose: () => void;
  isPlaying?: boolean;
  onMusicToggle?: () => void;
}

export function ProjectDetail({ project, onClose, isPlaying = false, onMusicToggle }: ProjectDetailProps) {
  const [copied, setCopied] = useState(false);
  const [stamps, setStamps] = useState<string[]>([]);
  const [activeSlideIdx, setActiveSlideIdx] = useState<number | null>(null);
  const [hoveredCardIdx, setHoveredCardIdx] = useState<number | null>(null);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const isArtCategory = project?.category?.toLowerCase() === 'art';

  // Helper lists of photos in the stacked folder pile (using thumbnail + gallery items)
  const imageStack = project && project.gallery && project.gallery.length > 0 
    ? project.gallery 
    : (project ? [project.thumbnail] : []);

  const uniqueImages = project 
    ? [project.thumbnail, ...(project.gallery || [])].filter((url, idx, self) => self.indexOf(url) === idx)
    : [];

  const slides = [
    { type: 'text' as const },
    ...uniqueImages.map(url => ({ type: 'image' as const, url }))
  ];

  // Load physical stamps from localStorage when a project is selected
  useEffect(() => {
    if (project) {
      const saved = localStorage.getItem(`stamps-${project.id}`);
      if (saved) {
        setStamps(JSON.parse(saved));
      } else {
        setStamps([]);
      }
      // Guarantee initial state of sheet is hidden when project changes
      setActiveSlideIdx(null);
    }
  }, [project]);

  // Keyboard navigation for Lightbox and Narrative page flipping
  useEffect(() => {
    if (activeSlideIdx === null || !project) return;
    
    const totalSlides = slides.length;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isTheaterMode) {
          setIsTheaterMode(false);
          if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
          }
          return;
        }
        setActiveSlideIdx(null);
        return;
      }

      if (totalSlides <= 1 || isTheaterMode) return;

      if (e.key === 'ArrowLeft') {
        // Go to Prev Page
        setActiveSlideIdx(prev => prev !== null ? (prev - 1 + totalSlides) % totalSlides : null);
      } else if (e.key === 'ArrowRight') {
        // Go to Next Page
        setActiveSlideIdx(prev => prev !== null ? (prev + 1) % totalSlides : null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeSlideIdx, project, slides.length, isTheaterMode]);

  if (!project) return null;

  // Add virtual ink stamps, mapping them to organic physical positions inside the folder pile
  const handleAddStamp = (type: string) => {
    playPaperClickSound();
    const updated = [...stamps, type];
    setStamps(updated);
    localStorage.setItem(`stamps-${project.id}`, JSON.stringify(updated));
  };

  const handleClearStamps = () => {
    setStamps([]);
    localStorage.removeItem(`stamps-${project.id}`);
  };

  const handleShareLink = () => {
    const shareText = `【${project.title}】年分: ${project.year}. Penny Bi 的作品文件夹。极简旋转收藏夹网站：${window.origin}`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stampCatalog = [
    { label: 'APPROVED / 质感卓绝', color: 'border-red-500 text-red-500 bg-red-500/5 rotate-[-12deg]' },
    { label: 'INSPIRED / 醍醐灌顶', color: 'border-blue-600 text-blue-600 bg-blue-600/5 rotate-[15deg]' },
    { label: 'COMPLEX / 概念极深', color: 'border-emerald-600 text-emerald-600 bg-emerald-600/5 rotate-[-8deg]' },
    { label: 'ESSENTIAL / 极简纯粹', color: 'border-amber-600 text-amber-600 bg-amber-600/5 rotate-[6deg]' }
  ];

  // Map stamp colors uniquely so you can stamp them directly in the folder pile layout
  const getStampClasses = (label: string) => {
    if (label.includes('APPROVED')) return 'border-red-500 text-red-650 dark:text-red-400 dark:border-red-450';
    if (label.includes('INSPIRED')) return 'border-blue-500 text-blue-650 dark:text-blue-400 dark:border-blue-450';
    if (label.includes('COMPLEX')) return 'border-emerald-600 text-emerald-655 dark:text-emerald-400 dark:border-emerald-450';
    return 'border-amber-600 text-amber-655 dark:text-amber-400 dark:border-amber-450';
  };

  // Double-check the blank area backdrop click to handle custom UX navigation:
  // "每次点击空白处会回到现在文件夹的状态（即关闭信纸回到本夹叠照片页面），而不是直接退回主页。"
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      if (activeSlideIdx !== null) {
        setActiveSlideIdx(null);
      } else {
        onClose();
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-50 bg-[#F6F5F2] dark:bg-[#0D0D10] flex items-center justify-center p-2 sm:p-6 overflow-y-auto"
      onClick={handleOverlayClick}
      id="project-detail-overlay"
    >
      {/* Absolute Header with close controls */}
      <div className="absolute top-4 sm:top-6 left-6 right-6 flex justify-end items-center gap-3 pointer-events-none z-30 select-none">
        {onMusicToggle && (
          <button
            type="button"
            onClick={() => { playKachaSound(); onMusicToggle(); }}
            className="pointer-events-auto cursor-pointer p-2 border border-stone-200 hover:border-black dark:border-zinc-800 dark:hover:border-white text-stone-600 hover:text-stone-900 dark:text-zinc-350 dark:hover:text-white transition-colors uppercase font-mono text-[9px] tracking-widest flex items-center gap-1.5 bg-[#F6F5F2]/50 dark:bg-[#0D0D10]/50"
            id="btn-music-esc"
            title={isPlaying ? "PAUSE MUSIC" : "PLAY MUSIC"}
          >
            {isPlaying ? (
              <>
                <Volume2 className="w-4 h-4 animate-pulse text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">MUSIC ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 opacity-60" />
                <span>MUSIC OFF</span>
              </>
            )}
          </button>
        )}
        <button
          type="button"
          onClick={() => { playKachaSound(); onClose(); }}
          className="pointer-events-auto cursor-pointer p-2 border border-stone-200 hover:border-black dark:border-zinc-800 dark:hover:border-white text-stone-400 hover:text-stone-900 dark:hover:text-zinc-150 transition-colors uppercase font-mono text-[9px] tracking-widest flex items-center gap-1"
          id="btn-general-esc"
        >
          <X className="w-4 h-4" /> <span>CLOSE / 关闭</span>
        </button>
      </div>

      {/* Centered Single Folder Presentation Board */}
      <div 
        className="relative w-full max-w-xl flex flex-col items-center justify-center select-none"
        onClick={(e) => e.stopPropagation()}
        id="project-detail-desk"
      >
        {/* CENTERPIECE PILE ELEMENT */}
        <div 
          className="w-full p-4 sm:p-8 flex flex-col items-center justify-center relative min-h-[490px] md:min-h-[580px]"
          id="dossier-folder-pile-section"
        >
          {/* Dossier Pile Envelope Assembly Wrapper with a beautiful organic float keeping elements synchronized */}
          <motion.div 
            className="relative w-[280px] sm:w-[330px] h-[380px] sm:h-[440px] mt-12 md:mt-4 flex items-center justify-center" 
            id="dossier-pile"
            initial={{ scale: 0.35, rotate: -25, y: 150, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, y: 0, opacity: 1 }}
            exit={{ scale: 0.35, rotate: -25, y: 150, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
          >
            <motion.div
              className="relative w-full h-full flex items-center justify-center"
              style={{ transformStyle: 'preserve-3d' }}
              animate={{
                y: [0, -15, 0, 15, 0],
                x: [0, 4, 0, -4, 0],
                rotate: [0, 1.2, 0, -1.2, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              
              {/* 1. LAYERED BACKGROUND: Vintage Notebook Lined Paper Sheet */}
            <motion.div 
              className="absolute w-[92%] h-[92%] bg-[#FCFAF5] rounded-3xs border border-stone-200 shadow-xs p-5 pt-8 pl-8 select-none cursor-pointer group/notebook"
              style={{ 
                backgroundImage: 'linear-gradient(#e2e8f0 1.2px, transparent 1.2px)',
                backgroundSize: '100% 16px',
                zIndex: 1
              }}
              animate={{
                y: [-45, -57, -45, -33, -45],
                x: [-6, -10, -6, -2, -6],
                rotate: -4
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              onClick={() => {
                playPaperClickSound();
                setActiveSlideIdx(0);
              }}
              id="lined-notebook-page"
            >
              {/* Notebook pink vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-red-300/60" />
              
              <div className="flex flex-col gap-1 font-mono text-[7px] sm:text-[8px] text-stone-700/80 leading-relaxed mt-2 pl-2 text-left">
                <p className="font-sans font-bold text-[8px] uppercase tracking-widest text-[#1A1A1A]/40 mb-1">DOCKET REGISTRY / 档案备忘</p>
                <p>— COMPONENT: {project.title.split('/')[0].trim()}</p>
                <p>— SUB_TYPE : {project.subtitle?.split('/')[0].trim() || project.category}</p>
                <p>— TIMEFRAME: {project.dateRange || project.year}</p>
                <p>— SITE_LOC : {project.location || "Shanghai"}</p>
                <p>— TEAM_ROLE: {project.role || "Designer"}</p>
                <div className="mt-3.5 font-sans text-[7.5px] tracking-wide text-amber-600 group-hover/notebook:text-amber-800 font-bold uppercase leading-tight flex items-center gap-1.5 transition-colors">
                  <ArrowUp className="w-3 h-3 animate-bounce" /> 点击信纸查看设计说明
                </div>
              </div>
            </motion.div>

            {/* 2. LAYERED BACKWARD GRAPHICS: Stack of Polaroid-styled Photo Cards */}
            {imageStack.map((img, idx) => {
              if (idx > 2) return null; // limit background image stack to 3 items
              
              let yVals = [0, 0, 0, 0, 0];
              let xVals = [0, 0, 0, 0, 0];
              let rotVal = 0;
              let hoverY = 0;
              let hoverX = 0;
              let hoverRot = 0;

              if (idx === 0) {
                yVals = [-58, -72, -58, -44, -58];
                xVals = [22, 26, 22, 18, 22];
                rotVal = 7;
                hoverY = -120;
                hoverX = 35;
                hoverRot = 5;
              } else if (idx === 1) {
                yVals = [-76, -92, -76, -60, -76];
                xVals = [-32, -38, -32, -26, -32];
                rotVal = -9;
                hoverY = -140;
                hoverX = -55;
                hoverRot = -7;
              } else {
                yVals = [-94, -110, -94, -78, -94];
                xVals = [2, 6, 2, -2, 2];
                rotVal = 2;
                hoverY = -160;
                hoverX = 10;
                hoverRot = 1;
              }

              const isHovered = hoveredCardIdx === idx;
              const zIndex = isHovered ? 30 : (idx === 0 ? 4 : idx === 1 ? 3 : 2);

              return (
                <motion.div
                  key={`polaroid-${idx}`}
                  className="absolute w-[160px] sm:w-[190px] h-[190px] sm:h-[220px] bg-white dark:bg-zinc-850 p-2 sm:p-2.5 pb-6 sm:pb-8 border border-stone-200/90 dark:border-zinc-750 shadow-md group/pile cursor-zoom-in active:scale-95"
                  style={{
                    zIndex: zIndex
                  }}
                  animate={{
                    y: isHovered ? hoverY : yVals,
                    x: isHovered ? hoverX : xVals,
                    rotate: isHovered ? hoverRot : rotVal,
                    scale: isHovered ? 1.12 : 1
                  }}
                  transition={{
                    y: isHovered ? { type: "spring", stiffness: 150, damping: 20 } : { duration: 6 + idx, repeat: Infinity, ease: "easeInOut" },
                    x: isHovered ? { type: "spring", stiffness: 150, damping: 20 } : { duration: 6 + idx, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 0.3 },
                    scale: { duration: 0.3 }
                  }}
                  onMouseEnter={() => setHoveredCardIdx(idx)}
                  onMouseLeave={() => setHoveredCardIdx(null)}
                  onClick={() => {
                    playPaperClickSound();
                    const slideIdx = slides.findIndex(s => s.type === 'image' && s.url === img);
                    if (slideIdx !== -1) {
                      setActiveSlideIdx(slideIdx);
                    }
                  }}
                  id={`stacked-polaroid-${idx}`}
                >
                  <div className="w-full h-[82%] bg-[#1A1A1A]/5 overflow-hidden">
                    <img 
                      src={optimizeImgUrl(img, 600, 80)} 
                      alt="archive component"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover grayscale-[8%] sepia-[2%] group-hover/pile:grayscale-0 group-hover/pile:scale-[1.03] duration-500 transition-all"
                    />
                  </div>
                  {/* Handwritten reference label below illustration */}
                  <div className="mt-1 flex justify-between items-center px-0.5 font-serif italic text-[8.5px] text-zinc-400">
                    <span>fig. 0{idx + 1} // stack plate</span>
                    <span className="font-mono text-[7px] uppercase tracking-wider">{project.category}</span>
                  </div>
                </motion.div>
              );
            })}

            {/* 3. THE FOREGROUND MANILA FILE FOLDER COVER (Beige Cardboard Sleeve) */}
            <motion.div 
              className="absolute w-[245px] sm:w-[285px] h-[290px] sm:h-[340px] bg-[#E7DAC4] dark:bg-[#d8c5aa]/20 border border-[#b89f7f]/50 dark:border-amber-900/10 rounded-r-xs rounded-l-3xs shadow-lg flex flex-col pt-5 px-3 z-10 select-none cursor-default"
              animate={{
                y: [42, 35, 42, 49, 42],
                x: [2, -2, 2, 6, 2],
                rotate: [1, 0.4, 1, 1.6, 1]
              }}
              transition={{
                duration: 9,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ transformStyle: 'preserve-3d' }}
              id="manila-envelope-flap"
            >
              {/* Standard File Tab on the Left Flap edge (Vertical handwriting note) */}
              <div 
                className="absolute w-[25px] h-[110px] bg-[#E7DAC4] dark:bg-zinc-900/40 absolute -left-[24.5px] top-[48px] rounded-l-md border-y border-l border-[#b89f7f]/50 dark:border-zinc-800 flex items-center justify-center shadow-xs"
                id="manila-file-tab"
              >
                <div 
                  className="font-mono text-stone-600 dark:text-zinc-500 font-extrabold text-[6.5px] sm:text-[7px] tracking-[0.12em] uppercase whitespace-nowrap"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                  id="tab-handwriting"
                >
                  {(project.projectType || project.category).toUpperCase()}
                </div>
              </div>

              {/* Internal subtle paper fold/crimp shadow lines */}
              <div className="absolute left-[3px] top-0 bottom-0 w-[0.5px] bg-[#b49875]/35" />
              <div className="absolute left-[5px] top-0 bottom-0 w-[0.5px] bg-white/20" />

              {/* 4. THE WHITE COVER RECORD SHEET PASTED ON FRONT (Beautiful design detail with high-contrast typography) */}
              <div 
                className="w-full h-[96%] bg-[#FCFAF5] dark:bg-zinc-900 p-4 shadow-sm border border-stone-200/85 dark:border-zinc-800 rounded-2xs flex flex-col justify-between items-center relative text-center"
                id="pasted-cover-plate"
              >
                {/* Vintage Binder Corner Pins */}
                <div className="absolute top-1.5 left-1.5 w-1 h-1 rounded-full bg-stone-300 dark:bg-zinc-700" />
                <div className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-stone-300 dark:bg-zinc-700" />

                {/* Typographical project cover labels */}
                <div className="flex flex-col gap-2 w-full my-auto py-5" id="cover-text-fields">
                  <h3 
                    className="font-sans font-black text-[13px] sm:text-[14.5px] text-[#1A1A1A] dark:text-zinc-105 uppercase tracking-wider leading-snug max-w-[200px] mx-auto"
                    id="cover-primary-bold-title"
                  >
                    {project.title.split('/')[0].trim()}
                  </h3>
                  
                  <div className="w-8 h-[0.75px] bg-stone-300 dark:bg-zinc-800 mx-auto" />
                  
                  <p 
                    className="font-sans font-extrabold text-[7px] sm:text-[7.8px] text-amber-600 dark:text-amber-500 max-w-[185px] mx-auto tracking-widest uppercase leading-normal"
                    id="cover-serif-year-headline"
                  >
                    {cleanChineseFromField(project.projectType || "PRACTICAL WORK", isArtCategory)}
                  </p>
                </div>

                {/* 5. Genuinely detailed Swiss-style Project specs (as on the file bag image) */}
                <div 
                  className="w-full border-t border-stone-200 dark:border-zinc-800 pt-2 pb-0.5 gap-0.5 sm:gap-1 flex flex-col items-stretch text-left font-mono tracking-tight text-[6.5px] sm:text-[7.2px] text-zinc-650 dark:text-zinc-400 leading-normal" 
                  id="cover-specs-grid"
                >
                  <div className="flex justify-between items-baseline border-b border-dotted border-stone-150 dark:border-zinc-800 pb-0.5">
                    <span className="font-extrabold text-[#1A1A1A] dark:text-zinc-350 shrink-0">TYPE //</span>
                    <span className="text-right ml-4 max-w-[75%] font-medium text-stone-700 dark:text-zinc-300 break-words leading-tight">{cleanChineseFromField(project.projectType || "Practical Design Work", isArtCategory)}</span>
                  </div>
                  {project.id !== 'cabinet-of-curiosities' && (
                    <div className="flex justify-between items-baseline border-b border-dotted border-stone-150 dark:border-zinc-800 pb-0.5">
                      <span className="font-extrabold text-[#1A1A1A] dark:text-zinc-350 shrink-0">
                        {['joints', 'museum-island', 'hub', 'zootopia', 'diverse-city'].includes(project.id)
                          ? "ADVISOR //"
                          : (project.id === 'summer-lotus-reflection' || project.id === 'snowy-night-light')
                          ? "MEDIUM //"
                          : (project.category?.toLowerCase() === 'art' || project.id === 'sound-map')
                          ? "INSTRUCTOR //"
                          : "PLOT //"}
                      </span>
                      <span className="text-right ml-4 max-w-[75%] font-medium text-stone-700 dark:text-zinc-300 break-words leading-tight">
                        {['joints', 'museum-island', 'hub', 'zootopia', 'diverse-city'].includes(project.id)
                          ? cleanChineseFromField(project.areaDetails?.replace(/^ADVISOR:\s*/i, '') || "N/A", isArtCategory)
                          : cleanChineseFromField(project.areaDetails || "PLOT AREA: N/A", isArtCategory)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-baseline border-b border-dotted border-stone-150 dark:border-zinc-800 pb-0.5">
                    <span className="font-extrabold text-[#1A1A1A] dark:text-zinc-350 shrink-0">ROLE //</span>
                    <span className="text-right ml-4 max-w-[75%] font-medium text-stone-700 dark:text-zinc-300 break-words leading-tight">{cleanChineseFromField(project.role || "Chief Designer", isArtCategory)}</span>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-dotted border-stone-150 dark:border-zinc-800 pb-0.5">
                    <span className="font-extrabold text-[#1A1A1A] dark:text-zinc-350">DATE //</span>
                    <span className="text-right font-serif italic">{cleanChineseFromField(project.dateRange || project.year, isArtCategory)}</span>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-dotted border-stone-150 dark:border-zinc-800 pb-0.5">
                    <span className="font-extrabold text-[#1A1A1A] dark:text-zinc-350">LOC //</span>
                    <span className="text-right">{cleanChineseFromField(project.location || "Shanghai", isArtCategory)}</span>
                  </div>
                  <div className="flex flex-col gap-0.5 pt-0.5">
                    <span className="font-extrabold text-[#1A1A1A] dark:text-zinc-350">CONTRIBUTION //</span>
                    <span className="text-[5.8px] sm:text-[6.4px] text-justify font-sans leading-tight text-stone-500 dark:text-zinc-450">{cleanChineseFromField(project.contribution || "Concept Design & Visual Layout", isArtCategory)}</span>
                  </div>
                </div>

              </div>
            </motion.div>

            </motion.div>
          </motion.div>

          {/* Quick instructions indicator */}
          <span className="mt-14 font-mono text-[8px] font-bold text-stone-400 dark:text-zinc-500 uppercase tracking-[0.15em] flex flex-row items-center justify-center gap-1.5 text-center whitespace-nowrap">
            <Eye className="w-3.5 h-3.5 text-amber-500 shrink-0" /> 
            点击堆叠纸张或信页翻阅 // CLICK PILE CONTENT OR NOTEBOOK SHEET TO VIEW DETAILED BIO
          </span>

        </div>
      </div>

      {/* LUXURY PORTFOLIO LIGHTBOX OPTICAL MODULE (Includes the Letter/Memorandum stationary page as slide 0) */}
      {activeSlideIdx !== null && (
        <div 
          className="fixed inset-0 z-[100] bg-[#F6F5F2] dark:bg-[#0D0D10] backdrop-blur-md flex flex-col justify-center items-center p-4 cursor-zoom-out select-none animate-in fade-in duration-200"
          onClick={() => setActiveSlideIdx(null)}
          id="prism-lightbox"
        >
          {/* Subtle design references */}
          <div className="absolute top-4 left-6 flex items-center gap-2 text-stone-500/80 dark:text-zinc-400/80 text-[10px] font-mono tracking-[0.2em]" id="lightbox-top">
            <span>
              {slides[activeSlideIdx]?.type === 'text' 
                ? 'DETAILED RECORD MEMORANDUM // 设计详述信纸' 
                : `DETAILED FIELD PLATE ZOOM // 档案画幅 [0${activeSlideIdx}/${slides.length - 1}]`}
            </span>
          </div>

          {/* Top Control Bar with Music Toggle and Close */}
          <div className="absolute top-4 right-6 flex items-center gap-3 z-[110]" onClick={(e) => e.stopPropagation()}>
            {onMusicToggle && (
              <button
                type="button"
                onClick={onMusicToggle}
                className="cursor-pointer p-1.5 sm:p-2 border border-stone-200 hover:border-black dark:border-zinc-805 dark:hover:border-white text-stone-600 hover:text-stone-900 dark:text-zinc-350 dark:hover:text-white transition-colors uppercase font-mono text-[8px] sm:text-[9px] tracking-widest flex items-center gap-1.5 bg-[#F6F5F2]/50 dark:bg-[#0D0D10]/50"
                id="lightbox-btn-music"
                title={isPlaying ? "PAUSE MUSIC" : "PLAY MUSIC"}
              >
                {isPlaying ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">MUSIC ON</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-60" />
                    <span>MUSIC OFF</span>
                  </>
                )}
              </button>
            )}
            <button
              type="button"
              onClick={() => setActiveSlideIdx(null)}
              className="cursor-pointer text-[#1A1A1A]/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors p-1.5"
              id="lightbox-close-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Pagination Controls */}
          {slides.length > 1 && (
            <>
              {/* Left Arrow - Previous Page (上一页) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  playPaperClickSound();
                  const prevIdx = (activeSlideIdx - 1 + slides.length) % slides.length;
                  setActiveSlideIdx(prevIdx);
                }}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-[110] flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-stone-300/60 dark:border-white/10 bg-white/60 dark:bg-black/30 text-stone-600 dark:text-white/40 hover:text-black dark:hover:text-white hover:bg-white dark:hover:bg-black/60 hover:border-black/30 dark:hover:border-white/25 cursor-pointer transition-all active:scale-95 select-none shadow-3xs"
                id="lightbox-prev-page-btn"
                title="上一页"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300" />
              </button>

              {/* Right Arrow - Next Page (下一页) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  playPaperClickSound();
                  const nextIdx = (activeSlideIdx + 1) % slides.length;
                  setActiveSlideIdx(nextIdx);
                }}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-[110] flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-stone-300/60 dark:border-white/10 bg-white/60 dark:bg-black/30 text-stone-600 dark:text-white/40 hover:text-black dark:hover:text-white hover:bg-white dark:hover:bg-black/60 hover:border-black/30 dark:hover:border-white/25 cursor-pointer transition-all active:scale-95 select-none shadow-3xs"
                id="lightbox-next-page-btn"
                title="下一页"
              >
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300" />
              </button>
            </>
          )}

          {/* Core Content Box based on active slide type */}
          {slides[activeSlideIdx]?.type === 'text' ? (
            /* Render the beautiful vintage detailed written note sheet (the "信纸页") */
            <div 
              className="relative w-full max-w-lg bg-[#FAF8F5] dark:bg-zinc-900 border border-stone-350 dark:border-zinc-800 shadow-2xl p-6 sm:p-10 rounded-xs text-left flex flex-col justify-between max-h-[85vh] overflow-y-auto cursor-default animate-in fade-in zoom-in-95 duration-200 z-[105]"
              onClick={(e) => e.stopPropagation()}
              id="narrative-sheet-paper"
              style={{
                backgroundImage: 'radial-gradient(#e5e7eb 0.75px, transparent 0.75px)',
                backgroundSize: '12px 12px',
              }}
            >
              {/* Retro clip paper binder decor at top */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-stone-200 dark:bg-zinc-850" />
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-amber-100/35 dark:bg-amber-950/20 border-b border-amber-200/20 rounded-xs rotate-[0.5deg] shadow-2xs" />

              {/* Header section with Label */}
              <div className="flex justify-between items-start border-b border-stone-350 dark:border-zinc-700 pb-3" id="sheet-header">
                <div className="flex flex-col gap-0.5" id="sheet-sector">
                  <span className="text-[8.5px] font-mono text-stone-400 dark:text-zinc-550 uppercase tracking-widest font-bold">MEMORANDUM / 档案详述</span>
                </div>
              </div>

              {/* Core textual description */}
              <div className="my-5 space-y-4 font-sans text-stone-800 dark:text-zinc-350" id="sheet-text-content">
                <div className="mb-2" id="sheet-meta-grid">
                  <h2 className="font-sans font-black text-xl sm:text-2xl text-[#1A1A1A] dark:text-zinc-100 leading-none uppercase tracking-tight">
                    {project.title.split('/')[0].trim()}
                  </h2>
                  {project.subtitle && (
                    <p className="font-sans font-bold text-[9px] text-amber-600 dark:text-amber-500 uppercase tracking-widest mt-1.5">{project.subtitle}</p>
                  )}
                  
                  <div className="mt-3.5 grid grid-cols-3 gap-2 sm:gap-4 text-[8px] sm:text-[8.5px] font-mono bg-[#EFECE6]/50 dark:bg-zinc-950/40 p-2.5 rounded-none border border-stone-250 dark:border-zinc-800 leading-normal">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-stone-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">TIMEFRAME // 项目时间</span>
                      <span className="text-zinc-850 dark:text-zinc-200 font-bold">{project.dateRange || project.year}</span>
                    </div>
                    <div className="flex flex-col gap-0.5 border-l border-stone-250 dark:border-zinc-800 pl-2">
                       <span className="text-stone-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">COMPANY // 公司</span>
                      <span className="text-zinc-850 dark:text-zinc-200 font-bold">{project.client}</span>
                    </div>
                    <div className="flex flex-col gap-0.5 border-l border-stone-250 dark:border-zinc-800 pl-2">
                      <span className="text-stone-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">LOCATION // 项目地点</span>
                      <span className="text-zinc-850 dark:text-zinc-200 font-bold">{project.location || "SHANGHAI"}</span>
                    </div>
                  </div>

                  {project.videoUrl && (() => {
                    const embedInfo = getEmbedDetails(project.videoUrl);
                    if (embedInfo) {
                      return (
                        <div className="mt-4 flex flex-col gap-2 w-full" onClick={(e) => e.stopPropagation()}>
                          <div className="relative w-full aspect-video rounded-xs border border-stone-250 dark:border-zinc-800 bg-black overflow-hidden shadow-xs">
                            {embedInfo.type === 'bilibili' && (
                              <iframe
                                src={embedInfo.embedUrl}
                                scrolling="no"
                                allowFullScreen={true}
                                allow="autoplay; fullscreen; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                className="absolute inset-0 w-full h-full border-0"
                                title={embedInfo.title}
                              />
                            )}
                            {embedInfo.type === 'youtube' && (
                              <iframe
                                src={embedInfo.embedUrl}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen={true}
                                className="absolute inset-0 w-full h-full border-0"
                                title={embedInfo.title}
                              />
                            )}
                            {embedInfo.type === 'direct' && (
                              <video
                                src={embedInfo.url}
                                controls={true}
                                autoPlay={true}
                                muted={true}
                                playsInline={true}
                                className="absolute inset-0 w-full h-full object-contain"
                              />
                            )}
                          </div>
                          
                          {/* Subtext and link to open externally */}
                          <div className="flex justify-between items-center px-1">
                            <span className="font-mono text-[7px] text-stone-400 dark:text-zinc-550 uppercase tracking-widest font-bold">
                              {embedInfo.type === 'bilibili' ? 'Embedded Player // 内联视频播放' : 'Embedded Video // 视频播放'}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  playKachaSound();
                                  setIsTheaterMode(true);
                                }}
                                className="cursor-pointer font-mono text-[7.2px] font-extrabold text-[#0f766e] dark:text-[#2dd4bf] hover:underline flex items-center gap-1 uppercase bg-transparent border-0 p-0"
                              >
                                THEATER MODE / 全屏剧场 ⛶
                              </button>
                              <span className="text-stone-300 dark:text-zinc-700 font-mono text-[7px]">|</span>
                              <a
                                href={project.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-[7.2px] font-extrabold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 uppercase"
                              >
                                OPEN EXTERNALLY / 外链打开 ↗
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div className="mt-3">
                          <a
                            href={project.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 border border-[#b89f7f]/45 hover:border-amber-600 bg-amber-500/5 hover:bg-amber-500/10 text-amber-700 dark:text-amber-400 py-2 sm:py-2.5 px-4 font-mono text-[8px] sm:text-[9px] font-bold tracking-widest uppercase transition-all duration-300 shadow-3xs"
                            onClick={(e) => e.stopPropagation()}
                            id="sheet-video-btn"
                          >
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                            </span>
                            WATCH RESIDUAL DOCUMENTATION / 观看视频实录 [BILIBILI]
                          </a>
                        </div>
                      );
                    }
                  })()}
                </div>

                {/* Highly structured bilingual Design Statement module as requested */}
                <div className="space-y-3 px-0.5 leading-relaxed text-[11px] sm:text-[12px]" id="sheet-design-statement">
                  {project.id === "jingyi-bi-bio" ? (
                    <div className="flex flex-col gap-4 font-sans text-stone-850 dark:text-zinc-250 leading-relaxed text-[10.5px] sm:text-[11.5px]" id="sheet-biography-portal">
                      
                      {/* Bio Statement Section */}
                      <div className="flex flex-col gap-1.5 pb-3 border-b border-stone-200 dark:border-zinc-800" id="intro-desc-node">
                        <span className="font-mono text-[7px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest">ABOUT THE CREATOR // 个人特质描述</span>
                        <p className="text-[#1A1A1A] dark:text-zinc-100 font-bold font-sans text-[11.5px] sm:text-[12.5px] leading-relaxed tracking-wide">
                          Penny Bi
                        </p>
                        <p className="text-stone-705 dark:text-zinc-300 font-sans font-medium text-justify">
                          建筑背景的跨媒介创作者、设计师与教育者。
                        </p>
                        <p className="text-stone-650 dark:text-zinc-400 font-sans font-light text-justify leading-relaxed">
                          毕业于哈佛大学设计学院，实践横跨建筑、空间、影像与数字媒介，关注身体、感知与技术如何共同塑造空间体验。<br/>
                          本网站是一座持续更新的个人画廊，用以呈现作品、实验与研究过程。
                        </p>
                      </div>

                      {/* Experience and Directs Row Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-stone-200 dark:border-zinc-800" id="experience-focus-columns">
                        
                        <div className="flex flex-col gap-1.5">
                          <span className="font-mono text-[7px] font-bold text-stone-400 dark:text-zinc-550 uppercase tracking-widest">CORE TIMELINE // 核心经历</span>
                          <ul className="space-y-1.5 text-stone-750 dark:text-zinc-300 font-sans text-[10px] sm:text-[10.8px] list-none pl-0">
                            <li className="flex items-start gap-1">
                              <span className="text-amber-500 font-bold text-[8.5px] mt-0.5 shrink-0">■</span>
                              <span><strong className="text-zinc-900 dark:text-zinc-100 font-bold">哈佛大学设计学院</strong> 建筑学硕士（M.Arch II）</span>
                            </li>
                            <li className="flex items-start gap-1">
                              <span className="text-amber-500 font-bold text-[8.5px] mt-0.5 shrink-0">■</span>
                              <span><strong className="text-zinc-900 dark:text-zinc-100 font-bold">MIT</strong> 计算与生成设计方向（Shape Grammar）</span>
                            </li>
                            <li className="flex items-start gap-1">
                              <span className="text-amber-500 font-bold text-[8.5px] mt-0.5 shrink-0">■</span>
                              <span><strong className="text-zinc-900 dark:text-zinc-100 font-bold">如恩设计研究室（Neri&Hu）</strong> ｜ <strong className="text-zinc-900 dark:text-zinc-100 font-bold">OMA 纽约事务所</strong></span>
                            </li>
                            <li className="flex items-start gap-1">
                              <span className="text-amber-500 font-bold text-[8.5px] mt-0.5 shrink-0">■</span>
                              <span><strong className="text-zinc-900 dark:text-zinc-100 font-bold">厦门大学嘉庚学院</strong> 建筑学教师</span>
                            </li>
                          </ul>
                        </div>

                        <div className="flex flex-col gap-1.5 border-t sm:border-t-0 sm:border-l border-stone-200 dark:border-zinc-800 pt-3 sm:pt-0 sm:pl-3">
                          <span className="font-mono text-[7px] font-bold text-stone-400 dark:text-zinc-550 uppercase tracking-widest">PRACTICE FOCUS // 实践方向</span>
                          <ul className="space-y-1.5 text-stone-750 dark:text-zinc-300 font-sans text-[10px] sm:text-[10.8px] list-none pl-0">
                            <li className="flex items-start gap-1">
                              <span className="text-zinc-450 dark:text-zinc-500 text-[8.5px] mt-0.5 shrink-0">□</span>
                              <span>建筑与室内设计（文化、剧场、商业、酒店）</span>
                            </li>
                            <li className="flex items-start gap-1">
                              <span className="text-zinc-450 dark:text-zinc-500 text-[8.5px] mt-0.5 shrink-0">□</span>
                              <span>空间概念与叙事</span>
                            </li>
                            <li className="flex items-start gap-1">
                              <span className="text-zinc-450 dark:text-zinc-500 text-[8.5px] mt-0.5 shrink-0">□</span>
                              <span>建成项目与落地协调</span>
                            </li>
                            <li className="flex items-start gap-1">
                              <span className="text-zinc-450 dark:text-zinc-500 text-[8.5px] mt-0.5 shrink-0">□</span>
                              <span>数字媒介与实验性创作</span>
                            </li>
                            <li className="flex items-start gap-1">
                              <span className="text-zinc-450 dark:text-zinc-500 text-[8.5px] mt-0.5 shrink-0">□</span>
                              <span>教学与设计研究</span>
                            </li>
                          </ul>
                        </div>

                      </div>

                      {/* Skills Checklist Segment */}
                      <div className="flex flex-col gap-2 pt-0.5" id="skills-atlas">
                        <span className="font-mono text-[7px] font-bold text-stone-400 dark:text-zinc-550 uppercase tracking-widest">TECHNICAL CAPABILITIES // 技能清单</span>
                        
                        <div className="grid grid-cols-2 gap-3.5 text-[9.5px] sm:text-[10.2px] leading-relaxed">
                          
                          <div className="flex flex-col gap-1">
                            <span className="font-extrabold uppercase text-amber-700 dark:text-amber-500 border-b border-stone-200 dark:border-zinc-800 pb-0.5 font-sans">设计与建模 // Modeling</span>
                            <span className="text-stone-701 dark:text-zinc-350 select-text leading-tight sm:leading-normal font-sans">
                              AutoCAD · Rhino · Grasshopper<br/>
                              SketchUp · Revit
                            </span>
                          </div>

                          <div className="flex flex-col gap-1">
                            <span className="font-extrabold uppercase text-amber-700 dark:text-amber-500 border-b border-stone-200 dark:border-zinc-800 pb-0.5 font-sans">视觉与表达 // Vis</span>
                            <span className="text-stone-701 dark:text-zinc-350 select-text leading-tight sm:leading-normal font-sans">
                              Photoshop · Illustrator · InDesign<br/>
                              Lightroom<br/>
                              Enscape · V-Ray · Twinmotion
                            </span>
                          </div>

                          <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
                            <span className="font-extrabold uppercase text-amber-700 dark:text-amber-500 border-b border-stone-200 dark:border-zinc-800 pb-0.5 font-sans">数字与新媒介 // Interactive</span>
                            <span className="text-stone-701 dark:text-zinc-350 select-text leading-tight sm:leading-normal font-sans">
                              TouchDesigner<br/>
                              实时影像 / 声音 / 互动系统<br/>
                              VR / 动作捕捉 / 空间可视化实验
                            </span>
                          </div>

                          <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
                            <span className="font-extrabold uppercase text-amber-700 dark:text-amber-500 border-b border-stone-200 dark:border-zinc-800 pb-0.5 font-sans">语言 // Languages</span>
                            <span className="text-stone-701 dark:text-zinc-350 select-text leading-tight sm:leading-normal font-sans font-bold">
                              中文 (Chinese) · English (English)
                            </span>
                          </div>

                        </div>
                      </div>

                    </div>
                  ) : (
                    <>
                      {project.designStatementEN && (
                        <div className="flex flex-col gap-1.5 pb-2.5 border-b border-stone-200 dark:border-zinc-800">
                          <span className="font-mono text-[7px] font-bold text-stone-400 dark:text-zinc-550 uppercase tracking-widest">DESIGN STATEMENT (EN)</span>
                          <p className="text-[#1A1A1A] dark:text-zinc-200 text-justify font-sans font-medium selection:bg-amber-150/40 leading-relaxed">
                            "{project.designStatementEN}"
                          </p>
                        </div>
                      )}
                      
                      {project.designStatementCN && (
                        <div className="flex flex-col gap-1.5 pt-1.5 pb-1">
                          <span className="font-mono text-[7px] font-bold text-stone-400 dark:text-zinc-550 uppercase tracking-widest">设计说明 (CN)</span>
                          <p className="text-stone-750 dark:text-zinc-350 text-justify font-sans font-light leading-relaxed tracking-wide selection:bg-amber-150/40">
                             “{project.designStatementCN}”
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Minimalist quiet footer replacing all busy controls as requested */}
              <div className="mt-4 pt-4 border-t border-stone-200 dark:border-zinc-800 flex items-center justify-between font-mono text-[7.5px] sm:text-[8px] text-stone-405 dark:text-zinc-550 uppercase tracking-widest" id="sheet-simple-footer">
                <span>© Penny Bi // ARCHIVAL PLATE</span>
                <button
                  type="button"
                  onClick={() => {
                    playPaperClickSound();
                    setActiveSlideIdx(null);
                  }}
                  className="font-bold hover:text-amber-600 dark:hover:text-amber-500 underline underline-offset-2 transition-colors cursor-pointer"
                  id="sheet-simple-return-btn"
                >
                  RETURN TO ENVELOPE / 返回封面
                </button>
              </div>

            </div>
          ) : (
            /* Render the beautiful photographic image slide */
            <div className="relative max-w-4xl max-h-[80vh] bg-transparent border-none flex items-center justify-center" id="lightbox-photo-plate">
              <img 
                src={optimizeImgUrl(slides[activeSlideIdx]?.url || '', 1200, 95)} 
                alt="enlarged plate detail" 
                referrerPolicy="no-referrer"
                className="object-contain max-h-[80vh] max-w-full shadow-md rounded-xs border border-stone-250/20 dark:border-zinc-800/20"
              />
            </div>
          )}
        </div>
      )}

      {/* THEATER MODE FULLSCREEN OVERLAY */}
      {isTheaterMode && project.videoUrl && (() => {
        const embedInfo = getEmbedDetails(project.videoUrl);
        if (!embedInfo) return null;
        return (
          <div 
            className="fixed inset-0 z-[250] bg-black flex flex-col justify-center items-center p-0 md:p-6 select-none animate-in fade-in duration-200"
            onClick={() => setIsTheaterMode(false)}
            id="theater-container"
          >
            {/* Top Bar for theater mode */}
            <div className="absolute top-4 left-6 right-6 flex justify-between items-center z-[260] pointer-events-none">
              <span className="font-mono text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] truncate max-w-[50%]">
                THEATER MODE / 全屏剧场播放 // {project.title.split('/')[0].trim()}
              </span>
              <button
                type="button"
                onClick={() => setIsTheaterMode(false)}
                className="pointer-events-auto cursor-pointer p-2 border border-zinc-800 hover:border-white text-zinc-400 hover:text-white transition-colors uppercase font-mono text-[9px] tracking-widest flex items-center gap-1.5 bg-black/60"
              >
                <X className="w-4 h-4" /> <span>EXIT THEATER / 退出全屏</span>
              </button>
            </div>

            {/* Video wrapper */}
            <div 
              className="w-full max-w-5xl aspect-video bg-black flex items-center justify-center relative shadow-2xl border border-zinc-900"
              onClick={(e) => e.stopPropagation()}
            >
              {embedInfo.type === 'bilibili' && (
                <iframe
                  src={embedInfo.embedUrl}
                  scrolling="no"
                  allowFullScreen={true}
                  allow="autoplay; fullscreen; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  className="absolute inset-x-0 inset-y-0 w-full h-full border-0"
                  title={embedInfo.title}
                />
              )}
              {embedInfo.type === 'youtube' && (
                <iframe
                  src={embedInfo.embedUrl}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen={true}
                  className="absolute inset-x-0 inset-y-0 w-full h-full border-0"
                  title={embedInfo.title}
                />
              )}
              {embedInfo.type === 'direct' && (
                <video
                  src={embedInfo.url}
                  controls={true}
                  autoPlay={true}
                  muted={true}
                  playsInline={true}
                  className="absolute inset-x-0 inset-y-0 w-full h-full object-contain"
                />
              )}
            </div>
            
            <div className="absolute bottom-20 max-w-sm sm:max-w-md md:max-w-xl text-center px-5 py-2.5 bg-neutral-900/60 dark:bg-zinc-950/60 rounded border border-zinc-805/40 backdrop-blur-xs select-none pointer-events-auto">
              <span className="font-bold text-amber-400 block text-[9px] tracking-widest uppercase mb-1">💡 HD Quality Tip // 超清画质提示</span>
              <p className="font-sans text-[8.5px] text-zinc-300 leading-normal">
                由于现代浏览器限制第三方网站的 Cookie 传输，内嵌网页播放器通常默认限制在清晰度较低（480P）状态。<br />
                如需解锁 <b>1080P/4K 超清 60帧画质</b>，您可以在本播放器内双击画面，或点击右下角极速在 Bilibili 官方窗口中播放！
              </p>
              <p className="font-mono text-[7px] text-zinc-500 mt-1 uppercase tracking-wide">
                Third-party browser cookie blocks limit third-party embeds to 480P. Click 'OPEN EXTERNALLY / 外链打开 ↗' or hover over video controls to toggle setting gear for native 1080P/4K stream.
              </p>
            </div>
            
            <div className="absolute bottom-5 text-center font-mono text-[8px] text-zinc-500 uppercase tracking-widest pointer-events-none">
              Press ESC or Click Outside to exit theater mode / 按 ESC 键或点击空白可退出全屏
            </div>
          </div>
        );
      })()}
    </motion.div>
  );
}
