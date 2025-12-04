# Next Steps: M3 Styling Update Follow-Up

**Completed:** M3 Styling Update (4 phases)
- ✅ Phase 1: Global Accessibility Reset
- ✅ Phase 2: Token Redefinition (Plus Jakarta Sans, weights, spring easing)
- ✅ Phase 3: HTML Font Update
- ✅ Phase 4: Targeted Cleanup (4 CSS files)

---

## 🚀 Immediate Next Steps (Priority Order)

### 1. **Rebuild Design Tokens CSS** ⚡ CRITICAL
**Why:** Your `tokens.json` was updated but the CSS hasn't been regenerated yet.

```bash
python3 scripts/build-m3-tokens.py
```

This will:
- Generate `frontend/src/styles/m3-design-tokens.css` with new font/weights/easing
- Update Tailwind config patch with new tokens
- Ensure Plus Jakarta Sans Variable is available as a CSS variable

**Estimated Time:** 30 seconds

---

### 2. **Test the Changes Locally** 🧪 HIGH PRIORITY
**Why:** Verify the new font loads and styling works correctly.

```bash
cd frontend
yarn dev
```

**Things to check:**
- [ ] Plus Jakarta Sans font loads correctly (check Network tab)
- [ ] Font displays properly in components
- [ ] Reduced motion preference works (OS settings)
- [ ] No console errors
- [ ] Components using updated tokens look correct

**Estimated Time:** 5-10 minutes

---

### 3. **Continue Styling Fine-Tuning** 📐 HIGH PRIORITY
**Status:** According to migration report, there are still:
- **193 hardcoded spacing values** to fix
- **6 hardcoded colors** to fix  
- **1 hardcoded shadow** to fix

**Tools Available:**
- `scripts/analyze-m3-styling-consistency.sh` - Find hardcoded values
- `scripts/fix-hardcoded-spacing.sh` - Automated spacing fixes
- `scripts/generate-m3-styling-report.py` - Generate detailed report

**Recommended Approach:**
1. Run the analyzer to see what's left:
   ```bash
   ./scripts/analyze-m3-styling-consistency.sh
   ```
2. Review the report
3. Fix remaining issues (automated or manual)

**Estimated Time:** 2-3 hours

---

### 4. **Verify Token Build Script Handles New Tokens** ✅ MEDIUM PRIORITY
**Why:** Make sure the build script properly outputs:
- New font family (`Plus Jakarta Sans Variable`)
- New weights (light: 300, extrabold: 800)
- New spring easing curve

**Check:** After running step 1, verify the generated CSS includes:
- `--md-sys-typescale-font-plain` with Plus Jakarta Sans
- `--md-sys-typescale-weight-light: 300`
- `--md-sys-typescale-weight-extrabold: 800`
- `--md-sys-motion-easing-spring` curve
- `--md-sys-motion-easing-standard` with spring curve

**Estimated Time:** 5 minutes

---

### 5. **Update Component Font References** 🔄 MEDIUM PRIORITY
**Why:** Some components might still reference old font names.

**Search for:**
- `'Inter'` or `'Inter Variable'` in component files
- Hardcoded font-family strings
- Old font-weight values

**Command:**
```bash
grep -r "Inter" frontend/src/components --include="*.tsx" --include="*.css"
```

**Estimated Time:** 15-30 minutes

---

### 6. **Update Migration Status Report** 📊 LOW PRIORITY
**Why:** Document the progress made.

**Update:** `docs/M3_MIGRATION_STATUS_REPORT.md`
- Mark styling fine-tuning as "In Progress"
- Update hardcoded value counts (you fixed 4 CSS files)
- Add notes about accessibility improvements

**Estimated Time:** 10 minutes

---

## 🎯 Recommended Sequence

```
1. Rebuild tokens CSS (30 sec)
   ↓
2. Test locally (5-10 min)
   ↓
3. Continue styling fine-tuning (2-3 hours)
   OR
   Update component font references (15-30 min)
```

---

## 🔍 Quick Verification Checklist

After completing steps 1-2, verify:

- [ ] `frontend/src/styles/m3-design-tokens.css` was updated
- [ ] Font loads correctly in browser DevTools
- [ ] No 404 errors for Plus Jakarta Sans
- [ ] Components display with new font
- [ ] Reduced motion works (test in OS accessibility settings)
- [ ] No TypeScript/ESLint errors
- [ ] No console warnings

---

## 📚 Related Documentation

- `docs/M3_MIGRATION_STATUS_REPORT.md` - Current migration status
- `docs/M3_PHASE3_MIGRATION_GUIDE.md` - Migration guide
- `scripts/build-m3-tokens.py` - Token build script
- `design-system/tokens.json` - Token source (updated)

---

## 🚨 Potential Issues & Solutions

### Issue: Font not loading
**Solution:** Check browser network tab, verify Google Fonts URL is correct

### Issue: CSS variables not updating
**Solution:** Hard refresh browser (Cmd+Shift+R), clear cache

### Issue: Build script errors
**Solution:** Check Python version (3.7+), verify tokens.json is valid JSON

### Issue: Components still use old font
**Solution:** Run grep command (step 5) to find remaining references

---

**Last Updated:** After M3 Styling Update completion

