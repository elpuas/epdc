import { ArcadeAudio } from '../shared/Audio';
import { CollisionSystem } from '../shared/Collision';
import { GameLoop } from '../shared/GameLoop';
import { Input, type InputVector } from '../shared/Input';
import { ParticlePool } from '../shared/Particles';
import {
  BULLET_COOLDOWN_SECONDS,
  BULLET_POOL_SIZE,
  BULLET_SPEED,
  ENEMY_BASE_SPEED,
  ENEMY_POOL_SIZE,
  ENEMY_SPAWN_SECONDS,
  GAME_HEIGHT,
  GAME_WIDTH,
  MAX_LIVES,
  PARTICLE_POOL_SIZE,
  PLAYER_INVULNERABLE_SECONDS,
  PLAYER_RADIUS,
  PLAYER_SPEED,
  STAR_COUNT,
} from './constants';
import { DefenderRenderer } from './Renderer';
import type { Bullet, Enemy, EnemyKind, Player, Star } from './types';

export interface DefenderOptions {
  autoplay: boolean;
  showHUD: boolean;
  showControls: boolean;
  width: number;
  height: number;
}

const DEFAULT_OPTIONS: DefenderOptions = {
  autoplay: true,
  showHUD: true,
  showControls: true,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
};

const HUD_SAFE_TOP = 42;

export class DefenderGame {
  private readonly inputVector: InputVector = { x: 0, y: 0 };
  private readonly input: Input;
  private readonly audio = new ArcadeAudio();
  private readonly renderer: DefenderRenderer;
  private readonly loop: GameLoop;
  private readonly particles = new ParticlePool(PARTICLE_POOL_SIZE);
  private readonly bullets: Bullet[];
  private readonly enemies: Enemy[];
  private readonly stars: Star[];
  private readonly reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  private player: Player = {
    x: GAME_WIDTH / 2,
    y: GAME_HEIGHT / 2,
    direction: 1,
    radius: PLAYER_RADIUS,
    invulnerable: 0,
    bank: 0,
    enginePulse: 0,
  };

