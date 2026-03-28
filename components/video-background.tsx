"use client";

export function VideoBackground() {
  return (
    <div className="absolute inset-0 z-0">
      {/* Fallback gradient background (shown while video loads or if video fails) */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-cognitive-cyan/5" />

      {/* Video placeholder - replace src with actual video file */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-60"
        poster="/hero-poster.jpg"
      >
        {/* Add your video sources here */}
        <source src="/hero-video.webm" type="video/webm" />
        <source src="/hero-video.mp4" type="video/mp4" />
        {/* Fallback message */}
        Your browser does not support the video tag.
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
