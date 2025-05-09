import { useFormContext } from "react-hook-form";

interface RadioProps {
  value: string;
  label: string;
  name: string;
  containerClass?: string;
}

const Radio = ({ value, label, name, containerClass = "" }: RadioProps) => {
  const { register, watch } = useFormContext();
  const selectedValue = watch(name);
  
  return (
    <div className={`flex items-center cursor-pointer ${containerClass}`}>
      <input
        type="radio"
        id={`${name}-${value}`}
        value={value}
        className="hidden"
        {...register(name)}
      />
      <div 
        className={`w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center mr-2 ${
          selectedValue === value ? "border-black" : ""
        }`}
      >
        {selectedValue === value && (
          <div className="w-3 h-3 rounded-full bg-black"></div>
        )}
      </div>
      <label 
        htmlFor={`${name}-${value}`}
        className="cursor-pointer"
      >
        {label}
      </label>
    </div>
  );
};

export default Radio;