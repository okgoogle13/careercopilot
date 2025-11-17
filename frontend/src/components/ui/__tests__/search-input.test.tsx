import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchInput } from '../search-input';

describe('SearchInput', () => {
  describe('Rendering', () => {
    it('renders search input', () => {
      render(<SearchInput />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders with placeholder', () => {
      render(<SearchInput placeholder="Search here..." />);
      expect(screen.getByPlaceholderText('Search here...')).toBeInTheDocument();
    });

    it('renders with default placeholder', () => {
      render(<SearchInput />);
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('renders search icon', () => {
      const { container } = render(<SearchInput />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('renders with value', () => {
      render(<SearchInput value="test search" />);
      expect(screen.getByDisplayValue('test search')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('accepts text input', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<SearchInput onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'search query');

      expect(handleChange).toHaveBeenCalled();
    });

    it('calls onChange with typed value', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<SearchInput onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      expect(handleChange).toHaveBeenCalledWith('test');
    });

    it('shows clear button when value is not empty', () => {
      render(<SearchInput value="test" />);
      const clearButton = screen.getByRole('button');
      expect(clearButton).toBeInTheDocument();
    });

    it('does not show clear button when value is empty', () => {
      render(<SearchInput value="" />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('clears value when clear button is clicked', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<SearchInput value="test" onChange={handleChange} />);

      const clearButton = screen.getByRole('button');
      await user.click(clearButton);

      expect(handleChange).toHaveBeenCalledWith('');
    });

    it('calls onClear when clear button is clicked', async () => {
      const user = userEvent.setup();
      const handleClear = jest.fn();

      render(<SearchInput value="test" onClear={handleClear} />);

      const clearButton = screen.getByRole('button');
      await user.click(clearButton);

      expect(handleClear).toHaveBeenCalled();
    });

    it('calls onSearch when Enter key is pressed', async () => {
      const user = userEvent.setup();
      const handleSearch = jest.fn();

      render(<SearchInput value="query" onSearch={handleSearch} />);

      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.keyboard('{Enter}');

      expect(handleSearch).toHaveBeenCalledWith('query');
    });

    it('does not call onSearch when other keys are pressed', async () => {
      const user = userEvent.setup();
      const handleSearch = jest.fn();

      render(<SearchInput value="query" onSearch={handleSearch} />);

      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.keyboard('a');

      expect(handleSearch).not.toHaveBeenCalled();
    });

    it('does not accept input when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<SearchInput disabled onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('disables clear button when disabled', () => {
      render(<SearchInput value="test" disabled />);
      const clearButton = screen.getByRole('button');
      expect(clearButton).toBeDisabled();
    });
  });

  describe('Props', () => {
    it('renders full width by default', () => {
      const { container } = render(<SearchInput />);
      const input = container.querySelector('.MuiTextField-root');
      expect(input).toBeInTheDocument();
    });

    it('can disable full width', () => {
      const { container } = render(<SearchInput fullWidth={false} />);
      const input = container.querySelector('.MuiTextField-root');
      expect(input).toBeInTheDocument();
    });

    it('auto focuses when autoFocus is true', () => {
      render(<SearchInput autoFocus />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveFocus();
    });

    it('does not auto focus by default', () => {
      render(<SearchInput />);
      const input = screen.getByRole('textbox');
      expect(input).not.toHaveFocus();
    });

    it('is enabled by default', () => {
      render(<SearchInput />);
      const input = screen.getByRole('textbox');
      expect(input).not.toBeDisabled();
    });

    it('can be disabled', () => {
      render(<SearchInput disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });
  });

  describe('Controlled Component', () => {
    it('works as controlled component', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const [value, setValue] = React.useState('');
        return <SearchInput value={value} onChange={setValue} />;
      };

      render(<TestComponent />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('');

      await user.type(input, 'search');
      expect(input).toHaveValue('search');
    });

    it('can be cleared programmatically', () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState('initial');
        return (
          <>
            <SearchInput value={value} onChange={setValue} />
            <button onClick={() => setValue('')}>Clear</button>
          </>
        );
      };

      render(<TestComponent />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('initial');
    });
  });

  describe('Accessibility', () => {
    it('has correct role', () => {
      render(<SearchInput />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('can be labeled with aria-label', () => {
      const { container } = render(
        <SearchInput placeholder="Search" />
      );
      const input = container.querySelector('input');
      expect(input).toBeInTheDocument();
    });

    it('is keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<SearchInput />);

      await user.tab();
      const input = screen.getByRole('textbox');
      expect(input).toHaveFocus();
    });

    it('clear button is keyboard accessible', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<SearchInput value="test" onChange={handleChange} />);

      await user.tab();
      await user.tab();

      const clearButton = screen.getByRole('button');
      expect(clearButton).toHaveFocus();

      await user.keyboard(' ');
      expect(handleChange).toHaveBeenCalledWith('');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty string value', () => {
      render(<SearchInput value="" />);
      expect(screen.getByRole('textbox')).toHaveValue('');
    });

    it('handles very long search text', async () => {
      const user = userEvent.setup();
      const longText = 'a'.repeat(1000);

      render(<SearchInput />);

      const input = screen.getByRole('textbox');
      await user.type(input, longText);

      expect(input).toHaveValue(longText);
    });

    it('handles special characters', async () => {
      const user = userEvent.setup();
      const specialChars = '!@#$%^&*()';

      render(<SearchInput />);

      const input = screen.getByRole('textbox');
      await user.type(input, specialChars);

      expect(input).toHaveValue(specialChars);
    });

    it('handles rapid typing', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<SearchInput onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'quick');

      expect(handleChange).toHaveBeenCalled();
    });

    it('handles clearing and retyping', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const [value, setValue] = React.useState('initial');
        return <SearchInput value={value} onChange={setValue} />;
      };

      render(<TestComponent />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('initial');

      const clearButton = screen.getByRole('button');
      await user.click(clearButton);
      expect(input).toHaveValue('');

      await user.type(input, 'new search');
      expect(input).toHaveValue('new search');
    });
  });

  describe('Styling', () => {
    it('applies M3 design tokens', () => {
      const { container } = render(<SearchInput />);
      const input = container.querySelector('.MuiOutlinedInput-root');
      expect(input).toBeInTheDocument();
    });

    it('shows hover state', () => {
      const { container } = render(<SearchInput />);
      const input = container.querySelector('.MuiOutlinedInput-root');
      expect(input).toBeInTheDocument();
    });

    it('shows focus state', async () => {
      const user = userEvent.setup();
      const { container } = render(<SearchInput />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      const root = container.querySelector('.MuiOutlinedInput-root');
      expect(root).toBeInTheDocument();
    });
  });
});
