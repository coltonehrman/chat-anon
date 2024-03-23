import React, { useEffect } from 'react';
import './App.css';


interface MousePosition {
  x: number | null;
  y: number | null;
}

function App() {
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

    window.addEventListener('mousemove', (event) => {
      mouse.x = event.x;
      mouse.y = event.y;
    });

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
        this.speedX = Math.random() * .01 - 0.002;
        this.speedY = Math.random() * .01 -0.002;
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
        ctx.fillStyle = 'rgb(77, 77, 77)'
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
      
      requestAnimationFrame(animate);
    }
    

    init();
    animate();

    
    return () => window.removeEventListener('mousemove', (event) => {
      mouse.x = event.x;
      mouse.y = event.y;
    });
  }, []);

  return (
    <>
      <canvas id="interactive-background"></canvas>
      <div className="navigation">
        <h1 className="siteName">Chat-Anon</h1>
        <nav>
          <a href="">FAQ</a>
          <a href="">Contact Us</a>
        </nav>
      </div>
      <div className="startContainer">
        <div className="userIconContainer">
          <i className="fas fa-user"></i>
        </div>
        <button className="startButton">
          <i className="fas fa-comments"></i>
          <span>Start Chat</span>
        </button>
      </div>
    </>
  );
}

export default App;
