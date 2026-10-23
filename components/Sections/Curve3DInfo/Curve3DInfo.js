"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import classNames from "classnames";
import css from "./Curve3DInfo.module.css";

gsap.registerPlugin(ScrollTrigger);

const MEDIA = {
  stages:
    "/img/curveImgs/From Klickpin.com- Explore Modern self-care Sunday ideas for your next Pinterest save using practical inspiration that still feels highly aestheti (1).mp4",
  colors:
    "/img/curveImgs/From Klickpin.com- Soft Winter Outfit Ideas You Need Right Now-pin-id-15340454978536381.mp4",
  watching:
    "/img/curveImgs/From Klickpin.com- Bookmark these 33 Cozy bathroom storage solutions that are worth saving if you love elegant details and creative inspiration fo.mp4",
  nights:
    "/img/curveImgs/From Klickpin.com- Explore Modern self-care Sunday ideas for your next Pinterest save using practical inspiration that still feels highly aestheti.mp4",
  trends:
    "/img/curveImgs/From Klickpin.com- Refresh these simple ways to style your family trip to make your next project easier and prettier for a polished look that stil.mp4",
  enterprise:
    "/img/curveImgs/From Klickpin.com- Recreate this elegant summer vibes roundup youll want to recreate this weekend that balance trend comfort and everyday function.mp4",
  learning:
    "/img/curveImgs/From Klickpin.com- Recreate this elegant summer vibes roundup youll want to recreate this weekend that balance trend comfort and everyday function (1).mp4",
};

const ROWS = [
  [{ type: "text", label: "Websites", tone: "loud" }],
  [
    { type: "video", src: MEDIA.stages, size: "lg" },
    { type: "text", label: "Stages", tone: "loud" },
  ],
  [
    { type: "video", src: MEDIA.colors, size: "md" },
    { type: "text", label: "Colors", tone: "soft" },
    { type: "text", label: "Speak", tone: "soft" },
  ],
  [
    { type: "text", label: "Watching", tone: "mid" },
    { type: "video", src: MEDIA.watching, size: "md" },
  ],
  [{ type: "text", label: "Creators", tone: "loud" }],
  [
    { type: "text", label: "Nights", tone: "soft" },
    { type: "text", label: "Rebuilding", tone: "soft" },
    { type: "video", src: MEDIA.nights, size: "md" },
  ],
  [
    { type: "text", label: "Trends", tone: "mid" },
    { type: "video", src: MEDIA.trends, size: "md" },
    { type: "text", label: "Decoded", tone: "mid" },
  ],
  [
    { type: "video", src: MEDIA.enterprise, size: "md" },
    { type: "text", label: "Enterprise", tone: "loud" },
    { type: "text", label: "Solved", tone: "loud" },
  ],
  [
    { type: "text", label: "Learning", tone: "soft" },
    { type: "video", src: MEDIA.learning, size: "xl" },
  ],
  [{ type: "text", label: "Earns", tone: "mid" }],
];

function CurveMedia({ src, size }) {
  return (
    <video
      src={encodeURI(src)}
      className={classNames(css.media, css[`media_${size}`])}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}

export default function Curve3DInfo() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!section || !container) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray(container.querySelectorAll(`.${css.row}`));

      gsap.set(rows, {
        transformPerspective: 1400,
        transformOrigin: "50% 50%",
        force3D: true,
      });

      const getCurveConfig = () => {
        const mobile = window.innerWidth < 768;
        const tablet = window.innerWidth < 1024;
        return {
          maxAngle: reduceMotion ? 0 : mobile ? 24 : tablet ? 36 : 48,
          radius: Math.min(
            window.innerHeight * (mobile ? 0.72 : 0.92),
            mobile ? 520 : tablet ? 720 : 920
          ),
          scaleMin: mobile ? 0.9 : 0.82,
          opacityStart: mobile ? 0.2 : 0.32,
        };
      };

      const applyCurve = () => {
        const { maxAngle, radius, scaleMin, opacityStart } = getCurveConfig();
        const maxRad = (maxAngle * Math.PI) / 180;
        const viewCenter = window.innerHeight / 2;

        rows.forEach((row) => {
          if (reduceMotion) {
            gsap.set(row, {
              z: 0,
              rotationX: 0,
              scale: 1,
              opacity: 1,
            });
            return;
          }

          const rect = row.getBoundingClientRect();
          const yFromCenter = rect.top + rect.height / 2 - viewCenter;
          const rad = gsap.utils.clamp(
            -maxRad,
            maxRad,
            Math.asin(
              gsap.utils.clamp(-0.999, 0.999, yFromCenter / radius)
            )
          );
          const depth = (Math.cos(rad) + 1) / 2;

          gsap.set(row, {
            z: radius * (Math.cos(rad) - 1),
            rotationX: -(rad * 180) / Math.PI,
            scale: scaleMin + depth * (1 - scaleMin),
            opacity: gsap.utils.clamp(
              0,
              1,
              gsap.utils.mapRange(opacityStart, 0.96, 0, 1, depth)
            ),
          });
        });
      };

      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: applyCurve,
        onRefresh: applyCurve,
      });

      applyCurve();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={css.infoSection} aria-label="Capabilities">
      <div className={css.fadeTop} aria-hidden="true" />
      <div className={css.fadeBottom} aria-hidden="true" />

      <div ref={containerRef} className={css.contentContainer}>
        {ROWS.map((items, rowIndex) => (
          <div key={rowIndex} className={css.row}>
            {items.map((item, itemIndex) =>
              item.type === "video" ? (
                <CurveMedia
                  key={`${rowIndex}-media-${itemIndex}`}
                  src={item.src}
                  size={item.size}
                />
              ) : (
                <span
                  key={`${rowIndex}-${item.label}`}
                  className={classNames(css.text, css[`tone_${item.tone}`])}
                >
                  {item.label}
                </span>
              )
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
