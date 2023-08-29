import { useEffect, useState, useMemo, me } from "react";
import useTimer from "hooks/useTimer";

const useCountdown = (targetDate) => {
  // console.log("[useCountdown] init");
  const countDownDate = targetDate;
  const { timestamp } = useTimer();
  const [countDown, setCountDown] = useState(0);

  useEffect(() => {
    // const interval = setInterval(() => {
    //   setCountDown(countDownDate - new Date().getTime());
    // }, 1000);
    // console.log(`[useCountdown]:useEffect[countDownDate] timerId: `, interval);
    // console.log(`[useCountdown]:useEffect[countDownDate] timerId: `);
    // if (Date.now() > countDownDate) return;
    const currentTimestamp = parseInt(Date.now() / 1000);
    if (currentTimestamp > countDownDate) {
      if (countDown != 0) setCountDown(0);
    } else setCountDown(countDownDate - parseInt(Date.now() / 1000));
  }, [timestamp]);
  // console.log("[useCountdown] countDown:", countDown);
  return getReturnValues(countDown);
};

const getReturnValues = (countDown) => {
  // calculate time left
  const daysValue = parseInt(countDown / (3600 * 24));
  const hoursValue = parseInt(countDown / 3600) % 24;
  const minutesValue = parseInt(countDown / 60) % 60;
  const secondsValue = countDown % 60;

  const hours = hoursValue < 10 ? `0${hoursValue}` : hoursValue;
  const minutes = minutesValue < 10 ? `0${minutesValue}` : minutesValue;
  const seconds = secondsValue < 10 ? `0${secondsValue}` : secondsValue;
  const days = daysValue < 10 ? `0${daysValue}` : daysValue;
  return [
    hours,
    minutes,
    seconds,
    hoursValue,
    minutesValue,
    secondsValue,
    days,
    daysValue,
  ];
};

export { useCountdown };
