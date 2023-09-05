import { toast } from "react-toastify";

export default function useHandleToastAlert() {
  const options = {
    position: "top-right",
    autoClose: true,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  const success = (message) => toast.success(() => message, options);
  const error = (title, message = "") => toast.error(message ? `${title}: ${message}` : title);

  return {
    success,
    error,
  };
}
