import { TreeMap } from '../src/tree';
import { expect } from 'chai';

function prepareTree() : TreeMap<number, string> {
  let tree = new TreeMap<number, string>();
  tree.insert(9, 'nine');
  tree.insert(5, 'five');
  tree.insert(2, 'two');
  tree.insert(4, 'four');
  tree.insert(3, 'three');
  tree.insert(1, 'one');
  tree.insert(6, 'six');
  tree.insert(10, 'ten');
  tree.insert(7, 'seven');
  tree.insert(8, 'eight');
  return tree;
}

function range(from : number, to : number) : number[] {
  const step = from < to ? 1 : -1;
  const len = Math.abs(to - from + step);
  const res = Array(len);
  let curr = from;
  for (let idx = 0; idx < len; ++idx, curr += step) {
    res[idx] = curr;
  }
  return res;
}

describe('TreeMap', function() {

  describe('CRUD interface', function() {
    let tree = new TreeMap<number, string>();

    it('Accepts multiple values and returns valid values', function() {
      tree.insert(5, 'five');
      tree.insert(2, 'two');
      tree.insert(3, 'three');
      tree.insert(1, 'one');
      tree.insert(4, 'four');

      expect(tree.size).to.equal(5);

      expect(tree.get(1)).to.equal('one');
      expect(tree.get(2)).to.equal('two');
      expect(tree.get(3)).to.equal('three');
      expect(tree.get(4)).to.equal('four');
      expect(tree.get(5)).to.equal('five');
    });

    it('Support deletion and returns valid values', function() {

      expect(tree.size).to.equal(5);

      expect(tree.get(1)).to.equal('one');
      expect(tree.get(2)).to.equal('two');
      expect(tree.get(3)).to.equal('three');
      expect(tree.get(4)).to.equal('four');
      expect(tree.get(5)).to.equal('five');
    });
  });

  describe('Iterating', function() {
    let tree = prepareTree();

    it('Iterates through the whole tree', function() {
      const expectedKeys = range(1, 10);
      for(let [key, value] of tree) {
        const pattern = expectedKeys.shift();
        expect(key).to.equal(pattern);
      }
      expect(expectedKeys.length).to.equal(0);
    });

    it('Iterates from given index forward', function() {
      const expectedKeys = range(5, 10);
      for (let [key, value] of tree.getIterator(5)) {
        const pattern = expectedKeys.shift();
        expect(key).to.equal(pattern);
      }
      expect(expectedKeys.length).to.equal(0);
    });

    it('Iterates from given index backwards', function() {
      let expectedKeys = range(5, 1);
      for(let [key, value] of tree.getReverseIterator(5)) {
        const pattern = expectedKeys.shift();
        expect(key).to.equal(pattern);
      }
      expect(expectedKeys.length).to.equal(0);
    });
  });

  describe('When key removed', function() {
    let tree = prepareTree();

    it('Removal of non-existing key does not change the tree', function() {
      expect(tree.size).to.equal(10);
      tree.delete(100);
      expect(tree.size).to.equal(10);
    });

    it('Removal of index changes content and size', function() {
      let expectedSeq = range(1, 10).filter(x => x !== 3 && x !== 7 );

      tree.delete(3);
      tree.delete(7);

      expect(tree.size).to.equal(8);
      for(let [key, value] of tree) {
        const pattern = expectedSeq.shift();
        expect(key).to.equal(pattern);
      }
    });
  });

  describe('Supports strings as keys', function() {
    let tree = new TreeMap<string, any>();
    it('Returns stored item', function() {
      tree.insert('keyOne', { a: 1 });
      let keyOne = tree.get('keyOne');
      expect(keyOne).to.deep.equal({ a: 1 });
    });

    it('Correctly returns multiple stored item', function() {
      tree.insert('keyTwo', { b: 2 });
      tree.insert('keyThree', { c: 3 });

      let keyOne = tree.get('keyOne');
      expect(keyOne).to.deep.equal({ a: 1 });
      let keyTwo = tree.get('keyTwo');
      expect(keyTwo).to.deep.equal({ b: 2 });
      let keyThree = tree.get('keyThree');
      expect(keyThree).to.deep.equal({ c: 3 });
    });

  });
});
