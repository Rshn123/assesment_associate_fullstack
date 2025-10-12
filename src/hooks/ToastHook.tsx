// hooks/useToast.tsx
import { useState, useCallback } from "react";
import { Toast } from "../pages/Toast";

export const useToast = () => {
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error" | "info";
  } | null>(null);

  const showToast = useCallback(
    (message: string, type?: "success" | "error" | "info") => {
      setToast({ message, type });
    },
    []
  );

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  const ToastContainer = toast ? (
    <Toast message={toast.message} type={toast.type} onClose={hideToast} />
  ) : null;

  return { showToast, ToastContainer };
};
