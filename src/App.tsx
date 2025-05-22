import './App.css'
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
