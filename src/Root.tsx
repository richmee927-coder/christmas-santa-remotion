import type { FC, ReactNode } from 'react';
import {
  AbsoluteFill,
  Composition,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// ─────────────────────────────────────────────────────────────────────────────
// AUDIO — commented out so the GitHub Actions test render stays silent.
// Audio files live in:
//   public/max-audio/max-voice.wav
//   public/max-audio/max-bgm.mp3
// To re-enable sound for a full render, uncomment the block below and add
// <Soundtrack /> inside MaxAndTheMoment (after the Scene sequences).
//
// import { Audio, staticFile } from 'remotion';
//
// const Soundtrack: FC = () => (
//   <>
//     <Audio src={staticFile('max-audio/max-voice.wav')} />
//     <Audio src={staticFile('max-audio/max-bgm.mp3')} />
//   </>
// );
// ─────────────────────────────────────────────────────────────────────────────

const W = 1080;
const H = 1920;
const FPS = 30;
const SCENE = 180;
const DURATION = SCENE * 4;

const C = {
  fur: '#e8963f',
  furDark: '#c9741f',
  furCream: '#ffe6c2',
  skin: '#f2c29b',
  skinDark: '#e0a97e',
  hair: '#4a3327',
  shirt: '#46688c',
  shirtDim: '#3f5c7e',
  jeans: '#33475c',
  jeans2: '#31465e',
  night: '#232c47',
  snow: '#eaf2ff',
  red: '#d64b3e',
  bandage: '#f6f2ea',
  bandageEdge: '#d9cdb6',
} as const;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const SceneShell: FC<{ children: ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [0, 18, SCENE - 18, SCENE], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

const Snow: FC<{
  left: number;
  top: number;
  width: number;
  height: number;
  count: number;
  speed?: number;
  maxR?: number;
  opacity?: number;
}> = ({ left, top, width, height, count, speed = 60, maxR = 8, opacity = 1 }) => {
  const f = useCurrentFrame();
  const flakes: ReactNode[] = [];
  for (let i = 0; i < count; i++) {
    const s = i * 137.5;
    const bx = left + ((s * 7.13) % width);
    const sp = speed * (0.55 + ((s * 3.71) % 10) / 10);
    const y = top + ((s * 11.17 + f * sp) % (height + 44)) - 22;
    const x = bx + Math.sin((f + s) / 17) * 12;
    const r = maxR * (0.35 + ((s * 5.31) % 10) / 14);
    const o = opacity * (0.35 + 0.65 * (((s * 2.77) % 10) / 10));
    flakes.push(<circle key={i} cx={x} cy={y} r={r} fill={C.snow} opacity={o} />);
  }
  return <g>{flakes}</g>;
};

const Scene1: FC = () => {
  const f = useCurrentFrame();
  const blink = f % 160 < 8;
  const laughLine = (f % 52) < 24;
  const glowR = 300 + 16 * Math.sin(f / 14);
  const bounce = 4 * Math.abs(Math.sin(f / 9));

  const tipX = 560 + 26 * Math.sin(f / 5);
  const tipY = 1416 + 22 * Math.sin(f / 10);
  const cpX = (470 + tipX) / 2 + 20 * Math.sin(f / 6);
  const cpY = (1330 - bounce + tipY) / 2 + 46;

  return (
    <SceneShell>
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
        <defs>
          <linearGradient id="wallGrad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#43284a" />
            <stop offset="100%" stopColor="#6b3f56" />
          </linearGradient>
          <radialGradient id="glow1">
            <stop offset="0%" stopColor="#ffd98a" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#ffb84d" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#ffb84d" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="vin1">
            <stop offset="0%" stopColor="#000" stopOpacity="0" />
            <stop offset="72%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.45" />
          </radialGradient>
          <clipPath id="snowClip1">
            <rect x={112} y={262} width={404} height={536} />
          </clipPath>
        </defs>

        <rect x={0} y={0} width={W} height={1450} fill="url(#wallGrad1)" />
        <rect x={0} y={1446} width={W} height={470} fill="#7a4632" />
        <rect x={0} y={1446} width={W} height={10} fill="#5d3626" />

        <ellipse cx={500} cy={1650} rx={330} ry={102} fill="#8d4f63" opacity={0.55} />
        <ellipse cx={500} cy={1650} rx={248} ry={72} fill="none" stroke="#b96f86" strokeWidth={5} opacity={0.35} />

        <g>
          <rect x={66} y={220} width={30} height={620} rx={12} fill="#a05060" />
          <rect x={526} y={226} width={30} height={612} rx={12} fill="#a05060" />
          <rect x={88} y={238} width={452} height={584} fill="#5d3b2f" />
          <rect x={112} y={262} width={404} height={536} fill={C.night} />
          <circle cx={446} cy={340} r={40} fill="#dfe8f7" opacity={0.14} />
          <circle cx={446} cy={340} r={24} fill="#dfe8f7" opacity={0.9} />
          <g clipPath="url(#snowClip1)">
            <Snow left={112} top={262} width={404} height={536} count={13} speed={64} maxR={8} />
          </g>
          <line x1={314} y1={262} x2={314} y2={798} stroke="#5d3b2f" strokeWidth={10} />
          <line x1={112} y1={530} x2={516} y2={530} stroke="#5d3b2f" strokeWidth={10} />
          <rect x={76} y={822} width={476} height={26} rx={9} fill="#6d452c" />
        </g>

        <circle cx={886} cy={800} r={glowR} fill="url(#glow1)" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <circle
            key={i}
            cx={790 + ((i * 73) % 190)}
            cy={700 + ((i * 29) % 250) + 14 * Math.sin(f / 23 + i)}
            r={4 + ((i * 7) % 3)}
            fill="#ffe2a1"
            opacity={0.22 + 0.18 * Math.sin(f / 17 + i)}
          />
        ))}
        <rect x={878} y={876} width={16} height={700} fill="#6b4a2e" />
        <ellipse cx={886} cy={1580} rx={62} ry={16} fill="#54381f" />
        <path d="M 796 876 L 976 876 L 934 696 L 838 696 Z" fill="#e3b14f" stroke="#caa23f" strokeWidth={4} />
        <ellipse cx={886} cy={696} rx={48} ry={10} fill="#f0c364" />
        <circle cx={886} cy={812} r={40} fill="#ffe9b0" opacity={0.5} />

        <g>
          <rect x={46} y={1034} width={564} height={226} rx={40} fill="#8a4a44" />
          <rect x={46} y={1230} width={564} height={370} rx={46} fill="#98524a" />
          <rect x={70} y={1296} width={256} height={134} rx={30} fill="#a85f52" />
          <rect x={332} y={1296} width={256} height={134} rx={30} fill="#a85f52" />
          <rect x={560} y={1150} width={74} height={450} rx={34} fill="#7d443e" />
        </g>

        <g transform={`translate(0 ${-bounce})`}>
          <g transform={`rotate(${3 * Math.sin(f / 9)} 268 1150)`}>
            <circle cx={196} cy={1072} r={13} fill={C.skinDark} />
            <circle cx={268} cy={1064} r={84} fill={C.skin} />
            <path
              d="M 184 1064 A 84 84 0 0 1 352 1064 Q 322 1020 300 1030 Q 276 1004 250 1018 Q 222 1002 210 1034 Q 194 1048 184 1064 Z"
              fill={C.hair}
            />
            <path d="M 294 1030 q 14 -8 28 0" stroke={C.hair} strokeWidth={6} strokeLinecap="round" fill="none" />
            <path d="M 298 1062 q 12 -12 26 -2" stroke="#3a2a20" strokeWidth={6} strokeLinecap="round" fill="none" />
            <path d="M 308 1108 Q 332 1116 322 1144 Q 306 1158 290 1142 Q 296 1118 308 1108 Z" fill="#7c3a30" />
            <ellipse cx={306} cy={1144} rx={10} ry={6} fill="#e2705f" />
            <circle cx={292} cy={1092} r={10} fill="#e2705f" opacity={0.25} />
          </g>
          <rect x={196} y={1140} width={178} height={216} rx={44} fill={C.shirt} />
          <g strokeLinecap="round" fill="none">
            <path d="M 300 1352 Q 350 1344 400 1360" stroke={C.jeans} strokeWidth={58} />
            <path d="M 400 1362 L 408 1558" stroke={C.jeans} strokeWidth={48} />
          </g>
          <ellipse cx={418} cy={1576} rx={36} ry={18} fill="#2b2b33" />
          <path d="M 352 1200 L 420 1286" stroke={C.shirt} strokeWidth={62} strokeLinecap="round" />
          <path d="M 420 1286 L 470 1330" stroke={C.skin} strokeWidth={40} strokeLinecap="round" />
          <circle cx={470} cy={1330} r={26} fill={C.skin} />
        </g>

        <path
          d={`M 470 ${1330 - bounce} Q ${cpX} ${cpY} ${tipX} ${tipY}`}
          fill="none"
          stroke="#e9e2d0"
          strokeWidth={7}
          strokeLinecap="round"
        />

        <g transform={`rotate(${2 * Math.sin(f / 7)} 730 1568)`}>
          <path
            d={`M 828 1560 Q 902 ${1580 + 30 * Math.sin(f / 9)} 944 ${1518 + 36 * Math.sin(f / 7)}`}
            stroke={C.fur}
            strokeWidth={30}
            strokeLinecap="round"
            fill="none"
          />
          <ellipse cx={730} cy={1568} rx={120} ry={66} fill={C.fur} />
          <circle cx={790} cy={1560} r={62} fill={C.fur} />
          <g stroke={C.furDark} strokeWidth={12} strokeLinecap="round" fill="none" opacity={0.85}>
            <path d="M 700 1512 q -6 40 0 58" />
            <path d="M 752 1508 q -4 44 0 62" />
            <path d="M 802 1514 q -2 36 0 50" />
          </g>
          <ellipse cx={662} cy={1552} rx={46} ry={54} fill={C.furCream} transform="rotate(-12 662 1552)" />
          <g transform={`rotate(${-4 + 2 * Math.sin(f / 7)} 640 1486)`}>
            <path d="M 612 1440 L 592 1366 L 654 1420 Z" fill={C.fur} />
            <path d="M 618 1428 L 606 1384 L 646 1420 Z" fill="#ffdcae" />
            <path d="M 662 1424 L 700 1360 L 716 1432 Z" fill={C.fur} />
            <path d="M 668 1422 L 694 1380 L 706 1424 Z" fill="#ffdcae" />
            <circle cx={640} cy={1486} r={64} fill={C.fur} />
            {blink ? (
              <g stroke="#4a2f1c" strokeWidth={5} strokeLinecap="round" fill="none">
                <path d="M 594 1480 q 12 8 24 2" />
                <path d="M 632 1478 q 12 8 24 0" />
              </g>
            ) : (
              <g>
                <ellipse cx={606} cy={1480} rx={15} ry={19} fill="#fff" />
                <circle cx={601} cy={1484} r={8} fill="#241812" />
                <circle cx={597} cy={1478} r={3} fill="#fff" />
                <ellipse cx={644} cy={1476} rx={14} ry={18} fill="#fff" />
                <circle cx={639} cy={1480} r={7.5} fill="#241812" />
                <circle cx={635} cy={1474} r={2.8} fill="#fff" />
              </g>
            )}
            <path d="M 588 1500 L 580 1506 L 596 1506 Z" fill="#7a4a2f" />
            <path
              d="M 588 1512 q -6 8 -14 4 M 588 1512 q 8 8 16 2"
              stroke="#7a4a2f"
              strokeWidth={4}
              strokeLinecap="round"
              fill="none"
            />
            <g stroke="#fff" strokeOpacity={0.65} strokeWidth={3} strokeLinecap="round">
              <line x1={566} y1={1490} x2={512} y2={1484} />
              <line x1={566} y1={1498} x2={514} y2={1508} />
            </g>
          </g>
          <path
            d={`M 692 1508 Q ${600 + 18 * Math.sin(f / 6)} 1418 ${tipX} ${tipY}`}
            stroke={C.fur}
            strokeWidth={34}
            strokeLinecap="round"
            fill="none"
          />
          <circle cx={tipX} cy={tipY} r={20} fill={C.fur} />
          <path
            d={`M ${tipX - 10} ${tipY - 12} L ${tipX - 10} ${tipY - 2}`}
            stroke={C.furCream}
            strokeWidth={4}
            strokeLinecap="round"
          />
        </g>

        <g strokeLinecap="round" fill="none" opacity={laughLine ? 0.85 : 0.15}>
          <path d="M 356 1004 q 12 -14 26 -18" stroke="#ffcf88" strokeWidth={5} />
          <path d="M 366 1040 q 16 -10 32 -10" stroke="#ffcf88" strokeWidth={5} />
          <path d="M 342 962 q 8 -16 20 -24" stroke="#ffcf88" strokeWidth={5} />
        </g>

        <rect x={0} y={0} width={W} height={H} fill="#ff9d5c" opacity={0.06} />
        <rect x={0} y={0} width={W} height={H} fill="url(#vin1)" />
      </svg>
    </SceneShell>
  );
};

