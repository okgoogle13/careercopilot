#!/usr/bin/env python3
"""
M3 Component Template Generator

Automatically generates M3 Expressive components from templates:
- TSX component file with TypeScript interfaces
- CSS file with M3 token styling
- Storybook story file
- Basic test file

Usage:
    python3 scripts/generate-m3-component.py --name="Select" --type="input"
"""

import argparse
import os
import re
from pathlib import Path
from datetime import datetime

# Project paths
FRONTEND_DIR = Path("frontend/src")
COMPONENTS_DIR = FRONTEND_DIR / "components/ui"
STORIES_DIR = FRONTEND_DIR / "components/ui"

# Component templates
COMPONENT_TSX_TEMPLATE = '''/**
 * M3 Expressive {component_name} Component
 * Implements Material Design 3 {component_description}
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Motion: --md-sys-motion-*
 * - Typography: --md-sys-typescale-*
 * - Elevation: --md-sys-elevation-*
 */
import React from 'react';
import './M3{component_name}.css';

{additional_imports}

export interface M3{component_name}Props extends React.{base_element}Attributes<HTML{base_element_type}> {{
  /**
   * The variant to use
   * @default '{default_variant}'
   */
  variant?: {variants_type};

  /**
   * The color role from M3 palette
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'tertiary' | 'error';

  /**
   * The size of the component
   * @default 'medium'
   */
  size?: {sizes_type};

  /**
   * If true, component is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Content of the component
   */
  children?: React.ReactNode;

  /**
   * Custom className
   */
  className?: string;

  {additional_props}
}}

/**
 * M3 Expressive {component_name} component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3{component_name} variant="{default_variant}" color="primary">
 *   {example_content}
 * </M3{component_name}>
 * ```
 */
export const M3{component_name} = React.forwardRef<HTML{base_element_type}, M3{component_name}Props>(
  (
    {{
      variant = '{default_variant}',
      color = 'primary',
      size = 'medium',
      disabled = false,
      children,
      className = '',
      {prop_destructure}
      ...props
    }},
    ref
  ) => {{
    const classNames = [
      'm3-{component_slug}',
      `m3-{component_slug}--${{variant}}`,
      `m3-{component_slug}--${{color}}`,
      `m3-{component_slug}--${{size}}`,
      disabled && 'm3-{component_slug}--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <{base_element}
        ref={{ref}}
        className={{classNames}}
        disabled={{disabled}}
        data-testid="m3-{component_slug}"
        {{...props}}
      >
        {component_content}
      </{base_element}>
    );
  }}
);

M3{component_name}.displayName = 'M3{component_name}';

export default M3{component_name};
'''

COMPONENT_CSS_TEMPLATE = '''/**
 * M3 Expressive {component_name} Styles
 * Uses Material Design 3 Expressive design tokens
 */

/* ===== BASE {component_name_upper} STYLES ===== */
.m3-{component_slug} {{
  /* Reset */
  border: none;
  outline: none;
  user-select: none;
  -webkit-user-select: none;

  /* Layout */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;

  /* Typography - M3 Label {typography_scale} */
  font-family: var(--md-sys-typescale-font-plain);
  font-size: var(--md-sys-typescale-label{typography_scale}-size);
  font-weight: var(--md-sys-typescale-weight-medium);
  line-height: var(--md-sys-typescale-label{typography_scale}-line-height);
  letter-spacing: var(--md-sys-typescale-label{typography_scale}-tracking);

  /* Shape - M3 {shape_size} */
  border-radius: var(--md-sys-shape-corner-{shape_corner});

  /* Motion */
  transition-property: background-color, box-shadow, color, transform;
  transition-duration: var(--md-sys-motion-duration-short2);
  transition-timing-function: var(--md-sys-motion-easing-standard);
}}

/* ===== SIZE VARIANTS ===== */
.m3-{component_slug}--small {{
  {small_styles}
}}

.m3-{component_slug}--medium {{
  {medium_styles}
}}

.m3-{component_slug}--large {{
  {large_styles}
}}

/* ===== VARIANT: FILLED ===== */
.m3-{component_slug}--filled.m3-{component_slug}--primary {{
  background-color: var(--md-sys-color-primary-50);
  color: var(--md-sys-color-primary-100);
}}

.m3-{component_slug}--filled.m3-{component_slug}--secondary {{
  background-color: var(--md-sys-color-secondary-50);
  color: var(--md-sys-color-secondary-100);
}}

.m3-{component_slug}--filled.m3-{component_slug}--tertiary {{
  background-color: var(--md-sys-color-tertiary-50);
  color: var(--md-sys-color-tertiary-100);
}}

.m3-{component_slug}--filled.m3-{component_slug}--error {{
  background-color: var(--md-sys-color-error-50);
  color: var(--md-sys-color-error-100);
}}

/* ===== VARIANT: OUTLINED ===== */
.m3-{component_slug}--outlined {{
  background-color: transparent;
  border: 1px solid var(--md-sys-color-outline-default);
}}

.m3-{component_slug}--outlined.m3-{component_slug}--primary {{
  color: var(--md-sys-color-primary-50);
  border-color: var(--md-sys-color-primary-50);
}}

/* ===== STATE: HOVER ===== */
.m3-{component_slug}:hover:not(:disabled) {{
  transform: translateY(-1px);
  box-shadow: var(--md-sys-elevation-level1);
}}

/* ===== STATE: FOCUS ===== */
.m3-{component_slug}:focus-visible {{
  outline: 2px solid var(--md-sys-color-primary-50);
  outline-offset: 2px;
}}

/* ===== STATE: DISABLED ===== */
.m3-{component_slug}:disabled,
.m3-{component_slug}--disabled {{
  opacity: 0.38;
  pointer-events: none;
  cursor: not-allowed;
}}

/* ===== RESPONSIVE ===== */
@media (max-width: 600px) {{
  .m3-{component_slug}--large {{
    {responsive_large}
  }}
}}
'''

