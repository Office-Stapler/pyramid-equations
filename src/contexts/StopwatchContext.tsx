import { createContext, useContext, useEffect, useRef, useState } from "react";

type StopWatchContextType = {
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
  time: number;
  startStopWatch: () => void;
  stopStopWatch: () => void;
  resetStopWatch: () => void;
}

export const StopWatchContext = createContext<StopWatchContextType | undefined>(undefined);

export const StopWatchProvider = ({ children }: { children: React.ReactElement }) => {
  const intervalId = useRef<number | undefined>(undefined);
  const [isActive, setIsActive] = useState(true);
  const [time, setTime] = useState(0);

  const resetInterval = () => {
    clearInterval(intervalId.current);
    intervalId.current = undefined;
  }

  const startStopWatch = () => {
    setIsActive(true);
  };

  const stopStopWatch = () => {
    setIsActive(false);
  };

  const resetStopWatch = () => {
    setTime(0);
    setIsActive(true);
    resetInterval();
  };

  useEffect(() => {
    if (isActive && intervalId.current) {
      return;
    }

    intervalId.current = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    if (!isActive) {
      return resetInterval();
    }
    return resetInterval;
  }, [isActive]);

  return (
    <StopWatchContext.Provider value={{ isActive, setIsActive, time, startStopWatch, stopStopWatch, resetStopWatch }}>
      {children}
    </StopWatchContext.Provider>
  );
};

export const useStopWatchContext = () => {
  const context = useContext(StopWatchContext);
  if (context === undefined) {
    throw new Error("useStopWatchContext must be used within a StopWatchProvider");
  }
  return context;
}


export const StopWatchConsumer = StopWatchContext.Consumer;