import { useEffect } from "react";
import { toast } from "sonner";

function Alert({ type = "success", message, trigger }) {
  useEffect(() => {
    if (!message) return;

    toast[type]?.(message) || toast(message);
  }, [trigger]); // ❗ faqat triggerga bog‘laymiz

  return null;
}

export default Alert;
