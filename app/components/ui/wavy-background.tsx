"use client";
import { cn } from "../../utils/cn";
import { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  [key: string]: any;
}) => {
  const noise = createNoise3D();
  let w: number,
    h: number,
    nt: number,
    i: number,
    x: number,
    ctx: any,
    canvas: any;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const init = () => {
    canvas = canvasRef.current;
    ctx = canvas.getContext("2d");
    w = ctx.canvas.width = window.innerWidth;
    h = ctx.canvas.height = window.innerHeight;
    ctx.filter = `blur(${blur}px)`;
    nt = 0;
    window.onresize = () => {
      w = ctx.canvas.width = window.innerWidth;
      h = ctx.canvas.height = window.innerHeight;
      ctx.filter = `blur(${blur}px)`;
    };
    render();
  };

  const waveColors = colors ?? [
    "#38bdf8",
    "#818cf8",
    "#c084fc",
    "#e879f9",
    "#22d3ee",
  ];

  const drawWave = (n: number) => {
    ctx.beginPath();
    ctx.lineWidth = waveWidth ?? 50;
    ctx.strokeStyle = waveColors[n % waveColors.length];
    for (i = 0; i < w; i += 5) {
      x = noise(i / 800, 0.3, nt + n) * 100;
      ctx.lineTo(i, h * 0.5 + x);
    }
    ctx.stroke();
    ctx.closePath();
  };

  const render = () => {
    nt += speed === "fast" ? 0.002 : 0.0005;
    ctx.fillStyle = backgroundFill ?? "#0E1117";
    ctx.globalAlpha = waveOpacity ?? 0.5;
    ctx.fillRect(0, 0, w, h);
    for (i = 0; i < 5; i++) {
      drawWave(i);
    }
    requestAnimationFrame(render);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div
      className={cn(
        "h-screen flex flex-col items-center justify-center",
        containerClassName
      )}
    >
      <canvas
        className="absolute inset-0 z-0"
        ref={canvasRef}
        id="canvas"
      ></canvas>
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};
