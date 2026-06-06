"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const cinematicScenes = [
  {
    day: "Day 1 / Day 7",
    title: "Улаанбаатар — Аялал эхлэх мөч",
    tone: "Airport departure",
    routeLabel: "UB → Tokyo",
    copy: "Mongolia → Japan аялал зөөлөн тэнгэрээр эхэлнэ.",
  },
  {
    day: "Day 2 / Day 7",
    title: "Tokyo Arrival",
    tone: "City lights",
    routeLabel: "Tokyo → Asakusa",
    copy: "Хотын гэрэл, анхны оройн алхалт, Tokyo-ийн хэмнэл.",
  },
  {
    day: "Day 2 / Day 7",
    title: "Asakusa / Sensoji",
    tone: "Old Tokyo",
    routeLabel: "Asakusa → Skytree",
    copy: "Дэнлүү, сүмийн гудамж, хуучин Tokyo-ийн дулаан гэрэл.",
  },
  {
    day: "Day 3 / Day 7",
    title: "Skytree / Sumida River",
    tone: "River skyline",
    routeLabel: "Skytree → Shibuya",
    copy: "Sumida River дагуу Skytree усанд туссан night view.",
  },
  {
    day: "Day 4 / Day 7",
    title: "Shibuya Night",
    tone: "Night crossing",
    routeLabel: "Shibuya → Fuji",
    copy: "Неон, хүмүүсийн урсгал, Tokyo хамгийн эрчтэйгээр амьсгална.",
  },
  {
    day: "Day 5 / Day 7",
    title: "Mount Fuji",
    tone: "Mountain view",
    routeLabel: "Fuji → Kawaguchiko",
    copy: "Хотын гэрлээс гарч Fuji-ийн нам гүм панорама руу.",
  },
  {
    day: "Day 5 / Day 7",
    title: "Lake Kawaguchiko",
    tone: "Lake reflection",
    routeLabel: "Kawaguchiko → Oshino",
    copy: "Нуурын усанд туссан Fuji, тайван өглөөний аялал.",
  },
  {
    day: "Day 6 / Day 7",
    title: "Oshino Hakkai",
    tone: "Spring village",
    routeLabel: "Oshino → Gotemba",
    copy: "Булгийн тунгалаг ус, Fuji доорх жижиг тосгоны хэмнэл.",
  },
  {
    day: "Day 6 / Day 7",
    title: "Gotemba Premium Outlets",
    tone: "Premium shopping",
    routeLabel: "Gotemba → Disneyland",
    copy: "Premium shopping, cafe break, Fuji view боломжтой өдөр.",
  },
  {
    day: "Day 7 / Day 7",
    title: "Disneyland / Akihabara",
    tone: "Final night",
    routeLabel: "Tokyo → Disneyland / Akihabara",
    copy: "Final night glow, family route эсвэл anime city walk.",
  },
];

