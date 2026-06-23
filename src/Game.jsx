import {Box, Clone, SpriteAnimator, useAnimations, useGLTF} from "@react-three/drei";
import Scene from "./scene/Scene.jsx";
import {Physics, RigidBody} from "@react-three/rapier";
import useStore from "../store.js";
import Player from "./components/Player.jsx";
import {
    CylinderInstance,
    Heart, ImageBox, InstancesObjects,
    MovementUp,
    Ocean,
    Restart, RigMovement, RigRotation,
    SavePosition, Sensor,
    Stars,
    VisibleObjectToDistance
} from "./components/Objects.jsx";
import SceneGame from "./scene/SceneGame.jsx";
import {useEffect} from "react";
import {grtObjects} from "./action/index.js";

export default function Game(){
    const pause = useStore((state) => state.pause);

    const {nodes, materials, animations} = useGLTF("./scene/Scene.glb")
    const {ref, actions} = useAnimations(animations);
    useEffect(()=>{
        console.log(nodes)

    },[])
    return <group ref={ref}>

       <InstancesObjects name={"palm_leaves"} arr={grtObjects("palm")} geometry={nodes.palm_2.geometry} materials={materials["leaves"]}/>
        <InstancesObjects name={"arrow"} arr={grtObjects("arrow")} geometry={nodes.arrow.geometry} materials={materials["arrow"]}/>
        <Physics debug={true} paused={pause} gravity={[0, -20, 0]} >
            <SceneGame nodes={nodes} materials={materials} />
            <Player nodes={nodes} />

            <Heart nodes={nodes}/>



            {/*

            <RigRotation arr={grtObjects("mill")} vel={{x:0,y:0,z:1.1}} colliders={"cuboid"}>
                <mesh >
                    <ImageBox args={[40,8,5]} name={"box.jpg"}  part={[1,1,1,1,1,1]} />
                </mesh>
            </RigRotation>
            <RigRotation arr={grtObjects("rotate_platform")} vel={{x:0,y:0,z:-5}} colliders={"cuboid"}>
                <mesh >
                    <ImageBox args={[4,0.2,0.7]} name={"box.jpg"}  part={[1,1,1,1,1,1]} />
                </mesh>
            </RigRotation>
            <RigRotation dist={100} arr={grtObjects("overturn")} vel={{x:0.1,y:0,z:0}} colliders={"cuboid"}>
                <mesh scale={[17,0.5,3]}>
                    <ImageBox args={[2,2,2]} name={"board.jpg"}  part={[1,1,1,1,1,1]} />
                </mesh>
            </RigRotation>
            <RigMovement arr={grtObjects("moveBox")} dist={100} vel={{speed:5,frequency:0.5}}  colliders={"cuboid"}>
                <mesh scale={[2,0.2,3]}>
                    <ImageBox args={[2,2,2]} name={"board.jpg"}  part={[1,1,1,1,1,1]} />
                </mesh>
            </RigMovement>
            <MovementUp />
            <RigMovement arr={grtObjects("moveBoxInvert")} dist={100} vel={{speed:5,frequency:0.3}}  colliders={"cuboid"}>
                <mesh scale={[2,0.2,3]}>
                    <ImageBox args={[2,2,2]} name={"board.jpg"}  part={[1,1,1,1,1,1]} />
                </mesh>
            </RigMovement>
            <RigRotation   dist={100} arr={grtObjects("blades")} vel={{x:0,y:0,z:0.07}} colliders={"trimesh"}>
                <primitive scale={[0.5,0.5,0.5]} position={[0,0,0]} object={nodes.blades} />
            </RigRotation>
            <RigRotation   dist={100} arr={grtObjects("rotationPole")} vel={{x:0,y:0.5,z:0}} colliders={"trimesh"}>
                <group scale={grtObjects("rotationPole")[0]?.scale}>
                    <mesh>
                        <CylinderInstance name={"./img/board.jpg"} args={[1,1,2]} />
                    </mesh>
                    <mesh>
                        <ImageBox args={[2,6,0.1]} name={"board.jpg"}  part={[1,1,1,1,1,1]} />
                    </mesh>
                    <mesh>
                        <ImageBox args={[0.1,6,2]} name={"board.jpg"}  part={[1,1,1,1,1,1]} />
                    </mesh>
                </group>
            </RigRotation>
            <RigMovement name={"rest"} dist={100} direction={"horizontal-z-one-sided"}  arr={grtObjects("feeds")} vel={{speed:-5,frequency:0.3,start:526, dist:480}}  colliders={"cuboid"}>
                <group position={[0,0,0]}>
                    <mesh position={[0,0,0]} scale={[3,1,1]}>
                        <ImageBox args={[2,2,0.2]} name={"board.jpg"}  part={[1,1,1,1,1,1]} />
                    </mesh>
                </group>
            </RigMovement>
            <RigRotation arr={grtObjects("shaft")} vel={{x:0.5,y:0,z:0}} dist={200} colliders={"trimesh"}>
                <Clone position={[0,0,0]} scale={2} object={nodes.shaft} />
            </RigRotation>
            <RigRotation dist={100} arr={grtObjects("rotating_beam")} vel={{x:0,y:0.2,z:0}} colliders={"cuboid"}>
                <mesh scale={[22.5,0.2,1]}>
                    <ImageBox args={[2,2,2]} name={"board.jpg"}  part={[1,1,1,1,1,1]} />
                </mesh>
            </RigRotation>
            <RigRotation dist={100} arr={grtObjects("saw")} vel={{x:1,y:0,z:0}} colliders={"trimesh"}>
                <Clone position={[0,0,0]} scale={2} object={nodes.saw}/>
            </RigRotation>*/}
        </Physics>


    </group>
}