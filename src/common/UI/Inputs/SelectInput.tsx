import { cn } from "@/lib/utils";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { FiAlertTriangle, FiCheck, FiChevronUp } from "react-icons/fi";

export type Option = {
  value: string;
  label: string;
};

type BaseProps = {
  options: Option[];
  display?: string;
  className?: {
    label?: string;
    wrapper?: string;
    button?: string;
  };
  label?: string;
  helperText?: string;
  error?: boolean;
};

export type SelectInputProps =
  | ({
      value: string;
      onChange: (value: string) => void;
      multiple?: false;
    } & BaseProps)
  | ({
      value: string[];
      onChange: (value: string[]) => void;
      multiple: true;
    } & BaseProps);

export function SelectInput(props: SelectInputProps) {
  const {
    value,
    onChange,
    options,
    display = "",
    multiple,
    label,
    helperText,
    error,
    className = {},
  } = props;

  const { label: labelClassName, wrapper, button } = className;

  let displayValue = display;
  if (multiple) {
    const activeOptionsLabel = options
      .filter((i) => value.includes(i.value))
      .map((i) => i.label)
      .join(", ");
    if (activeOptionsLabel) displayValue = activeOptionsLabel;
  } else {
    const activeOptionLabel = options.find((i) => i.value === value)?.label;
    if (activeOptionLabel) displayValue = activeOptionLabel;
  }

  return (
    <div className={cn("flex flex-col gap-y-1.5", wrapper)}>
      {label && (
        <label className={cn("text-sm font-medium", labelClassName)}>
          {label}
        </label>
      )}
      <Listbox value={value} onChange={onChange} multiple={multiple}>
        <div className={"relative"}>
          <ListboxButton className={"outline-none w-full"}>
            {({ open, active }) => (
              <>
                <div
                  className={cn(
                    "flex flex-nowrap items-center px-3 py-[11px] bg-not_darkblue hover:bg-not_darkwhite-bghover backdrop-blur rounded-md border border-not_darkwhite-border transition-colors",
                    {
                      "border-not_darkwhite-border_focus": active,
                      "border-red-500": error,
                    },
                    button
                  )}
                >
                  <span
                    className={cn(
                      "flex-1 text-base text-not_gray text-left whitespace-nowrap line-clamp-1"
                    )}
                  >
                    {displayValue}
                  </span>
                  <FiChevronUp
                    className={cn(
                      "transform select-none transition duration-300 stroke-main-400",
                      {
                        "rotate-180": open,
                      }
                    )}
                  />
                </div>
              </>
            )}
          </ListboxButton>

          <ListboxOptions
            anchor={"bottom start"}
            transition
            className={
              "w-[var(--button-width)] [--anchor-gap:4px] z-[1000] !max-h-56 rounded-md border border-gray-300 bg-white focus:outline-none text-base text-gray-700 origin-top transition duration-300 ease-out data-[closed]:scale-95 data-[open]:scale-100 data-[closed]:opacity-0 divide-y-[1px] divide-gray-300"
            }
          >
            {options.map((i) => (
              <ListboxOption
                key={i.value}
                value={i.value}
                className={"overflow-x-hidden"}
              >
                {({ focus, selected }) => (
                  <div
                    className={cn(
                      "flex gap-x-2 items-center justify-between px-3 py-[11px] select-none cursor-pointer text-nowrap",
                      {
                        "bg-coral-50": focus,
                        "bg-coral-400 text-white": selected,
                      }
                    )}
                  >
                    <span className={"truncate"}>{i.label}</span>
                    {selected && (
                      <FiCheck className={"size-5 shrink-0 text-main-400"} />
                    )}
                  </div>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>

      {helperText && (
        <p
          className={cn("flex items-center gap-x-2 text-xs font-semibold", {
            "text-red-500": error,
            "text-gray-700": !error,
          })}
        >
          <FiAlertTriangle className={"size-4 stroke-[2.5px]"} />
          {helperText}
        </p>
      )}
    </div>
  );
}