STORY_TEMPLATE = '''import type {{ Meta, StoryObj }} from '@storybook/react';
import {{ M3{component_name} }} from './M3{component_name}';

const meta: Meta<typeof M3{component_name}> = {{
  title: 'M3/{category}/{component_name}',
  component: M3{component_name},
  tags: ['autodocs'],
  argTypes: {{
    variant: {{
      control: 'select',
      options: [{variants_array}],
    }},
    color: {{
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'error'],
    }},
    size: {{
      control: 'select',
      options: [{sizes_array}],
    }},
  }},
}};

export default meta;
type Story = StoryObj<typeof M3{component_name}>;

export const Primary: Story = {{
  args: {{
    variant: '{default_variant}',
    color: 'primary',
    children: '{example_content}',
  }},
}};

export const AllVariants: Story = {{
  render: () => (
    <div style={{ {{ display: 'flex', gap: '16px', flexWrap: 'wrap' }} }}>
{variant_examples}
    </div>
  ),
}};

export const AllColors: Story = {{
  render: () => (
    <div style={{ {{ display: 'flex', gap: '16px', flexWrap: 'wrap' }} }}>
{color_examples}
    </div>
  ),
}};

export const AllSizes: Story = {{
  render: () => (
    <div style={{ {{ display: 'flex', gap: '16px', alignItems: 'center' }} }}>
{size_examples}
    </div>
  ),
}};

export const Disabled: Story = {{
  args: {{
    variant: '{default_variant}',
    color: 'primary',
    disabled: true,
    children: 'Disabled',
  }},
}};
'''


