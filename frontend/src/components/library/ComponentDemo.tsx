import React from 'react';
import { Card, CardContent, CardHeader, CardActions, Typography, Box } from '@mui/material';

export const ComponentSection = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <section className="space-y-4">
    <div>
      <h2 className="mb-2">{title}</h2>
      <p className="text-muted-foreground">{description}</p>
    </div>
    <div className="space-y-6">{children}</div>
  </section>
);

export const ComponentDemo = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Card variant="elevation">
    <CardHeader title={<Typography variant="h3">{title}</Typography>}></CardHeader>
    <CardContent>
      <div className="space-y-4">{children}</div>
    </CardContent>
  </Card>
);
