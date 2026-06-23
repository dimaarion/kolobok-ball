import useStore from "../../store.js";
import {createArray} from "../action/index.js";
import {useEffect} from "react";

export default function TopMenu(){
    const user = useStore((state)=>state.user)
    const stars =  useStore((state)=>state.stars)
    const heart =  useStore((state)=>state.heart)
    useEffect(() => {
        useStore.getState().setStars(user?.find((el)=>el.id === 1)?.stars)
        useStore.getState().setHeart(user?.find((el)=>el.id === 1)?.heart)
        useStore.getState().setPositionPoint(user?.find((el)=>el.id === 1)?.positionPoint)
        useStore.getState().setLevel(user?.find((el)=>el.id === 1)?.level)
      /*  useStore.getState().setPosition(user?.find((el)=>el.id === 1)?.position)*/
       // console.log(user?.find((el)=>el.id === 1)?.positionPoint,user?.find((el)=>el.id === 1)?.positionPoint
    }, [user]);



    return <div className={"fixed top-0 left-0 right-0 m-auto"}>
        <div className={"flex justify-center"}>
            <div className={"container justify-between flex"}>
                <div className={"flex "}>
                    {createArray(3).map((el)=><div className={"w-[50px]"} key={el + "heart"}>

                        {(el + 1) <= heart?<img className={"w-full"} src={"./img/heart-active.png"} alt={"heart"}/>: <img className={"w-full"} src={"./img/heart.png"} alt={"heart"}/>}
                    </div>)}
                </div>
                <div className={"flex"}>
                    <div className={"w-[50px]"}>
                        <img src={"./img/star.png"} alt={"star"}/>
                    </div>
                <div className={"flex self-center text-5xl star text-shadow-xs"}>{stars}</div>
                </div>
            </div>
        </div>
    </div>
}