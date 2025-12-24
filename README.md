# Vario Automation Website

Business automation and AI agent services website. Built with Astro + Tailwind CSS.

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deploying to GitHub Pages

1. Create a new GitHub repository
2. Update `astro.config.mjs`:
   - Change `site` to your GitHub Pages URL: `https://yourusername.github.io`
   - Change `base` to your repo name: `/your-repo-name`
3. Push to the `main` branch
4. Go to Settings > Pages > Source: "GitHub Actions"
5. The site will deploy automatically on each push

## Customization Checklist

- [ ] Update `astro.config.mjs` with your GitHub username and repo name
- [ ] Replace placeholder email in `/src/pages/contact.astro`
- [ ] Add your Calendly link in `/src/pages/contact.astro`
- [ ] Set up Formspree (or similar) and update form action URL
- [ ] Update pricing if you want to show specific numbers
- [ ] Add your own case studies as you complete projects
- [ ] Update GitHub link in footer to your profile

## Tech Stack

- **Framework**: Astro 5
- **Styling**: Tailwind CSS 4
- **Fonts**: Space Grotesk (headings) + Inter (body)
- **Deployment**: GitHub Pages via Actions

## Color Palette

- Background: Stone 50 (`#fafaf9`)
- Text: Stone 800/900 (`#292524`, `#1c1917`)
- Accent: Copper (`#B87333`)
- Supporting: Amber, Blue, Green, Purple, Red for service icons

## Structure

```
src/
├── layouts/
│   └── Layout.astro       # Base layout with nav + footer
├── pages/
│   ├── index.astro        # Homepage (conversion page)
│   ├── services.astro     # Detailed services
│   ├── about.astro        # About page
│   └── contact.astro      # Contact form
└── styles/
    └── global.css         # Global styles
```

## Adding Content

### New Case Studies
Edit the "Example builds" section in `src/pages/index.astro`. Each case study follows this format:

```html
<div class="bg-white rounded-xl border border-stone-200 p-8">
  <div class="text-xs uppercase tracking-wide text-stone-400 mb-4">Industry/Type</div>
  <h3 class="font-display text-xl font-semibold text-stone-900 mb-4">Project Name</h3>
  <div class="space-y-4 text-sm">
    <div class="flex gap-3">
      <span class="text-red-500 font-medium shrink-0">Before:</span>
      <span class="text-stone-600">Description of the problem...</span>
    </div>
    <div class="flex gap-3">
      <span class="text-blue-500 font-medium shrink-0">Build:</span>
      <span class="text-stone-600">What you built...</span>
    </div>
    <div class="flex gap-3">
      <span class="text-green-500 font-medium shrink-0">After:</span>
      <span class="text-stone-600">Results and impact...</span>
    </div>
  </div>
</div>
```

## Contact Form Setup

The form uses Formspree by default. To set up:

1. Go to [formspree.io](https://formspree.io)
2. Create a free account
3. Create a new form
4. Copy your form endpoint
5. Replace `https://formspree.io/f/your-form-id` in `contact.astro`

Alternative options: Netlify Forms, Google Forms, or a custom backend.
"# Trigger rebuild with secrets"  
