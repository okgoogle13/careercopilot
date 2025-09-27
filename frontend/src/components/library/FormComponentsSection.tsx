import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Switch } from '../ui/switch';
import { Checkbox } from '../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Slider } from '../ui/slider';
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
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text-input">Text Input</Label>
              <Input id="text-input" placeholder="Enter text here..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-input">Password Input</Label>
              <Input id="password-input" type="password" placeholder="Password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="textarea">Textarea</Label>
              <Textarea id="textarea" placeholder="Enter longer text here..." />
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
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
            <div className="space-y-2">
              <Label>Switch</Label>
              <div className="flex items-center space-x-2">
                <Switch id="switch" checked={switchChecked} onCheckedChange={setSwitchChecked} />
                <Label htmlFor="switch">Enable notifications</Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Checkbox</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="checkbox"
                  checked={checkboxChecked}
                  onCheckedChange={setCheckboxChecked}
                />
                <Label htmlFor="checkbox">I agree to the terms</Label>
              </div>
            </div>
          </div>
        </div>
      </ComponentDemo>

      <ComponentDemo title="Radio Group & Slider">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Label>Radio Group</Label>
            <RadioGroup value={radioValue} onValueChange={setRadioValue}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option1" id="option1" />
                <Label htmlFor="option1">Option 1</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option2" id="option2" />
                <Label htmlFor="option2">Option 2</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option3" id="option3" />
                <Label htmlFor="option3">Option 3</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-4">
            <Label>Slider</Label>
            <Slider
              value={sliderValue}
              onValueChange={setSliderValue}
              max={100}
              step={1}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">Value: {sliderValue[0]}</p>
          </div>
        </div>
      </ComponentDemo>
    </ComponentSection>
  );
}
