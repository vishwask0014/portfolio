"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import classNames from "classnames";
import css from "./Topbar.module.css";

const CLIP_SKEW = "polygon(0 0, 100% 0, 90% 100%, 0 100%)";
const CLIP_VERTICAL = "polygon(0 0, 100% 0, 100% 100%, 0 100%)";

const MENU_ITEMS = [
  { label: "Home", href: "#" },
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export function Topbar() {
  const navRef = useRef(null);
  const backdropRef = useRef(null);
  const bar1Ref = useRef(null);
  const bar2Ref = useRef(null);
  const bar3Ref = useRef(null);
  const menuItemsRef = useRef([]);
  const [isOpen, setIsOpen] = useState(false);

  const getWidth = useCallback(() => {
    if (typeof window === "undefined") return "100%";
    if (window.innerWidth > 768) return 480;
    if (window.innerWidth > 580) return "50%";
    return "100%";
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    gsap.set(nav, { width: getWidth(), x: "-100%", clipPath: CLIP_SKEW });

    const onResize = () => {
      if (!isOpen) {
        gsap.set(nav, { width: getWidth() });
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [getWidth, isOpen]);

  const animateBars = (open) => {
    const tl = gsap.timeline();

    if (open) {
      tl.to(bar1Ref.current, { rotation: 45, y: 4, width: 28, duration: 0.3, ease: "power2.out" }, 0);
      tl.to(bar2Ref.current, { opacity: 0, duration: 0.15 }, 0);
      tl.to(bar3Ref.current, { rotation: -45, y: -4, width: 28, left: 0, duration: 0.3, ease: "power2.out" }, 0);
    } else {
      tl.to(bar1Ref.current, { rotation: 0, y: 0, width: 16, duration: 0.3, ease: "power2.in" }, 0);
      tl.to(bar2Ref.current, { opacity: 1, duration: 0.15 }, 0.1);
      tl.to(bar3Ref.current, { rotation: 0, y: 0, width: 16, left: 16, duration: 0.3, ease: "power2.in" }, 0);
    }

    return tl;
  };

  const animateMenuItems = (open) => {
    const items = menuItemsRef.current.filter(Boolean);

    if (open) {
      gsap.set(items, { opacity: 0, x: -40 });
      gsap.to(items, {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.3,
        ease: "power2.out",
      });
    } else {
      gsap.to(items, {
        opacity: 0,
        x: -40,
        duration: 0.2,
        stagger: 0.05,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(items, { opacity: 0, x: -40 });
        },
      });
    }
  };

  const handleClick = () => {
    const nav = navRef.current;
    const backdrop = backdropRef.current;
    if (!nav || !backdrop) return;

    if (!isOpen) {
      animateBars(true);
      animateMenuItems(true);
      gsap.to(backdrop, { opacity: 1, duration: 0.4, ease: "power2.out", onStart: () => { backdrop.style.pointerEvents = "auto"; } });
      gsap.to(nav, {
        x: "0%",
        width: getWidth(),
        clipPath: CLIP_VERTICAL,
        duration: 0.7,
        ease: "power3.out",
      });
    } else {
      animateBars(false);
      animateMenuItems(false);
      gsap.to(backdrop, { opacity: 0, duration: 0.3, ease: "power2.in", onComplete: () => { backdrop.style.pointerEvents = "none"; } });
      gsap.to(nav, {
        x: "-100%",
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(nav, { width: getWidth(), clipPath: CLIP_SKEW });
        },
      });
    }

    setIsOpen(!isOpen);
  };

  return (
    <>
      <div ref={backdropRef} className={css.backdrop} onClick={isOpen ? handleClick : undefined} />
      <nav ref={navRef} className={classNames(css.nav, !isOpen && css.navCloseSmoothTransition)}>
        <section>
          <ul className={css.menuList}>
            {MENU_ITEMS.map((item, i) => (
              <li
                key={item.label}
                ref={(el) => { menuItemsRef.current[i] = el; }}
                className={css.menuItem}
              >
                <a href={item.href} className={css.menuLink}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </nav>
      <button className={css.menuButton} onClick={handleClick}>
        <div className={css.menuBars}>
          <div ref={bar1Ref} className={css.bar1} />
          <div ref={bar2Ref} className={css.bar2} />
          <div ref={bar3Ref} className={css.bar3} />
        </div>
      </button>
    </>
  );
}
