import React, { useState } from 'react';
import { Project, CarouselAxis } from '../types';
import { X, Sliders, FilePlus, Settings, Sparkles } from 'lucide-react';

interface DashboardManagerProps {
  isOpen: boolean;
  onClose: () => void;
  axis: CarouselAxis;
  setAxis: (axis: CarouselAxis) => void;
  rotationSpeed: number;
  setRotationSpeed: (speed: number) => void;
  onCreateProject: (project: Project) => void;
  onResetProjects: () => void;
}

export function DashboardManager({
  isOpen,
  onClose,
  axis,
  setAxis,
  rotationSpeed,
  setRotationSpeed,
  onCreateProject,
  onResetProjects
}: DashboardManagerProps) {
  // Form values
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<'Design' | 'Art' | 'Tech' | 'Notes'>('Design');
  const [formYear, setFormYear] = useState('2026');
  const [formClient, setFormClient] = useState('个人自制卡槽');
  const [formDesc, setFormDesc] = useState('');
  const [formDetails, setFormDetails] = useState('');
  const [formTagsString, setFormTagsString] = useState('自定义, 旋转卡片, 实验');
  
  // Minimalist image presets
  const beautifulUnsplashPresets = [
    { name: '极简石材', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
    { name: '包豪斯光影', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80' },
    { name: '混沌颗粒', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80' },
    { name: '冰冷混凝土', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80' },
    { name: '东洋造纸', url: 'https://images.unsplash.com/photo-1507208773393-400179857208?auto=format&fit=crop&w=800&q=80' }
  ];
  
  const [selectedPresetImage, setSelectedPresetImage] = useState(beautifulUnsplashPresets[0].url);
  const [formCustomUrl, setFormCustomUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('请添加卡片名称');
      return;
    }

    const finalImage = formCustomUrl.trim() || selectedPresetImage;
    const finalTags = formTagsString
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const newProj: Project = {
      id: `custom-proj-${Date.now()}`,
      title: formTitle,
      category: formCategory,
      year: formYear,
      client: formClient || '自制档案',
      description: formDesc || '拟态文件夹收藏，承载指尖旋转乐趣。',
      fullDetails: formDetails || '在旋转式收藏夹的自定编辑面板中，访客可以按个人喜好投递灵感节点，并实时融入主页的3D序列圆盘。',
      thumbnail: finalImage,
      gallery: [finalImage, beautifulUnsplashPresets[2].url, beautifulUnsplashPresets[3].url],
      tags: finalTags.length > 0 ? finalTags : ['包豪斯', '交互拟电'],
      accentColor: '#1A1A1A'
    };

    onCreateProject(newProj);
    
    // Reset form
    setFormTitle('');
    setFormDesc('');
    setFormDetails('');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/45 backdrop-blur-xs px-4 py-8 select-none"
      onClick={onClose}
      id="dashboard-overlay"
    >
      <div 
        className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-[#1A1A1A]/10 dark:border-white/10 rounded-none shadow-xs flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        id="dashboard-modal-box"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#1A1A1A]/10 dark:border-white/10 flex justify-between items-center" id="dashboard-header-row">
          <div className="flex items-center gap-2" id="dashboard-title-grp">
            <Settings className="w-4 h-4 text-[#1A1A1A] dark:text-zinc-100 stroke-[1.5]" />
            <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A] dark:text-zinc-200">
              机枢重调 &amp; 自拟纸件 / PARAMETERS & WORKSHOP
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 border border-transparent hover:border-[#1A1A1A]/10 dark:hover:border-white/10 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer rounded-none"
            id="btn-close-dashboard"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable control forms */}
        <div className="p-6 overflow-y-auto flex flex-col gap-8 text-xs font-sans" id="dashboard-scrollable-body">
          {/* Section 1: Carousel dynamics slider control */}
          <div className="flex flex-col gap-4 border-b border-[#1A1A1A]/10 dark:border-white/10 pb-6" id="settings-controls-section">
            <h4 className="font-sans text-[9px] text-[#1A1A1A]/40 dark:text-zinc-500 uppercase tracking-[0.2em] font-bold flex items-center gap-1.5 leading-none">
              <Sliders className="w-3.5 h-3.5" />
              1. 旋转物理参数传动 / DRICING PHYSICAL DAMPING
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5" id="settings-grid">
              <div className="flex flex-col gap-1.5" id="axis-control-item">
                <span className="text-[9px] font-sans text-zinc-400 font-bold uppercase tracking-wider">
                  三轴机枢定位 GEAR AXIS
                </span>
                <div className="grid grid-cols-3 gap-1 bg-[#F7F7F5] dark:bg-zinc-950 p-1 border border-[#1A1A1A]/10 dark:border-white/10" id="form-axis-grp">
                  {(['Y', 'X', 'Z'] as CarouselAxis[]).map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAxis(a)}
                      className={`cursor-pointer px-2 py-1.5 text-[9px] font-mono tracking-widest uppercase transition-all rounded-none font-bold ${
                        axis === a 
                          ? 'bg-[#1A1A1A] text-white dark:bg-white dark:text-zinc-950' 
                          : 'text-[#1A1A1A]/40 hover:text-[#1A1A1A] dark:text-zinc-450'
                      }`}
                      id={`axis-picker-${a}`}
                    >
                      {a === 'Y' ? 'Y-HORIZ' : a === 'X' ? 'X-WHEEL' : 'Z-FLAT'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5" id="speed-control-item font-mono">
                <div className="flex justify-between items-baseline" id="speed-header-row">
                  <span className="text-[9px] font-sans text-zinc-400 font-bold uppercase tracking-wider">
                    阻尼辊动初速度 ROTATE SPEED
                  </span>
                  <span className="text-[10px] font-mono text-[#1A1A1A] dark:text-zinc-100 font-bold" id="speed-indicator">
                    X {rotationSpeed.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1.5" id="slider-row">
                  <span className="text-[8px] font-sans text-zinc-400 uppercase font-bold">PAUSE</span>
                  <input
                    type="range"
                    min="0"
                    max="3"
                    step="0.1"
                    value={rotationSpeed}
                    onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                    className="flex-1 accent-[#1A1A1A] dark:accent-white cursor-pointer h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-none outline-hidden"
                    id="slider-speed"
                  />
                  <span className="text-[8px] font-sans text-zinc-400 uppercase font-bold">SPIN</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-1 flex-wrap gap-2" id="reset-button-row">
              <span className="text-[8px] text-zinc-400 font-mono" id="reset-tip">
                * 还原将清除自创卡并重归初始经典序列。
              </span>
              <button
                type="button"
                onClick={onResetProjects}
                className="cursor-pointer text-[9px] font-sans tracking-widest font-bold text-[#1A1A1A] dark:text-white border border-[#1A1A1A] dark:border-white py-1.5 px-3 hover:bg-[#1A1A1A] hover:text-white dark:hover:bg-white dark:hover:text-zinc-950 transition-all rounded-none uppercase"
                id="btn-reset-original"
              >
                还原 Penny Bi 藏卡 / RESET ARCHIVE
              </button>
            </div>
          </div>

          {/* Section 2: Create custom card */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" id="form-creation-element">
            <h4 className="font-sans text-[9px] text-[#1A1A1A]/40 dark:text-zinc-500 uppercase tracking-[0.2em] font-bold flex items-center gap-1.5 leading-none mb-1">
              <FilePlus className="w-3.5 h-3.5" />
              2. 拟态纸样建卡工作坊 / SPARK CUSTOM FILES
            </h4>

            {/* Title / Year */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4" id="form-header-inputs">
              <div className="md:col-span-8 flex flex-col gap-1.5" id="form-title-slot">
                <label className="text-[9px] font-sans text-zinc-400 font-bold uppercase tracking-wider" htmlFor="inp-title">作品名称 CARD TITLE</label>
                <input
                  id="inp-title"
                  type="text"
                  placeholder="e.g. 宇宙拟态 / Cosmic Simulation"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950 border border-[#1A1A1A]/10 dark:border-white/10 rounded-none px-3 py-2 text-xs focus:ring-1 focus:ring-zinc-900 outline-hidden tracking-tight text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="md:col-span-4 flex flex-col gap-1.5" id="form-year-slot">
                <label className="text-[9px] font-sans text-zinc-400 font-bold uppercase tracking-wider" htmlFor="inp-year">发表年份 YEAR</label>
                <input
                  id="inp-year"
                  type="text"
                  placeholder="e.g. 2026"
                  value={formYear}
                  onChange={(e) => setFormYear(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950 border border-[#1A1A1A]/10 dark:border-white/10 rounded-none px-3 py-2 text-xs focus:ring-1 focus:ring-zinc-900 outline-hidden tracking-tight text-zinc-900 dark:text-zinc-100"
                />
              </div>
            </div>

            {/* Category / Client */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4" id="form-cat-inputs">
              <div className="md:col-span-6 flex flex-col gap-1.5" id="form-category-slot">
                <label className="text-[9px] font-sans text-zinc-400 font-bold uppercase tracking-wider">媒介类别 CATEGORY</label>
                <div className="grid grid-cols-4 gap-1 bg-[#F7F7F5] dark:bg-zinc-950 p-1 border border-[#1A1A1A]/10 dark:border-white/10" id="form-cat-pickers-box">
                  {(['Design', 'Art', 'Tech', 'Notes'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormCategory(cat)}
                      className={`cursor-pointer py-1.5 text-[9px] uppercase tracking-wider font-mono rounded-none text-center transition-all ${
                        formCategory === cat 
                          ? 'bg-[#1A1A1A] text-white dark:bg-white dark:text-zinc-950 font-bold' 
                          : 'text-[#1A1A1A]/40 hover:text-black dark:text-zinc-400'
                      }`}
                      id={`form-cat-tab-${cat.toLowerCase()}`}
                    >
                      {cat === 'Notes' ? 'CV' : cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-6 flex flex-col gap-1.5" id="form-client-slot">
                <label className="text-[9px] font-sans text-zinc-400 font-bold uppercase tracking-wider" htmlFor="inp-client">委托机构 CLIENT & ROLE</label>
                <input
                  id="inp-client"
                  type="text"
                  placeholder="e.g. 个人创作 / Personal Draft"
                  value={formClient}
                  onChange={(e) => setFormClient(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950 border border-[#1A1A1A]/10 dark:border-white/10 rounded-none px-3 py-2 text-xs focus:ring-1 focus:ring-zinc-900 outline-hidden tracking-tight text-zinc-900 dark:text-zinc-100"
                />
              </div>
            </div>

            {/* Thumbnail presets */}
            <div className="flex flex-col gap-2" id="form-preset-images-section">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                卡纸封面图案 PRESET TEXTURE COVER
              </span>
              <div className="grid grid-cols-5 gap-2" id="form-preset-images-row">
                {beautifulUnsplashPresets.map((preset) => (
                  <div
                    key={preset.url}
                    onClick={() => {
                      setSelectedPresetImage(preset.url);
                      setFormCustomUrl(''); 
                    }}
                    className={`cursor-pointer h-12 relative overflow-hidden border transition-all rounded-none ${
                      selectedPresetImage === preset.url && !formCustomUrl
                        ? 'border-[#1A1A1A] dark:border-white ring-1 ring-black/10' 
                        : 'border-transparent grayscale saturate-50 opacity-60 hover:opacity-100'
                    }`}
                    title={preset.name}
                    id={`thumb-preset-${preset.name}`}
                  >
                    <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-[#1A1A1A]/90 text-[7px] text-white uppercase text-center block py-0.5 tracking-wider">
                      {preset.name}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-1.5 mt-1" id="form-custom-url-slot">
                <span className="text-[9px] text-zinc-400 font-mono">或指定外部图片超链接 OPTIONAL COVER IMAGE URL</span>
                <input
                  type="text"
                  placeholder="保留空白或输入 https://images.unsplash.com/..."
                  value={formCustomUrl}
                  onChange={(e) => setFormCustomUrl(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950 border border-[#1A1A1A]/10 dark:border-white/10 rounded-none px-3 py-1.5 text-xs font-mono focus:ring-1 focus:ring-zinc-900 outline-hidden text-zinc-900 dark:text-zinc-100"
                  id="inp-custom-image-url"
                />
              </div>
            </div>

            {/* Short description and Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="form-text-metadata-grids">
              <div className="flex flex-col gap-1.5" id="form-desc-slot">
                <label className="text-[9px] font-sans text-zinc-400 font-bold uppercase tracking-wider" htmlFor="inp-desc">短篇摘要 CARD ABSTRACT (限一两句话)</label>
                <textarea
                  id="inp-desc"
                  rows={2}
                  placeholder="e.g. 自拟作品草稿卡，投递在三轴阻尼旋转罗盘系统。纸本拟电质感..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950 border border-[#1A1A1A]/10 dark:border-white/10 rounded-none px-3 py-2 text-xs focus:ring-1 focus:ring-zinc-900 outline-hidden tracking-tight text-zinc-900 dark:text-zinc-100 resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5" id="form-tags-slot">
                <label className="text-[9px] font-sans text-zinc-400 font-bold uppercase tracking-wider" htmlFor="inp-tags">标签特征 TAGS (英文逗号隔开)</label>
                <textarea
                  id="inp-tags"
                  rows={2}
                  placeholder="e.g. 精美纸本, 自定义投递, 拟态细节"
                  value={formTagsString}
                  onChange={(e) => setFormTagsString(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950 border border-[#1A1A1A]/10 dark:border-white/10 rounded-none px-3 py-2 text-xs focus:ring-1 focus:ring-zinc-900 outline-hidden tracking-tight text-zinc-900 dark:text-zinc-100 resize-none font-sans"
                />
              </div>
            </div>

            {/* Details narrative */}
            <div className="flex flex-col gap-1.5" id="form-details-narrative">
              <label className="text-[9px] font-sans text-zinc-400 font-bold uppercase tracking-wider" htmlFor="inp-details">纸内篇幅展述 COMPLETE CARD DETAILS (支持换行多段落叙事)</label>
              <textarea
                id="inp-details"
                rows={4}
                placeholder="在这细叙你的创作故事。点击“拟成作品卡 BIND”按钮后，该卡片将被插入卡槽圆轴，你可以立即悬停并点开本页查看你的大作..."
                value={formDetails}
                onChange={(e) => setFormDetails(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 border border-[#1A1A1A]/10 dark:border-white/10 rounded-none px-3 py-2 text-xs focus:ring-1 focus:ring-zinc-900 outline-hidden tracking-tight text-zinc-900 dark:text-zinc-100"
              />
            </div>

            {/* Actions button Bar */}
            <div className="flex justify-end gap-3 border-t border-[#1A1A1A]/10 dark:border-white/10 pt-4" id="form-action-row">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer px-4 py-2 border border-transparent hover:border-[#1A1A1A]/10 rounded-none text-[10px] uppercase tracking-widest font-mono font-medium hover:bg-zinc-50 dark:hover:bg-zinc-950 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                id="form-btn-discard"
              >
                DISCARD / 扔掉
              </button>
              <button
                type="submit"
                className="cursor-pointer border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white bg-transparent text-[#1A1A1A] dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-zinc-950 px-5 py-2 rounded-none text-[10px] tracking-widest font-mono font-bold transition-all flex items-center gap-1.5 uppercase"
                id="form-btn-generate"
              >
                <Sparkles className="w-3 h-3" />
                <span>BIND CARD / 拟成卡</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
