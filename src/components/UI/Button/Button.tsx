import React from "react";
import cx from "classnames";
import styles from "./Button.module.scss";

export type ButtonVariant = "contained" | "outlined" | "text";
export type ButtonSize = "small" | "medium" | "large";
export type ButtonColor = "default" | "primary" | "secondary" | "danger";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: ButtonColor;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      loading = false,
      children,
      disabled,
      className,
      variant = "contained",
      size = "medium",
      color = "default",
      startIcon,
      endIcon,
      fullWidth = false,
      ...rest
    },
    ref
  ) => {
    const isDisabled = Boolean(disabled) || loading;

    const cls = cx(
      styles.button,
      styles[variant],
      styles[size],
      styles[`color-${color}`],
      { [styles.fullWidth]: fullWidth, [styles.loading]: loading },
      className
    );

    return (
      <button
        {...rest}
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        className={cls}
      >
        {loading && (
          <span className={styles.spinner} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="img">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
              <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </span>
        )}

        {startIcon ? <span className={styles.startIcon}>{startIcon}</span> : null}
        <span className={styles.label}>{children}</span>
        {endIcon ? <span className={styles.endIcon}>{endIcon}</span> : null}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;