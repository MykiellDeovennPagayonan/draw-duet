/* eslint-disable react/prop-types */
function Home({setAtHome}) {

  const backgroundImage = "images/background.png"
  const chooseAGameButton = "images/choose_a_game.png"

  return (
    <div
    className="bg-cover bg-center h-screen w-screen flex bg-blue-100"
    style={{
      backgroundImage: `url(${backgroundImage})`,
    }}
    >
      <div className='m-auto mt-36 flex flex-col'>
        <h1 className='font-bold text-center'> DRAW DUET </h1>
        <h2 className='font-bold text-3xl text-center mt-4'> Get silly, drawing doodles with a robot </h2>
        <div className="h-auto w-auto flex mt-8">
          <button className="bg-contain bg-no-repeat bg-center bg-transparent h-24 w-6/12 mx-auto focus:border-transparent hover:border-transparent" 
              style={{
                backgroundImage: `url(${chooseAGameButton})`,
              }}
              onClick={() => setAtHome(false)}>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home
