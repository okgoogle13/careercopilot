# Supplement: Data Visualization System

## Philosophy

Data is political. We do not use neutral blues. We use the colors of the land (Kerala/Australia) to represent truth.

## Semantic Data Palette

### 1. Primary Data (The Truth)

- **Token:** `color-data-primary`
- **Ref:** `var(--color-wattle-gold)`
- **Usage:** The main dataset, the "User's" performance.

### 2. Comparison Data (The Context)

- **Token:** `color-data-comparison`
- **Ref:** `var(--color-kr-leafus-smoke-primary)`
- **Usage:** Averages, benchmarks, "others".

### 3. Alert Data (The Warning)

- **Token:** `color-data-alert`
- **Ref:** `var(--color-waratah-red)`
- **Usage:** Drops in performance, critical thresholds.

### 4. Background Data (The Noise)

- **Token:** `color-data-background`
- **Ref:** `rgba(255, 255, 255, 0.1)`
- **Usage:** Grid lines, axis ticks, inactive segments.

## Typography in Charts

- **Axis Labels:** `JetBrains Mono` (The Annotation), 10px, Uppercase.
- **Tooltips:** `Work Sans` (The Field Note), 12px, Dark Background with Wattle Border.
- **Big Numbers:** `kr-serif-bold` (The Proclamation), Condensed.

## Chart Styles

- **Line Charts:** Thick lines (3px), no smoothing (raw data honesty), dot markers on hover.
- **Bar Charts:** Asymmetric top radius (refer to Shape System).
- **Grid:** Dotted, low opacity (`0.1`).
