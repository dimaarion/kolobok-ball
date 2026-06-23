import {useEffect, useState} from "react";
import useStore from "../../store.js";

export default function LevelComplete() {

    const styleLg = {width:600,height:400,top:30,stR:20,stB:10,stW:200,tiT:-60,pl:150}
    const styleSm = {width:300,height:200,top:40,stR:10,stB:-10,stW:100,tiT:-5,pl:80}
      const [size, setSize] = useState(window.innerWidth > 1024 && window.innerHeight > 400?styleLg:styleSm)
     const complete = useStore((state)=>state.levelComplete)
     const level = useStore((state)=>state.levelStep)
    const pause = useStore((state)=>state.pause)
    function styles(){
        if(window.innerWidth > 1024 && window.innerHeight > 400){
            setSize(styleLg)
        }else {
            setSize(styleSm)
        }
    }

    useEffect(() => {
        window.addEventListener("resize",styles)
    }, []);


if(complete && pause){
    return <>

        <div className={"fixed z-50 m-auto w-full h-full right-0 left-0 top-0 bottom-0"}>
            <img className={"fixed  m-auto w-full h-full right-0 left-0 top-0 bottom-0"}
                 src={"./img/bg-level-complete.png"} alt={"Уровень пройден"}/>
            <div style={{width: size.width + "px", height: size.height + "px"}}
                 className={"absolute m-auto right-0 left-0 top-0 bottom-0"}>

                <div className={"absolute top-10  left-0 right-0 m-auto"}>
                    <img className={"w-full h-full"} src={"./img/panel-level-complete.png"} alt={"Колобок"}/>
                </div>
                <div className={"absolute text-2xl text-amber-100"}>  {level}</div>
                <div style={{top:size.tiT + "px"}} className={"absolute left-0 right-0 m-auto "}>
                    <img className={"w-full"} src={"./img/title-level-complete.png"} alt={"Заголовок Уровень пройден"}/>
                </div>
                <div style={{top:size.top,width:size.pl + "px"}} className={"absolute left-0 right-0 m-auto"}>
                    <img className={"w-full"} src={"./img/player.png"} alt={"Колобок"}/>
                </div>
                <div onPointerDown={()=>{
                    useStore.getState().setLevel(level)
                    useStore.getState().setLevelComplete(false,level)
                    useStore.getState().setPause()
                }} style={{right:size.stR + "px",bottom:size.stB + "px",width:size.stW + "px"}} className={"absolute m-auto"}>
                    <img className={"w-full"} src={"./img/stepLevel.png"} alt={"Далее"}/>
                </div>
            </div>
        </div>
    </>
}else {
    return null
}

}