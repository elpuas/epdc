import { heroBackground, heroForeground, heroMidground, type HeroNode } from '../data/neuralHeroGraph';
import { formationProfiles, getFormationDepthShape, type NeuralPoint } from '../data/neuralJourneyFormations';
import type { Object3D } from 'three';

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (start: number, end: number, value: number) => {
  const progress = clamp((value - start) / (end - start));
  return progress * progress * (3 - 2 * progress);
};
const random = (seed: number) => () => {
  const value = Math.sin(seed++) * 10000;
  return value - Math.floor(value);
};

type Position = readonly [number, number, number];
type Edge = readonly [number, number, 'cyan' | 'lime' | 'bridge'];
type Plane = 'foreground' | 'midground' | 'background';
type GraphShape = { nodes: readonly (NeuralPoint | HeroNode)[]; edges: readonly Edge[]; anchors: readonly number[]; signals: readonly number[] };
type GraphOptions = { plane: Plane; pointSize: number; anchorSize: number; signalSize: number; pointOpacity: number; lineOpacity: number; intensity: number; signalSpeed: number; signalDirection?: 1 | -1; driftPx?: number; seed: number; mobileLimit?: number };

const planeZ: Record<Plane, number> = { foreground: 0, midground: -1.25, background: -2.45 };
const colorFor = (name: Edge[2]): Position => name === 'lime' ? [.85, 1, 0] : name === 'bridge' ? [.05, .35, .34] : [0, 1, .95];

const curvePoint = (from: Position, to: Position, bend: number, progress: number): Position => {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const length = Math.max(1, Math.hypot(dx, dy));
  const controlX = (from[0] + to[0]) / 2 - dy / length * bend;
  const controlY = (from[1] + to[1]) / 2 + dx / length * bend;
  const inverse = 1 - progress;
  return [inverse * inverse * from[0] + 2 * inverse * progress * controlX + progress * progress * to[0], inverse * inverse * from[1] + 2 * inverse * progress * controlY + progress * progress * to[1], from[2]];
};

