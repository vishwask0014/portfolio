"use client";

import dynamic from "next/dynamic";
import css from "./HeroSection.module.css";

const HeroModel = dynamic(() => import("./HeroModel"), { ssr: false });


export default function HeroSection() {
  return (
    <section className={css.hero}>
     
      <h1 className={css.headline}>
        Hi, I&apos;m <span className={css.name}>Vishwas</span>
      </h1>

      <HeroModel />

      <div className={css.sideRow}>
        <p className={css.copy}>
          One domain. One vision. Multiple AI agents. I build the system—
          eliminating noise, automating complexity, and turning ideas into
          execution.
        </p>

        <a href="#contact" className={css.cta}>
          Contact me
        </a>
      </div>
    </section>
  );
}
