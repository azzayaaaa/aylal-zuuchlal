"use client";

import { useEffect, useRef, useState } from "react";

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;

    const replay = () => {
      video.currentTime = 0;
      void video.play().catch(() => undefined);
    };

    video.addEventListener("ended", replay);
    void video.play().catch(() => undefined);

    return () => video.removeEventListener("ended", replay);
  }, []);

  useEffect(() => {
    function updateViewport() {
      setIsDesktop(window.innerWidth >= 1024);
    }

    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  return (
    <>
      <video
        aria-hidden="true"
        className="absolute inset-0 -z-30 h-full w-full scale-105 object-cover opacity-75 blur-sm"
        src="/videos/sakura-hero.mp4?v=4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=80"
      />
      <video
        ref={videoRef}
        className="hero-video absolute inset-0 -z-20 h-full w-full"
        style={{
          filter: "saturate(1.18) contrast(1.08) brightness(1.08)",
          objectFit: isDesktop ? "contain" : "cover",
          objectPosition: isDesktop ? "center center" : "55% center",
        }}
        src="/videos/sakura-hero.mp4?v=4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=80"
      />
    </>
  );
}
