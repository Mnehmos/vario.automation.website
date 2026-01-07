# Mnehmos AI Security — Brand Guidelines

## Brand Architecture

```
vario.automation (Parent Brand)
├── Automation Services       — "I automate the boring parts"
├── AI Agent Development      — "Custom AI agents for business"
└── Mnehmos AI Security      — "We find the sleepers before they wake up"
```

### Parent vs. Security Brand Comparison

| Attribute | vario.automation | Mnehmos AI Security |
|-----------|------------------|---------------------|
| **Voice** | Friendly, practical | Authoritative, technical |
| **Tone** | Conversational, approachable | Direct, serious |
| **Perspective** | First person ("I build...") | First person plural ("We implement...") |
| **Audience** | Small business owners | Security professionals, engineering leads |
| **Value Prop** | Save time, reduce manual work | Protect AI systems from compromise |
| **Risk Tolerance** | "Start small, iterate" | "Assume breach, verify everything" |

---

## Voice & Tone

### The Mnehmos AI Security Voice

**Authoritative but not arrogant.** We know what we're talking about because we've done the research and built the systems. We share knowledge to establish trust, not to show off.

**Technical but accessible.** We use precise terminology but explain it when necessary. Our audience is technical, but not everyone has the same specialty.

**Direct but not aggressive.** Security marketing often relies on fear. We show real risks without sensationalism. The attacks speak for themselves.

**Practical, not theoretical.** Every attack pattern we document is something that could happen to your systems today. Every defense we recommend is implementable.

### Tone Examples

#### ❌ Don't: Fear-mongering
> "HACKERS ARE COMING FOR YOUR AI! You're probably ALREADY COMPROMISED and don't even know it!!!"

#### ✅ Do: Calm authority
> "Your agent read a README last week. It's been helpful ever since. Are you *sure* it's still working for you?"

#### ❌ Don't: Vague buzzwords
> "We leverage next-gen AI-powered cyber solutions to synergize your security posture."

#### ✅ Do: Specific and concrete
> "We scan ingested content for conditional trigger patterns and flag them for human review before they enter the context window."

#### ❌ Don't: Overpromising
> "Our solution provides 100% protection against all AI attacks."

#### ✅ Do: Honest positioning
> "Current defenses have gaps. Here's where they fail and what we do differently."

---

## Content Structure

### Attack Pattern Articles (Honeypots)

Standard structure for educational attack documentation:

```markdown
## The [Attack Name]: [Descriptive Subtitle]

[Opening hook — why this matters]

---

### The Technique: [Core Mechanism]

[Code example or payload structure]

[Explanation of what happens]

---

### Why This Works

**1. [Factor Name]**
[Explanation]

**2. [Factor Name]**
[Explanation]

[Continue as needed]

---

### Variations

[Code examples of variations]

---

### Why Current Defenses Fail

| Defense | Why It Doesn't Help |
|---------|---------------------|
| ... | ... |

---

### Detection Strategies

[Concrete detection approaches]

---

### The Mnehmos Approach

[Our specific defense implementation]

---

### The Real Question

[Closing hook — provocative question that lingers]

---

**Mnehmos AI Security**
*[Tagline]*

📧 [email]
🌐 [website]
```

### Defense Framework Articles

```markdown
## [Defense Name]: [What It Protects Against]

[Opening — the problem this solves]

---

### The Architecture

[Diagram or ASCII art]

[Explanation of components]

---

### Implementation

[Concrete code or configuration examples]

---

### Limitations

[Honest assessment of what this doesn't cover]

---

### When to Use This

[Guidance on applicability]
```

---

## Visual Identity

### Color Palette

| Use | Color | Hex |
|-----|-------|-----|
| **Primary** | Deep charcoal | `#1c1917` (stone-900) |
| **Secondary** | Warm gray | `#57534e` (stone-600) |
| **Accent** | Warning amber | `#f59e0b` (amber-500) |
| **Alert** | Danger red | `#ef4444` (red-500) |
| **Success** | Secure green | `#22c55e` (green-500) |
| **Background** | Off-white | `#fafaf9` (stone-50) |

