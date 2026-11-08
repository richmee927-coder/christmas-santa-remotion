import {
  Audio,
  composition,
  Easing,
  interpolate,
  registerRoot,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/* ============================================================================
   VIDEO SPECS
   - Aspect ratio: 9:16  (1080 x 1920)
   - Frame rate: 60 FPS  -> change to 30 for faster GitHub Actions rendering
   - Runtime: 20 seconds
   ============================================================================ */
const WIDTH = 1080;
const HEIGHT = 1920;
const FPS = 30; // <-- Change to 60 for full smoothness (slower GitHub Actions rendering)
const DURATION_SECONDS = 20;
const DURATION_IN_FRAMES = DURATION_SECONDS * FPS; // 1200
const SCENE_SECONDS = 5;
const SCENE_FRAMES = SCENE_SECONDS * FPS; // 300 frames per scene

/* ============================================================================
   BACKGROUND (runs whole 20 seconds)
   - Deep midnight-blue sky
   - Slow falling snow
   - Faint twinkling stars
   - Moon glow visible in final scene (15-20s)
   ============================================================================ */

// Seeded pseudo-random so snowflakes/stars stay deterministic per frame.
let _seed = 1;
const _rand = () => {
  _seed = (_seed * 16807) % 2147483647;
  return _seed / 2147483647;
};

const SNOWFLAKES = Array.from({ length: 70 }, (_, i) => {
  const r = i * 211 + 13;
  return {
    id: i,
    x: (r % WIDTH),
    size: 2 + (r % 4),
    speed: 18 + (r % 40),
    delay: (r % 90) / 10,
    sway: 8 + (r % 26),
  };
});

const STAR_COUNT = 140;
const STARS = Array.from({ length: STAR_COUNT }, (_, i) => {
  const r = i * 137 + 7;
  return {
    id: i,
    x: r % WIDTH,
    y: (r * 7919) % HEIGHT,
    size: 1.1 + (r % 3),
    phase: (r * 1237 % 100) / 100,
  };
});

const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

const Sky = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: "linear-gradient(to bottom, #070a1b 0%, #111833 60%, #0b112b 100%)",
      zIndex: 0,
    }}
  />
);

const Star = ({ frame, s }: { frame: number; s: (typeof STARS)[number] }) => {
  const tSec = frame / FPS;
  const cycle = (tSec + s.phase * 5) % 5;
  const opacity = interpolate(cycle, [0, 2.5, 5], [0.25, 1, 0.25], {
    easing: Easing.inOut(Easing.ease),
  });
  return (
    <div
      key={s.id}
      style={{
        position: "absolute",
        left: s.x,
        top: s.y,
        width: s.size,
        height: s.size,
        borderRadius: "50%",
        background: "#fff",
        opacity,
        boxShadow: `0 0 ${s.size * 5}px rgba(255,255,255,0.9)`,
        pointerEvents: "none",
      }}
    />
  );
};

const Stars = ({ frame }: { frame: number }) => (
  <>
    {STARS.map((s) => (
      <Star key={s.id} frame={frame} s={s} />
    ))}
  </>
);

