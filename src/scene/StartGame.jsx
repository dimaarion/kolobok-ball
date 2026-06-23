import {Suspense, useEffect, useState} from "react";
import {useProgress} from "@react-three/drei";
import {whereId} from "../action/index.js";

function Loader() {
    const {progress} = useProgress()
    return <div  className={"fixed w-full h-full top-0 left-0 right-0 bottom-0 m-auto bg-gray-800 z-[5000] text-white text-2xl"}>
        <div className={"flex justify-center flex-col"}>
            <div className={"flex container justify-center h-full"}>
                <div className={"flex self-center"}>
                    {progress}
                </div>

            </div>

        </div>

    </div>
}

export default function StartGame({children}){
    const [position, setPosition] = useState([])

    useEffect(()=>{
        whereId("user",1).then((res)=>{
            const r = res[0];
            setPosition(Object.values(r.position))
        })
    },[])
    return <Suspense fallback={<Loader/>}>{children}</Suspense>
}