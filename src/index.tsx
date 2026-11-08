import { Canvas } from '@remotion/canvas';
import { Group, Path, Circle, Rect, Text as RemotionText } from '@remotion/shape';
import { useCurrentTime } from '@remotion/hooks';
import { Audio } from '@remotion/audio';

// ── Video settings ──────────────────────────────────────────────────
// To switch FPS quickly for GitHub Actions: change framerate={30}
const VIDEO_WIDTH = 1080;
const VIDEO_HEIGHT = 1920;
const FRAMERATE = 60; // 30 for faster renders
const TOTAL_DURATION = 10; // seconds

// ── Audio placeholder paths (public/audio/) ─────────────────────────
// Keep these low volume so SFX are audible.
// BGM: soft upbeat sports background, low volume
const BGM_SRC = 'public/audio/sports-bgm.mp3';
// SFX
const DRIBBLE_SFX = 'public/audio/basketball-dribble-soft.mp3';
const WHOOSH_SFX = 'public/audio/jump-whoosh.mp3';
const SWISH_SFX = 'public/audio/swish-cheer.mp3';

// ── Colours (Lakers gold‑purple & court) ────────────────────────────
const COURT_BROWN = '#8B5A2B';       // basketball court wood
const COURT_LINE = '#000000';        // court lines
const HOOP_ORANGE = '#FF6F00';       // rim
const NET_GRAY = '#555555';          // net
const GOLD = '#B8860B';              // Lakers gold
const PURPLE = '#551A8B';            // Lakers purple
const BRIGHT_ORANGE = '#FF4500';     // ball accent
const CROWN_PURPLE = '#9C27B0';      // faint crowd
const SWISH_TEXT = '#FFD700';        // "SWISH!" gold

