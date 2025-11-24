import React from "react";

import Chip from "../UI/Chip/Chip";

type Props = {
  suggestions?: string[];
  onSelect: (text: string) => void;
};

const DEFAULT_SUGGESTIONS = [
  "Summarize this text",
  "Explain like I'm five: quantum computing",
  "Generate test cases for a login API",
  "Draft an email to request feedback"
];

const ChatSuggestions: React.FC<Props> = ({ suggestions = DEFAULT_SUGGESTIONS, onSelect }) => {
  const handleClick = (s: string) => {
    onSelect(s);
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        alignItems: "center",
        justifyContent: "center",
        padding: 16
      }}
    >
      {suggestions.map((s: string) => (
        <Chip
          key={s}
          onClick={() => handleClick(s)}
          aria-label={`Use suggestion: ${s}`}
          label={s}
          variant="filled"
        />
      ))}
    </div>
  );
};

export default ChatSuggestions;