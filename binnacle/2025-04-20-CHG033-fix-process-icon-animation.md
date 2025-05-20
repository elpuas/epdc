# CHG033: Fix Process Icon Animation on Scroll

## Description
Completely fixed the process icon animation to properly trigger when scrolling into view with a reliable "hop" effect.

## Reason
The animation was still not working correctly due to Astro CSS module scoping issues. Icons were receiving the `.animate` class but the animation wasn't visibly applying.

## Files Touched
- src/pages/en/about.astro
- src/styles/About.module.css
- src/components/ProcessStep.astro

## Affected Components/Routes
- /en/about
- ProcessStep component

## Changes Made
- Addressed Astro CSS module scoping issues:
  - Added `:global()` selector in CSS module to target step icons
  - Added direct animation styles in the component itself as a fallback
  - Used higher specificity selectors to override any conflicting styles
- Enhanced animation with two approaches:
  - Global module CSS animation (iconHop)
  - Component-level animation (iconBounce)
- Improved IntersectionObserver implementation:
  - Added viewport detection for immediate animation of visible elements
  - Added staggered animation with delays between each icon
  - Reset animation state with classList.remove() and forced reflow
  - Added more robust intersection threshold (0.3)
  - Increased initial timeout to 800ms
- Added more dramatic animation:
  - More pronounced bouncing effect with higher scale values
  - Added transform-origin and will-change properties for better performance
  - Added animation-fill-mode: both to ensure final state is preserved
- Added viewport check to animate icons immediately visible on load
- Used force reflow technique to ensure animation can be replayed 