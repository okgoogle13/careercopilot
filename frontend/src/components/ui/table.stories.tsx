import type { Meta, StoryObj } from '@storybook/react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './table';
import { Badge } from '@careercopilot/ui';

const invoices = [
  {
    invoice: 'INV001',
    paymentStatus: 'Paid',
    totalAmount: '$250.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV002',
    paymentStatus: 'Pending',
    totalAmount: '$150.00',
    paymentMethod: 'PayPal',
  },
  {
    invoice: 'INV003',
    paymentStatus: 'Unpaid',
    totalAmount: '$350.00',
    paymentMethod: 'Bank Transfer',
  },
  {
    invoice: 'INV004',
    paymentStatus: 'Paid',
    totalAmount: '$450.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV005',
    paymentStatus: 'Paid',
    totalAmount: '$550.00',
    paymentMethod: 'PayPal',
  },
];

const meta: Meta<typeof Table> = {
  title: 'Components/UI/Table',
  component: Table,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Table>;

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>
              <Badge variant={invoice.paymentStatus === 'Paid' ? 'default' : 'secondary'}>
                {invoice.paymentStatus}
              </Badge>
            </TableCell>
            <TableCell>
              {invoice.invoice === 'INV003' ? 'Credit Card' : invoice.paymentMethod}
            </TableCell>
            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

export const Applications: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Company</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-bold">Google</TableCell>
          <TableCell>Senior Frontend Engineer</TableCell>
          <TableCell>
            <Badge>Interviewing</Badge>
          </TableCell>
          <TableCell className="text-muted-foreground">2 days ago</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-bold">Canva</TableCell>
          <TableCell>Product Designer</TableCell>
          <TableCell>
            <Badge variant="secondary">Applied</Badge>
          </TableCell>
          <TableCell className="text-muted-foreground">1 week ago</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-bold">Atlassian</TableCell>
          <TableCell>Engineering Manager</TableCell>
          <TableCell>
            <Badge variant="outline">Rejected</Badge>
          </TableCell>
          <TableCell className="text-muted-foreground">3 weeks ago</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
