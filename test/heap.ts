import { Heap } from '../src/heap';
import { expect } from 'chai';

describe("Heap", function() {

    let heap: Heap<number>;

    beforeEach(() => {
        heap = new Heap<number>();
    });

    it("Empty heap returns null", () => {
        expect(heap.pop()).to.be.null;
    });

    it("Empty heap size equals 0", () => {
        expect(heap.size).to.be.equal(0);
    });

    it("Heap can be initialized with sequence", () => {
        heap = new Heap<number>(1, 2, 3, 4, 5);
        expect(heap.size).to.be.equal(5);
    });

    it("Adding to heap increases size", () => {
        expect(heap.size).to.be.equal(0);
        heap.push(2);
        expect(heap.size).to.be.equal(1);
        heap.push(1);
        expect(heap.size).to.be.equal(2);
        heap.push(5);
        expect(heap.size).to.be.equal(3);
    });


    it("Elements are naturally ordered", () => {
        heap = new Heap<number>(1, 2, 3, 5, 4);
        expect(heap.size).to.be.equal(5);

        const res = [];
        for (const v of heap) {
            res.push(v);
        }

        expect(res).to.deep.equal([5, 4, 3, 2, 1]);
    });


    it("Size and empty getter works", () => {
        heap = new Heap<number>(1, 2, 3, 5, 4);
        expect(heap.size).to.be.equal(5);
        expect(heap.empty).to.be.false;

        for (const v of heap) {}

        expect(heap.size).to.be.equal(0);
        expect(heap.empty).to.be.true;
    });

});
