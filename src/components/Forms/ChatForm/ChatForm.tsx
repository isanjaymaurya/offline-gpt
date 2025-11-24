import { useState } from "react";
import Button from "../../UI/Button/Button";
import Textarea from "../../UI/Textarea/Textarea";

export type ChatFormProps = {
    userQuery: string;
    setUserQuery: (text: string) => void;
    placeholder?: string;
    disabled?: boolean;
    onSubmit?: (text: string) => void | Promise<void>;
    onAdd?: () => void | Promise<void>;
};

const ChatForm: React.FC<ChatFormProps> = ({
    userQuery,
    setUserQuery,
    disabled = false,
    onSubmit,
    onAdd
}) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim() || disabled) return;
    setLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(userQuery);
      } else {
      }

      setUserQuery("");

      if (onAdd) {
        await onAdd();
      }
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Textarea
        id="prompt"
        value={userQuery}
        onChange={(e) => setUserQuery(e.target.value)}
        rows={6}
        style={{ resize: "vertical", padding: 8 }}
        placeholder={"Type your query..."}
      />
      <Button
        type="submit"
        disabled={loading || !userQuery.trim() || disabled}
        loading={loading}
      >
        {loading ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
};

export default ChatForm;