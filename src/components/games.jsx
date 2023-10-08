/* eslint-disable react/prop-types */
import { useState } from "react";

import Choose from "./games/choose";
import FinishItAi from "./games/finishItAI";
import FinishItPlayer from "./games/finishItPlayer";
import GuessItPlayer from "./games/guessItPlayer";
import WatchMeDraw from "./games/WatchMeDraw";

function Games({ setAtHome }) {
  const [gamePlaying, setGamePlaying] = useState('none')

  const borderImage = "images/border.png";

  return (
    <div
      className="bg-cover bg-center h-screen w-screen flex flex-col bg-blue-100 p-24"
      style={{
        backgroundImage: `url(${borderImage})`,
      }}
    >
      {gamePlaying === 'none' && <Choose setGamePlaying={setGamePlaying}/>}
      {gamePlaying === 'finish it ai' && <FinishItAi setAtHome={setAtHome} setGamePlaying={setGamePlaying}/>}
      {gamePlaying === 'finish it player' && <FinishItPlayer setAtHome={setAtHome} setGamePlaying={setGamePlaying}/>}
      {gamePlaying === 'guess it' && <GuessItPlayer setAtHome={setAtHome} setGamePlaying={setGamePlaying}/>}
      {gamePlaying === 'just watch me draw' && <WatchMeDraw setAtHome={setAtHome} setGamePlaying={setGamePlaying}/>}
    </div>
  );
}

export default Games;
