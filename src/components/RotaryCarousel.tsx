import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Project, CarouselAxis } from '../types';
import { RotateCw, MoveHorizontal, Compass, CircleHelp, AlertCircle } from 'lucide-react';

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

let audioCtx: AudioContext | null = null;

function playPaperFlipSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const ctx = audioCtx;
    const now = ctx.currentTime;

    // 1. PAPER FRICTION & RUSTLE (White noise with flutter & high/bandpass filters)
    const duration = 0.28; // 280ms for a natural paper page-turn duration
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const t = i / ctx.sampleRate;
      const noise = Math.random() * 2 - 1;
      // Add subtle flutter (amplitude modulation at 30Hz) to mimic paper flexing and fluttering in air
      const flutter = 1.0 + 0.4 * Math.sin(2 * Math.PI * 30 * t);
      data[i] = noise * flutter;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    // Highpass filter to eliminate mechanical low end, keeping only dry surface friction
    const hpFilter = ctx.createBiquadFilter();
    hpFilter.type = 'highpass';
    hpFilter.frequency.setValueAtTime(2000, now);
    hpFilter.frequency.exponentialRampToValueAtTime(1400, now + duration);

    // Bandpass filter to sculpt the specific organic paper resonance (frequencies of vibrating wood pulp sheets)
    const bpFilter = ctx.createBiquadFilter();
    bpFilter.type = 'bandpass';
    bpFilter.frequency.setValueAtTime(3800, now);
    bpFilter.frequency.exponentialRampToValueAtTime(2200, now + duration);
    bpFilter.Q.setValueAtTime(1.0, now); // Low Q ensures it remains a soft rustle instead of a whistling sine

    // Noise volume envelope: smooth fade-in (swipe friction starts) to maximum, followed by textured decay
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(0.09, now + 0.04); // gradual rise of rubbing friction
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noiseSource.connect(hpFilter);
    hpFilter.connect(bpFilter);
    bpFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    // 2. SOFT AIR WAVE THUD (Vibrating paper cardboard structure)
    // Low frequency sine oscillation to give a sense of physical paper body weight and soft movement
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.linearRampToValueAtTime(60, now + 0.12);

    oscGain.gain.setValueAtTime(0, now);
    oscGain.gain.linearRampToValueAtTime(0.03, now + 0.02);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);

    // Play sounds
    noiseSource.start(now);
    noiseSource.stop(now + duration);

    osc.start(now);
    osc.stop(now + 0.15);
  } catch (err) {
    console.warn("Could not play synthesized turn sound:", err);
  }
}

export function playPaperClickSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const ctx = audioCtx;
    const now = ctx.currentTime;

    // 1. Soft finger-pad contact thud (gentle sine wave sweep, very low volume)
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.03);

    oscGain.gain.setValueAtTime(0, now);
    oscGain.gain.linearRampToValueAtTime(0.015, now + 0.002);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);

    // 2. Micro paper friction whisper (highpassed white noise with very short decay)
    const duration = 0.08; 
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    // Highpass filter above 3000Hz to remove harsh mids, keeping only the soft tactile brush sound
    const hpFilter = ctx.createBiquadFilter();
    hpFilter.type = 'highpass';
    hpFilter.frequency.setValueAtTime(3200, now);

    const bpFilter = ctx.createBiquadFilter();
    bpFilter.type = 'bandpass';
    bpFilter.frequency.setValueAtTime(4800, now);
    bpFilter.frequency.exponentialRampToValueAtTime(3600, now + duration);
    bpFilter.Q.setValueAtTime(0.8, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(0.012, now + 0.004);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noiseSource.connect(hpFilter);
    hpFilter.connect(bpFilter);
    bpFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    // Play tactile components
    osc.start(now);
    osc.stop(now + 0.03);

    noiseSource.start(now);
    noiseSource.stop(now + duration);
  } catch (err) {
    console.warn("Could not play synthesized click sound:", err);
  }
}

export function playKachaSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const ctx = audioCtx;
    const now = ctx.currentTime;

    // 1. Dual transients mimicking the metallic shutter snap of a camera or a crisp mechanical key switch click
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(1450, now);
    osc1.frequency.exponentialRampToValueAtTime(320, now + 0.012);

    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.045, now + 0.001);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    // Release release click, slightly lower frequency, 7ms delayed
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    const clickTime = now + 0.007;
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(980, clickTime);
    osc2.frequency.exponentialRampToValueAtTime(160, clickTime + 0.018);

    gain2.gain.setValueAtTime(0, clickTime);
    gain2.gain.linearRampToValueAtTime(0.05, clickTime + 0.001);
    gain2.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.022);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    // 2. High-frequency friction snap (highpassed noise)
    const duration = 0.035;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(4600, now);
    filter.frequency.exponentialRampToValueAtTime(3000, now + duration);
    filter.Q.setValueAtTime(2.2, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(0.022, now + 0.002);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.018);

    osc2.start(clickTime);
    osc2.stop(clickTime + 0.025);

    noise.start(now);
    noise.stop(now + duration);
  } catch (err) {
    console.warn("Could not play synthesized kacha sound:", err);
  }
}

