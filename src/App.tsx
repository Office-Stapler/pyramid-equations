import { useState } from 'react';
import './App.css'
import { Pyramid } from './Pyramid/Pyramid'
import { Stopwatch } from './Stopwatch/Stopwatch';
import { StopWatchProvider } from './contexts/StopwatchContext';
import { Game } from './Game';

function App() {

  return (
    <StopWatchProvider>
      <div className="app">
        <Game />
      </div>
    </StopWatchProvider>
  )
}

export default App
