"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import css from "./WorldFullOfColor.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function WorldFullOfColor() {
    const sectionRef = useRef(null);
    const bigTextRef = useRef(null);
    const bigTextContainerRef = useRef(null);
    const darkBgRef = useRef(null);
    const mainTextRef = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;
        const bigText = bigTextRef.current;
        const bigTextContainer = bigTextContainerRef.current;
        const darkBg = darkBgRef.current;
        const mainText = mainTextRef.current;
        if (!section || !bigText || !bigTextContainer || !darkBg || !mainText) return;

        const ctx = gsap.context(() => {
            const fill = { p: 0 };

            const applyFill = () => {
                const oLetter = bigText.querySelector("[data-o]");
                if (!oLetter) return;

                const sectionBox = section.getBoundingClientRect();
                const oBox = oLetter.getBoundingClientRect();
                const x = oBox.left + oBox.width / 2 - sectionBox.left;
                const y = oBox.top + oBox.height / 2 - sectionBox.top;
                const radius =
                    Math.hypot(
                        Math.max(x, sectionBox.width - x),
                        Math.max(y, sectionBox.height - y)
                    ) * 1.2;

                darkBg.style.backgroundColor = getComputedStyle(oLetter).color;
                darkBg.style.clipPath = `circle(${fill.p * radius}px at ${x}px ${y}px)`;
            };

            gsap.set(darkBg, { clipPath: "circle(0px at 50% 50%)" });
            gsap.set(mainText, { opacity: 0 });
            applyFill();

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: "+=160%",
                    scrub: true,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    onUpdate: applyFill,
                    onRefresh: applyFill,
                },
            });

            tl.fromTo(
                bigText,
                { fontSize: 80 },
                {
                    fontSize: () => {
                        const width = bigText.parentElement?.clientWidth || window.innerWidth;
                        return Math.min(width * 0.42, window.innerHeight * 0.55);
                    },
                    ease: "none",
                    duration: 3,
                }
            );

            tl.to(
                fill,
                {
                    p: 1,
                    duration: 1,
                    ease: "none",
                    onUpdate: applyFill,
                },
                "fill"
            );

            tl.to(
                bigTextContainer,
                {
                    opacity: 0,
                    duration: 0.35,
                    ease: "none",
                },
                "fill+=0.2"
            );

            tl.to(
                mainText,
                {
                    opacity: 1,
                    duration: 0.4,
                    ease: "none",
                },
                "fill+=0.55"
            );
        }, section);

        return () => ctx.revert();
    }, []);

    return (
        <div className={css.sectionContainer} ref={sectionRef} data-color-section>
            <div ref={bigTextContainerRef} className={css.BigTextContainer}>
                <span className={css.supportHeading}>World Full Of</span>
                <h1 ref={bigTextRef} className={css.bigText}>
                    {"Color".split("").map((letter, index) => (
                        <span
                            key={`${letter}-${index}`}
                            data-o={index === 1 ? "true" : undefined}
                            className={css.letter}
                        >
                            {letter}
                        </span>
                    ))}
                </h1>
            </div>

            <div ref={darkBgRef} className={css.darkBG} />

            <div ref={mainTextRef} className={css.mainTextContainer}>
                {/* <LiveProjects /> */}
            </div>
        </div>
    );
}
