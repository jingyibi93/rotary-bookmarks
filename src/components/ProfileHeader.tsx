import { ProfileInfo } from '../types';
import { Mail, Github, Instagram, ArrowUpRight, Plus, Eye } from 'lucide-react';

interface ProfileHeaderProps {
  profile: ProfileInfo;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  categories: string[];
  onOpenDashboard: () => void;
  onShowHelp: () => void;
}

export function ProfileHeader({
  profile,
  activeCategory,
  setActiveCategory,
  categories,
  onOpenDashboard,
  onShowHelp
}: ProfileHeaderProps) {
  return (
    <header className="w-full max-w-7xl mx-auto px-6 pt-12 pb-6 flex flex-col gap-10 md:gap-14" id="profile-header-section">
      {/* Top Bar Navigation */}
      <div className="flex justify-between items-start border-b border-[#1A1A1A]/10 dark:border-white/10 pb-5" id="nav-top-bar">
        <div className="flex flex-col gap-1" id="brand-logo-grp">
          <span className="text-[11px] tracking-[0.25em] font-bold uppercase text-[#1A1A1A] dark:text-zinc-100 font-sans">
            {profile.englishName}
          </span>
          <span className="text-[9px] tracking-[0.2em] uppercase text-[#1A1A1A]/50 dark:text-zinc-400 font-mono">
            {profile.role.split('/')[0].trim()}
          </span>
        </div>
        
        <div className="flex items-center gap-6 text-[10px] tracking-[0.2em] font-mono" id="nav-actions-grp">
          <button 
            type="button"
            onClick={onShowHelp}
            className="text-[#1A1A1A]/40 hover:text-[#1A1A1A] dark:text-zinc-400 dark:hover:text-white transition-opacity cursor-pointer flex items-center gap-1.5 uppercase font-medium"
            id="btn-nav-help"
          >
            <Eye className="w-3.5 h-3.5 stroke-[1.5]" />
            <span>玩法指南 / GUIDE</span>
          </button>

          <button 
            type="button"
            onClick={onOpenDashboard}
            className="tracking-[0.1em] text-[10px] uppercase font-bold border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-zinc-950 transition-all cursor-pointer flex items-center gap-1 py-1.5 px-3.5"
            id="btn-nav-add"
          >
            <Plus className="w-3 h-3" />
            <span>自拟卡 / ADD</span>
          </button>
        </div>
      </div>

      {/* Profile Bio Section with High-Contrast Typography & Serif Subtitle */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start" id="bio-grid-container">
        {/* Left column: Minimalist Avatar frame */}
        <div className="md:col-span-3 flex justify-start items-center" id="avatar-container">
          <div className="relative group w-full max-w-[140px]" id="avatar-frame">
            <div className="absolute inset-x-0 h-full w-full bg-orange-50/10 dark:bg-zinc-850/10 -rotate-3 transition-transform duration-500 group-hover:rotate-0" />
            <img 
              src={profile.avatar} 
              alt={profile.name} 
              referrerPolicy="no-referrer"
              className="relative w-full aspect-square object-cover grayscale brightness-95 border border-[#1A1A1A]/10 dark:border-white/10 shadow-xs"
              id="avatar-image"
            />
            {/* Minimal paper clip mockup matching physical index card drawers */}
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-3 bg-zinc-300 dark:bg-zinc-800 rounded-sm shadow-xs border border-zinc-200/50" id="avatar-clip" />
          </div>
        </div>

        {/* Center column: Description */}
        <div className="md:col-span-6 flex flex-col gap-4" id="bio-details-container">
          <h2 className="text-xl md:text-2xl font-serif italic text-[#1A1A1A] dark:text-zinc-50 tracking-tight" id="bio-role-label">
            {profile.name} — 精致拟态三维交互实验
          </h2>
          <p className="text-[#1A1A1A]/70 dark:text-zinc-300 text-[12px] md:text-sm leading-relaxed antialiased max-w-lg font-sans font-normal" id="bio-chinese-txt">
            {profile.bio}
          </p>
          
          {/* Social connections */}
          <div className="flex gap-4 items-center mt-1" id="social-links-grp">
            <a 
              href={`mailto:${profile.contactEmail}`}
              className="text-[#1A1A1A]/50 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-opacity text-[11px] flex items-center gap-1.5 tracking-wider font-mono border-b border-transparent hover:border-black/20"
              id="social-email"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{profile.contactEmail}</span>
            </a>
            {profile.socials.instagram && (
              <a 
                href={profile.socials.instagram} 
                target="_blank" 
                rel="noreferrer"
                className="text-[#1A1A1A]/50 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-opacity text-[11px] font-mono flex items-center gap-0.5 tracking-wider"
                id="social-ig"
              >
                <span>Instagram</span>
                <ArrowUpRight className="w-2.5 h-2.5 opacity-60" />
              </a>
            )}
            {profile.socials.github && (
              <a 
                href={profile.socials.github} 
                target="_blank" 
                rel="noreferrer"
                className="text-[#1A1A1A]/50 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-opacity text-[11px] font-mono flex items-center gap-0.5 tracking-wider"
                id="social-gh"
              >
                <span>GitHub</span>
                <ArrowUpRight className="w-2.5 h-2.5 opacity-60" />
              </a>
            )}
          </div>
        </div>

        {/* Right column: Curated stats in neat index style */}
        <div className="md:col-span-3 flex md:flex-col justify-between md:justify-start gap-5 md:items-end w-full md:text-right border-t md:border-t-0 md:border-l border-black/5 dark:border-white/5 pt-4 md:pt-0 md:pl-8" id="stats-container">
          <div id="stats-block-lat">
            <span className="block font-sans text-[9px] text-[#1A1A1A]/40 dark:text-zinc-500 uppercase tracking-[0.25em]" id="stat-lbl-status">
              STATUS
            </span>
            <span className="text-[11px] font-sans font-medium text-[#1A1A1A]/80 dark:text-zinc-300 flex items-center gap-1.5 md:justify-end mt-1" id="stat-val-status">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A] dark:bg-zinc-100" />
              OPEN COOP
            </span>
          </div>
          <div id="stats-block-loc">
            <span className="block font-sans text-[9px] text-[#1A1A1A]/40 dark:text-zinc-500 uppercase tracking-[0.25em]" id="stat-lbl-loc">
              LOCATION
            </span>
            <span className="text-[11px] font-mono text-[#1A1A1A]/80 dark:text-zinc-300 mt-1 block" id="stat-val-loc">
              SHANGHAI, CN &bull; GMT+8
            </span>
          </div>
        </div>
      </div>

      {/* Clean Minimalism Category Menu with subtle border lines */}
      <div className="flex items-center gap-3 border-b border-[#1A1A1A]/10 dark:border-white/10 pb-3 overflow-x-auto scroller-hidden" id="category-tabs-row">
        <span className="font-sans text-[9px] text-[#1A1A1A]/40 dark:text-zinc-500 uppercase tracking-[0.25em] pr-4 select-none" id="lbl-index-filter">
          WORKS INDEX &bull;
        </span>
        <div className="flex gap-4 sm:gap-6" id="categories-flex-box">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`cursor-pointer pb-1 text-[10px] tracking-[0.2em] font-medium transition-all duration-300 uppercase select-none whitespace-nowrap ${
                activeCategory === cat
                  ? 'text-[#1A1A1A] dark:text-white border-b border-[#1A1A1A] dark:border-white font-bold'
                  : 'text-[#1A1A1A]/40 hover:text-[#1A1A1A] dark:text-zinc-400 dark:hover:text-white border-b border-transparent'
              }`}
              id={`tab-${cat.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

