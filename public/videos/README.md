# ROSClaw Hero Video Placeholder

This directory should contain the hero background video files:

- `hero-video.webm` - WebM format (preferred)
- `hero-video.mp4` - MP4 format fallback
- `hero-poster.jpg` - Poster image for initial load

## Video Requirements

- Resolution: 1920x1080 or higher
- Duration: 10-30 seconds (looping)
- Content: Robot demonstrations, G1/UR5 in action
- Style: Dark, cinematic, tech-focused
- Overlay: Will have 60% dark overlay applied

## Recommended Approach

1. Place your actual video files in this directory
2. Remove or rename this README
3. The VideoBackground component will automatically pick them up

## Current Fallback

Until video is provided, the site uses an animated particle background
in addition to the gradient fallback.
