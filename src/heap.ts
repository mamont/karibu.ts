
class Heap<V> {

    storage : V[];
    length : number;

    constructor(...args : V[]) {
        this.storage = [];
        this.length = 0;

        for (let arg of args) {
            this.push(arg);
        }
    }

    public get size() : Number {
        return this.length;
    }

    public get empty() : Boolean {
        return !this.length;
    }

    public push(value : V) : void {
        this.storage.push(value);
        this.length++;

        let idx = this.storage.length - 1;

        this.checkOrdered(idx);
    }

    public pop() : V | null {
        if (this.empty) {
            return null;
        }

        let res = this.storage[0];

        this.storage[0] = this.storage[this.storage.length - 1];
        this.length--;
        this.storage.splice(this.storage.length - 1, 1);

        this.rebuildHeap(0);

        return res;
    }

    public peek() : V | null {
        return null;
    }

    *[Symbol.iterator]() : IterableIterator<V> {
        while(this.length != 0) {
            yield this.pop();
        }
    }

    private checkOrdered(idx : number) : void {
        let parentIdx = idx / 2 | 0;

        if (this.storage[parentIdx] < this.storage[idx]) {
            let v = this.storage[idx];
            this.storage[idx] = this.storage[parentIdx]; this.storage[parentIdx] = v;

            this.checkOrdered(parentIdx);
        }
    }

    private rebuildHeap(index : number) : void {
        while (index != null) {
            index = this.rebuildHeapStep(index);
        }
    }

    private rebuildHeapStep(index : number) : number|null {
        let left = index * 2;
        let right = index * 2 + 1;

        let largest = index;

        if (left < this.storage.length
            && this.storage[left] > this.storage[largest]) {
            largest = left;
        }

        if (right < this.storage.length
            && this.storage[right] > this.storage[largest]) {
            largest = right;
        }

        if (largest != index) {
            [this.storage[largest], this.storage[index]] =
                [this.storage[index], this.storage[largest]];
            return largest;
        }

        return null;
    }
}

export { Heap };