export async function mountNeuralJourney(root: HTMLElement) {
  const canvas = root.querySelector<HTMLCanvasElement>('[data-neural-canvas]');
  const hero = root.querySelector<HTMLElement>('[data-journey-hero]');
  const cards = [...root.querySelectorAll<HTMLElement>('[data-neural-formation]')];
  if (!canvas || !hero || !cards.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches) {
    reduced.addEventListener('change', () => { if (!reduced.matches) void mountNeuralJourney(root); }, { once: true });
    return;
  }

  try {
    if (!canvas.getContext('webgl2')) return;
  } catch {
    return;
  }

  try {
    const THREE = await import('three');
    if (reduced.matches) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(0, 1, 0, 1, -10, 10);
    camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setClearColor(0x000000, 0);

    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = glowCanvas.height = 64;
    const glowContext = glowCanvas.getContext('2d');
    if (glowContext) {
      const gradient = glowContext.createRadialGradient(32, 32, 1, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255,255,255,.9)');
      gradient.addColorStop(.2, 'rgba(0,255,243,.45)');
      gradient.addColorStop(1, 'rgba(0,255,243,0)');
      glowContext.fillStyle = gradient;
      glowContext.fillRect(0, 0, 64, 64);
    }
    const glowTexture = new THREE.CanvasTexture(glowCanvas);
    const mobile = window.matchMedia('(max-width: 767px)');
    const finePointer = window.matchMedia('(pointer: fine)');
    const pointerTarget = new THREE.Vector2();
    const pointerCurrent = new THREE.Vector2();
    const addDynamic = <T extends Object3D>(object: T): T => {
      // These buffers move with scroll after their first render. Their initial
      // bounding spheres cannot be used for later frustum culling.
      object.frustumCulled = false;
      scene.add(object);
      return object;
    };

    // A graph owns geometry and materials; its placement and birth state are
    // supplied by a section profile. Later sections can use the same contract.
    const createGraph = (shape: GraphShape, options: GraphOptions) => {
      const limit = shape.nodes.length;
      const edges = shape.edges;
      const anchors = shape.anchors;
      const signalEdges = shape.signals.filter((index) => edges[index]);
      const rng = random(options.seed);
      const phases = Array.from({ length: limit }, () => rng() * Math.PI * 2);
      const speeds = Array.from({ length: limit }, () => [.66 + rng() * .55, .58 + rng() * .48]);
      const positions: Position[] = Array.from({ length: limit }, () => [0, 0, planeZ[options.plane]]);

      const pointPositions = new Float32Array(limit * 3);
      const pointColors = new Float32Array(limit * 3);
      const pointGeometry = new THREE.BufferGeometry();
      pointGeometry.setAttribute('position', new THREE.BufferAttribute(pointPositions, 3));
      pointGeometry.setAttribute('color', new THREE.BufferAttribute(pointColors, 3));
      const pointMaterial = new THREE.PointsMaterial({ vertexColors: true, size: options.pointSize, transparent: true, opacity: options.pointOpacity, sizeAttenuation: false, depthWrite: false });
      addDynamic(new THREE.Points(pointGeometry, pointMaterial));

      const segmentCount = 4;
      const linePositions = new Float32Array(edges.length * segmentCount * 6);
      const lineColors = new Float32Array(linePositions.length);
      const lineGeometry = new THREE.BufferGeometry();
      lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
      lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
      const lineMaterial = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: options.lineOpacity, depthWrite: false });
      addDynamic(new THREE.LineSegments(lineGeometry, lineMaterial));

      const anchorPositions = new Float32Array(anchors.length * 3);
      const anchorColors = new Float32Array(anchors.length * 3);
      const anchorGeometry = new THREE.BufferGeometry();
      anchorGeometry.setAttribute('position', new THREE.BufferAttribute(anchorPositions, 3));
      anchorGeometry.setAttribute('color', new THREE.BufferAttribute(anchorColors, 3));
      const anchorMaterial = new THREE.PointsMaterial({ vertexColors: true, size: options.anchorSize, transparent: true, opacity: .9, sizeAttenuation: false, blending: THREE.AdditiveBlending, depthWrite: false });
      addDynamic(new THREE.Points(anchorGeometry, anchorMaterial));
      const glows = options.plane === 'foreground' ? anchors.map((_, index) => {
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture, color: index % 2 ? 0xd8ff00 : 0x00fff3, transparent: true, opacity: .2, depthWrite: false, blending: THREE.AdditiveBlending }));
        sprite.scale.set(options.anchorSize * 6, options.anchorSize * 6, 1);
        addDynamic(sprite);
        return sprite;
      }) : [];

      const signalPositions = new Float32Array(signalEdges.length * 3);
      const signalColors = new Float32Array(signalEdges.length * 3);
      const signalGeometry = new THREE.BufferGeometry();
      signalGeometry.setAttribute('position', new THREE.BufferAttribute(signalPositions, 3));
      signalGeometry.setAttribute('color', new THREE.BufferAttribute(signalColors, 3));
      const signalMaterial = new THREE.PointsMaterial({ vertexColors: true, size: options.signalSize, transparent: true, opacity: .9, sizeAttenuation: false, blending: THREE.AdditiveBlending, depthWrite: false });
      if (signalEdges.length) addDynamic(new THREE.Points(signalGeometry, signalMaterial));

      const update = (time: number, progress: number, locate: (index: number) => Position, pulse: number) => {
        const activeLimit = mobile.matches ? Math.min(options.mobileLimit ?? limit, limit) : limit;
        for (let index = 0; index < limit; index++) {
          const target = locate(index);
          const drift = mobile.matches ? .35 : 1;
          const x = target[0] + Math.sin(time * speeds[index][0] + phases[index]) * (options.driftPx ?? options.intensity * 4) * drift;
          const y = target[1] + Math.cos(time * speeds[index][1] + phases[index]) * (options.driftPx ?? options.intensity * 4) * drift * .75;
          positions[index] = [x, y, target[2]];
          pointPositions.set([x, y, target[2]], index * 3);
          const birth = index >= activeLimit ? 0 : index === 0 ? smooth(0, .22, progress) : smooth(.08 + index / limit * .48, .25 + index / limit * .5, progress);
          const brightness = options.intensity * birth;
          pointColors.set([0, brightness, brightness * .95], index * 3);
        }

        edges.forEach(([from, to, colorName], edgeIndex) => {
          const birth = from >= activeLimit || to >= activeLimit ? 0 : clamp((progress - edgeIndex / edges.length * .52) / .42);
          const color = colorFor(colorName);
          const distance = Math.hypot(positions[to][0] - positions[from][0], positions[to][1] - positions[from][1]);
          const bend = Math.min(15, distance * .085) * (edgeIndex % 2 ? -1 : 1);
          for (let segment = 0; segment < segmentCount; segment++) {
            const fromPoint = curvePoint(positions[from], positions[to], bend, segment / segmentCount * birth);
            const toPoint = curvePoint(positions[from], positions[to], bend, (segment + 1) / segmentCount * birth);
            const offset = (edgeIndex * segmentCount + segment) * 6;
            linePositions.set([...fromPoint, ...toPoint], offset);
            const intensity = options.intensity * smooth(0, .16, birth);
            lineColors.set([color[0] * intensity, color[1] * intensity, color[2] * intensity, color[0] * intensity, color[1] * intensity, color[2] * intensity], offset);
          }
        });

        anchors.forEach((nodeIndex, index) => {
          const position = positions[nodeIndex];
          anchorPositions.set(position, index * 3);
          const birth = nodeIndex >= activeLimit ? 0 : smooth(.1, .45, progress);
          const color = index % 2 ? [.85, 1, 0] : [0, 1, .95];
          anchorColors.set(color.map((channel) => channel * birth * options.intensity), index * 3);
          if (glows[index]) {
            glows[index].position.set(...position);
            glows[index].material.opacity = birth * (.13 + (Math.sin(time * pulse + index * 1.35) + 1) * .06);
          }
        });

        signalEdges.forEach((edgeIndex, index) => {
          const [from, to, colorName] = edges[edgeIndex];
          const distance = Math.hypot(positions[to][0] - positions[from][0], positions[to][1] - positions[from][1]);
          const bend = Math.min(15, distance * .085) * (edgeIndex % 2 ? -1 : 1);
          const travel = time * options.signalSpeed * (options.signalDirection ?? 1) + index * .37 + options.seed * .013;
          const position = curvePoint(positions[from], positions[to], bend, ((travel % 1) + 1) % 1);
          signalPositions.set(position, index * 3);
          const brightness = (mobile.matches && index > 0) || from >= activeLimit || to >= activeLimit ? 0 : options.intensity * smooth(.58, .83, progress);
          const color = colorFor(colorName);
          signalColors.set([color[0] * brightness, color[1] * brightness, color[2] * brightness], index * 3);
        });

        pointGeometry.attributes.position.needsUpdate = true;
        pointGeometry.attributes.color.needsUpdate = true;
        lineGeometry.attributes.position.needsUpdate = true;
        lineGeometry.attributes.color.needsUpdate = true;
        anchorGeometry.attributes.position.needsUpdate = true;
        anchorGeometry.attributes.color.needsUpdate = true;
        if (signalEdges.length) {
          signalGeometry.attributes.position.needsUpdate = true;
          signalGeometry.attributes.color.needsUpdate = true;
        }
      };

      return { update, positions };
    };

    const heroGraphs = [
      createGraph({ ...heroForeground, signals: heroForeground.signals.map((source) => heroForeground.edges.findIndex(([from]) => from === source)) }, { plane: 'foreground', pointSize: 4.6, anchorSize: 8, signalSize: 5.5, pointOpacity: .84, lineOpacity: .54, intensity: 1, signalSpeed: .17, seed: 7, mobileLimit: 21 }),
      createGraph({ ...heroMidground, signals: heroMidground.signals.map((source) => heroMidground.edges.findIndex(([from]) => from === source)) }, { plane: 'midground', pointSize: 4.3, anchorSize: 0, signalSize: 4.2, pointOpacity: .75, lineOpacity: .58, intensity: .75, signalSpeed: .065, seed: 19, mobileLimit: 14 }),
      createGraph(heroBackground, { plane: 'background', pointSize: 3.3, anchorSize: 0, signalSize: 0, pointOpacity: .45, lineOpacity: .32, intensity: .58, signalSpeed: 0, seed: 29, mobileLimit: 10 }),
    ];

    const formations = cards.map((card) => {
      const profile = formationProfiles[card.dataset.neuralFormation || 'build'];
      const isProject = card.hasAttribute('data-neural-project');
      const visual = card.querySelector<HTMLElement>('[data-neural-visual]')!;
      const title = card.querySelector<HTMLElement>('[data-neural-title]')!;
      const copy = card.querySelector<HTMLElement>('[data-neural-copy]')!;
      const midShape = getFormationDepthShape(profile, 'midground');
      const backgroundShape = getFormationDepthShape(profile, 'background');
      const foreground = createGraph(profile, { plane: 'foreground', pointSize: 4.1, anchorSize: 7.5, signalSize: 5.5, pointOpacity: .86, lineOpacity: isProject ? .4 : .57, intensity: isProject ? .72 : 1, signalSpeed: .12 + profile.phase * .012, signalDirection: profile.signalDirection, driftPx: profile.drift * 100, seed: profile.seed, mobileLimit: isProject ? 12 : 9 });
      const midground = createGraph(midShape, { plane: 'midground', pointSize: 3.1, anchorSize: 4.5, signalSize: 3.6, pointOpacity: .52, lineOpacity: .29, intensity: isProject ? .38 : .5, signalSpeed: .07 + profile.phase * .006, signalDirection: profile.signalDirection, driftPx: profile.drift * 55, seed: profile.seed + 107, mobileLimit: 6 });
      const background = createGraph(backgroundShape, { plane: 'background', pointSize: 2.5, anchorSize: 0, signalSize: 0, pointOpacity: .3, lineOpacity: .19, intensity: isProject ? .25 : .34, signalSpeed: 0, driftPx: profile.drift * 25, seed: profile.seed + 211, mobileLimit: 5 });
      return { card, visual, title, copy, profile, foreground, midground, background, midShape, backgroundShape, bounds: visual.getBoundingClientRect(), progress: 0 };
    });

    // The bridge shares hero and service anchor positions, so it is physically
    // one graph across the boundary rather than a crossfade between scenes.
    const bridges = formations.map((formation, to) => ({
      from: formation.profile.parent === 'hero' ? -1 : formations.findIndex((candidate) => candidate.card.dataset.neuralFormation === formation.profile.parent),
      to,
      bend: formation.profile.branchBend,
    }));
    const bridgeLayers = (['background', 'midground', 'foreground'] as const).map((plane) => {
      const segments = 15;
      const positions = new Float32Array(bridges.length * segments * 6);
      const colors = new Float32Array(positions.length);
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      const lineOpacity = plane === 'foreground' ? .36 : plane === 'midground' ? .24 : .15;
      const lineMaterial = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: lineOpacity * (mobile.matches ? .68 : 1), depthWrite: false });
      addDynamic(new THREE.LineSegments(geometry, lineMaterial));
      const nodePositions = new Float32Array(bridges.length * 3 * 3);
      const nodeColors = new Float32Array(nodePositions.length);
      const nodeGeometry = new THREE.BufferGeometry();
      nodeGeometry.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
      nodeGeometry.setAttribute('color', new THREE.BufferAttribute(nodeColors, 3));
      addDynamic(new THREE.Points(nodeGeometry, new THREE.PointsMaterial({ vertexColors: true, size: plane === 'foreground' ? 3.5 : 2.5, transparent: true, opacity: .7, sizeAttenuation: false, depthWrite: false })));
      const signalPositions = new Float32Array(plane === 'background' ? 0 : bridges.length * 3);
      const signalColors = new Float32Array(signalPositions.length);
      const signalGeometry = new THREE.BufferGeometry();
      signalGeometry.setAttribute('position', new THREE.BufferAttribute(signalPositions, 3));
      signalGeometry.setAttribute('color', new THREE.BufferAttribute(signalColors, 3));
      if (signalPositions.length) addDynamic(new THREE.Points(signalGeometry, new THREE.PointsMaterial({ vertexColors: true, size: plane === 'foreground' ? 5.4 : 3.7, transparent: true, opacity: .82, sizeAttenuation: false, blending: THREE.AdditiveBlending, depthWrite: false })));

      const update = (time: number, heroSource: Position) => {
        lineMaterial.opacity = lineOpacity * (mobile.matches ? .68 : 1);
        bridges.forEach(({ from, to, bend }, index) => {
          const destination = formations[to].foreground.positions[0];
          const origin = from < 0 ? heroSource : formations[from].foreground.positions[0];
          const depth = planeZ[plane];
          const offsetX = plane === 'foreground' ? 0 : plane === 'midground' ? 38 : -52;
          const offsetY = plane === 'foreground' ? 0 : plane === 'midground' ? -28 : 42;
          const source: Position = [origin[0] + offsetX, origin[1] + offsetY, depth];
          const target: Position = [destination[0] + offsetX, destination[1] + offsetY, depth];
          const progress = clamp((formations[to].progress + (plane === 'background' ? .2 : .13)) / (plane === 'foreground' ? .65 : .85));
          const intensity = plane === 'foreground' ? .72 : plane === 'midground' ? .47 : .28;
          for (let segment = 0; segment < segments; segment++) {
            const a = curvePoint(source, target, bend * (plane === 'foreground' ? 1 : plane === 'midground' ? .6 : 1.28), segment / segments * progress);
            const b = curvePoint(source, target, bend * (plane === 'foreground' ? 1 : plane === 'midground' ? .6 : 1.28), (segment + 1) / segments * progress);
            const offset = (index * segments + segment) * 6;
            positions.set([...a, ...b], offset);
            const fade = intensity * smooth(0, .16, progress);
            colors.set([0, fade, fade * .95, 0, fade, fade * .95], offset);
          }
          for (let node = 0; node < 3; node++) {
            const nodeProgress = (node + 1) / 4;
            const position = curvePoint(source, target, bend, Math.min(nodeProgress, progress));
            nodePositions.set(position, (index * 3 + node) * 3);
            const birth = smooth(nodeProgress - .08, nodeProgress + .02, progress) * intensity;
            nodeColors.set([0, birth, birth * .95], (index * 3 + node) * 3);
          }
          if (signalPositions.length) {
            const signal = curvePoint(source, target, bend, (time * (plane === 'foreground' ? .08 : .05) + index * .24) % 1);
            signalPositions.set(signal, index * 3);
            const birth = smooth(.73, .95, progress) * intensity;
            signalColors.set(index % 2 ? [.85 * birth, birth, 0] : [0, birth, birth * .95], index * 3);
          }
        });
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;
        nodeGeometry.attributes.position.needsUpdate = true;
        nodeGeometry.attributes.color.needsUpdate = true;
        if (signalPositions.length) {
          signalGeometry.attributes.position.needsUpdate = true;
          signalGeometry.attributes.color.needsUpdate = true;
        }
      };
      return { update };
    });

    let heroBounds = hero.getBoundingClientRect();
    let wrapperBounds = root.getBoundingClientRect();
    let viewportHeight = window.innerHeight;
    let measured = false;
    let active = false;
    let frame = 0;
    let lastScrollY = window.scrollY;

    const measure = () => {
      wrapperBounds = root.getBoundingClientRect();
      heroBounds = hero.getBoundingClientRect();
      viewportHeight = window.innerHeight;
      formations.forEach((formation) => {
        formation.bounds = formation.visual.getBoundingClientRect();
        formation.progress = clamp((viewportHeight * .95 - formation.bounds.top) / (viewportHeight * .7) + formation.profile.thresholdOffset);
        const title = smooth(.58, .77, formation.progress);
        const copy = smooth(.75, .95, formation.progress);
        formation.title.style.setProperty('--reveal-opacity', String(title));
        formation.title.style.setProperty('--reveal-rise', `${(1 - title) * 18}px`);
        formation.copy.style.setProperty('--reveal-opacity', String(copy));
        formation.copy.style.setProperty('--reveal-rise', `${(1 - copy) * 14}px`);
        if (formation.card.hasAttribute('data-neural-project')) {
          const image = formation.card.querySelector<HTMLElement>('[data-neural-project-image]');
          const details = formation.card.querySelector<HTMLElement>('[data-neural-project-details]');
          const imageReveal = smooth(.48, .76, formation.progress);
          const detailsReveal = smooth(.8, .98, formation.progress);
          image?.style.setProperty('--project-reveal-opacity', String(imageReveal));
          image?.style.setProperty('--project-reveal-rise', `${(1 - imageReveal) * 24}px`);
          details?.style.setProperty('--project-reveal-opacity', String(detailsReveal));
          details?.style.setProperty('--project-reveal-rise', `${(1 - detailsReveal) * 12}px`);
        }
      });
      const width = Math.max(1, Math.round(wrapperBounds.width));
      const height = Math.max(1, Math.round(viewportHeight));
      if (canvas.width !== Math.round(width * renderer.getPixelRatio()) || canvas.height !== Math.round(height * renderer.getPixelRatio())) {
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile.matches ? 1 : 1.35));
        renderer.setSize(width, height, false);
        camera.right = width;
        camera.bottom = height;
        camera.updateProjectionMatrix();
      }
      canvas.style.left = `${wrapperBounds.left}px`;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      measured = true;
    };

    const heroPosition = (node: HeroNode, time: number, index: number, plane: Plane): Position => {
      const scale = plane === 'background' ? 1.2 : 1;
      const z = node[2] * scale;
      const factor = heroBounds.height / (2 * Math.tan(24 * Math.PI / 180) * (7 - z));
      const drift = plane === 'foreground' ? 1 : plane === 'midground' ? .52 : .24;
      const parallax = plane === 'foreground' ? 9 : plane === 'midground' ? -3.3 : 0;
      const x = heroBounds.left - wrapperBounds.left + heroBounds.width / 2 + node[0] * scale * factor * (mobile.matches ? .55 : 1) + Math.sin(time * (.035 + index * .001) + index) * 9 * drift + pointerCurrent.x * parallax;
      const y = heroBounds.top + heroBounds.height / 2 - node[1] * scale * factor + Math.cos(time * (.038 + index * .001) + index) * 6 * drift + pointerCurrent.y * parallax;
      return [x, y, planeZ[plane]];
    };

    const servicePosition = (formation: typeof formations[number], point: NeuralPoint, plane: Plane): Position => {
      const parallax = plane === 'foreground' ? 3.4 : plane === 'midground' ? -1.7 : 0;
      const x = formation.bounds.left - wrapperBounds.left + point[0] * formation.bounds.width + pointerCurrent.x * parallax;
      const y = formation.bounds.top + point[1] * formation.bounds.height + pointerCurrent.y * parallax;
      return [x, y, planeZ[plane]];
    };

    const render = (now: number) => {
      if (!active || document.hidden || reduced.matches) { frame = 0; return; }
      if (!measured || window.scrollY !== lastScrollY) { measure(); lastScrollY = window.scrollY; }
      const time = now / 1000;
      pointerCurrent.lerp(pointerTarget, mobile.matches ? .01 : .018);
      heroGraphs[0].update(time, 1, (index) => heroPosition(heroForeground.nodes[index], time, index, 'foreground'), .72);
      heroGraphs[1].update(time * .7, 1, (index) => heroPosition(heroMidground.nodes[index], time, index, 'midground'), .48);
      heroGraphs[2].update(time * .4, 1, (index) => heroPosition(heroBackground.nodes[index], time, index, 'background'), .3);
      formations.forEach((formation) => {
        const { profile, progress } = formation;
        formation.foreground.update(time + profile.phase, progress, (index) => servicePosition(formation, profile.nodes[index], 'foreground'), profile.pulse);
        formation.midground.update(time * .65 + profile.phase, clamp((progress + .05) / 1.02), (index) => servicePosition(formation, formation.midShape.nodes[index], 'midground'), profile.pulse * .7);
        formation.background.update(time * .37 + profile.phase, clamp((progress + .12) / 1.08), (index) => servicePosition(formation, formation.backgroundShape.nodes[index], 'background'), profile.pulse * .4);
      });
      bridgeLayers.forEach((layer) => layer.update(time, heroGraphs[0].positions[Math.min(22, heroGraphs[0].positions.length - 1)]));
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(render);
    };

    const start = () => {
      if (active && !document.hidden && !reduced.matches && !frame) frame = window.requestAnimationFrame(render);
    };
    const observer = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      if (active) { measured = false; start(); }
      else if (frame) { window.cancelAnimationFrame(frame); frame = 0; }
      root.dataset.neuralActive = String(active);
    }, { rootMargin: '120px 0px', threshold: 0 });
    observer.observe(root);

    const markDirty = () => { measured = false; start(); };
    const resizeObserver = new ResizeObserver(markDirty);
    resizeObserver.observe(root);
    resizeObserver.observe(hero);
    formations.forEach((formation) => resizeObserver.observe(formation.visual));
    window.addEventListener('scroll', markDirty, { passive: true });
    window.addEventListener('resize', markDirty, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && frame) { window.cancelAnimationFrame(frame); frame = 0; }
      else if (!document.hidden) { measured = false; start(); }
    });
    if (finePointer.matches) {
      window.addEventListener('pointermove', (event) => {
        pointerTarget.set((event.clientX / window.innerWidth - .5) * 2, (event.clientY / window.innerHeight - .5) * 2);
      }, { passive: true });
    }
    reduced.addEventListener('change', () => {
      if (reduced.matches) {
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
        root.removeAttribute('data-neural-enhanced');
      } else {
        root.dataset.neuralEnhanced = 'true';
        measured = false;
        start();
      }
    });

    measure();
    root.dataset.neuralEnhanced = 'true';
    start();
  } catch {
    root.removeAttribute('data-neural-enhanced');
  }
}
