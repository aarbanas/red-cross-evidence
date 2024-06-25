"use client";
/* eslint-disable @typescript-eslint/no-unsafe-assignment,
@typescript-eslint/no-unsafe-call,
@typescript-eslint/no-unsafe-member-access,
@typescript-eslint/no-unsafe-argument */
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/atoms/Popover";
import { Input } from "~/components/atoms/Input";
import { CalendarDaysIcon } from "lucide-react";
import { Calendar } from "~/components/organisms/Calendar";
import React, { useState } from "react";
import moment from "moment";

const DatePicker: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            className="pr-10"
            placeholder="MM/DD/YYYY"
            type="date"
            readOnly
            value={
              selectedDate ? moment(selectedDate).format("yyyy-MM-DD") : ""
            }
          />
          <div className="absolute inset-y-0 right-3 flex items-center">
            <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Calendar mode="single" onSelect={(date) => setSelectedDate(date)} />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
