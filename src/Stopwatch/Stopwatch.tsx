import React from "react";
import styles from "./Stopwatch.module.css"
import { useStopWatchContext } from "../contexts/StopwatchContext";

const HOURS_IN_SECONDS = 3600;
const MINUTES_IN_SECONDS = 60;

export const Stopwatch: React.FC = () => {
  const { time } = useStopWatchContext();
  const hours = Math.floor(time / HOURS_IN_SECONDS);
  const minutes = Math.floor((time % HOURS_IN_SECONDS) / MINUTES_IN_SECONDS);
  const seconds = Math.floor(time % MINUTES_IN_SECONDS);
  ;
  return (
    <div className={styles.stopwatchContainer}>
      <p className={styles.stopwatch}>
        {hours}:{minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </p>
    </div>
  );
}