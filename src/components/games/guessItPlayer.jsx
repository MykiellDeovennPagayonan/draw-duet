/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import Sketch from "react-p5";
import ml5 from "ml5"
import doodles from "../../utils/doodles";

const widthCanvas = 500
const heightCanvas = 500

const GuessItPlayer = ({setAtHome, setGamePlaying}) => {
  const [positions, setPositions] = useState([])
  const [model, setModel] = useState(null)
  const [currentStroke, setCurrentStroke] = useState()
  const [nextPen, setNextPen] = useState("down")
  const [lines, setLines] = useState([])
  const [x, setX] = useState(widthCanvas / 2)
  const [y, setY] = useState(heightCanvas / 2)
  const [doodle, setDoodle] = useState(doodles[Math.floor(Math.random() * doodles.length)])
  const [aiDraw, setAiDraw] = useState(true)
  const [choices, setChoices] = useState([])
  const [showAnswers, setShowAnswers] = useState(false)

  const backButtonBg = "images/back.png";
  const nextDrawingButtonBg = "images/nextDrawing.png";

  useEffect(() => {
    if (model) {
      console.log(model)
      setX(() => widthCanvas / 2)
      setY(() => heightCanvas / 2)
      model.generate(gotStrokePath)
    }
  }, [model])

  useEffect(() => {
    setChoices(() => generateChoices(doodle))
  }, [])

  const preload = () => {
    const sketchRNN = ml5.sketchRNN(doodle)
    console.log(doodle)
    setModel(sketchRNN)
  }

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(widthCanvas, heightCanvas).parent(canvasParentRef);
    p5.frameRate(10)
  };

  function gotStrokePath(error, strokePath) {
    console.log(strokePath)
    setCurrentStroke(strokePath)
  }

  const draw = (p5) => {
    p5.background("#F5F5DC");
    p5.stroke(0)
    p5.strokeWeight(4)

    for (const line of lines) {
      p5.line(line.x, line.y, line.x2, line.y2);
    }

    if (model && currentStroke) {
      if (currentStroke.pen === "end") {
        setAiDraw(() => false)
      }

      if (nextPen === "down") {
        const line = {
          x: x,
          y: y,
          x2: x + currentStroke.dx / 2,
          y2: y + currentStroke.dy / 2
        }
        setLines([...lines, line])
      }
      setX(x + currentStroke.dx / 2)
      setY(y + currentStroke.dy / 2)

      setNextPen(currentStroke.pen);
      setCurrentStroke(null);

      console.log(aiDraw)
      if (aiDraw) {
        model.generate(gotStrokePath);
      }
    }
  };

  const mousePressed = (p5) => {
    const newPositions = [...positions, { x: p5.mouseX, y: p5.mouseY }];
    setPositions(newPositions);
  };

  const newDoodle = () => {
    setLines(() => [])
    setShowAnswers(() => false)
    let doodleInitial = doodles[Math.floor(Math.random() * doodles.length)]
    setDoodle(() => doodleInitial)
    setChoices(() => generateChoices(doodleInitial))
    setAiDraw(() => true)
    const sketchRNN = ml5.sketchRNN(doodleInitial)
    setModel(() => sketchRNN)
    console.log(doodleInitial)
  }

  const generateChoices = (correctChoice) => {
    let shuffledDoodles = [...doodles]
    shuffledDoodles.sort(() => Math.random() - 0.5);
    const choices = shuffledDoodles.slice(0, 4);
    const correctAnswerIndex = Math.floor(Math.random() * 4);
    choices[correctAnswerIndex] = correctChoice;
    return choices;
  };

  return (
    <div className="grid grid-cols-10 h-full">

      <div className="col-span-3 flex flex-col p-8">
        <button
          className="bg-contain bg-no-repeat bg-center bg-transparent w-32 h-16 mr-auto focus:border-transparent hover:border-transparent"
          style={{
            backgroundImage: `url(${backButtonBg})`,
          }}
          onClick={() => {setAtHome(true); setGamePlaying("none")}}
        > </button>
        <h3 className="font-semibold text-3xl text-left mt-28"> Try to guess what I’m drawing! </h3>
      </div>

      <div className="col-span-4 flex h-full">
        <span className="border-2 m-auto border-black">
          <Sketch setup={setup} draw={draw} preload={preload} mousePressed={mousePressed} />
        </span>
      </div>

      <div className="col-span-3 flex flex-col py-4 px-8">
        {!showAnswers ?
          choices.map((option) => {
            return <button className="h-16 bg-yellow-200 my-4 text-xl font-bold border-2 border-black"
              onClick={() => setShowAnswers(() => true)}
            >
              {option}
            </button>
          })
          :
          choices.map((option) => {
            return <button className={`h-16 my-4 text-xl font-bold border-2 border-black ${
              option === doodle ? "bg-green-200" : "bg-red-200"
            }`}
            >
              {option}
            </button>
          })
        }


        <button
          className="h-16 w-48 bg-contain bg-no-repeat bg-center bg-transparent border-none ml-auto mt-16 text-xl font-bold border-black"
          style={{
            backgroundImage: `url(${nextDrawingButtonBg})`,
          }}
          onClick={() => {
            newDoodle();
          }}
        ></button>
      </div>
    </div>
  );
};

export default GuessItPlayer