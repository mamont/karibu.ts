import { OrderedMap } from "./interfaces/map";

class TreeMap<K, V> implements OrderedMap<K, V> {
    
    public get(key: K): V {
        return {} as V;
    }

    public set(key: K, value: V): void {
        ;
    }

    *[Symbol.iterator](): IterableIterator<[K, V]> {
        for (const iter of []) {
            yield iter;
        }
    }
}

export { TreeMap }