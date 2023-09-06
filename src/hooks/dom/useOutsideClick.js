import { useEffect } from "react";

export default function useOutsideClick(ref, callback, exceptionRef = null) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (!ref?.current?.contains(event?.target)) {
        if (exceptionRef) {
          if (!exceptionRef?.current?.contains(event?.target)) {
            callback && callback(false);
          }
        } else {
          callback && callback(false);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback, exceptionRef]);
}
