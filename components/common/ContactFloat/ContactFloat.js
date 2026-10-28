"use client";

import { useEffect, useRef, useState } from "react";
import { Briefcase, Camera, MessageCircle } from "lucide-react";
import classNames from "classnames";
import css from "./ContactFloat.module.css";

const CONTACT = {
  name: "Vishwas Kamal",
  handle: "vishwas.kamal2000@gmail.com",
  email: "vishwas.kamal2000@gmail.com",
  initials: "VK",
  phone: "9501442583",
  instagram: "https://www.instagram.com/vishwashkamal14/",
  linkedin: "https://www.linkedin.com/in/vishwash-kamal-a080641a7/",
};

const LINKS = [
  {
    label: "WhatsApp",
    href: `https://wa.me/91${CONTACT.phone}`,
    Icon: MessageCircle,
  },
  {
    label: "Instagram",
    href: CONTACT.instagram,
    Icon: Camera,
  },
  {
    label: "LinkedIn",
    href: CONTACT.linkedin,
    Icon: Briefcase,
  },
];

const IDLE_MS = 900;

export default function ContactFloat() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const rootRef = useRef(null);
  const idleTimer = useRef(null);

  const mailto = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
    "Hello Vishwas"
  )}`;

  useEffect(() => {
    const onScroll = () => {
      setExpanded(true);
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
      idleTimer.current = window.setTimeout(() => {
        setExpanded(false);
      }, IDLE_MS);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={css.root}>
      {open ? (
        <div className={css.menu} role="menu" aria-label="More connections">
          {LINKS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              className={css.menuItem}
              role="menuitem"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
            >
              <Icon className={css.menuIcon} aria-hidden="true" />
              <span>{label}</span>
            </a>
          ))}
        </div>
      ) : null}

      <div className={classNames(css.card, expanded && css.cardExpanded)}>
        <a
          href={mailto}
          className={css.emailLink}
          aria-label={`Email ${CONTACT.name}`}
          title="Send me an email"
        >
          <span className={css.avatar} aria-hidden="true">
            {CONTACT.initials}
          </span>
          <span className={css.meta} aria-hidden={!expanded}>
            <span className={css.metaInner}>
              <span className={css.name}>{CONTACT.name}</span>
              <span className={css.handle}>{CONTACT.handle}</span>
            </span>
          </span>
        </a>

        <button
          type="button"
          className={classNames(css.moreBtn, open && css.moreBtnOpen)}
          aria-label="More connection options"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span className={css.dot} />
          <span className={css.dot} />
          <span className={css.dot} />
        </button>
      </div>
    </div>
  );
}
