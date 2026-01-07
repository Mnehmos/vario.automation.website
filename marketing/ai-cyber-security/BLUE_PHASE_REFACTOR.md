# Blue Phase Refactor: AI Cyber Security Consultant Integration

> Refactoring plan for integrating Mnehmos AI Security into vario.automation while maintaining existing brand equity.

## Executive Summary

The current vario.automation website positions as a friendly small-business automation consultant. Adding AI Cyber Security consulting requires a **dual-brand architecture** that can serve both audiences without diluting either message.

---

## Current State Analysis

### Existing Brand Voice (vario.automation)

| Attribute | Current Implementation |
|-----------|----------------------|
| **Hero Text** | "I automate the boring parts of your business." |
| **Tone** | Friendly, approachable, first-person singular |
| **Target** | Small business owners, budget-conscious |
| **Value Prop** | Save time, reduce manual work |
| **Visual** | Light stone palette, copper accents, warm |
| **CTA Style** | "Book a 20-min Consult", "Start here" |

### Target Brand Voice (Mnehmos AI Security)

| Attribute | Required Implementation |
|-----------|------------------------|
| **Hero Text** | "We find the sleepers before they wake up." |
| **Tone** | Authoritative, technical, first-person plural |
| **Target** | Security professionals, engineering leads, CISOs |
| **Value Prop** | Protect AI systems from compromise |
| **Visual** | Darker palette, amber/red accents, serious |
| **CTA Style** | "Request Security Assessment", "Schedule Consultation" |

---

## Refactoring Strategy

### Option A: Subdomain Separation (Recommended)

```
vario.automation/          → Automation consulting (unchanged)
security.vario.automation/ → AI Security consulting (new)
```

**Pros:**
- Clean brand separation
- Different visual identities
- SEO benefits for security keywords
- Doesn't confuse existing audience

**Cons:**
- Additional hosting/deployment
- Cross-linking complexity

### Option B: Path-Based Separation

```
vario.automation/          → Automation consulting
vario.automation/security/ → AI Security consulting
```

**Pros:**
- Single deployment
- Simpler infrastructure

**Cons:**
- Harder to maintain distinct visual identity
- May confuse navigation

### Option C: Unified Brand Evolution

Evolve entire brand toward security focus, reposition automation as subset.

**Pros:**
- Single coherent brand

**Cons:**
- Alienates existing small-business audience
- Loses established positioning

---

## Recommended Implementation (Option A)

### Phase 1: Content Foundation

**Files to create:**

```
marketing/ai-cyber-security/
├── README.md                    ✅ Created
├── BRAND_GUIDELINES.md          ✅ Created
├── BLUE_PHASE_REFACTOR.md       ✅ This file
├── honeypots/
│   ├── sleeper-injection.md     ✅ Created
│   ├── persistence-attacks.md   ⬜ Next
│   ├── exfiltration-patterns.md ⬜ Planned
│   └── social-triggers.md       ⬜ Planned
├── detection/
│   ├── tool-call-auditing.md    ⬜ Planned
│   ├── behavioral-baselines.md  ⬜ Planned
│   └── honeypot-tripwires.md    ⬜ Planned
└── defense/
    ├── ingestion-quarantine.md  ⬜ Planned
    ├── tool-manifests.md        ⬜ Planned
    └── execution-provenance.md  ⬜ Planned
```

### Phase 2: Website Pages

**New pages required:**

| Page | Path | Purpose |
|------|------|---------|
| **Security Home** | `/security/` | Landing page for security practice |
| **Attack Patterns** | `/security/research/` | Index of honeypot content |
| **Services** | `/security/services/` | Security service offerings |
| **Assessment** | `/security/assessment/` | Lead capture for audits |

### Phase 3: Visual Identity

**CSS/Tailwind changes for security pages:**

```css
/* Security-specific theme overrides */
.security-theme {
  --color-primary: #1c1917;      /* stone-900 */
  --color-secondary: #57534e;    /* stone-600 */
  --color-accent: #f59e0b;       /* amber-500 (warning) */
  --color-danger: #ef4444;       /* red-500 */
  --color-success: #22c55e;      /* green-500 */
  --color-background: #0c0a09;   /* stone-950 (darker) */
}
```

