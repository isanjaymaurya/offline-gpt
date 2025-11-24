import React from "react";
import cx from "classnames";
import styles from "./Chip.module.scss";

export type ChipProps = {
  label?: React.ReactNode;
  size?: "small" | "medium" | "large";
  variant?: "filled" | "outlined";
  color?: "default" | "primary" | "secondary";
  removable?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => void;
  onRemove?: () => void;
  className?: string;
  title?: string;
  "aria-label"?: string;
};

const Chip: React.FC<ChipProps> = ({
  label,
  size = "medium",
  variant = "outlined",
  color = "default",
  removable = false,
  startIcon,
  endIcon,
  onClick,
  onRemove,
  className,
  title,
  ...rest
}) => {
  const rootClass = cx(
    styles.chip,
    styles[variant],
    styles[size],
    styles[`color-${color}`],
    className
  );

  const handleKeyDownRemove = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " " || e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      onRemove?.();
    }
  };

  const Inner: React.FC = ({ children }) => (
      <button
        type="button"
        className={rootClass}
        onClick={onClick as any}
        title={title}
        {...(rest as any)}
      >
        {children}
      </button>
    );

  return (
    <Inner>
      {startIcon ? <span className={styles.startIcon}>{startIcon}</span> : null}
      {label ? <span className={styles.label}>{label}</span> : null}
      {endIcon ? <span className={styles.endIcon}>{endIcon}</span> : null}
      {removable ? (
        <button
          type="button"
          aria-label="Remove"
          className={styles.deleteBtn}
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          onKeyDown={handleKeyDownRemove}
        >
          <span aria-hidden>×</span>
        </button>
      ) : null}
    </Inner>
  );
};

export default Chip;