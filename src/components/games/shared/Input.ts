export interface InputVector {
  x: number;
  y: number;
}

type InputAction = () => void;

const MOVEMENT_KEYS = new Set([
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'KeyW',
  'KeyA',
  'KeyS',
  'KeyD',
]);

export class Input {
  private readonly pressed = new Set<string>();
  private readonly target: HTMLElement;
  private shootPressed = false;
  private escapePressed = false;
  private onEscape?: InputAction;

  constructor(target: HTMLElement, onEscape?: InputAction) {
    this.target = target;
    this.onEscape = onEscape;
    this.target.addEventListener('keydown', this.handleKeyDown);
    this.target.addEventListener('keyup', this.handleKeyUp);
  }

  destroy(): void {
    this.target.removeEventListener('keydown', this.handleKeyDown);
    this.target.removeEventListener('keyup', this.handleKeyUp);
    this.pressed.clear();
  }

  consumeShoot(): boolean {
    const wasPressed = this.shootPressed;
    this.shootPressed = false;
    return wasPressed;
  }

  consumeEscape(): boolean {
    const wasPressed = this.escapePressed;
    this.escapePressed = false;
    return wasPressed;
  }

  getVector(out: InputVector): InputVector {
    out.x = 0;
    out.y = 0;

    if (this.pressed.has('ArrowLeft') || this.pressed.has('KeyA')) out.x -= 1;
    if (this.pressed.has('ArrowRight') || this.pressed.has('KeyD')) out.x += 1;
    if (this.pressed.has('ArrowUp') || this.pressed.has('KeyW')) out.y -= 1;
    if (this.pressed.has('ArrowDown') || this.pressed.has('KeyS')) out.y += 1;

    if (out.x !== 0 && out.y !== 0) {
      out.x *= Math.SQRT1_2;
      out.y *= Math.SQRT1_2;
    }

    return out;
  }

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (MOVEMENT_KEYS.has(event.code) || event.code === 'Space' || event.code === 'Escape') {
      event.preventDefault();
    }

    if (event.code === 'Space') {
      this.shootPressed = true;
      return;
    }

    if (event.code === 'Escape') {
      this.escapePressed = true;
      this.onEscape?.();
      return;
    }

    this.pressed.add(event.code);
  };

  private readonly handleKeyUp = (event: KeyboardEvent): void => {
    this.pressed.delete(event.code);
  };
}
