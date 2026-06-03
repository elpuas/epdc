## EPDC Conversations multilingual sync

Date: 2026-06-02
Branch: `feature/epdc-labs-section`

### Scope

Synchronized the English and Italian `EPDC Conversations` labs entries with the Spanish version, using Spanish as the source of truth for MDX structure and visual rhythm while preserving the existing localized copy where it was already natural.

### Files updated

- `src/content/labs/epdc-conversations.en.mdx`
- `src/content/labs/epdc-conversations.it.mdx`

### Structural/content synchronization

- Propagated the updated featured image/frontmatter usage present in the Spanish file.
- Added the same screenshot/image blocks used in Spanish.
- Added the same `LabFeatures` / `LabFeatureCard` composition pattern and aligned section ordering.
- Removed the older fallback bullet-list section from English and Italian so all three entries follow the same component-driven structure.
- Added the same closing callout block pattern used in Spanish.

### Translation preservation decisions

- Did not retranslate the entries from scratch.
- Kept the existing English and Italian wording where it already read naturally.
- Applied only the missing structural and emphasis improvements from the Spanish version.
- Preserved localized CTA wording and contact routes for English and Italian.

### Image/component propagation

- Reused the same two internal screenshots referenced by the Spanish entry:
  - `epdc-conversations-settings.webp`
  - `lab-epdc-conversations-dashboard.webp`
- Reused the same MDX component system:
  - `LabFeatures`
  - `LabFeatureCard`
  - `astro:assets` `Image`

### Validation notes

- Verified MDX builds correctly after synchronization.
- Confirmed image imports resolve during Astro build output.
- Confirmed no new hydration issues were introduced since the section remains Astro/MDX-only.
