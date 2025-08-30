import { useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  return (
    <div className="p-3">
      <ReactDatePicker
        selected={selectedDate}
        onChange={(date: Date | null) => setSelectedDate(date)}
        className="border rounded-md p-2 w-full"
        dateFormat="yyyy/MM/dd"
        isClearable
        placeholderText="Select a date"
      />
    </div>
  );
}

export { Calendar };
