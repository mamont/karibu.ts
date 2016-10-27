class Tree {

}

class Node {
  constructor(key, value) {
    Object.defineProperties(this, {
      _parent: { value: null, writable: true },
      _balanceFactor: { value: 0, writable: true },
      _left: { value: null, writable: true },
      _right: { value: null, writable: true },

      key: { value: key, enumerable: true },
      value: { value: value, enumerable: true },

      isRoot: { get: () => this._parent === null },
      isLeaf: { get: () => (this._left === null) && (this._right === null) },
      isLeftChild: { get: () => this._parent._left === this }
    });
  }

  replace(what_, with_) {
    if (!what_) {
      return;
    }

    if (this._left === what_) {
      this._left = with_;
    } else if (this._right === what_) {
      this._right = with_;
    }
  }
}

/**
 * @property length
 */
class AVLTree extends Tree {
  constructor(comparison, equality) {
    super();

    Object.defineProperties(this, {
      _cmp: { value: comparison || function(x, y) { return  x - y; } },
      _eq: { value: equality || function(x, y) { return x === y } },
      _root: { value: null, writable: true },
      _count: { value: 0, writable: true },

      size: { get: () => this._count, enumerable: true }
    });

  }

  clear() {
    this._root = null;
    this._count = 0;
  }

  insert(key, value) {
    let node = new Node(key, value);
    this._count++;

    if (!this._root) {
      this._root = node;
      return node;
    }

    let currNode = this._root;
    for(;;) {
      if (this._cmp(key, currNode.key) < 0) {
        if (currNode._left) {
          currNode = currNode._left;
        } else {
          currNode._left = node;
          break;
        }
      } else {
        if (currNode._right) {
          currNode = currNode._right;
        } else {
          currNode._right = node;
          break;
        }
      }
    }

    node._parent = currNode;
    currNode = node;
    while(currNode._parent) {
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

      if (parent._balanceFactor < -1 || parent._balanceFactor > 1) {
        this._rebalance(parent);
        break;
      }

      currNode = parent;
    }

    return node;
  }

  get(key) {
    let currentNode = this._root;
    while (currentNode) {
      if (this._eq(key, currentNode.key)) {
          return currentNode.value;
      }

      if (this._cmp(key, currentNode.key) < 0) {
        currentNode = currentNode._left;
      } else {
        currentNode = currentNode._right;
      }
    }
    return null;
  }

  delete(key) {
    let node = this._getNode(key);
    if (!node || node.key !== key) {
      return null;
    }

    let parent = node._parent;
    let left = node._left;
    let right = node._right;

    if (!!left !== !!right) { // one child
      let child = left || right;
      if (!parent && !child) {
        this._root = null;
      } else if (parent && !child) {
        this._root = child;
      } else {
        parent.replace(node, null);
        this._rebalance(parent);
      }
    } else { // two children
      let maxLeft = node._left;
      while (maxLeft._right) {
        maxLeft = maxLeft._right;
      }

      if (node._left == maxLeft) {
        if (node.isRoot) {
          this._root = maxLeft;
          maxLeft._parent = null;
        } else {
          if (node.isLeftChild) {
            node._parent._left = maxLeft;
          } else {
            node._parent._right = maxLeft;
          }
          maxLeft._parent = node._parent;
        }

        maxLeft._right = node._right;
        maxLeft._right._parent = maxLeft;
        maxLeft._balanceFactor = node._balanceFactor;
        node = {
          parent: maxLeft, isLeftChild: true
        };
      } else {
        let mlParent = maxLeft._parent;
        let mlLeft = maxLeft._left;

        mlParent._right = mlLeft;
        if (mlLeft) {
          mlLeft._parent = mlParent;
        }

        if (node.isRoot) {
          this._root = maxLeft;
          maxLeft._parent = null;
        } else {
          if (node.isLeftChild) {
            node._parent._left = maxLeft;
          } else {
            node._parent._right = maxLeft;
          }
          maxLeft._parent = node._parent;
        }

        maxLeft._right = node._right;
        maxLeft._right._parent = maxLeft;
        maxLeft._left = node._left;
        maxLeft._left._parent = maxLeft;
        maxLeft._balanceFactor = node._balanceFactor;

        node = {
            parent: minParent, isLeftChild: false
        };
      }
    }

    this._count--;

    while (node._parent) {
      let parent = node._parent;
      let prevBalanceFactor = parent._balanceFactor;

      if (node.isLeftChild) {
        parent._balanceFactor -= 1;
      } else {
        parent._balanceFactor += 1;
      }

      if (Math.abs(parent._balanceFactor) > Math.abs(prevBalanceFactor)) {
        if (parent.balanceFactor < -1 || parent.balanceFactor > 1) {
          this._rebalance(parent);

          if (parent._parent._balanceFactor === 0) {
            node = parent._parent;
          } else {
            break;
          }
        } else {
          break;
        }
      } else {
        node = parent;
      }
    }
  }

