import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {useGLTF, useTexture} from "@react-three/drei";
const texture = [
    "box.jpg",
    "board.jpg",
    "board2.jpg",
].map((el)=>"./img/" + el)


useTexture.preload(texture)


useGLTF.preload([
    './scene/Scene.glb',
]);

createRoot(document.getElementById('root')).render(<App />)