**Component modifications:**

| Component | Current | Security Version |
|-----------|---------|------------------|
| **Hero** | Light bg, warm tone | Dark bg, terminal aesthetic |
| **Cards** | White with stone border | Dark with amber accents |
| **Code blocks** | Light theme | Dark theme with syntax highlighting |
| **CTAs** | Copper buttons | Amber/warning-colored buttons |

### Phase 4: Navigation Integration

**Main nav update:**

```astro
<!-- Current -->
<nav>
  <a href="/">Home</a>
  <a href="/services">Services</a>
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
</nav>

<!-- Updated -->
<nav>
  <a href="/">Automation</a>
  <a href="/services">Services</a>
  <a href="/security">Security</a>  <!-- NEW -->
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
</nav>
```

---

## Content Refactoring Tasks

### Homepage (`index.astro`)

**Current Section: "The Mnehmos Ecosystem"**

Add security-focused project:

```astro
<!-- Add to project grid -->
<div class="bg-white rounded-xl border border-stone-200 p-8 hover:border-amber-500 transition-colors group">
  <div class="flex justify-between items-start mb-4">
    <div class="text-xs uppercase tracking-wide text-amber-600 font-bold">Security Research</div>
    <a href="/security/research" class="text-stone-400 hover:text-stone-900 transition-colors">
      <svg class="w-5 h-5"><!-- Shield icon --></svg>
    </a>
  </div>
  <h3 class="font-display text-xl font-semibold text-stone-900 mb-2 group-hover:text-amber-600 transition-colors">
    AI Agent Security
  </h3>
  <p class="text-sm text-stone-600 mb-4">
    Research into prompt injection, sleeper attacks, and defense-in-depth for agentic AI systems.
  </p>
  <div class="flex flex-wrap gap-2 text-xs text-stone-500">
    <span class="bg-amber-100 text-amber-800 px-2 py-1 rounded">Attack Patterns</span>
    <span class="bg-green-100 text-green-800 px-2 py-1 rounded">Defenses</span>
  </div>
</div>
```

### Services Page (`services.astro`)

**Add Security Services Section:**

```astro
<!-- New section after existing services -->
<div id="security" class="mb-20 scroll-mt-32">
  <div class="grid lg:grid-cols-2 gap-12 items-start">
    <div>
      <div class="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
        <svg class="w-8 h-8 text-amber-600"><!-- Shield icon --></svg>
      </div>
      <h2 class="font-display text-3xl font-bold text-stone-900 mb-4">AI Security Consulting</h2>
      <p class="text-stone-600 text-lg mb-6">
        Your AI agents process untrusted content every day. Each document, email, and user input 
        is a potential injection vector. We audit systems and implement defenses.
      </p>
      <h3 class="font-semibold text-stone-900 mb-3">Services:</h3>
      <ul class="space-y-2 text-stone-600">
        <li class="flex items-start gap-2">
          <svg class="w-5 h-5 text-amber-500"><!-- Check icon --></svg>
          Agent Security Audit — Review architecture for injection vulnerabilities
        </li>
        <li class="flex items-start gap-2">
          <svg class="w-5 h-5 text-amber-500"><!-- Check icon --></svg>
          Defense Implementation — Deploy multi-layer protection
        </li>
        <li class="flex items-start gap-2">
          <svg class="w-5 h-5 text-amber-500"><!-- Check icon --></svg>
          Red Team Assessment — Simulated attacks against AI workflows
        </li>
        <li class="flex items-start gap-2">
          <svg class="w-5 h-5 text-amber-500"><!-- Check icon --></svg>
          Incident Response — Investigation and remediation
        </li>
      </ul>
    </div>
    <div class="bg-stone-900 rounded-2xl p-8 text-stone-50">
      <h4 class="font-semibold mb-4 text-amber-400">The Threat</h4>
      <p class="text-stone-300 mb-6">
        Sleeper injections embed conditional payloads that pass initial testing. 
        They trigger days later under specific conditions. By then, the malicious 
        content is long scrolled out of context.
      </p>
      <a href="/security" class="inline-flex items-center text-amber-400 hover:underline">
        Learn about our research
        <svg class="w-4 h-4 ml-1"><!-- Arrow icon --></svg>
      </a>
    </div>
  </div>
</div>
```

