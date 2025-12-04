import React, { TextareaHTMLAttributes } from "react";
import { Path, useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";

type Props<S> = {
  label: string,
  nameInSchema: Path<S>,
  itemClass?: string,
  labelClass?: string,
  textareaClass?: string,
  messageClass?: string
  customChange?: (newValue?: any) => void
  filterNewValue?: (newValue: any) => string
} & TextareaHTMLAttributes<HTMLTextAreaElement>

export default function TextareaWithLabel<S>({
  label,
  nameInSchema,
  itemClass,
  labelClass,
  textareaClass,
  messageClass,
  customChange,
  filterNewValue,
  ...props
}: Props<S>) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem className={itemClass}>
          <FormLabel className={labelClass} htmlFor={nameInSchema}>{label}</FormLabel>
          <FormControl>
            <Textarea
              id={nameInSchema}
              {...props}
              {...field}
              className={cn("min-h-32", textareaClass)}
              value={field.value || ""}
              onChange={(e) => {
                let newValue = e.target.value;
                if (filterNewValue) {
                  newValue = filterNewValue(newValue);
                }
                if (customChange) {
                  customChange(newValue);
                }
                field.onChange(newValue);
              }}
            />
          </FormControl>
          <FormMessage className={cn(messageClass, "text-red-600")} />
        </FormItem>
      )}
    />
  );
}
