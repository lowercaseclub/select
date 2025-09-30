# Background Texture Patterns Guide

This guide shows how to use the State of Startups pattern images to create textured backgrounds and visual elements.

## Available Patterns

Two SVG pattern files are available in `/public/`:

- `pattern-stipple.svg` - Dotted/stippled texture pattern
- `pattern-checker.svg` - Checkerboard/checker texture pattern

## Usage Methods

### 1. CSS Mask for Textured Backgrounds

Use CSS `mask` properties to apply patterns as textures over solid colors:

```css
.textured-background {
  background-color: hsl(var(--brand-500));
  mask-image: url('/pattern-stipple.svg');
  mask-size: 4px;
  mask-repeat: repeat;
  mask-position: center;
}
```

### 2. Inline Styles (React/JSX)

```jsx
<div
  className="bg-brand-300 h-16"
  style={{
    maskImage: 'url("/pattern-checker.svg")',
    maskSize: '4px',
    maskRepeat: 'repeat',
    maskPosition: 'top left',
  }}
/>
```

### 3. Diagonal Stripes Pattern

For diagonal stripe backgrounds (as used in the header):

```jsx
<div
  className="flex-grow"
  style={{
    backgroundImage: `repeating-linear-gradient(
      45deg,
      hsl(var(--border-muted)) 0px,
      hsl(var(--border-muted)) 1px,
      transparent 1px,
      transparent 8px
    )`,
  }}
/>
```

## Pattern Combinations

### Layered Progress Bars

Create animated progress bars with different patterns:

```jsx
// Background layer with stipple pattern
<div
  className="h-full w-full bg-foreground-muted/80"
  style={{
    maskImage: 'url("/pattern-stipple.svg")',
    maskSize: '4px',
    maskRepeat: 'repeat',
  }}
/>

// Animated foreground layer with checker pattern
<div
  className="absolute inset-0 bg-brand"
  style={{
    maskImage: 'url("/pattern-checker.svg")',
    maskSize: '4px',
    maskRepeat: 'repeat',
    clipPath: 'inset(0 100% 0 0)',
    animation: 'terminalLine 10s steps(8, end) 0s infinite',
  }}
/>
```

## Pattern Properties

### Mask Size Options

- `4px` - Standard size (recommended)
- `2px` - Fine texture
- `8px` - Coarse texture

### Mask Position Options

- `center` - Centered pattern
- `top left` - Aligned to top-left
- `top right` - Aligned to top-right

### Color Combinations

#### Brand Colors

```css
/* Primary brand */
background-color: hsl(var(--brand));

/* Brand variants */
background-color: hsl(var(--brand-300));
background-color: hsl(var(--brand-500));
```

#### Muted Colors

```css
/* For subtle backgrounds */
background-color: hsl(var(--foreground-muted));
background-color: hsl(var(--surface-400));
```

## Animation Examples

### Terminal-style Progress Animation

```css
@keyframes terminalLine {
  0% {
    clip-path: inset(0 100% 0 0);
  }
  100% {
    clip-path: inset(0 0 0 0);
  }
}

.animated-progress {
  animation: terminalLine 10s steps(8, end) 0s infinite;
}
```

### Reverse Animation

Add `reverse` to animation for right-to-left progress:

```css
animation: terminalLine 10s steps(8, end) 0s infinite reverse;
```

## Best Practices

1. **Consistent Sizing**: Use `4px` mask-size for uniform appearance
2. **Performance**: Prefer CSS classes over inline styles when possible
3. **Accessibility**: Add `aria-hidden="true"` to decorative elements
4. **Color Contrast**: Ensure sufficient contrast for readability
5. **Animation Timing**: Use staggered delays (0.2-0.6s) for multiple elements

## Example Component

```jsx
const TexturedProgressBar = ({
  bgColor = 'bg-brand',
  pattern = 'pattern-checker.svg',
  delay = '0s',
}) => (
  <div className="relative h-8">
    <div
      className={`h-full w-full ${bgColor}`}
      style={{
        maskImage: `url("/${pattern}")`,
        maskSize: '4px',
        maskRepeat: 'repeat',
        clipPath: 'inset(0 100% 0 0)',
        animation: `terminalLine 10s steps(8, end) ${delay} infinite`,
      }}
    />
  </div>
)
```

This guide provides the foundation for creating consistent textured backgrounds and animated elements using the State of Startups pattern system.
