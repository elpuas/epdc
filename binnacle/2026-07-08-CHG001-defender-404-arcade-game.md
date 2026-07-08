# CHG001 - Defender-inspired 404 arcade game

## What changed

- Added a reusable Astro canvas component at `src/components/games/Defender/Defender.astro`.
- Added focused TypeScript modules for the arcade loop, input, audio, particles, collision checks, rendering, and Defender-specific gameplay.
- Updated the 404 page to feature the arcade experience with recovery links below the game.
- Added component-scoped styling for the dark neon arcade surface.
- Refined the art direction toward a modern Defender-inspired presentation with denser starfields, scrolling vector terrain, multiple enemy silhouettes, arcade HUD labels, stronger engine trails, and larger impact feedback.
- Continued the arcade visual refinement after studying reference screenshots for composition: added a scanner strip, sharper jagged terrain rhythm, horizontal ship proportions, seeded enemy density, ground scale markers, and less abstract enemy silhouettes.
- Rebalanced the scene toward classic arcade chaos: reduced ship/enemy/projectile scale, seeded clustered waves, added hostile fire, increased ground walkers/civilians/structures, and expanded original vector enemy classes while avoiding copied Defender sprites.

## Why

The 404 page now has a lightweight interactive experience that matches EPDC's modern retro-futuristic visual direction while keeping the implementation dependency-free.

## Breaking changes

None.
