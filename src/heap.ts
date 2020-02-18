class Heap<V> {
    storage: V[];
    length: number;

    constructor(...args: V[]) {
        this.storage = [];
        this.length = 0;

        for (const arg of args) {
            this.push(arg);
        }
    }

    public get size(): number {
        return this.length;
    }

    public get empty(): boolean {
        return !this.length;
    }

    public push(value: V): void {
        this.storage.push(value);
        this.length++;

        const idx = this.storage.length - 1;

        this.checkOrdered(idx);
    }

    public pop(): V | null {
        if (this.empty) {
            return null;
        }

        const res = this.storage[0];

        this.storage[0] = this.storage[this.storage.length - 1];
        this.length--;
        this.storage.splice(this.storage.length - 1, 1);

        this.rebuildHeap(0);

        return res;
    }

    * [Symbol.iterator](): IterableIterator<V> {
        while (this.length !== 0) {
            yield this.pop();
        }
    }

    private checkOrdered(idx: number): void {
        // eslint-disable-next-line no-bitwise
        const parentIdx = idx / 2 | 0;

        if (this.storage[parentIdx] < this.storage[idx]) {
            const v = this.storage[idx];
            this.storage[idx] = this.storage[parentIdx]; this.storage[parentIdx] = v;

            this.checkOrdered(parentIdx);
        }
    }

    private rebuildHeap(index: number): void {
        let idx = index;
        while (idx != null) {
            idx = this.rebuildHeapStep(idx);
        }
    }

    private rebuildHeapStep(index: number): number|null {
        const left = index * 2;
        const right = index * 2 + 1;

        let largest = index;

        if (left < this.storage.length
            && this.storage[left] > this.storage[largest]) {
            largest = left;
        }

        if (right < this.storage.length
            && this.storage[right] > this.storage[largest]) {
            largest = right;
        }

        if (largest !== index) {
            [this.storage[largest], this.storage[index]] =
                [this.storage[index], this.storage[largest]];
            return largest;
        }

        return null;
    }
}

export { Heap };
