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

  // Cada palavra vira um bloco inline-block contendo suas letras — assim o
  // navegador só pode quebrar linha ENTRE palavras, nunca no meio de uma,
  // já que cada letra sendo seu próprio span (para animar) apaga a noção
  // nativa de "palavra" que o motor de quebra de linha usaria.
  const words = children.split(" ");
  let index = 0;
  const content = words.map((word, wi) => {
    const letters = [...word].map((char) => {
      const key = index++;
      return (
        <span key={key} className="char" style={{ display: "inline-block", opacity: 0 }}>
          {char}
        </span>
      );
    });
    return (
      <span key={`w${wi}`} style={{ display: "inline-block" }}>
        {letters}
        {wi < words.length - 1 && (
          <span key={`s${wi}`} className="char" style={{ display: "inline-block", width: "0.25em", opacity: 0 }}>&nbsp;</span>
        )}
      </span>
    );
  });

  return (
    // @ts-ignore
    <Tag ref={ref} className={className} style={style}>
      {content}
    </Tag>
  );
}
