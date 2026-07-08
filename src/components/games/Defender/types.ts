export interface Bullet {
  active: boolean;
  owner: BulletOwner;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export interface Enemy {
  active: boolean;
  kind: EnemyKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  wobble: number;
  phase: number;
  age: number;
  baseY: number;
  direction: number;
  health: number;
  targetCivilian: number;
  carryingCivilian: boolean;
}

export interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  direction: number;
  radius: number;
  invulnerable: number;
  bank: number;
  enginePulse: number;
}

export interface Star {
  x: number;
  y: number;
  speed: number;
  radius: number;
  alpha: number;
  layer: number;
  hue: number;
  streak: boolean;
}

export interface Civilian {
  active: boolean;
  x: number;
  y: number;
  baseX: number;
  phase: number;
  carriedBy: number;
}

export type BulletOwner = 'player' | 'enemy';
export type EnemyKind = 'lander' | 'bomber' | 'pod' | 'swarmer' | 'baiter' | 'mutant' | 'groundTurret';