const Snowflake = ({ frame, s }: { frame: number; s: (typeof SNOWFLAKES)[number] }) => {
  const tSec = frame / FPS;
  const progress = ((tSec + s.delay) % 8) / 8;
  const y = interpolate(progress, [0, 1], [-s.size, HEIGHT + 20], {
    easing: Easing.inOut(Easing.ease),
  });
  const x = s.x + Math.sin((tSec + s.delay) * 2) * s.sway;
  const opacity = interpolate(progress, [0, 0.15, 0.85, 1], [0, 0.7, 0.7, 0]);
  return (
    <div
      key={s.id}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: s.size,
        height: s.size,
        borderRadius: "50%",
        background: "#fff",
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};

const Snow = ({ frame }: { frame: number }) => (
  <>
    {SNOWFLAKES.map((s) => (
      <Snowflake key={s.id} frame={frame} s={s} />
    ))}
  </>
);

const Moon = ({ frame }: { frame: number }) => {
  const sceneFrame = frame % SCENE_FRAMES;
  const t = interpolate(sceneFrame, [0, SCENE_FRAMES], [0, 1], {
    easing: Easing.inOut(Easing.ease),
  });
  const opacity = interpolate(t, [0, 0.25, 1], [0, 0.6, 0.95], {
    easing: Easing.inOut(Easing.ease),
  });
  const scale = interpolate(t, [0, 1], [0.6, 1], {
    easing: Easing.inOut(Easing.ease),
  });
  return (
    <svg
      width={340}
      height={340}
      style={{
        position: "absolute",
        right: -90,
        top: -110,
        opacity,
        transform: `scale(${scale})`,
        pointerEvents: "none",
      }}
    >
      <defs>
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fdf5e1" stopOpacity="1" />
          <stop offset="100%" stopColor="#fdf5e1" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="170" cy="170" r="150" fill="url(#moonGlow)" />
      <circle cx="170" cy="170" r="78" fill="#fff7d0" opacity={0.95} />
    </svg>
  );
};

/* ============================================================================
   CHARACTERS (drawn with SVG / Remotion shapes, no external images)
   ============================================================================ */

// Santa: red suit, white trim, round face, white beard, expressive eyes.
const Santa = ({
  expression,
  bob = 0,
}: {
  expression: "slumped" | "surprised" | "smiling";
  bob?: number;
}) => (
  <svg
    width="230"
    height="320"
    viewBox="0 0 230 320"
    style={{ display: "block", transform: `translateY(${bob}px)` }}
  >
    {/* Hat */}
    <path d="M 44 24 Q 115 0 186 24 L 166 86 Q 115 66 64 86 Z" fill="#c0392b" />
    <path d="M 64 86 Q 115 92 166 86 L 176 98 Q 115 108 54 98 Z" fill="#fff" opacity={0.97} />
    <circle cx="115" cy="22" r="10" fill="#fff" />
    {/* Head */}
    <circle cx="115" cy="106" r="44" fill="#f5deb3" />
    {/* Beard */}
    <path d="M 74 106 Q 115 140 156 106 Q 152 126 115 148 Q 78 126 74 106 Z" fill="#fff" />
    {/* Eyes / expression */}
    {expression === "surprised" ? (
      <>
        <circle cx="94" cy="100" r="6" fill="#222" />
        <circle cx="136" cy="100" r="6" fill="#222" />
      </>
    ) : expression === "smiling" ? (
      <>
        <circle cx="94" cy="102" r="5" fill="#222" />
        <circle cx="136" cy="102" r="5" fill="#222" />
        <path d="M 94 118 Q 115 126 136 118" stroke="#222" strokeWidth="2" fill="none" />
      </>
    ) : (
      <>
        <rect x="90" y="104" width="8" height="3" fill="#222" rx="1" />
        <rect x="132" y="104" width="8" height="3" fill="#222" rx="1" />
      </>
    )}
    {/* Nose */}
    <circle cx="115" cy="112" r="5" fill="#e74c3c" />
    {/* Body */}
    <rect x="58" y="158" width="114" height="114" rx="22" fill="#c0392b" />
    <rect x="58" y="262" width="114" height="22" fill="#fff" rx="11" />
    {/* Belt */}
    <rect x="74" y="206" width="82" height="14" fill="#222" rx="7" />
    <rect x="106" y="200" width="22" height="26" fill="#f1c40f" rx="2" />
    {/* Arms */}
    <rect x="44" y="182" width="24" height="52" rx="9" fill="#c0392b" transform="rotate(22 56 208)" />
    <rect x="162" y="182" width="24" height="52" rx="9" fill="#c0392b" transform="rotate(-22 174 208)" />
    {/* Gloves */}
    <rect x="34" y="218" width="30" height="24" rx="11" fill="#fff" />
    <rect x="166" y="218" width="30" height="24" rx="11" fill="#fff" />
    {/* Boots */}
    <rect x="74" y="294" width="32" height="20" rx="7" fill="#222" />
    <rect x="124" y="294" width="32" height="20" rx="7" fill="#222" />
  </svg>
);

// One reindeer: light brown, small antlers, friendly.
const Reindeer = ({ scale = 1 }: { scale?: number }) => (
  <svg
    width="190"
    height="170"
    viewBox="0 0 190 170"
    style={{ display: "block", transform: `scale(${scale})`, transformOrigin: "top left" }}
  >
    <rect x="64" y="74" width="84" height="38" rx="14" fill="#a67c52" />
    <rect x="122" y="64" width="38" height="32" rx="10" fill="#a67c52" />
    <circle cx="162" cy="86" r="16" fill="#f5deb3" />
    <circle cx="168" cy="88" r="6" fill="#e74c3c" />
    <rect x="148" y="66" width="9" height="16" rx="4" fill="#5d4037" transform="rotate(18 152 74)" />
    <rect x="168" y="62" width="9" height="16" rx="4" fill="#5d4037" transform="rotate(-18 172 70)" />
    <rect x="58" y="106" width="14" height="32" rx="5" fill="#5d4037" />
    <rect x="90" y="106" width="14" height="32" rx="5" fill="#5d4037" />
    <rect x="112" y="106" width="14" height="32" rx="5" fill="#5d4037" />
    <rect x="132" y="106" width="14" height="32" rx="5" fill="#5d4037" />
    <rect x="138" y="136" width="22" height="7" rx="3" fill="#5d4037" />
  </svg>
);

// Simple wooden sleigh.
const Sleigh = ({ tangled }: { tangled: boolean }) => (
  <svg width="360" height="230" viewBox="0 0 360 230" style={{ display: "block" }}>
    {/* Runners */}
    <path d="M 42 170 Q 42 200 106 200 L 314 200 Q 338 200 338 170" fill="none" stroke="#5d4037" strokeWidth="14" strokeLinecap="round" />
    <path d="M 54 160 Q 54 184 116 184 L 302 184 Q 326 184 326 160" fill="none" stroke="#8d6e63" strokeWidth="9" strokeLinecap="round" />
    {/* Seat */}
    <rect x="74" y="96" width="212" height="72" rx="12" fill="#8d6e63" opacity="0.9" />
    <rect x="74" y="96" width="212" height="14" fill="#5d4037" rx="8" />
    {tangled && (
      <>
        <path d="M 80 150 Q 150 40 260 160" fill="none" stroke="#e74c3c" strokeWidth="5" opacity="0.9" />
        <path d="M 260 160 Q 200 210 110 140 Q 60 100 90 190" fill="none" stroke="#f1c40f" strokeWidth="5" opacity="0.9" />
        <circle cx="100" cy="170" r="6" fill="#e74c3c" />
        <circle cx="200" cy="120" r="6" fill="#f1c40f" />
        <circle cx="290" cy="70" r="6" fill="#3498db" />
        <circle cx="130" cy="55" r="6" fill="#e74c3c" />
      </>
    )}
  </svg>
);

// Fairy lights: tangled (scene 1-2) vs straightening along sleigh (scene 3-4).
const TangledLights = () => (
  <svg
    width="460"
    height="460"
    style={{
      position: "absolute",
      left: WIDTH / 2 - 230,
      top: 980,
      pointerEvents: "none",
      zIndex: 4,
    }}
  >
    <path d="M 60 420 Q 180 80 340 440 T 430 60" fill="none" stroke="#e74c3c" strokeWidth="5" opacity="0.9" />
    <path d="M 430 60 Q 330 260 130 100 T 70 320" fill="none" stroke="#f1c40f" strokeWidth="5" opacity="0.9" />
    <circle cx="110" cy="330" r="7" fill="#e74c3c" />
    <circle cx="210" cy="220" r="7" fill="#f1c40f" />
    <circle cx="320" cy="120" r="7" fill="#3498db" />
    <circle cx="160" cy="60" r="7" fill="#e74c3c" />
    <circle cx="360" cy="250" r="7" fill="#f1c40f" />
  </svg>
);

const StraightLights = ({ t }: { t: number }) => {
  const opacity = interpolate(t, [0, 1], [0, 1], {
    easing: Easing.inOut(Easing.ease),
  });
  const y = interpolate(t, [0, 1], [210, 136], {
    easing: Easing.inOut(Easing.ease),
  });
  return (
    <svg
      width="360"
      height="200"
      style={{
        position: "absolute",
        left: 0,
        top: y,
        opacity,
        pointerEvents: "none",
      }}
    >
      <line x1="32" y1="106" x2="328" y2="106" stroke="#5d4037" strokeWidth="4" />
      {[32, 94, 156, 218, 280, 328].map((x, i) => (
        <circle key={i} cx={x} cy="106" r="7" fill={i % 2 === 0 ? "#e74c3c" : "#f1c40f"} />
      ))}
    </svg>
  );
};

// Glowing wish letter.
const Letter = ({
  big = false,
  styleOverride,
}: {
  big?: boolean;
  styleOverride?: React.CSSProperties;
}) => {
  const w = big ? 240 : 170;
  const h = big ? 300 : 210;
  return (
    <div
      style={{
        position: "absolute",
        width: w,
        height: h,
        pointerEvents: "none",
        ...styleOverride,
      }}
    >
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <defs>
          <radialGradient id="letterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="100%" stopColor="#ffe082" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={w / 2} cy={h / 2} r={Math.max(w, h) * 0.62} fill="url(#letterGlow)" />
        <rect x={w * 0.11} y={h * 0.09} width={w * 0.78} height={h * 0.82} rx={12} fill="#fff9c4" stroke="#ffe082" strokeWidth="3" />
        <line x1={w * 0.11} y1={h * 0.31} x2={w * 0.89} y2={h * 0.31} stroke="#ffe082" strokeWidth="2" opacity="0.7" />
        <text x={w * 0.22} y={h * 0.44} fontSize={big ? 22 : 13} fill="#b7950b" fontWeight="800" fontFamily="serif" letterSpacing="1">
          Wish
        </text>
      </svg>
    </div>
  );
};

// B-roll close-up: gloved hands gripping reins.
const HandsBRoll = () => (
  <svg width="260" height="260" viewBox="0 0 260 260" style={{ display: "block" }}>
    <line x1="64" y1="204" x2="196" y2="56" stroke="#5d4037" strokeWidth="9" strokeLinecap="round" />
    <rect x="32" y="174" width="52" height="44" rx="14" fill="#fff" transform="rotate(-28 58 196)" />
    <rect x="180" y="34" width="52" height="44" rx="14" fill="#fff" transform="rotate(28 206 56)" />
  </svg>
);

/* ============================================================================
   UI helpers
   ============================================================================ */

const BRoll = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      position: "absolute",
      left: 24,
      bottom: 130,
      width: 320,
      height: 320,
      borderRadius: 26,
      background: "rgba(255,255,255,0.10)",
      border: "2px solid rgba(255,255,255,0.40)",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 30,
      boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
    }}
  >
    {children}
  </div>
);

