export interface Particle {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  life: number;
  maxLife: number;
  hue: number;
}

export class ParticlePool {
  readonly particles: Particle[];
  private cursor = 0;

  constructor(size: number) {
    this.particles = Array.from({ length: size }, () => ({
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      radius: 1,
      life: 0,
      maxLife: 1,
      hue: 190,
    }));
  }

  emit(x: number, y: number, vx: number, vy: number, radius: number, life: number, hue: number): void {
    const particle = this.next();
    particle.active = true;
    particle.x = x;
    particle.y = y;
    particle.vx = vx;
    particle.vy = vy;
    particle.radius = radius;
    particle.life = life;
    particle.maxLife = life;
    particle.hue = hue;
  }

  burst(x: number, y: number, count: number, speed: number, hue: number): void {
    for (let index = 0; index < count; index += 1) {
      const particle = this.next();
      const angle = (index / count) * Math.PI * 2;
      const variance = 0.45 + ((index * 37) % 100) / 160;
      particle.active = true;
      particle.x = x;
      particle.y = y;
      particle.vx = Math.cos(angle) * speed * variance;
      particle.vy = Math.sin(angle) * speed * variance;
      particle.radius = 1.6 + (index % 4) * 0.8;
      particle.life = 0.42 + (index % 5) * 0.04;
      particle.maxLife = particle.life;
      particle.hue = hue;
    }
  }

  update(deltaSeconds: number): void {
    for (let index = 0; index < this.particles.length; index += 1) {
      const particle = this.particles[index];
      if (!particle.active) continue;

      particle.life -= deltaSeconds;
      if (particle.life <= 0) {
        particle.active = false;
        continue;
      }

      particle.x += particle.vx * deltaSeconds;
      particle.y += particle.vy * deltaSeconds;
      particle.vx *= 0.985;
      particle.vy *= 0.985;
    }
  }

  private next(): Particle {
    const particle = this.particles[this.cursor];
    this.cursor = (this.cursor + 1) % this.particles.length;
    return particle;
  }
}
