import { useEffect, useRef } from "react";

export default function HudBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let w, h;
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2 + 0.5,
      s: Math.random() * 0.4 + 0.2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      particles.forEach(p => {
        p.y -= p.s;
        if (p.y < 0) p.y = h;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,229,255,0.35)";
        ctx.fill();
      });

      requestAnimationFrame(draw);
    };

    draw();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -4,
        background: "#050B12",
      }}
    />
  );
}
