/**
 * @file Provides a composable and styled Card component system.
 *
 * This file exports a set of components (`Card`, `CardHeader`, `CardContent`,
 * `CardFooter`, `CardTitle`, `CardDescription`) that are used to build flexible
 * card-based layouts. The components are built on top of Material-UI's Card
 * and are styled to match the application's design system.
 */
import { styled } from '@mui/material/styles';
import MuiCard, { CardProps as MuiCardProps } from '@mui/material/Card';
import { forwardRef } from 'react';
import { CardContent as MuiCardContent } from '@mui/material';
import { CardHeader as MuiCardHeader } from '@mui/material';
import { CardActions as MuiCardActions } from '@mui/material';
import { Typography } from '@mui/material';

/** Defines the custom visual variants for the Card component. */
type CardVariant = 'elevation' | 'outlined' | 'selected' | 'interactive';

/**
 * Props for the main Card component.
 */
interface CardProps extends Omit<MuiCardProps, 'variant'> {
  /**
   * The visual style of the card.
   * - `elevation`: (Default) Standard card with shadow.
   * - `outlined`: Card with a border and no shadow.
   * - `selected`: Card with a primary-colored border to indicate selection.
   * - `interactive`: Card with a hover effect (lift and shadow) to indicate it's clickable.
   * @default 'elevation'
   */
  variant?: CardVariant;
  /** The content of the card. */
  children?: React.ReactNode;
}

/**
 * A private styled version of the MUI Card.
 * It applies custom styles for 'selected' and 'interactive' variants.
 * @internal
 */
const StyledCard = styled(MuiCard, {
  shouldForwardProp: (prop) => prop !== 'variant',
})<{ variant?: CardVariant }>(({ theme, variant = 'elevation' }) => ({
  transition: theme.transitions.create(['box-shadow', 'transform'], {
    duration: theme.transitions.duration.standard,
  }),
  ...(variant === 'selected' && {
    border: `2px solid ${theme.palette.primary.main}`,
    boxShadow: theme.shadows[4],
  }),
  ...(variant === 'interactive' && {
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[8],
    },
  }),
}));

/**
 * The main Card component. It serves as a container for card content.
 *
 * @param {CardProps} props - The props for the component.
 * @param {React.Ref<HTMLDivElement>} ref - The ref to forward to the underlying div element.
 * @returns {JSX.Element} The rendered Card component.
 *
 * @example
 * <Card variant="interactive">
 *   <CardHeader>
 *     <CardTitle>Team Member</CardTitle>
 *     <CardDescription>Product Designer</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     <p>A brief bio of the team member.</p>
 *   </CardContent>
 *   <CardFooter>
 *     <Button>View Profile</Button>
 *   </CardFooter>
 * </Card>
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(({ variant, ...rest }, ref) => (
  <StyledCard
    ref={ref}
    variant={variant === 'selected' || variant === 'interactive' ? 'elevation' : variant}
    elevation={variant === 'interactive' ? 4 : undefined}
    {...rest}
  />
));
Card.displayName = 'Card';

/**
 * A wrapper for the main content area of a Card.
 * @param {React.ComponentProps<typeof MuiCardContent>} props - The props for the component.
 * @param {React.Ref<HTMLDivElement>} ref - The ref to forward to the underlying div element.
 * @returns {JSX.Element} The rendered CardContent component.
 */
export const CardContent = forwardRef<HTMLDivElement, React.ComponentProps<typeof MuiCardContent>>(
  (props, ref) => <MuiCardContent ref={ref} {...props} />
);
CardContent.displayName = 'CardContent';

/**
 * A header component for a Card. Can contain a title, subheader, and avatar.
 * @param {React.ComponentProps<typeof MuiCardHeader>} props - The props for the component.
 * @param {React.Ref<HTMLDivElement>} ref - The ref to forward to the underlying div element.
 * @returns {JSX.Element} The rendered CardHeader component.
 */
export const CardHeader = forwardRef<HTMLDivElement, React.ComponentProps<typeof MuiCardHeader>>(
  (props, ref) => <MuiCardHeader ref={ref} {...props} />
);
CardHeader.displayName = 'CardHeader';

/**
 * A footer component for a Card. Typically used to hold action buttons.
 * @param {React.ComponentProps<typeof MuiCardActions>} props - The props for the component.
 * @param {React.Ref<HTMLDivElement>} ref - The ref to forward to the underlying div element.
 * @returns {JSX.Element} The rendered CardFooter component.
 */
export const CardFooter = forwardRef<HTMLDivElement, React.ComponentProps<typeof MuiCardActions>>(
  (props, ref) => <MuiCardActions ref={ref} {...props} />
);
CardFooter.displayName = 'CardFooter';

/**
 * A typography component for rendering the title within a CardHeader.
 * @param {React.ComponentProps<typeof Typography>} props - The props for the component.
 * @param {React.Ref<HTMLHeadingElement>} ref - The ref to forward to the underlying heading element.
 * @returns {JSX.Element} The rendered CardTitle component.
 */
export const CardTitle = forwardRef<HTMLHeadingElement, React.ComponentProps<typeof Typography>>(
  (props, ref) => <Typography ref={ref} variant="h6" component="h3" {...props} />
);
CardTitle.displayName = 'CardTitle';

/**
 * A typography component for rendering the description or subheader within a CardHeader.
 * @param {React.ComponentProps<typeof Typography>} props - The props for the component.
 * @param {React.Ref<HTMLParagraphElement>} ref - The ref to forward to the underlying paragraph element.
 * @returns {JSX.Element} The rendered CardDescription component.
 */
export const CardDescription = forwardRef<HTMLParagraphElement, React.ComponentProps<typeof Typography>>(
  (props, ref) => <Typography ref={ref} variant="body2" color="text.secondary" {...props} />
);
CardDescription.displayName = 'CardDescription';

/**
 * A generic container for actions within a Card, often used in the CardHeader.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - The props for the component.
 * @param {React.Ref<HTMLDivElement>} ref - The ref to forward to the underlying div element.
 * @returns {JSX.Element} The rendered CardAction component.
 */
export const CardAction = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => <div ref={ref} {...props} />
);
CardAction.displayName = 'CardAction';