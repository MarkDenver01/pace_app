// components/ThemedButton.tsx
import { Button, Spinner } from "flowbite-react";
import clsx from "clsx";

type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ThemedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  size?: ButtonSize;
  padding?: string;
  width?: string;
  height?: string;
  borderRadius?: string;
  bgColor?: string;
  textColor?: string;
  fontWeight?: number | string;
  className?: string;
}

export default function ThemedButton({
  children,
  onClick,
  disabled,
  loading,
  type = "button",
  size = "md",
  padding,
  width,
  height,
  borderRadius,
  bgColor,
  textColor,
  fontWeight = 600,
  className = "",
}: ThemedButtonProps) {
  const sizeStyles: Record<ButtonSize, string> = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2 text-base",
    lg: "px-7 py-3 text-lg",
  };

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        "flex items-center justify-center gap-2 transition-colors duration-200",
        sizeStyles[size],
        {
          "opacity-50 cursor-not-allowed": disabled || loading,
        },
        className
      )}
      style={{
        backgroundColor: bgColor ?? "var(--button-color)",
        color: textColor ?? "#fff",
        fontWeight,
        padding,
        width,
        height,
        borderRadius,
      }}
    >
      {loading ? <Spinner size={size === "lg" ? "lg" : size === "xs" ? "sm" : "md"} /> : children}
    </Button>
  );
}