export function playDingSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const ctx = audioCtx;
    const now = ctx.currentTime;

    // Harmonically rich, metallic, and clean chime ("叮" sound)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const osc3 = ctx.createOscillator();

    const gain1 = ctx.createGain();
    const gain2 = ctx.createGain();
    const gain3 = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1200, now); // Sweet bell fundamental

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1800, now); // Sweet harmonic (perfect fifth)

    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(2400, now); // Higher chime overlay

    // Gentle linear attack (5ms) to prevent speakers clicking, fast exponential decay
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.045, now + 0.005);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(0.022, now + 0.005);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    gain3.gain.setValueAtTime(0, now);
    gain3.gain.linearRampToValueAtTime(0.012, now + 0.005);
    gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc1.connect(gain1);
    osc2.connect(gain2);
    osc3.connect(gain3);

    gain1.connect(ctx.destination);
    gain2.connect(ctx.destination);
    gain3.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);

    osc1.stop(now + 0.5);
    osc2.stop(now + 0.35);
    osc3.stop(now + 0.25);
  } catch (err) {
    console.warn("Could not play synthesized ding sound:", err);
  }
}

interface RotaryCarouselProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
  axis: CarouselAxis;
  setAxis: (axis: CarouselAxis) => void;
  rotationSpeed: number; // custom speed multiplier (e.g. 1 is normal)
  activeCategory: string;
  selectedProjectId?: string | null;
  triggerRandomSpin?: number;
}

