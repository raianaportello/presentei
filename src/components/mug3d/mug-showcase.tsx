"use client";
/**
 * Non-interactive turntable used in the hero and product cards.
 *
 * The WebGL bundle is code-split and only fetched once the element
 * scrolls into view, so it never blocks first paint.
 */
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const MugViewer = dynamic(
  () => import("./mug-viewer").then((m) => m.MugViewer),
  { ssr: false, loading: () => <MugPlaceholder /> }
);

function MugPlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div
        aria-hidden
        className="h-2/3 w-[38%] rounded-b-[18%] rounded-t-lg bg-white/25"
        style={{ animation: "pulseOrange 2s ease-in-out infinite" }}
      />
    </div>
  );
}

export function MugShowcase({
  className = "",
  artImageUrl,
}: {
  className?: string;
  artImageUrl?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced-motion by still rendering, just without the spin.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {visible ? (
        <MugViewer showcase artImageUrl={artImageUrl} className="h-full w-full" />
      ) : (
        <MugPlaceholder />
      )}
    </div>
  );
}
