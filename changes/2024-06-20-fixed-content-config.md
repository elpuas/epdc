# Fixed Content Configuration

## Description
Fixed the content configuration by removing a duplicate config file that was in the wrong location.

## Reason
The application was encountering build errors due to an invalid import of "../i18n/utils" in a misplaced content configuration file.

## Files Changed
- Deleted: `/src/content.config.ts` - This file was incorrectly placed and contained invalid imports
- Kept: `/src/content/config.ts` - This is the correct location for Astro content collections

## Impact
- Fixed build errors related to content collection configuration
- Ensured correct schema configuration for blog posts is used
- Removed redundant configuration file that was causing conflicts 