const Scene2: FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const HIT = 58;

  const swipeX = interpolate(f, [30, 52, HIT, HIT + 99], [-150, 250, 468, 470], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const swipeY = interpolate(f, [30, 52, HIT + 99], [940, 870, 1046], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });
  const cp2X = (swipeX + 170) / 2 - 40;
  const cp2Y = (swipeY + 1230) / 2 - 30;
  const shiver = f >= HIT ? 3 * Math.sin(f / 1.7) : 0;
  const shakeX = f >= HIT && f < HIT + 7 ? 7 * Math.sin((f - HIT + 2) * 2.4) : 0;
  const shakeY = f >= HIT && f < HIT + 7 ? 5 * Math.cos((f - HIT + 2) * 3.1) : 0;

  const ringP = clamp01((f - HIT) / 14);
  const markSpr = (delay: number) =>
    f < delay ? 0 : Math.min(1.25, spring({ frame: f - delay, fps, config: { damping: 18, stiffness: 240 } }));
  const m0 = markSpr(HIT + 4);
  const m1 = markSpr(HIT + 10);
  const m2 = markSpr(HIT + 16);
  const flashO = f >= HIT && f < HIT + 6 ? 0.18 * (1 - clamp01((f - HIT) / 6)) : 0;

  return (
    <SceneShell>
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
        <defs>
          <linearGradient id="wallGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#241a2e" />
            <stop offset="100%" stopColor="#35202f" />
          </linearGradient>
          <radialGradient id="glow2">
            <stop offset="0%" stopColor="#c98a4a" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#c98a4a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="vin2">
            <stop offset="0%" stopColor="#000" stopOpacity="0" />
            <stop offset="62%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.6" />
          </radialGradient>
          <clipPath id="snowClip2">
            <rect x={712} y={168} width={260} height={330} />
          </clipPath>
        </defs>

        <rect x={0} y={0} width={W} height={1400} fill="url(#wallGrad2)" />
        <rect x={0} y={1396} width={W} height={524} fill="#3b271d" />
        <rect x={0} y={1396} width={W} height={10} fill="#2b1c14" />

        <g>
          <rect x={700} y={156} width={284} height={356} fill="#3a2c22" />
          <rect x={712} y={168} width={260} height={330} fill="#1d2436" />
          <g clipPath="url(#snowClip2)">
            <Snow left={712} top={168} width={260} height={330} count={6} speed={30} maxR={5} opacity={0.4} />
          </g>
          <line x1={842} y1={168} x2={842} y2={498} stroke="#3a2c22" strokeWidth={8} />
          <rect x={690} y={512} width={304} height={20} rx={7} fill="#443326" />
        </g>

        <circle cx={1070} cy={920} r={260} fill="url(#glow2)" />

        <rect x={0} y={0} width={W} height={H} fill="#0b0618" opacity={0.38} />

        <g transform={`translate(${shakeX} ${shakeY})`}>
          <path d="M 1250 1760 L 640 1130" stroke={C.skin} strokeWidth={172} strokeLinecap="round" />
          <ellipse cx={540} cy={1016} rx={118} ry={104} fill={C.skin} transform="rotate(-18 540 1016)" />
          {[0, 1, 2, 3].map((k) => (
            <rect
              key={k}
              x={-28}
              y={-218}
              width={56}
              height={236}
              rx={28}
              fill={C.skin}
              transform={`translate(${448 + k * 64} 1006) rotate(${-26 + k * 17})`}
            />
          ))}
          <rect
            x={-26}
            y={-182}
            width={52}
            height={210}
            rx={26}
            fill={C.skin}
            transform="translate(430 1092) rotate(-64)"
          />

          <path d="M -90 1290 L 170 1230" stroke={C.fur} strokeWidth={64} strokeLinecap="round" />
          <path
            d={`M 170 1230 Q ${cp2X} ${cp2Y} ${swipeX} ${swipeY}`}
            stroke={C.fur}
            strokeWidth={58}
            strokeLinecap="round"
            fill="none"
          />
          <circle cx={swipeX} cy={swipeY} r={26} fill={C.fur} />
          <path
            d={`M ${swipeX - 12} ${swipeY - 12} L ${swipeX - 12} ${swipeY - 2}`}
            stroke={C.furCream}
            strokeWidth={4}
            strokeLinecap="round"
          />

          <g transform={`translate(${150 + 2 * Math.sin(f / 3.1)} ${1150 + shiver})`}>
            <path d="M -8 -56 Q -54 -62 -76 -32 L -14 -12 Z" fill={C.fur} />
            <path d="M 70 -58 Q 112 -56 126 -26 L 66 -16 Z" fill={C.fur} />
            <circle cx={0} cy={0} r={88} fill={C.fur} />
            <ellipse cx={-32} cy={-6} rx={20} ry={24} fill="#fff" />
            <circle cx={-30} cy={0} r={7} fill="#241812" />
            <ellipse cx={34} cy={-8} rx={19} ry={23} fill="#fff" />
            <circle cx={36} cy={-2} r={6.5} fill="#241812" />
            <ellipse cx={0} cy={46} rx={11} ry={15} fill="#6b3a24" />
            <g stroke="#fff" strokeOpacity={0.6} strokeWidth={4} strokeLinecap="round">
              <line x1={-60} y1={38} x2={-118} y2={30} />
              <line x1={-60} y1={52} x2={-116} y2={58} />
              <line x1={60} y1={40} x2={116} y2={34} />
            </g>
          </g>

          <g transform="translate(560 1060) rotate(-24)">
            {[
              { x: -30, s: m0 },
              { x: 2, s: m1 },
              { x: 34, s: m2 },
            ].map((mk) => (
              <path
                key={mk.x}
                d={`M ${mk.x} -76 L ${mk.x} 80`}
                stroke={C.red}
                strokeWidth={14}
                strokeLinecap="round"
                opacity={mk.s > 0 ? 1 : 0}
                transform={`scale(${mk.s})`}
              />
            ))}
          </g>

          {f >= HIT ? (
            <circle
              cx={590}
              cy={998}
              r={8 + 92 * ringP}
              stroke="#e2483a"
              strokeWidth={10 - 7 * ringP}
              fill="none"
              opacity={1 - ringP}
            />
          ) : null}
          {f >= HIT && f < HIT + 26 ? (
            <path
              d="M 0 -30 L 8 -8 L 30 0 L 8 8 L 0 30 L -8 8 L -30 0 L -8 -8 Z"
              fill="#e2483a"
              opacity={1 - clamp01((f - HIT) / 26)}
              transform={`translate(610 990) rotate(${f * 4}) scale(${0.15 + 0.85 * clamp01((f - HIT) / 8)})`}
            />
          ) : null}
        </g>

        <rect x={0} y={0} width={W} height={H} fill={C.red} opacity={flashO} />
        <rect x={0} y={0} width={W} height={H} fill="url(#vin2)" />
      </svg>
    </SceneShell>
  );
};

