import Controller from "ecctrl";
import {useEffect, useRef, useState} from "react";
import {useRapier} from "@react-three/rapier";
import {useFrame} from "@react-three/fiber";
import * as THREE from "three";
import {Vector3} from "three";
import useStore from "../../store.js";
import {routable, updateTb, whereId} from "../action/index.js";
export default function Player({nodes}){
    const { world,rapier } = useRapier();
    const playerRef = useRef(null)
    const ref = useRef(null)
    const bodyRef = useRef(null)
    const prevPos = useRef(new THREE.Vector3())
    const currPos = useRef(new THREE.Vector3())
    const [position, setPosition] = useState([])
    useEffect(()=>{
        whereId("user",1).then((res)=>{
            const r = res[0];
            setPosition(Object.values(r.positionPoint))

        })
    },[])

    useEffect(() => {
        bodyRef.current = world.bodies.getAll().find(el => el.userData?.name === "player");
    }, [world]);

    const movementDir = useRef(new THREE.Vector3());
    const forwardDir = useRef(new THREE.Vector3());

    useFrame((camera, delta)=>{
        const b = bodyRef.current;
        if (!b && !playerRef.current) return;
        playerRef.current.getWorldPosition(currPos.current)

        // расстояние между кадрами
        const distance = currPos.current.distanceTo(prevPos.current)

        // скорость (единиц в секунду)
        const speed = distance / delta

        // движется или стоит
        const isMoving = speed > 0.5

        // сохранить позицию


            prevPos.current.copy(currPos.current);



        if (isMoving) {
            movementDir.current.subVectors(currPos.current, prevPos.current).normalize();

            // 4. Получаем направление взгляда объекта
            playerRef.current.getWorldDirection(forwardDir.current);

            // 5. Скалярное произведение
            const dot = movementDir.current.dot(forwardDir.current);
            const isMovingForward = dot > 0;

            // 7. Вращаем колесо/объект
            if (isMovingForward) {
                playerRef.current.rotation.x -= delta * speed;
            } else {
                playerRef.current.rotation.x += delta * speed;
            }
        } else {
            playerRef.current.rotation.x = 0
        }

    })

    if(position.length > 0){
        return <>
            <Controller
                ref={ref}
                position={position}
                name={"player"}
                jumpVel={10}
                floatHeight={0}
                capsuleRadius={0.5}
                capsuleHalfHeight={0}
                maxVelLimit={10}
                camCollision={true}
                camLowLimit={0}
                slopeMaxAngle={routable(20)}
              //  friction={0}
                userData={{ name: "player" }}
                onIntersectionEnter={(e) => {
                    if(e.other.colliderObject.name === "restart"){
                        if(useStore.getState().heart > 0){
                            useStore.getState().setHeart(useStore.getState().heart - 1)
                            e.target.rigidBody.setTranslation(useStore.getState().position)
                            e.target.rigidBody.setLinvel({x:0,y:0,z:0},true)
                            updateTb("user",{heart:useStore.getState().heart},{id:1})

                        }else {
                            e.target.rigidBody.setTranslation(useStore.getState().positionPoint)
                            useStore.getState().setHeart(3)
                            updateTb("user",{heart:3,positionPoint:useStore.getState().positionPoint},{id:1})
                        }

                    }
                    if(e.other.colliderObject.name === "save-point"){
                        useStore.getState().setPositionPoint(e.target.rigidBody.translation())
                        useStore.getState().setPosition(e.target.rigidBody.translation())
                        updateTb("user",{heart:3,positionPoint:useStore.getState().positionPoint,level:useStore.getState().level},{id:1})
                        useStore.getState().setHeart(3)
                    }
                }}
                onCollisionExit={(e)=>{
                    if(e.other.colliderObject.name === "save-position"){
                        useStore.getState().setPosition(e.other.colliderObject.position)
                        updateTb("user",{heart:useStore.getState().heart,position:e.other.colliderObject.position},{id:1})
                    }
                }}

            >
                <group ref={playerRef}>
                    <primitive position={[0,0,0]} object={nodes.player} />

                </group>
            </Controller>
        </>
    }else {
        return null
    }

}