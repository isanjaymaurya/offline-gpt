import React from "react";
import Navbar from "../Navbar/Navbar";

type Props = {
  children?: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
};

const BaseLayout: React.FC<Props> = ({ children, sidebar, className }) => {
  return (
    <>
      <Navbar />
      <div
        className={`base-layout ${className ?? ""}`}
        style={{
          display: "flex",
          alignItems: "stretch",
          minHeight: "calc(100vh - 56px)"
        }}
      >
        {sidebar ? (
          <aside
            style={{
              width: 280,
              borderRight: "1px solid rgba(0,0,0,0.06)",
              padding: 12,
              boxSizing: "border-box",
            }}
          >
            {sidebar}
          </aside>
        ) : null}

        <main
          style={{
            flex: 1,
            padding: 16,
            boxSizing: "border-box",
          }}
        >
          {children}
        </main>
      </div>
    </>
  );
};

export default BaseLayout;