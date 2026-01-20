
import React from "react";
import { Pebble } from "./Pebble";
import figma from "@figma/code-connect";

type PebbleExampleProps = {
    variant: "primary" | "secondary" | "ghost" | "destructive";
    size: "sm" | "md" | "lg";
    children: React.ReactNode;
    isLoading: boolean;
    disabled: boolean;
    iconLeft: boolean;
    iconRight: boolean;
};

/**
 * -- FIGMA CODE CONNECT --
 * Component: Pebble (Action)
 * Figma Node: [Paste Figma Component URL Here]
 */
figma.connect(
    Pebble,
    "https://www.figma.com/design/YOUR_FILE_ID?node-id=YOUR_NODE_ID",
    {
        props: {
            variant: figma.enum("Variant", {
                Primary: "primary",
                Secondary: "secondary",
                Ghost: "ghost",
                Destructive: "destructive",
            }),
            size: figma.enum("Size", {
                Small: "sm",
                Medium: "md",
                Large: "lg",
            }),
            children: figma.string("Label"),
            isLoading: figma.boolean("Loading"),
            disabled: figma.boolean("Disabled"),
            // Icons act as booleans in this schema, or slots if complex
            iconLeft: figma.boolean("Icon Left"),
            iconRight: figma.boolean("Icon Right"),
        },
        example: ({ variant, size, children, isLoading, disabled, iconLeft, iconRight }: PebbleExampleProps) => (
            <Pebble
                variant={variant}
                size={size}
                isLoading={isLoading}
                disabled={disabled}
                iconLeft={iconLeft ? <span>+</span> : undefined}
                iconRight={iconRight ? <span>→</span> : undefined}
            >
                {children}
            </Pebble>
        ),
    }
);
