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
  <section sx={{}}>
    <div>
      <h2 sx={{
      mb: 2
    }}>{title}</h2>
      <p sx={{}}>{description}</p>
    </div>
    <div sx={{}}>{children}</div>
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
      <div sx={{}}>{children}</div>
    </CardContent>
  </Card>
);
