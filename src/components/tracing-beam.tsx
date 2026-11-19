"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { cn } from "../utils/cn";

// Tracing beam beside a doc page's content (desktop only; src/css/custom.scss hides it on phones).
// A straight line runs from under the dot to the end of the content area, and a lit segment travels down it
// with the scroll: lit at the top when the page opens, at the end of the content when you reach the end
// of the content. A page with nothing to scroll shows the whole line lit.
// The line's length and the scroll distance follow the content as it grows (images, tabs, accordions).
const LIT_LENGTH = 240; // px of line lit at once

export const TracingBeam = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [lineHeight, setLineHeight] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  // Line length, and the scroll position at which the content's end reaches the bottom of the window.
  const length = useMotionValue(0);
  const endScroll = useMotionValue(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    const svg = svgRef.current;
    if (!wrapper || !content || !svg) {
      return undefined;
    }
    // The line ends at the bottom of the beam's box: the content's end on a long page; on a short page
    // the box grows to the bottom of the content area (src/css/custom.scss), and so does the line.
    const measure = () => {
      const bottom = wrapper.getBoundingClientRect().bottom;
      const lineTop = svg.getBoundingClientRect().top;
      const h = Math.max(0, Math.round(bottom - lineTop));
      setLineHeight(h);
      length.set(h);
      endScroll.set(bottom + window.scrollY - window.innerHeight);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(wrapper);
    observer.observe(content);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [length, endScroll]);

  useEffect(() => scrollY.onChange((y) => setScrolled(y > 0)), [scrollY]);

  // Head (leading, bright end) and tail of the lit segment, in line coordinates.
  const head = useTransform([scrollY, length, endScroll], ([y, h, end]: number[]) => {
    if (end <= 0) {
      return h; // nothing to scroll: all lit
    }
    const lit = Math.min(LIT_LENGTH, h);
    const progress = Math.min(1, Math.max(0, y / end));
    return lit + (h - lit) * progress;
  });
  const tail = useTransform([head, length, endScroll], ([top, h, end]: number[]) =>
    end <= 0 ? 0 : Math.max(0, top - Math.min(LIT_LENGTH, h))
  );
  const y1 = useSpring(head, { stiffness: 500, damping: 90 });
  const y2 = useSpring(tail, { stiffness: 500, damping: 90 });

  return (
    <motion.div ref={wrapperRef} className={cn("relative w-full max-w-4xl mx-auto h-full pl-10", className)}>
      <div className="absolute -left-10 mr-4 top-3">
        <motion.div
          transition={{ duration: 0.2, delay: 0.5 }}
          animate={{ boxShadow: scrolled ? "none" : "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
          className="ml-[27px] h-4 w-4 rounded-full border border-netural-200 shadow-sm flex items-center justify-center"
        >
          <motion.div
            transition={{ duration: 0.2, delay: 0.5 }}
            animate={{
              backgroundColor: scrolled ? "white" : "var(--emerald-500)",
              borderColor: scrolled ? "white" : "var(--emerald-600)",
            }}
            className="h-2 w-2 rounded-full border border-neutral-300 bg-white"
          />
        </motion.div>
        <svg
          ref={svgRef}
          viewBox={`0 0 20 ${lineHeight}`}
          width="20"
          height={lineHeight}
          className="ml-4 hidden lg:block tracing-beam"
          aria-hidden="true"
        >
          {/* x = 19: through the dot's centre */}
          <path d={`M 19 0 V ${lineHeight}`} fill="none" stroke="#9091A0" strokeOpacity="0.16" />
          <path
            d={`M 19 0 V ${lineHeight}`}
            fill="none"
            stroke="url(#tracing-beam-gradient)"
            strokeWidth="1.25"
            className="motion-reduce:hidden"
          />
          <defs>
            <motion.linearGradient
              id="tracing-beam-gradient"
              gradientUnits="userSpaceOnUse"
              x1="0"
              x2="0"
              y1={y1} // head: bright
              y2={y2} // tail: fades out
            >
              <stop stopColor="#18CCFC" stopOpacity="0"></stop>
              <stop stopColor="#18CCFC"></stop>
              <stop offset="0.325" stopColor="#6344F5"></stop>
              <stop offset="1" stopColor="#AE48FF" stopOpacity="0"></stop>
            </motion.linearGradient>
          </defs>
        </svg>
      </div>
      <div ref={contentRef}>{children}</div>
    </motion.div>
  );
};

export default TracingBeam;
