interface IMap<K, V> {
    get(key: K) : V;
    set(key: K, value: V) : void;
}

interface ITreeMap<K, V> extends IMap<K, V>, Iterable<[K, V]> {

}

interface IHashMap<K, V> extends IMap<K, V> {

}

export { IMap, ITreeMap, IHashMap };