class M3ComponentGenerator:
    """Generates M3 components from templates."""

    COMPONENT_TYPES = {
        "button": {
            "base_element": "button",
            "base_element_type": "ButtonElement",
            "variants": ["filled", "tonal", "outlined", "text", "elevated"],
            "sizes": ["small", "medium", "large"],
            "category": "Buttons",
            "description": "button with M3 styling",
            "example_content": "Click Me",
            "typography_scale": "Large",
            "shape_corner": "small",
        },
        "input": {
            "base_element": "input",
            "base_element_type": "InputElement",
            "variants": ["outlined", "filled"],
            "sizes": ["small", "medium", "large"],
            "category": "Inputs",
            "description": "text input with M3 styling",
            "example_content": "",
            "typography_scale": "Large",
            "shape_corner": "extraSmall",
        },
        "card": {
            "base_element": "div",
            "base_element_type": "DivElement",
            "variants": ["filled", "elevated", "outlined"],
            "sizes": ["small", "medium", "large"],
            "category": "Surfaces",
            "description": "card surface with M3 styling",
            "example_content": "Card Content",
            "typography_scale": "Medium",
            "shape_corner": "medium",
        },
        "feedback": {
            "base_element": "div",
            "base_element_type": "DivElement",
            "variants": ["filled", "outlined", "tonal"],
            "sizes": ["small", "medium", "large"],
            "category": "Feedback",
            "description": "feedback component with M3 styling",
            "example_content": "Feedback Message",
            "typography_scale": "Medium",
            "shape_corner": "small",
        },
    }

    def __init__(self, name: str, component_type: str):
        self.name = name
        self.component_type = component_type
        self.config = self.COMPONENT_TYPES.get(component_type, self.COMPONENT_TYPES["button"])
        self.component_slug = self.to_kebab_case(name)

    @staticmethod
    def to_kebab_case(text: str) -> str:
        """Convert PascalCase to kebab-case."""
        s1 = re.sub('(.)([A-Z][a-z]+)', r'\1-\2', text)
        return re.sub('([a-z0-9])([A-Z])', r'\1-\2', s1).lower()

    def generate_tsx(self) -> str:
        """Generate TSX component file."""
        variants = self.config["variants"]
        sizes = self.config["sizes"]

        return COMPONENT_TSX_TEMPLATE.format(
            component_name=self.name,
            component_description=self.config["description"],
            component_slug=self.component_slug,
            component_name_upper=self.name.upper(),
            base_element=self.config["base_element"],
            base_element_type=self.config["base_element_type"],
            variants_type=" | ".join([f"'{v}'" for v in variants]),
            sizes_type=" | ".join([f"'{s}'" for s in sizes]),
            default_variant=variants[0],
            example_content=self.config["example_content"],
            additional_imports="",
            additional_props="",
            prop_destructure="",
            component_content="{children}",
        )

    def generate_css(self) -> str:
        """Generate CSS file."""
        # Map shape corner to shape size description
        shape_size_map = {
            "extraSmall": "Extra Small",
            "small": "Small",
            "medium": "Medium",
            "large": "Large",
            "extraLarge": "Extra Large",
        }

        return COMPONENT_CSS_TEMPLATE.format(
            component_name=self.name,
            component_name_upper=self.name.upper(),
            component_slug=self.component_slug,
            typography_scale=self.config["typography_scale"],
            shape_corner=self.config["shape_corner"],
            shape_size=shape_size_map.get(self.config["shape_corner"], "Medium"),
            small_styles="height: 32px;\n  padding: 0 var(--md-sys-spacing-3);",
            medium_styles="height: 40px;\n  padding: 0 var(--md-sys-spacing-6);",
            large_styles="height: 48px;\n  padding: 0 var(--md-sys-spacing-8);",
            responsive_large="height: 40px;",
        )

    def generate_story(self) -> str:
        """Generate Storybook story file."""
        variants = self.config["variants"]
        sizes = self.config["sizes"]

        variant_examples = "\n".join(
            [
                f"      <M3{self.name} variant=\"{v}\">{v.capitalize()}</M3{self.name}>"
                for v in variants
            ]
        )

        color_examples = "\n".join(
            [
                f"      <M3{self.name} color=\"{c}\">{c.capitalize()}</M3{self.name}>"
                for c in ["primary", "secondary", "tertiary", "error"]
            ]
        )

        size_examples = "\n".join(
            [f"      <M3{self.name} size=\"{s}\">{s.capitalize()}</M3{self.name}>" for s in sizes]
        )

        return STORY_TEMPLATE.format(
            component_name=self.name,
            category=self.config["category"],
            variants_array=", ".join([f"'{v}'" for v in variants]),
            sizes_array=", ".join([f"'{s}'" for s in sizes]),
            default_variant=variants[0],
            example_content=self.config["example_content"] or self.name,
            variant_examples=variant_examples,
            color_examples=color_examples,
            size_examples=size_examples,
        )

    def generate_all(self, output_dir: Path = COMPONENTS_DIR):
        """Generate all component files."""
        tsx_content = self.generate_tsx()
        css_content = self.generate_css()
        story_content = self.generate_story()

        # Write files
        os.makedirs(output_dir, exist_ok=True)

        tsx_path = output_dir / f"M3{self.name}.tsx"
        css_path = output_dir / f"M3{self.name}.css"
        story_path = output_dir / f"M3{self.name}.stories.tsx"

        with open(tsx_path, "w") as f:
            f.write(tsx_content)

        with open(css_path, "w") as f:
            f.write(css_content)

        with open(story_path, "w") as f:
            f.write(story_content)

        print(f"✅ Generated M3{self.name} component:")
        print(f"   - {tsx_path}")
        print(f"   - {css_path}")
        print(f"   - {story_path}")

        return {
            "tsx": tsx_path,
            "css": css_path,
            "story": story_path,
        }


def main():
    parser = argparse.ArgumentParser(description="Generate M3 Expressive components from templates")
    parser.add_argument("--name", required=True, help="Component name (e.g., Select, Toggle)")
    parser.add_argument(
        "--type",
        required=True,
        choices=["button", "input", "card", "feedback"],
        help="Component type",
    )
    parser.add_argument(
        "--output",
        default=str(COMPONENTS_DIR),
        help="Output directory",
    )

    args = parser.parse_args()

    print("=" * 60)
    print("M3 Component Template Generator")
    print("=" * 60)

    generator = M3ComponentGenerator(args.name, args.type)
    files = generator.generate_all(Path(args.output))

    print("\n" + "=" * 60)
    print("✨ Component generation complete!")
    print("=" * 60)
    print("\nNext steps:")
    print("  1. Review generated files")
    print("  2. Customize component logic as needed")
    print("  3. Run Storybook to see component: yarn storybook")
    print("  4. Add to migration tracker")


if __name__ == "__main__":
    main()
