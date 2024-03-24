import React, { useEffect } from 'react';

interface MousePosition {
  x: number | null;
  y: number | null;
}

const BackgroundAnimation: React.FC = () => {
  useEffect(() => {
    const canvas = document.getElementById('interactive-background') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray: Particle[] = [];
    const numberOfParticles = 100;

    const mouse: MousePosition = {
      x: null,
      y: null,
    };
   
   
    const handleMouseMove = (event: MouseEvent) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
      };
      window.addEventListener('mousemove', handleMouseMove);
  
   let animationId : number

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 15 + 1;
        this.speedX = Math.random() * 0.17 - 0.002;
        this.speedY = Math.random() * 0.17 - 0.002;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (mouse.x && mouse.y && Math.abs(mouse.x - this.x) < 50 && Math.abs(mouse.y - this.y) < 50) {
          this.speedX = -this.speedX;
          this.speedY = -this.speedY;
        }
      }
      draw() {
        ctx.fillStyle = 'rgb(77, 77, 77)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function init() {
      particlesArray = [];
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    }

    function animate() {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesArray.forEach(particle => {
        particle.update();
        particle.draw();
      });

      animationId = requestAnimationFrame(animate);
    }

    init();
    animate();

    return () => {
        window.removeEventListener('mousemove', handleMouseMove); 
    }
    cancelAnimationFrame(animationId); 
  }, []);

  return <canvas id="interactive-background"></canvas>;
};

export  {BackgroundAnimation}
