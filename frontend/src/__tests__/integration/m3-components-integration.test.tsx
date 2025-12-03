/**
 * M3 Components Integration Tests
 * Tests multiple M3 components working together in realistic scenarios
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Button,
  Input,
  Select,
  Card,
  Modal,
  Dialog,
  Menu,
  TabBar,
  Breadcrumb,
  Stepper,
  Pagination,
  Table,
  List,
  ListItem,
  Badge,
  Chip,
  Progress,
  Alert,
  Toast,
  Snackbar,
  Tooltip,
  Loader,
  Spinner,
  Skeleton,
  DatePicker,
  TimePicker,
  Slider,
  RangeSlider,
  Autocomplete,
  MultiSelect,
} from '@/components/m3-expressive';

describe('M3 Components Integration', () => {
  describe('Form Components Integration', () => {
    test('creates a complete form with Input, Select, DatePicker, and Button', async () => {
      const handleSubmit = jest.fn();
      
      render(
        <Card>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <Input label="Name" name="name" />
            <Select
              options={[
                { label: 'Option 1', value: '1' },
                { label: 'Option 2', value: '2' },
              ]}
              label="Category"
            />
            <DatePicker label="Date" />
            <Button type="submit">Submit</Button>
          </form>
        </Card>
      );

      const nameInput = screen.getByLabelText('Name');
      const submitButton = screen.getByText('Submit');

      await userEvent.type(nameInput, 'Test User');
      fireEvent.click(submitButton);

      expect(handleSubmit).toHaveBeenCalled();
    });
  });

  describe('Navigation Components Integration', () => {
    test('creates navigation with Breadcrumb, TabBar, and Menu', () => {
      render(
        <div>
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Settings', current: true },
            ]}
          />
          <TabBar
            items={[
              { label: 'Tab 1', value: 'tab1' },
              { label: 'Tab 2', value: 'tab2' },
            ]}
          />
          <Menu
            items={[
              { label: 'Option 1', value: '1' },
              { label: 'Option 2', value: '2' },
            ]}
            trigger={<Button>Menu</Button>}
          />
        </div>
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Tab 1')).toBeInTheDocument();
      expect(screen.getByText('Menu')).toBeInTheDocument();
    });
  });

  describe('Data Display Components Integration', () => {
    test('creates table with pagination and badges', () => {
      const columns = [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'status', label: 'Status', sortable: false },
      ];
      const data = [
        { name: 'Item 1', status: 'active' },
        { name: 'Item 2', status: 'inactive' },
      ];

      render(
        <div>
          <Table
            columns={columns}
            data={data}
            renderCell={(row: Record<string, any>, column: { key: string; label: string; sortable?: boolean }) => {
              if (column.key === 'status') {
                return (
                  <Badge
                    color={row.status === 'active' ? 'success' : 'error'}
                  >
                    {row.status}
                  </Badge>
                );
              }
              return row[column.key as keyof typeof row];
            }}
          />
          <Pagination
            currentPage={1}
            totalPages={5}
            onPageChange={() => {}}
          />
        </div>
      );

      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    test('creates list with list items and chips', () => {
      render(
        <List>
          <ListItem
            primary="Item 1"
            secondary="Description"
            trailing={<Chip label="New" size="small" />}
          />
          <ListItem
            primary="Item 2"
            trailing={<Badge value={5} />}
          />
        </List>
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('New')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  describe('Feedback Components Integration', () => {
    test('shows alert with action button', () => {
      const handleAction = jest.fn();
      
      render(
        <Alert severity="info" onClose={handleAction}>
          This is an alert message
        </Alert>
      );

      expect(screen.getByText('This is an alert message')).toBeInTheDocument();
      const closeButton = screen.getByLabelText('Close alert');
      fireEvent.click(closeButton);
      expect(handleAction).toHaveBeenCalled();
    });

    test('shows progress with loader in modal', () => {
      render(
        <Modal open={true} onClose={() => {}}>
          <Loader value={50} showPercentage />
          <Progress value={75} />
        </Modal>
      );

      expect(screen.getByText('50%')).toBeInTheDocument();
    });
  });

  describe('Advanced Forms Integration', () => {
    test('creates form with Autocomplete, MultiSelect, and Slider', async () => {
      render(
        <Card>
          <Autocomplete
            options={[
              { label: 'Option 1', value: '1' },
              { label: 'Option 2', value: '2' },
            ]}
            label="Search"
          />
          <MultiSelect
            options={[
              { label: 'Tag 1', value: '1' },
              { label: 'Tag 2', value: '2' },
            ]}
            label="Tags"
          />
          <Slider label="Volume" showValue />
        </Card>
      );

      expect(screen.getByLabelText('Search')).toBeInTheDocument();
      expect(screen.getByLabelText('Tags')).toBeInTheDocument();
      expect(screen.getByLabelText('Volume')).toBeInTheDocument();
    });
  });

  describe('Modal and Dialog Integration', () => {
    test('opens dialog from button click in modal', async () => {
      const TestComponent = () => {
        const [dialogOpen, setDialogOpen] = React.useState(false);
        const handleDialogClose = jest.fn();

        return (
          <Modal open={true} onClose={() => {}}>
            <Button onClick={() => setDialogOpen(true)}>
              Open Dialog
            </Button>
            <Dialog
              open={dialogOpen}
              onClose={() => { setDialogOpen(false); handleDialogClose(); }}
              title="Confirm"
              content="Are you sure?"
              confirmLabel="OK"
            />
          </Modal>
        );
      };

      render(<TestComponent />);

      const openButton = screen.getByText('Open Dialog');
      fireEvent.click(openButton);
      
      await waitFor(() => {
        expect(screen.getByText('Confirm')).toBeInTheDocument();
      });
    });
  });

  describe('Stepper with Form Integration', () => {
    test('creates multi-step form with stepper', () => {
      render(
        <div>
          <Stepper
            steps={[
              { label: 'Step 1' },
              { label: 'Step 2' },
              { label: 'Step 3' },
            ]}
            activeStep={0}
          />
          <Input label="Name" />
          <Button>Next</Button>
        </div>
      );

      expect(screen.getByText('Step 1')).toBeInTheDocument();
      expect(screen.getByText('Step 2')).toBeInTheDocument();
      expect(screen.getByLabelText('Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Step 2 Input')).toBeInTheDocument();
    });
  });
});