### About Page (`about.astro`)

**Update specialties list:**

```astro
<li class="flex items-center gap-2">
  <svg class="w-4 h-4 text-amber-500"><!-- Shield icon --></svg>
  AI agent security
</li>
```

---

## Technical Implementation

### New Page: `/security/index.astro`

```astro
---
import Layout from '../../layouts/Layout.astro';
const base = import.meta.env.BASE_URL;
---

<Layout 
  title="AI Security Consulting | Mnehmos AI Security" 
  description="We audit AI agent systems for prompt injection vulnerabilities and implement defense-in-depth architectures."
>
  <!-- Dark theme wrapper -->
  <div class="bg-stone-950 text-stone-50 min-h-screen">
    
    <!-- Hero -->
    <section class="py-20 lg:py-32">
      <div class="max-w-6xl mx-auto px-6">
        <div class="max-w-3xl">
          <div class="text-amber-400 font-mono text-sm mb-4">MNEHMOS AI SECURITY</div>
          <h1 class="font-display text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6">
            We find the sleepers before they wake up.
          </h1>
          <p class="text-xl text-stone-400 leading-relaxed mb-8">
            Your AI agents process untrusted content every day. Documents, emails, 
            codebases, user inputs. Each one is a potential injection vector.
          </p>
          <div class="flex flex-col sm:flex-row gap-4">
            <a href="/security/assessment" class="inline-flex items-center justify-center gap-2 bg-amber-500 text-stone-900 px-6 py-3 rounded-lg font-semibold hover:bg-amber-400 transition-colors">
              Request Security Assessment
            </a>
            <a href="/security/research" class="inline-flex items-center justify-center gap-2 border border-stone-700 text-stone-300 px-6 py-3 rounded-lg font-semibold hover:border-stone-500 transition-colors">
              Read Our Research
            </a>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Attack preview -->
    <section class="py-16 border-t border-stone-800">
      <div class="max-w-6xl mx-auto px-6">
        <h2 class="font-display text-2xl font-bold mb-8">Latest Research</h2>
        <!-- Honeypot content cards -->
      </div>
    </section>
    
  </div>
</Layout>
```

### Layout Modification for Dark Theme

```astro
<!-- In Layout.astro, add theme support -->
<html lang="en" class:list={[{ 'dark': Astro.url.pathname.startsWith('/security') }]}>
```

---

## File Changes Summary

| File | Action | Priority |
|------|--------|----------|
| `src/pages/security/index.astro` | Create | High |
| `src/pages/security/research/index.astro` | Create | High |
| `src/pages/security/services.astro` | Create | Medium |
| `src/pages/security/assessment.astro` | Create | Medium |
| `src/pages/index.astro` | Update (add security project card) | Medium |
| `src/pages/services.astro` | Update (add security section) | Medium |
| `src/pages/about.astro` | Update (add specialty) | Low |
| `src/styles/global.css` | Add dark theme variables | High |
| `src/layouts/Layout.astro` | Add theme detection | High |

---

## Migration Checklist

- [ ] Create security content foundation (honeypots, detection, defense)
- [ ] Design dark theme variant for security pages
- [ ] Build security landing page
- [ ] Build research index page
- [ ] Add security nav item
- [ ] Update homepage with security project card
- [ ] Update services page with security section
- [ ] Update about page with security specialty
- [ ] Set up security email alias
- [ ] Configure analytics for security pages
- [ ] Create social media presence for security brand

---

## Success Metrics

| Metric | Target | Timeframe |
|--------|--------|-----------|
| Security page views | 1000/month | 3 months |
| Research article shares | 50/article | Per article |
| Assessment requests | 5/month | 3 months |
| Email list signups | 100 | 3 months |

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Brand confusion | Medium | Medium | Clear visual separation, distinct messaging |
| Audience mismatch | Low | High | Separate CTAs, appropriate lead qualification |
| Content cannibalization | Low | Low | Different keyword targets |
| Maintenance overhead | Medium | Medium | Shared components where possible |

---

*Document Version: 1.0*  
*Created: January 2026*  
*Status: Planning*
