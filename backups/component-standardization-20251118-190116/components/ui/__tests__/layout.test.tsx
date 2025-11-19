import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  LayoutContainer,
  LayoutGrid,
  LayoutGridItem,
  LayoutStack,
  LayoutFlex,
  LayoutCard,
} from '../layout';

describe('LayoutContainer', () => {
  describe('Rendering', () => {
    it('renders container with children', () => {
      render(<LayoutContainer>Container Content</LayoutContainer>);
      expect(screen.getByText('Container Content')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<LayoutContainer ref={ref}>Container</LayoutContainer>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Props', () => {
    it('accepts maxWidth prop', () => {
      render(<LayoutContainer maxWidth="md">Content</LayoutContainer>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('accepts disableGutters prop', () => {
      render(<LayoutContainer disableGutters>Content</LayoutContainer>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('accepts fixed prop', () => {
      render(<LayoutContainer fixed>Content</LayoutContainer>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });
});

describe('LayoutGrid', () => {
  describe('Rendering', () => {
    it('renders grid container', () => {
      render(<LayoutGrid>Grid Content</LayoutGrid>);
      expect(screen.getByText('Grid Content')).toBeInTheDocument();
    });

    it('renders as container by default', () => {
      render(<LayoutGrid>Grid</LayoutGrid>);
      expect(screen.getByText('Grid')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<LayoutGrid ref={ref}>Grid</LayoutGrid>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Props', () => {
    it('accepts spacing prop', () => {
      render(<LayoutGrid spacing={2}>Grid</LayoutGrid>);
      expect(screen.getByText('Grid')).toBeInTheDocument();
    });

    it('renders with children', () => {
      render(
        <LayoutGrid>
          <LayoutGridItem>Item 1</LayoutGridItem>
          <LayoutGridItem>Item 2</LayoutGridItem>
        </LayoutGrid>
      );
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });
  });
});

describe('LayoutGridItem', () => {
  describe('Rendering', () => {
    it('renders grid item', () => {
      render(<LayoutGridItem>Item</LayoutGridItem>);
      expect(screen.getByText('Item')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<LayoutGridItem ref={ref}>Item</LayoutGridItem>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Breakpoint Props', () => {
    it('accepts xs prop', () => {
      render(<LayoutGridItem xs={12}>Full width</LayoutGridItem>);
      expect(screen.getByText('Full width')).toBeInTheDocument();
    });

    it('accepts sm prop', () => {
      render(<LayoutGridItem sm={6}>Half width</LayoutGridItem>);
      expect(screen.getByText('Half width')).toBeInTheDocument();
    });

    it('accepts md prop', () => {
      render(<LayoutGridItem md={4}>One third</LayoutGridItem>);
      expect(screen.getByText('One third')).toBeInTheDocument();
    });

    it('accepts lg prop', () => {
      render(<LayoutGridItem lg={3}>One quarter</LayoutGridItem>);
      expect(screen.getByText('One quarter')).toBeInTheDocument();
    });

    it('accepts xl prop', () => {
      render(<LayoutGridItem xl={2}>One sixth</LayoutGridItem>);
      expect(screen.getByText('One sixth')).toBeInTheDocument();
    });

    it('accepts multiple breakpoint props', () => {
      render(
        <LayoutGridItem xs={12} sm={6} md={4} lg={3} xl={2}>
          Responsive
        </LayoutGridItem>
      );
      expect(screen.getByText('Responsive')).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('works within LayoutGrid', () => {
      render(
        <LayoutGrid>
          <LayoutGridItem xs={6}>Left</LayoutGridItem>
          <LayoutGridItem xs={6}>Right</LayoutGridItem>
        </LayoutGrid>
      );
      expect(screen.getByText('Left')).toBeInTheDocument();
      expect(screen.getByText('Right')).toBeInTheDocument();
    });
  });
});

describe('LayoutStack', () => {
  describe('Rendering', () => {
    it('renders stack with children', () => {
      render(<LayoutStack>Stack Content</LayoutStack>);
      expect(screen.getByText('Stack Content')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<LayoutStack ref={ref}>Stack</LayoutStack>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Props', () => {
    it('accepts spacing prop', () => {
      render(<LayoutStack spacing={2}>Stack</LayoutStack>);
      expect(screen.getByText('Stack')).toBeInTheDocument();
    });

    it('accepts direction prop', () => {
      render(<LayoutStack direction="row">Stack</LayoutStack>);
      expect(screen.getByText('Stack')).toBeInTheDocument();
    });

    it('accepts alignItems prop', () => {
      render(<LayoutStack alignItems="center">Stack</LayoutStack>);
      expect(screen.getByText('Stack')).toBeInTheDocument();
    });

    it('accepts justifyContent prop', () => {
      render(<LayoutStack justifyContent="center">Stack</LayoutStack>);
      expect(screen.getByText('Stack')).toBeInTheDocument();
    });
  });

  describe('Children', () => {
    it('renders multiple children vertically by default', () => {
      render(
        <LayoutStack>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </LayoutStack>
      );
      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
      expect(screen.getByText('Child 3')).toBeInTheDocument();
    });

    it('renders children horizontally when direction is row', () => {
      render(
        <LayoutStack direction="row">
          <div>Left</div>
          <div>Center</div>
          <div>Right</div>
        </LayoutStack>
      );
      expect(screen.getByText('Left')).toBeInTheDocument();
      expect(screen.getByText('Center')).toBeInTheDocument();
      expect(screen.getByText('Right')).toBeInTheDocument();
    });
  });
});

describe('LayoutFlex', () => {
  describe('Rendering', () => {
    it('renders flex container', () => {
      render(<LayoutFlex>Flex Content</LayoutFlex>);
      expect(screen.getByText('Flex Content')).toBeInTheDocument();
    });

    it('renders with display flex', () => {
      const { container } = render(<LayoutFlex>Flex</LayoutFlex>);
      const flex = container.firstChild as HTMLElement;
      expect(flex).toHaveStyle({ display: 'flex' });
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<LayoutFlex ref={ref}>Flex</LayoutFlex>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Props', () => {
    it('accepts gap prop', () => {
      const { container } = render(<LayoutFlex gap={2}>Flex</LayoutFlex>);
      const flex = container.firstChild as HTMLElement;
      expect(flex).toHaveStyle({ gap: 2 });
    });

    it('accepts justify prop', () => {
      const { container } = render(<LayoutFlex justify="center">Flex</LayoutFlex>);
      const flex = container.firstChild as HTMLElement;
      expect(flex).toHaveStyle({ justifyContent: 'center' });
    });

    it('accepts align prop', () => {
      const { container } = render(<LayoutFlex align="center">Flex</LayoutFlex>);
      const flex = container.firstChild as HTMLElement;
      expect(flex).toHaveStyle({ alignItems: 'center' });
    });

    it('accepts wrap prop', () => {
      const { container } = render(<LayoutFlex wrap>Flex</LayoutFlex>);
      const flex = container.firstChild as HTMLElement;
      expect(flex).toHaveStyle({ flexWrap: 'wrap' });
    });

    it('does not wrap by default', () => {
      const { container } = render(<LayoutFlex>Flex</LayoutFlex>);
      const flex = container.firstChild as HTMLElement;
      expect(flex).toHaveStyle({ flexWrap: 'nowrap' });
    });
  });

  describe('Justify Values', () => {
    it('supports flex-start justify', () => {
      const { container } = render(<LayoutFlex justify="flex-start">Flex</LayoutFlex>);
      const flex = container.firstChild as HTMLElement;
      expect(flex).toHaveStyle({ justifyContent: 'flex-start' });
    });

    it('supports space-between justify', () => {
      const { container } = render(<LayoutFlex justify="space-between">Flex</LayoutFlex>);
      const flex = container.firstChild as HTMLElement;
      expect(flex).toHaveStyle({ justifyContent: 'space-between' });
    });

    it('supports space-around justify', () => {
      const { container } = render(<LayoutFlex justify="space-around">Flex</LayoutFlex>);
      const flex = container.firstChild as HTMLElement;
      expect(flex).toHaveStyle({ justifyContent: 'space-around' });
    });
  });

  describe('Align Values', () => {
    it('supports stretch align', () => {
      const { container } = render(<LayoutFlex align="stretch">Flex</LayoutFlex>);
      const flex = container.firstChild as HTMLElement;
      expect(flex).toHaveStyle({ alignItems: 'stretch' });
    });

    it('supports baseline align', () => {
      const { container } = render(<LayoutFlex align="baseline">Flex</LayoutFlex>);
      const flex = container.firstChild as HTMLElement;
      expect(flex).toHaveStyle({ alignItems: 'baseline' });
    });
  });
});

describe('LayoutCard', () => {
  describe('Rendering', () => {
    it('renders card', () => {
      render(<LayoutCard>Card Content</LayoutCard>);
      expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<LayoutCard ref={ref}>Card</LayoutCard>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Props', () => {
    it('accepts variant prop', () => {
      render(<LayoutCard variant="elevation">Card</LayoutCard>);
      expect(screen.getByText('Card')).toBeInTheDocument();
    });

    it('accepts onClick prop', () => {
      const handleClick = jest.fn();
      render(<LayoutCard onClick={handleClick}>Clickable Card</LayoutCard>);
      expect(screen.getByText('Clickable Card')).toBeInTheDocument();
    });
  });
});

describe('Layout Integration', () => {
  it('combines multiple layout components', () => {
    render(
      <LayoutContainer>
        <LayoutGrid>
          <LayoutGridItem xs={12}>
            <LayoutCard>
              <LayoutStack spacing={2}>
                <div>Stack Item 1</div>
                <div>Stack Item 2</div>
              </LayoutStack>
            </LayoutCard>
          </LayoutGridItem>
        </LayoutGrid>
      </LayoutContainer>
    );

    expect(screen.getByText('Stack Item 1')).toBeInTheDocument();
    expect(screen.getByText('Stack Item 2')).toBeInTheDocument();
  });

  it('creates responsive layout', () => {
    render(
      <LayoutContainer maxWidth="lg">
        <LayoutGrid spacing={3}>
          <LayoutGridItem xs={12} md={6} lg={4}>Column 1</LayoutGridItem>
          <LayoutGridItem xs={12} md={6} lg={4}>Column 2</LayoutGridItem>
          <LayoutGridItem xs={12} md={12} lg={4}>Column 3</LayoutGridItem>
        </LayoutGrid>
      </LayoutContainer>
    );

    expect(screen.getByText('Column 1')).toBeInTheDocument();
    expect(screen.getByText('Column 2')).toBeInTheDocument();
    expect(screen.getByText('Column 3')).toBeInTheDocument();
  });
});
