import { ButtonBase, ButtonBaseProps } from "./ButtonBase";
import { cn } from "@/lib/utils";

export type ButtonProps<T> = {
  size?: "small" | "normal" | "large";
  colorVariant?: "primary" | "secondary";
  fullWidth?: boolean;
} & ButtonBaseProps<T>;

export function Button<T>(props: ButtonProps<T>) {
  const {
    size = "small",
    colorVariant = "primary",
    fullWidth = false,
    children,
    className,
    loading = false,
    ...buttonBaseProps
  } = props;

  return (
    <ButtonBase
      loading={loading}
      className={{
        button: cn(
          "cursor-pointer justify-center rounded-md text-center text-sm font-semibold transition-colors ease-linear disabled:cursor-not-allowed shadow-sm",
          {
            "disabled:opacity-50": !loading,
          },
          {
            "opacity-90": loading,
          },
          {
            // Primary
            "bg-coral-400 text-white": colorVariant === "primary",
            "hover:bg-coral-500 active:bg-coral-300 disabled:hover:bg-coral-400":
              colorVariant === "primary" && !loading,
          },
          {
            "w-full": fullWidth,
            "px-3 py-2": size === "small",
            "px-4 py-3 md:px-6 md:py-4": size === "normal",
            "px-10 py-4 text-xl md:px-12 md:py-5": size === "large",
          },
          className?.button
        ),
        loadingIcon: className?.loadingIcon,
      }}
      {...buttonBaseProps}
    >
      {children}
    </ButtonBase>
  );
}
