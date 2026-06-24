import React, { useRef, useEffect, useState } from 'react';

interface InteractiveRandomButtonProps {
  onClick: () => void;
  key?: string;
}

export function InteractiveRandomButton({ onClick }: InteractiveRandomButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [maskUrl, setMaskUrl] = useState<string>('');
  const pendingUpdateRef = useRef<boolean>(false);
  const hoverCountRef = useRef(0);

  // Styled floating box dimensions
  const [size, setSize] = useState({ width: 95, height: 100 });

  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          setSize({ width: Math.max(width, 85), height: Math.max(height, 90) });
        }
      });
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  // Initialize and clear canvas to starting hidden state
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Save previous canvas contents before resizing
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

    // Set new dimensions (which automatically clears the canvas)
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

    // Initial mask export to propagate state
    setMaskUrl(canvas.toDataURL());
  }, [size]);

  // Paint dynamic brush trails as the user sweeps their mouse over the button
  const drawBrush = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const baseRadius = 45;
    const dynamicRadius = baseRadius + Math.random() * 15;
    const jitterX = x + (Math.random() - 0.5) * 6;
    const jitterY = y + (Math.random() - 0.5) * 6;

    const grad = ctx.createRadialGradient(jitterX, jitterY, 0, jitterX, jitterY, dynamicRadius);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.4)'); // Smooth build-up for high-precision reveal
    grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.15)');
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
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    drawBrush(x, y);

    hoverCountRef.current += 1;
    if (hoverCountRef.current === 20) {
      try {
        window.dispatchEvent(new CustomEvent('guide-bottom-panel-done'));
      } catch (_) {}
    }

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
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-[110] pointer-events-auto select-none flex items-center justify-center p-2 cursor-default"
      style={{
        width: `${size.width}px`,
        height: `${size.height}px`,
      }}
      onMouseMove={handleMouseMove}
      id="random-archive-drawer-container"
    >
      <canvas ref={canvasRef} className="hidden" />

      {/* Structured element layer with CSS mask */}
      <div
        className="w-full h-full flex flex-col items-center justify-center transition-opacity duration-300"
        style={{
          WebkitMaskImage: maskUrl ? `url(${maskUrl})` : 'none',
          maskImage: maskUrl ? `url(${maskUrl})` : 'none',
          WebkitMaskSize: '100% 100%',
          maskSize: '100% 100%',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
        }}
      >
        <button
          type="button"
          onClick={onClick}
          className="cursor-pointer group flex flex-col items-center justify-center p-1.5 border border-dashed border-[#1A1A1A]/12 dark:border-white/10 hover:border-solid hover:border-[#1A1A1A]/50 dark:hover:border-white/50 bg-transparent text-[#1A1A1A]/60 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-all duration-300 font-mono shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 rounded-md w-full h-full"
          id="btn-open-random-archive"
          title="Random library card"
        >
          {/* Custom vector illustration precisely rendering the reference style artwork */}
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-0.5 transition-transform duration-300 group-hover:scale-105">
            <svg
              viewBox="0 0 200 160"
              className="w-full h-full filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:drop-shadow-[0_1px_2px_rgba(255,255,255,0.01)]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Backside tickets in bowl (layered behind bowl front walls) */}
              {/* Ticket Left */}
              <g transform="rotate(-18 55 112)">
                <rect x="55" y="112" width="22" height="30" rx="3.5" fill="#FED7AA" stroke="#1A1A1A" strokeWidth="4.5" />
                <line x1="60" y1="120" x2="72" y2="120" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="60" y1="126" x2="68" y2="126" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" />
              </g>

              {/* Ticket Middle-Left */}
              <g transform="rotate(-4 78 116)">
                <rect x="78" y="116" width="22" height="30" rx="3.5" fill="#FFE082" stroke="#1A1A1A" strokeWidth="4.5" />
                <line x1="83" y1="124" x2="95" y2="124" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="83" y1="130" x2="91" y2="130" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" />
              </g>

              {/* Ticket Middle-Right */}
              <g transform="rotate(12 101 114)">
                <rect x="101" y="114" width="22" height="30" rx="3.5" fill="#FFE082" stroke="#1A1A1A" strokeWidth="4.5" />
                <line x1="106" y1="122" x2="118" y2="122" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="106" y1="128" x2="114" y2="128" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" />
              </g>

              {/* Ticket Right */}
              <g transform="rotate(32 124 112)">
                <rect x="124" y="112" width="22" height="30" rx="3.5" fill="#FED7AA" stroke="#1A1A1A" strokeWidth="4.5" />
                <line x1="129" y1="120" x2="141" y2="120" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="129" y1="126" x2="137" y2="126" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" />
              </g>

              {/* Glass Bowl Profile */}
              <path
                d="M 45,95 Q 35,120 54,140 Q 64,145 100,145 Q 136,145 146,140 Q 165,120 155,95 L 132,95 C 135,108 141,126 128,136 Q 100,140 72,136 C 59,126 65,108 68,95 H 45"
                fill="#FFFFFF"
                fillOpacity="0.4"
                stroke="#1A1A1A"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Glass Bowl Shine lines */}
              <path
                d="M 52,118 Q 44,128 54,136"
                stroke="#1A1A1A"
                strokeWidth="3.5"
                strokeLinecap="round"
                opacity="0.35"
              />

              {/* Ticket currently being drawn upward */}
              <g className="transition-transform duration-300 group-hover:-translate-y-1.5">
                <rect x="85" y="60" width="25" height="36" rx="3.5" fill="#FFE082" stroke="#1A1A1A" strokeWidth="4.5" />
                {/* Horizontal writing simulation inside the drawn ticket */}
                <line x1="90" y1="69" x2="105" y2="69" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="90" y1="75" x2="100" y2="75" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="90" y1="81" x2="102" y2="81" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" />
              </g>

              {/* The Hand drawing the ticket (Index & curlings) */}
              <g className="transition-transform duration-300 group-hover:-translate-y-1.5 group-active:-translate-y-1">
                {/* Hand wrist background color to hide underlying geometries */}
                <path
                  d="M 112,48 L 136,46 L 138,76 L 114,78 Z"
                  fill="#FFE0D3"
                />

                {/* Sleeve Red Cuff inside hand wrist */}
                <rect x="135" y="42" width="28" height="38" rx="3.5" fill="#FF5252" stroke="#1A1A1A" strokeWidth="4.5" />
                {/* Cuff Golden Link Button */}
                <circle cx="149" cy="61" r="5" fill="#FFCD00" stroke="#1A1A1A" strokeWidth="3" />

                {/* Hand Palm skin and curved profile */}
                <path
                  d="M 112,48 C 114,44 118,44 124,44 L 136,44 L 136,74 L 126,74 C 120,74 116,72 112,66"
                  fill="#FFE0D3"
                  stroke="#1A1A1A"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Curved Fingers drawing the ticket top edge */}
                {/* Finger: Pinky */}
                <path
                  d="M 112,58 C 110,50 105,50 102,58 L 102,68 C 102,70 106,70 106,68 L 106,58"
                  fill="#FFE0D3"
                  stroke="#1A1A1A"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Finger: Ring */}
                <path
                  d="M 106,56 C 104,48 99,48 96,56 L 96,66 C 96,68 100,68 100,66 L 100,56"
                  fill="#FFE0D3"
                  stroke="#1A1A1A"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Finger: Middle */}
                <path
                  d="M 100,54 C 98,46 93,46 90,54 L 90,64 C 90,66 94,66 94,64 L 94,54"
                  fill="#FFE0D3"
                  stroke="#1A1A1A"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Finger: Index Finger grabbing ticket top corner */}
                <path
                  d="M 94,52 C 92,44 87,44 84,52 L 84,62 C 84,64 88,64 88,62 L 88,52"
                  fill="#FFE0D3"
                  stroke="#1A1A1A"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Hand Thumb wrapping around the right-hand corner */}
                <path
                  d="M 115,66 C 109,66 104,64 104,58 L 108,56 C 108,60 111,62 115,62"
                  fill="#FFE0D3"
                  stroke="#1A1A1A"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </div>

          {/* Sincere literal typography reflecting high archive styling discipline */}
          <span className="text-[6.5px] uppercase tracking-[0.14em] font-bold text-[#1A1A1A]/85 dark:text-zinc-300 mt-0.5 text-center leading-none">
            RANDOM DRAW
          </span>
        </button>
      </div>
    </div>
  );
}
