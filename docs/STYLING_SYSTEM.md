# Vishwa Wellness - Styling System Documentation

## Overview
This document outlines the comprehensive theme-based styling system implemented across the Vishwa Wellness website to ensure consistent text readability and color inheritance across light and dark backgrounds.

## Core Principles

### 1. **Color Inheritance Over Hardcoding**
- Text colors now inherit from parent containers
- Headings automatically adapt to their background context
- Secondary text uses opacity for visual hierarchy

### 2. **Automatic Theme Adaptation**
- Light backgrounds (cream, white, beige) → Navy text
- Dark backgrounds (navy) → White text
- No manual color overrides needed

## Implementation Details

### Global Styles (`globals.css`)

#### Heading Color Inheritance
```css
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  font-weight: 600;
  color: inherit;  /* Changed from var(--color-dark) */
  line-height: 1.3;
  margin-bottom: 0.5em;
}

/* Ensure headings are white in dark containers */
.text-white h1,
.text-white h2,
.text-white h3,
.text-white h4,
.text-white h5,
.text-white h6 {
  color: #ffffff;
}
```

### Component System

#### Section Component (`Section.tsx`)
```tsx
const backgrounds = {
  cream: "bg-[var(--color-cream)] text-[var(--color-navy)]",
  white: "bg-white text-[var(--color-navy)]",
  beige: "bg-[var(--color-beige)] text-[var(--color-navy)]",
  navy: "bg-[var(--color-navy)] text-white",
};
```

**Features:**
- Automatically sets appropriate text color based on background
- Children inherit the section's text color
- No manual color overrides needed

#### SectionHeading Component
```tsx
export function SectionHeading({
  title,
  subtitle,
  align = "center",
  className,
  titleClassName,
  subtitleClassName,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl mb-12", alignments[align], className)}>
      <h2 className={cn(
        "font-[family-name:var(--font-playfair)] text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 text-balance",
        titleClassName
      )}>
        {title}
      </h2>
      {subtitle && (
        <p className={cn(
          "text-lg leading-relaxed",
          subtitleClassName
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
```

**Features:**
- Inherits color from parent Section
- Optional className overrides for special cases
- Automatically white on navy backgrounds, navy on light backgrounds

#### Card Components (`Card.tsx`)
```tsx
export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={cn(
      "font-[family-name:var(--font-playfair)] text-xl font-semibold mb-2",
      className
    )}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <p className={cn("text-sm leading-relaxed", className)}>
      {children}
    </p>
  );
}
```

**Features:**
- Removed hardcoded colors
- Inherit from parent Card or container
- Allow custom className for special styling

## Page-Level Updates

### Pages Updated for Consistency

1. **Contact Page** (`contact/page.tsx`)
   - ✅ "Prefer to Talk?" card - white text on navy background

2. **Why Ash Page** (`why-ash/page.tsx`)
   - ✅ "How We Prepare Our Ash" section - white headings on navy
   - ✅ Process steps - white titles on dark background

3. **Bhasma Rituals Page** (`bhasma-rituals/page.tsx`)
   - ✅ "Recommended Products" cards - white headings on navy cards

4. **Ash Water Page** (`ash-water/page.tsx`)
   - ✅ All sections use inheritance
   - ✅ Benefits cards adapt to background
   - ✅ Safety section maintains readability

5. **AWT Retreats Page** (`awt-retreats/page.tsx`)
   - ✅ Retreat cards with proper hierarchy
   - ✅ Testimonials with opacity-based secondary text

6. **DIY Recipes Page** (`diy-recipes/page.tsx`)
   - ✅ Recipe cards with consistent styling
   - ✅ Ingredient lists use opacity for hierarchy
   - ✅ Navy CTA section with white text

7. **Science & Mysticism Page** (`science-mysticism/page.tsx`)
   - ✅ Comparison cards with theme inheritance
   - ✅ Research studies section
   - ✅ Navy CTA with proper contrast

8. **Agni Products Page** (`agni-products/page.tsx`)
   - ✅ Product cards inherit theme
   - ✅ Category sections maintain consistency
   - ✅ CTA section with white text

9. **About Page** (`about/page.tsx`)
   - ✅ Hero section
   - ✅ Timeline with proper contrast
   - ✅ Team cards with inheritance
   - ✅ Values section

## Text Hierarchy Guidelines

