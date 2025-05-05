import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { categoryOptions, colorOptions } from "@/Utils/productsUtils";
import FormSelectWithLabel from "@/components/Inputs/SelectWithLabel";

type ProductDetailsTabProps = {
  control: Control<any>;
};

export function ProductDetailsTab({ control }: ProductDetailsTabProps) {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormSelectWithLabel
            label="Category"
            nameInSchema="category"
            data={categoryOptions}
            displayField="name"
            fieldValue="id"
            placeHolder="Select a category"
          />

          <FormField
            control={control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input placeholder="Model" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormSelectWithLabel
            label="Color"
            nameInSchema="color"
            data={colorOptions}
            displayField="name"
            fieldValue="id"
            placeHolder="Select a color"
          />

          <FormField
            control={control}
            name="finish"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Finish</FormLabel>
                <FormControl>
                  <Input placeholder="Surface finish" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Separator className="my-6" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={control}
            name="length"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Length (mm)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    value={field.value === undefined || field.value === null || field.value === '' ? '' : Number(field.value)}
                    onChange={(e) => {
                      const value = e.target.value === '' ? '' : Number(e.target.value);
                      field.onChange(value);
                    }}
                    onBlur={() => {
                      if (field.value === '') {
                        field.onChange(null);
                      }
                    }}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
                    
          <FormField
            control={control}
            name="width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Width (mm)</FormLabel>
                <FormControl>
                  <Input 
                      type="number" 
                      value={field.value === undefined || field.value === null || field.value === '' ? '' : Number(field.value)}
                      onChange={(e) => {
                        const value = e.target.value === '' ? '' : Number(e.target.value);
                        field.onChange(value);
                      }}
                      onBlur={() => {
                        if (field.value === '') {
                          field.onChange(null);
                        }
                      }}
                      name={field.name}
                      ref={field.ref}
                    />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="thickness"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thickness (mm)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    value={field.value === undefined || field.value === null || field.value === '' ? '' : Number(field.value)}
                    onChange={(e) => {
                      const value = e.target.value === '' ? '' : Number(e.target.value);
                      field.onChange(value);
                    }}
                    onBlur={() => {
                      if (field.value === '') {
                        field.onChange(null);
                      }
                    }}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Separator className="my-6" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    value={field.value === undefined || field.value === null || field.value === '' ? '' : Number(field.value)}
                    onChange={(e) => {
                      const value = e.target.value === '' ? '' : Number(e.target.value);
                      field.onChange(value);
                    }}
                    onBlur={() => {
                      if (field.value === '') {
                        field.onChange(null);
                      }
                    }}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormDescription>Price per unit/m²</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="boxCoverage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Box Coverage</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    value={field.value === undefined || field.value === null || field.value === '' ? '' : Number(field.value)}
                    onChange={(e) => {
                      const value = e.target.value === '' ? '' : Number(e.target.value);
                      field.onChange(value);
                    }}
                    onBlur={() => {
                      if (field.value === '') {
                        field.onChange(null);
                      }
                    }}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormDescription>Area covered by one box (m²)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
