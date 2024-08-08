import { type ToastType, toastContext } from '@/contexts/toastContext';
import { useContext } from 'react';

export function useToast() {
  const { toasts, setToasts } = useContext(toastContext);

  function notify(message: string) {
    const id = Math.random();
    const newToast: ToastType = { message, type: 'notify', id };
    setToasts((toasts) => [...toasts, newToast]);
    setTimeout(() => {
      setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
    }, 3000);
  }

  function warning(message: string) {
    const id = Math.random();
    const newToast: ToastType = { message, type: 'warning', id };
    setToasts((toasts) => [...toasts, newToast]);
    setTimeout(() => {
      setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
    }, 3000);
  }

  function error(message: string) {
    const id = Math.random() * 10000;
    const newToast: ToastType = { message, type: 'error', id };
    setToasts((toasts) => [...toasts, newToast]);
    setTimeout(() => {
      setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
    }, 3000);
  }

  function success(message: string) {
    const id = Math.random() * 10000;
    const newToast: ToastType = { message, type: 'success', id };
    setToasts((toasts) => [...toasts, newToast]);
    setTimeout(() => {
      setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
    }, 3000);
  }

  return { notify, warning, error, success, toasts, setToasts };
}
