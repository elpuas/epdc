import type { Enemy, Bullet, Player, Star } from './types';
import type { ParticlePool } from '../shared/Particles';
import { COLORS, GAME_HEIGHT, GAME_WIDTH } from './constants';

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
const TERRAIN_STEPS = 74;

export class DefenderRenderer {
  private readonly context: CanvasRenderingContext2D;
  private backgroundGradient?: CanvasGradient;
  private farTerrainGradient?: CanvasGradient;
  private nearTerrainGradient?: CanvasGradient;
  private playerGradient?: CanvasGradient;
  private dpr = 1;
  private width = GAME_WIDTH;
  private height = GAME_HEIGHT;

  constructor(private readonly canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('CanvasRenderingContext2D is unavailable.');
    }
    this.context = context;
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

    this.backgroundGradient = this.context.createLinearGradient(0, HUD_HEIGHT, 0, height);
    this.backgroundGradient.addColorStop(0, '#020407');
    this.backgroundGradient.addColorStop(0.44, '#05070d');
    this.backgroundGradient.addColorStop(1, COLORS.backgroundStart);

    this.farTerrainGradient = this.context.createLinearGradient(0, height * 0.58, 0, height);
    this.farTerrainGradient.addColorStop(0, 'rgba(35, 135, 255, 0.14)');
    this.farTerrainGradient.addColorStop(1, 'rgba(0, 255, 243, 0.02)');

    this.nearTerrainGradient = this.context.createLinearGradient(0, height * 0.68, 0, height);
    this.nearTerrainGradient.addColorStop(0, 'rgba(216, 255, 0, 0.08)');
    this.nearTerrainGradient.addColorStop(0.32, 'rgba(0, 255, 243, 0.08)');
    this.nearTerrainGradient.addColorStop(1, 'rgba(5, 5, 5, 0.72)');

