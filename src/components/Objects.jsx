import {useEffect, useMemo, useRef, useState} from "react";
import * as THREE from "three";
import {extend, useFrame, useLoader, useThree} from "@react-three/fiber";
import {Water} from "three-stdlib"
import {
    CuboidCollider,
    RigidBody,
    InstancedRigidBodies,
    useRapier, BallCollider
} from "@react-three/rapier";
import {Clone, Cloud, Clouds, Instance, Instances, SpriteAnimator, useTexture} from "@react-three/drei";
import useStore from "../../store.js";
import {getDistance, grtLevObjects, grtObjects, select, updateTb} from "../action/index.js";
import {Object3D, Vector3} from "three";


extend({Water})

export function InstancesObjects({arr, geometry, materials, children = null, name = "instance"}) {
  const ref = useRef(null)
    return <group>
        <Instances
            name={name}
            ref={ref}
            limit={arr.length} // Optional: max amount of items (for calculating buffer size)
            range={arr.length} // Optional: draw-range
            geometry={geometry}
            material={materials}
        >

            {children?children:""}
            {arr.map((el, i) => {
                return <Instance
                    key={el.id + name + i}
                    position={el.position}
                    rotation={el.rotation}
                    scale={el.scale}


                />
            })}
        </Instances>
    </group>
}

export function Ocean({scale = [2000, 1, 2000], position = [0, 0, 0]}) {
    const ref = useRef()
    const gl = useThree((state) => state.gl)
    const waterNormals = useLoader(THREE.TextureLoader, './img/waternormals.jpeg')
    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping
    const geom = useMemo(() => new THREE.PlaneGeometry(2, 2), [])
    const config = useMemo(
        () => ({
            textureWidth: 512,
            textureHeight: 512,
            waterNormals,
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 3.7,
            fog: false,
            format: gl.encoding
        }),
        [waterNormals]
    )
    useFrame((state, delta) => (ref.current.material.uniforms.time.value += delta))
    return <group position={position} scale={scale}>
        <water ref={ref} args={[geom, config]} rotation-x={-Math.PI / 2}/>
    </group>
}

export function RigCube({ arr }) {
    const bodyRef = useRef(null)
    const colliders = useMemo(() => {
        return arr.map((el) => (
            <CuboidCollider
                key={el.id}
                position={el.position}
                rotation={el.rotation}
                args={el.scale}
            />
        ));
    }, [arr]);



    return (
        <RigidBody ref={bodyRef} type="fixed" colliders={false}>
            {colliders}
        </RigidBody>
    );
}

export function BlockInstance({args, color}) {
    return <>
        <boxGeometry args={args}/>
        <meshStandardMaterial color={color}/>
    </>
}

function Star({arr = [],nodes,materials}){
    const  ref = useRef(null)
    const saterObj = new Object3D()
    const speed = 0.1; // радиан в секунду

    useFrame((state, delta) => {
        arr.forEach((el, i) => {
            saterObj.position.set(...el.position)
            saterObj.updateMatrix()
            saterObj.rotation.y += (delta * speed) / 100;
            ref.current.setMatrixAt(i, saterObj.matrix)
        })
        ref.current.instanceMatrix.needsUpdate = true
    });


    return <instancedMesh ref={ref} args={[nodes.star.geometry, materials['star'],arr.length]}/>
}

export function Stars({nodes,materials, level = 1}){
    const groupRef = useRef(null)
    const rigidBodies = useRef(null);
    const [arr,setArr] = useState(grtLevObjects("star",level))

    return<group ref={groupRef}>
                <Star arr={arr} nodes={nodes} materials={materials}/>
                <RigidBody   ref={rigidBodies} colliders={"ball"}  sensor={true} type={"fixed"} >
                   {arr.map((el, i)=><BallCollider key={el.id + "star_st" + i} name={el.id} args={[el.scale[0]]} position={el.position}
                              onIntersectionEnter={(e)=>{
                                  if(e.other.rigidBodyObject.userData.name === "player"){
                                      setArr(arr.filter((f)=>e.target.colliderObject.name !== f.id))
                                      useStore.getState().setStars(useStore.getState().stars + 1)
                                      updateTb("user",{stars:useStore.getState().stars},{id:1})

                                  }
                              }}
                />  )}
                </RigidBody>




    </group>
}

