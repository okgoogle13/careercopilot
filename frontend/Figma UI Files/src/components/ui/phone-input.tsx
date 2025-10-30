import React, { useState, forwardRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

interface CountryCode {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

const countryCodes: CountryCode[] = [
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹' },
  { code: 'RU', name: 'Russia', dialCode: '+7', flag: '🇷🇺' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷' },
];

export interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  defaultCountry?: string;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ 
    value = '', 
    onChange, 
    defaultCountry = 'US',
    disabled,
    className = '',
    placeholder = 'Enter phone number'
  }, ref) => {
    const [selectedCountry, setSelectedCountry] = useState<CountryCode>(
      countryCodes.find(c => c.code === defaultCountry) || countryCodes[0]
    );
    const [phoneNumber, setPhoneNumber] = useState(value);
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCountries = countryCodes.filter(country =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.dialCode.includes(searchQuery)
    );

    const handleCountrySelect = (country: CountryCode) => {
      setSelectedCountry(country);
      setOpen(false);
      updateValue(country, phoneNumber);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newPhone = e.target.value.replace(/[^\d]/g, '');
      setPhoneNumber(newPhone);
      updateValue(selectedCountry, newPhone);
    };

    const updateValue = (country: CountryCode, phone: string) => {
      const fullNumber = phone ? `${country.dialCode} ${phone}` : '';
      onChange?.(fullNumber);
    };

    return (
      <div className={`flex gap-2 ${className}`}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              disabled={disabled}
              className={`
                px-3 py-3 flex items-center gap-2
                bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]
                border-2 border-[var(--glass-border)] rounded-[var(--radius-lg)]
                transition-all duration-300
                hover:border-[var(--glass-border-hover)] hover:shadow-[var(--shadow-glow-aurora)]
                focus:outline-none focus:border-transparent focus:shadow-[var(--shadow-glow-aurora)]
                ${disabled && 'opacity-50 cursor-not-allowed'}
              `}
              style={open ? {
                boxShadow: '0 0 24px rgba(167, 139, 250, 0.3), 0 0 48px rgba(244, 114, 182, 0.2)',
                borderImage: 'linear-gradient(135deg, var(--primary), var(--tertiary)) 1',
              } : {}}
            >
              <span className="text-xl">{selectedCountry.flag}</span>
              <span className="text-[var(--on-surface)]">{selectedCountry.dialCode}</span>
              <ChevronDown className={`w-4 h-4 text-[var(--primary)] transition-transform ${open && 'rotate-180'}`} />
            </button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-80 p-0 bg-[var(--surface-container)] border-2 border-[var(--glass-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-glow-aurora)]"
            align="start"
          >
            <div className="p-3 border-b border-[var(--glass-border)]">
              <input
                type="text"
                placeholder="Search countries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="
                  w-full px-3 py-2
                  bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]
                  border border-[var(--glass-border)] rounded-[var(--radius-md)]
                  text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)]
                  focus:outline-none focus:border-[var(--primary)]
                "
              />
            </div>
            <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--primary)] scrollbar-track-transparent">
              {filteredCountries.map((country) => {
                const isSelected = country.code === selectedCountry.code;
                return (
                  <button
                    key={country.code}
                    onClick={() => handleCountrySelect(country)}
                    className={`
                      w-full px-4 py-3 flex items-center justify-between gap-3
                      text-left transition-all duration-200
                      ${isSelected 
                        ? 'bg-gradient-to-r from-[var(--primary)]/20 to-[var(--tertiary)]/20' 
                        : 'hover:bg-[var(--glass-bg)]'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{country.flag}</span>
                      <div>
                        <p className="text-[var(--on-surface)]">{country.name}</p>
                        <p className="text-sm text-[var(--on-surface-variant)]">{country.dialCode}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-[var(--primary)]" />
                    )}
                  </button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>

        <input
          ref={ref}
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            flex-1 px-4 py-3
            bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]
            border-2 border-[var(--glass-border)] rounded-[var(--radius-lg)]
            text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)]
            transition-all duration-300
            hover:border-[var(--glass-border-hover)]
            focus:outline-none focus:border-transparent focus:shadow-[var(--shadow-glow-aurora)]
            ${disabled && 'opacity-50 cursor-not-allowed'}
          `}
          style={{
            boxShadow: '0 0 24px rgba(167, 139, 250, 0.3), 0 0 48px rgba(244, 114, 182, 0.2)',
          }}
        />
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';
