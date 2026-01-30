---
name: Senior Developer Debugging Protocol
description: Systematic debugging approach to avoid rabbit holes and find root causes fast
---

# Senior Developer Debugging Protocol

## 🎯 Core Philosophy

**"Simple things break simply. Check the obvious first."**

A 40-year veteran debugs differently than a junior. They don't jump to exotic explanations. They methodically eliminate the simple causes before considering complex ones.

---

## 📋 THE DEBUGGING CHECKLIST (Follow In Order)

### Phase 1: UNDERSTAND THE SYMPTOM (2 minutes max)

1. **What EXACTLY is broken?**
   - Not "it doesn't work" → "Grey background renders, no content visible"
   - Not "there's an error" → "TypeError: Cannot read '_rev' of undefined at line 45"

2. **When did it last work?**
   - Check git history: `git log --oneline -10`
   - What changed since then?

3. **Is it ALWAYS broken or SOMETIMES broken?**
   - Reproducible 100%? → Likely code issue
   - Intermittent? → Likely timing/race condition/network

### Phase 2: CHECK THE OBVIOUS (5 minutes max)

**Before blaming frameworks, libraries, or external services:**

1. **Check the component hierarchy (TOP TO BOTTOM)**
   ```
   Root Layout → Nested Layout → Page → Component
   ```
   - What WRAPS the broken component?
   - Is there CSS that could hide/restrict it?
   - Is there a Suspense/Error boundary swallowing errors?

2. **Check for wrapper interference**
   - `display: none` or `visibility: hidden`?
   - `overflow: hidden` cutting off content?
   - `height: 0` or `max-height` constraints?
   - `z-index` causing overlap?
   - Padding/margin pushing content off-screen?

3. **Check the Network tab**
   - Are requests being made?
   - Are they returning 200 or errors?
   - Is the response body what you expect?

4. **Check the Console**
   - Any errors? Read them CAREFULLY
   - Hydration errors often contain THE ANSWER in the diff

### Phase 3: TRACE THE DATA FLOW (10 minutes max)

1. **Add console.log at key points**
   ```javascript
   console.log('Component mounted');
   console.log('Props received:', props);
   console.log('Data fetched:', data);
   ```

2. **Verify each step in the chain**
   - Is the component even mounting?
   - Is the data being passed correctly?
   - Is the render function being called?

3. **Check conditional rendering**
   - Is something returning early?
   - Is a loading state stuck?
   - Is an error boundary catching silently?

### Phase 4: ISOLATE THE PROBLEM (10 minutes max)

1. **Remove wrappers one by one**
   - If component works without parent wrapper → wrapper is the problem
   - If component fails even in isolation → component is the problem

2. **Create minimal reproduction**
   - Strip everything except the broken thing
   - Does it still break? Now you know it's the core issue
   - Does it work? Something you removed was interfering

3. **Binary search the codebase**
   - Comment out half the code
   - Still broken? Problem is in remaining half
   - Works? Problem is in commented half
   - Repeat until found

---

## 🚫 ANTI-PATTERNS TO AVOID

### 1. **Blaming External Factors First**
❌ "Must be a Turbopack bug"
❌ "Must be CORS"
❌ "Must be a package version issue"

✅ First verify: "Is MY code correct?"

### 2. **Changing Multiple Things**
❌ Updating 5 files hoping something fixes it
❌ Reinstalling packages randomly

✅ Change ONE thing → Test → Change next thing

### 3. **Ignoring Error Messages**
❌ "There's an error but let me try something else"

✅ READ the error. The answer is often IN the error message.

### 4. **Not Checking What You Just Changed**
❌ "I removed X, now testing Y"

✅ After EVERY change, verify the CURRENT state

### 5. **Rabbit Hole Diving**
❌ Spending 2 hours researching "Turbopack React.createContext issues"

✅ After 15 minutes with no progress, STOP and re-evaluate assumptions

---

## 🔍 SPECIFIC DEBUGGING SCENARIOS

### UI Not Rendering (Blank/Grey Screen)

1. **Is the component mounting?** → Add console.log in useEffect
2. **Is there an error boundary?** → Check for ErrorBoundary components
3. **Is CSS hiding it?** → Check parent elements for display/visibility/overflow
4. **Is there a loading state?** → Check for Suspense, loading.tsx, isLoading flags
5. **Is height constrained?** → Check for height: 100vh issues with nested layouts

### Hydration Mismatch

1. **Read the HTML diff in the error** → It shows EXACTLY what mismatched
2. **Check for browser-only code** → typeof window !== 'undefined'
3. **Check for dynamic values** → Date.now(), Math.random()
4. **Check for async data** → Data that changes between server and client render

### API/Data Not Loading

1. **Check Network tab** → Is the request even being made?
2. **Check CORS** → Is the origin allowed?
3. **Check response** → Is the API returning what you expect?
4. **Check env vars** → Are they set? Are they the correct values?
5. **Check the data transformation** → Is parsing/mapping correct?

### Third-Party Library Issues

1. **Does the library work in isolation?** → Create minimal test
2. **Is it a version mismatch?** → Check peer dependencies
3. **Is it a SSR vs CSR issue?** → Does it need 'use client'?
4. **Is there a known issue?** → Check GitHub issues (but only AFTER checking your code first)

---

## 🎓 DEBUGGING WISDOM

### The 5 Whys
- "Why is the screen grey?" → Component not rendering
- "Why not rendering?" → Wrapped in main tag
- "Why does main tag matter?" → Has height/padding constraints
- "How did main get there?" → It's in root layout
- "Why wasn't it caught earlier?" → Didn't trace the component tree

### Occam's Razor
The simplest explanation is usually correct.
- Complex: "Turbopack has a React context bug"
- Simple: "There's a CSS rule hiding the content"

### The Rubber Duck Method
Explain the problem out loud, step by step. Often you'll find the answer while explaining.

---

## 📝 DEBUGGING LOG TEMPLATE

When stuck, fill this out:

```
SYMPTOM: [Exact description]
EXPECTED: [What should happen]
ACTUAL: [What actually happens]

CHECKED:
[ ] Component hierarchy traced
[ ] CSS/wrapper interference ruled out
[ ] Network requests verified
[ ] Console errors read carefully
[ ] Error messages analyzed

HYPOTHESIS 1: [Theory]
TEST: [How to verify]
RESULT: [What happened]

HYPOTHESIS 2: [Theory]
TEST: [How to verify]
RESULT: [What happened]
```

---

## ⚡ QUICK FIXES CHECKLIST

Before diving deep, try these quick fixes:

- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Clear .next folder and restart
- [ ] Clear node_modules/.cache
- [ ] Hard refresh (Ctrl+Shift+R)
- [ ] Try Incognito mode
- [ ] Check if it works on a different URL/route
- [ ] Check if the same code works in a fresh component

---

## 🏆 THE SENIOR DEVELOPER MINDSET

1. **Stay calm** - Frustration leads to sloppy debugging
2. **Be systematic** - Follow the checklist, don't skip steps
3. **Check assumptions** - "I'm SURE the layout is fine" → Verify it
4. **Document as you go** - Write down what you've tried
5. **Take breaks** - Fresh eyes see what tired eyes miss
6. **Ask for help** - Describe what you've tried, not just "it's broken"

---

## 🔧 Remember

**The bug is always in the last place you look... because you stop looking after you find it.**

But senior developers find it faster because they look in the RIGHT places FIRST.
