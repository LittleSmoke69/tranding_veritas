import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: string;
  className?: string;
  style?: React.CSSProperties;
  stagger?: number;
  start?: string;
  end?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

export default function ScrollRevealText({
  children,
  className = "",
  style,
  stagger = 0.03,
  start = "top 70%",
  end = "bottom 40%",
  as: Tag = "span",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const spans = el.querySelectorAll<HTMLSpanElement>(".char");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        spans,
        { opacity: 0 },
        {
          opacity: 1,
          ease: "none",
          stagger,
          scrollTrigger: {
            trigger: el,
            start,
            end,
            scrub: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [children, stagger, start, end]);

  const chars = [...children].map((char, i) =>
    char === " " ? (
      <span key={i} className="char" style={{ display: "inline-block", width: "0.25em", opacity: 0 }}>&nbsp;</span>
    ) : (
      <span key={i} className="char" style={{ display: "inline-block", opacity: 0 }}>
        {char}
      </span>
    )
  );

  return (
    // @ts-ignore
    <Tag ref={ref} className={className} style={style}>
      {chars}
    </Tag>
  );
}
