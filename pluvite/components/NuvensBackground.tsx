"use client";

import React, { useState, useEffect, useMemo } from "react";

export default function NuvensBackground() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const clouds = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => {
      const duration = Math.random() * 15 + 20; // Tempo de subida
      return {
        id: i,
        left: `${Math.random() * 120 - 10}%`,
        duration: `${duration}s`,
        // O "-" antes do Math faz a nuvem já começar em uma altura aleatória
        delay: `-${Math.random() * duration}s`,
        scale: Math.random() * 0.5 + 0.5,
      };
    });
  }, []);

  if (!isClient) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {clouds.map((cloud) => (
        <div
          key={cloud.id}
          className="absolute animate-particle"
          style={{
            left: cloud.left,
            bottom: "-150px",
            animationDelay: cloud.delay,
            animationDuration: cloud.duration,
            opacity: 0.6,
            transform: `scale(${cloud.scale})`,
          }}
        >
          {/* O desenho da sua nuvem */}
          <div className="relative bg-cyan-900 shadow-xl w-32 h-10 rounded-full">
            <div className="absolute -top-6 left-4 w-14 h-14 bg-slate-50 rounded-full"></div>
            <div className="absolute -top-9 left-12 w-18 h-18 bg-slate-50 rounded-full"></div>
            <div className="absolute -top-5 left-24 w-12 h-12 bg-slate-50 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
