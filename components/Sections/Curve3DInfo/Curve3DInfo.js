"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import css from "./Curve3DInfo.module.css";

gsap.registerPlugin(ScrollTrigger);

// Static data — add/remove/edit entries here to customize the sequence.
const LINES = [
  { text: "text 1", accent: false },
  { text: "text 2", accent: true },
  { text: "text 3", accent: false },
  { text: "text 4", accent: true },
  { text: "text 5", accent: false },
  { text: "text 6", accent: true },
];

export default function Curve3DInfo() {
  const stageRef = useRef(null);
  const textRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const stage = stageRef.current;
      const texts = textRefs.current.filter(Boolean);
      if (!stage || texts.length === 0) return;

      // Starting state for every line: small, low, faded, tilted back.
      texts.forEach((el) => {
        gsap.set(el, {
          scale: 0.25,
          y: 120,
          opacity: 0,
          rotateX: 25,
          filter: "blur(6px)",
          transformOrigin: "center center",
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          // one "screen" of scroll distance per line
          end: () => "+=" + window.innerHeight * texts.length,
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      });

      // Give each line its own slot on the timeline: [i, i+1).
      // First half of the slot = zoom in to center, second half = zoom out.
      texts.forEach((el, i) => {
        tl.to(
          el,
          {
            scale: 1,
            y: 0,
            opacity: 1,
            rotateX: 0,
            filter: "blur(0px)",
            ease: "none",
            duration: 0.5,
          },
          i
        ).to(
          el,
          {
            scale: 0.25,
            y: -120,
            opacity: 0,
            rotateX: -25,
            filter: "blur(6px)",
            ease: "none",
            duration: 0.5,
          },
          i + 0.5
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className={css.stage} ref={stageRef}>
      {LINES.map((line, i) => (
        <p
          key={line.text}
          ref={(el) => {
            textRefs.current[i] = el;
          }}
          className={`${css.textOrbit} ${line.accent ? css.accent : ""}`}
        >
          {line.text}
        </p>
      ))}
    </div>
  );
}