export function Heart({nodes}){
    const {world} = useRapier()
    const groupRef = useRef(null)
    const rigidBodies = useRef(null);
    return<group ref={groupRef}>
        {grtObjects("heart").map((el)=><RigidBody key={el.id + "heart"}
                                   ref={rigidBodies}
                                   sensor={true}
                                   colliders="ball"
                                   onIntersectionEnter={(e)=>{
                                       if(e.other.rigidBodyObject.userData.name === "player"){
                                           world.removeRigidBody(e.target.rigidBody)
                                           e.target.rigidBodyObject.visible = false
                                           useStore.getState().setHeart(useStore.getState().heart + 1)
                                           updateTb("user",{heart:useStore.getState().heart},{id:1})
                                           select("user").then((res)=>{
                                               useStore.getState().setUser(res)
                                           })
                                       }

                                   }}
                                   type={"fixed"} >
            <VisibleObjectToDistance  position={el.position} dist={50} >
                <Clone position={el.position} object={nodes.heart}/>
            </VisibleObjectToDistance>
        </RigidBody>)}
    </group>
}

export function Restart() {
    return <RigidBody name="restart" type="fixed">
        {grtObjects("restart").map((el) => <CuboidCollider
            key={el.id}
            sensor={true}
            name={"restart"}
            args={el.scale}
            position={el.position} />
        )}
    </RigidBody>
}

export function SavePosition({level = 1}) {
  /*  const  ref = useRef(null)
    const pointObj = new Object3D()*/
    const arr = grtLevObjects("save_pos",level)
    /*useFrame(() => {
        arr.forEach((el, i) => {
            pointObj.position.set(el.position[0],el.position[1] - 1,el.position[2])
            pointObj.updateMatrix()
            ref.current.setMatrixAt(i, pointObj.matrix)
        })
        ref.current.instanceMatrix.needsUpdate = true
    });*/

    return<>
       {/* <instancedMesh ref={ref} args={[nodes.point.geometry, materials['point'],arr.length]}/>*/}
        <RigidBody name="save-position" type="fixed">

            {arr.map((el) => <CuboidCollider
                key={el.id}
                sensor={true}
                name={"save-position"}
                args={el.scale}
                position={el.position} />
            )}
        </RigidBody>
    </>


}

export function Sensor({name,level = 1}){
    return <RigidBody userData={{name:name}} name={name} type="fixed">
        {grtLevObjects(name,level).map((el) => <CuboidCollider
            key={el.id}
            sensor={true}
            name={name}
            args={el.scale}
            position={el.position} />
        )}
    </RigidBody>
}

function Flag({nodes, position, complete, id,level}){
    const flagRef = useRef(null)
    useFrame(()=>{
        if(flagRef.current){

            if(complete.flag && complete.id === id || level === useStore.getState().level){
                if(flagRef.current.position.y < 4){
                    flagRef.current.position.y += 0.1
                }

            }
        }

    })
    return<group position={position} >
        <Clone ref={flagRef} object={nodes.flag} position={[0,-2,-2.5]} />
    </group>
}

export function SavePoint({arr = [{}], nodes, level=1}) {
    const [complete, setComplete] = useState({flag:false,id:0})
    return <RigidBody name="save-point" userData={{level:level}} sensor={true} type="fixed">
        {arr.map((el) =>
            <group key={el.id + "savepoint"}>
               <Flag nodes={nodes} position={el.position} id={el.id} level={level} complete={complete} />
                <CuboidCollider
                    sensor={true}
                    onIntersectionEnter={(e)=>{
                        if(e.other.rigidBodyObject.userData.name === "player"){
                            setComplete({flag:true, id:el.id})

                            if(parseInt(el.name.match(/[0-9]/g)[0]) !== useStore.getState().level) {
                                useStore.getState().setLevelComplete(true,parseInt(el.name.match(/[0-9]/g)[0]))
                                useStore.getState().setPause()
                            }

                            console.log(el.name.match(/[0-9]/g))
                        }
                    }}
                    onCollisionExit={(e)=>{
                        if(e.other.rigidBodyObject.userData.name === "player"){
                          //  setComplete({flag:false, id:0})
                        }
                    }}
                    name={"save-point"}
                    args={[4,4,4]}
                    position={el.position} />
            </group>

        )}
    </RigidBody>
}

export  function InstancesRigObjects({arr,onIntersectionEnter = ()=>{},geometry = null,materials, type = "fixed",name="", colliders = "cuboid", sensor = false, children}){
    const rigidBodies = useRef(null);
    const objRef = useRef(null);
    const instances = useMemo(()=>{
        return  arr.map((el)=>{
            return {
                key:el.id,
                position:el.position,
                rotation:el.rotation,
                scale:el.scale,
                userData: {name: name}

            }
        })
    },[arr,name])

    return <InstancedRigidBodies
                                  instances={instances}
                                  sensor={sensor}
                                  colliders={colliders}
                                  onIntersectionEnter={onIntersectionEnter}
                                  type={type} >
        {geometry?<instancedMesh ref={objRef} args={[geometry, materials, arr?.length]}/>:
            <instancedMesh ref={objRef} args={[null, null, arr?.length]}>
                {children}
            </instancedMesh>}
    </InstancedRigidBodies>
}

