import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowDown } from 'lucide-react';

export function InteractiveTagline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [maskUrl, setMaskUrl] = useState<string>('');
  const pendingUpdateRef = useRef<boolean>(false);

  const [showGuideArrow, setShowGuideArrow] = useState(false);
  const [hasScratched, setHasScratchedState] = useState(false);
  const hasScratchedRef = useRef(false);
  const scratchCountRef = useRef(0);

  const setHasScratched = (val: boolean) => {
    hasScratchedRef.current = val;
    setHasScratchedState(val);
    if (val) {
      setShowGuideArrow(false);
      try {
        window.dispatchEvent(new CustomEvent('guide-tagline-scratched'));
      } catch (_) {}
    }
  };

  const [guideExpired, setGuideExpiredState] = useState(false);
  const guideExpiredRef = useRef(false);

  const setGuideExpired = (val: boolean) => {
    guideExpiredRef.current = val;
    setGuideExpiredState(val);
  };

  // Start the 5 seconds limit countdown from entering the webpage
  useEffect(() => {
    const timer = setTimeout(() => {
      setGuideExpired(true);
      setShowGuideArrow(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Responsive boundary container sizing
  const [size, setSize] = useState({ width: 500, height: 160 });

  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          // Maintain a generous width to hold the lines comfortably
          setSize({ width: Math.max(width, 480), height: Math.max(height, 160) });
        }
      });
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  // Initialize and redraw the canvas on size changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Save current contents of canvas to copy over on resize
    let tempCanvas: HTMLCanvasElement | null = null;
    let tempCtx: CanvasRenderingContext2D | null = null;
    if (canvas.width > 0 && canvas.height > 0) {
      tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      tempCtx = tempCanvas.getContext('2d');
      if (tempCtx) {
        tempCtx.drawImage(canvas, 0, 0);
      }
    }

    // Set new dimensions (which naturally clears the main canvas)
    canvas.width = size.width;
    canvas.height = size.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear starting transparent state
    ctx.clearRect(0, 0, size.width, size.height);

    // Draw the previous state back onto the resized canvas
    if (tempCanvas && tempCtx && ctx) {
      ctx.drawImage(tempCanvas, 0, 0);
    }

    // Initial mask export to maintain/propagate state
    setMaskUrl(canvas.toDataURL());
  }, [size]);

  // Paint dynamic brush trails as the user sweeps their mouse
  const drawBrush = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Organic brush sizing & jittering to make the brush stroke feel textured like mist
    const baseRadius = 60;
    const dynamicRadius = baseRadius + Math.random() * 20;
    const jitterX = x + (Math.random() - 0.5) * 10;
    const jitterY = y + (Math.random() - 0.5) * 10;

    const grad = ctx.createRadialGradient(jitterX, jitterY, 0, jitterX, jitterY, dynamicRadius);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.24)'); // Soft gradient steps to allow gradual accumulation
    grad.addColorStop(0.4, 'rgba(255, 255, 255, 0.10)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(jitterX, jitterY, dynamicRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const updateMask = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setMaskUrl(canvas.toDataURL());
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hasScratchedRef.current) {
      scratchCountRef.current += 1;
      if (scratchCountRef.current > 25) {
        setHasScratched(true);
      }
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    drawBrush(x, y);

    // Frame-rate throttle to maintain pristine 60-120fps performance
    if (!pendingUpdateRef.current) {
      pendingUpdateRef.current = true;
      requestAnimationFrame(() => {
        updateMask();
        pendingUpdateRef.current = false;
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className="hidden lg:flex absolute left-8 xl:left-14 top-1/2 -translate-y-1/2 flex-col justify-center py-10 pr-10 z-30 pointer-events-auto select-none text-left cursor-default"
      style={{
        width: `${size.width}px`,
        height: `${size.height}px`,
      }}
      onMouseMove={handleMouseMove}
      id="evolving-archive-sidebar-block"
    >
      <canvas ref={canvasRef} className="hidden" />

      {/* Styled text elements container with dynamic CSS Mask matching viewport colors */}
      <div
        className="flex flex-col gap-3 transition-opacity duration-300"
        style={{
          WebkitMaskImage: maskUrl ? `url(${maskUrl})` : 'none',
          maskImage: maskUrl ? `url(${maskUrl})` : 'none',
          WebkitMaskSize: '100% 100%',
          maskSize: '100% 100%',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
        }}
      >
        <motion.p
          animate={{ y: [0, -14, 0] }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="font-serif text-[18px] md:text-[22px] italic text-[#1A1A1A]/85 dark:text-zinc-200 leading-none"
        >
          “An evolving personal archive.”
        </motion.p>
        <motion.p
          animate={{ y: [0, -14, 0] }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.6
          }}
          className="font-serif text-[18px] md:text-[22px] italic text-[#1A1A1A]/55 dark:text-zinc-400 leading-none mt-2"
        >
          “Not everything here is finished.”
        </motion.p>
      </div>

      {/* Interactive Guidance Blinking and Bouncing White Arrow */}
      <AnimatePresence>
        {showGuideArrow && (
          <motion.div
            key="tagline-guide-arrow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute left-1 top-[-26px] pointer-events-none z-40"
            id="tagline-swipe-guide-arrow"
          >
            <motion.div
              animate={{ 
                opacity: [0.45, 1, 0.45],
                y: [0, 4, 0] 
              }}
              transition={{
                opacity: {
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeInOut"
                },
                y: {
                  duration: 1.4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="flex items-center gap-2.5"
            >
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-900 dark:bg-zinc-800 border border-white/20 shadow-md">
                <ArrowDown className="w-3 h-3 text-white" />
              </div>
              <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-zinc-800 dark:text-zinc-200 bg-white/95 dark:bg-zinc-900/95 border border-[#1A1A1A]/10 dark:border-white/10 px-2.5 py-1 rounded-none whitespace-nowrap shadow-sm">
                擦出隐藏文字 / SWIPE HERE
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