### Primary Text
- **Headings (h1-h6)**: Inherit from container
- **Body text (p)**: Inherit from container

### Secondary Text
- Use `opacity-70` or `opacity-80` instead of hardcoded lighter colors
- Examples:
  - `opacity-80` - Descriptions, supporting text
  - `opacity-70` - Metadata, less important info

### Accent Colors
- Terracotta (`--color-terracotta`) - CTAs, highlights
- Gold (`--color-gold`) - Sacred elements, icons
- Ochre (`--color-ochre`) - Fire-related elements

## Usage Examples

### Creating a New Section

```tsx
// Light background section - text auto navy
<Section background="cream">
  <SectionHeading
    title="Your Title"
    subtitle="Your subtitle"
  />
  <p>Body text will be navy</p>
</Section>

// Dark background section - text auto white
<Section background="navy">
  <SectionHeading
    title="Your Title"
    subtitle="Your subtitle"
  />
  <p>Body text will be white</p>
</Section>
```

### Creating Cards

```tsx
// Regular card on light background
<Card>
  <CardContent>
    <CardTitle>Title is navy</CardTitle>
    <CardDescription>Description is navy</CardDescription>
  </CardContent>
</Card>

// Dark card
<Card className="bg-[var(--color-navy)] text-white">
  <CardContent>
    <CardTitle>Title is white</CardTitle>
    <CardDescription>Description is white</CardDescription>
  </CardContent>
</Card>
```

### Secondary Text

```tsx
// Instead of text-[var(--color-ash)]
<p className="opacity-80">Secondary information</p>

// Instead of text-[var(--color-charcoal)]
<span className="opacity-90">Less emphasis</span>
```

## Benefits

1. **Consistency**: Uniform styling across all pages
2. **Maintainability**: Single source of truth for theme colors
3. **Flexibility**: Easy to add new themes or dark mode
4. **Accessibility**: Always ensures sufficient contrast
5. **DX**: Less code, fewer manual color specifications

## Migration Guide

When creating new components or pages:

1. ✅ Use Section components with background prop
2. ✅ Use SectionHeading instead of custom h2
3. ✅ Use Card components for card layouts
4. ✅ Use opacity instead of hardcoded light colors
5. ❌ Avoid hardcoding text-[var(--color-navy)] or text-[var(--color-ash)]

## Common Patterns

### Hero Sections
```tsx
<section className="relative min-h-[60vh] flex items-center justify-center pt-20">
  <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-beige)] to-[var(--color-cream)]" />
  <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
    <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl lg:text-6xl font-semibold mb-6">
      Title
    </h1>
    <p className="text-xl max-w-2xl mx-auto opacity-80">
      Subtitle
    </p>
  </div>
</section>
```

### CTA Sections
```tsx
<Section background="navy">
  <div className="text-center max-w-2xl mx-auto">
    <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold mb-6">
      Call to Action
    </h2>
    <p className="opacity-80 mb-8">
      Description text
    </p>
    <Link href="/path">
      <Button className="bg-white !text-[var(--color-navy)]">
        Action Button
      </Button>
    </Link>
  </div>
</Section>
```

## Color Variables Reference

```css
--color-navy: #1a365d
--color-cream: #faf8f5
--color-beige: #f0e6d9
--color-terracotta: #c65d47
--color-ochre: #d4a259
--color-gold: #c9a961
--color-forest: #2d5016
--color-ash: #6b7280
--color-charcoal: #374151
--color-dark: #1f2937
```

## Testing Checklist

When updating pages, verify:
- [ ] Text is readable on all background variants
- [ ] Headings are appropriate color (white on dark, navy on light)
- [ ] No hardcoded text-[var(--color-navy)] or similar
- [ ] Secondary text uses opacity
- [ ] Cards inherit properly
- [ ] CTA sections have proper contrast
- [ ] No accessibility issues with color contrast

## Troubleshooting

### Issue: Text not visible on dark background
**Solution**: Ensure parent has `text-white` or `background="navy"` on Section

### Issue: Heading still showing dark color
**Solution**: Remove any hardcoded `text-[var(--color-navy)]` from the heading

### Issue: Want specific color for emphasis
**Solution**: Use accent colors like `text-[var(--color-terracotta)]` or `text-[var(--color-gold)]`

---

Last Updated: 2026-01-21
Maintained by: Vishwa Wellness Development Team
