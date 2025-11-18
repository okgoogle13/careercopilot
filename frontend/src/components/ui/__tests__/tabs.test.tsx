import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from '@jest/globals';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '../tabs';

describe('Tabs Components', () => {
  describe('Tabs', () => {
    it('renders without crashing', () => {
      render(
        <Tabs value="tab1">
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </Tabs>
      );
      expect(screen.getByText('Tab 1')).toBeInTheDocument();
    });

    it('accepts value prop', () => {
      render(
        <Tabs value="tab1">
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </Tabs>
      );
      expect(screen.getByText('Tab 1')).toBeInTheDocument();
    });

    it('calls onChange when tab clicked', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <Tabs value="tab1" onChange={handleChange}>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </Tabs>
      );

      await user.click(screen.getByText('Tab 2'));
      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('TabsContent', () => {
    it('renders when value matches currentValue', () => {
      render(
        <TabsContent value="tab1" currentValue="tab1">
          Content 1
        </TabsContent>
      );
      expect(screen.getByText('Content 1')).toBeVisible();
    });

    it('is hidden when value does not match currentValue', () => {
      render(
        <TabsContent value="tab1" currentValue="tab2">
          Content 1
        </TabsContent>
      );
      expect(screen.getByText('Content 1')).not.toBeVisible();
    });

    it('has tabpanel role', () => {
      render(
        <TabsContent value="tab1" currentValue="tab1">
          Content
        </TabsContent>
      );
      expect(screen.getByRole('tabpanel')).toBeInTheDocument();
    });
  });
});
