import JsStore from "jsstore"
const getWorkerPath = () => {
    if (import.meta.env.MODE === 'development') {
        return new URL("jsstore/dist/jsstore.worker.js", import.meta.url);
    } else {
        return new URL("jsstore/dist/jsstore.worker.min.js", import.meta.url);
    }
};
const workerPath = getWorkerPath();
export const connection = new JsStore.Connection(new Worker(workerPath));