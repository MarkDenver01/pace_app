import React from "react";
import { createPortal } from "react-dom";
import { HiX } from "react-icons/hi";

interface AlertDialogProps {
  isOpen: boolean;
  type: "success" | "error";
  title: string;
  message: string;
  onClose: () => void;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  type,
  title,
  message,
  onClose,
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
    >
      <div
        className="rounded-xl p-6 w-full max-w-sm shadow-xl card-theme relative"
        style={{
          backgroundColor: "var(--card-color)",
          color: "var(--text-color)",
        }}
      >
        <button
          className="absolute top-2 right-2 text-lg text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <HiX />
        </button>
        <div
          className={`text-lg font-semibold mb-2 ${
            type === "error" ? "text-red-600" : "text-green-600"
          }`}
        >
          {title}
        </div>
        <p className="text-sm">{message}</p>
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1 text-sm rounded-full text-white"
            style={{
              backgroundColor:
                type === "error" ? "#dc2626" : "var(--button-color)",
            }}
          >
            OK
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AlertDialog;