const VoText = ({ text, opacity }: { text: string; opacity: number }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 70,
      textAlign: "center",
      fontSize: 36,
      fontWeight: "900",
      color: "#fff",
      opacity,
      textShadow: "0 2px 20px rgba(0,0,0,0.6)",
      pointerEvents: "none",
      letterSpacing: 0.5,
    }}
  >
    {text}
  </div>
);

/* ============================================================================
   SCENES (4 x 5 seconds)
   ============================================================================ */

// ----------------------------------------------------------------------------
// SCENE 1: 0-5s
// Main: Dark midnight-blue snowy night. Santa slumped tired on his sleigh
//       tangled in fairy lights.
// B-roll: Close-up of Santa's worn gloved hands gripping the reins.
// VO: "I'm done."   SFX: Faint quiet wind
// ----------------------------------------------------------------------------
const Scene1 = ({ t, sceneFrame }: { t: number; sceneFrame: number }) => {
  const bob = Math.sin(sceneFrame / 22) * 3;
  const sway = Math.sin(sceneFrame / 34) * 2.5;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: WIDTH / 2 - 180,
          top: 1340 + bob,
          width: 360,
          height: 230,
          zIndex: 5,
          transform: `rotate(${sway}deg)`,
        }}
      >
        <Sleigh tangled />
      </div>
      <TangledLights />
      <div
        style={{
          position: "absolute",
          left: WIDTH / 2 - 115,
          top: 950 + bob,
          zIndex: 10,
        }}
      >
        <Santa expression="slumped" bob={bob} />
      </div>
      <BRoll>
        <HandsBRoll />
      </BRoll>
      <VoText text="I'm done." opacity={1} />
    </>
  );
};