  private score = 0;
  private highScore = 150150;
  private lives = MAX_LIVES;
  private gameOver = false;
  private paused = false;
  private bulletCooldown = 0;
  private enemySpawnTimer = 0;
  private enemyFireTimer = 0;
  private flash = 0;
  private shake = 0;
  private spawnSide = 1;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly options: DefenderOptions = DEFAULT_OPTIONS,
  ) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.bullets = Array.from({ length: BULLET_POOL_SIZE }, () => ({
      active: false,
      owner: 'player',
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      radius: 3,
    }));
    this.enemies = Array.from({ length: ENEMY_POOL_SIZE }, () => ({
      active: false,
      kind: 'lander',
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      radius: 8,
      wobble: 0,
      phase: 0,
      age: 0,
      baseY: 0,
      direction: 1,
    }));
    this.stars = Array.from({ length: STAR_COUNT }, (_, index) => ({
      x: ((index * 173) % this.options.width),
      y: 34 + ((index * 79) % Math.max(1, this.options.height - 94)),
      speed: 28 + (index % 5) * 24,
      radius: 0.65 + (index % 4) * 0.42,
      alpha: 0.26 + (index % 7) * 0.08,
      layer: index % 5,
      hue: index % 11 === 0 ? 72 : index % 3 === 0 ? 214 : 184,
      streak: index % 41 === 0,
    }));

    this.renderer = new DefenderRenderer(canvas);
    this.renderer.resize(this.options.width, this.options.height);
    this.input = new Input(canvas, () => this.togglePause());
    this.loop = new GameLoop(this.update);

    this.audio.setMuted(this.reducedMotion);
    this.reset();
    this.render(0);

    if (this.options.autoplay && !this.reducedMotion) {
      this.loop.start();
    } else {
      this.paused = true;
      this.render(0);
    }

    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('blur', this.handleBlur);
  }

  destroy(): void {
    this.loop.stop();
    this.input.destroy();
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('blur', this.handleBlur);
  }

  private reset(): void {
    this.player.x = this.options.width / 2;
    this.player.y = this.options.height / 2;
    this.player.direction = 1;
    this.player.invulnerable = PLAYER_INVULNERABLE_SECONDS;
    this.player.bank = 0;
    this.player.enginePulse = 0;
    this.score = 0;
    this.lives = MAX_LIVES;
    this.gameOver = false;
    this.bulletCooldown = 0;
    this.enemySpawnTimer = ENEMY_SPAWN_SECONDS * 0.35;
    this.enemyFireTimer = 0.5;
    this.flash = 0;
    this.shake = 0;

    for (let index = 0; index < this.bullets.length; index += 1) this.bullets[index].active = false;
    for (let index = 0; index < this.enemies.length; index += 1) this.enemies[index].active = false;

    for (let cluster = 0; cluster < 4; cluster += 1) {
      const clusterX = 120 + cluster * 210 + (cluster % 2) * 34;
      for (let member = 0; member < 3; member += 1) {
        this.spawnEnemy(cluster * 0.36 + member * 0.08, cluster * 13 + member, clusterX);
      }
    }

    for (let walker = 0; walker < 6; walker += 1) {
      this.spawnGroundEnemy(walker);
    }
  }

  private readonly update = (deltaSeconds: number, elapsedSeconds: number): void => {
    if (this.paused) {
      this.render(elapsedSeconds);
      return;
    }

    if (this.input.consumeEscape()) {
      this.render(elapsedSeconds);
      return;
    }

    if (this.gameOver) {
      if (this.input.consumeShoot()) {
        this.reset();
        this.audio.laser();
      }
      this.render(elapsedSeconds);
      return;
    }

    this.updatePlayer(deltaSeconds);
    this.updateBullets(deltaSeconds);
    this.updateEnemies(deltaSeconds, elapsedSeconds);
    this.updateEnemyFire(deltaSeconds, elapsedSeconds);
    this.updateStars(deltaSeconds);
    this.particles.update(deltaSeconds);
    this.resolveCollisions();

    this.bulletCooldown = Math.max(0, this.bulletCooldown - deltaSeconds);
    this.enemyFireTimer = Math.max(0, this.enemyFireTimer - deltaSeconds);
    this.flash = Math.max(0, this.flash - deltaSeconds * 5.2);
    this.shake = Math.max(0, this.shake - deltaSeconds * 28);
    this.player.invulnerable = Math.max(0, this.player.invulnerable - deltaSeconds);
    this.highScore = Math.max(this.highScore, this.score);

    this.render(elapsedSeconds);
  };

  private updatePlayer(deltaSeconds: number): void {
    const vector = this.input.getVector(this.inputVector);
    this.player.x += vector.x * PLAYER_SPEED * deltaSeconds;
    this.player.y += vector.y * PLAYER_SPEED * deltaSeconds;
    this.player.bank += (vector.y * 0.28 - this.player.bank) * Math.min(1, deltaSeconds * 10);
    this.player.enginePulse += deltaSeconds * 18;

    if (vector.x !== 0) this.player.direction = vector.x > 0 ? 1 : -1;

    this.player.x = Math.min(this.options.width - PLAYER_RADIUS, Math.max(PLAYER_RADIUS, this.player.x));
    this.player.y = Math.min(this.options.height - PLAYER_RADIUS, Math.max(HUD_SAFE_TOP + PLAYER_RADIUS, this.player.y));

    if (this.input.consumeShoot() && this.bulletCooldown <= 0) {
      this.fireBullet();
    }

    if (!this.reducedMotion) {
      const pulse = 0.55 + Math.sin(this.player.enginePulse) * 0.18;
      this.particles.emit(
        this.player.x - this.player.direction * 13,
        this.player.y + Math.sin(this.player.enginePulse * 0.7) * 1.4,
        -this.player.direction * (92 + pulse * 80),
        Math.sin(this.player.enginePulse * 1.9) * 12,
        1.7,
        0.22,
        184,
      );
    }
  }

  private fireBullet(): void {
    const bullet = this.nextBullet();
    if (!bullet) return;

    bullet.active = true;
    bullet.owner = 'player';
    bullet.x = this.player.x + this.player.direction * 15;
    bullet.y = this.player.y;
    bullet.vx = this.player.direction * BULLET_SPEED;
    bullet.vy = 0;
    bullet.radius = 2.5;
    this.bulletCooldown = BULLET_COOLDOWN_SECONDS;
    this.audio.laser();
  }

  private updateBullets(deltaSeconds: number): void {
    for (let index = 0; index < this.bullets.length; index += 1) {
      const bullet = this.bullets[index];
      if (!bullet.active) continue;
      bullet.x += bullet.vx * deltaSeconds;
      bullet.y += bullet.vy * deltaSeconds;

      if (bullet.x < -64 || bullet.x > this.options.width + 64 || bullet.y < HUD_SAFE_TOP || bullet.y > this.options.height + 18) {
        if (bullet.owner === 'enemy' && bullet.y > this.options.height - 18) {
          this.particles.burst(bullet.x, this.options.height - 30, 6, 62, 72);
        }
        bullet.active = false;
      }
    }
  }

  private updateEnemies(deltaSeconds: number, elapsedSeconds: number): void {
    this.enemySpawnTimer -= deltaSeconds;
    if (this.enemySpawnTimer <= 0) {
      const clusterX = (elapsedSeconds * 137) % this.options.width;
      const members = elapsedSeconds % 2 > 1 ? 3 : 2;
      for (let index = 0; index < members; index += 1) {
        this.spawnEnemy(elapsedSeconds + index * 0.06, Math.floor(elapsedSeconds * 10) + index, clusterX);
      }
      this.enemySpawnTimer = Math.max(0.46, ENEMY_SPAWN_SECONDS - this.score * 0.0006);
    }

    for (let index = 0; index < this.enemies.length; index += 1) {
      const enemy = this.enemies[index];
      if (!enemy.active) continue;

      enemy.age += deltaSeconds;
      enemy.x += enemy.vx * deltaSeconds;

      if (enemy.kind === 'hunter') {
        enemy.vy += Math.sign(this.player.y - enemy.y) * 72 * deltaSeconds;
        enemy.vy = Math.max(-92, Math.min(92, enemy.vy));
        enemy.y += enemy.vy * deltaSeconds;
      } else if (enemy.kind === 'saucer') {
        enemy.y = enemy.baseY + Math.sin(elapsedSeconds * 3.2 + enemy.phase) * enemy.wobble;
      } else if (enemy.kind === 'walker') {
        enemy.y = this.options.height - 58 + Math.sin(elapsedSeconds * 5 + enemy.phase) * 5;
        enemy.x += Math.sin(enemy.age * 1.7 + enemy.phase) * 16 * deltaSeconds;
      } else if (enemy.kind === 'bomber') {
        enemy.y = enemy.baseY + Math.sin(elapsedSeconds * 2.1 + enemy.phase) * enemy.wobble * 0.45;
      } else if (enemy.kind === 'pod') {
        enemy.y += Math.sin(enemy.age * 2.8 + enemy.phase) * enemy.wobble * deltaSeconds;
        if (enemy.age > 1.8 && Math.abs(this.player.x - enemy.x) < 180) {
          enemy.vx += enemy.direction * 10 * deltaSeconds;
        }
      } else {
        enemy.y += Math.sin(elapsedSeconds * 5.8 + enemy.phase) * enemy.wobble * deltaSeconds;
      }

      enemy.y = Math.min(this.options.height - 42, Math.max(HUD_SAFE_TOP + 8, enemy.y));

      if (enemy.x < -52 || enemy.x > this.options.width + 52) enemy.active = false;
    }
  }

  private updateEnemyFire(deltaSeconds: number, elapsedSeconds: number): void {
    if (this.enemyFireTimer > 0) return;

    let fired = 0;
    for (let index = 0; index < this.enemies.length && fired < 2; index += 1) {
      const enemy = this.enemies[(index + Math.floor(elapsedSeconds * 17)) % this.enemies.length];
      if (!enemy.active || enemy.kind === 'walker') continue;
      if ((index + Math.floor(enemy.age * 10)) % 5 !== 0) continue;
      this.fireEnemyShot(enemy);
      fired += 1;
    }

    this.enemyFireTimer = 0.42 + (elapsedSeconds % 0.16);
  }

  private updateStars(deltaSeconds: number): void {
    const skyHeight = Math.max(1, this.options.height - 106);
    for (let index = 0; index < this.stars.length; index += 1) {
      const star = this.stars[index];
      star.x -= star.speed * (star.streak ? 2.8 : 1) * deltaSeconds;
      if (star.streak) star.y += star.speed * 0.18 * deltaSeconds;
      if (star.x < 0) {
        star.x += this.options.width;
        star.y = HUD_SAFE_TOP + ((star.y + 137) % skyHeight);
      }
    }
  }

  private resolveCollisions(): void {
    for (let enemyIndex = 0; enemyIndex < this.enemies.length; enemyIndex += 1) {
      const enemy = this.enemies[enemyIndex];
      if (!enemy.active) continue;

      for (let bulletIndex = 0; bulletIndex < this.bullets.length; bulletIndex += 1) {
        const bullet = this.bullets[bulletIndex];
        if (!bullet.active || bullet.owner !== 'player') continue;

        if (CollisionSystem.circlesOverlap(enemy, bullet)) {
          enemy.active = false;
          bullet.active = false;
          this.score += this.enemyScore(enemy.kind);
          this.flash = 0.32;
          this.shake = 2.8;
          this.particles.burst(enemy.x, enemy.y, enemy.kind === 'pod' ? 12 : 8, 82, enemy.kind === 'walker' ? 72 : 184);
          this.audio.explosion();
          break;
        }
      }

      if (enemy.active && this.player.invulnerable <= 0 && CollisionSystem.circlesOverlap(enemy, this.player)) {
        enemy.active = false;
        this.lives -= 1;
        this.player.invulnerable = PLAYER_INVULNERABLE_SECONDS;
        this.flash = 0.48;
        this.shake = 4.5;
        this.particles.burst(this.player.x, this.player.y, 14, 100, 72);
        this.audio.hit();

        if (this.lives <= 0) {
          this.gameOver = true;
          this.audio.gameOver();
        }
      }
    }

    for (let bulletIndex = 0; bulletIndex < this.bullets.length; bulletIndex += 1) {
      const bullet = this.bullets[bulletIndex];
      if (!bullet.active || bullet.owner !== 'enemy' || this.player.invulnerable > 0) continue;
      if (!CollisionSystem.circlesOverlap(bullet, this.player)) continue;

      bullet.active = false;
      this.lives -= 1;
      this.player.invulnerable = PLAYER_INVULNERABLE_SECONDS;
      this.flash = 0.42;
      this.shake = 4;
      this.particles.burst(this.player.x, this.player.y, 10, 92, 72);
      this.audio.hit();
      if (this.lives <= 0) {
        this.gameOver = true;
        this.audio.gameOver();
      }
    }
  }

  private spawnEnemy(elapsedSeconds: number, seedOffset = 0, clusterX?: number): void {
    const enemy = this.nextEnemy();
    if (!enemy) return;

    this.spawnSide *= -1;
    const fromLeft = this.spawnSide < 0;
    const laneCount = 8;
    const lane = Math.floor((elapsedSeconds * 11 + this.score * 0.03 + seedOffset * 3) % laneCount);
    const kind = this.enemyKind(lane + seedOffset, elapsedSeconds);
    const direction = fromLeft ? 1 : -1;
    enemy.active = true;
    enemy.kind = kind;
    enemy.radius = kind === 'pod' ? 11 : kind === 'walker' ? 9 : kind === 'hunter' ? 8 : kind === 'saucer' ? 10 : kind === 'bomber' ? 12 : 8;
    enemy.x = clusterX !== undefined
      ? clusterX + ((seedOffset % 5) - 2) * 22
      : fromLeft ? -enemy.radius : this.options.width + enemy.radius;
    enemy.baseY = kind === 'walker' ? this.options.height - 58 : 52 + lane * 30;
    enemy.y = enemy.baseY;
    enemy.direction = direction;
    enemy.vx = direction * (ENEMY_BASE_SPEED + Math.min(110, this.score * 0.016) + lane * 3 + (kind === 'hunter' ? 54 : kind === 'bomber' ? 18 : 0));
    enemy.vy = 0;
    enemy.wobble = 12 + (lane % 5) * 4;
    enemy.phase = elapsedSeconds + lane;
    enemy.age = 0;
  }

  private spawnGroundEnemy(seedOffset: number): void {
    const enemy = this.nextEnemy();
    if (!enemy) return;

    enemy.active = true;
    enemy.kind = 'walker';
    enemy.radius = 8;
    enemy.x = (seedOffset * 91 + 34) % this.options.width;
    enemy.baseY = this.options.height - 58;
    enemy.y = enemy.baseY;
    enemy.direction = seedOffset % 2 === 0 ? 1 : -1;
    enemy.vx = enemy.direction * (18 + (seedOffset % 5) * 4);
    enemy.vy = 0;
    enemy.wobble = 5;
    enemy.phase = seedOffset;
    enemy.age = 0;
  }

  private fireEnemyShot(enemy: Enemy): void {
    const bullet = this.nextBullet();
    if (!bullet) return;

    const dx = this.player.x - enemy.x;
    const dy = this.player.y - enemy.y;
    const length = Math.max(1, Math.hypot(dx, dy));
    const speed = enemy.kind === 'bomber' ? 210 : 260;
    bullet.active = true;
    bullet.owner = 'enemy';
    bullet.x = enemy.x;
    bullet.y = enemy.y;
    bullet.vx = (dx / length) * speed;
    bullet.vy = (dy / length) * speed;
    bullet.radius = 3;
  }

  private enemyKind(lane: number, elapsedSeconds: number): EnemyKind {
    const selector = (lane + Math.floor(elapsedSeconds * 1.7) + Math.floor(this.score / 300)) % 6;
    if (selector === 0) return 'saucer';
    if (selector === 1) return 'hunter';
    if (selector === 2) return 'walker';
    if (selector === 3) return 'pod';
    if (selector === 4) return 'bomber';
    return 'lander';
  }

  private enemyScore(kind: EnemyKind): number {
    if (kind === 'pod') return 250;
    if (kind === 'bomber') return 220;
    if (kind === 'hunter') return 180;
    if (kind === 'walker') return 140;
    if (kind === 'saucer') return 120;
    return 100;
  }

  private nextBullet(): Bullet | undefined {
    for (let index = 0; index < this.bullets.length; index += 1) {
      if (!this.bullets[index].active) return this.bullets[index];
    }
    return undefined;
  }

  private nextEnemy(): Enemy | undefined {
    for (let index = 0; index < this.enemies.length; index += 1) {
      if (!this.enemies[index].active) return this.enemies[index];
    }
    return undefined;
  }

  private togglePause(): void {
    if (this.gameOver) return;
    this.paused = !this.paused;
    if (!this.loop.isRunning()) this.loop.start();
  }

  private render(elapsedSeconds: number): void {
    this.renderer.render(this.player, this.bullets, this.enemies, this.stars, this.particles, {
      score: this.score,
      highScore: this.highScore,
      lives: this.lives,
      gameOver: this.gameOver,
      paused: this.paused,
      flash: this.reducedMotion ? 0 : this.flash,
      shake: this.reducedMotion ? 0 : this.shake,
      elapsed: elapsedSeconds,
      showHUD: this.options.showHUD,
      showControls: this.options.showControls,
    });
  }

  private readonly handleVisibilityChange = (): void => {
    if (document.hidden) this.paused = true;
  };

  private readonly handleBlur = (): void => {
    this.paused = true;
  };
}

export function mountDefenderGame(root: HTMLElement): void {
  const canvas = root.querySelector<HTMLCanvasElement>('canvas');
  if (!canvas) return;

  const options: DefenderOptions = {
    autoplay: root.dataset.autoplay === 'true',
    showHUD: root.dataset.showHud !== 'false',
    showControls: root.dataset.showControls !== 'false',
    width: Number(root.dataset.width || GAME_WIDTH),
    height: Number(root.dataset.height || GAME_HEIGHT),
  };

  const current = root.dataset.mounted;
  if (current === 'true') return;

  root.dataset.mounted = 'true';
  const game = new DefenderGame(canvas, options);
  root.addEventListener('defender:destroy', () => game.destroy(), { once: true });
}
