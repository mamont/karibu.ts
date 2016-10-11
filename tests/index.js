import { AVLTree } from './tree';

const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;

describe('AVL Tree', function() {
  let tree = null;

  beforeEach(function() {
    tree = new AVLTree();
  });

  it('Accepts and returns single value', function() {

    tree.insert(1, 'one');
    let item = tree.get(1);

  });

  it('Accepts multiple valies', function() {
    tree.insert(5, 'five');
    tree.insert(2, 'two');
    tree.insert(3, 'three');
    tree.insert(1, 'one');
    tree.insert(4, 'four');
  });

});

