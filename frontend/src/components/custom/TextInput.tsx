import React from "react";

type TextInputProps = {
  label: string;
  error?: string;
  placeholder?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const TextInput = ({
  label,
  error,
  placeholder,
  ...props
}: TextInputProps) => {
  return (
    <div className="mb-4  w-full ">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>

      <div className="relative">
        <input
          {...props}
          placeholder={placeholder || `e.g. ${label.toLowerCase()}`}
          className={` w-full px-4 py-2.5 border rounded-lg  bg-white text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            ${error ? "border-danring-danger ring-1 ring-danger" : "border-gray-300 hover:border-gray-400"}
            ${props.className || ""}
          `}
        />
      </div>

      {error && (
        <p className="mt-1.5 text-sm text-danger flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-danring-danger"></span>
          {error}
        </p>
      )}
    </div>
  );
};