export const Composition = () => {
  const time = useCurrentTime();

  // ---------- Background / court ----------
  const courtBackground = () => (
    <rect
      x={0}
      y={0}
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
      color={COURT_BROWN}
    />
  );

  // ── Court lines ─────────────────────────────────────────────────────
  const courtLines = () => (
    <Group>
      {/* Outer boundary */}
      <rect
        x={VIDEO_WIDTH / 2 - 200}
        y={0}
        width={400}
        height={VIDEO_HEIGHT}
        color={COURT_LINE}
        strokeWidth={8}
      />
      {/* Center circle */}
      <circle
        cx={VIDEO_WIDTH / 2}
        cy={VIDEO_HEIGHT / 2}
        r={120}
        color={COURT_LINE}
        strokeWidth={8}
      />
      {/* Free-throw lane (left) */}
      <rect
        x={VIDEO_WIDTH / 2 - 80}
        y={VIDEO_HEIGHT / 2 - 120}
        width={160}
        height={120}
        color={COURT_LINE}
        strokeWidth={8}
      />
      {/* Free-throw lane (right) */}
      <rect
        x={VIDEO_WIDTH / 2 - 80}
        y={VIDEO_HEIGHT / 2 + 8}
        width={160}
        height={120}
        color={COURT_LINE}
        strokeWidth={8}
      />
      {/* Three-point arc (simplified: a big circle) */}
      <circle
        cx={VIDEO_WIDTH / 2}
        cy={VIDEO_HEIGHT / 2 - 200}
        r={300}
        color={COURT_LINE}
        strokeWidth={8}
      />
    </Group>
  );

  // ── Basketball hoop (right side) ────────────────────────────────────
  const hoop = () => (
    <Group>
      {/* Backboard */}
      <rect
        x={VIDEO_WIDTH - 250}
        y={VIDEO_HEIGHT / 2 - 150}
        width={100}
        height={200}
        color={ '#FFFFFF' }
        rx={8}
      />
      {/* Rim */}
      <circle
        cx={VIDEO_WIDTH - 200}
        cy={VIDEO_HEIGHT / 2}
        r={15}
        color={HOOP_ORANGE}
      />
      {/* Net strings – simple lines */}
      <Group>
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const x = Video_WIDTH - 200 + 15 * Math.cos(angle);
          const y = Video_HEIGHT / 2 + 15 * Math.sin(angle);
          return <line key={i} x1={VIDEO_WIDTH - 200} y1={VIDEO_HEIGHT / 2} x2={x} y2={y} stroke={NET_GRAY} strokeWidth={3} />;
        }) }
      </Group>
    </Group>
  );

  // ── LeBron doodle (standing, holding ball) ──────────────────────────
  // All shapes are simplified "doodle" style – thick outlines, no fills where noted.
  const leBron = (t: number) => {
    const headX = VIDEO_WIDTH / 2;
    const headY = VIDEO_HEIGHT / 2 + 100;
    const armOffset = t; // animated later

    return (
      <Group>
        {/* Head – simple circle with doodle face */}
        <circle
          cx={headX}
          cy={headY}
          r={50}
          stroke={PURPLE}
          strokeWidth={12}
          fill={ '#F8E6D5' } // skin tone
        />
        {/* Eyes */}
        <circle cx={headX - 15} cy={headY - 10} r={8} color={PURPLE} />
        <circle cx={headX + 15} cy={headY - 10} r={8} color={PURPLE} />
        {/* Nose */}
        <circle cx={headX} cy={headY + 5} r={5} color={PURPLE} />
        {/* Mouth (smile) */}
        <Path
          d="M190 230 C200 240, 210 240, 220 230"
          stroke={PURPLE}
          strokeWidth={10}
          fill={ 'none' }
        />
        {/* Hair (short spiky doodle) */}
        <Group>
          {Array.from({ length: 6 }, (_, i) => (
            <Path
              key={i}
              d={`M${headX - 40 + i * 15} ${headY - 60} Q${headX - 30 + i * 15} ${headY - 80} ${headX - 20 + i * 15} ${headY - 60}`}
              stroke={PURPLE}
              strokeWidth={10}
              fill={ 'none' }
            />
          )) }
        </Group>
        {/* Jersey number 23 */}
        <Text
          x={headX - 30}
          y={headY + 80}
          text={"23"}
          fontSize={30}
          color={PURPLE}
          fontWeight={600}
          // hand‑drawn look: no antialiasing hint needed
        />
        {/* Body – simplified torso */}
        <Path
          d="M200 280 Q250 300, 300 280 L300 380 Q250 400, 200 380 Z"
          stroke={PURPLE}
          strokeWidth={12}
          fill={ '#F8E6D5' }
        />
        {/* Arms – simple lines; will be animated for shot motion */}
        <Line
          x1={headX - 60}
          y1={headY + 20}
          x2={headX - 130}
          y2={headY + 80}
          stroke={PURPLE}
          strokeWidth={12}
        />
        <Line
          x1={headX + 60}
          y1={headY + 20}
          x2={headX + 130}
          y2={headY + 80}
          stroke={PURPLE}
          strokeWidth={12}
        />
        {/* Basketball in hands – simple circle */}
        <circle
          cx={headX - 30}
          cy={headY + 50}
          r={25}
          stroke={GOLD}
          strokeWidth={8}
          fill={ '#FFF' }
        />
        {/* Hand grip lines on ball (doodle) */}
        <Path
          d="M180 200 Q200 220, 220 200"
          stroke={GOLD}
          strokeWidth={5}
          fill={ 'none' }
        />
      </Group>
    );
  };

  // ── Basketball flying arc (3‑7s) ─────────────────────────────────────
  const flyingBall = (t: number) => {
    const progress = (t - 3) / 4; // 0..1 across 3‑7s
    // Parabolic arc: start left, peak centre-high, end right
    const x = lerp(VIDEO_WIDTH / 2 - 200, VIDEO_WIDTH - 200, progress);
    const y = lerp(VIDEO_HEIGHT / 2 + 100, VIDEO_HEIGHT / 2 - 300, progress) + 200 * Math.pow(progress - 0.5, 2) * -1; // simple up‑up
    // Simplified: just move in a curve
    return (
      <circle
        cx={x}
        cy={y}
        r={30}
        stroke={GOLD}
        strokeWidth={8}
        fill={ '#FFF' }
      />
    );
  };

  // ── Helper: linear interpolation ─────────────────────────────────────
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  // ── Text "SWISH!" fade‑in (7‑10s) ────────────────────────────────────
  const swishText = () => {
    const progress = (time.current - 7) / 3; // 0..1
    const opacity = Math.min(1, progress); // simple fade
    return (
      <RemotionText
        x={VIDEO_WIDTH / 2 - 100}
        y={VIDEO_HEIGHT / 2 + 300}
        text={"SWISH!"}
        fontSize={100}
        color={SWISH_TEXT}
        opacity={opacity}
        fontWeight={900}
      />
    );
  };

  // ── Audio players (placeholders) ────────────────────────────────────
  // BGM loops low volume throughout
  const bgm = (
    <Audio
      src={BGM_SRC}
      loop
      volume={0.15}
      // pause/play can be controlled, but for render we just mount
    />
  );
  const dribbleSfx = <Audio src={DRIBBLE_SFX} volume={0.6} />; // played 0‑3s
  const whooshSfx = <Audio src={WHOOSH_SFX} volume={0.6} />; // played 3‑7s
  const swishSfx = <Audio src={SWISH_SFX} volume={0.6} />; // played 7‑10s

  // ── Assemble timeline segments ───────────────────────────────────────
  // 0s – 3s: LeBron standing, dribble SFX, BGM
  // 3s – 7s: Jump shot, ball arc, whoosh SFX
  // 7s – 10s: Swish, net celebration, SWISH! text, swish cheer SFX

  return (
    <Canvas
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
      framerate={FRAMERATE}
      style={{ backgroundColor: '#fff' }}
    >
      {/* BGM – plays throughout */}
      {bgm}

      {/* ---------- SEGMENT: 0‑3s – Setup ---------- */}
      {time.current >= 0 && time.current < 3 && (
        <>
          {courtBackground()}
          {courtLines()}
          {hoop()}
          {/* LeBron standing, holding ball */}
          {leBron(0)}
          {/* Dribble SFX placeholder – comment/uncomment as needed */}
          {/* {dribbleSfx} */}

          {/* Faint crowd doodles far back – simple purple circles */}
          <Group>
            {Array.from({ length: 8 }, (_, i) => (
              <circle
                key={i}
                cx={VIDEO_WIDTH / 2 + (Math.random() - 0.5) * 400}
                cy={VIDEO_HEIGHT / 2 + (Math.random() - 0.5) * 300}
                r={20 + Math.random() * 30}
                color={CROWN_PURPLE}
                opacity={0.4}
              />
            ))}
          </Group>
        </>
      )}

      {/* ---------- SEGMENT: 3‑7s – Jump shot ---------- */}
      {time.current >= 3 && time.current < 7 && (
        <>
          {courtBackground()}
          {courtLines()}
          {hoop()}
          {/* LeBron in jumping/shooting pose – arms raised */}
          <Group>
            {/* Head stays, arms go up */}
            {leBron(1)} // t=1 raises arms a bit
            {/* Flying basketball arc */}
            {flyingBall(time.current)}
          </Group>
          {/* Whoosh SFX placeholder */}
          {/* {whooshSfx} */}
        </>
      )}

      {/* ---------- SEGMENT: 7‑10s – Swish & celebration ---------- */}
      {time.current >= 7 && time.current < 10 && (
        <>
          {courtBackground()}
          {courtLines()}
          {hoop()}
          {/* Ball already through hoop – we just show net wiggle */}
          {/* Net already drawn in hoop component; optional extra wiggle group */}
          <Group>
            {/* Simple net shake animation placeholder – offset based on time */}
            <Path
              d="M0 0 L0 200 L100 200 L100 0 Z" // simplified net rectangle
              x={VIDEO_WIDTH - 250}
              y={VIDEO_HEIGHT / 2 - 100}
              rotate={Math.sin((time.current - 7) * 5) * 5} // subtle wiggle
              stroke={NET_GRAY}
              strokeWidth={4}
            />
          </Group>
          {/* LeBron celebration: fist pump */}
          {/* Could animate arm raise – simplified here */}
          {/* Text fade‑in "SWISH!" */}
          {swishText()}
          {/* Swish cheer SFX placeholder */}
          {/* {swishSfx} */}
        </>
      )}
    </Canvas>
  );
};