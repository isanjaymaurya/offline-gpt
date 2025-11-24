import React from "react";
import cx from "classnames";
import styles from "./IconButton.module.scss";

export type IconButtonSize = "small" | "medium" | "large";
export type IconButtonColor = "default" | "primary" | "secondary";

export type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: IconButtonSize;
  color?: IconButtonColor;
  loading?: boolean;
  circle?: boolean; // circular vs square
};

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      size = "medium",
      color = "default",
      loading = false,
      circle = true,
      className,
      children,
      disabled,
      ...rest
    },
    ref
  ) => {
    const isDisabled = Boolean(disabled) || loading;

    const cls = cx(
      styles.iconButton,
      styles[size],
      styles[`color-${color}`],
      { [styles.circle]: circle, [styles.loading]: loading },
      className
    );

    return (
      <button
        {...rest}
        ref={ref}
        type={rest.type ?? "button"}
        className={cls}
        disabled={isDisabled}
        aria-busy={loading || undefined}
      >
        {loading ? (
          <span className={styles.spinner} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="img">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
              <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";

export default IconButton;