import React from 'react';
import { Slider as MuiSlider, SliderProps as MuiSliderProps } from '@mui/material';

export interface SliderProps extends MuiSliderProps {}

export const Slider = React.forwardRef<HTMLSpanElement, SliderProps>(({ ...props }, ref) => {
  return <MuiSlider ref={ref} {...props} />;
});

Slider.displayName = 'Slider';
