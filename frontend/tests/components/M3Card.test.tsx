import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { M3Card, M3CardHeader, M3CardContent, M3CardActions } from '@/components/ui/M3Card';

describe('M3Card', () => {
    describe('Rendering', () => {
        it('renders children content', () => {
            render(<M3Card>Card Content</M3Card>);
            expect(screen.getByText('Card Content')).toBeInTheDocument();
        });

        it('applies correct variant class', () => {
            const { container } = render(<M3Card variant="pebble">Content</M3Card>);
            const card = container.firstChild;
            expect(card).toHaveClass('rounded-pebble');
        });

        it('applies correct elevation class', () => {
            const { container } = render(<M3Card elevation={2}>Content</M3Card>);
            const card = container.firstChild;
            expect(card).toHaveClass('shadow-elevation-2');
        });

        it('applies correct padding class', () => {
            const { container } = render(<M3Card padding="lg">Content</M3Card>);
            const card = container.firstChild;
            expect(card).toHaveClass('p-space-xl');
        });
    });

    describe('Variants', () => {
        it('renders pebble shape', () => {
            const { container } = render(<M3Card variant="pebble">Content</M3Card>);
            expect(container.firstChild).toHaveClass('rounded-pebble');
        });

        it('renders tech shape', () => {
            const { container } = render(<M3Card variant="tech">Content</M3Card>);
            expect(container.firstChild).toHaveClass('rounded-tech');
        });

        it('renders leaf shape', () => {
            const { container } = render(<M3Card variant="leaf">Content</M3Card>);
            expect(container.firstChild).toHaveClass('rounded-leaf');
        });

        it('renders gem shape', () => {
            const { container } = render(<M3Card variant="gem">Content</M3Card>);
            expect(container.firstChild).toHaveClass('rounded-gem');
        });
    });

    describe('Interactive', () => {
        it('adds hover elevation when hoverable', () => {
            const { container } = render(
                <M3Card elevation={1} hoverable>Content</M3Card>
            );
            expect(container.firstChild).toHaveClass('hover:shadow-elevation-2');
        });

        it('calls onClick when clicked', async () => {
            const handleClick = vi.fn();
            const user = userEvent.setup();

            render(<M3Card onClick={handleClick}>Clickable Card</M3Card>);
            await user.click(screen.getByText('Clickable Card'));

            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it('adds cursor-pointer when onClick is provided', () => {
            const { container } = render(<M3Card onClick={() => { }}>Content</M3Card>);
            expect(container.firstChild).toHaveClass('cursor-pointer');
        });
    });

    describe('Accessibility', () => {
        it('has correct default role', () => {
            const { container } = render(<M3Card>Content</M3Card>);
            expect(container.firstChild).toHaveAttribute('role', 'article');
        });

        it('accepts custom role', () => {
            const { container } = render(<M3Card role="region">Content</M3Card>);
            expect(container.firstChild).toHaveAttribute('role', 'region');
        });

        it('is keyboard accessible when clickable', () => {
            const { container } = render(<M3Card onClick={() => { }}>Content</M3Card>);
            expect(container.firstChild).toHaveAttribute('tabIndex', '0');
        });
    });
});

describe('M3CardHeader', () => {
    it('renders title', () => {
        render(<M3CardHeader title="Card Title" />);
        expect(screen.getByText('Card Title')).toBeInTheDocument();
    });

    it('renders subtitle when provided', () => {
        render(<M3CardHeader title="Title" subtitle="Subtitle" />);
        expect(screen.getByText('Subtitle')).toBeInTheDocument();
    });

    it('renders icon when provided', () => {
        render(
            <M3CardHeader
                title="Title"
                icon={<span data-testid="test-icon">Icon</span>}
            />
        );
        expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('renders action when provided', () => {
        render(
            <M3CardHeader
                title="Title"
                action={<button>Action</button>}
            />
        );
        expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    });
});

describe('M3CardContent', () => {
    it('renders children', () => {
        render(<M3CardContent>Content goes here</M3CardContent>);
        expect(screen.getByText('Content goes here')).toBeInTheDocument();
    });
});

describe('M3CardActions', () => {
    it('renders children', () => {
        render(
            <M3CardActions>
                <button>Cancel</button>
                <button>Confirm</button>
            </M3CardActions>
        );
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    });

    it('applies correct alignment class', () => {
        const { container } = render(
            <M3CardActions align="right">
                <button>Action</button>
            </M3CardActions>
        );
        expect(container.firstChild).toHaveClass('justify-end');
    });
});
