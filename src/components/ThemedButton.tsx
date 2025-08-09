// components/ThemedButton.tsx
import { Button, Spinner } from "flowbite-react";
import { useMemo } from "react";

type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ThemedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  size?: ButtonSize;
  padding?: string; // optional override
  width?: string;
  height?: string;
  borderRadius?: string;
  bgColor?: string; // override theme background
  textColor?: string; // override theme text color
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
  width = "auto",
  height = "auto",
  borderRadius = "0.5rem",
  bgColor,
  textColor,
  fontWeight = 600,
  className = "",
}: ThemedButtonProps) {
  // Preset sizing
  const sizeStyles: Record<
    ButtonSize,
    { padding: string; fontSize: string; spinnerSize: "sm" | "md" | "lg" }
  > = {
    xs: { padding: "0.2rem 0.5rem", fontSize: "0.75rem", spinnerSize: "sm" },
    sm: { padding: "0.25rem 0.75rem", fontSize: "0.875rem", spinnerSize: "sm" },
    md: { padding: "0.5rem 1.25rem", fontSize: "1rem", spinnerSize: "md" },
    lg: { padding: "0.75rem 1.75rem", fontSize: "1.125rem", spinnerSize: "lg" },
  };

  const { padding: presetPadding, fontSize, spinnerSize } =
    sizeStyles[size] ?? sizeStyles.md;

  // Fallback to theme colors if no override
  const resolvedBgColor = useMemo(
    () => bgColor ?? "var(--button-color)",
    [bgColor]
  );
  const resolvedTextColor = useMemo(
    () => textColor ?? "#fff",
    [textColor]
  );

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`flex items-center justify-center gap-2 ${className}`}
      style={{
        backgroundColor: resolvedBgColor,
        color: resolvedTextColor,
        fontWeight,
        padding: padding ?? presetPadding,
        width,
        height,
        fontSize,
        borderRadius,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background-color 0.2s, color 0.2s",
      }}
      aria-busy={loading ? true : undefined}
    >
      {loading ? <Spinner size={spinnerSize} /> : children}
    </Button>
  );
}
