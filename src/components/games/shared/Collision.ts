export interface CircleBounds {
  x: number;
  y: number;
  radius: number;
}

export class CollisionSystem {
  static circlesOverlap(a: CircleBounds, b: CircleBounds): boolean {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const radius = a.radius + b.radius;
    return dx * dx + dy * dy <= radius * radius;
  }
}
