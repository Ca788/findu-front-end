import type { BoxIllustration, BoxMotion } from '@/features/boxes/constants/boxCatalog';

const SIZE = 256;
const CENTER = SIZE / 2;
const IMAGE_SIZE = 512;
const FPS = 30;

const EASE_IN_OUT = { i: { x: [0.42], y: [1] }, o: { x: [0.58], y: [0] } };
const EASE_IN_OUT_3D = { i: { x: [0.42, 0.42, 0.42], y: [1, 1, 1] }, o: { x: [0.58, 0.58, 0.58], y: [0, 0, 0] } };

type Keyframe = { t: number; s: number[]; i?: unknown; o?: unknown };

function loop(frames: number, values: number[][], ease: typeof EASE_IN_OUT | typeof EASE_IN_OUT_3D): Keyframe[] {
  const step = frames / (values.length - 1);
  return values.map((s, index) => ({
    t: Math.round(index * step),
    s,
    ...(index < values.length - 1 ? ease : {}),
  }));
}

interface MotionSpec {
  frames: number;
  position: Keyframe[];
  rotation: Keyframe[];
  scale: Keyframe[];
  shadow: Keyframe[];
}

function motionSpec(motion: BoxMotion): MotionSpec {
  switch (motion) {
    case 'float':
      return {
        frames: 90,
        position: loop(90, [[CENTER, CENTER, 0], [CENTER, CENTER - 12, 0], [CENTER, CENTER, 0]], EASE_IN_OUT_3D),
        rotation: loop(90, [[-3], [3], [-3]], EASE_IN_OUT),
        scale: loop(90, [[46, 46, 100], [46, 46, 100]], EASE_IN_OUT_3D),
        shadow: loop(90, [[100, 100, 100], [78, 78, 100], [100, 100, 100]], EASE_IN_OUT_3D),
      };
    case 'pulse':
      return {
        frames: 60,
        position: loop(60, [[CENTER, CENTER, 0], [CENTER, CENTER, 0]], EASE_IN_OUT_3D),
        rotation: loop(60, [[0], [0]], EASE_IN_OUT),
        scale: loop(60, [[46, 46, 100], [50, 50, 100], [46, 46, 100]], EASE_IN_OUT_3D),
        shadow: loop(60, [[100, 100, 100], [108, 108, 100], [100, 100, 100]], EASE_IN_OUT_3D),
      };
    case 'wiggle':
      return {
        frames: 50,
        position: loop(50, [[CENTER, CENTER, 0], [CENTER, CENTER, 0]], EASE_IN_OUT_3D),
        rotation: loop(50, [[-7], [7], [-7]], EASE_IN_OUT),
        scale: loop(50, [[46, 46, 100], [46, 46, 100]], EASE_IN_OUT_3D),
        shadow: loop(50, [[100, 100, 100], [100, 100, 100]], EASE_IN_OUT_3D),
      };
    case 'bounce':
      return {
        frames: 54,
        position: loop(54, [[CENTER, CENTER, 0], [CENTER, CENTER - 22, 0], [CENTER, CENTER, 0]], EASE_IN_OUT_3D),
        rotation: loop(54, [[0], [0]], EASE_IN_OUT),
        scale: loop(54, [[48, 44, 100], [44, 48, 100], [48, 44, 100]], EASE_IN_OUT_3D),
        shadow: loop(54, [[100, 100, 100], [70, 70, 100], [100, 100, 100]], EASE_IN_OUT_3D),
      };
    default: {
      const exhaustive: never = motion;
      return exhaustive;
    }
  }
}

export function buildBoxAnimation(illustration: BoxIllustration) {
  const spec = motionSpec(illustration.motion);
  const lastSlash = illustration.src.lastIndexOf('/') + 1;

  return {
    v: '5.7.4',
    fr: FPS,
    ip: 0,
    op: spec.frames,
    w: SIZE,
    h: SIZE,
    nm: `box-${illustration.key}`,
    ddd: 0,
    assets: [
      {
        id: 'illustration',
        w: IMAGE_SIZE,
        h: IMAGE_SIZE,
        u: illustration.src.slice(0, lastSlash),
        p: illustration.src.slice(lastSlash),
        e: 0,
      },
    ],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 2,
        nm: 'illustration',
        refId: 'illustration',
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 1, k: spec.rotation },
          p: { a: 1, k: spec.position },
          a: { a: 0, k: [IMAGE_SIZE / 2, IMAGE_SIZE / 2, 0] },
          s: { a: 1, k: spec.scale },
        },
        ao: 0,
        ip: 0,
        op: spec.frames,
        st: 0,
        bm: 0,
      },
      {
        ddd: 0,
        ind: 2,
        ty: 4,
        nm: 'shadow',
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [CENTER, SIZE - 22, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 1, k: spec.shadow },
        },
        ao: 0,
        shapes: [
          {
            ty: 'gr',
            nm: 'shadow-group',
            it: [
              { ty: 'el', nm: 'ellipse', p: { a: 0, k: [0, 0] }, s: { a: 0, k: [120, 22] } },
              { ty: 'fl', nm: 'fill', c: { a: 0, k: [0, 0, 0, 1] }, o: { a: 0, k: 14 }, r: 1 },
              {
                ty: 'tr',
                p: { a: 0, k: [0, 0] },
                a: { a: 0, k: [0, 0] },
                s: { a: 0, k: [100, 100] },
                r: { a: 0, k: 0 },
                o: { a: 0, k: 100 },
                sk: { a: 0, k: 0 },
                sa: { a: 0, k: 0 },
              },
            ],
          },
        ],
        ip: 0,
        op: spec.frames,
        st: 0,
        bm: 0,
      },
    ],
  };
}