  _getNode(key) {
    let currentNode = this._root;
    while (currentNode) {
      if (this._eq(key, currentNode.key)) {
        return currentNode;
      }

      if (this._cmp(key, currentNode.key) < 0) {
        currentNode = currentNode._left;
      } else {
        currentNode = currentNode._right;
      }
    }
    return null;
  }

  _rebalance(node) {
    if (node._balanceFactor < 0) {
      if (node._right._balanceFactor > 0) {
        this._rotateRight(node._right);
        this._rotateLeft(node);
      } else {
        this._rotateLeft(node);
      }
    } else if (node._balanceFactor > 0) {
      if (node._left._balanceFactor < 0) {
        this._rotateLeft(node._left);
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

  *[Symbol.iterator]() {
    if (!this._root) {
      return null;
    }

    let fromleft = true;
    let current = this._root;
    while(!!current._left) {
      current = current._left;
    }

    while(true) {
      if (fromleft) {
        yield [ current.key, current.value ];
        fromleft = false;

        if (current._right) {
          current = current._right;
          while(!!current._left) {
            current = current._left;
          }
          fromleft = true;
        } else if (current._parent) {
          fromleft = current._parent._left === current;
          current = current._parent;
        } else {
          break;
        }
      } else if (current._parent) {
        fromleft = current._parent._left === current;
        current = current._parent;
      } else {
        break;
      }
    }

    return null;
  }

  *getIterator(key) {
    let currentNode = this._root;
    while (currentNode) {
      if (this._eq(key, currentNode.key)) {
        break;
      }

      if (this._cmp(key, currentNode.key) < 0) {
        currentNode = currentNode._left;
      } else {
        currentNode = currentNode._right;
      }
    }

    let fromleft = true;
    while(true) {
      if (fromleft) {
        yield [ currentNode.key, currentNode.value ];
        fromleft = false;

        if (currentNode._right) {
          currentNode = currentNode._right;
          while(!!currentNode._left) {
            currentNode = currentNode._left;
          }
          fromleft = true;
        } else if (currentNode._parent) {
          fromleft = currentNode._parent._left === currentNode;
          currentNode = currentNode._parent;
        } else {
          break;
        }
      } else if (currentNode._parent) {
        fromleft = currentNode._parent._left === currentNode;
        currentNode = currentNode._parent;
      } else {
        break;
      }
    }

    return null;
  }

  *getReverseIterator(key) {
    let currentNode = this._root;
    while (currentNode) {
      if (this._eq(key, currentNode.key)) {
        break;
      }

      if (this._cmp(key, currentNode.key) > 0) {
        currentNode = currentNode._left;
      } else {
        currentNode = currentNode._right;
      }
    }

    let fromright = true;
    while(true) {
      if (fromright) {
        yield [ currentNode.key, currentNode.value ];
        fromright = false;

        if (currentNode._left) {
          currentNode = currentNode._left;
          while(!!currentNode._right) {
            currentNode = currentNode._right;
          }
          fromright = true;
        } else if (currentNode._parent) {
          fromright = currentNode._parent._right === currentNode;
          currentNode = currentNode._parent;
        } else {
          break;
        }
      } else if (currentNode._parent) {
        fromright = currentNode._parent._right === currentNode;
        currentNode = currentNode._parent;
      } else {
        break;
      }
    }

    return null;
  }
}

const SortedMap = AVLTree;

export { SortedMap };
