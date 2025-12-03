import React from 'react';
import { render, screen } from '@testing-library/react';
import { M3List } from './M3List';
import { M3Listitem } from '../listitem/M3Listitem';

describe('M3List Component', () => {
  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('renders list with items', () => {
      render(
        <M3List>
          <M3Listitem primary="Item 1" />
          <M3Listitem primary="Item 2" />
        </M3List>
      );
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    test('applies base class', () => {
      const { container } = render(
        <M3List>
          <M3Listitem primary="Test" />
        </M3List>
      );
      const element = container.querySelector('.m3-list');
      expect(element).toBeInTheDocument();
    });

    test('forwards custom className', () => {
      const { container } = render(
        <M3List className="custom-class">
          <M3Listitem primary="Test" />
        </M3List>
      );
      const element = container.querySelector('.custom-class');
      expect(element).toBeInTheDocument();
    });
  });

  // Dividers Tests
  describe('Dividers', () => {
    test('shows dividers by default', () => {
      const { container } = render(
        <M3List>
          <M3Listitem primary="Item 1" />
          <M3Listitem primary="Item 2" />
        </M3List>
      );
      const list = container.querySelector('.m3-list--dividers');
      expect(list).toBeInTheDocument();
    });

    test('hides dividers when dividers is false', () => {
      const { container } = render(
        <M3List dividers={false}>
          <M3Listitem primary="Item 1" />
          <M3Listitem primary="Item 2" />
        </M3List>
      );
      const list = container.querySelector('.m3-list--dividers');
      expect(list).not.toBeInTheDocument();
    });
  });

  // Dense Tests
  describe('Dense Mode', () => {
    test('applies dense class when dense is true', () => {
      const { container } = render(
        <M3List dense>
          <M3Listitem primary="Item 1" />
        </M3List>
      );
      const list = container.querySelector('.m3-list--dense');
      expect(list).toBeInTheDocument();
    });
  });

  // Disabled State Tests
  describe('Disabled State', () => {
    test('applies disabled class when disabled is true', () => {
      const { container } = render(
        <M3List disabled>
          <M3Listitem primary="Item 1" />
        </M3List>
      );
      const list = container.querySelector('.m3-list--disabled');
      expect(list).toBeInTheDocument();
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    test('has role="list"', () => {
      const { container } = render(
        <M3List>
          <M3Listitem primary="Item 1" />
        </M3List>
      );
      const list = container.querySelector('[role="list"]');
      expect(list).toBeInTheDocument();
    });
  });
});
