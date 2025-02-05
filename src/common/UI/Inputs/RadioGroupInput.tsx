import { cn } from "@/lib/utils";
import { Label, Radio, RadioGroup } from "@headlessui/react";

type Option = {
  value: string;
  label: string;
};

export type RadioGroupInputProps = {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  className?: {
    label?: string;
  };
  label?: string;
  helperText?: string;
  error?: boolean;
};

export function RadioGroupInput(props: RadioGroupInputProps) {
  const { value, onChange, options, className, label, helperText, error } =
    props;

  return (
    <RadioGroup
      value={value}
      onChange={onChange}
      className={"flex flex-col gap-y-2.5"}
    >
      {label && (
        <Label className={cn("font-medium text-white", className?.label)}>
          {label}
        </Label>
      )}

      <div className={"flex gap-x-2.5"}>
        {options.map((i) => (
          <Radio key={i.value} value={i.value}>
            {({ checked }) => (
              <div
                className={cn(
                  "flex justify-center items-center min-w-10 h-10 py-[9px] px-[13px] bg-white/5 border border-white/[0.06] backdrop-blur rounded-md font-medium transition-colors",
                  {
                    "bg-gradient-to-br from-main-300/[0.08] to-main-500/[0.08] border-main-400":
                      checked,
                    "hover:bg-white/10": !checked,
                  }
                )}
              >
                {i.label}
              </div>
            )}
          </Radio>
        ))}
      </div>

      {helperText && (
        <p
          className={cn("text-sm", {
            "text-red-500": error,
            "border-white/10": !error,
          })}
        >
          {helperText}
        </p>
      )}
    </RadioGroup>
  );
}
