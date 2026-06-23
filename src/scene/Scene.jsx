import {
    CylinderInstance,
    ImageBox,
    InstancesObjects,
    InstancesRigObjects, Ocean, RigFixed,
    RigMovement,
    RigRotation,
    SavePoint, SavePosition, Sensor, Stars,
} from "../components/Objects.jsx";
import useStore from "../../store.js";
import {Clone} from "@react-three/drei";
import {grtLevObjects, grtObjects} from "../action/index.js";
import {RigidBody} from "@react-three/rapier";

export default function Scene({nodes,materials}){
    const level = useStore((state) => state.level);
    const board = grtLevObjects("board",level)
    const okean = grtLevObjects("okean",level)
    const box = grtLevObjects("box",level)
    const fregat = grtLevObjects("fregat",level)
    const stick = grtLevObjects("stick",level)
    const point = grtLevObjects("point",level)

   // useStore.getState().setLevel(1)
console.log(level)

    return <group>

        {level === 1?<group>
            <primitive object={nodes.fregat} position={fregat.position}/>
            <RigidBody position={[0, 0, 0]} type={"fixed"} colliders={"trimesh"}>
                <primitive object={nodes.start_game}/>
            </RigidBody>
        </group>:""}
        {okean.map((el)=><Ocean key={el.id + "okean"} position={el.position} scale={el.scale} />)}
        <RigFixed arr={board.concat(box)} />
        <SavePoint arr={stick} nodes={nodes} level={level}/>
        <Stars  nodes={nodes} materials={materials} level={level}  />
        <Sensor name={"restart"} level={level} />
        <SavePosition nodes={nodes} materials={materials} level={level}/>
        <InstancesObjects name={"palm_trunk"} arr={grtLevObjects("palm",level)} geometry={nodes.palm_1.geometry} materials={materials["trunk"]}/>
        <InstancesObjects name={grtLevObjects("point",level)} arr={point} geometry={nodes.point.geometry} materials={materials["point"]}/>
        <InstancesObjects arr={board}  >
            <ImageBox name={"board.jpg"}   part={[1,1,1,1,1,1]} />
        </InstancesObjects>
        <InstancesObjects arr={board}  >
            <ImageBox name={"board.jpg"}   part={[1,1,1,1,1,1]} />
        </InstancesObjects>
        <InstancesObjects arr={box}  >
            <ImageBox name={"box.jpg"}   part={[1,1,1,1,1,1]} />
        </InstancesObjects>
        <InstancesObjects name={"stick"} arr={stick} geometry={nodes.stick.geometry} materials={materials["stick"]} />


       {/* <InstancesRigObjects arr={stick} geometry={nodes.stick.geometry} materials={materials["stick"]} />
        <InstancesRigObjects type={"dynamic"} arr={grtLevObjects("box_dynamic",level)} >
            <ImageBox name={"box.jpg"}  part={[1,1,1,1,1,1]} />
        </InstancesRigObjects>
        <InstancesRigObjects colliders={"hull"}  arr={grtLevObjects("pole",level)} >
            <CylinderInstance args={[1,1,2]} name={"./img/board2.jpg"} />
        </InstancesRigObjects>

        <InstancesRigObjects colliders={"hull"}  arr={grtLevObjects("shaft_static",level)} geometry={nodes.shaft_static.geometry} materials={materials["shaft"]} />*/}
       {/* <InstancesRigObjects colliders={"trimesh"}  arr={bort} geometry={nodes.bort.geometry} materials={materials["shaft"]} />*/}
    </group>
}