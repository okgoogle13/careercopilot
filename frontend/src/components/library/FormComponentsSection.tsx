/**
 * ELECTRIC ALCHEMIST: FORM COMPONENTS SECTION
 *
 * Documentation section showcasing form components.
 */

import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/Checkbox';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup';
import { Select } from '@/components/ui/Select';
import { Slider } from '@/components/ui/Slider';
import { Switch } from '@/components/ui/Switch';
import { Textarea } from '@/components/ui/Textarea';
import { ComponentSection, ComponentDemo } from './ComponentDemo';

export function FormComponentsSection() {
  const [switchChecked, setSwitchChecked] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);
  const [radioValue, setRadioValue] = useState('option1');
  const [selectValue, setSelectValue] = useState('');

  return (
    <ComponentSection
      title="Form Components"
      description="Input controls and form elements for user data collection"
    >
      <ComponentDemo title="Input Controls">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="text-input">Text Input</Label>
              <Input id="text-input" placeholder="Enter text here..." />
            </div>
            <div>
              <Label htmlFor="password-input">Password Input</Label>
              <Input id="password-input" type="password" placeholder="Password" />
            </div>
            <div>
              <Label htmlFor="textarea">Textarea</Label>
              <Textarea id="textarea" placeholder="Enter longer text here..." />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Select
                label="Select"
                options={[
                  { label: 'Option 1', value: 'option1' },
                  { label: 'Option 2', value: 'option2' },
                  { label: 'Option 3', value: 'option3' },
                ]}
                value={selectValue}
                onChange={(e) => setSelectValue(e.target.value)}
              />
            </div>
            <div>
              <Label>Switch</Label>
              <div className="flex items-center">
                <Switch
                  id="switch"
                  checked={switchChecked}
                  onChange={(e) => setSwitchChecked(e.target.checked)}
                />
                <Label htmlFor="switch" className="ml-3">
                  Enable notifications
                </Label>
              </div>
            </div>
            <div>
              <Label>Checkbox</Label>
              <div className="flex items-center">
                <Checkbox
                  id="checkbox"
                  checked={checkboxChecked}
                  onChange={(e) => setCheckboxChecked(e.target.checked)}
                />
                <Label htmlFor="checkbox" className="ml-3">
                  I agree to the terms
                </Label>
              </div>
            </div>
          </div>
        </div>
      </ComponentDemo>

      <ComponentDemo title="Radio Group & Slider">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Radio Group</Label>
            <RadioGroup
              name="radio-group"
              value={radioValue}
              onChange={(value) => setRadioValue(value)}
            >
              <RadioGroupItem value="option1" label="Option 1" />
              <RadioGroupItem value="option2" label="Option 2" />
              <RadioGroupItem value="option3" label="Option 3" />
            </RadioGroup>
          </div>
          <div>
            <Slider
              label="Volume"
              min={0}
              max={100}
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              showValue
            />
          </div>
        </div>
      </ComponentDemo>
    </ComponentSection>
  );
}

export default FormComponentsSection;

