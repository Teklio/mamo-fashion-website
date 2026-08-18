"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const LOADING_DURATION = 2300;

export default function HomeLoadingScreen() {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit" | "done">(
    "enter"
  );
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const remaining = 100 - prev;
        const increment = Math.max(0.5, remaining * 0.035);
        return Math.min(100, prev + increment);
      });
    }, LOADING_DURATION / 120);

    // Phase transitions
    const enterTimer = setTimeout(() => setPhase("hold"), 400);
    const exitTimer = setTimeout(() => setPhase("exit"), LOADING_DURATION - 500);
    const doneTimer = setTimeout(() => setPhase("done"), LOADING_DURATION);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={`home-loading-screen ${phase === "exit" ? "home-loading-exit" : phase === "enter" ? "home-loading-enter" : ""}`}
      aria-label="Loading Mamo Fashion"
      role="status"
    >
      {/* Background layers */}
      <div className="home-loading-bg-layer home-loading-bg-1" />
      <div className="home-loading-bg-layer home-loading-bg-2" />

      {/* Floating particles */}
      <div className="home-loading-particles">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="home-loading-particle"
            style={{
              left: `${8 + i * 8}%`,
              animationDelay: `${i * 0.18}s`,
              animationDuration: `${2.2 + (i % 4) * 0.4}s`,
            }}
          />
        ))}
      </div>

      {/* Center content */}
      <div className="home-loading-center">
        {/* Outer ring */}
        <div className="home-loading-ring home-loading-ring-outer" />
        <div className="home-loading-ring home-loading-ring-mid" />

        {/* Logo container */}
        <div className="home-loading-logo-wrap">
          {/* Shimmer overlay */}
          <div className="home-loading-shimmer" />

          <Image
            src="/logo/mamo-logo.png"
            alt="Mamo Fashion"
            width={250}
            height={250}
            priority
            className="home-loading-logo"
          />
        </div>

        {/* Brand text */}
        <div className="home-loading-brand">
          <span className="home-loading-brand-text">MAMO</span>
          <span className="home-loading-brand-sub">FASHION</span>
        </div>

        {/* Progress bar */}
        <div className="home-loading-progress-track">
          <div
            className="home-loading-progress-fill"
            style={{ width: `${progress}%` }}
          />
          <div
            className="home-loading-progress-glow"
            style={{ left: `${progress}%` }}
          />
        </div>

        {/* Tagline */}
        <p className="home-loading-tagline">Online · Style · You</p>
      </div>

      {/* Corner decorations */}
      <div className="home-loading-corner home-loading-corner-tl" />
      <div className="home-loading-corner home-loading-corner-tr" />
      <div className="home-loading-corner home-loading-corner-bl" />
      <div className="home-loading-corner home-loading-corner-br" />
    </div>
  );
}
