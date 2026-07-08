import type { Enemy, Bullet, Civilian, Player, Star } from './types';
import type { ParticlePool } from '../shared/Particles';
import { COLORS, GAME_HEIGHT, GAME_WIDTH } from './constants';

interface SpriteFrame {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
}

type SpriteName =
  | 'player'
  | 'playerBank'
  | 'engineFlame'
  | 'lander'
  | 'bomber'
  | 'pod'
  | 'swarmer'
  | 'baiter'
  | 'mutant'
  | 'groundTurret'
  | 'humanoid'
  | 'building'
  | 'radarStation'
  | 'laserGreen'
  | 'laserRed'
  | 'explosion1'
  | 'explosion2'
  | 'explosion3'
  | 'explosion4'
  | 'hudLife'
  | 'radarBlip';

const SPRITES: Record<SpriteName, SpriteFrame> = {
  player: { sx: 276, sy: 72, sw: 178, sh: 76 },
  playerBank: { sx: 496, sy: 73, sw: 154, sh: 78 },
  engineFlame: { sx: 1104, sy: 72, sw: 66, sh: 108 },
  lander: { sx: 276, sy: 218, sw: 136, sh: 98 },
  bomber: { sx: 474, sy: 218, sw: 166, sh: 82 },
  pod: { sx: 706, sy: 224, sw: 112, sh: 76 },
  swarmer: { sx: 1088, sy: 219, sw: 134, sh: 82 },
  baiter: { sx: 277, sy: 357, sw: 156, sh: 82 },
  mutant: { sx: 884, sy: 214, sw: 126, sh: 108 },
  groundTurret: { sx: 936, sy: 340, sw: 96, sh: 94 },
  humanoid: { sx: 654, sy: 346, sw: 60, sh: 100 },
  building: { sx: 764, sy: 365, sw: 114, sh: 68 },
  radarStation: { sx: 1090, sy: 338, sw: 126, sh: 116 },
  laserGreen: { sx: 274, sy: 512, sw: 154, sh: 22 },
  laserRed: { sx: 462, sy: 512, sw: 158, sh: 24 },
  explosion1: { sx: 278, sy: 642, sw: 146, sh: 112 },
  explosion2: { sx: 486, sy: 642, sw: 150, sh: 114 },
  explosion3: { sx: 690, sy: 630, sw: 154, sh: 132 },
  explosion4: { sx: 892, sy: 628, sw: 164, sh: 138 },
  hudLife: { sx: 286, sy: 826, sw: 160, sh: 68 },
  radarBlip: { sx: 548, sy: 828, sw: 48, sh: 48 },
};

export interface RenderState {
  score: number;
  highScore: number;
  lives: number;
  gameOver: boolean;
  paused: boolean;
  flash: number;
  shake: number;
  elapsed: number;
  cameraX: number;
  showHUD: boolean;
  showControls: boolean;
}

const HUD_HEIGHT = 42;
const RADAR_WIDTH = 306;
const TERRAIN_STEP = 34;

export class DefenderRenderer {
  private readonly context: CanvasRenderingContext2D;
  private readonly sheet = new Image();
  private backgroundGradient?: CanvasGradient;
  private dpr = 1;
  private width = GAME_WIDTH;
  private height = GAME_HEIGHT;

  constructor(private readonly canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('CanvasRenderingContext2D is unavailable.');
    }

    this.context = context;
    this.sheet.decoding = 'async';
    this.sheet.src = '/defender.png';
    this.resize(GAME_WIDTH, GAME_HEIGHT);
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.floor(width * this.dpr);
    this.canvas.height = Math.floor(height * this.dpr);
    this.canvas.style.aspectRatio = `${width} / ${height}`;
    this.context.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.context.imageSmoothingEnabled = false;

