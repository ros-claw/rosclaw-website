"use client";

import { useState, useEffect, useRef } from "react";
import { ParticleBackground } from "./particle-background";

// Video URLs - served through custom domain proxy
const VIDEO_URLS = {
  // Main video via redirect
  hd: "/demo",
};

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
    const connection = (navigator as any).connection;
    if (connection) {
      const saveData = connection.saveData;
      const effectiveType = connection.effectiveType;

      // Skip video on slow connections or data saver
      if (saveData || effectiveType === "2g" || effectiveType === "slow-2g") {
        setShouldLoadVideo(false);
        setVideoError(true);
      }
    }

    // iOS Safari: need user interaction for autoplay in some cases
    // We handle this by trying to play, and falling back on error
  }, []);

  // Try to play video on mount (especially for iOS)
  useEffect(() => {
    if (videoRef.current && shouldLoadVideo) {
      const playVideo = async () => {
        try {
          // iOS Safari requires playsInline + muted for autoplay
          videoRef.current!.muted = true;
          videoRef.current!.playsInline = true;
          await videoRef.current!.play();
        } catch (err) {
          console.log("Autoplay prevented, showing fallback");
          setVideoError(true);
        }
      };
      playVideo();
    }
  }, [shouldLoadVideo]);

  // If video failed to load or shouldn't load, show particle animation fallback
  if (videoError || !shouldLoadVideo) {
    return (
      <div className="absolute inset-0 z-0">
        <ParticleBackground />
        <div className="absolute inset-0 bg-black/40 dark:opacity-100 opacity-60" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0">
      {/* Fallback shown while video loads or on mobile */}
      {(!videoLoaded || isMobile) && (
        <div className="absolute inset-0">
          <ParticleBackground />
        </div>
      )}

      {/* Video - optimized for mobile */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload={isMobile ? "metadata" : "auto"}
        webkit-playsinline="true"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          videoLoaded ? "opacity-60" : "opacity-0"
        }`}
        onLoadedData={() => setVideoLoaded(true)}
        onError={() => {
          console.warn("Video failed to load, falling back to particles");
          setVideoError(true);
        }}
      >
        <source
          src={VIDEO_URLS.hd}
          type="video/mp4"
        />
      </video>

      {/* Grid overlay */}
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
