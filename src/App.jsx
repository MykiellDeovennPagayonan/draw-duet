import { useState } from "react"
import Home from "./components/home"
import Games from "./components/games"
// import doodles from "./utils/doodles"
// import ml5 from "ml5"

function App() {
  const [atHome, setAtHome] = useState(true)

  // useEffect(() => {
  //   const initializeModels = async () => {
  //     for (let i = 0; i < doodles.length; i++) {
  //       try {
  //         const model = await ml5.sketchRNN(doodles[i]);
  //         console.log(model)
  //       } catch (error) {
  //         console.error('Error initializing the model:', error);
  //       }
  //     }
  //   };
  
  //   initializeModels();
  // }, []);

  return (
    <div
    className="h-screen w-screen flex bg-blue-100"
    >
      {atHome ? <Home setAtHome={setAtHome}/> : <Games setAtHome={setAtHome}/>}
    </div>
  )
}

export default App
