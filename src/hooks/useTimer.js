import { useContext, useEffect } from "react";
import { TimerContext } from "../store/context/TimerContext";

export default function useTimer() {
  const { timestamp } = useContext(TimerContext);

  return { timestamp };
}
