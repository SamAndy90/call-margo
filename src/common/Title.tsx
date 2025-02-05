import { cn } from "@/lib/utils";

export type TitleProps = {
  children: React.ReactNode;
  component?: React.ElementType;
  className?: string;
  size?: "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";
};

export function Title(props: TitleProps) {
  const {
    children,
    component: Component = "h2",
    className,
    size = "2xl",
  } = props;

  return (
    <Component
      className={cn(
        "text-gray-900",
        {
          "text-base font-medium": size === "base",
          "text-lg font-medium": size === "lg",
          "text-xl font-medium": size === "xl",
          "text-2xl font-semibold": size === "2xl",
          "text-3xl font-semibold": size === "3xl",
          "text-4xl font-semibold": size === "4xl",
        },
        className
      )}
    >
      {children}
    </Component>
  );
}
