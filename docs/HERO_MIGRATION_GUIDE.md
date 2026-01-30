# Hero Component Migration Guide

This guide shows you how to refactor each page to use the new `<Hero>` component.

---

## 1. Why Ash Page

### Before (Lines 58-85)
```tsx
<section className="relative min-h-[75vh]...">
  {/* 30+ lines of boilerplate */}
</section>
```

### After
```tsx
import { Hero } from "@/components/ui/Hero";

<Hero
  badge="The Hero Ingredient"
  title="Why Sacred Ash?"
  description="Discover the ancient science and mystical power behind Bhasma, the foundation of Agni medicine."
  bgImage="/whyash.jpg"
  theme="light"
/>
```

---

## 2. Bhasma Rituals Page

### After
```tsx
import { Hero } from "@/components/ui/Hero";

<Hero
  badge="Sacred Practices"
  title="Bhasma Rituals"
  description="The three pathways of ash medicine: Snān (bathing), Lepam (application), and Pāna (consumption)."
  bgImage="/firelineage.jpg"
  theme="light"
/>
```

---

## 3. DIY Recipes Page

### After
```tsx
import { Hero } from "@/components/ui/Hero";

<Hero
  badge="Create at Home"
  title="DIY Sacred Ash Recipes"
  description="Simple, effective rituals you can perform at home with our guidance and sacred ash products."
  bgImage="/ash-recipe-1.jpg"
  theme="light"
/>
```

---

## 4. Science & Mysticism Page

### After
```tsx
import { Hero } from "@/components/ui/Hero";

<Hero
  badge="Two Paths, One Truth"
  title="Science & Mysticism"
  description="Where ancient wisdom meets modern research in the transformative power of sacred ash."
  bgImage="/whyash.jpg"
  theme="light"
/>
```

---

## 5. Ash Water (Agni Jal) Page

### After
```tsx
import { Hero } from "@/components/ui/Hero";

<Hero
  badge="Internal Fire Ritual"
  title="Agni Jal™"
  highlight="Sacred Ash Water"
  description="The ancient practice of consuming ash-infused water to ignite inner transformation and digestive fire."
  bgImage="/agnijal.jpg"
  theme="light"
/>
```

---

## 6. Contact Page

### After
```tsx
import { Hero } from "@/components/ui/Hero";

<Hero
  badge="Get in Touch"
  title="Contact Us"
  description="Have questions about our rituals, products, or retreats? We're here to guide you on your healing journey."
  bgImage="/awt-retreats-1.jpg"
  theme="light"
/>
```

---

## 7. AWT Retreats Page (Dark Theme)

### After
```tsx
import { Hero } from "@/components/ui/Hero";

<Hero
  badge="AWT Retreats"
  title="Transformative Healing Experiences"
  description="Immerse yourself in sacred fire ceremonies and personalized healing protocols."
  bgImage="/hero-2.jpg"
  theme="dark"  // ← Dark theme for premium feel
/>
```

---

## 8. Shop Page (Custom Dark Layout)

The Shop page uses a **custom split layout** with product previews. Keep the existing custom hero or migrate to:

```tsx
<Hero
  badge="Sacred Collection"
  title="Agni-Infused™"
  highlight="Products"
  description="Discover our collection of sacred ash products, each prepared through the ancient Agni-Saṃskāra process."
  bgImage="/package-1.jpg"
  theme="dark"
  minHeight="min-h-[60vh]"
>
  {/* Custom product preview cards can go here */}
</Hero>
```

---

## General Migration Steps

### Step 1: Add Import
```tsx
import { Hero } from "@/components/ui/Hero";
```

### Step 2: Replace `<section>` with `<Hero>`
Find the hero section (usually starts with `<section className="relative min-h-[75vh]...">`)

### Step 3: Map Old Props to New Props
| Old Code | New Prop |
|----------|----------|
| Badge text (in `<span>`) | `badge="Badge Text"` |
| `<h1>` content | `title="Title Text"` |
| Highlighted text (if separate) | `highlight="Highlight"` |
| `<p>` description | `description="Description text"` |
| Background `src="/image.jpg"` | `bgImage="/image.jpg"` |
| Light/cream colors | `theme="light"` |
| Dark/navy colors | `theme="dark"` |

### Step 4: Remove Old Imports (if unused)
If the page only imported `framer-motion` for the hero, you can remove it:
```tsx
// Remove if only used for hero
import { motion } from "framer-motion"; // ❌
```

### Step 5: Test
Run `npm run dev` and verify the page looks identical.

---

## Theme Selection Guide

### Use `theme="light"` for:
- About
- Why Ash
- Bhasma Rituals
- DIY Recipes
- Science & Mysticism
- Ash Water
- Contact

### Use `theme="dark"` for:
- AWT Retreats
- Shop (premium product feel)

### Use `theme="split"` for:
- Homepage (multi-slide carousel with grid layout)

---

## Expected Results

### Before Migration (All Pages Combined)
- ~400 lines of duplicated hero code
- 10+ files to update for style changes
- Inconsistent animations

### After Migration
- ~70 lines total (7 lines per page × 10 pages)
- 1 file to update (`Hero.tsx`)
- Perfect consistency

**Time Saved**: ~2-3 hours per future hero update
**Code Reduction**: 82%

---

## Need Help?

If a page has a unique hero layout (like custom badges or extra elements), you can:

1. **Use the `children` prop**:
   ```tsx
   <Hero title="..." theme="light">
     <div className="mt-8">
       {/* Custom content here */}
     </div>
   </Hero>
   ```

2. **Extend the Hero component** with new props if needed

3. **Keep the custom hero** if it's too different (like Shop with product previews)

Happy refactoring! 🚀
