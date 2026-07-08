import type { Enemy, Bullet, Player, Star } from './types';
import type { ParticlePool } from '../shared/Particles';
import { COLORS, GAME_HEIGHT, GAME_WIDTH } from './constants';

const ASSET_URLS = {
  player: new URL('./assets/player-ship.svg', import.meta.url).href,
  engineFlame: new URL('./assets/engine-flame.svg', import.meta.url).href,
  lander: new URL('./assets/lander.svg', import.meta.url).href,
  bomber: new URL('./assets/bomber.svg', import.meta.url).href,
  pod: new URL('./assets/pod.svg', import.meta.url).href,
  swarmer: new URL('./assets/swarmer.svg', import.meta.url).href,
  baiter: new URL('./assets/baiter.svg', import.meta.url).href,
  mutant: new URL('./assets/mutant.svg', import.meta.url).href,
  groundTurret: new URL('./assets/ground-turret.svg', import.meta.url).href,
  humanoid: new URL('./assets/humanoid.svg', import.meta.url).href,
  building: new URL('./assets/building.svg', import.meta.url).href,
  terrainModule: new URL('./assets/terrain-module.svg', import.meta.url).href,
  explosion1: new URL('./assets/explosion-1.svg', import.meta.url).href,
  explosion2: new URL('./assets/explosion-2.svg', import.meta.url).href,
  explosion3: new URL('./assets/explosion-3.svg', import.meta.url).href,
  hudLife: new URL('./assets/hud-life.svg', import.meta.url).href,
  radarBlip: new URL('./assets/hud-radar-blip.svg', import.meta.url).href,
} as const;

type AssetName = keyof typeof ASSET_URLS;

export interface RenderState {
  score: number;
  highScore: number;
  lives: number;
  gameOver: boolean;
  paused: boolean;
  flash: number;
  shake: number;
  elapsed: number;
  showHUD: boolean;
  showControls: boolean;
}

const HUD_HEIGHT = 42;
const RADAR_WIDTH = 306;

export class DefenderRenderer {
  private readonly context: CanvasRenderingContext2D;
  private backgroundGradient?: CanvasGradient;
  private readonly assets: Record<AssetName, HTMLImageElement>;
  private dpr = 1;
  private width = GAME_WIDTH;
  private height = GAME_HEIGHT;

