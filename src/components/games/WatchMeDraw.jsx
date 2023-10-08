/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import Sketch from "react-p5";
import ml5 from "ml5"
import doodles from "../../utils/doodles";

const widthCanvas = 500
const heightCanvas = 500

const WatchMeDraw = ({setAtHome, setGamePlaying}) => {
  const [positions, setPositions] = useState([])
  const [model, setModel] = useState(null)
  const [currentStroke, setCurrentStroke] = useState()
  const [nextPen, setNextPen] = useState("down")
  const [lines, setLines] = useState([])
  const [x, setX] = useState(widthCanvas / 2)
  const [y, setY] = useState(heightCanvas / 2)
  const [doodle, setDoodle] = useState(doodles[Math.floor(Math.random() * doodles.length)])
  const [aiDraw, setAiDraw] = useState(true)

  const backButtonBg = "images/back.png";
  const nextDrawingButtonBg = "images/nextDrawing.png";

  useEffect(() => {
    if (model) {
      setX(() => widthCanvas / 2)
      setY(() => heightCanvas / 2)
      model.generate(gotStrokePath)
    }
  }, [model])

  const preload = () => {
    const sketchRNN = ml5.sketchRNN(doodle)
    console.log(doodle)
    setModel(sketchRNN)
  }

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(widthCanvas, heightCanvas).parent(canvasParentRef);
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
        setX(widthCanvas / 2)
        setY(heightCanvas / 2)
        redraw()
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
    let doodleInitial = doodles[Math.floor(Math.random() * doodles.length)]
    setDoodle(() => doodleInitial)
    setAiDraw(() => true)
    const sketchRNN = ml5.sketchRNN(doodleInitial)
    setModel(() => sketchRNN)
    console.log(doodleInitial)
  }

  const redraw = () => {
    setTimeout(() => {
      model.generate(gotStrokePath)
      model.reset()
      setX(widthCanvas / 2);
      setY(heightCanvas / 2);
      setLines([])
      setAiDraw(true);
    }, 2000)
  }

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
        <h3 className="font-semibold text-3xl text-left mt-28"> Watch me draw Doodles! </h3>
      </div>

      <div className="col-span-4 flex h-full">
        <span className="border-2 m-auto border-black">
          <Sketch setup={setup} draw={draw} preload={preload} mousePressed={mousePressed} />
        </span>
      </div>

      <div className="col-span-3 flex flex-col py-16 px-8">
        <span className="flex">
          <h2 className="text-3xl font-bold m-auto"> I am trying to draw </h2>
        </span>
        <span className="h-20 mt-16 bg-yellow-200 my-4 text-3xl font-bold border-2 border-black flex">
          <h2 className="m-auto"> {doodle} </h2>
        </span>
        <button
          className="h-16 w-48 bg-contain bg-no-repeat bg-center bg-transparent border-none ml-auto mt-auto text-xl font-bold border-black"
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

export default WatchMeDraw