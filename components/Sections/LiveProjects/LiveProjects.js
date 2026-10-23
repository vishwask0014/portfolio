"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import classNames from "classnames";
import css from "./LiveProjects.module.css";

gsap.registerPlugin(ScrollTrigger);

/*
  Even ring around centered copy.
  x/y are % of half the stage (center = 0). Keep |x|,|y| high enough
  to leave a clear text safe-zone in the middle.
  depth: 0 = nearest (faster), 1 = farthest (slower)
*/
const PROJECTS = [
  {
    src: "/img/landingpage/image1.png",
    alt: "Singroup product landing page",
    depth: 0.72,
    x: -38,
    y: -40,
    rotate: -5,
    size: "sm",
    scale: 1.08,
  },
  {
    src: "/img/landingpage/image2.png",
    alt: "Interface exploration",
    depth: 0.4,
    x: 38,
    y: -38,
    rotate: 5,
    size: "md",
    scale: 1.12,
  },
  {
    src: "/img/landingpage/image3.png",
    alt: "TP-7 product experience",
    depth: 0.15,
    x: 42,
    y: 8,
    rotate: 4,
    size: "lg",
    scale: 1.18,
  },
  {
    src: "/img/landingpage/image4.png",
    alt: "Motion-led landing page",
    depth: 0.35,
    x: 34,
    y: 40,
    rotate: -4,
    size: "md",
    scale: 1.1,
  },
  {
    src: "/img/landingpage/image5.png",
    alt: "AI dashboard concept",
    depth: 0.58,
    x: -36,
    y: 40,
    rotate: 5,
    size: "sm",
    scale: 1.06,
  },
  {
    src: "/img/landingpage/image6.png",
    alt: "Creative studio site",
    depth: 0.28,
    x: -42,
    y: 4,
    rotate: -4,
    size: "md",
    scale: 1.14,
  },
];

export default function LiveProjects() {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const stageRef = useRef(null);
  const copyRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const stage = stageRef.current;
    const copy = copyRef.current;
    const cards = cardRefs.current.filter(Boolean);
    if (!section || !pin || !stage || !copy || !cards.length) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const endFor = (project) => {
        // Uniform mapping so depth only affects speed, not final spacing
        return {
          x: (project.x / 100) * stage.offsetWidth * 0.5,
          y: (project.y / 100) * stage.offsetHeight * 0.5,
          scale: project.scale,
        };
      };

      cards.forEach((card, i) => {
        const project = PROJECTS[i];
        const end = endFor(project);
        const startScale = 0.04 + project.depth * 0.03;

        gsap.set(card, {
          left: "50%",
          top: "50%",
          xPercent: -50,
          yPercent: -50,
          x: 0,
          y: 0,
          scale: startScale,
          rotation: 0,
          opacity: reduceMotion ? 1 : 0,
          zIndex: Math.round((1 - project.depth) * 20),
          transformOrigin: "50% 50%",
          force3D: true,
        });

        if (reduceMotion) {
          gsap.set(card, {
            x: end.x,
            y: end.y,
            scale: end.scale,
            rotation: project.rotate,
            opacity: 1,
          });
        }
      });

      if (reduceMotion) {
        gsap.set(copy, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(copy, { opacity: 0, y: 24 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * 2.4)}`,
          pin: pin,
          scrub: 0.9,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(
        copy,
        {
          opacity: 1,
          y: 0,
          duration: 0.22,
          ease: "power1.out",
        },
        0
      );

      cards.forEach((card, i) => {
        const project = PROJECTS[i];
        const depth = project.depth;
        const startScale = 0.04 + depth * 0.03;
        const duration = 0.45 + depth * 0.7;
        const startAt = 0.06 + depth * 0.06;

        tl.fromTo(
          card,
          {
            x: 0,
            y: 0,
            scale: startScale,
            rotation: 0,
            opacity: 0,
          },
          {
            x: () => endFor(project).x,
            y: () => endFor(project).y,
            scale: () => endFor(project).scale,
            rotation: project.rotate,
            opacity: 1,
            duration,
            ease: "power2.out",
          },
          startAt
        );
      });

      tl.to({}, { duration: 0.2 });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={css.section} aria-label="Live projects">
      <div ref={pinRef} className={css.pin}>
        <div className={css.glow} aria-hidden="true" />

        <div ref={stageRef} className={css.stage}>
          <div ref={copyRef} className={css.copy}>
            <p className={css.eyebrow}>Live projects</p>
            <h2 className={css.title}>
              Turning ideas into fluid, intelligent interfaces
            </h2>
            <p className={css.support}>
              React, Next.js, motion design &amp; AI — all in one stack.
            </p>
          </div>

          <ul className={css.collage} aria-label="Project previews">
            {PROJECTS.map((project, index) => (
              <li
                key={project.src}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className={classNames(css.card, css[`size_${project.size}`])}
                data-depth={project.depth}
              >
                <Image
                  src={project.src}
                  alt={project.alt}
                  width={420}
                  height={270}
                  className={css.image}
                  sizes="(max-width: 900px) 40vw, 280px"
                  priority={index < 2}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
