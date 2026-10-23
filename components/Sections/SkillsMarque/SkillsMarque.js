"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import css from "./SkillsMarque.module.css";

gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);

const SKILLS = [
    "chatgpt", "claude", "figma", "framer", "grok", "gsap",
    "huggingface", "mongodb", "nextjs", "obsidian", "openai", "react", "typescript",
];

const LOOP = 26;
const FADE = 120;
const GAP = 0;

export default function SkillsMarque() {
    const rootRef = useRef(null);
    const bgImgRef = useRef(null);
    const [showClouds, setShowClouds] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const root = rootRef.current;
            const bg = bgImgRef.current;
            const marquee = root.querySelector(`.${css.marquee}`);
            const track = root.querySelector(`.${css.track}`);
            const path = root.querySelector(`.${css.orbitPath}`);
            const orbitIcons = gsap.utils.toArray(`.${css.orbitItem}`);
            const trackIcons = gsap.utils.toArray(`.${css.trackItem}`);
            if (!bg || !marquee || !track || !path || !orbitIcons.length) return;

            const n = orbitIcons.length;
            const step = 1 / (n + GAP);
            const slotOf = (i) => i * step;
            const enterAt = new Array(n).fill(null);
            let looping = false;
            let loopTweens = [];

            gsap.set(orbitIcons, { autoAlpha: 0, scale: 0.7 });
            gsap.set(bg, { "--bg-left": "50%", "--bg-shift": "-50%" });

            const stopLoop = () => {
                if (!looping) return;
                looping = false;
                loopTweens.forEach((tween) => tween.kill());
                loopTweens = [];
                gsap.to(marquee, { autoAlpha: 1, duration: 0.3 });
            };

            const startLoop = () => {
                if (looping) return;
                looping = true;
                gsap.to(marquee, { autoAlpha: 0, duration: 0.45, ease: "power2.out" });

                orbitIcons.forEach((item, i) => {
                    const base = slotOf(i);
                    gsap.set(item, { autoAlpha: 1, scale: 1 });
                    loopTweens.push(
                        gsap.to(item, {
                            motionPath: {
                                path,
                                align: path,
                                alignOrigin: [0.5, 0.5],
                                start: base,
                                end: base + 1,
                            },
                            duration: LOOP,
                            ease: "none",
                            repeat: -1,
                        })
                    );
                });
            };

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: root,
                    start: "top top",
                    end: "+=240%",
                    pin: true,
                    scrub: 0.45,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    onUpdate(self) {
                        if (looping) return;

                        const p = self.progress;
                        const line = marquee.getBoundingClientRect().right;

                        trackIcons.forEach((icon, i) => {
                            const left = icon.getBoundingClientRect().left;
                            const gone = left >= line;

                            if (!gone) {
                                enterAt[i] = null;
                                const t = gsap.utils.clamp(0, 1, (line - left) / FADE);
                                gsap.set(icon, {
                                    autoAlpha: t,
                                    scale: 0.72 + t * 0.28,
                                });
                                gsap.set(orbitIcons[i], { autoAlpha: 0, scale: 0.7 });
                                return;
                            }

                            if (enterAt[i] == null) enterAt[i] = p;
                            const arrive = gsap.utils.clamp(0, 1, (p - enterAt[i]) * 10);

                            gsap.set(icon, { autoAlpha: 0, scale: 0.72 });
                            gsap.set(orbitIcons[i], {
                                autoAlpha: 1,
                                scale: 0.78 + arrive * 0.22,
                                motionPath: {
                                    path,
                                    align: path,
                                    alignOrigin: [0.5, 0.5],
                                    start: slotOf(i),
                                    end: slotOf(i),
                                },
                            });
                        });
                    },
                    onLeave: startLoop,
                    onEnterBack: stopLoop,
                },
            });

            tl.fromTo(track, {
                x: () => -track.scrollWidth,
            }, {
                x: () => marquee.offsetWidth,
                ease: "none",
            }, 0);

            tl.fromTo(bg, {
                "--bg-left": "50%",
                "--bg-shift": "-50%",
            }, {
                "--bg-left": "0%",
                "--bg-shift": "0%",
                ease: "none",
            }, 0);
        }, rootRef);

        return () => ctx.revert();
    }, []);



    return (
        <div ref={rootRef} className={css.skillsContainer}>
            <Image
                ref={bgImgRef}
                src="/img/skills/bg2crops.png"
                alt=""
                fill
                sizes="100vw"
                className={css.marqueeBG}
            />

            <div className={css.marquee}>
                <div className={css.track}>
                    {SKILLS.map((skill) => (
                        <div key={skill} className={css.trackItem}>
                            <Image
                                src={`/img/skills/${skill}.svg`}
                                alt={skill}
                                width={64}
                                height={64}
                                className={css.img}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className={css.orbit}>
                <svg className={css.orbitSvg} viewBox="0 0 400 400">
                    <circle className={css.orbitRing} cx="200" cy="200" r="150" fill="none" />
                    <circle className={css.orbitRingDots} cx="200" cy="200" r="150" fill="none" />
                    <path
                        className={css.orbitPath}
                        d="M50 200 A150 150 0 1 1 350 200 A150 150 0 1 1 50 200"
                        fill="none"
                    />
                </svg>
                {SKILLS.map((skill) => (
                    <div key={skill} className={css.orbitItem}>
                        <Image
                            src={`/img/skills/${skill}.svg`}
                            alt={skill}
                            width={64}
                            height={64}
                            className={css.img}
                        />
                    </div>
                ))}

            </div>
        </div>
    );
}
