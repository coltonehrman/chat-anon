import React, { useEffect, useRef } from "react";

import { Particle } from "./lib/Particle";

const BackgroundAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particlesArray: Particle[] = [];
    const numberOfParticles = 100;

    const mouse = {
      x: 0,
      y: 0,
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    let animationId: number;

    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle(canvas));
    }

    function animate() {
      if (!ctx) return;

      ctx.clearRect(
        0,
        0,
        canvasRef.current?.width ?? 0,
        canvasRef.current?.height ?? 0
      );

      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";

      ctx.fillRect(
        0,
        0,
        canvasRef.current?.width ?? 0,
        canvasRef.current?.height ?? 0
      );

      particlesArray.forEach((particle) => {
        particle.update(mouse);
        particle.draw();
      });

      animationId = requestAnimationFrame(animate);
    }

    animate();
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, [canvasRef]);

  return <canvas ref={canvasRef}></canvas>;
};

export { BackgroundAnimation };