export function GsapLanding() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const heroVideo = document.querySelector<HTMLVideoElement>(".gsap-hero video");
    const heroVideoStartTime = 11;
    const playHeroVideo = () => {
      if (!heroVideo) return;
      heroVideo.muted = true;
      if (heroVideo.readyState >= 1 && heroVideo.currentTime < heroVideoStartTime - 0.25) {
        heroVideo.currentTime = heroVideoStartTime;
      }
      heroVideo.play().catch(() => {
        // Browsers may delay autoplay until the first user gesture.
      });
    };
    const onHeroVideoMetadata = () => {
      if (!heroVideo) return;
      heroVideo.currentTime = heroVideoStartTime;
      playHeroVideo();
    };
    const onHeroVideoEnded = () => {
      if (!heroVideo) return;
      heroVideo.currentTime = heroVideoStartTime;
      playHeroVideo();
    };
    heroVideo?.addEventListener("loadedmetadata", onHeroVideoMetadata);
    heroVideo?.addEventListener("ended", onHeroVideoEnded);
    playHeroVideo();
    window.addEventListener("pointerdown", playHeroVideo, { once: true });
    window.addEventListener("scroll", playHeroVideo, { once: true });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => {
        window.removeEventListener("pointerdown", playHeroVideo);
        window.removeEventListener("scroll", playHeroVideo);
        heroVideo?.removeEventListener("loadedmetadata", onHeroVideoMetadata);
        heroVideo?.removeEventListener("ended", onHeroVideoEnded);
      };
    }

    gsap.ticker.lagSmoothing(0);
    const wheelCleanups: Array<() => void> = [];
    const context = gsap.context(() => {
      gsap.fromTo(".gsap-hero-bg", { scale: 1 }, {
        scale: 1.12,
        ease: "none",
        scrollTrigger: { trigger: ".gsap-hero", start: "top top", end: "bottom top", scrub: true },
      });

      gsap.from(".split-line", { yPercent: 105, opacity: 0, duration: 1.05, ease: "power4.out", stagger: 0.09 });

      gsap.utils.toArray<HTMLElement>(".petal, .map-petal").forEach((petal, index) => {
        gsap.to(petal, {
          y: index % 2 ? "72vh" : "48vh",
          x: index % 2 ? 90 : -70,
          rotate: index % 2 ? 160 : -140,
          duration: 12 + index,
          ease: "none",
          repeat: -1,
          delay: index * 0.55,
        });
      });

      const hero = document.querySelector<HTMLElement>(".gsap-hero");
      const heroPetals = gsap.utils.toArray<HTMLElement>(".hero-petal");
      if (hero && heroPetals.length) {
        const onHeroMove = (event: MouseEvent) => {
          const x = (event.clientX / window.innerWidth - 0.5) * 22;
          const y = (event.clientY / window.innerHeight - 0.5) * 14;
          gsap.to(heroPetals, { x, y, duration: 1.2, ease: "power2.out", stagger: 0.01 });
        };
        hero.addEventListener("mousemove", onHeroMove);
        wheelCleanups.push(() => hero.removeEventListener("mousemove", onHeroMove));
      }

      gsap.to(".hero-petal", {
        opacity: 0.92,
        scale: 1.18,
        ease: "none",
        scrollTrigger: { trigger: ".fuji-depth-section", start: "top bottom", end: "top 35%", scrub: true },
      });

      gsap.to(".hero-petal", {
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: ".disney-finale", start: "top bottom", end: "top 35%", scrub: true },
      });

      gsap.utils.toArray<HTMLElement>(".blur-reveal").forEach((item) => {
        gsap.fromTo(item, { opacity: 0, y: 24, filter: "blur(4px)" }, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 84%" },
        });
      });

      gsap.utils.toArray<HTMLElement>(".mask-reveal").forEach((item) => {
        gsap.fromTo(item, { clipPath: "inset(18% 18% 18% 18% round 20px)", scale: 1.08 }, {
          clipPath: "inset(0% 0% 0% 0% round 20px)",
          scale: 1,
          duration: 1.05,
          ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 78%" },
        });
      });

      gsap.fromTo(".editorial-tour-card", { y: 42, autoAlpha: 0, filter: "blur(7px)" }, {
        y: 0,
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".destination-gallery", start: "top 72%" },
      });

      gsap.to(".booking-timeline-fill", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: ".booking-timeline-section", start: "top 78%", end: "bottom 68%", scrub: true },
      });

      gsap.fromTo(".booking-step", { x: 22, autoAlpha: 0 }, {
        x: 0,
        autoAlpha: 1,
        duration: 0.62,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ".booking-timeline-section", start: "top 72%" },
      });

      gsap.fromTo(".review-card", { y: 32, autoAlpha: 0, filter: "blur(5px)" }, {
        y: 0,
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: 0.72,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".reviews-section", start: "top 76%" },
      });

      gsap.fromTo(".review-star", { scale: 0.72, autoAlpha: 0 }, {
        scale: 1,
        autoAlpha: 1,
        duration: 0.35,
        ease: "back.out(1.8)",
        stagger: 0.035,
        scrollTrigger: { trigger: ".reviews-section", start: "top 72%" },
      });

      gsap.fromTo(".faq-item", { y: 18, autoAlpha: 0 }, {
        y: 0,
        autoAlpha: 1,
        duration: 0.55,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ".faq-section", start: "top 78%" },
      });

      gsap.fromTo(".footer-reveal", { y: 28, autoAlpha: 0 }, {
        y: 0,
        autoAlpha: 1,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".site-footer", start: "top 88%" },
      });

      gsap.utils.toArray<HTMLElement>(".parallax-bg").forEach((item) => {
        gsap.to(item, {
          yPercent: 10,
          ease: "none",
          scrollTrigger: { trigger: item.parentElement, start: "top bottom", end: "bottom top", scrub: true },
        });
      });

      gsap.utils.toArray<HTMLElement>(".fuji-depth-layer").forEach((layer) => {
        const depth = Number(layer.dataset.depth ?? 10);
        gsap.to(layer, {
          yPercent: depth,
          scale: 1 + depth / 260,
          ease: "none",
          scrollTrigger: { trigger: ".fuji-depth-section", start: "top bottom", end: "bottom top", scrub: true },
        });
      });

      gsap.fromTo(".fuji-depth-copy", { y: 34, autoAlpha: 0, filter: "blur(6px)" }, {
        y: 0,
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ".fuji-depth-section", start: "top 68%" },
      });

      gsap.fromTo(".shibuya-copy", { y: 24, autoAlpha: 0, filter: "blur(8px)" }, {
        y: 0,
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ".shibuya-neon-section", start: "top 65%" },
      });

      gsap.to(".shibuya-neon-glow", {
        opacity: 0.72,
        duration: 2.4,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });

      gsap.fromTo(".firework-particle", { scale: 0, autoAlpha: 0 }, {
        scale: 1,
        autoAlpha: 0.9,
        y: -90,
        x: () => gsap.utils.random(-90, 90),
        duration: () => gsap.utils.random(1.1, 1.8),
        ease: "power2.out",
        stagger: 0.05,
        repeat: -1,
        repeatDelay: 1.2,
        scrollTrigger: { trigger: ".disney-finale", start: "top 72%" },
      });

      gsap.fromTo(".disney-finale-copy", { y: 30, autoAlpha: 0, filter: "blur(7px)" }, {
        y: 0,
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: 0.9,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: { trigger: ".disney-finale", start: "top 64%" },
      });

      const journey = document.querySelector<HTMLElement>(".journey-section");
      const pin = document.querySelector<HTMLElement>(".cinematic-journey-pin");
      const images = gsap.utils.toArray<HTMLElement>(".cinematic-scene-image");
      const title = document.querySelector<HTMLElement>(".cinematic-scene-title");
      const day = document.querySelector<HTMLElement>(".cinematic-scene-day");
      const tone = document.querySelector<HTMLElement>(".cinematic-scene-tone");
      const copy = document.querySelector<HTMLElement>(".cinematic-scene-copy");
      const routeLabel = document.querySelector<HTMLElement>(".cinematic-route-label");
      const stopCount = document.querySelector<HTMLElement>(".cinematic-stop-count");
      const bottomProgress = document.querySelector<HTMLElement>(".cinematic-bottom-progress");
      const routePathElement = document.querySelector<SVGPathElement>(".cinematic-route-path");
      const routePlane = document.querySelector<HTMLElement>(".cinematic-route-plane");
      const routeStops = gsap.utils.toArray<SVGGElement>(".cinematic-route-stop");
      const routeLabelItems = gsap.utils.toArray<HTMLElement>(".cinematic-route-label-item");
      const storyCue = document.querySelector<HTMLElement>(".journey-story-cue");
      const warmWipe = document.querySelector<HTMLElement>(".journey-warm-wipe");
      const cloudVeil = document.querySelector<HTMLElement>(".journey-cloud-veil");
      const bokeh = document.querySelector<HTMLElement>(".journey-bokeh");
      const mist = document.querySelector<HTMLElement>(".journey-mist");
      const neonSheen = document.querySelector<HTMLElement>(".journey-neon-sheen");
      const lightRays = document.querySelector<HTMLElement>(".journey-light-rays");

      if (journey && pin && images.length && title && day && tone && copy) {
        let currentSceneIndex = 0;
        let isAnimating = false;
        let sceneTimeline: gsap.core.Timeline | undefined;
        const textNodes = [tone, day, title, copy];
        const cinematicOverlays = [warmWipe, cloudVeil, bokeh, mist, neonSheen, lightRays].filter(Boolean) as HTMLElement[];
        const storyCues = [
          "Departure pulse",
          "Cloud veil to Tokyo",
          "Walk into Asakusa",
          "River skyline",
          "Night energy shift",
          "Fuji breath",
          "Lake reflection",
          "Documentary village cut",
          "Shopping route memory",
          "Finale bloom",
        ];
        const sceneCount = Math.min(cinematicScenes.length, images.length);
        const usableImages = images.slice(0, sceneCount);
        const routePath = routePathElement;
        const hasPathLengthApi = !!routePath && typeof routePath.getTotalLength === "function" && typeof routePath.getPointAtLength === "function";
        const routeTotalLength = hasPathLengthApi ? routePath.getTotalLength() : 0;
        const routeStopCoords = routeStops.slice(0, sceneCount).map((stop) => {
          const transform = stop.getAttribute("transform") ?? "";
          const match = transform.match(/translate\(([-\d.]+)\s+([-\d.]+)\)/);
          return {
            x: match ? Number(match[1]) : 0,
            y: match ? Number(match[2]) : 0,
          };
        });
        const routeStopLengths = hasPathLengthApi && routeStops.length
          ? routeStops.slice(0, sceneCount).map((stop) => {
            const transform = stop.getAttribute("transform") ?? "";
            const match = transform.match(/translate\(([-\d.]+)\s+([-\d.]+)\)/);
            const targetX = match ? Number(match[1]) : 0;
            const targetY = match ? Number(match[2]) : 0;
            let closestLength = 0;
            let closestDistance = Number.POSITIVE_INFINITY;
            for (let length = 0; length <= routeTotalLength; length += Math.max(routeTotalLength / 160, 1)) {
              const point = routePath.getPointAtLength(length);
              const distance = Math.hypot(point.x - targetX, point.y - targetY);
              if (distance < closestDistance) {
                closestDistance = distance;
                closestLength = length;
              }
            }
            return closestLength;
          })
          : [];

        if (routePath && routeTotalLength) {
          gsap.set(routePath, {
            strokeDasharray: routeTotalLength,
            strokeDashoffset: routeTotalLength,
          });
        }

        gsap.set(usableImages.slice(1), { autoAlpha: 0, scale: 1.04, filter: "blur(4px)" });
        gsap.set(usableImages[0], { autoAlpha: 1, scale: 1.01, filter: "blur(0px)" });
        gsap.set(cinematicOverlays, { autoAlpha: 0 });
        if (storyCue) gsap.set(storyCue, { autoAlpha: 0, y: 12, filter: "blur(5px)" });

        const setText = (index: number) => {
          tone.textContent = cinematicScenes[index].tone;
          day.textContent = cinematicScenes[index].day;
          title.textContent = cinematicScenes[index].title;
          copy.textContent = cinematicScenes[index].copy;
          if (routeLabel) routeLabel.textContent = cinematicScenes[index].routeLabel;
          if (stopCount) stopCount.textContent = `Stop ${index + 1} / ${sceneCount}`;
        };

        const getRoutePoint = (index: number) => {
          if (!routePath || !routePlane) return null;

          const routeLength = routeStopLengths[index] ?? 0;
          const point = hasPathLengthApi && routeTotalLength ? routePath.getPointAtLength(routeLength) : routeStopCoords[index];
          const nextCoord = routeStopCoords[Math.min(sceneCount - 1, index + 1)] ?? point;
          const nextLength = Math.min(routeTotalLength, routeLength + 1);
          const nextPoint = hasPathLengthApi && routeTotalLength ? routePath.getPointAtLength(nextLength) : nextCoord;
          const svg = routePath.ownerSVGElement ?? routePath.closest("svg");
          const viewBox = svg?.viewBox.baseVal;
          const svgRect = svg?.getBoundingClientRect();
          const planeParentRect = routePlane.closest<HTMLElement>(".cinematic-route-overlay")?.getBoundingClientRect()
            ?? routePlane.offsetParent?.getBoundingClientRect();
          if (!viewBox || !svgRect || !planeParentRect) return null;

          const x = svgRect.left - planeParentRect.left + ((point.x - viewBox.x) / viewBox.width) * svgRect.width;
          const y = svgRect.top - planeParentRect.top + ((point.y - viewBox.y) / viewBox.height) * svgRect.height;
          const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);
          const leftPercent = ((point.x - viewBox.x) / viewBox.width) * 100;
          const topPercent = ((point.y - viewBox.y) / viewBox.height) * 100;
          return { x, y, leftPercent, topPercent, angle, length: routeLength };
        };

        const setRouteUi = (index: number) => {
          routeStops.forEach((stop, stopIndex) => {
            if (stopIndex === index) stop.setAttribute("data-active", "");
            else stop.removeAttribute("data-active");
            if (stopIndex < index) stop.setAttribute("data-complete", "");
            else stop.removeAttribute("data-complete");
          });
          routeLabelItems.forEach((item, itemIndex) => {
            if (itemIndex === index) item.setAttribute("data-active", "");
            else item.removeAttribute("data-active");
            if (itemIndex < index) item.setAttribute("data-complete", "");
            else item.removeAttribute("data-complete");
          });
          if (bottomProgress) gsap.set(bottomProgress, { scaleX: sceneCount > 1 ? index / (sceneCount - 1) : 0 });
        };

        const setPlaneAtStop = (index: number) => {
          const routePoint = getRoutePoint(index);
          if (!routePoint || !routePlane) return;

          gsap.set(routePlane, {
            left: `${routePoint.leftPercent}%`,
            top: `${routePoint.topPercent}%`,
            xPercent: -50,
            yPercent: -50,
            rotate: routePoint.angle,
          });
          if (routePath && routeTotalLength) {
            gsap.set(routePath, { strokeDashoffset: routeTotalLength - routePoint.length });
          }
        };

        const setScene = (index: number) => {
          currentSceneIndex = index;
          setText(index);
          setRouteUi(index);
          usableImages.forEach((image, imageIndex) => {
            gsap.set(image, {
              autoAlpha: imageIndex === index ? 1 : 0,
              scale: imageIndex === index ? 1.01 : 1.04,
              filter: imageIndex === index ? "blur(0px)" : "blur(4px)",
              xPercent: 0,
              yPercent: 0,
            });
          });
          setPlaneAtStop(index);
        };

        const goToScene = (nextIndex: number) => {
          const clampedIndex = Math.min(sceneCount - 1, Math.max(0, nextIndex));
          if (clampedIndex === currentSceneIndex || isAnimating) return;

          const currentImage = usableImages[currentSceneIndex];
          const nextImage = usableImages[clampedIndex];
          const routePoint = getRoutePoint(clampedIndex);

          isAnimating = true;
          sceneTimeline?.kill();
          const isFujiMood = clampedIndex === 5 || clampedIndex === 6;
          const isNightMood = clampedIndex === 1 || clampedIndex === 4 || clampedIndex === 9;
          const nextStartScale = isFujiMood ? 1.035 : isNightMood ? 1.065 : 1.055;
          const nextSettleScale = isFujiMood ? 1.012 : 1.018;
          sceneTimeline = gsap.timeline({
            defaults: { ease: "power3.inOut" },
            onComplete: () => {
              gsap.set(cinematicOverlays, { autoAlpha: 0 });
              if (storyCue) gsap.set(storyCue, { autoAlpha: 0 });
              isAnimating = false;
            },
          });

          sceneTimeline.set(cinematicOverlays, { autoAlpha: 0 }, 0);
          if (storyCue) {
            sceneTimeline
              .set(storyCue, { textContent: storyCues[clampedIndex] ?? "Travel memory" }, 0)
              .fromTo(storyCue, { y: 14, autoAlpha: 0, filter: "blur(7px)" }, {
                y: 0,
                autoAlpha: 1,
                filter: "blur(0px)",
                duration: 0.32,
                ease: "power3.out",
              }, 0.04)
              .to(storyCue, { y: -8, autoAlpha: 0, filter: "blur(4px)", duration: 0.28, ease: "power2.in" }, 0.88);
          }

          if (warmWipe) {
            sceneTimeline.fromTo(warmWipe, { xPercent: -120, autoAlpha: 0 }, {
              xPercent: 180,
              autoAlpha: 0.78,
              duration: 0.82,
              ease: "power2.inOut",
            }, 0.08);
          }

          if (cloudVeil && clampedIndex === 1) {
            sceneTimeline.fromTo(cloudVeil, { xPercent: 42, autoAlpha: 0 }, {
              xPercent: -28,
              autoAlpha: 0.86,
              duration: 1.08,
              ease: "sine.inOut",
            }, 0.18).to(cloudVeil, { autoAlpha: 0, duration: 0.34, ease: "power2.out" }, 1.02);
          }

          if (bokeh && (clampedIndex === 1 || clampedIndex === 9)) {
            sceneTimeline.fromTo(bokeh, { scale: 0.96, autoAlpha: 0 }, {
              scale: 1.05,
              autoAlpha: clampedIndex === 9 ? 0.86 : 0.62,
              duration: 0.7,
              ease: "power2.out",
            }, 0.58).to(bokeh, { autoAlpha: 0.14, duration: 0.7, ease: "sine.out" }, 1.1);
          }

          if (mist && (clampedIndex === 2 || clampedIndex === 5 || clampedIndex === 6 || clampedIndex === 7 || clampedIndex === 8)) {
            sceneTimeline.fromTo(mist, { xPercent: 10, yPercent: 8, autoAlpha: 0 }, {
              xPercent: -8,
              yPercent: 0,
              autoAlpha: isFujiMood ? 0.5 : 0.34,
              duration: isFujiMood ? 1.28 : 0.9,
              ease: "sine.inOut",
            }, 0.38).to(mist, { autoAlpha: 0.08, duration: 0.7, ease: "sine.out" }, 1.18);
          }

          if (neonSheen && clampedIndex === 4) {
            sceneTimeline.fromTo(neonSheen, { xPercent: -18, autoAlpha: 0 }, {
              xPercent: 14,
              autoAlpha: 0.64,
              duration: 0.72,
              ease: "power2.out",
            }, 0.52).to(neonSheen, { autoAlpha: 0.18, duration: 0.62, ease: "sine.out" }, 1.08);
          }

          if (lightRays && (clampedIndex === 5 || clampedIndex === 9)) {
            sceneTimeline.fromTo(lightRays, { scale: 0.98, autoAlpha: 0 }, {
              scale: 1.04,
              autoAlpha: clampedIndex === 9 ? 0.72 : 0.38,
              duration: isFujiMood ? 1.25 : 0.72,
              ease: "sine.out",
            }, 0.62).to(lightRays, { autoAlpha: clampedIndex === 9 ? 0.4 : 0.1, duration: 0.85 }, 1.2);
          }

          sceneTimeline
            .to(textNodes, { y: -18, autoAlpha: 0, filter: "blur(5px)", duration: 0.22, stagger: 0.035 }, 0)
            .to(currentImage, { scale: 1.08, autoAlpha: 0, filter: "blur(3px)", duration: 0.58 }, 0.04);

          if (routePoint && routePlane) {
            sceneTimeline
              .to(routePlane, { scale: 1.32, duration: 0.16, ease: "power2.out", yoyo: true, repeat: 1 }, 0.02)
              .to(routePlane, {
              left: `${routePoint.leftPercent}%`,
              top: `${routePoint.topPercent}%`,
              xPercent: -50,
              yPercent: -50,
              rotate: routePoint.angle,
              scale: 1,
              duration: isFujiMood ? 1.08 : 0.78,
              ease: "power3.inOut",
            }, 0.1);
          }

          if (routePath && routePoint && routeTotalLength) {
            sceneTimeline.to(routePath, {
              strokeDashoffset: routeTotalLength - routePoint.length,
              duration: isFujiMood ? 1.08 : 0.78,
              ease: "power3.inOut",
            }, 0.1);
          }

          if (bottomProgress) {
            sceneTimeline.to(bottomProgress, {
              scaleX: sceneCount > 1 ? clampedIndex / (sceneCount - 1) : 0,
              duration: isFujiMood ? 1.08 : 0.78,
              ease: "power3.inOut",
            }, 0.1);
          }

          sceneTimeline
            .add(() => {
              currentSceneIndex = clampedIndex;
              setText(clampedIndex);
              setRouteUi(clampedIndex);
              gsap.set(nextImage, { autoAlpha: 1, scale: nextStartScale, filter: "blur(2px)", xPercent: 0 });
            }, isFujiMood ? 0.96 : 0.78)
            .to(nextImage, { scale: nextSettleScale, filter: "blur(0px)", xPercent: 0, duration: isFujiMood ? 1.15 : 0.9, ease: "power2.out" }, isFujiMood ? 0.98 : 0.8);

          sceneTimeline.fromTo(textNodes, { y: 26, autoAlpha: 0, filter: "blur(5px)" }, {
            y: 0,
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: isFujiMood ? 0.72 : 0.5,
            stagger: 0.05,
            ease: "power4.out",
          }, isFujiMood ? 1.28 : 1);
        };

        setScene(0);
        const routeHydrationTimer = window.setTimeout(() => setScene(currentSceneIndex), 300);

        ScrollTrigger.create({
          trigger: journey,
          start: "top top",
          end: () => `+=${window.innerHeight * sceneCount}`,
          pin,
          pinSpacing: true,
          scrub: false,
          snap: false as unknown as undefined,
          onEnter: () => setScene(0),
          onEnterBack: () => setScene(sceneCount - 1),
          onUpdate: (self) => {
            if (isAnimating) return;
            const progressIndex = Math.round(self.progress * (sceneCount - 1));
            goToScene(progressIndex);
          },
        });

        const onResize = () => setPlaneAtStop(currentSceneIndex);

        window.addEventListener("resize", onResize);
      wheelCleanups.push(() => {
        window.removeEventListener("pointerdown", playHeroVideo);
        window.removeEventListener("scroll", playHeroVideo);
        window.clearTimeout(routeHydrationTimer);
        sceneTimeline?.kill();
          window.removeEventListener("resize", onResize);
        });
      }

      const gallery = document.querySelector<HTMLElement>(".destination-gallery");
      const track = document.querySelector<HTMLElement>(".destination-track");
      if (gallery && track && window.matchMedia("(min-width: 768px)").matches) {
        const distance = () => Math.max(0, track.scrollWidth - gallery.clientWidth);
        if (distance() > 24) {
          gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: { trigger: gallery, start: "top top", end: () => `+=${distance()}`, scrub: true, pin: true, invalidateOnRefresh: true },
          });
        }
      }

      gsap.utils.toArray<HTMLElement>(".tilt-card").forEach((card) => {
        const onMove = (event: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          gsap.to(card, { rotateY: x * 7, rotateX: -y * 6, y: -4, duration: 0.35, transformPerspective: 900, ease: "power2.out" });
        };
        const onLeave = () => gsap.to(card, { rotateY: 0, rotateX: 0, y: 0, duration: 0.45, ease: "power2.out" });
        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
      });

      gsap.utils.toArray<HTMLElement>(".magnetic-cta").forEach((button) => {
        const onMove = (event: MouseEvent) => {
          const rect = button.getBoundingClientRect();
          gsap.to(button, { x: (event.clientX - rect.left - rect.width / 2) * 0.18, y: (event.clientY - rect.top - rect.height / 2) * 0.22, duration: 0.28, ease: "power2.out" });
        };
        const onLeave = () => gsap.to(button, { x: 0, y: 0, duration: 0.4, ease: "elastic.out(1, 0.35)" });
        button.addEventListener("mousemove", onMove);
        button.addEventListener("mouseleave", onLeave);
      });

      gsap.from(".final-cta", {
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".final-cta", start: "top 82%" },
      });
    });

    return () => {
      window.removeEventListener("pointerdown", playHeroVideo);
      window.removeEventListener("scroll", playHeroVideo);
      heroVideo?.removeEventListener("loadedmetadata", onHeroVideoMetadata);
      heroVideo?.removeEventListener("ended", onHeroVideoEnded);
      wheelCleanups.forEach((cleanup) => cleanup());
      context.revert();
    };
  }, []);

  return null;
}

