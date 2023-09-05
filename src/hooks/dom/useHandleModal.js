import { useState } from "react";

export default function useHandleModal() {
  const [isActive, setIsActive] = useState(false);

  const open = () => setIsActive(true);
  const close = () => setIsActive(false);

  return {
    isActive,
    open,
    close,
  };
}