    this.playerGradient = this.context.createLinearGradient(-38, -12, 42, 12);
    this.playerGradient.addColorStop(0, '#ffffff');
    this.playerGradient.addColorStop(0.35, '#bffcff');
    this.playerGradient.addColorStop(0.72, COLORS.cyan);
    this.playerGradient.addColorStop(1, COLORS.blue);
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
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(state.flash * 0.3, 0.22)})`;
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
    this.drawTerrainLayer(elapsed * 28, this.height * 0.68, 26, this.farTerrainGradient, 'rgba(35, 135, 255, 0.42)', 0.58);
    this.drawTerrainLayer(elapsed * 88, this.height * 0.82, 78, this.nearTerrainGradient, 'rgba(216, 255, 0, 0.78)', 1);

    ctx.save();
    ctx.globalAlpha = 0.34;
    ctx.strokeStyle = 'rgba(0, 255, 243, 0.34)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, this.height - 18);
    ctx.lineTo(this.width, this.height - 18);
    ctx.stroke();
    ctx.restore();
  }

  private drawTerrainLayer(
    scroll: number,
    baseY: number,
    amplitude: number,
    fill: CanvasGradient | undefined,
    stroke: string,
    alpha: number,
  ): void {
    const ctx = this.context;
    const step = this.width / TERRAIN_STEPS;
    const offset = scroll % step;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.moveTo(-step, this.height + 24);

    for (let index = -1; index <= TERRAIN_STEPS + 1; index += 1) {
      const x = index * step - offset;
      const sample = index + Math.floor(scroll / step);
      const jag = this.terrainSample(sample);
      const y = baseY - jag * amplitude;
      ctx.lineTo(x, y);
    }

    ctx.lineTo(this.width + step, this.height + 24);
    ctx.closePath();
    ctx.fillStyle = fill ?? 'rgba(0, 255, 243, 0.16)';
    ctx.fill();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = alpha > 0.9 ? 2.4 : 1.4;
    ctx.shadowBlur = alpha > 0.9 ? 8 : 3;
    ctx.shadowColor = stroke;
    ctx.stroke();
    ctx.restore();
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
    ctx.strokeStyle = COLORS.green;
    ctx.fillStyle = COLORS.green;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 7;
    ctx.shadowColor = COLORS.green;

    for (let index = 0; index < 10; index += 1) {
      const x = (index * 97 - (elapsed * 88) % 97 + this.width) % this.width;
      const y = ground - this.terrainSample(index * 9 + Math.floor(elapsed * 4)) * 42;
      ctx.beginPath();
      ctx.arc(x, y - 8, 2.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x, y - 5);
      ctx.lineTo(x, y + 7);
      ctx.moveTo(x - 5, y);
      ctx.lineTo(x + 5, y);
      ctx.moveTo(x, y + 7);
      ctx.lineTo(x - 4, y + 14);
      ctx.moveTo(x, y + 7);
      ctx.lineTo(x + 4, y + 14);
      ctx.stroke();
    }
    ctx.restore();
  }

  private drawGroundStructures(elapsed: number): void {
    const ctx = this.context;
    const ground = this.height - 38;
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 255, 243, 0.58)';
    ctx.fillStyle = 'rgba(0, 255, 243, 0.08)';
    ctx.lineWidth = 1.3;
    ctx.shadowBlur = 5;
    ctx.shadowColor = COLORS.cyan;

    for (let index = 0; index < 8; index += 1) {
      const x = (index * 123 - (elapsed * 88) % 123 + this.width) % this.width;
      const y = ground - this.terrainSample(index * 13 + Math.floor(elapsed * 4)) * 46;
      const height = 8 + (index % 4) * 4;
      ctx.beginPath();
      ctx.rect(x - 6, y - height, 12, height);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - 10, y - height);
      ctx.lineTo(x, y - height - 7);
      ctx.lineTo(x + 10, y - height);
      ctx.stroke();
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
      ctx.shadowBlur = bullet.owner === 'player' ? 12 : 7;
      ctx.shadowColor = bullet.owner === 'player' ? COLORS.green : COLORS.blue;
      ctx.strokeStyle = bullet.owner === 'player' ? COLORS.green : COLORS.blue;
      ctx.lineWidth = bullet.owner === 'player' ? 1.7 : 1.2;
      ctx.beginPath();
      ctx.moveTo(bullet.x - direction * (bullet.owner === 'player' ? 46 : 12), bullet.y - Math.sign(bullet.vy) * 3);
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
    ctx.shadowBlur = 16;
    ctx.shadowColor = COLORS.cyan;

    for (let index = 0; index < enemies.length; index += 1) {
      const enemy = enemies[index];
      if (!enemy.active) continue;

      const pulse = 1 + Math.sin(elapsed * 6 + enemy.phase) * 0.05;
      ctx.save();
      ctx.translate(enemy.x, enemy.y);
      ctx.scale(enemy.direction * pulse, pulse);

      if (enemy.kind === 'saucer') this.drawSaucer(enemy.radius);
      else if (enemy.kind === 'hunter') this.drawHunter(enemy.radius);
      else if (enemy.kind === 'walker') this.drawWalker(enemy.radius, elapsed + enemy.phase);
      else if (enemy.kind === 'pod') this.drawPod(enemy.radius, elapsed + enemy.phase);
      else if (enemy.kind === 'bomber') this.drawBomber(enemy.radius, elapsed + enemy.phase);
      else this.drawLander(enemy.radius, elapsed + enemy.phase);

      ctx.restore();
    }
    ctx.restore();
  }

  private drawLander(radius: number, elapsed: number): void {
    const ctx = this.context;
    ctx.strokeStyle = COLORS.green;
    ctx.fillStyle = 'rgba(216, 255, 0, 0.12)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -radius * 0.8);
    ctx.lineTo(radius * 0.74, -radius * 0.18);
    ctx.lineTo(radius * 0.4, radius * 0.72);
    ctx.lineTo(0, radius * 0.36);
    ctx.lineTo(-radius * 0.4, radius * 0.72);
    ctx.lineTo(-radius * 0.74, -radius * 0.18);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(-2, -radius * 0.08 + Math.sin(elapsed * 5), 4, 4);
  }

  private drawBomber(radius: number, elapsed: number): void {
    const ctx = this.context;
    ctx.strokeStyle = COLORS.blue;
    ctx.fillStyle = 'rgba(35, 135, 255, 0.12)';
    ctx.lineWidth = 1.7;
    ctx.beginPath();
    ctx.moveTo(-radius * 1.25, -radius * 0.22);
    ctx.lineTo(-radius * 0.28, -radius * 0.7);
    ctx.lineTo(radius * 1.2, -radius * 0.32);
    ctx.lineTo(radius * 0.88, radius * 0.3);
    ctx.lineTo(-radius * 0.18, radius * 0.68);
    ctx.lineTo(-radius * 1.25, radius * 0.22);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = COLORS.green;
    for (let dot = 0; dot < 3; dot += 1) {
      ctx.fillRect(-radius * 0.46 + dot * radius * 0.42, Math.sin(elapsed * 4 + dot) * 1.2 - 1, 2.3, 2.3);
    }
  }

  private drawSaucer(radius: number): void {
    const ctx = this.context;
    ctx.fillStyle = 'rgba(0, 255, 243, 0.14)';
    ctx.strokeStyle = COLORS.cyan;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 2, radius, radius * 0.38, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, -3, radius * 0.44, Math.PI, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-radius * 0.82, 4);
    ctx.lineTo(-radius * 1.18, 9);
    ctx.moveTo(radius * 0.82, 4);
    ctx.lineTo(radius * 1.18, 9);
    ctx.stroke();
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(-radius * 0.52, 0, radius * 0.24, 2);
    ctx.fillRect(radius * 0.24, 0, radius * 0.24, 2);
  }

  private drawHunter(radius: number): void {
    const ctx = this.context;
    ctx.fillStyle = 'rgba(35, 135, 255, 0.2)';
    ctx.strokeStyle = COLORS.blue;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(radius * 1.12, 0);
    ctx.lineTo(radius * 0.16, -radius * 0.4);
    ctx.lineTo(-radius * 0.92, -radius * 0.76);
    ctx.lineTo(-radius * 0.46, 0);
    ctx.lineTo(-radius * 0.92, radius * 0.76);
    ctx.lineTo(radius * 0.16, radius * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = COLORS.green;
    ctx.fillRect(-radius * 0.24, -2, radius * 0.44, 4);
  }

  private drawWalker(radius: number, elapsed: number): void {
    const ctx = this.context;
    ctx.strokeStyle = COLORS.green;
    ctx.fillStyle = 'rgba(216, 255, 0, 0.16)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-radius * 0.72, radius * 0.08);
    ctx.lineTo(-radius * 0.4, -radius * 0.5);
    ctx.lineTo(radius * 0.4, -radius * 0.5);
    ctx.lineTo(radius * 0.72, radius * 0.08);
    ctx.lineTo(radius * 0.36, radius * 0.38);
    ctx.lineTo(-radius * 0.36, radius * 0.38);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    for (let leg = -1; leg <= 1; leg += 2) {
      const swing = Math.sin(elapsed * 7 + leg) * 4;
      ctx.beginPath();
      ctx.moveTo(leg * radius * 0.26, radius * 0.32);
      ctx.lineTo(leg * radius * 0.56, radius * 0.86 + swing);
      ctx.stroke();
    }
  }

  private drawPod(radius: number, elapsed: number): void {
    const ctx = this.context;
    ctx.strokeStyle = COLORS.cyan;
    ctx.fillStyle = 'rgba(0, 255, 243, 0.1)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-radius * 0.95, 0);
    ctx.bezierCurveTo(-radius * 0.6, -radius * 0.82, radius * 0.58, -radius * 0.82, radius * 0.95, 0);
    ctx.bezierCurveTo(radius * 0.58, radius * 0.82, -radius * 0.6, radius * 0.82, -radius * 0.95, 0);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = COLORS.green;
    ctx.beginPath();
    ctx.rect(-radius * 0.42, -3 + Math.sin(elapsed * 3) * 1.5, radius * 0.84, 6);
    ctx.fill();
  }

  private drawParticles(particles: ParticlePool): void {
    const ctx = this.context;
    const list = particles.particles;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    for (let index = 0; index < list.length; index += 1) {
      const particle = list[index];
      if (!particle.active) continue;

      const alpha = Math.max(0, particle.life / particle.maxLife);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.hue === 72 ? COLORS.green : COLORS.cyan;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius * alpha, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  private drawPlayer(player: Player, elapsed: number): void {
    const ctx = this.context;
    if (player.invulnerable > 0 && Math.sin(elapsed * 32) < -0.2) return;

    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.scale(player.direction * 0.46, 0.46);
    ctx.rotate(player.bank);

    const engine = 1 + Math.sin(player.enginePulse) * 0.18;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.shadowBlur = 18;
    ctx.shadowColor = COLORS.cyan;
    ctx.fillStyle = 'rgba(0, 255, 243, 0.35)';
    ctx.beginPath();
    ctx.ellipse(-45, 0, 24 * engine, 5.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(216, 255, 0, 0.26)';
    ctx.beginPath();
    ctx.ellipse(-56, 0, 14 * engine, 3.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = this.playerGradient ?? COLORS.cyan;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.92)';
    ctx.lineWidth = 1.6;
    ctx.shadowBlur = 10;
    ctx.shadowColor = COLORS.cyan;

    ctx.beginPath();
    ctx.moveTo(46, 0);
    ctx.lineTo(22, -6);
    ctx.lineTo(2, -8);
    ctx.lineTo(-14, -18);
    ctx.lineTo(-17, -8);
    ctx.lineTo(-43, -6);
    ctx.lineTo(-33, 0);
    ctx.lineTo(-43, 6);
    ctx.lineTo(-17, 8);
    ctx.lineTo(-14, 18);
    ctx.lineTo(2, 8);
    ctx.lineTo(22, 6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#07162f';
    ctx.beginPath();
    ctx.ellipse(17, -2, 8, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(-24, -2, 26, 4);
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
    ctx.fillRect(x + (player.x / this.width) * RADAR_WIDTH - 2, y + height * 0.42, 4, 4);
    for (let index = 0; index < enemies.length; index += 1) {
      const enemy = enemies[index];
      if (!enemy.active) continue;
      ctx.fillStyle = enemy.kind === 'walker' ? COLORS.green : COLORS.cyan;
      ctx.fillRect(x + (enemy.x / this.width) * RADAR_WIDTH - 1.5, y + 4 + (enemy.y / this.height) * 16, 3, 3);
    }
    ctx.restore();
  }

  private drawLifeIcon(x: number, y: number): void {
    const ctx = this.context;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(0.3, 0.3);
    ctx.fillStyle = COLORS.cyan;
    ctx.strokeStyle = COLORS.white;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(30, 0);
    ctx.lineTo(-8, -12);
    ctx.lineTo(-22, 0);
    ctx.lineTo(-8, 12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}
