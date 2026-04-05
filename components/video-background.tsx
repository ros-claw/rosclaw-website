"use client";

import { useState, useEffect, useRef } from "react";
import { ParticleBackground } from "./particle-background";

// Video URLs - served through custom domain proxy
// Benefits: Free egress via R2, branded URLs, global CDN
const VIDEO_URLS = {
  // 2K version - uses redirect to R2
  // Paper-friendly URL: rosclaw.io/video
  hd: "/demo",
};

export function VideoBackground() {
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [networkSpeed, setNetworkSpeed] = useState<"fast" | "slow" | "unknown">("unknown");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Detect network speed for adaptive quality
    const detectNetwork = () => {
      const connection = (navigator as any).connection;
      if (connection) {
        const saveData = connection.saveData;
        const effectiveType = connection.effectiveType;

        if (saveData || effectiveType === "2g" || effectiveType === "slow-2g") {
          setNetworkSpeed("slow");
        } else {
          setNetworkSpeed("fast");
        }
      }
    };

    detectNetwork();
  }, []);

  // If video failed to load, show particle animation fallback
  if (videoError) {
    return (
      <div className="absolute inset-0 z-0">
        <ParticleBackground />
        <div className="absolute inset-0 bg-black/40 dark:opacity-100 opacity-60" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0">
      {/* Fallback shown while video loads */}
      {!videoLoaded && (
        <div className="absolute inset-0">
          <ParticleBackground />
        </div>
      )}

      {/* Video from Cloudflare R2 - Free egress, high performance */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          videoLoaded ? "opacity-60" : "opacity-0"
        }`}
        onLoadedData={() => setVideoLoaded(true)}
        onError={() => {
          console.warn("Video failed to load, falling back to particles");
          setVideoError(true);
        }}
      >
        {/* Primary: 2K MP4 from R2 */}
        <source
          src={VIDEO_URLS.hd}
          type="video/mp4"
        />
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
