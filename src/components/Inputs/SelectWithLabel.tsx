import React, { ReactNode, useState } from "react";
import { Path, useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import {
  Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import LoadingSpinner from "../LoadingSpinner";

type BaseData = { id: string | number }

type Props<S, Data extends BaseData> = {
  label: string,
  nameInSchema: Path<S>,
  data: Data[] | undefined,
  displayField: keyof Data & string,
  fieldType?: "string" | "number"
  placeHolder?: string
  itemClass?: string,
  labelClass?: string,
  selectClass?: string,
  messageClass?: string
  onChange?: (newValue?: any) => void
  fieldValue?: keyof Data & string
  allowUnselect?: boolean
}

export default function FormSelectWithLabel<S, Data extends BaseData>({
  label,
  nameInSchema,
  data,
  displayField,
  fieldType = "string",
  placeHolder = "Select",
  itemClass,
  labelClass,
  selectClass,
  messageClass,
  fieldValue = "id",
  onChange,
  allowUnselect = false,
}: Props<S, Data>) {
  const [key, setKey] = useState(+new Date());
  const form = useFormContext();

  function handleChange(newValue: string, field: any) {
    if (fieldType === "string") {
      field.onChange(newValue);
    } else {
      field.onChange(Number(newValue));
    }
  }

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem className={itemClass}>
          <FormLabel className={labelClass} htmlFor={nameInSchema}>{label}</FormLabel>
          <Select
            value={(field.value as number | string)?.toString() || ""}
            onValueChange={(newValue) => {
              if (onChange) {
                onChange(newValue);
              }
              handleChange(newValue, field);
            }}
            key={key}
          >
            <FormControl>
              <SelectTrigger id={nameInSchema} className={selectClass}>
                <SelectValue placeholder={placeHolder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {data ? data.map((item) => (
                <SelectItem
                  key={`${nameInSchema}-${item.id}`}
                  value={(item[fieldValue] as number | string)?.toString()}
                >
                  {item[displayField] as ReactNode}
                </SelectItem>
              )) : <LoadingSpinner wrapperClass="py-3" />}
              {allowUnselect ? (
                <>
                  <SelectSeparator />
                  <Button
                    className="w-full px-2"
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onChange) {
                        onChange(undefined);
                      }
                      field.onChange(undefined);
                      setKey(+new Date());
                    }}
                  >
                    Clear
                  </Button>
                </>
              ) : null}
            </SelectContent>
          </Select>
          <FormMessage className={cn(messageClass, "text-red-600")} />
        </FormItem>
      )}
    />
  );
}
