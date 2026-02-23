#!/usr/bin/env python3
"""
Scaffold M3 Expressive Component Boilerplate

Usage:
    python3 scripts/scaffold-m3-component.py Input Sidebar Navbar AppShell

    # Creates:
    # frontend/src/components/m3-expressive/input/
    # frontend/src/components/m3-expressive/sidebar/
    # frontend/src/components/m3-expressive/navbar/
    # frontend/src/components/m3-expressive/appshell/

    # Each with:
    # - M3[Component].tsx
    # - M3[Component].css
    # - M3[Component].test.tsx
    # - M3[Component].stories.tsx
    # - index.ts
"""

import os
import sys
from pathlib import Path

# Convert component name to proper casing
def to_pascal_case(name: str) -> str:
    """Convert input/Input/INPUT to Input"""
    return name[0].upper() + name[1:].lower()

def to_kebab_case(name: str) -> str:
    """Convert Input to input"""
    return name.lower()

def scaffold_component(component_name: str):
    """Generate boilerplate files for M3 component"""

    pascal_name = to_pascal_case(component_name)
    kebab_name = to_kebab_case(component_name)

    # Create directory
    component_dir = Path(f"frontend/src/components/m3-expressive/{kebab_name}")
    component_dir.mkdir(parents=True, exist_ok=True)

    print(f"📁 Creating {component_dir}/")

    # 1. TypeScript Component
    tsx_file = component_dir / f"M3{pascal_name}.tsx"
    if not tsx_file.exists():
        tsx_content = f"""/**
 * M3 Expressive {pascal_name} Component
 * Implements Material Design 3 {pascal_name} for CareerCopilot
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Typography: --md-sys-typescale-*
 * - Spacing: --md-sys-spacing-*
 * - Motion: --md-sys-motion-*
 * - Elevation: --md-sys-elevation-*
 *
 * NOTE: CSS styles (M3{pascal_name}.css) must be imported in the application root
 * or in pages that use this component.
 */

import React from 'react';

export interface M3{pascal_name}Props
  extends React.HTMLAttributes<HTMLDivElement> {{
  /**
   * [Add your variant prop]
   * @default 'default'
   */
  // variant?: 'default' | 'variant2';

  /**
   * [Add your color prop]
   * @default 'primary'
   */
  // color?: 'primary' | 'secondary' | 'tertiary' | 'error';

  /**
   * Component content
   */
  children?: React.ReactNode;
}}

/**
 * M3 Expressive {pascal_name} component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3{pascal_name}>Content</M3{pascal_name}>
 * ```
 */
export const M3{pascal_name} = React.forwardRef<
  HTMLDivElement,
  M3{pascal_name}Props
>(
  (
    {{
      // variant = 'default',
      // color = 'primary',
      className = '',
      children,
      ...props
    }},
    ref
  ) => {{
    const classNames = [
      'm3-{kebab_name}',
      // `m3-{kebab_name}--${{variant}}`,
      // `m3-{kebab_name}--${{color}}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={{ref}}
        className={{classNames}}
        {{...props}}
      >
        {{children}}
      </div>
    );
  }}
);

M3{pascal_name}.displayName = 'M3{pascal_name}';

export default M3{pascal_name};
"""
        with open(tsx_file, 'w') as f:
            f.write(tsx_content)
        print(f"  ✅ M3{pascal_name}.tsx")

    # 2. CSS Module
    css_file = component_dir / f"M3{pascal_name}.css"
    if not css_file.exists():
        css_content = f"""/**
 * M3 Expressive {pascal_name} Styles
 * Uses Material Design 3 Expressive design tokens
 *
 * Token Reference:
 * - Colors: var(--md-sys-color-primary-*), var(--md-sys-color-secondary-*), etc.
 * - Spacing: var(--md-sys-spacing-1) through var(--md-sys-spacing-32)
 * - Shapes: var(--md-sys-shape-corner-small), var(--md-sys-shape-corner-medium), etc.
 * - Elevation: var(--md-sys-elevation-level0) through var(--md-sys-elevation-level5)
 * - Motion: var(--md-sys-motion-duration-short1) through var(--md-sys-motion-duration-long4)
 */

/* ===== BASE {pascal_name.upper()} STYLES ===== */
.m3-{kebab_name} {{
  display: flex;
  align-items: center;
  justify-content: center;
  /* TODO: Add base styling */
  transition: background-color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
}}

/* ===== VARIANT STYLES ===== */
/* .m3-{kebab_name}--variant1 {{
  TODO: Add variant styling
}}

.m3-{kebab_name}--variant2 {{
  TODO: Add variant styling
}} */

/* ===== COLOR ROLES ===== */
/* .m3-{kebab_name}--primary {{
  color: var(--md-sys-color-primary-50);
  background-color: var(--md-sys-color-primary-container);
}}

.m3-{kebab_name}--secondary {{
  color: var(--md-sys-color-secondary-50);
  background-color: var(--md-sys-color-secondary-container);
}} */

/* ===== HOVER/ACTIVE/FOCUS STATES ===== */
/* .m3-{kebab_name}:hover {{
  box-shadow: var(--md-sys-elevation-level1);
}}

.m3-{kebab_name}:active {{
  transform: scale(0.98);
}} */

/* ===== DISABLED STATE ===== */
/* .m3-{kebab_name}:disabled {{
  opacity: 0.38;
  cursor: not-allowed;
}} */

/* ===== RESPONSIVE ===== */
/* @media (max-width: 600px) {{
  .m3-{kebab_name} {{
    /* TODO: Mobile styles */
  }}
}} */
"""
        with open(css_file, 'w') as f:
            f.write(css_content)
        print(f"  ✅ M3{pascal_name}.css")

    # 3. Test File
    test_file = component_dir / f"M3{pascal_name}.test.tsx"
    if not test_file.exists():
        test_content = f"""import React from 'react';
import {{ render, screen }} from '@testing-library/react';
import {{ M3{pascal_name} }} from './M3{pascal_name}';

describe('M3{pascal_name} Component', () => {{
  // Basic Rendering Tests
  describe('Basic Rendering', () => {{
    test('renders with default props', () => {{
      render(<M3{pascal_name}>Content</M3{pascal_name}>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    }});

    test('applies base class', () => {{
      const {{ container }} = render(<M3{pascal_name}>Test</M3{pascal_name}>);
      const element = container.querySelector('.m3-{kebab_name}');
      expect(element).toBeInTheDocument();
    }});

    test('forwards custom className', () => {{
      const {{ container }} = render(
        <M3{pascal_name} className="custom-class">Test</M3{pascal_name}>
      );
      const element = container.querySelector('.custom-class');
      expect(element).toBeInTheDocument();
    }});
  }});

  // TODO: Add variant tests
  // TODO: Add color tests
  // TODO: Add event handler tests
  // TODO: Add ref forwarding tests
  // TODO: Add accessibility tests
}});
"""
        with open(test_file, 'w') as f:
            f.write(test_content)
        print(f"  ✅ M3{pascal_name}.test.tsx")

    # 4. Storybook File
    stories_file = component_dir / f"M3{pascal_name}.stories.tsx"
    if not stories_file.exists():
        stories_content = f"""import type {{ Meta, StoryObj }} from '@storybook/react';
import {{ M3{pascal_name} }} from './M3{pascal_name}';

/**
 * M3 Expressive {pascal_name} Component
 *
 * [Add description]
 */
const meta: Meta<typeof M3{pascal_name}> = {{
  component: M3{pascal_name},
  title: 'M3 Expressive/{pascal_name}',
  parameters: {{
    layout: 'centered',
  }},
  tags: ['autodocs'],
  argTypes: {{
    // TODO: Add argTypes for variants and props
  }},
}};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default {pascal_name}
 */
export const Default: Story = {{
  args: {{
    children: 'Content',
  }},
}};

// TODO: Add additional stories for variants, colors, sizes, etc.
"""
        with open(stories_file, 'w') as f:
            f.write(stories_content)
        print(f"  ✅ M3{pascal_name}.stories.tsx")

    # 5. Index Export File
    index_file = component_dir / "index.ts"
    if not index_file.exists():
        index_content = f"export {{ M3{pascal_name}, type M3{pascal_name}Props }} from './M3{pascal_name}';\n"
        with open(index_file, 'w') as f:
            f.write(index_content)
        print(f"  ✅ index.ts")

    print(f"✨ {pascal_name} component scaffolded!\n")

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/scaffold-m3-component.py ComponentName1 ComponentName2 ...")
        print("Example: python3 scripts/scaffold-m3-component.py Input Sidebar Navbar AppShell")
        sys.exit(1)

    components = sys.argv[1:]

    print("🚀 M3 Expressive Component Scaffolder\n")

    for component in components:
        try:
            scaffold_component(component)
        except Exception as e:
            print(f"❌ Error scaffolding {component}: {e}")

    print("\n✅ All components scaffolded!")
    print("\n📝 Next Steps:")
    print("1. Review the generated files in frontend/src/components/m3-expressive/")
    print("2. Update TypeScript interfaces with your variant and color props")
    print("3. Fill in CSS styling with M3 tokens")
    print("4. Add test implementations")
    print("5. Document in Storybook stories")
    print("\n💡 Use Cursor AI to fill in the implementation details!")

if __name__ == "__main__":
    main()
