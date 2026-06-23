import './App.css'
import StartGame from "./scene/StartGame.jsx";
import {KeyboardControls, Sky} from "@react-three/drei";
import {Canvas} from "@react-three/fiber";
import { Perf } from 'r3f-perf'
import Game from "./Game.jsx";
import {createBase, deleteDatabase, insertTable, select, NAMEDB, exportDb} from "./action/index.js";
import {useEffect} from "react";
import useStore from "../store.js";
import TopMenu from "./ui/TopMenu.jsx";
import {connection} from "../Db.js";
import LevelComplete from "./ui/LevelComplete.jsx";

//await deleteDatabase()
await createBase()

function App() {

  useEffect(()=>{
     select("user").then((rez)=>{
      if(rez.filter((el)=>el.id).length === 0){
        insertTable("user",{stars:10,level:1})
      }
      useStore.getState().setUser(rez)
    })
document.addEventListener("keydown",(e)=>{
    if(e.key === "e" || e.key === "E" || e.key === "у" || e.key === "У"){
        useStore.getState().setPause()
    }
})
  },[])



  const keyboardMap = [
    {name: "forward", keys: ["ArrowUp", "w", "W", "ц", "Ц"]},
    {name: "backward", keys: ["ArrowDown", "s", "S", "ы", "Ы"]},
    {name: "leftward", keys: ["ArrowLeft", "a", "A", "ф", "Ф"]},
    {name: "rightward", keys: ["ArrowRight", "d", "D", "в", "В"]},
    {name: "jump", keys: ["Space", "0"]},
    {name: "run", keys: ["Shift"]},
    {name: "action4", keys: ["E,e,У,у"]},
  ];

  return <StartGame>
    <Canvas shadows camera={{fov: 60, near: 0.1, far: 100}}
            onPointerDown={(e) => {
              if (e.pointerType === 'mouse') {
                e.target.requestPointerLock()
              }
            }}>
      <fog  attach="fog" args={['white', 50, 100]} />
      <Sky sunPosition={[0, 10, 0]} distance={100000}/>
      <ambientLight intensity={1.5}/>
      <directionalLight position={[0, 50, 150]} intensity={1}/>

      <KeyboardControls map={keyboardMap}>
            <Game/>
      </KeyboardControls>

      <Perf  position="bottom-left" />
    </Canvas>
      <TopMenu/>
      <LevelComplete/>
  </StartGame>
}

export default App