// ----------------------------------------------------------------------------
// SCENE 2: 5-10s
// Main: Single glowing wish letter floats slowly upward toward Santa;
//       Santa lifts his head, surprised.
// B-roll: Macro close-up of the glowing letter.
// VO: "A wish?"   SFX: Subtle tiny sparkle sound on letter's appearance
// ----------------------------------------------------------------------------
const Scene2 = ({ t, sceneFrame }: { t: number; sceneFrame: number }) => {
  const letterY = interpolate(t, [0, 1], [HEIGHT + 130, 740], {
    easing: Easing.inOut(Easing.ease),
  });
  const letterScale = interpolate(t, [0, 0.15, 1], [0.5, 1, 1], {
    easing: Easing.inOut(Easing.ease),
  });
  const letterOpacity = interpolate(t, [0, 0.12, 1], [0, 1, 1], {
    easing: Easing.inOut(Easing.ease),
  });
  const bob = Math.sin(sceneFrame / 18) * 2;
  const sway = Math.sin(sceneFrame / 28) * 2;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: WIDTH / 2 - 180,
          top: 1340 + bob,
          width: 360,
          height: 230,
          zIndex: 5,
          transform: `rotate(${sway}deg)`,
        }}
      >
        <Sleigh tangled />
      </div>
      <TangledLights />
      <div
        style={{
          position: "absolute",
          left: WIDTH / 2 - 115,
          top: 880 + bob,
          zIndex: 10,
        }}
      >
        <Santa expression="surprised" bob={bob} />
      </div>
      <div
        style={{
          position: "absolute",
          left: WIDTH / 2 - 85,
          top: letterY,
          width: 170,
          height: 210,
          transform: `scale(${letterScale})`,
          opacity: letterOpacity,
          zIndex: 20,
        }}
      >
        <Letter />
      </div>
      <BRoll>
        <Letter big styleOverride={{ width: 240, height: 300, position: "relative" }} />
      </BRoll>
      <VoText text="A wish?" opacity={1} />
    </>
  );
};

