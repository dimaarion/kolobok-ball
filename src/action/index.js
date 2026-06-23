import {connection} from "../../Db.js";
import {useEffect, useMemo} from "react";
import {Vector3} from "three";
import useStore from "../../store.js";

export const NAMEDB = "ROLOBOK"
export const VERSIONDB = 1

export async function createBase() {
    const tbUser = {
        name: 'user',
        columns: {
            id: { primaryKey: true, autoIncrement: true },
            stars: { dataType: 'number', default: 0 },
            level: { dataType: 'number', default: 1 },
            heart:{ dataType: 'number', default: 3 },
            position:{ dataType: 'object', default: new Vector3(0,3,0)},
            positionPoint:{ dataType: 'object', default: new Vector3(0,3,0)},
            location:{ dataType: 'number', default: 1},

        }
    };



    let db = {
        name: NAMEDB,
        version: VERSIONDB,
        tables: [
            tbUser
        ]
    }


    await connection.initDb(db);
}

export async function deleteDatabase() {
    try {
        await connection.dropDb();
        console.log("База данных успешно удалена");
    } catch (ex) {
        console.error("Ошибка при удалении базы:", ex);
    }
}

export async function insertTable(tbName, value){
    return  await connection.insert({
        into: tbName,
        values: [value],
    });
}

export async function remove(tbName, id){
    return   await connection.remove({
        from: tbName,
        where: {
            id: id,
        }
    });
}

export async function updateTb(tbName,value, where){
    return   await connection.update({
        in: tbName,
        set:value,
        where:where
    });
}

export async function select(tbName){
    return  await connection.select({
        from: tbName
    });
}

export async function whereId(tbName,id){
    return  await connection.select({
        from: tbName,
        where:{
            id:Number.parseInt(id)
        }
    });
}

export async function exportDb() {
    const schema = await connection.database;
    const exportData = {};

    for (const table of schema.tables) {
        const rows = await connection.select({ from: table.name });
        exportData[table.name] = rows;
    }

    return  exportData;



}
// 📥 Импорт базы из JSON
export async function importDb(file) {
    const text = await file.text();
    const data = JSON.parse(text);
    const restoreDates = (obj) => {
        const isoDateRegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

        for (const key in obj) {
            if (typeof obj[key] === 'string' && isoDateRegExp.test(obj[key])) {
                obj[key] = new Date(obj[key]);
            }
        }
        return obj;
    };

    for (const [tableName, rows] of Object.entries(data)) {
        for (const row of rows) {
            const preparedRow = restoreDates({ ...row });
// Если в строке есть дата, парсим её обратно в формат Date для JsStore
            if (preparedRow.createdAt) {
                preparedRow.createdAt = new Date(preparedRow.createdAt);
            }
            if (preparedRow.updatedAt) {
                preparedRow.updatedAt = new Date(preparedRow.updatedAt);
            }
            const updated = await connection.update({
                in: tableName,
                set: preparedRow,
                where: { id: preparedRow.id }
            });

            if (updated === 0) {
                await connection.insert({
                    into: tableName,
                    values: [preparedRow]
                });
            }
        }
    }

}

export function percent(n, n2) {
    return n * 100 / n2
}

export const useGameAudio = () => {
    const sounds = useMemo(() => ({
        // Фоновая музыка
        bgMusic: new Howl({
            src: ['./sound/fon.mp3'],
            html5: false, // Используем Web Audio API (скрывает из трея)
            loop: true,
            volume: 1 // начальная громкость из состояния,
        }),

    }), []);

    // Автоматическая остановка всех звуков при размонтировании
    useEffect(() => {
        return () => {
            Object.values(sounds).forEach(s => s.unload());
        };
    }, [sounds]);

    return sounds;
};

export function playAudio(audio, volume = 0.2, loop = false) {
    audio.currentTime = 0
    audio.volume = volume
    audio.loop = loop

    function handleVisibility() {
        if (document.hidden) {
            audio.pause();
        } else {
            audio.play()
                .then(() => {

                })
                .catch((error) => {
                    console.log(error)
                });
        }
    }

    handleVisibility()
    document.addEventListener("visibilitychange", handleVisibility);
}

export function pauseAudio(audio) {
    audio.pause();
}

export function routable(n) {
    return Math.PI / 180 * n;
}

export function createArray(num) {

    let a = [];
    for (let i = 0; i < num; i++) {
        a[i] = i
    }
    return a;
}

export function getDistance(playerPos,objectPos,threshold = 100){
    const dist = Math.sqrt(
        Math.pow(playerPos.x - objectPos.x, 2) + Math.pow(playerPos.z - objectPos.z, 2) // Можно считать только в 2D (X и Z)
    );
    return dist < threshold;
}

export function grtObjects(name){
        const r = new RegExp(`${name}.[0-9]`,"i")
        const levels = useStore.getState().location.map((el)=>el.location.filter((el)=>el.name.match(r)))
        const object = []
        levels.forEach((el)=>{
            el.forEach((f)=>{
                object.push(f)
            })
        })
        return object
}

export function grtLevObjects(name,lev = 1){
    const r = new RegExp(`${name}.[0-9]`,"i")
    const levels = useStore.getState().location.filter((f)=>f.id === lev).map((el)=>el.location.filter((el)=>el.name.match(r)))
    const object = []
    levels.forEach((el)=>{
        el.forEach((f)=>{
            object.push(f)
        })
    })
    return object
}
