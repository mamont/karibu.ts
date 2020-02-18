interface Map<K, V> {
    get(key: K): V;
    set(key: K, value: V): void;
}

interface OrderedMap<K, V> extends Map<K, V>, Iterable<[K, V]> {

}

// TODO: removeme?
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface UnorderedMap<K, V> extends Map<K, V> {

}

export { Map, OrderedMap, UnorderedMap };
