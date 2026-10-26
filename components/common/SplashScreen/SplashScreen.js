"use client";

import { useEffect, useState } from "react";
import css from "./SplashScreen.module.css";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      setLeaving(true);
      window.setTimeout(() => setVisible(false), 450);
    };

    const waitForReady = async () => {
      const assetPromise = new Promise((resolve) => {
        if (document.readyState === "complete") {
          resolve();
          return;
        }
        window.addEventListener("load", () => resolve(), { once: true });
      });

      const fontPromise =
        document.fonts?.ready?.catch?.(() => undefined) ?? Promise.resolve();

      await Promise.all([assetPromise, fontPromise]);

      // Brief beat so the loader is readable on fast connections
      window.setTimeout(finish, 280);
    };

    waitForReady();

    // Safety fallback if something never settles
    const safety = window.setTimeout(finish, 8000);
    return () => window.clearTimeout(safety);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`${css.splash} ${leaving ? css.leaving : ""}`}
      aria-busy="true"
      aria-live="polite"
    >
      <div className={css.inner}>
        <span className={css.spinner} aria-hidden="true" />
        <p className={css.label}>Loading</p>
      </div>
    </div>
  );
}
