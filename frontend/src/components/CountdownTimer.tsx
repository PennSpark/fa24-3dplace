import { useState, useEffect } from "react";

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  const calculateTimeLeft = () => {
    const targetDate = new Date("December 7, 2024 12:00:00");
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();

    if (difference > 0) {
      const days = String(
        Math.floor(difference / (1000 * 60 * 60 * 24))
      ).padStart(2, "0");
      const hours = String(
        Math.floor((difference / (1000 * 60 * 60)) % 24)
      ).padStart(2, "0");
      const minutes = String(
        Math.floor((difference / (1000 * 60)) % 60)
      ).padStart(2, "0");
      const seconds = String(Math.floor((difference / 1000) % 60)).padStart(
        2,
        "0"
      );

      return { days, hours, minutes, seconds };
    } else {
      return { days: "00", hours: "00", minutes: "00", seconds: "00" };
    }
  };

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const timerId = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  // Calculate if remaining time is less than 24 hours
  const isLessThan24Hours =
    parseInt(timeLeft.days) === 0 && parseInt(timeLeft.hours) < 24;

  return (
    <div id="red" className="countdown-timer">
      <div className="timer-segment">
        <p
          className={`timer-text ${isLessThan24Hours ? "text-[#eb1801]" : ""}`}
        >
          {timeLeft.days}
        </p>
        <span
          className={`timer-labels ${
            isLessThan24Hours ? "text-[#eb1801]" : ""
          }`}
        >
          Days
        </span>
      </div>
      <span
        className={`timer-separator ${
          isLessThan24Hours ? "text-[#eb1801]" : ""
        }`}
      >
        :
      </span>
      <div className="timer-segment">
        <p
          className={`timer-text ${isLessThan24Hours ? "text-[#eb1801]" : ""}`}
        >
          {timeLeft.hours}
        </p>
        <span
          className={`timer-labels ${
            isLessThan24Hours ? "text-[#eb1801]" : ""
          }`}
        >
          Hours
        </span>
      </div>
      <span
        className={`timer-separator ${
          isLessThan24Hours ? "text-[#eb1801]" : ""
        }`}
      >
        :
      </span>
      <div className="timer-segment">
        <p
          className={`timer-text ${isLessThan24Hours ? "text-[#eb1801]" : ""}`}
        >
          {timeLeft.minutes}
        </p>
        <span
          className={`timer-labels ${
            isLessThan24Hours ? "text-[#eb1801]" : ""
          }`}
        >
          Minutes
        </span>
      </div>
      <span
        className={`timer-separator ${
          isLessThan24Hours ? "text-[#eb1801]" : ""
        }`}
      >
        :
      </span>
      <div className="timer-segment">
        <p
          className={`timer-text ${isLessThan24Hours ? "text-[#eb1801]" : ""}`}
        >
          {timeLeft.seconds}
        </p>
        <span
          className={`timer-labels ${
            isLessThan24Hours ? "text-[#eb1801]" : ""
          }`}
        >
          Seconds
        </span>
      </div>
    </div>
  );
};

export default CountdownTimer;