export function VisibleObjectToDistance({children, position = [0, 0, 0], dist = 250}){
    const groupRef = useRef()
    useFrame(({camera})=>{
        if (!groupRef.current) return
        groupRef.current.visible = getDistance(camera.position, {x: position[0], z: position[2]}, dist)
    })
    return <group ref={groupRef}>{children}</group>
}

function RotateChild({el,dist= 50,sensor = false, vel = { x: 0, y: 0.5, z: 0 },colliders = "cuboid", children}){
    const ref = useRef(null)
    const v = {
        x: vel.x !==0?vel.x:0,
        y: vel.y !==0?vel.y:0,
        z: vel.z !==0?vel.z:0
    }
    useFrame(() => {
        ref.current.setAngvel(v, true);

    });
    return <RigidBody sensor={sensor} dist={dist} ref={ref} position={el.position} rotation={el.rotation} args={el.scale} colliders={colliders} type={"kinematicVelocity"} >
       <VisibleObjectToDistance position={el.position} dist={dist}>{children}</VisibleObjectToDistance>
    </RigidBody>
}

export function RigRotation({arr,dist = 50, vel = { x: 0, y: 0.5, z: 0 },sensor = false ,colliders = "cuboid", children}){
    return arr.map((el)=> <RotateChild  sensor={sensor} dist={dist} key={el.id + "rigRotate"} el={el} vel={vel} colliders = {colliders} children={children}/>)
}

function MovementChild({el,dist= 50,direction = "vertical", name = "rest", vel = { speed: 3, frequency:2,start:0, dist:5},colliders = "cuboid", children}){
    const ref = useRef(null);
    const currentVelocity = useRef(0);

    const SPEED = vel.speed;     // Скорость движения
    const FREQUENCY = vel.frequency; // Частота (как быстро объект меняет направление)
    const position = new Vector3(el.position[0],el.position[1],el.position[2])

    useFrame((state) => {
        if (!ref.current) return;

        // 1. Вычисляем целевую скорость на основе времени
        const targetSpeed =  Math.cos(state.clock.elapsedTime * FREQUENCY) * SPEED ;

        // 2. Плавно сглаживаем скорость (lerp)
        currentVelocity.current = THREE.MathUtils.lerp(
            currentVelocity.current,
            targetSpeed,
            0.1
        );

        // 3. Получаем текущую скорость объекта, чтобы не затирать другие оси
        const rbVelocity = ref.current.linvel();

        // 4. Условие выбора направления
        let v = { x: 0, y: 0, z: 0 };

        if (direction === "vertical") {
            // Движение вверх-вниз (по оси Y)
            v = {
                x: 0,
                y: currentVelocity.current,
                z: 0
            };
        } else if (direction === "horizontal") {
            // Движение вперед-назад (по оси Z)
            // Для оси Y оставляем родную скорость rbVelocity.y, чтобы работала гравитация
            v = {
                x: 0,
                y: rbVelocity.y,
                z: currentVelocity.current
            };
        } else if (direction === "horizontal-x") {
            // Движение влево-вправо (по оси X), если вдруг понадобится
            v = {
                x: currentVelocity.current,
                y: rbVelocity.y,
                z: 0
            };
        }else if (direction === "horizontal-x-one-sided") {
            // Движение влево-вправо (по оси X), если вдруг понадобится
            v = {
                x: vel.speed,
                y: 0,
                z: 0
            };
            if (ref.current.translation().x > (position.x + vel.dist) || ref.current.translation().x < (position.x - vel.dist)){
               ref.current.setTranslation(position)
            }
        }else if (direction === "horizontal-y-one-sided") {
            // Движение влево-вправо (по оси X), если вдруг понадобится
            v = {
                x: 0,
                y: vel.speed,
                z: 0
            };
            if (ref.current.translation().y > (position.y + vel.dist) || ref.current.translation().y < (position.y - vel.dist)){
                ref.current.setTranslation(position)
            }
        }else if (direction === "horizontal-z-one-sided") {
            // Движение влево-вправо (по оси X), если вдруг понадобится
            v = {
                x: 0,
                y: 0,
                z: vel.speed,
            };

            if (vel.speed < 0 && ref.current.translation().z < vel.dist){
                ref.current.setTranslation({x: position.x, y: position.y, z: vel.start},true)
            }else if (vel.speed > 0 && ref.current.translation().z > vel.dist){
                ref.current.setTranslation({x: position.x, y: position.y, z: vel.start},true)
            }
        }

        // 5. Применяем скорость к физическому телу
        ref.current.setLinvel(v, true);
    });
    return <RigidBody dist={dist} ref={ref} position={el.position} rotation={el.rotation} args={el.scale} colliders={colliders} type={"kinematicVelocity"} >
        <VisibleObjectToDistance position={el.position} dist={dist}>
            {children}
        </VisibleObjectToDistance>
    </RigidBody>
}

