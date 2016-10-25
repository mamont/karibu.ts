import { SortedMap } from '../src/tree';

const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;

describe('SortedMap', function() {

  describe('CRUD interface', function() {
    let tree = new SortedMap();

    it('Accepts multiple values and returns valid values', function() {
      tree.insert(5, 'five');
      tree.insert(2, 'two');
      tree.insert(3, 'three');
      tree.insert(1, 'one');
      tree.insert(4, 'four');

      expect(tree.length).to.equal(5);

      expect(tree.get(1)).to.equal('one');
      expect(tree.get(2)).to.equal('two');
      expect(tree.get(3)).to.equal('three');
      expect(tree.get(4)).to.equal('four');
      expect(tree.get(5)).to.equal('five');
    });

    it('Support deletion and returns valid values', function() {

      expect(tree.length).to.equal(5);

      expect(tree.get(1)).to.equal('one');
      expect(tree.get(2)).to.equal('two');
      expect(tree.get(3)).to.equal('three');
      expect(tree.get(4)).to.equal('four');
      expect(tree.get(5)).to.equal('five');
    });
  });

  describe('Iterating', function() {
    let tree = new SortedMap();

    before(function() {
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
    });

    it('Iterates through the whole tree', function() {
      const expectedKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      for(let [key, value] of tree) {
        const pattern = expectedKeys.shift();
        expect(key).to.equal(pattern);
      }
      expect(expectedKeys.length).to.equal(0);
    });

    it('Iterates from given index forward', function() {
      const expectedKeys = [5, 6, 7, 8, 9, 10];
      for (let [key, value] of tree.getIterator(5)) {
        const pattern = expectedKeys.shift();
        expect(key).to.equal(pattern);
      }
      expect(expectedKeys.length).to.equal(0);
    });

    it('Iterates from given index backwards', function() {
      let expectedKeys = [5, 4, 3, 2, 1];
      for(let [key, value] of tree.getReverseIterator(5)) {
        const pattern = expectedKeys.shift();
        expect(key).to.equal(pattern);
      }
    });
  });

});

