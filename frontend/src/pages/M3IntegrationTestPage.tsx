/**
 * M3 Components Integration Test Page
 * Demonstrates all M3 components working together in realistic scenarios
 * Used for integration testing and visual verification
 */

import React, { useState } from 'react';
import {
  M3Button,
  M3Input,
  M3Select,
  M3Card,
  M3Modal,
  M3Dialog,
  M3Menu,
  M3Tabbar,
  M3Breadcrumb,
  M3Stepper,
  M3Pagination,
  M3Table,
  M3List,
  M3Listitem,
  M3Badge,
  M3Chip,
  M3Progress,
  M3Alert,
  M3Snackbar,
  M3Tooltip,
  M3Loader,
  M3Spinner,
  M3Skeleton,
  M3Datepicker,
  M3Timepicker,
  M3Slider,
  M3Rangeslider,
  M3Autocomplete,
  M3Multiselect,
} from '@/components/m3-expressive';

export const M3IntegrationTestPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('tab1');
  const [currentPage, setCurrentPage] = useState(1);
  const [sliderValue, setSliderValue] = useState(50);
  const [rangeValue, setRangeValue] = useState<[number, number]>([20, 80]);

  const tableColumns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'progress', label: 'Progress', sortable: false },
  ];

  const tableData = [
    { name: 'Project Alpha', status: 'Active', progress: 75 },
    { name: 'Project Beta', status: 'Pending', progress: 45 },
    { name: 'Project Gamma', status: 'Completed', progress: 100 },
  ];

  return (
    <div style={{ padding: 'var(--md-sys-spacing-4)', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>M3 Components Integration Test Page</h1>

      {/* Navigation Section */}
      <section style={{ marginBottom: 'var(--md-sys-spacing-6)' }}>
        <h2>Navigation Components</h2>
        <M3Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Components', href: '/components' },
            { label: 'Integration Test', current: true },
          ]}
        />
        <M3TabBar
          items={[
            { label: 'Overview', value: 'tab1' },
            { label: 'Details', value: 'tab2' },
            { label: 'Settings', value: 'tab3' },
          ]}
          value={activeTab}
          onChange={setActiveTab}
        />
      </section>

      {/* Form Section */}
      <section style={{ marginBottom: 'var(--md-sys-spacing-6)' }}>
        <h2>Form Components</h2>
        <M3Card>
          <M3Input label="Full Name" placeholder="Enter your name" />
          <M3Select
            options={[
              { label: 'Option 1', value: '1' },
              { label: 'Option 2', value: '2' },
            ]}
            label="Category"
            placeholder="Select category"
          />
          <M3DatePicker label="Date" />
          <M3TimePicker label="Time" />
          <M3Autocomplete
            options={[
              { label: 'Apple', value: 'apple' },
              { label: 'Banana', value: 'banana' },
            ]}
            label="Search"
          />
          <M3MultiSelect
            options={[
              { label: 'Tag 1', value: '1' },
              { label: 'Tag 2', value: '2' },
            ]}
            label="Tags"
          />
          <M3Slider
            label="Volume"
            value={sliderValue}
            onChange={setSliderValue}
            showValue
          />
          <M3RangeSlider
            label="Price Range"
            value={rangeValue}
            onChange={setRangeValue}
            showValues
          />
          <M3Button onClick={() => setSnackbarOpen(true)}>Submit</M3Button>
        </M3Card>
      </section>

      {/* Data Display Section */}
      <section style={{ marginBottom: 'var(--md-sys-spacing-6)' }}>
        <h2>Data Display Components</h2>
        <M3Card>
          <M3Table
            columns={tableColumns}
            data={tableData}
            rowsPerPage={10}
            page={currentPage}
            onPageChange={setCurrentPage}
          />
        </M3Card>
        <M3Card>
          <M3List>
            <M3ListItem
              primary="List Item 1"
              secondary="With description"
              leading={<M3Badge value={3} />}
              trailing={<M3Chip label="New" size="small" />}
            />
            <M3ListItem
              primary="List Item 2"
              secondary="Another item"
              trailing={<M3Progress value={60} />}
            />
          </M3List>
        </M3Card>
      </section>

      {/* Feedback Section */}
      <section style={{ marginBottom: 'var(--md-sys-spacing-6)' }}>
        <h2>Feedback Components</h2>
        <M3Alert severity="success" onClose={() => {}}>
          Operation completed successfully!
        </M3Alert>
        <M3Alert severity="warning">
          Please review your settings
        </M3Alert>
        <M3Tooltip title="This is a tooltip">
          <M3Button>Hover me</M3Button>
        </M3Tooltip>
        <M3Loader value={75} showPercentage />
        <M3Spinner />
      </section>

      {/* Modal and Dialog Section */}
      <section style={{ marginBottom: 'var(--md-sys-spacing-6)' }}>
        <h2>Overlay Components</h2>
        <M3Button onClick={() => setModalOpen(true)}>Open Modal</M3Button>
        <M3Button onClick={() => setDialogOpen(true)}>Open Dialog</M3Button>
        <M3Menu
          items={[
            { label: 'Edit', value: 'edit' },
            { label: 'Delete', value: 'delete' },
          ]}
          trigger={<M3Button>Open Menu</M3Button>}
        />
      </section>

      {/* Stepper Section */}
      <section style={{ marginBottom: 'var(--md-sys-spacing-6)' }}>
        <h2>Stepper Component</h2>
        <M3Stepper
          steps={[
            { label: 'Step 1' },
            { label: 'Step 2' },
            { label: 'Step 3' },
          ]}
          activeStep={1}
        />
      </section>

      {/* Modals */}
      <M3Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h3>Modal Content</h3>
        <p>This is a modal with M3 styling</p>
        <M3Button onClick={() => setModalOpen(false)}>Close</M3Button>
      </M3Modal>

      <M3Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Confirm Action"
        content="Are you sure you want to proceed?"
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        onConfirm={() => setDialogOpen(false)}
        onCancel={() => setDialogOpen(false)}
      />

      {snackbarOpen && (
        <M3Snackbar
          message="Form submitted successfully"
          action="Undo"
          onAction={() => {}}
          onClose={() => setSnackbarOpen(false)}
        />
      )}
    </div>
  );
};

export default M3IntegrationTestPage;

