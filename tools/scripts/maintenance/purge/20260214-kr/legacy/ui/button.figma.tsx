import React from 'react';
import { Button } from './button';
import figma from '@figma/code-connect';

type ButtonExampleProps = {
    variant: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
    size: 'default' | 'sm' | 'lg' | 'icon';
    label: string;
    disabled: boolean;
};

/**
 * Figma Code Connect - Button Component
 * Strict mapping following DS/Button specification
 */
figma.connect(Button, 'https://www.figma.com/file/IryuGDWixbuDc3RVhC6llE?node-id=NODE_ID', {
    props: {
        variant: figma.enum('variant', {
            'default': 'default',
            'secondary': 'secondary',
            'outline': 'outline',
            'ghost': 'ghost',
            'destructive': 'destructive',
            'link': 'link'
        }),
        size: figma.enum('size', {
            'default': 'default',
            'sm': 'sm',
            'lg': 'lg',
            'icon': 'icon'
        }),
        label: figma.string('label'),
        disabled: figma.boolean('disabled'),
    },
    example: (props: ButtonExampleProps) => (
        <Button
            variant={props.variant}
            size={props.size}
            disabled={props.disabled}
        >
            {props.label}
        </Button>
    ),
});