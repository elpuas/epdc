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
}

export interface Player {
  x: number;
  y: number;
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

export type BulletOwner = 'player' | 'enemy';
export type EnemyKind = 'lander' | 'saucer' | 'hunter' | 'walker' | 'pod' | 'bomber';
