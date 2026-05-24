'use client';

import { format } from 'date-fns';
import { hr } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type DatePickerVariant = 'default' | 'filled';

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  variant?: DatePickerVariant;
  className?: string;
  disabled?: boolean;
}

function DatePicker({
  value,
  onChange,
  placeholder = 'Odaberite datum',
  variant = 'default',
  className,
  disabled = false,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-full justify-start text-left font-normal',
            // Default variant
            variant === 'default' && [
              'h-10 border-input bg-transparent shadow-xs',
              'hover:border-primary/50 hover:bg-transparent',
              'focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/20',
            ],
            // Filled variant
            variant === 'filled' && [
              'h-12 border-none bg-muted shadow-sm',
              'hover:bg-muted/80',
              'focus-visible:ring-[3px] focus-visible:ring-primary/30',
            ],
            !value && 'text-muted-foreground',
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, 'dd.MM.yyyy', { locale: hr }) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export type { DatePickerVariant };
export { DatePicker };
