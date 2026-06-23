import Scene from "./Scene.jsx";
import useStore from "../../store.js";
import {VisibleObjectToDistance} from "../components/Objects.jsx";

export default function SceneGame({nodes,materials}){
    const level = useStore((state) => state.level);
    const location = useStore((state) => state.location);
    console.log(level)
    return location.filter((el)=>el.id === level).map((el)=><Scene   key={el.id + "_scene"} level={el.id} nodes={nodes} materials={materials} /> )
}