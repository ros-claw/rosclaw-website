"use client";

import { useState, useEffect } from "react";
import { ParticleBackground } from "./particle-background";

export function VideoBackground() {
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    // Check if video files exist by trying to load them
    const checkVideo = async () => {
      try {
        const response = await fetch("/hero-video.mp4", { method: "HEAD" });
        if (!response.ok) {
          setVideoError(true);
        }
      } catch {
        setVideoError(true);
      }
    };
    checkVideo();
  }, []);

  // If video failed to load or doesn't exist, show particle animation
  if (videoError) {
    return (
      <div className="absolute inset-0 z-0">
        <ParticleBackground />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40 dark:opacity-100 opacity-60" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0">
      {/* Fallback shown while video loads or if it fails */}
      {!videoLoaded && (
        <div className="absolute inset-0">
          <ParticleBackground />
        </div>
      )}

      {/* Video element */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          videoLoaded ? "opacity-60" : "opacity-0"
        }`}
        poster="/hero-poster.jpg"
        onLoadedData={() => setVideoLoaded(true)}
        onError={() => setVideoError(true)}
      >
        <source src="/hero-video.webm" type="video/webm" />
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Grid overlay for tech aesthetic */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 240, 255, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 240, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  );
}
