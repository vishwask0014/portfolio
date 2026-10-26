"use client";

import css from "./HeroSection.module.css";

function Letters({ text, className }) {
  return (
    <span className={className}>
      {Array.from(text).map((char, index) =>
        char === " " ? (
          <span key={`space-${index}`} className={css.space}>
            {"\u00A0"}
          </span>
        ) : (
          <span key={`${char}-${index}`} className={css.letter}>
            {char}
          </span>
        )
      )}
    </span>
  );
}

export default function HeroSection() {
  return (
    <section className={css.hero} aria-label="Introduction">
      <a href="#contact" className={css.topCta}>
        Get in touch
      </a>

      <div className={css.content}>
        <p className={css.badge}>Frontend systems with product taste</p>

        <h1 className={css.headline}>
          <span className={css.line}>
            <Letters text="Hi, I'm" />
            <span className={css.chipAvatar} aria-hidden="true">
              V
            </span>
            <Letters text="Vishwas." />
          </span>
          <span className={css.line}>
            <Letters text="I build" />
            <span className={css.chipDot} aria-hidden="true" />
            <Letters text="systems" />
          </span>
          <span className={css.line}>
            <Letters text="that help" />
            <Letters text="products" className={css.underline} />
            <span className={css.chipThumb} aria-hidden="true" />
            <Letters text="grow." />
          </span>
        </h1>

        <a href="#contact" className={css.connect}>
          Connect
        </a>
      </div>

      <div className={css.scrollHint}>
        <span className={css.scrollMouse} aria-hidden="true" />
        <p className={css.scrollLabel}>Scroll to enter selected work</p>
      </div>
    </section>
  );
}
