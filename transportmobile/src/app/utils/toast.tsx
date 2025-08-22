"use client";
import { useState } from "react";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastOptions {
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
}

export default function Toaster() {
  const [toast, setToast] = useState<ToastOptions | null>(null);
  const [visible, setVisible] = useState(false);

  const showToast = ({
    title,
    description,
    type = "success",
    duration = 3000,
  }: ToastOptions) => {
    setToast({ title, description, type, duration });
    setVisible(true);

    setTimeout(() => {
      setVisible(false);
    }, duration);
  };

  
  const ToastUI = () =>
    visible && toast ? (
      <div className="fixed inset-0 flex items-center justify-center z-50">
      
        <div
          className="absolute inset-0 bg-[rgba(0,0,0,0.5)]"
          onClick={() => setVisible(false)}
        ></div>

 
        <div
          className={`relative bg-white rounded-2xl shadow-lg p-6 w-[80%] max-w-sm text-center transform transition-all duration-300 ${
            visible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
          }`}
        >
          
          <div
            className={`mx-auto mb-3 w-12 h-12 flex items-center justify-center rounded-full 
              ${
                toast.type === "success"
                  ? "bg-green-100 text-green-600"
                  : toast.type === "error"
                  ? "bg-red-100 text-red-600"
                  : toast.type === "warning"
                  ? "bg-yellow-100 text-yellow-600"
                  : "bg-blue-100 text-blue-600"
              }`}
          >
            <i
              className={`ri-${
                toast.type === "success"
                  ? "checkbox-circle-fill"
                  : toast.type === "error"
                  ? "close-circle-fill"
                  : toast.type === "warning"
                  ? "alert-fill"
                  : "information-fill"
              } text-2xl`}
            ></i>
          </div>

        
          <h2 className="text-lg font-semibold text-gray-900">{toast.title}</h2>

        
          {toast.description && (
            <p className="text-sm text-gray-600 mt-1">{toast.description}</p>
          )}

  
          <button
            onClick={() => setVisible(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>
      </div>
    ) : null;

  return { showToast, Toast: ToastUI };
}