  constructor(private readonly canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('CanvasRenderingContext2D is unavailable.');
    }
    this.context = context;
    this.assets = this.createAssets();
    this.resize(GAME_WIDTH, GAME_HEIGHT);
  }

  private createAssets(): Record<AssetName, HTMLImageElement> {
    const entries = Object.entries(ASSET_URLS).map(([name, url]) => {
      const image = new Image();
      image.decoding = 'async';
      image.src = url;
      return [name, image];
    });
    return Object.fromEntries(entries) as Record<AssetName, HTMLImageElement>;
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.floor(width * this.dpr);
    this.canvas.height = Math.floor(height * this.dpr);
    this.canvas.style.aspectRatio = `${width} / ${height}`;
    this.context.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    this.backgroundGradient = this.context.createLinearGradient(0, HUD_HEIGHT, 0, height);
    this.backgroundGradient.addColorStop(0, '#020407');
    this.backgroundGradient.addColorStop(0.44, '#05070d');
    this.backgroundGradient.addColorStop(1, COLORS.backgroundStart);

  }

  render(
    player: Player,
    bullets: Bullet[],
    enemies: Enemy[],
    stars: Star[],
    particles: ParticlePool,
    state: RenderState,
  ): void {
    const ctx = this.context;
    const shakeX = state.shake > 0 ? Math.sin(state.elapsed * 105) * state.shake : 0;
    const shakeY = state.shake > 0 ? Math.cos(state.elapsed * 87) * state.shake * 0.58 : 0;

    ctx.save();
    ctx.translate(shakeX, shakeY);
    this.drawBackground();
    this.drawStars(stars);
    this.drawDebris(stars, state.elapsed);
    this.drawTerrain(state.elapsed);
    this.drawGroundStructures(state.elapsed);
    this.drawHumanoids(state.elapsed);
    this.drawBullets(bullets);
    this.drawEnemies(enemies, state.elapsed);
    this.drawParticles(particles);
    this.drawPlayer(player, state.elapsed);
    ctx.restore();

    if (state.flash > 0) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(state.flash * 0.2, 0.14)})`;
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
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = COLORS.cyan;
    ctx.fillRect(0, HUD_HEIGHT, this.width, 2);
    ctx.globalAlpha = 0.16;
    ctx.fillStyle = COLORS.green;
    ctx.fillRect(0, this.height * 0.66, this.width, 1);
    ctx.restore();
  }

  private drawStars(stars: Star[]): void {
    const ctx = this.context;
    ctx.save();
    for (let index = 0; index < stars.length; index += 1) {
      const star = stars[index];
      if (star.streak) continue;
      ctx.globalAlpha = star.alpha;
      ctx.fillStyle = star.hue === 72 ? COLORS.green : star.hue === 214 ? COLORS.blue : COLORS.cyan;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  private drawDebris(stars: Star[], elapsed: number): void {
    const ctx = this.context;
    ctx.save();
    ctx.globalAlpha = 0.72;
    ctx.strokeStyle = COLORS.white;
    ctx.lineWidth = 1.3;
    ctx.shadowBlur = 10;
    ctx.shadowColor = COLORS.cyan;

    for (let index = 0; index < stars.length; index += 1) {
      const star = stars[index];
      if (!star.streak) continue;
      const flicker = 0.48 + Math.sin(elapsed * 7 + index) * 0.22;
      ctx.globalAlpha = flicker;
      ctx.beginPath();
      ctx.moveTo(star.x, star.y);
      ctx.lineTo(star.x + 34 + star.layer * 5, star.y - 9);
      ctx.stroke();
    }
    ctx.restore();
  }

  private drawTerrain(elapsed: number): void {
    const ctx = this.context;
    ctx.save();
    ctx.globalAlpha = 0.36;
    this.drawTerrainModules(elapsed * 26, this.height - 92, 126, 51);
    ctx.globalAlpha = 1;
    this.drawTerrainModules(elapsed * 74, this.height - 74, 180, 72);
    ctx.restore();
  }

  private drawTerrainModules(scroll: number, y: number, tileWidth: number, tileHeight: number): void {
    const offset = scroll % tileWidth;
    for (let x = -tileWidth - offset; x < this.width + tileWidth; x += tileWidth) {
      this.drawAsset('terrainModule', x, y, tileWidth, tileHeight);
    }
  }

  private terrainSample(index: number): number {
    const saw = ((index * 13) % 17) / 17;
    const ridge = Math.abs((((index * 7) % 23) / 11.5) - 1);
    const peak = index % 11 === 0 ? 0.96 : index % 7 === 0 ? 0.72 : 0;
    return Math.max(0.05, Math.min(1, saw * 0.35 + ridge * 0.48 + peak));
  }

  private drawHumanoids(elapsed: number): void {
    const ctx = this.context;
    const ground = this.height - 44;
    ctx.save();

    for (let index = 0; index < 7; index += 1) {
      const x = (index * 133 - (elapsed * 74) % 133 + this.width) % this.width;
      const y = ground - this.terrainSample(index * 9 + Math.floor(elapsed * 4)) * 42;
      this.drawAsset('humanoid', x - 4, y - 14, 8, 15);
    }
    ctx.restore();
  }

  private drawGroundStructures(elapsed: number): void {
    const ctx = this.context;
    const ground = this.height - 38;
    ctx.save();
    for (let index = 0; index < 5; index += 1) {
      const x = (index * 181 - (elapsed * 74) % 181 + this.width) % this.width;
      const y = ground - this.terrainSample(index * 13 + Math.floor(elapsed * 4)) * 46;
      this.drawAsset(index % 3 === 0 ? 'groundTurret' : 'building', x - 9, y - 17, 18, 18);
    }
    ctx.restore();
  }

  private drawBullets(bullets: Bullet[]): void {
    const ctx = this.context;
    ctx.save();

    for (let index = 0; index < bullets.length; index += 1) {
      const bullet = bullets[index];
      if (!bullet.active) continue;

      const direction = Math.sign(bullet.vx || 1);
      ctx.shadowBlur = bullet.owner === 'player' ? 5 : 2;
      ctx.shadowColor = bullet.owner === 'player' ? COLORS.green : COLORS.blue;
      ctx.strokeStyle = bullet.owner === 'player' ? COLORS.green : COLORS.blue;
      ctx.lineWidth = bullet.owner === 'player' ? 1.4 : 1;
      ctx.beginPath();
      ctx.moveTo(bullet.x - direction * (bullet.owner === 'player' ? 30 : 8), bullet.y - Math.sign(bullet.vy) * 2);
      ctx.lineTo(bullet.x + direction * (bullet.owner === 'player' ? 8 : 6), bullet.y);
      ctx.stroke();
      if (bullet.owner === 'player') {
        ctx.fillStyle = COLORS.white;
        ctx.fillRect(bullet.x + direction * 7 - 1, bullet.y - 1.5, 2, 3);
      }
    }
    ctx.restore();
  }

  private drawEnemies(enemies: Enemy[], elapsed: number): void {
    const ctx = this.context;
    ctx.save();

    for (let index = 0; index < enemies.length; index += 1) {
      const enemy = enemies[index];
      if (!enemy.active) continue;

      const pulse = 1 + Math.sin(elapsed * 6 + enemy.phase) * 0.025;
      ctx.save();
      ctx.translate(enemy.x, enemy.y);
      ctx.scale(enemy.direction * pulse, pulse);
      this.drawEnemyAsset(enemy);
      ctx.restore();
    }
    ctx.restore();
  }

  private drawEnemyAsset(enemy: Enemy): void {
    const size = enemy.radius * 2.35;
    const wide = enemy.kind === 'bomber' || enemy.kind === 'baiter' ? size * 1.45 : size;
    const tall = enemy.kind === 'lander' || enemy.kind === 'mutant' ? size * 1.2 : size;
    this.drawAsset(enemy.kind, -wide / 2, -tall / 2, wide, tall);
  }

  private drawParticles(particles: ParticlePool): void {
    const ctx = this.context;
    const list = particles.particles;
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';

    for (let index = 0; index < list.length; index += 1) {
      const particle = list[index];
      if (!particle.active) continue;

      const alpha = Math.max(0, particle.life / particle.maxLife);
      ctx.globalAlpha = alpha * 0.75;
      const frame = alpha > 0.66 ? 'explosion1' : alpha > 0.33 ? 'explosion2' : 'explosion3';
      const size = particle.radius * 5 * alpha;
      this.drawAsset(frame, particle.x - size / 2, particle.y - size / 2, size, size);
    }
    ctx.restore();
  }

  private drawPlayer(player: Player, elapsed: number): void {
    const ctx = this.context;
    if (player.invulnerable > 0 && Math.sin(elapsed * 32) < -0.2) return;

    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.scale(player.direction * 0.4, 0.4);
    ctx.rotate(player.bank);

    const engine = 1 + Math.sin(player.enginePulse) * 0.18;
    this.drawAsset('engineFlame', -62 * engine, -6, 26 * engine, 12);
    this.drawAsset('player', -32, -10, 64, 20);
    ctx.restore();
  }

  private drawHud(state: RenderState, player: Player, enemies: Enemy[]): void {
    const ctx = this.context;
    ctx.save();
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, this.width, HUD_HEIGHT);
    ctx.fillStyle = 'rgba(0, 255, 243, 0.58)';
    ctx.fillRect(0, HUD_HEIGHT - 2, this.width, 2);

    ctx.font = '800 15px Inter, system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = COLORS.green;
    ctx.fillText(`SCORE ${state.score.toString().padStart(6, '0')}`, 18, HUD_HEIGHT / 2);
    ctx.fillStyle = COLORS.cyan;
    ctx.fillText(`HIGH SCORE ${state.highScore.toString().padStart(6, '0')}`, this.width - 318, HUD_HEIGHT / 2);

    this.drawRadar(player, enemies);

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
      ctx.fillStyle = 'rgba(5, 5, 5, 0.7)';
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

  private drawRadar(player: Player, enemies: Enemy[]): void {
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
      const ridge = y + height - 4 - this.terrainSample(index) * 11;
      if (index === 0) ctx.moveTo(sampleX, ridge);
      else ctx.lineTo(sampleX, ridge);
    }
    ctx.strokeStyle = 'rgba(216, 255, 0, 0.72)';
    ctx.stroke();

    ctx.fillStyle = COLORS.white;
    this.drawAsset('radarBlip', x + (player.x / this.width) * RADAR_WIDTH - 2, y + height * 0.42, 4, 4);
    for (let index = 0; index < enemies.length; index += 1) {
      const enemy = enemies[index];
      if (!enemy.active) continue;
      ctx.fillStyle = enemy.kind === 'groundTurret' ? COLORS.green : COLORS.cyan;
      this.drawAsset('radarBlip', x + (enemy.x / this.width) * RADAR_WIDTH - 1.5, y + 4 + (enemy.y / this.height) * 16, 3, 3);
    }
    ctx.restore();
  }

  private drawLifeIcon(x: number, y: number): void {
    const ctx = this.context;
    ctx.save();
    ctx.translate(x, y);
    this.drawAsset('hudLife', -8, -4, 18, 8);
    ctx.restore();
  }

  private drawAsset(name: AssetName, x: number, y: number, width: number, height: number): void {
    const image = this.assets[name];
    if (!image.complete || image.naturalWidth === 0) return;
    this.context.drawImage(image, x, y, width, height);
  }
}
