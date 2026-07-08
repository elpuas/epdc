# CHG001 - Defender-inspired 404 arcade game

## What changed

- Added a reusable Astro canvas component at `src/components/games/Defender/Defender.astro`.
- Added focused TypeScript modules for the arcade loop, input, audio, particles, collision checks, rendering, and Defender-specific gameplay.
- Updated the 404 page to feature the arcade experience with recovery links below the game.
- Added component-scoped styling for the dark neon arcade surface.
- Refined the art direction toward a modern Defender-inspired presentation with denser starfields, scrolling vector terrain, multiple enemy silhouettes, arcade HUD labels, stronger engine trails, and larger impact feedback.
- Continued the arcade visual refinement after studying reference screenshots for composition: added a scanner strip, sharper jagged terrain rhythm, horizontal ship proportions, seeded enemy density, ground scale markers, and less abstract enemy silhouettes.
- Rebalanced the scene toward classic arcade chaos: reduced ship/enemy/projectile scale, seeded clustered waves, added hostile fire, increased ground walkers/civilians/structures, and expanded original vector enemy classes while avoiding copied Defender sprites.
- Corrected the composition toward Defender's readable rhythm: reduced enemy flood, shortened laser trails, lowered terrain profile, cut excess glow/particles/ground props, and shifted spawning from clutter to wave formations.
- Replaced procedural object artwork with a dedicated SVG asset pack for the player ship, enemies, humanoids, structures, terrain modules, explosion frames, engine flame, and HUD icons; updated the renderer to cache and draw those assets while preserving the existing gameplay loop.
- Reworked the gameplay pacing around explicit calm, attack, and recover wave phases; reduced simultaneous enemies, enemy fire, civilians, structures, and effects so the game reads closer to Defender's balanced arcade rhythm.
- Switched the visual entity renderer to the canonical `public/defender.png` sprite sheet and reworked gameplay toward Defender-style movement: inertial ship control, continuous world scroll, lander abductions, pod-swarmer splits, proximity turret fire, sparse collectible civilians, and controlled waves.
- Separated the 404 page mission copy from the canvas UI and added a first-click arcade briefing flow that focuses the canvas, unlocks WebAudio, and starts gameplay without requiring a second interaction.

## Why

The 404 page now has a lightweight interactive experience that matches EPDC's modern retro-futuristic visual direction while keeping the implementation dependency-free.

## Breaking changes

None.
