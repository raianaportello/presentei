/**
 * Realistic white ceramic mug — pure SVG, no runtime JS.
 * Uses idPrefix to avoid gradient-ID conflicts when used multiple times.
 */
export function MugCeramic({
  className = "",
  idPrefix = "mc",
}: {
  className?: string;
  idPrefix?: string;
}) {
  const id = (name: string) => `${idPrefix}-${name}`;

  return (
    <svg
      viewBox="0 0 320 390"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      className={className}
      aria-hidden
    >
      <defs>
        {/* ── Body: left shadow → bright white → right shadow ── */}
        <linearGradient id={id("body")} x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%"   stopColor="#b2aaa5" />
          <stop offset="12%"  stopColor="#d8d2ce" />
          <stop offset="32%"  stopColor="#f3efec" />
          <stop offset="52%"  stopColor="#ffffff" />
          <stop offset="70%"  stopColor="#ece7e3" />
          <stop offset="100%" stopColor="#cac4c0" />
        </linearGradient>

        {/* ── Handle gradient ── */}
        <linearGradient id={id("handle")} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#d5cfcb" />
          <stop offset="48%"  stopColor="#f0ece9" />
          <stop offset="100%" stopColor="#c0bab6" />
        </linearGradient>

        {/* ── Inner mug (dark inside) ── */}
        <radialGradient id={id("inner")} cx="42%" cy="34%" r="62%">
          <stop offset="0%"   stopColor="#9e9690" />
          <stop offset="100%" stopColor="#464040" />
        </radialGradient>

        {/* ── Base ellipse ── */}
        <linearGradient id={id("base")} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#a8a29e" />
          <stop offset="50%"  stopColor="#c8c3bf" />
          <stop offset="100%" stopColor="#b5afab" />
        </linearGradient>

        {/* ── Drop shadow filter ── */}
        <filter id={id("shadow")} x="-28%" y="-18%" width="156%" height="156%">
          <feDropShadow
            dx="3"
            dy="18"
            stdDeviation="18"
            floodColor="rgba(28,10,4,0.26)"
          />
        </filter>
      </defs>

      {/* ── Ground shadow ── */}
      <ellipse cx="158" cy="378" rx="114" ry="13" fill="rgba(18,7,2,0.16)" />

      <g filter={`url(#${id("shadow")})`}>

        {/* ═══ BODY ═══ */}
        {/* Main rect between rim and base */}
        <rect x="63" y="98" width="190" height="254" fill={`url(#${id("body")})`} />

        {/* Bottom base ellipse */}
        <ellipse cx="158" cy="352" rx="95" ry="14" fill={`url(#${id("base")})`} />
        {/* Cover upper half of base ellipse so rect wins there */}
        <rect x="63" y="338" width="190" height="14" fill={`url(#${id("body")})`} />

        {/* Top cap ellipse (body color) */}
        <ellipse cx="158" cy="98" rx="95" ry="20" fill={`url(#${id("body")})`} />

        {/* ═══ HANDLE ═══ */}
        {/* Outer stroke (visible ceramic surface of handle) */}
        <path
          d="M 252 162 C 305 162, 330 192, 330 228 C 330 264, 305 294, 252 294"
          stroke={`url(#${id("handle")})`}
          strokeWidth="26"
          strokeLinecap="round"
        />
        {/* Inner concave shadow */}
        <path
          d="M 252 172 C 298 172, 316 196, 316 228 C 316 260, 298 284, 252 284"
          stroke="rgba(70,35,12,0.09)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Handle top-edge highlight */}
        <path
          d="M 252 165 C 303 165, 326 194, 326 228"
          stroke="rgba(255,255,255,0.70)"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* ═══ TOP (inner visible area) ═══ */}
        <ellipse cx="158" cy="98" rx="84" ry="17" fill={`url(#${id("inner")})`} />

        {/* Rim ring – top highlight */}
        <ellipse
          cx="158" cy="94" rx="94" ry="20"
          fill="none"
          stroke="rgba(255,255,255,0.94)"
          strokeWidth="7"
        />
        {/* Rim ring – inner shadow */}
        <ellipse
          cx="158" cy="99" rx="84" ry="17"
          fill="none"
          stroke="rgba(0,0,0,0.05)"
          strokeWidth="3"
        />

        {/* ═══ HIGHLIGHTS ═══ */}
        {/* Broad soft ceramic glow */}
        <path
          d="M 188 100 C 204 118, 210 195, 207 272 C 205 318, 200 350, 194 364"
          stroke="rgba(255,255,255,0.46)"
          strokeWidth="40"
          strokeLinecap="round"
        />
        {/* Medium bright streak */}
        <path
          d="M 186 100 C 201 118, 207 195, 204 272 C 202 318, 197 350, 191 364"
          stroke="rgba(255,255,255,0.70)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Thin specular peak */}
        <path
          d="M 187 102 C 201 118, 206 162, 204 202"
          stroke="rgba(255,255,255,0.90)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Left secondary reflection */}
        <path
          d="M 130 100 C 136 145, 138 235, 136 340"
          stroke="rgba(255,255,255,0.09)"
          strokeWidth="44"
          strokeLinecap="round"
        />

        {/* ═══ SHADOWS (depth) ═══ */}
        {/* Left edge shadow */}
        <rect x="63" y="98" width="20" height="254" fill="rgba(0,0,0,0.055)" />
        {/* Right edge shadow */}
        <rect x="233" y="98" width="20" height="254" fill="rgba(0,0,0,0.025)" />
        {/* Bottom ambient band */}
        <rect x="63" y="312" width="190" height="40" fill="rgba(0,0,0,0.038)" />

      </g>
    </svg>
  );
}
