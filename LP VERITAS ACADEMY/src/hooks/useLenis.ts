import { useEffect } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    __veritasLenis?: Lenis;
  }
}

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    window.__veritasLenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      if (window.__veritasLenis === lenis) delete window.__veritasLenis;
    };
  }, []);
}

// Faz scroll suave até um elemento pelo id, usando o Lenis global quando
// disponível (mantém a mesma curva de easing do resto do site).
export function scrollToId(id: string, offset = -80) {
  const target = document.getElementById(id);
  if (!target) return;
  const lenis = window.__veritasLenis;
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.4 });
  } else {
    target.scrollIntoView({ behavior: "smooth" });
  }
}