const Scene3: FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const glowR = 230 + 10 * Math.sin(f / 16);

  const dOut = f > 22 ? Math.min(1, spring({ frame: f - 22, fps, config: { damping: 200, stiffness: 80 } })) : 0;
  const gapH = 4 + 44 * dOut;
  const drawerY = 742 + gapH;

  const wrapP = interpolate(f, [44, 116], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const bandSpr = (delay: number) =>
    f < delay ? 0 : Math.min(1.2, spring({ frame: f - delay, fps, config: { damping: 24, stiffness: 300 } }));
  const bands: [number, number][] = [
    [546, 1302],
    [516, 1288],
    [486, 1274],
    [456, 1260],
    [432, 1246],
  ];

  const sweatP = clamp01((f - 14) / 32);
  const petS = f > 92 ? spring({ frame: f - 92, fps, config: { damping: 200, stiffness: 140 } }) : 0;
  const petBob = f > 110 ? 5 * Math.sin((f - 110) / 5.5) : 0;

  return (
    <SceneShell>
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
        <defs>
          <linearGradient id="wallGrad3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b2b46" />
            <stop offset="100%" stopColor="#5d3a4e" />
          </linearGradient>
          <radialGradient id="glow3">
            <stop offset="0%" stopColor="#ffd98a" stopOpacity="0.55" />
            <stop offset="60%" stopColor="#ffb84d" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#ffb84d" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="vin3">
            <stop offset="0%" stopColor="#000" stopOpacity="0" />
            <stop offset="70%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.5" />
          </radialGradient>
          <clipPath id="snowClip3">
            <rect x={70} y={196} width={290} height={372} />
          </clipPath>
        </defs>

        <rect x={0} y={0} width={W} height={1460} fill="url(#wallGrad3)" />
        <rect x={0} y={1456} width={W} height={464} fill="#6f4230" />
        <rect x={0} y={1456} width={W} height={10} fill="#543122" />

        <g>
          <rect x={58} y={184} width={314} height={396} fill="#55382a" />
          <rect x={70} y={196} width={290} height={372} fill="#24304a" />
          <circle cx={316} cy={250} r={14} fill="#dfe8f7" opacity={0.8} />
          <g clipPath="url(#snowClip3)">
            <Snow left={70} top={196} width={290} height={372} count={8} speed={40} maxR={6} opacity={0.85} />
          </g>
          <line x1={215} y1={196} x2={215} y2={568} stroke="#55382a" strokeWidth={9} />
          <rect x={44} y={578} width={342} height={22} rx={8} fill="#63402a" />
        </g>

        <circle cx={1012} cy={806} r={glowR} fill="url(#glow3)" />
        <rect x={1004} y={936} width={14} height={640} fill="#5f4026" />
        <path d="M 958 938 L 1074 938 L 1042 764 L 988 764 Z" fill="#d9a94c" stroke="#b98d3c" strokeWidth={4} />
        <ellipse cx={1015} cy={764} rx={30} ry={7} fill="#e6bd5e" />
        <circle cx={1015} cy={870} r={30} fill="#ffe9b0" opacity={0.45} />

        <g>
          <rect x={-80} y={1246} width={470} height={368} rx={44} fill="#7f4a46" />
          <rect x={-64} y={1292} width={440} height={120} rx={30} fill="#8d544f" />
        </g>

        <g>
          <rect x={664} y={560} width={292} height={268} rx={16} fill="#f1ece1" stroke="#cdbfa4" strokeWidth={6} />
          <rect x={788} y={596} width={34} height={106} rx={7} fill={C.red} />
          <rect x={752} y={632} width={106} height={34} rx={7} fill={C.red} />
          <rect x={678} y={742} width={264} height={6} rx={3} fill="#d8c9ad" />
          <rect x={678} y={742} width={264} height={gapH} fill="#241a2e" />
          <rect x={700} y={drawerY - 46} width={84} height={46} rx={8} fill={C.bandage} stroke={C.bandageEdge} strokeWidth={3} />
          <rect x={737} y={drawerY - 37} width={10} height={26} rx={3} fill={C.red} />
          <rect x={729} y={drawerY - 29} width={26} height={10} rx={3} fill={C.red} />
          <circle cx={846} cy={drawerY - 24} r={24} fill="#fdfaf3" stroke={C.bandageEdge} strokeWidth={3} />
          <circle cx={846} cy={drawerY - 24} r={8} fill="#cfc2a6" />
          <path
            d={`M 868 ${drawerY - 20} Q 898 ${drawerY - 10} 916 ${drawerY + 4}`}
            stroke="#fdfaf3"
            strokeWidth={10}
            strokeLinecap="round"
            fill="none"
          />
          <rect x={672} y={drawerY} width={276} height={96} rx={12} fill="#e8ddc8" stroke="#c9b894" strokeWidth={4} />
          <rect x={762} y={drawerY + 42} width={96} height={12} rx={6} fill="#b7a687" />
        </g>

        <g>
          <rect x={156} y={1148} width={190} height={196} rx={46} fill={C.shirtDim} />
          <g strokeLinecap="round" fill="none">
            <path d="M 250 1330 Q 330 1338 396 1366" stroke={C.jeans2} strokeWidth={58} />
            <path d="M 398 1368 L 388 1548" stroke={C.jeans2} strokeWidth={46} />
          </g>
          <ellipse cx={396} cy={1564} rx={34} ry={16} fill="#26262e" />
          <path d="M 316 1176 L 428 1234" stroke={C.shirtDim} strokeWidth={54} strokeLinecap="round" />
          <path d="M 428 1234 L 512 1280" stroke={C.skin} strokeWidth={40} strokeLinecap="round" />
          <g transform={`rotate(${2 * Math.sin(f / 13)} 236 1090)`}>
            <circle cx={168} cy={1098} r={12} fill={C.skinDark} />
            <circle cx={236} cy={1090} r={78} fill={C.skin} />
            <path
              d="M 160 1090 A 78 78 0 0 1 312 1090 Q 288 1054 268 1062 Q 246 1042 224 1054 Q 200 1044 190 1068 Q 176 1078 160 1090 Z"
              fill={C.hair}
            />
            <path d="M 256 1062 q 12 -4 24 2" stroke={C.hair} strokeWidth={5} strokeLinecap="round" fill="none" />
            <path d="M 258 1082 q 12 12 26 6" stroke="#3a2a20" strokeWidth={5} strokeLinecap="round" fill="none" />
            <path d="M 268 1120 q 8 -8 18 -2" stroke="#7c3a30" strokeWidth={5} strokeLinecap="round" fill="none" />
          </g>
          <ellipse cx={540} cy={1292} rx={56} ry={42} fill={C.skin} transform="rotate(-16 540 1292)" />
          <circle cx={502} cy={1272} r={15} fill={C.skin} />
          <circle cx={530} cy={1264} r={15} fill={C.skin} />
          <circle cx={558} cy={1262} r={15} fill={C.skin} />
          <circle cx={586} cy={1272} r={15} fill={C.skin} />
          <circle cx={492} cy={1306} r={17} fill={C.skin} />
          <g stroke={C.red} strokeWidth={8} strokeLinecap="round" opacity={1 - wrapP}>
            <path d="M 522 1288 L 556 1276" />
            <path d="M 530 1300 L 566 1290" />
          </g>

          {[0, 1, 2, 3, 4].map((k) => {
            const s = bandSpr(44 + k * 12);
            return (
              <g
                key={k}
                transform={`translate(${bands[k][0]} ${bands[k][1]}) rotate(-63) scale(${s})`}
                opacity={s > 0 ? 1 : 0}
              >
                <rect x={-17} y={-38} width={34} height={76} rx={12} fill={C.bandage} stroke={C.bandageEdge} strokeWidth={3} />
              </g>
            );
          })}
        </g>

        <g>
          <path d="M 884 1530 Q 874 1594 802 1588 Q 736 1584 720 1556" stroke={C.fur} strokeWidth={24} strokeLinecap="round" fill="none" />
          <circle cx={718} cy={1554} r={12} fill={C.furCream} />
          <ellipse cx={796} cy={1512} rx={92} ry={74} fill={C.fur} />
          <path d="M 704 1418 L 704 1580" stroke={C.fur} strokeWidth={26} strokeLinecap="round" />
          <path d="M 742 1414 L 744 1580" stroke={C.fur} strokeWidth={26} strokeLinecap="round" />
          <ellipse cx={704} cy={1588} rx={18} ry={12} fill={C.fur} />
          <ellipse cx={744} cy={1586} rx={18} ry={12} fill={C.fur} />
          <ellipse cx={712} cy={1464} rx={40} ry={58} fill={C.furCream} />
          <g transform={`translate(4 12) rotate(${-22 + 3 * Math.sin(f / 11)} 700 1352)`}>
            <path d="M 676 1300 Q 650 1306 638 1330 L 684 1342 Z" fill={C.fur} />
            <path d="M 726 1294 Q 750 1302 758 1326 L 716 1338 Z" fill={C.fur} />
            <circle cx={700} cy={1352} r={61} fill={C.fur} />
            <ellipse cx={676} cy={1346} rx={11} ry={12} fill="#fff" />
            <circle cx={676} cy={1350} r={5} fill="#241812" />
            <path d="M 664 1340 L 688 1346" stroke="#7a4a2f" strokeWidth={5} strokeLinecap="round" />
            <ellipse cx={718} cy={1342} rx={11} ry={12} fill="#fff" />
            <circle cx={718} cy={1346} r={5} fill="#241812" />
            <path d="M 706 1336 L 730 1342" stroke="#7a4a2f" strokeWidth={5} strokeLinecap="round" />
            <path d="M 646 1364 L 638 1370 L 654 1370 Z" fill="#7a4a2f" />
            <path d="M 646 1378 q -4 8 -12 6" stroke="#7a4a2f" strokeWidth={4} strokeLinecap="round" fill="none" />
            <g stroke="#fff" strokeOpacity={0.6} strokeWidth={3} strokeLinecap="round">
              <line x1={614} y1={1360} x2={572} y2={1356} />
              <line x1={614} y1={1368} x2={574} y2={1374} />
            </g>
          </g>
        </g>

        {f > 14 && f < 46 ? (
          <path
            d="M 0 -9 Q 5 0 0 9 Q -5 0 0 -9 Z"
            fill="#8fd0ff"
            opacity={1 - 0.7 * sweatP}
            transform={`translate(690 ${1276 + 44 * sweatP})`}
          />
        ) : null}

        {petS > 0.01 ? (
          <g opacity={petS}>
            <path d="M 214 1158 Q 430 1180 660 1306" stroke={C.shirtDim} strokeWidth={46} strokeLinecap="round" fill="none" />
            <circle cx={682} cy={1318 - petBob} r={24} fill={C.skin} />
          </g>
        ) : null}

        <rect x={0} y={0} width={W} height={H} fill="#ffb26b" opacity={0.05} />
        <rect x={0} y={0} width={W} height={H} fill="url(#vin3)" />
      </svg>
    </SceneShell>
  );
};

