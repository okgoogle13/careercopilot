import { Card, CardContent, CardHeader, CardActions, Typography, Box } from '@mui/material';
import { Box } from '@mui/material';
import React from 'react';

export const ComponentSection = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <section sx={{
      "space-y-4": true
    }}>
    <div>
      <h2 sx={{
      mb: 2
    }}>{title}</h2>
      <p sx={{
      "text-muted-foreground": true
    }}>{description}</p>
    </div>
    <div sx={{
      "space-y-6": true
    }}>{children}</div>
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
      <div sx={{
      "space-y-4": true
    }}>{children}</div>
    </CardContent>
  </Card>
);
