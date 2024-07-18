import React from 'react';
import './datepicker.css';

interface DatePickerProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  minDate?: string;
  maxDate?: string;
  size?: 'small' | 'medium' | 'large';
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  disabled = false,
  minDate,
  maxDate,
  size = 'medium',
}) => {
  return (
    <input
      type="date"
      className={`date-picker ${size}`}
      value={value}
      onChange={onChange}
      disabled={disabled}
      min={minDate}
      max={maxDate}
    />
  );
};

export default DatePicker;
