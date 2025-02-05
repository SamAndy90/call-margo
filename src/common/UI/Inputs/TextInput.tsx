import { cn } from "@/lib/utils";
import { forwardRef, useId } from "react";

type BaseProps = {
  label?: string;
  className?: {
    label?: string;
    inputWrapper?: string;
    input?: string;
  };
  helperText?: string;
  error?: boolean;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
};

export type TextInputProps =
  | ({
      multiline?: false;
    } & BaseProps &
      Omit<React.InputHTMLAttributes<HTMLInputElement>, "className">)
  | ({
      multiline: true;
    } & BaseProps &
      Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "className">);

export const TextInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  TextInputProps
>((props, ref) => {
  const {
    label,
    className,
    helperText,
    error,
    startAdornment,
    endAdornment,
    multiline = false,
    ...inputProps
  } = props;
  const id = useId();

  const Component = multiline ? "textarea" : "input";

  return (
    <div className={"flex flex-col gap-y-1.5"}>
      {label && (
        <label
          htmlFor={id}
          className={cn("text-sm font-medium", className?.label)}
        >
          {label}
        </label>
      )}

      <div
        className={cn(
          "flex text-sm flex-nowrap focus-within:border-gray-600 hover:border-gray-400 focus-within:hover:border-gray-600 backdrop-blur items-center overflow-hidden rounded-md bg-not_darkblue border transition-colors",
          {
            "border-red-500": error,
            "border-gray-300": !error,
          },
          className?.inputWrapper
        )}
      >
        {startAdornment && <div className={"pl-3"}>{startAdornment}</div>}

        <Component
          id={id}
          className={cn(
            "block flex-1 px-3 py-[11px] outline-none bg-transparent  placeholder:text-gray-300",
            className?.input
          )}
          // @ts-expect-error ref discrimination error
          ref={ref}
          // autoComplete={"off"}
          // @ts-expect-error ref discrimination error
          type={multiline ? undefined : inputProps.type ?? "text"}
          {...{
            ...inputProps,
            onFocus: (e) => {
              // @ts-expect-error ref discrimination error
              inputProps?.onFocus?.(e);
            },
            onBlur: (e) => {
              // @ts-expect-error ref discrimination error
              inputProps?.onBlur?.(e);
            },
          }}
        />

        {endAdornment && <div className={"pr-3"}>{endAdornment}</div>}
      </div>

      {helperText && (
        <p
          className={cn("text-sm", {
            "text-red-500": error,
            "text-black/50": !error,
          })}
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

TextInput.displayName = "TextInput";
