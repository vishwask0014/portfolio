"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import css from "./HeroSection.module.css";

const SERVICES = [
  "UI UX",
  "Prototype",
  "Wireframe",
  // "Strategies",
  // "Content",
  "UI Integration",
  "SEO",
  "AEO",
  "GEO",
  "Performance Optimization",
  "Creatives",
  "Social Media",
  "Posts",
  "Reels",
  // "Video",
];

/** Center → edges: bold orange into warm red */
const GRADIENT = ["#FFAC1C", "#FF8F1F", "#FF6B2E", "#F03A2E", "#D42020"];

const colorTween = {
  type: "tween",
  duration: 0.22,
  ease: "easeOut",
};

function Letters({ text, className, idleColor = "#ececec" }) {
  const [active, setActive] = useState(null);
  const chars = Array.from(text);

  const getAnim = (index) => {
    if (active === null || chars[index] === " ") {
      return { color: idleColor };
    }

    const dist = Math.abs(index - active);
    if (dist > 4) return { color: idleColor };

    return {
      color: GRADIENT[Math.min(dist, GRADIENT.length - 1)],
    };
  };

  return (
    <span
      className={`${css.letters} ${className || ""}`.trim()}
      onMouseLeave={() => setActive(null)}
    >
      {chars.map((char, index) =>
        char === " " ? (
          <span key={`space-${index}`} className={css.space}>
            {"\u00A0"}
          </span>
        ) : (
          <motion.span
            key={`${char}-${index}`}
            className={css.letter}
            animate={getAnim(index)}
            transition={colorTween}
            onMouseEnter={() => setActive(index)}
          >
            {char}
          </motion.span>
        )
      )}
    </span>
  );
}

export default function HeroSection() {
  return (
    <section className={css.hero} aria-label="Introduction">
      <div className={css.bg} aria-hidden="true">
        <Image
          src="/img/hero/neon-portrait.jpg"
          alt=""
          fill
          priority
          sizes="(max-width: 900px) 100vw, 60vw"
          className={css.bgImage}
        />
        <div className={css.bgFade} />
      </div>

      <div className={css.content}>
        <h5 className={css.intro}>
          <Letters text="Hi, I'm Vishwas." idleColor="rgba(236, 236, 236, 0.78)" />
        </h5>

        <h1 className={css.headline}>
          <span className={css.line}>
            <Letters text="I design, grow, and" />
          </span>
          <span className={css.line}>
            <Letters text="get brands seen." />
          </span>
        </h1>

        <ul className={css.services} aria-label="Services">
          {SERVICES.map((service) => (
            <li key={service} className={css.serviceItem}>
              {service}
            </li>
          ))}
        </ul>

        <a href="#contact" className={css.connect}>
          Connect
        </a>
      </div>

      <div className={css.scrollHint}>
        <span className={css.scrollMouse} aria-hidden="true" />
        <p className={css.scrollLabel}>Scroll Down</p>
      </div>
    </section>
  );
}
