import React, { InputHTMLAttributes } from "react";
import { Path, useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

type Props<S> = {
  label: string,
  nameInSchema: Path<S>,
  itemClass?: string,
  labelClass?: string,
  inputClass?: string,
  messageClass?: string
  customChange?: (newValue?: any) => void
} & InputHTMLAttributes<HTMLInputElement>

export default function NumberInputWithLabel<S>({
  label, nameInSchema, itemClass, labelClass, inputClass, messageClass, customChange, ...props
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
            <Input
              type="number"
              id={nameInSchema}
              {...props}
              {...field}
              className={inputClass}
              value={field.value || ""}
              onChange={(e) => {
                if (customChange) {
                  customChange(Number(e.target.value));
                }
                field.onChange(Number(e.target.value));
              }}
            />
          </FormControl>
          <FormMessage className={cn(messageClass, "text-red-600")} />
        </FormItem>
      )}
    />
  );
}