export function RotaryCarousel({
  projects,
  onProjectClick,
  axis,
  setAxis,
  rotationSpeed,
  activeCategory,
  selectedProjectId = null,
  triggerRandomSpin = 0
}: RotaryCarouselProps) {
  // Display exactly the list of projects without padding dummy placeholders,
  // matching the requested page counts on different modules exactly.
  const displayItems = [...projects];

  const [angle, setAngle] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isFastSpinning, setIsFastSpinning] = useState(false);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartAngle = useRef(0);
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const fastSpinRequestRef = useRef<number | null>(null);
  const autoRotateRequestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);

  // Advanced right-click physical viewing angle state & damp parameters
  const [viewX, setViewX] = useState(0);
  const [viewY, setViewY] = useState(0);
  const isRightDragging = useRef(false);
  const rightDragStartX = useRef(0);
  const rightDragStartY = useRef(0);
  const targetViewX = useRef(0);
  const targetViewY = useRef(0);
  const currentViewX = useRef(0);
  const currentViewY = useRef(0);

  // Minimal cursor hint system state and refs
  const [hintText, setHintText] = useState('');
  const [isHintVisible, setIsHintVisible] = useState(false);
  const targetCursorX = useRef(0);
  const targetCursorY = useRef(0);
  const currentCursorX = useRef(0);
  const currentCursorY = useRef(0);
  const hintRef = useRef<HTMLDivElement>(null);
  const showTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const shownHints = useRef<Record<string, boolean>>({});

  const triggerHint = (text: string, storageKey: string) => {
    try {
      if (shownHints.current[storageKey] || sessionStorage.getItem(storageKey)) {
        return;
      }
    } catch (_) {
      if (shownHints.current[storageKey]) return;
    }

    if (showTimerRef.current) clearTimeout(showTimerRef.current);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);

    setIsHintVisible(false);

    showTimerRef.current = setTimeout(() => {
      setHintText(text);
      setIsHintVisible(true);
      try {
        sessionStorage.setItem(storageKey, 'true');
      } catch (_) {}
      shownHints.current[storageKey] = true;

      hideTimerRef.current = setTimeout(() => {
        setIsHintVisible(false);
      }, 2000);
    }, 450); // 450ms small delay
  };

  // Smoothly damp / ease viewX and viewY coordinates towards targetView values
  useEffect(() => {
    let active = true;
    const updatePhysics = () => {
      if (!active) return;
      
      const K = 0.085; // smooth damping factor
      
      const diffX = targetViewX.current - currentViewX.current;
      const diffY = targetViewY.current - currentViewY.current;
      
      if (Math.abs(diffX) < 0.01 && Math.abs(diffY) < 0.01 && targetViewX.current === 0 && targetViewY.current === 0) {
        currentViewX.current = 0;
        currentViewY.current = 0;
        setViewX(0);
        setViewY(0);
      } else {
        currentViewX.current += diffX * K;
        currentViewY.current += diffY * K;
        setViewX(currentViewX.current);
        setViewY(currentViewY.current);
      }

      // Damped mouse cursor positioning helper
      const dx = targetCursorX.current - currentCursorX.current;
      const dy = targetCursorY.current - currentCursorY.current;
      currentCursorX.current += dx * 0.14;
      currentCursorY.current += dy * 0.14;

      if (hintRef.current) {
        // Offset below and slightly to the right of cursor
        const posX = currentCursorX.current + 12;
        const posY = currentCursorY.current + 14;
        hintRef.current.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
      }
      
      requestAnimationFrame(updatePhysics);
    };
    
    const handleGlobalRelease = (e: MouseEvent) => {
      if (e.button === 2) {
        isRightDragging.current = false;
        targetViewX.current = 0;
        targetViewY.current = 0;
      }
    };

    let cursorInitialized = false;
    const handleGlobalMouseMove = (e: MouseEvent) => {
      targetCursorX.current = e.clientX;
      targetCursorY.current = e.clientY;
      if (!cursorInitialized) {
        currentCursorX.current = e.clientX;
        currentCursorY.current = e.clientY;
        cursorInitialized = true;
      }
    };
    
    window.addEventListener('mouseup', handleGlobalRelease);
    window.addEventListener('mousemove', handleGlobalMouseMove);
    const frameId = requestAnimationFrame(updatePhysics);
    
    return () => {
      active = false;
      cancelAnimationFrame(frameId);
      window.removeEventListener('mouseup', handleGlobalRelease);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, []);

  // Hover & drag trigger listeners for minimal hints
  useEffect(() => {
    if (isHovered) {
      triggerHint("Hold to adjust", "hint_hold_shown");
    } else {
      if (showTimerRef.current && !shownHints.current["hint_hold_shown"]) {
        clearTimeout(showTimerRef.current);
        showTimerRef.current = null;
      }
      setIsHintVisible(false);
    }
  }, [isHovered]);

  useEffect(() => {
    if (isDragging) {
      setIsHintVisible(false);
      if (showTimerRef.current) {
        clearTimeout(showTimerRef.current);
      }
    }
  }, [isDragging]);

  const totalItems = displayItems.length;
  // Compute radius base on number of items to make sure they do not overlap
  // radius constraint: minimum 240px, adjusts as viewport changes
  const [radius, setRadius] = useState(324);
  const [cardDim, setCardDim] = useState({ w: 238, h: 335 });
  const lastPlayedSlot = useRef<number | null>(null);

  useEffect(() => {
    function updateRadius() {
      const width = window.innerWidth;
      const baseRadius = width < 640 ? 189 : width < 768 ? 252 : 360;
      // Distribute appropriately based on count
      const computed = Math.max(baseRadius, (totalItems * 45) / Math.PI);
      setRadius(Math.min(computed, width < 768 ? 288 : 468));
    }
    updateRadius();
    window.addEventListener('resize', updateRadius);
    return () => window.removeEventListener('resize', updateRadius);
  }, [totalItems]);

  useEffect(() => {
    function updateDimensions() {
      const width = window.innerWidth;
      if (width < 640) {
        setCardDim({ w: 158, h: 221 });
      } else if (width < 768) {
        setCardDim({ w: 194, h: 275 });
      } else {
        setCardDim({ w: 238, h: 335 });
      }
    }
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Handle high-speed spinning when triggerRandomSpin is fired
  useEffect(() => {
    if (!triggerRandomSpin || triggerRandomSpin === 0 || displayItems.length === 0) return;

    setIsFastSpinning(true);
    playPaperFlipSound();

    // Select a random project card to land on
    const randomIndex = Math.floor(Math.random() * displayItems.length);
    const targetProject = displayItems[randomIndex];

    // Compute original and landing target angle
    const cardAngle = randomIndex * (360 / totalItems);
    const startAngle = angle;
    
    // Spin 4-5 times at high velocity, then taper off to land face-on
    const rotSpins = 4 + Math.floor(Math.random() * 2); 
    const finalTravel = rotSpins * 360 + ((cardAngle - (startAngle % 360) + 360) % 360);
    const targetAngle = startAngle + finalTravel;

    const duration = 2000; // 2 seconds of high velocity archive flipping
    const startTime = performance.now();
    let lastPlayedTick = startTime;

    const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

    const runFastSpin = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const eased = easeOutQuint(progress);
      const currentAngle = startAngle + finalTravel * eased;
      setAngle(currentAngle);

      // Play rustle ticks as cards flash by, limited to avoid congestion
      const step = 360 / totalItems;
      const currentSlot = Math.round(currentAngle / step);
      if (lastPlayedSlot.current !== null && currentSlot !== lastPlayedSlot.current) {
        if (timestamp - lastPlayedTick > 40) { // Limit audio generation speed
          playPaperFlipSound();
          lastPlayedTick = timestamp;
        }
      }
      lastPlayedSlot.current = currentSlot;

      if (progress < 1) {
        fastSpinRequestRef.current = requestAnimationFrame(runFastSpin);
      } else {
        // Spin achieved! Lock position perfectly
        setAngle(targetAngle);
        setIsFastSpinning(false);
        
        // Execute project view callbacks
        onProjectClick(targetProject);
        
        // Sound combination of physical folder selection:
        playDingSound();
        setTimeout(() => {
          playPaperClickSound();
        }, 90);
      }
    };

    fastSpinRequestRef.current = requestAnimationFrame(runFastSpin);

    return () => {
      if (fastSpinRequestRef.current) {
        cancelAnimationFrame(fastSpinRequestRef.current);
      }
    };
  }, [triggerRandomSpin]);

  // Handle auto-rotation
  useEffect(() => {
    // If hovering, dragging, or fast spinning, pause normal auto simulation
    if (isHovered || isDragging || isFastSpinning) {
      if (autoRotateRequestRef.current) {
        cancelAnimationFrame(autoRotateRequestRef.current);
        autoRotateRequestRef.current = null;
      }
      return;
    }

    const animate = (time: number) => {
      if (previousTimeRef.current !== null) {
        // Slow rotation increment
        const delta = time - previousTimeRef.current;
        const speedFactor = 0.015 * rotationSpeed; // speed constant
        setAngle((prev) => (prev + delta * speedFactor) % 360);
      }
      previousTimeRef.current = time;
      autoRotateRequestRef.current = requestAnimationFrame(animate);
    };

    autoRotateRequestRef.current = requestAnimationFrame(animate);

    return () => {
      if (autoRotateRequestRef.current) {
        cancelAnimationFrame(autoRotateRequestRef.current);
      }
      previousTimeRef.current = null;
    };
  }, [isHovered, isDragging, isFastSpinning, rotationSpeed]);

  // Trigger physical paper page-flip/tick sound whenever rotating past a card slot angle
  useEffect(() => {
    if (!isDragging) {
      lastPlayedSlot.current = null;
      return;
    }
    if (totalItems <= 1) return;
    const step = 360 / totalItems;
    const currentSlot = Math.round(angle / step);

    if (lastPlayedSlot.current !== null && currentSlot !== lastPlayedSlot.current) {
      playPaperFlipSound();
    }
    lastPlayedSlot.current = currentSlot;
  }, [angle, isDragging, totalItems]);

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 2) {
      e.preventDefault();
      isRightDragging.current = true;
      rightDragStartX.current = e.clientX;
      rightDragStartY.current = e.clientY;
      triggerHint("Release to return", "hint_release_shown");
      try {
        window.dispatchEvent(new CustomEvent('guide-right-drag-done'));
      } catch (_) {}
      return;
    }

    if (isFastSpinning) return;
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartY.current = e.clientY;
    dragStartAngle.current = angle;
    try {
      window.dispatchEvent(new CustomEvent('guide-left-drag-done'));
    } catch (_) {}
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isRightDragging.current) {
      const deltaX = e.clientX - rightDragStartX.current;
      const deltaY = e.clientY - rightDragStartY.current;
      
      // Increased physical rotation: rotate around Y up to ±80 degrees, tilt around X (up/down) up to ±75 degrees for stunning top/bottom views
      targetViewY.current = Math.min(80, Math.max(-80, deltaX * 0.35));
      targetViewX.current = Math.min(75, Math.max(-75, -deltaY * 0.35));
      return;
    }

    if (!isDragging) return;
    const currentX = e.clientX;
    const currentY = e.clientY;
    
    // Choose motion based on rotation axis
    let delta = 0;
    if (axis === 'Y') {
      delta = (currentX - dragStartX.current) * 0.45; // drag left-right spins around Y
      setAngle(dragStartAngle.current - delta);
    } else if (axis === 'X') {
      delta = (currentY - dragStartY.current) * 0.45; // drag up-down spins around X
      setAngle(dragStartAngle.current + delta);
    } else {
      // Rotation flat around Z
      const deltaX = currentX - dragStartX.current;
      const deltaY = currentY - dragStartY.current;
      delta = (deltaX + deltaY) * 0.35;
      setAngle(dragStartAngle.current - delta);
    }
  };

  const handleMouseUpOrLeave = (e?: React.MouseEvent) => {
    isRightDragging.current = false;
    targetViewX.current = 0;
    targetViewY.current = 0;
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isFastSpinning) return;
    setIsDragging(true);
    if (e.touches[0]) {
      dragStartX.current = e.touches[0].clientX;
      dragStartY.current = e.touches[0].clientY;
      dragStartAngle.current = angle;
    }
    try {
      window.dispatchEvent(new CustomEvent('guide-left-drag-done'));
    } catch (_) {}
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !e.touches[0]) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    
    let delta = 0;
    if (axis === 'Y') {
      delta = (currentX - dragStartX.current) * 0.4;
      setAngle(dragStartAngle.current - delta);
    } else if (axis === 'X') {
      delta = (currentY - dragStartY.current) * 0.4;
      setAngle(dragStartAngle.current + delta);
    } else {
      const deltaX = currentX - dragStartX.current;
      const deltaY = currentY - dragStartY.current;
      delta = (deltaX + deltaY) * 0.35;
      setAngle(dragStartAngle.current - delta);
    }
  };

  // Quick navigation helpers to next/prev card precisely
  const rotateToCardIndex = (index: number) => {
    const cardAngle = index * (360 / totalItems);
    // Find closest rotation pathway
    const normalizedAngle = ((angle % 360) + 360) % 360;
    let diff = cardAngle - normalizedAngle;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    setAngle((prev) => prev + diff);
  };

  const getAxisStyles = () => {
    switch (axis) {
      case 'X':
        return `rotateX(${-angle}deg) rotateY(0deg) rotateZ(0deg)`;
      case 'Z':
        return `rotateX(65deg) rotateY(0deg) rotateZ(${angle}deg)`; // flat inclined platter
      case 'Y':
      default:
        return `rotateY(${-angle}deg) rotateX(0deg) rotateZ(0deg)`;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[700px] py-14 px-4 relative overflow-visible bg-transparent transition-colors duration-500" id="rotary-container-section">
      {/* Real CSS/SVG White-Cement Plaster Fine Texture */}
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full opacity-[0.055] dark:opacity-[0.095] pointer-events-none mix-blend-overlay z-0" id="cement-fine-texture-svg">
        <filter id="cement-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.12 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#cement-grain)" />
      </svg>

      {/* 3D Depth-of-field overhead spotlight matching the user image's warm radiance */}
      <div className="absolute top-0 inset-x-0 h-[460px] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.98)_0%,_rgba(255,255,255,0)_80%)] dark:bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.04)_0%,_rgba(0,0,0,0)_80%)] pointer-events-none z-0" id="studio-overhead-light" />

      {/* Gentle slant window pane shadow cast on the back concrete wall */}
      <div className="absolute left-[-15%] top-[-10%] w-[55%] h-[120%] bg-zinc-950/[0.035] dark:bg-black/[0.22] blur-[60px] rotate-[22deg] pointer-events-none select-none z-0" id="studio-pane-shadow" />

      {/* Faint surrounding vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_45%,_rgba(0,0,0,0.02)_100%)] dark:bg-[radial-gradient(circle_at_center,_transparent_45%,_rgba(0,0,0,0.18)_100%)] pointer-events-none z-0" />

      {/* Premium 3D Tabletop Surface - Grounding the carousel in physical space with infinite stretch */}
      <div 
        className="absolute top-[calc(100%-215px)] sm:top-[calc(100%-250px)] bottom-[-900px] inset-x-0 bg-[#DFDFDC] dark:bg-[#111114] border-t border-white/25 dark:border-white/5 backdrop-blur-[0.5px] overflow-hidden z-0 shadow-[0_-12px_40px_rgba(0,0,0,0.03)]" 
        id="studio-tabletop-deck"
      >
        {/* Tabletop marble/stone plaster gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.22] via-transparent to-black/[0.06] dark:from-white/[0.02] dark:to-black/[0.25] pointer-events-none" />
        
        {/* Soft horizontal reflection of overhead light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[55px] bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.55)_0%,_rgba(255,255,255,0)_75%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.03)_0%,_rgba(255,255,255,0)_75%)] pointer-events-none" />
        
        {/* Tabletop micro-ambient occlusion crease at seam */}
        <div className="absolute inset-x-0 top-0 h-[8px] bg-gradient-to-b from-black/[0.05] to-transparent dark:from-black/[0.18] pointer-events-none" />
      </div>

      {/* Dynamic Background subtle grid and retro blueprint blueprint lines removed */}
      
      {/* Decorative calibration corner brackets representing camera/viewfinder focus */}
      <div className="absolute top-8 left-8 w-6 h-6 border-t border-l border-zinc-200 dark:border-zinc-800 pointer-events-none z-10" />
      <div className="absolute top-8 right-8 w-6 h-6 border-t border-r border-zinc-200 dark:border-zinc-800 pointer-events-none z-10" />
      <div className="absolute bottom-8 left-8 w-6 h-6 border-b border-l border-zinc-200 dark:border-zinc-800 pointer-events-none z-10" />
      <div className="absolute bottom-8 right-8 w-6 h-6 border-b border-r border-zinc-200 dark:border-zinc-800 pointer-events-none z-10" />

      {/* Interactive 3D workspace centered perfectly */}
      <div 
        className="relative w-full max-w-[950px] h-[550px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none z-10 mt-2"
        style={{ perspective: '1100px' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          handleMouseUpOrLeave();
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onContextMenu={(e) => e.preventDefault()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUpOrLeave}
        id="rotary-interactive-viewport"
      >
        {/* Bookshelf Physical Assembly for advanced viewing group tilts */}
        <div
          className="relative flex items-center justify-center w-full h-full"
          style={{
            transform: `rotateX(${viewX}deg) rotateY(${viewY}deg)`,
            transformStyle: 'preserve-3d'
          }}
          id="bookshelf-physical-assembly"
        >
          {/* MECHANICAL SPINDLE ARCHITECTURE (Fully spatial 3D elements) */}
          {axis === 'Y' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0" style={{ transformStyle: 'preserve-3d' }} id="mechanical-frame-assembly">
              
              {/* 1. Shiny Stainless Steel Spindle Central Pole (6-faceted 3D Column) */}
              <div className="absolute z-0 flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
                {[0, 30, 60, 90, 120, 150].map((angleDeg) => (
                  <div 
                    key={angleDeg}
                    className="absolute w-[12px] bg-gradient-to-r from-zinc-300 via-white to-zinc-500 dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-800 border-x border-zinc-400/40 dark:border-zinc-900 shadow-inner" 
                    style={{ 
                      height: `${cardDim.h + 14}px`,
                      transform: `rotateY(${angleDeg}deg) translateY(1px)`,
                      backfaceVisibility: 'visible',
                    }}
                  />
                ))}
              </div>

              {/* 2. White Ceramic Conical Pedestal Base (Stacked volumetric 3D slices forming a perfect solid cone) */}
              <div 
                className="absolute" 
                style={{ 
                  transform: `translateY(${cardDim.h / 2 + 32}px)`,
                  transformStyle: 'preserve-3d'
                }}
                id="spindle-base-assembly"
              >
                {/* Contact Shadow beneath the ceramics */}
                <div 
                  className="absolute rounded-full bg-black/10 dark:bg-black/35 blur-md"
                  style={{
                    width: '230px',
                    height: '230px',
                    transform: 'translate(-50%, -50%) translateY(34px) rotateX(90deg)',
                  }}
                />
                
                {/* 3D Stacked Base Plates */}
                {[...Array(28)].map((_, i) => {
                  const baseRingsCount = 28;
                  const baseHeight = 56; // thickness of base
                  const ringY = (i / (baseRingsCount - 1)) * baseHeight; // 0 to 56
                  const t = i / (baseRingsCount - 1); // 0 at top, 1 at bottom
                  
                  // Cone taper from apex (diameter 32) to deep base (diameter 220)
                  const diameter = 32 + (188 * t);
                  
                  return (
                    <div
                      key={i}
                      className="absolute rounded-full border border-stone-200/5 dark:border-zinc-800/10 bg-gradient-to-r from-stone-100 via-[#FDFCFA] to-stone-300 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-900 shadow-inner transition-colors duration-300"
                      style={{
                        width: `${diameter}px`,
                        height: `${diameter}px`,
                        transform: `translate(-50%, -50%) translateY(${ringY - 24}px) rotateX(90deg)`,
                        transformStyle: 'preserve-3d',
                      }}
                    />
                  );
                })}
              </div>

              {/* 2.5. Metallic Threaded Base Collar (Fully 3D volumetric crossed structure, physically fixed to spindle top) */}
              <div 
                className="absolute z-10"
                style={{ 
                  transform: `translateY(${-cardDim.h / 2 - 11}px)`,
                  transformStyle: 'preserve-3d'
                }}
                id="spindle-top-collar"
              >
                {[0, 90].map((angleDeg) => (
                  <div
                    key={angleDeg}
                    className="absolute w-[18px] h-[10px] bg-gradient-to-r from-zinc-500 via-zinc-200 to-zinc-600 dark:from-zinc-700 dark:via-zinc-505 dark:to-zinc-800 border-x border-t border-zinc-400 dark:border-zinc-800 rounded-b-xs shadow-[inset_-1px_1px_2px_rgba(255,255,255,0.8)] flex flex-col items-center justify-end"
                    style={{
                      transform: `translate(-50%, -50%) rotateY(${angleDeg}deg)`,
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'visible',
                    }}
                  >
                    {/* Subtle thread lines */}
                    <div className="w-[18px] h-[1.5px] bg-zinc-400/40 dark:bg-zinc-900/40 border-b border-white/10 dark:border-black/20" />
                    <div className="w-[18px] h-[1.5px] bg-zinc-400/40 dark:bg-zinc-900/40 border-b border-white/10 dark:border-black/20" style={{ marginBottom: '2px' }} />
                  </div>
                ))}
              </div>

              {/* 3. Top Indicator light bulb Glass Sphere (Counter-rotated dynamically around its exact spherical center) */}
              <div 
                className="absolute flex flex-col items-center justify-center z-20"
                style={{ 
                  transform: `translateY(${-cardDim.h / 2 - 32}px) rotateY(${-viewY}deg) rotateX(${-viewX}deg)`,
                  transformStyle: 'preserve-3d'
                }}
                id="top-spindle-bulb"
              >
                {/* Main Glowing 3D Glass Sphere Body */}
                <div 
                  className={`w-8 h-8 rounded-full relative flex items-center justify-center transition-all duration-500 border border-white/20 dark:border-zinc-700/20 shadow-lg ${
                    hoveredCardId !== null 
                      ? 'bg-gradient-to-tr from-amber-500/80 via-yellow-350 to-white scale-105' 
                      : 'bg-gradient-to-tr from-stone-200/45 via-stone-50/50 to-white/80 dark:from-zinc-800/60 dark:via-zinc-700/60 dark:to-zinc-500/80'
                  }`}
                  style={{
                    boxShadow: hoveredCardId !== null 
                      ? '0 0 32px 8px rgba(245,158,11,0.65), inset 0 -4px 8px rgba(217,119,6,0.3), inset 0 2px 4px rgba(255,255,255,0.9)'
                      : 'inset 0 -3px 6px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.6)',
                  }}
                >
                  {/* Inner glowing filament core */}
                  <div 
                    className={`transition-all duration-500 flex flex-col items-center justify-center relative ${
                      hoveredCardId !== null ? 'opacity-100 scale-105' : 'opacity-70 scale-95'
                    }`}
                  >
                    {/* Tiny metal supports */}
                    <div className="flex justify-between w-[8px] h-[12px] absolute bottom-[-4px] pointer-events-none">
                      <div className={`w-[0.8px] h-[10px] ${hoveredCardId !== null ? 'bg-amber-700/80' : 'bg-stone-400/60'}`} />
                      <div className={`w-[0.8px] h-[10px] ${hoveredCardId !== null ? 'bg-amber-700/80' : 'bg-stone-400/60'}`} />
                    </div>

                    {/* Glowing Loop Filament coil wire */}
                    <svg 
                      width="12" 
                      height="12" 
                      viewBox="0 0 12 12" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className="transition-colors duration-500"
                    >
                      <path 
                        d="M 2,12 C 1,6 3,1 6,1 C 9,1 11,6 10,12" 
                        stroke={hoveredCardId !== null ? "#FF8C00" : "#7C7A75"} 
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        fill="none"
                      />
                      {/* Secondary glowing core halo path (for when lit) */}
                      {hoveredCardId !== null && (
                        <path 
                          d="M 2,12 C 1,6 3,1 6,1 C 9,1 11,6 10,12" 
                          stroke="#FFF766" 
                          strokeWidth="0.6"
                          strokeLinecap="round"
                          fill="none"
                          className="animate-pulse"
                        />
                      )}
                    </svg>
                  </div>

                  {/* 3D Glass Rim/Glint Highlight Overlay */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/35 via-transparent to-black/10 pointer-events-none" />
                  
                  {/* Specular Glint Highlight spot (Upper Left) */}
                  <div className="absolute top-1 left-1.5 w-2 h-1 bg-white/75 rounded-full rotate-[-25deg] filter blur-[0.4px] pointer-events-none" />
                  
                  {/* Secondary soft reflection spot (Lower Right) */}
                  <div className="absolute bottom-1 right-1.5 w-1.5 h-0.8 bg-white/20 rounded-full rotate-[155deg] filter blur-[0.6px] pointer-events-none" />

                  {/* High Intensity Aura Center Spark */}
                  {hoveredCardId !== null && (
                    <div className="absolute w-2.5 h-2.5 rounded-full bg-white blur-[0.5px] opacity-95 flex items-center justify-center animate-pulse z-10" style={{ transform: 'translateY(-1px)' }}>
                      <div className="w-1 h-1 rounded-full bg-yellow-200" />
                    </div>
                  )}
                </div>

                {/* Massive soft spherical volumetric aura glow behind the entire bulb assembly */}
                <div 
                  className={`absolute w-32 h-32 rounded-full transition-opacity duration-350 pointer-events-none -z-10 bg-gradient-to-b from-amber-400/50 to-transparent blur-xl ${
                    hoveredCardId !== null ? 'opacity-100 scale-110' : 'opacity-0 scale-90'
                  }`}
                  style={{
                    transform: 'translateZ(-10px)'
                  }}
                />
              </div>
            </div>
          )}

          {/* Dynamic Rotation Spindle Core Container */}
          <div 
            className="relative transition-transform duration-100 ease-out flex items-center justify-center"
            style={{ 
              width: cardDim.w, 
              height: cardDim.h,
              transform: getAxisStyles(),
              transformStyle: 'preserve-3d'
            }}
            id="rotary-3d-cylinder"
          >
          {displayItems.map((project, idx) => {
            const itemAngle = idx * (360 / totalItems);
            const currentRotationAngle = angle % 360;
            const diffAngle = Math.abs((itemAngle - currentRotationAngle + 360) % 360);
            
            let isClose = diffAngle < (180 / totalItems) || (360 - diffAngle) < (180 / totalItems);
            if (axis === 'Z') {
              isClose = false; 
            }

            // Radial configuration mathematically matching the reference photo
            let transformString = `rotateY(${itemAngle}deg) translateZ(6px) translateX(${cardDim.w / 2}px)`;
            if (axis === 'X') {
              transformString = `rotateX(${itemAngle}deg) translateZ(${radius}px)`;
            } else if (axis === 'Z') {
              transformString = `rotateZ(${-itemAngle}deg) translateY(${-radius}px) rotateX(-65deg)`;
            }

            const isEmptyFolder = project.id.startsWith('mock-empty-');
            
            // Edge tab label belongs to the current category theme.
            // If activeCategory is a specific one (e.g. "DESIGN"), we show that category.
            // If activeCategory is "ALL", we show the project's actual category.
            const labelRaw = activeCategory && activeCategory.toUpperCase() !== 'ALL'
              ? activeCategory.toLowerCase()
              : project.category.toLowerCase();
            const labelText = labelRaw === 'notes' ? 'cv' : labelRaw;

            return (
              <div
                key={project.id}
                className="absolute inset-x-0 w-full h-full group/card transition-opacity duration-500 ease-in-out"
                style={{
                  transform: transformString,
                  backfaceVisibility: axis === 'Y' ? 'visible' : 'hidden', // Show backface for full cylinder flip
                  transformStyle: 'preserve-3d',
                  zIndex: isClose ? 100 : Math.round(100 - (diffAngle / 15)),
                  opacity: selectedProjectId !== null
                    ? (selectedProjectId === project.id ? 1 : 0)
                    : (hoveredCardId === null ? 1 : (hoveredCardId === project.id ? 1 : 0.2)),
                  pointerEvents: selectedProjectId !== null ? 'none' : 'auto'
                }}
                onMouseEnter={() => {
                  setHoveredCardId(project.id);
                  playDingSound();
                }}
                onMouseLeave={() => setHoveredCardId(null)}
                id={`carousel-slot-${project.id}`}
              >
                {/* 3D DOUBLE-SIDED FOLDER LEAF */}
                <div 
                  onClick={(e) => {
                    if (isDragging) return;
                    e.stopPropagation();
                    playPaperClickSound();
                    onProjectClick(project);
                  }}
                  className="w-full h-full relative"
                  style={{ transformStyle: 'preserve-3d' }}
                  id={`card-tilt-wrapper-${project.id}`}
                >
                  
                  {/* FRONT SIDE CARDFOLDER PAGE */}
                  <div
                    className={`absolute inset-0 w-full h-full cursor-pointer bg-[#FDFBF7] dark:bg-zinc-900 px-3.5 py-4 flex flex-col justify-between border-2 select-none transition-shadow duration-500 rounded-xs shadow-md ${
                      isClose 
                        ? 'border-[#1A1A1A] dark:border-zinc-200' 
                        : 'border-[#1A1A1A]/15 dark:border-zinc-700/80'
                    }`}
                    style={{ backfaceVisibility: 'hidden' }}
                    id={`card-front-${project.id}`}
                  >
                    {/* Left Binding Spine Margin (Heavy craft strip connected to central axle in Y view) */}
                    <div className="absolute left-0 top-0 w-7 h-full bg-[#EADDCD] dark:bg-zinc-800/80 border-r border-[#1A1A1A]/12 flex flex-col justify-between items-center py-4 z-10 shadow-inner">
                      {/* Metal binder clip loops mirroring top-down hinges */}
                      {[...Array(5)].map((_, index) => (
                        <div key={index} className="relative w-3.5 h-3.5 rounded-full bg-stone-700 dark:bg-zinc-950 border border-stone-500/40 flex items-center justify-center shadow-xs">
                          {/* Inner socket notch */}
                          <div className="w-1.5 h-1.5 rounded-full bg-stone-900 dark:bg-zinc-800" />
                          {/* Link physical loop hoop extending to center spindle line */}
                          <div className="absolute right-3.5 w-4 h-1 border border-zinc-400/80 bg-zinc-300/90 dark:bg-zinc-700/90 rounded-xs shadow-2xs" />
                        </div>
                      ))}
                    </div>

                    {/* Staggered classification index tab on the right out-edge */}
                    <div 
                      className={`absolute -right-3.5 w-3.5 bg-[#FDFBF7] dark:bg-zinc-900 border border-l-0 rounded-r-xs flex items-center justify-center select-none shadow-xs z-20 ${
                        isClose ? 'border-[#1A1A1A] dark:border-zinc-200' : 'border-[#1A1A1A]/15 dark:border-zinc-700'
                      }`}
                      style={{ 
                        top: `${cardDim.h * 0.08 + (idx % 6) * ((cardDim.h * 0.74) / 5)}px`,
                        height: `${cardDim.h * 0.14}px`
                      }}
                      id={`tab-front-${project.id}`}
                    >
                      <span className="text-[6.5px] sm:text-[7.5px] font-mono leading-none font-bold text-zinc-500 capitalize whitespace-nowrap font-sans shrink-0 flex items-center justify-center" style={{ writingMode: 'vertical-rl' }}>
                        {labelText}
                      </span>
                    </div>

                    {/* Content Area - Shifted right slightly to avoid overlapping the binder margin */}
                    <div className="flex-1 pl-6 h-full w-full relative flex flex-col justify-center items-center" id={`front-workspace-${project.id}`}>
                      <div className="w-full h-full bg-[#F3F0E8] dark:bg-zinc-950 border border-stone-300/50 dark:border-zinc-800/50 rounded-xs overflow-hidden relative shadow-inner group/photo">
                        {isEmptyFolder ? (
                          <div className="w-full h-full bg-stone-100 dark:bg-zinc-900 flex flex-col justify-center items-center gap-1 text-stone-400 dark:text-zinc-500 rounded-xs border border-dashed border-stone-300 dark:border-zinc-800">
                            <span className="text-[10px] tracking-widest font-mono font-bold uppercase">IMAGE PLACEHOLDER</span>
                            <span className="text-[7px] font-mono text-zinc-400 dark:text-zinc-600">待置入图片素材</span>
                          </div>
                        ) : (
                          <img
                            src={optimizeImgUrl(project.thumbnail, 600, 80)}
                            alt={project.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-all duration-700 filter grayscale-[8%] sepia-[4%] contrast-[102%] group-hover/photo:scale-105"
                            id={`photo-img-${project.id}`}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* BACK SIDE CARDFOLDER PAGE (Visible in rotary cylinder flip axis) */}
                  <div
                    className={`absolute inset-0 w-full h-full cursor-pointer bg-[#FDFBF7] dark:bg-zinc-900 px-3.5 py-4 flex flex-col justify-between border-2 select-none rounded-xs shadow-md ${
                      isClose 
                        ? 'border-[#1A1A1A] dark:border-zinc-200' 
                        : 'border-[#1A1A1A]/15 dark:border-zinc-700/80'
                    }`}
                    style={{ 
                      transform: 'rotateY(180deg)',
                      backfaceVisibility: 'hidden' 
                    }}
                    id={`card-back-${project.id}`}
                  >
                    {/* Right Binding Spine Margin (Since flipped, binding margin is on the right) */}
                    <div className="absolute right-0 top-0 w-7 h-full bg-[#EADDCD] dark:bg-zinc-800/80 border-l border-[#1A1A1A]/12 flex flex-col justify-between items-center py-4 z-10 shadow-inner">
                      {[...Array(5)].map((_, index) => (
                        <div key={index} className="relative w-3.5 h-3.5 rounded-full bg-stone-700 dark:bg-zinc-950 border border-stone-500/40 flex items-center justify-center shadow-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-stone-900 dark:bg-zinc-800" />
                          {/* Loop hoop extends left to center axis */}
                          <div className="absolute left-3.5 w-4 h-1 border border-zinc-400/80 bg-zinc-300/90 dark:bg-zinc-700/90 rounded-xs shadow-2xs" />
                        </div>
                      ))}
                    </div>

                    {/* Staggered tab (Flipped to left side of backleaf) */}
                    <div 
                      className={`absolute -left-3.5 w-3.5 bg-[#FDFBF7] dark:bg-zinc-900 border border-r-0 rounded-l-xs flex items-center justify-center select-none shadow-xs z-20 ${
                        isClose ? 'border-[#1A1A1A] dark:border-zinc-200' : 'border-[#1A1A1A]/15 dark:border-zinc-700'
                      }`}
                      style={{ 
                        top: `${cardDim.h * 0.08 + (idx % 6) * ((cardDim.h * 0.74) / 5)}px`,
                        height: `${cardDim.h * 0.14}px`
                      }}
                      id={`tab-back-${project.id}`}
                    >
                      <span className="text-[6.5px] sm:text-[7.5px] font-mono leading-none font-bold text-zinc-500 capitalize whitespace-nowrap font-sans shrink-0 flex items-center justify-center" style={{ writingMode: 'vertical-rl' }}>
                        {labelText}
                      </span>
                    </div>

                    {/* Workspace shifted left to evade right binder margin */}
                    <div className="flex-1 pr-6 h-full w-full relative flex flex-col justify-center items-center" id={`back-workspace-${project.id}`}>
                      <div className="w-full h-full bg-[#F3F0E8] dark:bg-zinc-950 border border-stone-300/50 dark:border-zinc-800/50 rounded-xs overflow-hidden relative shadow-inner group/photo">
                        {isEmptyFolder || !project.thumbnail ? (
                          <div className="w-full h-full bg-stone-100 dark:bg-zinc-900 flex flex-col justify-center items-center gap-1 text-stone-400 dark:text-zinc-500 rounded-xs border border-dashed border-stone-300 dark:border-zinc-800">
                            <span className="text-[10px] tracking-widest font-mono font-bold uppercase">IMAGE PLACEHOLDER</span>
                            <span className="text-[7px] font-mono text-zinc-400 dark:text-zinc-600">待置入图片素材</span>
                          </div>
                        ) : (
                          <img
                            src={optimizeImgUrl(project.thumbnail, 600, 80)}
                            alt={project.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-all duration-700 filter grayscale-[8%] sepia-[4%] contrast-[102%] group-hover/photo:scale-105"
                            id={`back-photo-img-${project.id}`}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
        {/* Close bookshelf-physical-assembly wrapper */}
        </div>
      </div>


      {/* Minimalistic gallery-style custom cursor hint text overlay removed to merge into the unified screen-wide tooltips */}

    </div>
  );
}

