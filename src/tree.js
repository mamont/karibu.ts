class Tree {

}

class Node {
  constructor(nodeValue) {
    Object.defineProperties(this, {
      _val: { value: nodeValue },
      _parent: { value: null, writable: true },
      _balanceFactor: { value: 0, writable: true },
      _left: { value: null, writable: true },
      _right: { value: null, writable: true },

      isRoot: { get: () => this._parent === null },
      isLeaf: { get: () => (this._left === null) && (this._right === null) },
      isLeftChild: { get: () => this._parent._left === this }
    });
  }
}

class AVLTree extends Tree {
  constructor(comparsion, equality) {
    super();

    Object.defineProperties(this, {
      _cmp: { value: comparsion || function(x, y) { return  x - y; } },
      _eq: { value: equality || function(x, y) { return x === y } },
      _root: { value: null, writable: true },
      _count: { value: 0, writable: true }
    });

  }

  clear() {
    this._root = null;
    this._count = 0;
  }

  insert(value) {
    let node = new Node(value);
    this._count++;

    if (!this._root) {
      this._root = node;
      return node;
    }

    let currNode = this._root;
    for(;;) {
      if (this._cmp(value, currNode.value) < 0) {
        if (currNode.left) {
          currNode = currNode.left;
        } else {
          currNode.left = node;
          break;
        }
      } else {
        if (currNode.right) {
          currNode = currNode.right;
        } else {
          currNode.right = node;
          break;
        }
      }
    }
    node._parent = currNode;
    currNode = node;
    while(currNode.parent) {
      let parent = currNode._parent;
      let prevBalanceFactor = parent._balanceFactor;

      if (currNode.isLeftChild) {
        parent._balanceFactor++;
      } else {
        parent._balanceFactor--;
      }

      if (Math.abs(parent._balanceFactor) < Math.abs(prevBalanceFactor)) {
        break;
      }

      if (parent._balanceFactor < -1 || parent.balanceFactor > 1) {
        this._rebalance(parent);
        break;
      }

      currNode = parent;
    }

    return node;
  }

  get(key) {

  }

  _rebalance(node) {
    if (node._balanceFactor < 0) {
      if (node._right._balanceFactor > 0) {
        this._rotateRight(node.right);
        this._rotateLeft(node);
      } else {
        this._rotateLeft(node);
      }
    } else if (node._balanceFactor > 0) {
      if (node._left._balanceFactor < 0) {
        this._rotateLeft(node.left);
        this._rotateRight(node);
      } else {
        this._rotateRight(node);
      }
    }
  }

  _rotateLeft(pivot) {
    let root = pivot._right;
    pivot._right = root._left;
    if (root._left !== null) {
      root._left._parent = pivot;
    }

    root._parent = pivot._parent;
    if (root._parent === null) {
      this._root = root;
    } else {
      if (pivot.isLeftChild) {
        root._parent._left = root;
      } else {
        root._parent._right = root;
      }
    }

    root._left = pivot;
    pivot._parent = root;
    pivot._balanceFactor = pivot._balanceFactor + 1 - Math.min(root._balanceFactor, 0);
    root._balanceFactor = root._balanceFactor + 1 - Math.max(pivot._balanceFactor, 0);
  }

  _rotateRight(pivot) {
    let root = pivot._left;
    pivot._left = root._right;
    if (root._right !== null) {
      root._right._parent = pivot;
    }

    root._parent = pivot._parent;
    if (root._parent === null) {
      this._root = root;
    } else {
      if (pivot.isLeftChild) {
        root._parent._left = root;
      } else {
        root._parent._right = root;
      }
    }

    root._right = pivot;
    pivot._parent = root;
    pivot._balanceFactor = pivot._balanceFactor - 1 - Math.min(root._balanceFactor, 0);
    root._balanceFactor = root._balanceFactor - 1 - Math.max(pivot._balanceFactor, 0);
  }

}

export { AVLTree };
