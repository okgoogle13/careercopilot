import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Box } from '@mui/material';
import React, { useState } from 'react';

import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';

import { ComponentSection, ComponentDemo } from './ComponentDemo';

export function FormComponentsSection() {
  const [switchChecked, setSwitchChecked] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [sliderValue, setSliderValue] = useState([50]);
  const [radioValue, setRadioValue] = useState('option1');
  const [selectValue, setSelectValue] = useState('');

  return (
    <ComponentSection
      title="Form Components"
      description="Input controls and form elements for user data collection"
    >
      <ComponentDemo title="Input Controls">
        <div sx={{
      "grid": true,
      [theme.breakpoints.up('sm')]: { "grid-cols-2": true },
      gap: 6
    }}>
          <div sx={{
      "space-y-4": true
    }}>
            <div sx={{
      "space-y-2": true
    }}>
              <Label htmlFor="text-input">Text Input</Label>
              <Input id="text-input" placeholder="Enter text here..." />
            </div>
            <div sx={{
      "space-y-2": true
    }}>
              <Label htmlFor="password-input">Password Input</Label>
              <Input id="password-input" type="password" placeholder="Password" />
            </div>
            <div sx={{
      "space-y-2": true
    }}>
              <Label htmlFor="textarea">Textarea</Label>
              <Textarea id="textarea" placeholder="Enter longer text here..." />
            </div>
          </div>
          <div sx={{
      "space-y-4": true
    }}>
            <div sx={{
      "space-y-2": true
    }}>
              <FormControl fullWidth>
                <InputLabel>Select</InputLabel>
                <Select
                  value={selectValue}
                  label="Select"
                  onChange={(e) => setSelectValue(e.target.value)}
                >
                  <MenuItem value="option1">Option 1</MenuItem>
                  <MenuItem value="option2">Option 2</MenuItem>
                  <MenuItem value="option3">Option 3</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div sx={{
      "space-y-2": true
    }}>
              <Label>Switch</Label>
              <div sx={{
      display: "flex",
      alignItems: "center",
      "space-x-2": true
    }}>
                <Switch
                  id="switch"
                  checked={switchChecked}
                  onChange={(e) => setSwitchChecked(e.target.checked)}
                />
                <Label htmlFor="switch">Enable notifications</Label>
              </div>
            </div>
            <div sx={{
      "space-y-2": true
    }}>
              <Label>Checkbox</Label>
              <div sx={{
      display: "flex",
      alignItems: "center",
      "space-x-2": true
    }}>
                <Checkbox
                  id="checkbox"
                  checked={checkboxChecked}
                  onChange={(e) => setCheckboxChecked(e.target.checked)}
                />
                <Label htmlFor="checkbox">I agree to the terms</Label>
              </div>
            </div>
          </div>
        </div>
      </ComponentDemo>

      <ComponentDemo title="Radio Group & Slider">
        <div sx={{
      "grid": true,
      [theme.breakpoints.up('sm')]: { "grid-cols-2": true },
      gap: 6
    }}>
          <div sx={{
      "space-y-4": true
    }}>
            <Label>Radio Group</Label>
            <RadioGroup value={radioValue} onChange={(e) => setRadioValue(e.target.value)}>
              <div sx={{
      display: "flex",
      alignItems: "center",
      "space-x-2": true
    }}>
                <RadioGroupItem value="option1" id="option1" />
                <Label htmlFor="option1">Option 1</Label>
              </div>
              <div sx={{
      display: "flex",
      alignItems: "center",
      "space-x-2": true
    }}>
                <RadioGroupItem value="option2" id="option2" />
                <Label htmlFor="option2">Option 2</Label>
              </div>
              <div sx={{
      display: "flex",
      alignItems: "center",
      "space-x-2": true
    }}>
                <RadioGroupItem value="option3" id="option3" />
                <Label htmlFor="option3">Option 3</Label>
              </div>
            </RadioGroup>
          </div>
          <div sx={{
      "space-y-4": true
    }}>
            <Label>Slider</Label>
            <Slider
              value={sliderValue}
              onChange={(e, value) => setSliderValue(Array.isArray(value) ? value : [value])}
              max={100}
              step={1}
              sx={{
      width: "100%"
    }}
            />
            <p sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>Value: {sliderValue[0]}</p>
          </div>
        </div>
      </ComponentDemo>
    </ComponentSection>
  );
}
