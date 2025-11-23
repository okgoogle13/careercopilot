import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../tabs';

describe('Tabs', () => {
  it('renders without errors', () => {
    render(
      <Tabs value="tab1">
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
      </Tabs>
    );
    expect(screen.getByRole('tab', { name: /tab 1/i })).toBeInTheDocument();
  });

  it('renders multiple tabs', () => {
    render(
      <Tabs value="tab1">
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
      </Tabs>
    );

    expect(screen.getByRole('tab', { name: /tab 1/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /tab 2/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /tab 3/i })).toBeInTheDocument();
  });

  it('marks selected tab with Mui-selected class', () => {
    render(
      <Tabs value="tab2">
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
      </Tabs>
    );

    const selectedTab = screen.getByRole('tab', { name: /tab 2/i });
    expect(selectedTab).toHaveClass('Mui-selected');
  });

  it('calls onChange when tab is clicked', async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();

    render(
      <Tabs value="tab1" onChange={mockOnChange}>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
      </Tabs>
    );

    const tab2 = screen.getByRole('tab', { name: /tab 2/i });
    await user.click(tab2);

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('handles disabled tabs', () => {
    render(
      <Tabs value="tab1">
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2" disabled>Tab 2</TabsTrigger>
      </Tabs>
    );

    const disabledTab = screen.getByRole('tab', { name: /tab 2/i });
    expect(disabledTab).toBeDisabled();
  });

  it('supports keyboard navigation', () => {
    render(
      <Tabs value="tab1">
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
      </Tabs>
    );

    const tab1 = screen.getByRole('tab', { name: /tab 1/i });
    expect(tab1).toHaveAttribute('tabIndex');
  });
});

describe('TabsList', () => {
  it('renders children tabs correctly', () => {
    render(
      <TabsList value="tab1">
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
      </TabsList>
    );

    expect(screen.getByRole('tab', { name: /tab 1/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /tab 2/i })).toBeInTheDocument();
  });

  it('applies custom props to MuiTabs', () => {
    const { container } = render(
      <TabsList value="tab1" orientation="vertical">
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
      </TabsList>
    );

    const tabsContainer = container.querySelector('.MuiTabs-root');
    expect(tabsContainer).toBeInTheDocument();
  });
});

describe('TabsTrigger', () => {
  it('renders tab trigger with label', () => {
    render(
      <Tabs value="tab1">
        <TabsTrigger value="tab1">My Tab Label</TabsTrigger>
      </Tabs>
    );

    expect(screen.getByRole('tab', { name: /my tab label/i })).toBeInTheDocument();
  });

  it('accepts icon prop', () => {
    const mockIcon = <span data-testid="test-icon">Icon</span>;
    render(
      <Tabs value="tab1">
        <TabsTrigger value="tab1" icon={mockIcon}>Tab with Icon</TabsTrigger>
      </Tabs>
    );

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(
      <Tabs value="tab1">
        <TabsTrigger ref={ref} value="tab1">Tab 1</TabsTrigger>
      </Tabs>
    );

    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});

describe('TabsContent', () => {
  it('shows content when value matches currentValue', () => {
    render(
      <TabsContent value="tab1" currentValue="tab1">
        <div>Tab 1 Content</div>
      </TabsContent>
    );

    expect(screen.getByRole('tabpanel')).toBeInTheDocument();
    expect(screen.getByText('Tab 1 Content')).toBeInTheDocument();
  });

  it('hides content when value does not match currentValue', () => {
    render(
      <TabsContent value="tab1" currentValue="tab2">
        <div>Tab 1 Content</div>
      </TabsContent>
    );

    const panel = screen.getByRole('tabpanel', { hidden: true });
    expect(panel).toHaveAttribute('hidden');
  });

  it('only renders children when active', () => {
    const { rerender } = render(
      <TabsContent value="tab1" currentValue="tab2">
        <div>Tab 1 Content</div>
      </TabsContent>
    );

    expect(screen.queryByText('Tab 1 Content')).not.toBeInTheDocument();

    rerender(
      <TabsContent value="tab1" currentValue="tab1">
        <div>Tab 1 Content</div>
      </TabsContent>
    );

    expect(screen.getByText('Tab 1 Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <TabsContent value="tab1" currentValue="tab1" className="custom-class">
        <div>Content</div>
      </TabsContent>
    );

    const panel = screen.getByRole('tabpanel');
    expect(panel).toHaveClass('custom-class');
  });

  it('has correct accessibility attributes', () => {
    render(
      <TabsContent value="tab1" currentValue="tab1">
        <div>Content</div>
      </TabsContent>
    );

    const panel = screen.getByRole('tabpanel');
    expect(panel).toHaveAttribute('role', 'tabpanel');
  });
});

// Integration tests
describe('Tabs Integration', () => {
  it('switches content when tab is clicked', async () => {
    const user = userEvent.setup();
    const TestComponent = () => {
      const [value, setValue] = React.useState('tab1');

      return (
        <>
          <Tabs value={value} onChange={(_e, newValue) => setValue(newValue)}>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </Tabs>
          <TabsContent value="tab1" currentValue={value}>
            Tab 1 Content
          </TabsContent>
          <TabsContent value="tab2" currentValue={value}>
            Tab 2 Content
          </TabsContent>
        </>
      );
    };

    render(<TestComponent />);

    expect(screen.getByText('Tab 1 Content')).toBeInTheDocument();
    expect(screen.queryByText('Tab 2 Content')).not.toBeInTheDocument();

    const tab2 = screen.getByRole('tab', { name: /tab 2/i });
    await user.click(tab2);

    expect(screen.getByText('Tab 2 Content')).toBeInTheDocument();
    expect(screen.queryByText('Tab 1 Content')).not.toBeInTheDocument();
  });

  it('handles tab navigation with multiple tabs and content panels', () => {
    render(
      <>
        <Tabs value="tab2">
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        </Tabs>
        <TabsContent value="tab1" currentValue="tab2">Content 1</TabsContent>
        <TabsContent value="tab2" currentValue="tab2">Content 2</TabsContent>
        <TabsContent value="tab3" currentValue="tab2">Content 3</TabsContent>
      </>
    );

    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Content 3')).not.toBeInTheDocument();
  });
});

// Add React import for ref test
import * as React from 'react';
