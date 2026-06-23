import {create} from "zustand/react";
import location_1 from "./src/assets/location_1.json"
import level_1 from "./src/assets/level_1.json"
import level_2 from "./src/assets/level_2.json"
import level_3 from "./src/assets/level_3.json"
import level_4 from "./src/assets/level_4.json"
import level_5 from "./src/assets/level_5.json"
import level_6 from "./src/assets/level_6.json"
import level_7 from "./src/assets/level_7.json"
import {Vector3} from "three";
const useStore = create((set) => ({
    user: [{stars:0,level:1,heart: 3}],
    stars:0,
    pause:false,
    heart:3,
    position:new Vector3(0,3,0),
    positionPoint:new Vector3(0,3,0),
    page:"",
    location:[
        {id:1, position:[50,0,0], dist:100, location:level_1},
        {id:2, position:[322,0,0],dist:280, location:level_2},
        {id:3, position:[575,0,114],dist:155, location:level_3},
        {id:4, position:[400,26,230],dist:190, location:level_4},
        {id:5, position:[255,91,408],dist:220, location:level_5},
        {id:6, position:[10,75,608],dist:300, location:level_6},
        {id:7, position:[-500,68,625],dist:300, location:level_7}
    ],
    level:1,
    levelStep:1,
    visible:1,
    levelComplete:false,
    setUser:(user)=>set(()=>({user:user})),
    setStars:(star)=>set(()=>({stars:star})),
    setHeart:(heart)=>set(()=>({heart:heart})),
    setPosition:(pos)=>set(()=>({position:pos})),
    setPositionPoint:(pos)=>set(()=>({positionPoint:pos})),
    setPause:()=>set((state)=>({pause:!state.pause})),
    setLevel:(lev)=>set(()=>({level:parseInt(lev)})),
    setLevelComplete:(complete,level)=>set(()=>({levelComplete:complete,levelStep:level})),
    setPage:(payload)=>set(()=>({page:payload})),

}))

export default useStore