// ----------------------------------------------------------------------------
// SCENE 3: 10-15s
// Main: More glowing wishes swirl around the sleigh; tangled fairy-lights
//       untangle gently; Santa smiles and grabs the reins.
// B-roll: Quick cut to the ready reindeer.
// VO: "Magic lives!"   SFX: Gentle magic tinkling sound as lights untangle
// ----------------------------------------------------------------------------
const SWIRLS = Array.from({ length: 6 }, (_, i) => i);

const Scene3 = ({ t, sceneFrame }: { t: number; sceneFrame: number }) => {
  const bob = Math.sin(sceneFrame / 14) * 2;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: WIDTH / 2 - 180,
          top: 1280 + bob,
          width: 360,
          height: 230,
          zIndex: 5,
        }}
      >
        <Sleigh tangled={false} />
        <StraightLights t={t} />
      </div>
      {SWIRLS.map((i) => {
        const angle = sceneFrame / 36 + i * ((Math.PI * 2) / SWIRLS.length);
        const radius = 150 + Math.sin(sceneFrame / 50 + i) * 18;
        const x = WIDTH / 2 + Math.cos(angle) * radius - 85;
        const y = 1080 + Math.sin(angle) * radius * 0.5 - 100;
        const rot = sceneFrame / 20 + i;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 140,
              height: 170,
              zIndex: 18,
              opacity: 0.9,
              transform: `rotate(${rot}deg)`,
            }}
          >
            <Letter />
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: WIDTH / 2 - 115,
          top: 1000 + bob,
          zIndex: 10,
        }}
      >
        <Santa expression="smiling" bob={bob} />
      </div>
      <div
        style={{
          position: "absolute",
          left: WIDTH / 2 - 230,
          top: 1160,
          zIndex: 8,
          transform: `scale(${interpolate(t, [0, 1], [0.65, 1], {
            easing: Easing.inOut(Easing.ease),
          })})`,
          transformOrigin: "top left",
        }}
      >
        <Reindeer />
      </div>
      <BRoll>
        <Reindeer scale={0.85} />
      </BRoll>
      <VoText text="Magic lives!" opacity={1} />
    </>
  );
};

