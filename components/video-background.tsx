"use client";

import { useState, useEffect, useRef } from "react";
import { ParticleBackground } from "./particle-background";

// Video URL - served through custom domain proxy
const VIDEO_URL = "/demo";

export function VideoBackground() {
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Detect mobile devices
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileDevice = /iphone|ipad|ipod|android|mobile/.test(userAgent);
    setIsMobile(isMobileDevice);

    // Check for data saver mode
    const connection = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (connection) {
      const { saveData, effectiveType } = connection;

      // Skip video on slow connections or data saver
      if (saveData || effectiveType === "2g" || effectiveType === "slow-2g") {
        setShouldLoadVideo(false);
        setVideoError(true);
      }
    }
  }, []);

  useEffect(() => {
    if (videoRef.current && shouldLoadVideo && !isMobile) {
      const playVideo = async () => {
        try {
          videoRef.current!.muted = true;
          videoRef.current!.playsInline = true;
          await videoRef.current!.play();
        } catch {
          setVideoError(true);
        }
      };
      playVideo();
    }
  }, [shouldLoadVideo, isMobile]);

  // If video failed to load, is mobile, or shouldn't load, show atmospheric fallback
  if (videoError || !shouldLoadVideo || isMobile) {
    return (
      <div className="absolute inset-0 z-0">
        <ParticleBackground />
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 72% 40%, rgba(0, 224, 255, 0.12), transparent 34%),
              radial-gradient(circle at 20% 80%, rgba(255, 62, 0, 0.08), transparent 30%),
              linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.95) 100%)
            `,
          }}
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0">
      {/* Fallback shown while video loads */}
      {(!videoLoaded || isMobile) && (
        <div className="absolute inset-0">
          <ParticleBackground />
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          videoLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{
          opacity: 0.28,
          filter: "saturate(0.75) contrast(0.9) brightness(0.55)",
        }}
        onLoadedData={() => setVideoLoaded(true)}
        onError={() => setVideoError(true)}
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>

      {/* Subtle grid overlay */}
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
