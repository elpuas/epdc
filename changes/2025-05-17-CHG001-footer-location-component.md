# Footer Location Component Refactoring

## Description
Created a reusable FooterLocation component to reduce code duplication in the Footer component.

## Reason
The Footer component had three nearly identical location sections with only the content changing. This refactoring improves maintainability by consolidating the repeated structure into a single component.

## Files Touched
- `src/components/FooterLocation.astro` (new)
- `src/components/Footer.astro`

## Note
There was an inconsistency in the original Footer component where Miami and Rome locations used different CSS classes:
- Miami used `officeDetails`, `officeTitle`, `officeEmail`, and `officePhone`
- Rome used `headquartersDetails`, `headquartersTitle`, `headquartersEmail`, and `headquartersPhone`
- Cartago used `locationDetails`, `locationTitle`, `locationEmail`, and `locationPhone`

The new component standardizes on the `locationDetails`, `locationTitle`, `locationEmail`, and `locationPhone` classes. This might require CSS adjustments if there were specific styles for the different location types. 