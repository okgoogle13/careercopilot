import React from 'react';
import { render, screen } from '@testing-library/react';
import { Avatar, AvatarImage, AvatarFallback } from '../avatar';

describe('Avatar', () => {
  describe('Avatar Component', () => {
    it('renders avatar with children', () => {
      render(<Avatar>AB</Avatar>);
      expect(screen.getByText('AB')).toBeInTheDocument();
    });

    it('renders avatar with image source', () => {
      render(<Avatar src="/avatar.jpg" alt="Avatar" />);
      const img = screen.getByAltText('Avatar');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/avatar.jpg');
    });

    it('renders avatar with fallback text', () => {
      render(<Avatar>JD</Avatar>);
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Avatar ref={ref}>AB</Avatar>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('accepts className prop', () => {
      render(<Avatar className="custom-avatar">AB</Avatar>);
      const avatar = screen.getByText('AB').parentElement;
      expect(avatar).toHaveClass('custom-avatar');
    });

    it('accepts style prop', () => {
      render(<Avatar style={{ backgroundColor: 'red' }}>AB</Avatar>);
      const avatar = screen.getByText('AB').parentElement;
      expect(avatar).toHaveStyle({ backgroundColor: 'red' });
    });
  });

  describe('AvatarImage Component', () => {
    it('renders image with src and alt', () => {
      render(<AvatarImage src="/user.jpg" alt="User avatar" />);
      const img = screen.getByAltText('User avatar');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/user.jpg');
    });

    it('renders image with correct styles', () => {
      render(<AvatarImage src="/user.jpg" alt="User" />);
      const img = screen.getByAltText('User');
      expect(img).toHaveStyle({
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      });
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLImageElement>();
      render(<AvatarImage ref={ref} src="/user.jpg" alt="User" />);
      expect(ref.current).toBeInstanceOf(HTMLImageElement);
    });

    it('passes through additional props', () => {
      render(
        <AvatarImage
          src="/user.jpg"
          alt="User"
          data-testid="avatar-image"
        />
      );
      const img = screen.getByTestId('avatar-image');
      expect(img).toBeInTheDocument();
    });
  });

  describe('AvatarFallback Component', () => {
    it('renders fallback content', () => {
      render(<AvatarFallback>JD</AvatarFallback>);
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('renders fallback icon', () => {
      render(
        <AvatarFallback>
          <span data-testid="fallback-icon">👤</span>
        </AvatarFallback>
      );
      expect(screen.getByTestId('fallback-icon')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<AvatarFallback ref={ref}>JD</AvatarFallback>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('accepts className prop', () => {
      render(<AvatarFallback className="fallback-class">JD</AvatarFallback>);
      const fallback = screen.getByText('JD').parentElement;
      expect(fallback).toHaveClass('fallback-class');
    });
  });

  describe('Avatar Variants', () => {
    it('renders circular avatar by default', () => {
      render(<Avatar>AB</Avatar>);
      expect(screen.getByText('AB')).toBeInTheDocument();
    });

    it('renders square avatar with variant prop', () => {
      render(<Avatar variant="square">AB</Avatar>);
      expect(screen.getByText('AB')).toBeInTheDocument();
    });

    it('renders rounded avatar with variant prop', () => {
      render(<Avatar variant="rounded">AB</Avatar>);
      expect(screen.getByText('AB')).toBeInTheDocument();
    });
  });

  describe('Avatar Sizes', () => {
    it('renders with default size', () => {
      render(<Avatar>AB</Avatar>);
      const avatar = screen.getByText('AB').parentElement;
      expect(avatar).toBeInTheDocument();
    });

    it('renders with custom size via sx prop', () => {
      render(
        <Avatar sx={{ width: 56, height: 56 }}>AB</Avatar>
      );
      expect(screen.getByText('AB')).toBeInTheDocument();
    });
  });
});
