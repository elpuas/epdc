# CHG031: Fix Process Component Animation

## Description
Enhanced the Process component with proper animation and layout to create a smooth scroll-driven interaction.

## Reason
The Process component in the About page wasn't animating as expected. This fix ensures each step animates (scale/fade) as it enters the viewport during scrolling.

## Files Touched
- src/pages/en/about.astro
- src/components/ProcessStep.astro
- src/styles/About.module.css

## Affected Components/Routes
- /en/about
- ProcessStep component

## Changes Made
- Fixed the IntersectionObserver script by removing erroneous code
- Enhanced ProcessStep component with proper layout structure:
  - Added step-icon-wrapper with circular background
  - Aligned icons to the left of content in a responsive flex layout
  - Added step numbers to titles for better readability
- Improved CSS animations with smooth transitions:
  - Enhanced transition properties for more natural animation
  - Added cubic-bezier timing for "pop" effect
  - Added additional styling for all page sections
- Fixed accessibility with proper semantic structure 