"use client";

import type { FC } from "react";
import { useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { hr } from "date-fns/locale/hr";
import { cn } from "./utils";
import moment from "moment";
import usePrevious from "~/hooks/usePrevious";

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
registerLocale("hr", hr);

type DateRangeFilterProps = {
  onSearch: (key: string, value: string) => void;
  column?: boolean;
};

const DateRangeFilter: FC<DateRangeFilterProps> = ({
  onSearch,
  column,
}: DateRangeFilterProps) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const prevStartDate = usePrevious<Date | null>(startDate);
  const prevEndDate = usePrevious<Date | null>(endDate);

  useEffect(() => {
    if (startDate) {
      if (!prevStartDate) {
        onSearch("dateFrom", moment(startDate).format("YYYY-MM-DD:HH:mm:ss"));
      } else if (prevStartDate !== startDate) {
        onSearch("dateFrom", moment(startDate).format("YYYY-MM-DD:HH:mm:ss"));
      }
    }

    if (endDate) {
      if (!prevEndDate) {
        onSearch("dateTo", moment(endDate).format("YYYY-MM-DD:HH:mm:ss"));
      } else if (prevEndDate !== endDate) {
        onSearch("dateTo", moment(endDate).format("YYYY-MM-DD:HH:mm:ss"));
      }
    }

    if (prevStartDate && !startDate) {
      onSearch("dateFrom", "");
    }

    if (prevEndDate && !endDate) {
      onSearch("dateTo", "");
    }
  }, [startDate, endDate, prevStartDate, prevEndDate, onSearch]);

  return (
    <div className="flex gap-5">
      <div className={cn("flex gap-2", column && "flex-col")}>
        <span>Datum od:</span>
        <DatePicker
          id="dateFrom"
          locale={"hr"}
          dateFormat={"dd.MM.yyyy"}
          selected={startDate}
          onChange={(date: Date | null) => {
            if (date) {
              setStartDate(moment(date).startOf("day").toDate());
              return;
            }
            setStartDate(null);
          }}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          isClearable
          className="rounded-md border border-gray-300 leading-none shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
      </div>
      <div className={cn("flex gap-2", column && "flex-col")}>
        <span>Datum do:</span>
        <DatePicker
          id="dateTo"
          locale={"hr"}
          dateFormat={"dd.MM.yyyy"}
          selected={endDate}
          onChange={(date: Date | null) => {
            if (!date) {
              setEndDate(null);
              return;
            }
            setEndDate(moment(date).startOf("day").toDate());
          }}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          isClearable
          minDate={startDate ?? undefined}
          className="rounded-md border border-gray-300 leading-none shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
      </div>
    </div>
  );
};

export default DateRangeFilter;
