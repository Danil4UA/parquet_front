import React from "react";
import "./Radio.css";

interface RadioProps {
  value: "shipping" | "pickup";
  selected: boolean;
  label: string;
  onChange: (value: "shipping" | "pickup") => void;
}
const Radio = ({ value, selected, onChange, label }: RadioProps) => {
  return (
    <div
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onClick={() => onChange(value)}
      onKeyUp={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onChange(value);
        }
      }}
      className="radio-item"
      aria-label={label}
    >
      <div className="radio-outer">
        <div className="radio-inner" />
      </div>
      <span className="radio-label">{label}</span>
    </div>
  );
};

export default Radio;
