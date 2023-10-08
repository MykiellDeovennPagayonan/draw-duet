/* eslint-disable react/prop-types */

function Choose({ setGamePlaying }) {

  const finishItAiButtonBg = "images/finishItAi.png";
  const finishItPlayerButtonBg = "images/finishItPlayer.png";
  const guessItButtonBg = "images/guessIt.png";
  const watchMeDrawButtonBg = "images/justWatchMeDraw.png";

  return (
    <>
      <h1 className="text-center font-bold mt-12 mb-24"> What game do you want to play? </h1>
      <div className="flex w-full h-2/6">
        <button
          className="bg-contain bg-no-repeat bg-center bg-transparent h-full w-2/12 mx-auto focus:border-transparent hover:border-transparent"
          style={{
            backgroundImage: `url(${finishItAiButtonBg})`,
          }}
          onClick={() => setGamePlaying("finish it ai")}
        ></button>

        <button
          className="bg-contain bg-no-repeat bg-center bg-transparent h-full w-2/12 mx-auto focus:border-transparent hover:border-transparent"
          style={{
            backgroundImage: `url(${finishItPlayerButtonBg})`,
          }}
          onClick={() => setGamePlaying("finish it player")}
        > </button>

        <button
          className="bg-contain bg-no-repeat bg-center bg-transparent h-full w-2/12 mx-auto focus:border-transparent hover:border-transparent"
          style={{
            backgroundImage: `url(${guessItButtonBg})`,
          }}
          onClick={() => setGamePlaying("guess it")}
        > </button>

        <button
          className="bg-contain bg-no-repeat bg-center bg-transparent h-full w-2/12 mx-auto focus:border-transparent hover:border-transparent"
          style={{
            backgroundImage: `url(${watchMeDrawButtonBg})`,
          }}
          onClick={() => setGamePlaying("just watch me draw")}
        > </button>
      </div>
    </>
  );
}

export default Choose;