export function RigMovement({arr,dist = 50,name = "rest", vel = { speed: 3, frequency: 2,start:0, dist:5 }, direction = "vertical" ,colliders = "cuboid", children}){
    return arr.map((el)=> <MovementChild name={name} dist={dist} key={el.id + "rigRotate"} el={el} vel={vel} direction={direction} colliders = {colliders} children={children}/>)
}

export  function ImageBox({name = "",args = [2,2,2],repeat=[1,1], partColor = ["","","","","",""], part = [0,0,0,0,0,0]}){

    if(!name.match(/\./)){
        name = name + ".png"
    }
    const texture = useTexture("./img/" + name)
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    let p = [0,0,0,0,0,0]
    let c = ["white","white","white","white","white","white"]
    if(part.length < 6){
        part = p
    }
    if(partColor.length < 6){
        partColor = c
    }
    let materials = []
    part.forEach((el,i)=>{
        if(el === 0){
            materials.push(<meshStandardMaterial key={"material-" + i} visible={partColor[i] !== ""}  attach={"material-" + i} transparent={true} alphaTest={0.5} color={partColor[i]}/>)
        }else {
            materials.push(<meshStandardMaterial key={"material-" + i} attach={"material-" + i} map={texture}  transparent={true} alphaTest={0.5} map-repeat={repeat} />)
        }
    })


    return<>
        <boxGeometry args={args}  />
        {materials}
    </>
}

export function CylinderInstance({args,name}) {

    const props = useTexture({
        map: name,
    })

    return <>
        <cylinderGeometry args={args}/>
         <meshStandardMaterial {...props} />
    </>

}

export function Portal({arr=[]}){
    return <group>
        <InstancesObjects arr={arr}>
            <boxGeometry args={[2,2,2]}  />
            <meshStandardMaterial color={"#C4F5F5"} opacity={0.5}/>
        </InstancesObjects>
        <RigidBody  type={"fixed"}>
            {arr.map((el)=><CuboidCollider key={el.id + "portal"} sensor={true} args={el.scale} position={el.position} rotation={el.rotation} />)}
        </RigidBody>
    </group>


}

export function MovementUp(){
    const location = useStore((state) => state.location);
    const moveUp = useMemo(()=>{
        const levels = location.map((el)=>el.location.filter((el)=>el.name.match(/\bmovement_up\.[0-9]+/)))
        const stars = []
        levels.forEach((el)=>{
            el.forEach((f)=>{
                stars.push(f)
            })
        })
        return stars
    },[location])
    return  <RigidBody  type={"fixed"} sensor={true}  colliders={"cuboid"} >
        {moveUp.map((el) => {

          return <group key={el.id + "MovementUp"}  position={el.position} rotation={el.rotation}>
              <CuboidCollider onIntersectionEnter={(e) => {
                  if (e.other.rigidBodyObject.userData.name === "player") {
                      e.other.rigidBody.setLinvel({x: 0, y: 30, z: 0}, true)
                  }

              }} sensor={true}  args={el.scale} />
              <VisibleObjectToDistance position={el.position} dist={50}>
                  <SpriteAnimator fps={8}
                                  position={[0, 0, 0]}
                                  startFrame={0}
                                  autoPlay={true}
                                  loop={true}
                                  scale={8}
                                  textureImageURL={'./img/smoke.png'}
                                  textureDataURL={'./json/frame.json'}
                                  alphaTest={0.01}
                                  asSprite={true}
                  />
              </VisibleObjectToDistance>
          </group>

        })}
    </RigidBody>
}

export function RigFixed({ arr }) {
    const bodyRef = useRef()
    const colliders = useMemo(() => {
        return arr.map((el) => (
            <CuboidCollider
                key={el.id}
                position={el.position}
                rotation={el.rotation}
                args={el.scale}
            />
        ));
    }, [arr]);



    return (
        <RigidBody ref={bodyRef} type="fixed" colliders={false}>
            {colliders}
        </RigidBody>
    );
}