const Scene4: FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const breath = Math.sin(f / 36);
  const chestScale = 1 + 0.016 * breath;
  const glowR = 320 + 14 * Math.sin(f / 30);

  const titleS = f > 78 ? spring({ frame: f - 78, fps, config: { damping: 200, stiffness: 120 }, durationInFrames: 60 }) : 0;
  const titleO = clamp01(titleS);
  const titleY = 24 * (1 - titleO);
  const pawBob = f > 60 ? 4 * Math.sin((f - 60) / 9) : 0;

  return (
    <SceneShell>
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
        <defs>
          <linearGradient id="wallGrad4" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2f2240" />
            <stop offset="100%" stopColor="#4a2e44" />
          </linearGradient>
          <radialGradient id="glow4">
            <stop offset="0%" stopColor="#ffd98a" stopOpacity="0.6" />
            <stop offset="55%" stopColor="#ffb84d" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ffb84d" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="vin4">
            <stop offset="0%" stopColor="#000" stopOpacity="0" />
            <stop offset="68%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
          </radialGradient>
          <clipPath id="snowClip4">
            <rect x={102} y={182} width={268} height={326} />
          </clipPath>
        </defs>

        <rect x={0} y={0} width={W} height={1480} fill="url(#wallGrad4)" />
        <rect x={0} y={1476} width={W} height={444} fill="#533024" />
        <rect x={0} y={1476} width={W} height={10} fill="#402418" />

        <g>
          <rect x={90} y={170} width={292} height={352} fill="#4e3628" />
          <rect x={102} y={182} width={268} height={326} fill="#20273e" />
          <circle cx={330} cy={238} r={13} fill="#dfe8f7" opacity={0.75} />
          <g clipPath="url(#snowClip4)">
            <Snow left={102} top={182} width={268} height={326} count={8} speed={26} maxR={5} opacity={0.5} />
          </g>
          <line x1={236} y1={182} x2={236} y2={508} stroke="#4e3628" strokeWidth={8} />
          <rect x={76} y={522} width={320} height={20} rx={8} fill="#5a3c2a" />
        </g>

        <circle cx={1000} cy={760} r={glowR} fill="url(#glow4)" />
        <rect x={1006} y={900} width={14} height={660} fill="#523a26" />
        <path d="M 964 904 L 1076 904 L 1048 740 L 992 740 Z" fill="#d9a94c" stroke="#b98d3c" strokeWidth={4} />
        <circle cx={1010} cy={830} r={28} fill="#ffe9b0" opacity={0.4} />

        <rect x={66} y={1128} width={232} height={118} rx={40} fill="#a99ab8" />

        <g>
          <circle cx={126} cy={1210} r={12} fill={C.skinDark} />
          <circle cx={206} cy={1194} r={82} fill={C.skin} />
          <path
            d="M 124 1194 A 82 82 0 0 1 288 1194 Q 262 1150 240 1158 Q 218 1136 196 1146 Q 172 1138 160 1160 Q 138 1170 124 1194 Z"
            fill={C.hair}
          />
          <path d="M 186 1186 q 12 10 26 4" stroke="#3a2a20" strokeWidth={5} strokeLinecap="round" fill="none" />
          <path d="M 236 1190 q 10 9 22 4" stroke="#3a2a20" strokeWidth={5} strokeLinecap="round" fill="none" />
          <path d="M 232 1230 q 8 6 16 2" stroke="#7c3a30" strokeWidth={5} strokeLinecap="round" fill="none" />
        </g>

        <g transform="translate(0 -6)" fill="none" stroke="#ffe9cd" strokeWidth={5} strokeLinecap="round" opacity={0.5 + 0.3 * Math.sin(f / 25)}>
          <path d="M 392 1052 h 24 l -24 22 h 24" />
          <path d="M 424 1008 h 16 l -16 16 h 16" opacity={0.55} />
        </g>

        <g transform={`translate(655 1534) scale(1 ${chestScale}) translate(-655 -1534)`}>
          <rect x={320} y={1232} width={676} height={306} rx={88} fill={C.shirtDim} />
        </g>
        <rect x={240} y={1402} width={780} height={158} rx={56} fill="#6f5570" />
        <g stroke="#5d465f" strokeLinecap="round" fill="none">
          <path d="M 420 1470 H 860" strokeWidth={6} opacity={0.6} />
          <path d="M 380 1512 H 900" strokeWidth={6} opacity={0.4} />
        </g>

        <g>
          <ellipse cx={830} cy={1266} rx={56} ry={44} fill={C.skin} transform="rotate(-24 830 1266)" />
          {[0, 1, 2].map((k) => (
            <rect
              key={k}
              x={-15}
              y={-31}
              width={30}
              height={62}
              rx={12}
              fill={C.bandage}
              stroke={C.bandageEdge}
              strokeWidth={3}
              transform={`translate(${796 + k * 30} ${1252 + k * 10}) rotate(${34 + k * 10})`}
            />
          ))}
          <rect
            x={-17}
            y={-35}
            width={34}
            height={70}
            rx={12}
            fill={C.bandage}
            stroke={C.bandageEdge}
            strokeWidth={3}
            transform="translate(888 1286) rotate(-24)"
          />
          <rect x={829} y={1244} width={6} height={25} rx={3} fill={C.red} />
          <rect x={819} y={1253} width={26} height={6} rx={3} fill={C.red} />
        </g>

        <g transform={`translate(0 ${4 * breath})`}>
          <path d="M 560 1252 Q 466 1238 484 1178 Q 496 1146 542 1150" stroke={C.fur} strokeWidth={24} strokeLinecap="round" fill="none" />
          <circle cx={546} cy={1150} r={12} fill={C.furCream} />
          <circle cx={610} cy={1148} r={118} fill={C.fur} />
          <g stroke={C.furDark} strokeWidth={10} strokeLinecap="round" fill="none" opacity={0.5}>
            <path d="M 530 1074 q 60 -26 130 -6" />
            <path d="M 506 1130 q 84 -20 168 10" />
          </g>
          <g transform="rotate(-10 474 1092)">
            <path d="M 436 1046 L 424 994 L 470 1034 Z" fill={C.fur} />
            <path d="M 440 1040 L 434 1008 L 462 1032 Z" fill={C.furCream} />
            <path d="M 486 1040 L 516 992 L 522 1046 Z" fill={C.fur} />
            <path d="M 492 1038 L 512 1004 L 514 1040 Z" fill={C.furCream} />
            <circle cx={474} cy={1092} r={57} fill={C.fur} />
            <path d="M 446 1086 q 9 9 19 2" stroke="#4a2f1c" strokeWidth={4.5} strokeLinecap="round" fill="none" />
            <path d="M 490 1082 q 9 9 19 2" stroke="#4a2f1c" strokeWidth={4.5} strokeLinecap="round" fill="none" />
            <path d="M 436 1100 L 428 1106 L 444 1106 Z" fill="#7a4a2f" />
            <path d="M 436 1114 q -4 7 -12 5" stroke="#7a4a2f" strokeWidth={4} strokeLinecap="round" fill="none" />
            <g stroke="#fff" strokeOpacity={0.6} strokeWidth={3} strokeLinecap="round">
              <line x1={410} y1={1100} x2={368} y2={1094} />
              <line x1={410} y1={1108} x2={370} y2={1116} />
            </g>
          </g>
          <g transform={`translate(0 ${pawBob})`}>
            <path d="M 688 1196 Q 740 1234 766 1246" stroke={C.fur} strokeWidth={34} strokeLinecap="round" fill="none" />
            <rect x={744} y={1224} width={54} height={42} rx={16} fill={C.fur} />
            <path d="M 762 1228 L 762 1240" stroke={C.furCream} strokeWidth={4} strokeLinecap="round" />
            <path d="M 776 1226 L 776 1238" stroke={C.furCream} strokeWidth={4} strokeLinecap="round" />
          </g>
        </g>

        {[0, 1].map((h) => {
          const t0 = 86 + h * 44;
          const p = clamp01((f - t0) / 46);
          return f > t0 && f < t0 + 46 ? (
            <path
              key={h}
              d="M 0 6 C -6 0 -12 -4 -12 -10 C -12 -16 -7 -18 -3 -15 L 0 -12 L 3 -15 C 7 -18 12 -16 12 -10 C 12 -4 6 0 0 6 Z"
              fill="#e2705f"
              opacity={0.9 * (1 - p)}
              transform={`translate(${556 + h * 26} ${1214 - 84 * p}) scale(${0.9 + p * 0.5})`}
            />
          ) : null;
        })}

        <rect x={0} y={0} width={W} height={H} fill="#ff9d5c" opacity={0.05} />
        <rect x={0} y={0} width={W} height={H} fill="url(#vin4)" />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: 60,
          right: 60,
          top: 656,
          textAlign: 'center',
          opacity: titleO,
          transform: `translateY(${titleY}px)`,
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontStyle: 'italic',
          fontWeight: 600,
          fontSize: 78,
          lineHeight: 1.32,
          letterSpacing: 1.5,
          color: '#ffe9cd',
          textShadow: '0 4px 28px rgba(255,196,110,0.45), 0 2px 8px rgba(16,8,26,0.6)',
        }}
      >
        Some apologies
        <br />
        don’t need words.
      </div>
    </SceneShell>
  );
};

export const MaxAndTheMoment: FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#0d0a12' }}>
    <Sequence durationInFrames={SCENE}>
      <Scene1 />
    </Sequence>
    <Sequence from={SCENE} durationInFrames={SCENE}>
      <Scene2 />
    </Sequence>
    <Sequence from={SCENE * 2} durationInFrames={SCENE}>
      <Scene3 />
    </Sequence>
    <Sequence from={SCENE * 3} durationInFrames={SCENE}>
      <Scene4 />
    </Sequence>
  </AbsoluteFill>
);

export const RemotionRoot: FC = () => (
  <Composition
    id="MaxAndTheMoment"
    component={MaxAndTheMoment}
    durationInFrames={DURATION}
    fps={FPS}
    width={W}
    height={H}
  />
);

export const Root = RemotionRoot;