### Typography

| Use | Font | Weight |
|-----|------|--------|
| **Headlines** | Space Grotesk | 700 |
| **Body** | Inter | 400 |
| **Code** | JetBrains Mono | 400 |

### Iconography

Use technical/security-themed icons:
- Shield (protection)
- Eye (observation/detection)
- Lock (security)
- Warning triangle (alerts)
- Terminal (technical content)

Avoid:
- Hooded hacker figures
- Matrix-style falling code
- Skull and crossbones
- Stock photo "cyber" imagery

---

## Differentiators

### What Makes Us Different

1. **We Build AI Agents** — We're not external auditors. We build the systems we secure. We understand agent architecture from the inside.

2. **OODA Loop Heritage** — Our approach comes from the same observe-orient-decide-act framework used in military cybersecurity.

3. **Open Research** — We publish our attack research. Honeypot content establishes credibility and advances the field.

4. **Defense-in-Depth** — No silver bullets. We implement multiple overlapping defenses that assume individual components will fail.

5. **Practical Focus** — Everything we recommend is implementable. We don't sell theoretical frameworks.

---

## Messaging Hierarchy

### Primary Message
> AI agents can be compromised through prompt injection. Most defenses focus on obvious attacks. We find the hidden ones.

### Supporting Messages

1. **The Threat is Real**
   > Sleeper injections pass initial testing. They trigger days later under specific conditions.

2. **Current Defenses Have Gaps**
   > Input filtering catches obvious attacks. It misses conditionals that look benign at injection time.

3. **We Have Specific Solutions**
   > Ingestion quarantine, tool manifests, conditional detection, execution provenance, behavioral anomaly detection.

4. **We're Practitioners, Not Just Consultants**
   > We build AI agent systems. We secure what we build.

---

## Call to Action Patterns

### Soft CTA (Educational Content)
> Want to learn more about protecting your AI agents? [Subscribe to our security research →]

### Medium CTA (Assessment)
> Not sure if your AI systems are vulnerable? [Request a security assessment →]

### Hard CTA (Engagement)
> Ready to implement defense-in-depth for your AI agents? [Schedule a consultation →]

---

## Editorial Standards

### Technical Accuracy
- All attack patterns must be testable (even if we don't publish working exploits)
- All defenses must be implementable
- Cite sources for claims about model behavior

### Responsible Disclosure
- Don't publish working exploits for specific systems
- Generalize attack patterns to educational level
- Focus on defense as much as offense

### Code Examples
- Use sanitized, illustrative payloads
- Don't include real URLs or endpoints
- Make it clear what's demonstrative vs. real

---

## Brand Voice Examples for Different Contexts

### Website Copy
> **Mnehmos AI Security**
> 
> Your AI agents process untrusted content every day. Documents, emails, codebases, user inputs. Each one is a potential injection vector.
>
> We audit AI systems for prompt injection vulnerabilities. We implement defense-in-depth architectures. We find the sleepers before they wake up.

### Social Media
> New research: Sleeper injections bypass every common defense.
>
> The payload doesn't trigger at injection time. It waits.
>
> Three days later, a specific condition fires, and your agent curls an attacker endpoint.
>
> Full writeup: [link]

### Email Outreach
> Subject: Your AI agent might be compromised
>
> [Name],
>
> Quick question: Does your AI agent process content from external sources?
>
> If yes, it's a potential sleeper injection target. These attacks embed conditional payloads that pass initial testing and trigger later under specific conditions.
>
> We've documented the attack patterns and built defenses. Happy to share our research or discuss your specific architecture.
>
> Best,
> [Name]
> Mnehmos AI Security

---

## Integration with Parent Brand

When appearing on vario.automation properties:

1. Use the security sub-brand visual identity (darker, more serious)
2. Cross-reference automation services where relevant
3. Position as the "security arm" of the broader practice
4. Maintain consistent footer/contact information

When appearing standalone:

1. Lead with Mnehmos AI Security brand
2. Reference vario.automation in "About" section
3. Emphasize security-specific credentials

---

*Last updated: January 2026*
