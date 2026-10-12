# RTL QA Checklist — GRAND VIEW

## Pre-Release Verification Checklist for Arabic Pages

### 1. Document Attributes & Meta
- [x] Page tag: `<html lang="ar" dir="rtl">` on all 8 pages in `dist/ar/`.
- [x] `<title>` and `<meta name="description">` populated in Arabic.
- [x] OpenGraph locale set to `ar_AE`.
- [x] JSON-LD valid and uncorrupted.

### 2. Layout & Directional Flow
- [x] Content flows logically from right to left across all sections.
- [x] Header brand emblem appears on the right; navigation links flow right-to-left.
- [x] Language switcher displays Arabic label (`العربية`) and operates smoothly.
- [x] Mobile menu slides and aligns consistently in RTL mode.
- [x] Skip link jumps cleanly to main content and anchors on the right.
- [x] WhatsApp floating button relocated to bottom-left (`[dir="rtl"] .whatsapp-float { left: 21px; right: auto; }`) to prevent overlap with standard thumb zone and RTL text flow.

### 3. Typography & Text Legibility
- [x] Arabic type renders with natural line wraps without clipped ascenders/descenders.
- [x] Mixed-language text (brand abbreviations "GV", phone numbers) displays in logical reading order without bidirectionality glitches.
- [x] Numerical values in phone numbers (`+971 58 164 5299`) maintain left-to-right digit sequence.

### 4. Form & Interactions
- [x] Form input labels right-aligned with asterisks (`*`) clearly visible.
- [x] Input text and placeholder alignments respect RTL.
- [x] Client validation feedback (`#form-status`) presents proper Arabic messaging.
- [x] WhatsApp draft message builds with valid UTF-8 Arabic text encoding via `encodeURIComponent`.