    this.backgroundGradient = this.context.createLinearGradient(0, HUD_HEIGHT, 0, height);
    this.backgroundGradient.addColorStop(0, '#03060c');
    this.backgroundGradient.addColorStop(0.5, '#050712');
    this.backgroundGradient.addColorStop(1, COLORS.backgroundStart);
  }

  render(
    player: Player,
    bullets: Bullet[],
    enemies: Enemy[],
    civilians: Civilian[],
    stars: Star[],
    particles: ParticlePool,
    state: RenderState,
  ): void {
    const ctx = this.context;
    const shakeX = state.shake > 0 ? Math.sin(state.elapsed * 90) * state.shake : 0;
    const shakeY = state.shake > 0 ? Math.cos(state.elapsed * 74) * state.shake * 0.45 : 0;

    ctx.save();
    ctx.translate(shakeX, shakeY);
    this.drawBackground();
    this.drawStars(stars);
    this.drawTerrain(state.cameraX);
    this.drawGroundStructures(state.cameraX);
    this.drawHumanoids(civilians);
    this.drawBullets(bullets);
    this.drawEnemies(enemies, civilians, state.elapsed);
    this.drawParticles(particles);
    this.drawPlayer(player, state.elapsed);
    ctx.restore();

    if (state.flash > 0) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(state.flash * 0.12, 0.1)})`;
      ctx.fillRect(0, 0, this.width, this.height);
    }

    if (state.showHUD) {
      this.drawHud(state, player, enemies);
    }
  }

  private drawBackground(): void {
    const ctx = this.context;
    ctx.fillStyle = COLORS.backgroundStart;
    ctx.fillRect(-12, -12, this.width + 24, this.height + 24);
    ctx.fillStyle = this.backgroundGradient ?? COLORS.backgroundEnd;
    ctx.fillRect(0, HUD_HEIGHT, this.width, this.height - HUD_HEIGHT);

    ctx.save();
    ctx.fillStyle = 'rgba(35, 135, 255, 0.66)';
    ctx.fillRect(0, HUD_HEIGHT, this.width, 2);
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = COLORS.green;
    ctx.fillRect(0, this.height - 83, this.width, 1);
    ctx.restore();
  }

  private drawStars(stars: Star[]): void {
    const ctx = this.context;
    ctx.save();
    for (let index = 0; index < stars.length; index += 1) {
      const star = stars[index];
      ctx.globalAlpha = star.streak ? star.alpha * 0.5 : star.alpha;
      ctx.fillStyle = star.hue === 72 ? COLORS.green : star.hue === 214 ? COLORS.blue : COLORS.cyan;
      if (star.streak) {
        ctx.fillRect(star.x, star.y, 9 + star.layer * 2, 1);
      } else {
        ctx.fillRect(star.x, star.y, star.radius, star.radius);
      }
    }
    ctx.restore();
  }

  private drawTerrain(cameraX: number): void {
    const ctx = this.context;
    const base = this.height - 25;
    const offset = cameraX % TERRAIN_STEP;

    ctx.save();
    ctx.strokeStyle = 'rgba(216, 255, 0, 0.78)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    for (let index = -2; index <= Math.ceil(this.width / TERRAIN_STEP) + 2; index += 1) {
      const x = index * TERRAIN_STEP - offset;
      const y = this.terrainY(index + Math.floor(cameraX / TERRAIN_STEP), base, 44);
      if (index === -2) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.strokeStyle = 'rgba(35, 135, 255, 0.36)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let index = -2; index <= Math.ceil(this.width / TERRAIN_STEP) + 2; index += 1) {
      const x = index * TERRAIN_STEP - offset;
      const y = this.terrainY(index + Math.floor(cameraX / TERRAIN_STEP) + 9, base + 18, 25);
      if (index === -2) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  private terrainY(index: number, base: number, height: number): number {
    const jag = ((index * 17) % 29) / 29;
    const ridge = Math.abs((((index * 11) % 19) / 9.5) - 1);
    const peak = index % 13 === 0 ? 1 : index % 7 === 0 ? 0.7 : 0;
    return base - (jag * 0.32 + ridge * 0.4 + peak * 0.35) * height;
  }

  private drawGroundStructures(cameraX: number): void {
    const base = this.height - 42;
    const spacing = 260;
    const offset = cameraX % spacing;
    for (let index = -1; index < this.width / spacing + 2; index += 1) {
      const x = index * spacing - offset + 72;
      const sample = Math.floor((cameraX + x) / TERRAIN_STEP);
      const y = this.terrainY(sample, base, 38);
      this.drawSprite(index % 2 === 0 ? 'radarStation' : 'building', x - 13, y - 20, index % 2 === 0 ? 23 : 24, index % 2 === 0 ? 22 : 15);
    }
  }

  private drawHumanoids(civilians: Civilian[]): void {
    for (let index = 0; index < civilians.length; index += 1) {
      const civilian = civilians[index];
      if (!civilian.active) continue;
      this.drawSprite('humanoid', civilian.x - 4, civilian.y - 16, 9, 16);
    }
  }

  private drawBullets(bullets: Bullet[]): void {
    for (let index = 0; index < bullets.length; index += 1) {
      const bullet = bullets[index];
      if (!bullet.active) continue;
      const direction = Math.sign(bullet.vx || 1);
      const sprite = bullet.owner === 'player' ? 'laserGreen' : 'laserRed';
      const width = bullet.owner === 'player' ? 34 : 18;
      const height = bullet.owner === 'player' ? 4 : 3;
      this.drawSprite(sprite, bullet.x - (direction > 0 ? width * 0.72 : width * 0.28), bullet.y - height / 2, width, height);
    }
  }

  private drawEnemies(enemies: Enemy[], civilians: Civilian[], elapsed: number): void {
    for (let index = 0; index < enemies.length; index += 1) {
      const enemy = enemies[index];
      if (!enemy.active) continue;

      const pulse = 1 + Math.sin(elapsed * 5 + enemy.phase) * 0.018;
      const size = this.enemySize(enemy);
      this.context.save();
      this.context.translate(enemy.x, enemy.y);
      this.context.scale(enemy.direction * pulse, pulse);
      this.drawSprite(this.enemySprite(enemy), -size.width / 2, -size.height / 2, size.width, size.height);
      this.context.restore();

      if (enemy.carryingCivilian && enemy.targetCivilian >= 0) {
        const civilian = civilians[enemy.targetCivilian];
        if (civilian) this.drawSprite('humanoid', enemy.x - 4, enemy.y + size.height / 2 - 1, 8, 14);
      }
    }
  }

  private enemySprite(enemy: Enemy): SpriteName {
    if (enemy.kind === 'bomber') return 'bomber';
    if (enemy.kind === 'pod') return 'pod';
    if (enemy.kind === 'swarmer') return 'swarmer';
    if (enemy.kind === 'baiter') return 'baiter';
    if (enemy.kind === 'mutant') return 'mutant';
    if (enemy.kind === 'groundTurret') return 'groundTurret';
    return 'lander';
  }

  private enemySize(enemy: Enemy): { width: number; height: number } {
    if (enemy.kind === 'bomber') return { width: 31, height: 15 };
    if (enemy.kind === 'pod') return { width: 23, height: 16 };
    if (enemy.kind === 'swarmer') return { width: 20, height: 13 };
    if (enemy.kind === 'baiter') return { width: 27, height: 14 };
    if (enemy.kind === 'mutant') return { width: 21, height: 25 };
    if (enemy.kind === 'groundTurret') return { width: 18, height: 18 };
    return { width: 22, height: 22 };
  }

  private drawParticles(particles: ParticlePool): void {
    const list = particles.particles;
    for (let index = 0; index < list.length; index += 1) {
      const particle = list[index];
      if (!particle.active) continue;

      const alpha = Math.max(0, particle.life / particle.maxLife);
      const frame = alpha > 0.74 ? 'explosion4' : alpha > 0.5 ? 'explosion3' : alpha > 0.24 ? 'explosion2' : 'explosion1';
      const size = particle.radius * (3.7 + alpha * 1.5);
      this.context.globalAlpha = alpha * 0.9;
      this.drawSprite(frame, particle.x - size / 2, particle.y - size / 2, size, size);
      this.context.globalAlpha = 1;
    }
  }

  private drawPlayer(player: Player, elapsed: number): void {
    if (player.invulnerable > 0 && Math.sin(elapsed * 32) < -0.2) return;

    const ctx = this.context;
    const sprite = Math.abs(player.bank) > 0.06 ? 'playerBank' : 'player';
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.scale(player.direction, 1);
    ctx.rotate(player.bank);
    const engine = 1 + Math.sin(player.enginePulse) * 0.12;
    this.drawSprite('engineFlame', -30, -5 * engine, 13, 10 * engine);
    this.drawSprite(sprite, -18, -7, 36, 15);
    ctx.restore();
  }

  private drawHud(state: RenderState, player: Player, enemies: Enemy[]): void {
    const ctx = this.context;
    ctx.save();
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, this.width, HUD_HEIGHT);
    ctx.fillStyle = 'rgba(35, 135, 255, 0.85)';
    ctx.fillRect(0, HUD_HEIGHT - 2, this.width, 2);

    ctx.font = '800 15px Inter, system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = COLORS.green;
    ctx.fillText(`SCORE ${state.score.toString().padStart(6, '0')}`, 18, HUD_HEIGHT / 2);
    ctx.fillStyle = COLORS.cyan;
    ctx.fillText(`HIGH SCORE ${state.highScore.toString().padStart(6, '0')}`, this.width - 326, HUD_HEIGHT / 2);

    this.drawRadar(state, player, enemies);

    ctx.fillStyle = COLORS.white;
    ctx.fillText('LIVES', this.width - 126, HUD_HEIGHT / 2);
    for (let index = 0; index < state.lives; index += 1) {
      this.drawLifeIcon(this.width - 70 + index * 22, HUD_HEIGHT / 2);
    }

    if (state.showControls) {
      ctx.font = '600 11px Inter, system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.58)';
      ctx.fillText('WASD / ARROWS  SPACE  ESC', this.width - 20, HUD_HEIGHT + 19);
    }

    if (state.paused || state.gameOver) {
      ctx.fillStyle = 'rgba(5, 5, 5, 0.72)';
      ctx.fillRect(0, HUD_HEIGHT, this.width, this.height - HUD_HEIGHT);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = COLORS.green;
      ctx.font = '800 34px Inter, system-ui, sans-serif';
      ctx.fillText(state.gameOver ? 'GAME OVER' : 'PAUSED', this.width / 2, this.height / 2 - 18);
      ctx.font = '600 15px Inter, system-ui, sans-serif';
      ctx.fillStyle = COLORS.white;
      ctx.fillText(state.gameOver ? 'PRESS SPACE TO PLAY AGAIN' : 'PRESS ESC TO RESUME', this.width / 2, this.height / 2 + 24);
    }

    ctx.restore();
  }

  private drawRadar(state: RenderState, player: Player, enemies: Enemy[]): void {
    const ctx = this.context;
    const x = Math.max(214, this.width / 2 - RADAR_WIDTH / 2);
    const y = 6;
    const height = 28;

    ctx.save();
    ctx.strokeStyle = 'rgba(35, 135, 255, 0.72)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, RADAR_WIDTH, height);
    ctx.beginPath();
    for (let index = 0; index <= 34; index += 1) {
      const sampleX = x + (index / 34) * RADAR_WIDTH;
      const ridge = this.terrainY(index + Math.floor(state.cameraX / TERRAIN_STEP), y + height - 3, 12);
      if (index === 0) ctx.moveTo(sampleX, ridge);
      else ctx.lineTo(sampleX, ridge);
    }
    ctx.strokeStyle = 'rgba(216, 255, 0, 0.72)';
    ctx.stroke();

    this.drawSprite('radarBlip', x + (player.x / this.width) * RADAR_WIDTH - 2, y + height * 0.42, 4, 4);
    for (let index = 0; index < enemies.length; index += 1) {
      const enemy = enemies[index];
      if (!enemy.active) continue;
      this.drawSprite('radarBlip', x + (enemy.x / this.width) * RADAR_WIDTH - 1.5, y + 4 + (enemy.y / this.height) * 16, 3, 3);
    }
    ctx.restore();
  }

  private drawLifeIcon(x: number, y: number): void {
    this.drawSprite('hudLife', x - 9, y - 4, 18, 8);
  }

  private drawSprite(name: SpriteName, x: number, y: number, width: number, height: number): void {
    if (!this.sheet.complete || this.sheet.naturalWidth === 0) return;
    const frame = SPRITES[name];
    this.context.drawImage(this.sheet, frame.sx, frame.sy, frame.sw, frame.sh, x, y, width, height);
  }
}
