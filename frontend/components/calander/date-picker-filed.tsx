"use client";

import { Controller, Control } from "react-hook-form";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
interface DatePickerFieldProps {
  name: string;
  control: Control<any>;
  label?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
}

export function DatePickerField({
  name,
  control,
  label,
  minDate,
  maxDate,
  disabled,
}: DatePickerFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="flex flex-col">
          {label && <span className="mb-1 font-medium">{label}</span>}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
                disabled={disabled}
              >
                <CalendarIcon className="h-5 w-5 text-gray-500" />
                <span>{field.value || "YYYY-MM-DD"}</span>
              </Button>
            </PopoverTrigger>

            <PopoverContent
              side="bottom"
              align="start"
              sideOffset={8}
              avoidCollisions={false}
              collisionPadding={{ top: 96 }}
              className="z-40 p-0 w-auto"
              onOpenAutoFocus={(e) => e.preventDefault()}
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) =>
                  field.onChange(
                    date
                      ? `${date.getFullYear()}-${String(
                          date.getMonth() + 1
                        ).padStart(2, "0")}-${String(date.getDate()).padStart(
                          2,
                          "0"
                        )}`
                      : ""
                  )
                }
                captionLayout="dropdown"
                fromMonth={minDate || new Date(1980, 0)}
                toMonth={maxDate || new Date()}
              />
            </PopoverContent>
          </Popover>
          {fieldState.error && (
            <span className="text-red-600 mt-1 text-sm">
              {fieldState.error.message}
            </span>
          )}
        </div>
      )}
    />
  );
}
