import React from "react";
import { useTheme } from "../../../hooks/useTheme";

export default function Navbar() {
  const {isDark, toggle} = useTheme();

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <img src="/favicon-96x96.png" alt="Offline GPT logo" style={styles.logo} />
        <span style={styles.title}>Offline GPT</span>
      </div>

      <div style={styles.right}>
        <a
          href="https://github.com/isanjaymaurya/offline-gpt"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          style={styles.iconButton}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
            <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 4.93 3.19 9.11 7.61 10.58.56.1.76-.24.76-.53 0-.26-.01-.95-.01-1.86-3.09.67-3.74-1.49-3.74-1.49-.5-1.27-1.22-1.61-1.22-1.61-.99-.68.08-.66.08-.66 1.1.08 1.68 1.13 1.68 1.13.97 1.66 2.55 1.18 3.17.9.1-.7.38-1.18.69-1.45-2.47-.28-5.07-1.23-5.07-5.48 0-1.21.43-2.2 1.13-2.98-.11-.28-.49-1.4.11-2.92 0 0 .92-.3 3.02 1.13a10.5 10.5 0 0 1 2.75-.37c.93 0 1.88.13 2.75.37 2.1-1.44 3.02-1.13 3.02-1.13.6 1.52.22 2.64.11 2.92.7.78 1.13 1.77 1.13 2.98 0 4.26-2.61 5.19-5.09 5.47.39.34.73 1.01.73 2.04 0 1.47-.01 2.65-.01 3.01 0 .29.2.64.77.53 4.41-1.48 7.58-5.66 7.58-10.58C23.25 5.48 18.27.5 12 .5z" />
          </svg>
        </a>

        <button
          onClick={toggle}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={isDark ? "Light mode" : "Dark mode"}
          style={{ ...styles.iconButton, marginLeft: 12 }}
        >
          {isDark ? (
            // Sun icon
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
              <path d="M6.76 4.84l-1.8-1.79L3.17 4.84 4.97 6.63 6.76 4.84zM1 13h3v-2H1v2zm10-9h2V1h-2v3zm7.04 1.05l1.79-1.79-1.79-1.79-1.79 1.79 1.79 1.79zM17 13h3v-2h-3v2zM6.76 19.16l-1.79 1.79 1.79 1.79 1.79-1.79-1.79-1.79zM12 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm4.24-2.16l1.79 1.79 1.79-1.79-1.79-1.79-1.79 1.79zM11 23h2v-3h-2v3z" />
            </svg>
          ) : (
            // Moon icon
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
              <path d="M12.43 2.3a9 9 0 1 0 9.27 12.4 7 7 0 0 1-9.27-12.4z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}

const styles: { [k: string]: React.CSSProperties } = {
  header: {
    height: 56,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
    background: "var(--header-bg, #fff)",
    color: "var(--header-fg, #0f172a)",
  },
  left: { display: "flex", alignItems: "center", gap: 12 },
  logo: { width: 36, height: 36, objectFit: "contain" },
  title: { fontWeight: 700, fontSize: 16 },
  right: { display: "flex", alignItems: "center" },
  iconButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    borderRadius: 8,
    border: "none",
    background: "transparent",
    color: "inherit",
    cursor: "pointer",
    padding: 0,
  },
};