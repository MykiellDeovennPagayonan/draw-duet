/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import Sketch from "react-p5";
import ml5 from "ml5";
import doodles from "../../utils/doodles";

const widthCanvas = 500;
const heightCanvas = 500;

const FinishItAi = ({ setAtHome, setGamePlaying }) => {
  const [model, setModel] = useState(null);
  const [currentStroke, setCurrentStroke] = useState();
  const [nextPen, setNextPen] = useState("down");
  const [lines, setLines] = useState([]);
  const [personDrawing, setPersonDrawing] = useState(false);
  const [x, setX] = useState(widthCanvas / 2);
  const [y, setY] = useState(heightCanvas / 2);
  const [doodle, setDoodle] = useState(doodles[Math.floor(Math.random() * doodles.length)]);
  const [personToDraw, setPersonToDraw] = useState(false)
  const [strokesLeft, setStrokesLeft] = useState(3)

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
    console.log("Haah")
    if (strokesLeft <= 0) {
      setPersonToDraw(() => true)
    }
  }, [strokesLeft])

  const preload = () => {
    const sketchRNN = ml5.sketchRNN(doodle);
    console.log(doodle);
    setModel(() => sketchRNN);
  };

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(widthCanvas, heightCanvas).parent(canvasParentRef);
    p5.frameRate(40)
  };

  function gotStrokePath(error, strokePath) {
    console.log(strokePath);
    setCurrentStroke(() => strokePath);
  }

  function startDrawing() {
    setPersonDrawing(() => true);
  }

  const draw = (p5) => {
    p5.background("#F5F5DC");
    p5.stroke(0);
    p5.strokeWeight(4);

    for (const line of lines) {
      p5.line(line.x, line.y, line.x2, line.y2);
    }

    if (personDrawing) {
      console.log(p5.pmouseX);

      let strokePath = {
        dx: p5.mouseX - p5.pmouseX,
        dy: p5.mouseY - p5.pmouseY,
        pen: "down",
      };

      console.log(strokePath);

      const line = {
        x: x,
        y: y,
        x2: x + strokePath.dx,
        y2: y + strokePath.dy,
      };
      setLines(() => [...lines, line]);

      setX(x + strokePath.dx);
      setY(y + strokePath.dy);

      strokePath.dx *= 2;
      strokePath.dy *= 2;
    }

    if (model && currentStroke) {
      if (currentStroke.pen === "up") {
        setStrokesLeft(() => strokesLeft - 1)
      }

      if (currentStroke.pen === "end") {
        setStrokesLeft(() => -1)
      }

      if (nextPen === "down") {
        const line = {
          x: x,
          y: y,
          x2: x + currentStroke.dx / 2,
          y2: y + currentStroke.dy / 2,
        };
        setLines(() => [...lines, line]);
      }
      setX(x + currentStroke.dx / 2);
      setY(y + currentStroke.dy / 2);

      setNextPen(currentStroke.pen);
      setCurrentStroke(null);

      if (strokesLeft >= 1) {
        model.generate(gotStrokePath);
      }
    }
  };

  const mousePressed = (p5) => {
    console.log(personToDraw)
    if (personToDraw) {
      setPersonDrawing(() => true)
      setX(p5.mouseX)
      setY(p5.mouseY)
      startDrawing()
    }
  };

  const mouseReleased = () => {
    setPersonDrawing(() => false);
  };

  const newDoodle = () => {
    setLines(() => []);
    setStrokesLeft(() => 3)
    let doodleInitial = doodles[Math.floor(Math.random() * doodles.length)];
    setDoodle(() => doodleInitial);
    const sketchRNN = ml5.sketchRNN(doodleInitial);
    setModel(() => sketchRNN);
    console.log(doodleInitial);
  };

  return (
    <div className="grid grid-cols-10 h-full">
      <div className="col-span-3 flex flex-col p-8">
        <button
          className="bg-contain bg-no-repeat bg-center bg-transparent w-32 h-16 mr-auto focus:border-transparent hover:border-transparent"
          style={{
            backgroundImage: `url(${backButtonBg})`,
          }}
          onClick={() => {
            setAtHome(true);
            setGamePlaying("none");
          }}
        >
          {" "}
        </button>
        <h3 className="font-semibold text-3xl text-left mt-28">
          {" "}
          I will start the drawing and you will try to finish it!{" "}
        </h3>
      </div>

      <div className="col-span-4 flex h-full">
        <span className="border-2 m-auto border-black">
          <Sketch
            setup={setup}
            draw={draw}
            preload={preload}
            mousePressed={mousePressed}
            mouseReleased={mouseReleased}
          />
        </span>
      </div>

      <div className="col-span-3 flex flex-col py-16 px-8">
        <span className="flex">
          <h2 className="text-3xl font-bold m-auto"> We are drawing a </h2>
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

export default FinishItAi;
