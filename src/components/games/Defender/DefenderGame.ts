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
import type { Bullet, Civilian, Enemy, EnemyKind, Player, Star } from './types';

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
const CIVILIAN_COUNT = 4;
const PLAYER_ACCELERATION = 1180;
const PLAYER_DRAG = 5.4;
const WORLD_SCROLL_BASE = 54;
const MAX_FLYING_ENEMIES = 7;

type WavePhase = 'calm' | 'attack' | 'recover';

export class DefenderGame {
  private readonly inputVector: InputVector = { x: 0, y: 0 };
  private readonly input: Input;
  private readonly audio = new ArcadeAudio();
  private readonly renderer: DefenderRenderer;
  private readonly loop: GameLoop;
  private readonly particles = new ParticlePool(PARTICLE_POOL_SIZE);
  private readonly bullets: Bullet[];
  private readonly enemies: Enemy[];
  private readonly civilians: Civilian[];
  private readonly stars: Star[];
  private readonly reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  private player: Player = {
    x: GAME_WIDTH / 2,
    y: GAME_HEIGHT / 2,
    vx: 0,
    vy: 0,
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
  private wavePhase: WavePhase = 'calm';
  private waveTimer = 0;
  private waveIndex = 0;
  private enemiesQueued = 0;
  private cameraX = 0;
  private cameraSpeed = WORLD_SCROLL_BASE;
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
      health: 1,
      targetCivilian: -1,
      carryingCivilian: false,
    }));
    this.civilians = Array.from({ length: CIVILIAN_COUNT }, (_, index) => ({
      active: true,
      x: 0,
      y: 0,
      baseX: 150 + index * 210,
      phase: index * 1.7,
      carriedBy: -1,
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
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.direction = 1;
    this.player.invulnerable = PLAYER_INVULNERABLE_SECONDS;
    this.player.bank = 0;
    this.player.enginePulse = 0;
    this.score = 0;
    this.lives = MAX_LIVES;
    this.gameOver = false;
    this.bulletCooldown = 0;
    this.enemySpawnTimer = ENEMY_SPAWN_SECONDS * 0.35;
    this.enemyFireTimer = 1.1;
    this.wavePhase = 'calm';
    this.waveTimer = 1.8;
    this.waveIndex = 0;
    this.enemiesQueued = 0;
    this.cameraX = 0;
    this.cameraSpeed = WORLD_SCROLL_BASE;
    this.flash = 0;
    this.shake = 0;

    for (let index = 0; index < this.bullets.length; index += 1) this.bullets[index].active = false;
    for (let index = 0; index < this.enemies.length; index += 1) this.enemies[index].active = false;
    for (let index = 0; index < this.civilians.length; index += 1) {
      const civilian = this.civilians[index];
      civilian.active = true;
      civilian.baseX = 150 + index * 210;
      civilian.x = civilian.baseX;
      civilian.y = this.groundY(civilian.x);
      civilian.carriedBy = -1;
    }

    for (let turret = 0; turret < 2; turret += 1) {
      this.spawnGroundEnemy(turret);
    }

    this.spawnEnemy(0.25, 0, 160);
    this.spawnEnemy(0.52, 1, 690);
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
    this.updateWorldScroll(deltaSeconds);
    this.updateBullets(deltaSeconds);
    this.updateWave(deltaSeconds, elapsedSeconds);
    this.updateEnemies(deltaSeconds, elapsedSeconds);
    this.updateEnemyFire(deltaSeconds, elapsedSeconds);
    this.updateCivilians(deltaSeconds, elapsedSeconds);
    this.updateStars(deltaSeconds);
    this.particles.update(deltaSeconds);
    this.resolveCollisions();

    this.bulletCooldown = Math.max(0, this.bulletCooldown - deltaSeconds);
    this.enemySpawnTimer = Math.max(0, this.enemySpawnTimer - deltaSeconds);
    this.enemyFireTimer = Math.max(0, this.enemyFireTimer - deltaSeconds);
    this.flash = Math.max(0, this.flash - deltaSeconds * 5.2);
    this.shake = Math.max(0, this.shake - deltaSeconds * 28);
    this.player.invulnerable = Math.max(0, this.player.invulnerable - deltaSeconds);
    this.highScore = Math.max(this.highScore, this.score);

    this.render(elapsedSeconds);
  };

  private updatePlayer(deltaSeconds: number): void {
    const vector = this.input.getVector(this.inputVector);
    this.player.vx += vector.x * PLAYER_ACCELERATION * deltaSeconds;
    this.player.vy += vector.y * PLAYER_ACCELERATION * 0.82 * deltaSeconds;

    const drag = Math.exp(-PLAYER_DRAG * deltaSeconds);
    this.player.vx *= drag;
    this.player.vy *= drag;

    const speed = Math.hypot(this.player.vx, this.player.vy);
    if (speed > PLAYER_SPEED) {
      const scale = PLAYER_SPEED / speed;
      this.player.vx *= scale;
      this.player.vy *= scale;
    }

    this.player.x += this.player.vx * deltaSeconds;
    this.player.y += this.player.vy * deltaSeconds;
    this.player.bank += ((vector.y * 0.2 + this.player.vy * 0.0009) - this.player.bank) * Math.min(1, deltaSeconds * 10);
    this.player.enginePulse += deltaSeconds * 18;

    if (Math.abs(this.player.vx) > 18) this.player.direction = this.player.vx > 0 ? 1 : -1;

    if (this.player.x < PLAYER_RADIUS) {
      this.player.x = PLAYER_RADIUS;
      this.player.vx = Math.max(0, this.player.vx);
    } else if (this.player.x > this.options.width - PLAYER_RADIUS) {
      this.player.x = this.options.width - PLAYER_RADIUS;
      this.player.vx = Math.min(0, this.player.vx);
    }

    if (this.player.y < HUD_SAFE_TOP + PLAYER_RADIUS) {
      this.player.y = HUD_SAFE_TOP + PLAYER_RADIUS;
      this.player.vy = Math.max(0, this.player.vy);
    } else if (this.player.y > this.options.height - PLAYER_RADIUS) {
      this.player.y = this.options.height - PLAYER_RADIUS;
      this.player.vy = Math.min(0, this.player.vy);
    }

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

  private updateWorldScroll(deltaSeconds: number): void {
    const desiredSpeed = WORLD_SCROLL_BASE + Math.max(0, this.player.vx) * 0.16;
    this.cameraSpeed += (desiredSpeed - this.cameraSpeed) * Math.min(1, deltaSeconds * 4);
    this.cameraX += this.cameraSpeed * deltaSeconds;
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
      bullet.x += (bullet.vx - (bullet.owner === 'enemy' ? this.cameraSpeed * 0.35 : 0)) * deltaSeconds;
      bullet.y += bullet.vy * deltaSeconds;

      if (bullet.x < -64 || bullet.x > this.options.width + 64 || bullet.y < HUD_SAFE_TOP || bullet.y > this.options.height + 18) {
        if (bullet.owner === 'enemy' && bullet.y > this.options.height - 18) {
          this.particles.burst(bullet.x, this.options.height - 30, 6, 62, 72);
        }
        bullet.active = false;
      }
    }
  }

  private updateLander(enemy: Enemy, enemyIndex: number, deltaSeconds: number): void {
    if (enemy.carryingCivilian) {
      enemy.vy += -36 * deltaSeconds;
      enemy.vy = Math.max(-74, enemy.vy);
      enemy.y += enemy.vy * deltaSeconds;

      if (enemy.y <= HUD_SAFE_TOP + 24) {
        enemy.kind = 'mutant';
        enemy.radius = 10;
        enemy.health = 1;
        enemy.carryingCivilian = false;
        enemy.targetCivilian = -1;
        enemy.vx = enemy.direction * 118;
        enemy.vy = 42;
      }
      return;
    }

    if (enemy.targetCivilian < 0 || !this.civilians[enemy.targetCivilian]?.active) {
      enemy.targetCivilian = this.findNearestCivilian(enemy.x);
    }

    const civilian = enemy.targetCivilian >= 0 ? this.civilians[enemy.targetCivilian] : undefined;
    if (civilian?.active) {
      const dx = civilian.x - enemy.x;
      const dy = civilian.y - 18 - enemy.y;
      enemy.vx += Math.sign(dx) * 24 * deltaSeconds;
      enemy.vy += Math.sign(dy) * 34 * deltaSeconds;
      enemy.vx = Math.max(-96, Math.min(96, enemy.vx));
      enemy.vy = Math.max(-64, Math.min(64, enemy.vy));
      enemy.y += enemy.vy * deltaSeconds;

      if (Math.abs(dx) < 12 && Math.abs(dy) < 18) {
        enemy.carryingCivilian = true;
        enemy.targetCivilian = this.civilians.indexOf(civilian);
        civilian.active = false;
        civilian.carriedBy = enemyIndex;
        enemy.vy = -36;
      }
      return;
    }

    enemy.y += Math.sin(enemy.age * 3.8 + enemy.phase) * enemy.wobble * deltaSeconds;
  }

  private updateEnemies(deltaSeconds: number, elapsedSeconds: number): void {
    for (let index = 0; index < this.enemies.length; index += 1) {
      const enemy = this.enemies[index];
      if (!enemy.active) continue;

      enemy.age += deltaSeconds;
      enemy.x += (enemy.vx - this.cameraSpeed) * deltaSeconds;

      if (enemy.kind === 'groundTurret') {
        enemy.vx = 0;
        enemy.y = this.groundY(enemy.x) - 11;
        if (enemy.x < -42) {
          enemy.x += this.options.width + 180;
          enemy.y = this.groundY(enemy.x) - 11;
        }
        continue;
      }

      if (enemy.kind === 'lander') {
        this.updateLander(enemy, index, deltaSeconds);
      } else if (enemy.kind === 'baiter' || enemy.kind === 'mutant') {
        const pursuit = enemy.kind === 'mutant' ? 112 : 78;
        enemy.vx += Math.sign(this.player.x - enemy.x) * pursuit * 0.38 * deltaSeconds;
        enemy.vy += Math.sign(this.player.y - enemy.y) * pursuit * deltaSeconds;
        enemy.vx = Math.max(-190, Math.min(190, enemy.vx));
        enemy.vy = Math.max(-128, Math.min(128, enemy.vy));
        enemy.x += enemy.vx * 0.24 * deltaSeconds;
        enemy.y += enemy.vy * deltaSeconds;
      } else if (enemy.kind === 'swarmer') {
        const dx = this.player.x - enemy.x;
        const dy = this.player.y - enemy.y;
        const length = Math.max(1, Math.hypot(dx, dy));
        enemy.vx += (dx / length) * 150 * deltaSeconds;
        enemy.vy += (dy / length) * 150 * deltaSeconds;
        enemy.vx = Math.max(-230, Math.min(230, enemy.vx));
        enemy.vy = Math.max(-160, Math.min(160, enemy.vy));
        enemy.y += enemy.vy * deltaSeconds + Math.sin(elapsedSeconds * 8 + enemy.phase) * 8 * deltaSeconds;
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

      if (enemy.x < -70 || enemy.x > this.options.width + 70) {
        this.releaseCarriedCivilian(enemy);
        enemy.active = false;
      }
    }
  }

  private updateWave(deltaSeconds: number, elapsedSeconds: number): void {
    this.waveTimer -= deltaSeconds;

    if (this.wavePhase === 'calm') {
      if (this.waveTimer <= 0) this.startAttackWave(elapsedSeconds);
      return;
    }

    if (this.wavePhase === 'attack') {
      if (this.enemySpawnTimer <= 0 && this.enemiesQueued > 0 && this.activeFlyingEnemies() < MAX_FLYING_ENEMIES) {
        const entryX = this.waveIndex % 2 === 0 ? this.options.width + 28 : -28;
        this.spawnEnemy(elapsedSeconds, this.waveIndex * 7 + this.enemiesQueued, entryX);
        this.enemiesQueued -= 1;
        this.enemySpawnTimer = 0.55 + (this.enemiesQueued % 2) * 0.18;
      }

      if (this.enemiesQueued <= 0) {
        this.wavePhase = 'recover';
        this.waveTimer = 4.2;
      }
      return;
    }

    if (this.waveTimer <= 0 || this.activeFlyingEnemies() <= 1) {
      this.wavePhase = 'calm';
      this.waveTimer = 2.1 + (this.waveIndex % 3) * 0.45;
      this.waveIndex += 1;
    }
  }

  private startAttackWave(elapsedSeconds: number): void {
    this.wavePhase = 'attack';
    this.enemiesQueued = 4 + (this.waveIndex % 3);
    this.enemySpawnTimer = 0;
    if (this.activeFlyingEnemies() === 0) {
      this.spawnEnemy(elapsedSeconds, this.waveIndex * 11, this.waveIndex % 2 === 0 ? this.options.width + 24 : -24);
      this.enemiesQueued -= 1;
    }
  }

  private activeFlyingEnemies(): number {
    let count = 0;
    for (let index = 0; index < this.enemies.length; index += 1) {
      const enemy = this.enemies[index];
      if (enemy.active && enemy.kind !== 'groundTurret') count += 1;
    }
    return count;
  }

  private updateEnemyFire(deltaSeconds: number, elapsedSeconds: number): void {
    if (this.enemyFireTimer > 0) return;

    let fired = 0;
    for (let index = 0; index < this.enemies.length && fired < 1; index += 1) {
      const enemy = this.enemies[(index + Math.floor(elapsedSeconds * 17)) % this.enemies.length];
      if (!enemy.active) continue;
      if (enemy.kind === 'groundTurret' && Math.abs(this.player.x - enemy.x) > 235) continue;
      if (enemy.kind === 'lander' && (index + this.waveIndex) % 3 !== 0) continue;
      if ((index + Math.floor(enemy.age * 10)) % 5 !== 0) continue;
      this.fireEnemyShot(enemy);
      fired += 1;
    }

    this.enemyFireTimer = 1.05 + (elapsedSeconds % 0.24);
  }

  private updateCivilians(deltaSeconds: number, elapsedSeconds: number): void {
    for (let index = 0; index < this.civilians.length; index += 1) {
      const civilian = this.civilians[index];
      if (!civilian.active) continue;
      civilian.x -= (this.cameraSpeed + 10 + (index % 2) * 4) * deltaSeconds;
      if (civilian.x < -20) civilian.x += this.options.width + 170;
      civilian.y = this.groundY(civilian.x) + Math.sin(elapsedSeconds * 2 + civilian.phase) * 1.5;
    }
  }

  private updateStars(deltaSeconds: number): void {
    const skyHeight = Math.max(1, this.options.height - 106);
    for (let index = 0; index < this.stars.length; index += 1) {
      const star = this.stars[index];
      star.x -= (star.speed + this.cameraSpeed * 0.2) * (star.streak ? 2.1 : 1) * deltaSeconds;
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
          bullet.active = false;
          enemy.health -= 1;
          if (enemy.health <= 0) {
            const defeatedKind = enemy.kind;
            if (defeatedKind === 'pod') this.spawnSwarmers(enemy.x, enemy.y, enemy.direction);
            this.releaseCarriedCivilian(enemy);
            enemy.active = false;
            this.score += this.enemyScore(defeatedKind);
            this.flash = 0.2;
            this.shake = defeatedKind === 'pod' ? 2.2 : 1.6;
            this.particles.burst(enemy.x, enemy.y, defeatedKind === 'pod' ? 7 : 5, 62, defeatedKind === 'groundTurret' ? 72 : 184);
            this.audio.explosion();
          }
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

    for (let civilianIndex = 0; civilianIndex < this.civilians.length; civilianIndex += 1) {
      const civilian = this.civilians[civilianIndex];
      if (!civilian.active) continue;
      const dx = civilian.x - this.player.x;
      const dy = civilian.y - this.player.y;
      if (dx * dx + dy * dy > 22 * 22) continue;
      civilian.active = false;
      civilian.carriedBy = -1;
      this.score += 250;
      this.particles.burst(civilian.x, civilian.y - 6, 4, 44, 72);
    }
  }

  private spawnEnemy(elapsedSeconds: number, seedOffset = 0, clusterX?: number): void {
    const enemy = this.nextEnemy();
    if (!enemy) return;

    this.spawnSide *= -1;
    const fromLeft = this.spawnSide < 0;
    const laneCount = 8;
    const lane = Math.floor((elapsedSeconds * 11 + this.score * 0.03 + seedOffset * 3) % laneCount);
    const kind = this.enemyKind(lane + seedOffset);
    const direction = fromLeft ? 1 : -1;
    enemy.active = true;
    enemy.kind = kind;
    enemy.radius = kind === 'pod' ? 11 : kind === 'groundTurret' ? 9 : kind === 'baiter' ? 8 : kind === 'swarmer' ? 9 : kind === 'bomber' ? 12 : kind === 'mutant' ? 10 : 8;
    enemy.x = clusterX !== undefined
      ? clusterX + ((seedOffset % 5) - 2) * 22
      : fromLeft ? -enemy.radius : this.options.width + enemy.radius;
    enemy.baseY = kind === 'groundTurret' ? this.options.height - 58 : 52 + lane * 30;
    enemy.y = enemy.baseY;
    enemy.direction = direction;
    enemy.vx = direction * (ENEMY_BASE_SPEED + Math.min(110, this.score * 0.016) + lane * 3 + (kind === 'baiter' ? 54 : kind === 'bomber' ? 18 : kind === 'mutant' ? 36 : 0));
    enemy.vy = 0;
    enemy.wobble = 12 + (lane % 5) * 4;
    enemy.phase = elapsedSeconds + lane;
    enemy.age = 0;
    enemy.health = kind === 'pod' ? 2 : 1;
    enemy.targetCivilian = kind === 'lander' ? this.findNearestCivilian(enemy.x) : -1;
    enemy.carryingCivilian = false;
  }

  private spawnGroundEnemy(seedOffset: number): void {
    const enemy = this.nextEnemy();
    if (!enemy) return;

    enemy.active = true;
    enemy.kind = 'groundTurret';
    enemy.radius = 8;
    enemy.x = (seedOffset * 91 + 34) % this.options.width;
    enemy.baseY = this.options.height - 58;
    enemy.y = enemy.baseY;
    enemy.direction = seedOffset % 2 === 0 ? 1 : -1;
    enemy.vx = 0;
    enemy.vy = 0;
    enemy.wobble = 5;
    enemy.phase = seedOffset;
    enemy.age = 0;
    enemy.health = 1;
    enemy.targetCivilian = -1;
    enemy.carryingCivilian = false;
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

  private enemyKind(lane: number): EnemyKind {
    const selector = (lane + this.waveIndex + Math.floor(this.score / 600)) % 8;
    if (selector <= 2) return 'lander';
    if (selector === 3) return 'bomber';
    if (selector === 4) return 'pod';
    if (selector === 5) return 'swarmer';
    if (selector === 6 && this.score > 700) return 'mutant';
    if (selector === 7) return 'baiter';
    return 'lander';
  }

  private enemyScore(kind: EnemyKind): number {
    if (kind === 'pod') return 250;
    if (kind === 'bomber') return 220;
    if (kind === 'baiter') return 180;
    if (kind === 'mutant') return 160;
    if (kind === 'groundTurret') return 140;
    if (kind === 'swarmer') return 120;
    return 100;
  }

  private findNearestCivilian(x: number): number {
    let bestIndex = -1;
    let bestDistance = Number.POSITIVE_INFINITY;
    for (let index = 0; index < this.civilians.length; index += 1) {
      const civilian = this.civilians[index];
      if (!civilian.active) continue;
      const distance = Math.abs(civilian.x - x);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    }
    return bestIndex;
  }

  private releaseCarriedCivilian(enemy: Enemy): void {
    if (!enemy.carryingCivilian || enemy.targetCivilian < 0) return;
    const civilian = this.civilians[enemy.targetCivilian];
    if (civilian) {
      civilian.active = true;
      civilian.carriedBy = -1;
      civilian.x = enemy.x;
      civilian.y = Math.min(this.groundY(enemy.x), enemy.y + 18);
    }
    enemy.carryingCivilian = false;
    enemy.targetCivilian = -1;
  }

  private spawnSwarmers(x: number, y: number, direction: number): void {
    for (let index = 0; index < 2; index += 1) {
      const swarmer = this.nextEnemy();
      if (!swarmer) return;
      swarmer.active = true;
      swarmer.kind = 'swarmer';
      swarmer.radius = 7;
      swarmer.x = x + (index === 0 ? -8 : 8);
      swarmer.y = y + (index === 0 ? -5 : 5);
      swarmer.baseY = swarmer.y;
      swarmer.direction = direction;
      swarmer.vx = direction * (150 + index * 26);
      swarmer.vy = index === 0 ? -68 : 68;
      swarmer.wobble = 7;
      swarmer.phase = this.waveIndex + index * 0.7;
      swarmer.age = 0;
      swarmer.health = 1;
      swarmer.targetCivilian = -1;
      swarmer.carryingCivilian = false;
    }
  }

  private groundY(x: number): number {
    return this.options.height - 55 - Math.sin(x * 0.019) * 13 - Math.sin(x * 0.043) * 7;
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
    this.renderer.render(this.player, this.bullets, this.enemies, this.civilians, this.stars, this.particles, {
      score: this.score,
      highScore: this.highScore,
      lives: this.lives,
      gameOver: this.gameOver,
      paused: this.paused,
      flash: this.reducedMotion ? 0 : this.flash,
      shake: this.reducedMotion ? 0 : this.shake,
      elapsed: elapsedSeconds,
      cameraX: this.cameraX,
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