// ----------------------------------------------------------------------------
// SCENE 4: 15-20s
// Main: Santa's sleigh soars across the starry sky. Centered fade-in text:
//       "Christmas magic never fades, as long as you believe."
// B-roll: Wide vertical shot of sleigh flying toward the moon
// SFX: No new effect   BGM: Soft swell to warm gentle peak (quiet, ~15-20%)
// ----------------------------------------------------------------------------
const Scene4 = ({ t, sceneFrame }: { t: number; sceneFrame: number }) => {
  const soarX = interpolate(sceneFrame, [0, SCENE_FRAMES], [WIDTH / 2 - 180, WIDTH / 2 - 460], {
    easing: Easing.inOut(Easing.ease),
  });
  const soarY = interpolate(sceneFrame, [0, SCENE_FRAMES], [1340, 430], {
    easing: Easing.inOut(Easing.ease),
  });
  const rotate = interpolate(sceneFrame, [0, SCENE_FRAMES], [0, -12], {
    easing: Easing.inOut(Easing.ease),
  });
  const textOpacity = interpolate(sceneFrame, [0, 50, SCENE_FRAMES], [0, 1, 1], {
    easing: Easing.inOut(Easing.ease),
  });
  const textScale = interpolate(textOpacity, [0, 1], [0.85, 1], {
    easing: Easing.inOut(Easing.ease),
  });
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: soarX,
          top: soarY,
          width: 360,
          height: 230,
          zIndex: 5,
          transform: `rotate(${rotate}deg)`,
        }}
      >
        <Sleigh tangled={false} />
        <StraightLights t={1} />
      </div>
      <div
        style={{
          position: "absolute",
          left: soarX + 70,
          top: soarY - 130,
          zIndex: 10,
        }}
      >
        <Santa expression="smiling" bob={Math.sin(sceneFrame / 16) * 2} />
      </div>
      <div
        style={{
          position: "absolute",
          left: soarX - 190,
          top: soarY - 30,
          zIndex: 8,
          transform: `scale(0.9)`,
          transformOrigin: "top left",
        }}
      >
        <Reindeer />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 460,
          textAlign: "center",
          fontSize: 32,
          fontWeight: "900",
          color: "#fff",
          opacity: textOpacity,
          textShadow: "0 2px 24px rgba(0,0,0,0.7)",
          lineHeight: 1.6,
          letterSpacing: 0.6,
          pointerEvents: "none",
          transform: `scale(${textScale})`,
          transformOrigin: "center",
          padding: 0 40,
        }}
      >
        Christmas magic never fades,<br />
        as long as you believe.
      </div>
      <BRoll>
        <div style={{ width: 260, height: 260, position: "relative" }}>
          <svg width="260" height="260" viewBox="0 0 260 260">
            <circle cx="200" cy="60" r="52" fill="#fff7d0" opacity="0.9" />
            <path d="M 40 200 Q 130 20 220 200" fill="none" stroke="#5d4037" strokeWidth="12" strokeLinecap="round" />
            <rect x="56" y="172" width="148" height="54" rx="10" fill="#8d6e63" opacity="0.9" />
          </svg>
        </div>
      </BRoll>
    </>
  );
};

const Scene = ({ sceneIndex, t, sceneFrame }: { sceneIndex: number; t: number; sceneFrame: number }) => {
  switch (sceneIndex) {
    case 0:
      return <Scene1 t={t} sceneFrame={sceneFrame} />;
    case 1:
      return <Scene2 t={t} sceneFrame={sceneFrame} />;
    case 2:
      return <Scene3 t={t} sceneFrame={sceneFrame} />;
    case 3:
      return <Scene4 t={t} sceneFrame={sceneFrame} />;
    default:
      return null;
  }
};

/* ============================================================================
   ROOT COMPOSITION
   ============================================================================ */

const Root = () => {
  const { durationInFrames, fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const sceneIndex = Math.min(3, Math.floor(frame / SCENE_FRAMES));
  const sceneFrame = frame % SCENE_FRAMES;
  const t = interpolate(sceneFrame, [0, SCENE_FRAMES], [0, 1], {
    easing: Easing.inOut(Easing.ease),
  });

  return (
    <div
      style={{
        width: WIDTH,
        height: HEIGHT,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* ========================================================================
          AUDIO PLACEHOLDERS
          Put your actual MP3 files in public/audio/ and keep these src paths.
          from/to are in seconds.
          ======================================================================== */}
      {/* bgm-soft-christmas.mp3 — full 20s, low volume so voiceover is priority */}
      <Audio src="/audio/bgm-soft-christmas.mp3" from={0} to={20} volume={0.12} />
      {/* wind.mp3 — 0-5s, faint quiet wind */}
      <Audio src="/audio/wind.mp3" from={0} to={5} volume={0.08} />
      {/* sparkle.mp3 — 5-10s, subtle sparkle on letter appearance */}
      <Audio src="/audio/sparkle.mp3" from={5} to={10} volume={0.18} />
      {/* magic-tinkle.mp3 — 10-15s, gentle magic tinkling as lights untangle */}
      <Audio src="/audio/magic-tinkle.mp3" from={10} to={15} volume={0.18} />

      <Sky />
      <Stars frame={frame} />
      <Snow frame={frame} />
      {sceneIndex === 3 && <Moon frame={frame} />}
      <Scene sceneIndex={sceneIndex} t={t} sceneFrame={sceneFrame} />
    </div>
  );
};

const Comp = () => (
  <composition
    id="ChristmasVertical"
    component={Root}
    durationInFrames={DURATION_IN_FRAMES}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);

registerRoot(<Comp />);
export default Comp;
