import "react-phone-number-input/style.css";
import React, { useState } from "react";
import { Path, useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import PhoneInput from "react-phone-number-input";
import { CountryCode } from "libphonenumber-js";

type Props<S> = {
  label: string,
  nameInSchema: Path<S>,
  itemClass?: string,
  labelClass?: string,
  inputClass?: string,
  countryClass?: string,
  phoneClass?: string,
  messageClass?: string
  placeholder?: string
  disabled?: boolean
}

export default function PhoneNumberInputWithLabel<S>({
  label,
  nameInSchema,
  itemClass,
  labelClass,
  inputClass,
  countryClass,
  phoneClass,
  messageClass,
  placeholder,
  disabled,
}: Props<S>) {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>("IL");
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem className={itemClass}>
          <FormLabel className={labelClass} htmlFor={nameInSchema}>{label}</FormLabel>
          <FormControl>
            <PhoneInput
              placeholder={placeholder}
              value={field.value || ""}
              onChange={(val) => {
                field.onChange(val || "");
              }}
              className={inputClass}
              numberInputProps={{
                className: phoneClass,
                disabled,
              }}
              countrySelectProps={{
                className: countryClass,
                disabled,
              }}
              onCountryChange={(value) => {
                if (value) {
                  setSelectedCountry(value);
                }
              }}
              defaultCountry={selectedCountry}
              initialValueFormat="national"
              disabled={disabled}
            />
          </FormControl>
          <FormMessage className={cn(messageClass, "text-red-600")} />
        </FormItem>

      )}
    />
  );
}
