# 2026-06-02 — Hecho con Amor Dropdown Fix

## Scope
- Continued work on existing branch `feature/epdc-labs-section`.
- No new branch created.
- No push performed.

## Problem
- The desktop dropdown under the crafted navigation item was affecting the main header layout.
- Root cause: the submenu `ul` was inheriting the same `.mainNav ul` flex-row styling used for the top-level navigation, so it behaved like part of the main nav flow instead of a floating overlay.
- The previous JS-driven `hidden` toggle path was also unnecessary for the requested desktop hover/focus behavior.

## Implementation
- Updated `src/components/Header.astro`:
  - removed the extra toggle button path for desktop dropdown control
  - kept the existing top-level crafted nav item in place
  - kept `EPDC Labs` as the submenu item
  - preserved mobile navigation through `MobileDock`
- Updated `src/styles/Header.module.css`:
  - scoped the top-level navigation list into `.navList` so submenu lists no longer inherit the main flex-row layout
  - kept the crafted item as `position: relative`
  - made the dropdown menu `position: absolute`
  - hid the dropdown by default with:
    - `opacity: 0`
    - `visibility: hidden`
    - `pointer-events: none`
    - slight translate for overlay reveal
  - revealed the dropdown only on:
    - `.navDropdown:hover`
    - `.navDropdown:focus-within`
  - added visible hover/focus styling for the dropdown item

## Accessibility and Interaction Notes
- Keyboard navigation is handled naturally by `:focus-within`:
  - focusing the crafted link opens the submenu
  - tabbing into the submenu keeps it open
  - leaving the dropdown closes it naturally when focus exits
- Added/kept ARIA where the structure supports it:
  - `aria-haspopup="menu"`
  - `aria-controls`
  - submenu `role="menu"`
  - submenu item `role="menuitem"`
- Mobile navigation behavior was preserved and not redesigned.

## Validation
- Ran `npm run build` successfully after the fix.
- Confirmed the submenu is no longer part of the top-level nav list structure by scoping desktop flex styling to `.navList`.
- Confirmed the dropdown is configured as an absolute overlay and hidden by default in CSS.
- Confirmed no layout-affecting JS toggle remains in `Header.astro`.
- Started the local dev server outside the sandbox for live inspection support, but final validation in this environment was primarily build/CSS/markup based.

## Visual Refinement Pass
- Removed the visible border from the dropdown container.
- Removed the filled green hover treatment from the dropdown item.
- Kept the dropdown visually minimal:
  - no border
  - no box shadow
  - no filled hover background
- Moved the dropdown closer to the parent link by reducing the vertical offset.
- Added an invisible hover bridge above the submenu using `::before` so the cursor can move from the parent item into the dropdown without flicker.
- Kept keyboard support via `:focus-within`.
- Kept mobile navigation unchanged.

## Files Modified
- `src/components/Header.astro`
- `src/styles/Header.module.css`
