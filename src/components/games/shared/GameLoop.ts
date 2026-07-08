export type TickHandler = (deltaSeconds: number, elapsedSeconds: number) => void;

const MAX_DELTA_SECONDS = 1 / 30;

export class GameLoop {
  private animationFrame = 0;
  private lastTime = 0;
  private elapsed = 0;
  private running = false;

  constructor(private readonly onTick: TickHandler) {}

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.animationFrame = requestAnimationFrame(this.tick);
  }

  stop(): void {
    if (!this.running) return;
    this.running = false;
    cancelAnimationFrame(this.animationFrame);
  }

  isRunning(): boolean {
    return this.running;
  }

  private readonly tick = (time: number): void => {
    if (!this.running) return;

    const deltaSeconds = Math.min((time - this.lastTime) / 1000, MAX_DELTA_SECONDS);
    this.lastTime = time;
    this.elapsed += deltaSeconds;
    this.onTick(deltaSeconds, this.elapsed);
    this.animationFrame = requestAnimationFrame(this.tick);
  };
}
