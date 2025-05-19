# Astro Image Component Optimization

## Description
Replaced standard HTML `<img>` tags with Astro's native `<Image />` component for improved performance and optimization across the English homepage and its components.

## Reason
To take advantage of Astro's built-in image optimization features including:
- Automatic responsive image generation
- Improved Core Web Vitals (LCP, CLS)
- WebP/AVIF format conversion
- Lazy loading and proper image sizing
- Reduced build size and bandwidth usage

## Files Touched
- `src/pages/en/index.astro`
- `src/components/TrustedBy.astro`
- `src/components/CaseStudySection.astro`

## Implementation Details

### General Improvements
- Imported the `<Image />` component from `astro:assets`
- Statically imported image assets from the assets directory
- Added explicit width and height attributes to prevent layout shifts
- Maintained original alt text and accessibility attributes
- Added appropriate class names for styling consistency

### Component-Specific Changes

#### TrustedBy Component
- Imported all partner logos statically from the assets directory
- Replaced `<img>` tags with `<Image />` components
- Added explicit width and height attributes (320×160)
- Added appropriate class names to maintain existing styles and filters
- Preserved the layout and visual appearance

#### CaseStudySection Component
- Modified the component to accept both string paths and ImageMetadata
- Added conditional rendering to support both formats for backward compatibility
- Used explicit width and height (600×400) with the case study image
- Added appropriate class name for styling

#### Index Page
- Imported the case study image statically
- Updated the CaseStudySection component props to use the imported image
- Maintained all existing layout and styling

### Performance Benefits
- Reduced initial page load time through optimized image formats
- Eliminated layout shifts by specifying image dimensions
- Enhanced SEO through proper image handling
- Improved accessibility with consistent image loading behavior 