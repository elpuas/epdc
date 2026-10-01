export type NeuralPoint = readonly [number, number];
export type NeuralEdge = readonly [number, number, 'cyan' | 'lime'];

export type FormationProfile = {
  parent: 'hero' | string;
  branchBend: number;
  seed: number;
  phase: number;
  drift: number;
  signalDirection: 1 | -1;
  pulse: number;
  thresholdOffset: number;
  nodes: readonly NeuralPoint[];
  edges: readonly NeuralEdge[];
  anchors: readonly number[];
  signals: readonly number[];
};

export type FormationDepthShape = {
  nodes: readonly NeuralPoint[];
  edges: readonly NeuralEdge[];
  anchors: readonly number[];
  signals: readonly number[];
};

// The quieter planes follow branching paths rather than repeating the
// foreground icon. Some distant traces deliberately stop as partial clusters.
export function getFormationDepthShape(profile: FormationProfile, plane: 'midground' | 'background'): FormationDepthShape {
  let seed = profile.seed + (plane === 'midground' ? 207 : 409);
  const next = () => {
    const value = Math.sin(seed++) * 10000;
    return value - Math.floor(value);
  };
  const midground = plane === 'midground';
  const template: NeuralPoint[] = midground
    ? [[-.60,-.20],[-.42,-.08],[-.21,-.14],[-.01,-.28],[.18,-.42],[-.13,.11],[.08,.22],[.29,.12],[.48,.25],[.70,.10],[.25,.47],[.52,.61]]
    : [[-.85,-.10],[-.55,-.27],[-.27,-.18],[-.04,-.40],[.25,-.54],[-.52,.18],[-.22,.39],[.11,.33],[.43,.48],[.78,.38],[.58,.77],[.93,.94]];
  const spread = midground ? 1.2 : 1.55;
  const tilt = Math.sin(profile.phase * 1.8 + (midground ? 0 : .9)) * .22;
  const direction = profile.signalDirection;
  const [centerX, centerY] = profile.nodes[0];
  const nodes: NeuralPoint[] = template.map(([relativeX, relativeY]) => [
    centerX + relativeX * spread * direction + relativeY * tilt + (next() - .5) * .08,
    centerY + relativeY * spread * .76 + relativeX * tilt * .55 + (next() - .5) * .08,
  ]);
  const branches: readonly (readonly [number, number])[] = midground
    ? [[0,1],[1,2],[2,3],[3,4],[2,5],[5,6],[7,8],[8,9],[7,10],[10,11]]
    : [[0,1],[1,2],[2,3],[1,5],[5,6],[6,7],[9,10],[10,11]];
  const edges: NeuralEdge[] = branches.map(([from, to], index) => [from, to, midground && index === 7 ? 'lime' : 'cyan']);
  return { nodes, edges, anchors: midground ? [2, 7] : [], signals: midground ? [4, 7] : [] };
}

// Every edge grows from an established node. This order makes the same
// topology useful for the scroll sequence and for the static SVG fallback.
export const formationProfiles: Record<string, FormationProfile> = {
  build: {
    parent: 'hero', branchBend: 135, seed: 17, phase: 0.2, drift: 0.042, signalDirection: 1, pulse: 0.74, thresholdOffset: -0.035,
    nodes: [[.42,.55],[.3,.42],[.18,.28],[.08,.18],[.23,.12],[.54,.37],[.67,.2],[.82,.12],[.72,.43],[.55,.68],[.7,.79],[.88,.89],[.39,.82],[.22,.94]],
    edges: [[0,1,'cyan'],[1,2,'cyan'],[2,3,'cyan'],[2,4,'lime'],[0,5,'lime'],[5,6,'cyan'],[6,7,'cyan'],[5,8,'cyan'],[1,9,'cyan'],[9,10,'lime'],[10,11,'cyan'],[9,12,'cyan'],[12,13,'cyan']],
    anchors: [0, 5], signals: [0, 4, 9],
  },
  sell: {
    parent: 'build', branchBend: -95, seed: 31, phase: 1.45, drift: 0.037, signalDirection: -1, pulse: 0.61, thresholdOffset: .028,
    nodes: [[.49,.5],[.34,.36],[.22,.21],[.09,.27],[.32,.12],[.62,.32],[.76,.16],[.9,.25],[.72,.48],[.83,.69],[.93,.82],[.56,.72],[.45,.9],[.25,.79]],
    edges: [[0,1,'cyan'],[1,2,'lime'],[2,3,'cyan'],[2,4,'cyan'],[0,5,'cyan'],[5,6,'lime'],[6,7,'cyan'],[5,8,'cyan'],[8,9,'cyan'],[9,10,'lime'],[8,11,'lime'],[11,12,'cyan'],[11,13,'cyan']],
    anchors: [0, 8], signals: [1, 5, 10],
  },
  care: {
    parent: 'build', branchBend: 120, seed: 47, phase: 2.87, drift: 0.031, signalDirection: 1, pulse: 0.49, thresholdOffset: -.014,
    nodes: [[.45,.48],[.32,.32],[.22,.15],[.08,.23],[.17,.46],[.59,.29],[.7,.13],[.85,.2],[.75,.42],[.58,.65],[.71,.8],[.91,.77],[.43,.84],[.28,.95]],
    edges: [[0,1,'cyan'],[1,2,'cyan'],[2,3,'lime'],[2,4,'cyan'],[0,5,'lime'],[5,6,'cyan'],[6,7,'cyan'],[5,8,'cyan'],[1,9,'cyan'],[9,10,'lime'],[10,11,'cyan'],[9,12,'cyan'],[12,13,'cyan']],
    anchors: [0, 9], signals: [0, 5, 9],
  },
  partner: {
    parent: 'care', branchBend: -105, seed: 61, phase: 4.16, drift: 0.045, signalDirection: -1, pulse: 0.67, thresholdOffset: .04,
    nodes: [[.48,.52],[.29,.41],[.17,.21],[.07,.41],[.27,.68],[.17,.88],[.62,.38],[.74,.18],[.92,.28],[.78,.54],[.64,.73],[.8,.88],[.47,.92],[.4,.15]],
    edges: [[0,1,'lime'],[1,2,'cyan'],[2,3,'cyan'],[1,4,'cyan'],[4,5,'lime'],[0,6,'cyan'],[6,7,'cyan'],[7,8,'lime'],[6,9,'cyan'],[9,10,'cyan'],[10,11,'lime'],[10,12,'cyan'],[6,13,'cyan']],
    anchors: [0, 6], signals: [0, 6, 10],
  },
  nuara: {
    parent: 'partner', branchBend: 150, seed: 83, phase: 5.72, drift: 0.025, signalDirection: 1, pulse: 0.44, thresholdOffset: -.015,
    nodes: [[.48,.17],[.39,.25],[.27,.32],[.14,.28],[.07,.41],[.38,.43],[.48,.55],[.38,.72],[.23,.79],[.1,.91],[.61,.32],[.74,.24],[.87,.32],[.92,.48],[.72,.52],[.62,.66],[.77,.78],[.91,.86]],
    edges: [[0,1,'cyan'],[1,2,'cyan'],[2,3,'cyan'],[3,4,'lime'],[1,5,'cyan'],[5,6,'cyan'],[6,7,'lime'],[7,8,'cyan'],[8,9,'cyan'],[0,10,'cyan'],[10,11,'cyan'],[11,12,'lime'],[12,13,'cyan'],[10,14,'cyan'],[14,15,'cyan'],[15,16,'lime'],[16,17,'cyan']],
    anchors: [0, 6, 14], signals: [0, 6, 10, 15],
  },
};
