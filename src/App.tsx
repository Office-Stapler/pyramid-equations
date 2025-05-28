import './App.css'
import { StopWatchProvider } from './contexts/StopwatchContext';
import { Game } from './Game';
import { useEffect, useState } from 'react';
import { Modal } from './Modal/Modal';

function App() {
  // Get the initial state from localStorage or default to true
  const initialShowTutorial = localStorage.getItem('showTutorial') === 'false' ? false : true;

  const [showTutorial, setShowTutorial] = useState(initialShowTutorial);

  useEffect(() => {
    localStorage.setItem('showTutorial', showTutorial.toString());
  }, [showTutorial])

  return (
    <StopWatchProvider>
      <div className="app">
        <Game />
        <Modal
          isOpen={showTutorial}
          onClose={() => setShowTutorial(false)}
          title="How to play Pyramid Equations"
          content={
            <div>
              <p>Pyramid Equations is a game based on trying to reach the target number</p>
              <p>The game is simple, choose 3 tiles (in any order) that when merged together reach the target number.</p>
              <p>The first tile chosen is the ONLY tile that matters for the order, since it will drop the operator (i.e. -9, x9, etc all become 9).</p>
              <p>e.g. Tiles (x3, -2, x3) will have two possible target numbers:</p>
              <ul>
                <li>3 (3 - 2 -- 1 x 3 = 3) </li>
                <li>7 (3 x 3 -- 9 - 2 = 7)</li>
              </ul>
            </div>
          }
        />
      </div>
    </StopWatchProvider>
  )
}

export default App
