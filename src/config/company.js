/**
 * GRAND VIEW CERAMIC AND MARBLE WORK — single source of truth for company data.
 *
 * This module is the ONLY place company facts should be defined. Pages are rendered from it by
 * `tools/build.mjs` so phone/email/WhatsApp/location can never drift across pages (see ADR-002).
 *
 * It is written as an ES module and also exposes the same object on `window.GV_COMPANY` for the
 * (no-build) static pages. Do not hard-code these values anywhere else.
 */

export const company = {
  name: 'GRAND VIEW CERAMIC AND MARBLE WORK',
  shortName: 'GRAND VIEW',
  descriptor: 'Ceramic & Marble Work',
  tagline: 'Building Better Tomorrows',

  // Canonical contact values. `phoneDial` has no spaces for tel:/wa.me links.
  phoneDisplay: '+971 58 164 5299',
  phoneDial: '+971581645299',
  whatsappUrl: 'https://wa.me/971581645299',
  email: 'grandviewceramic202@gmail.com',
  location: 'Abu Dhabi, United Arab Emirates',
  locationShort: 'Abu Dhabi, UAE',

  // Derived hrefs (kept here so templates never build them by hand).
  telHref: 'tel:+971581645299',
  mailtoHref: 'mailto:grandviewceramic202@gmail.com',

  brand: {
    background: '#080808',
    gold: '#d6aa49',
    goldLight: '#f3d77d',
  },
};

/**
 * Primary navigation. `current` is set per page by the builder.
 * `href` values are relative to the site root (static MPA routing).
 */
export const navigation = [
  { label: 'Home', href: 'index.html', key: 'home' },
  { label: 'About', href: 'about.html', key: 'about' },
  { label: 'Services', href: 'services.html', key: 'services' },
  { label: 'Our Work', href: 'projects.html', key: 'projects' },
];

/** Services shown as cards and used to build service detail links. */
export const services = [
  {
    key: 'tiles',
    title: 'Tile & Marble Work',
    blurb: 'Tile installation, marble and stone surfaces, cuts and detailed finishing.',
    href: 'tiles-marble.html',
  },
  {
    key: 'plumbing',
    title: 'Plumbing & Pipe Fitting',
    blurb: 'Water pipe fitting, fixture installations, connections and repair enquiries.',
    href: 'plumbing.html',
  },
  {
    key: 'electrical',
    title: 'Electrical Work',
    blurb: 'Lighting and fixture installation, switches, sockets, wiring and maintenance enquiries.',
    href: 'electrical.html',
  },
];

/**
 * Client feedback and testimonials (VERIFIED-ONLY).
 * Under the ethical guidelines and fair commercial practices, no quotes or client names
 * are fabricated. When authentic signed reviews are supplied by the owner, they are populated here.
 * If empty, the component remains unrendered in production builds.
 */
export const testimonials = [
  // Empty array until verified client feedback is authorized by the business owner.
  // Schema: { id, clientName, propertyType, scope, quoteEn, quoteAr, isVerified: true }
];

// Expose for classic (non-module) scripts on the static pages.
if (typeof window !== 'undefined') {
  window.GV_COMPANY = { company, navigation, services, testimonials };
}

export default { company, navigation, services, testimonials };
