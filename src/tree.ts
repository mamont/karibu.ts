interface Map<K, V> {
  get(key: K) : V;
  set(key: K, value: V) : void;
}

interface TreeMapInterface<K, V> extends Map<K, V>, Iterable<[K, V]> {

}

interface HashMap<K, V> extends Map<K, V> {

}

class Node<K, V> {
  parent : Node<K, V>;
  left : Node<K, V>;
  right : Node<K, V>;
  balanceFactor: number;

  key : K;
  value : V;

  constructor(key : K, value : V) {
    this.balanceFactor = 0;
    this.key = key;
    this.value = value;
    this.parent = null;
    this.left = null;
    this.right = null;
  }

  get isRoot() : boolean { return this.parent === null }
  get isLeaf() : boolean { return (this.left === null) && (this.right === null); }
  get isLeftChild() : boolean { return this.parent.left === this; }

  update(value : V) {
    this.value = value;
  }

  replace(target : Node<K, V>, replacement : Node<K, V>) {
    if (!target) {
      return;
    }

    if (this.left === replacement) {
      this.left = replacement;
    } else if (this.right === replacement) {
      this.right = replacement;
    }
  }
}

type Less<T> = (x : T, y : T) => boolean;
type Equal<T> = (x : T, y : T) => boolean;

/**
 * @property length
 */
class TreeMap<K, V> implements TreeMapInterface<K, V> {
  private isLessThan : Less<K>;
  private isEqual : Equal<K>;

  private root : Node<K, V>;
  private count : number;

  constructor(less? : Less<K>, equal? : Equal<K>) {
    this.isLessThan = less || ((x, y) => x < y);
    this.isEqual = equal || ((x, y) => x === y);
    this.root = null;
    this.count = null;
  }

  get size() : number { return this.count; }

  clear() {
    this.root = null;
    this.count = 0;
  }

  set(key : K, value : V) : void {
    let node = this.getNode(key);
    if (node) {
      node.update(value);
    } else {
      this.insert(key, value);
    }
    // return node;
  }

  insert(key : K, value : V) : void {
    let node = new Node(key, value);
    this.count++;

    if (!this.root) {
      this.root = node;
      // return node;
      return;
    }

    let currNode = this.root;
    for (;;) {
      if (this.isLessThan(key, currNode.key)) {
        if (currNode.left) {
          currNode = currNode.left;
        } else {
          currNode.left = node;
          break;
        }
      } else {
        if (currNode.right) { // eslint-disable-line no-lonely-if
          currNode = currNode.right;
        } else {
          currNode.right = node;
          break;
        }
      }
    }

    node.parent = currNode;
    currNode = node;
    while (currNode.parent) {
      let parent = currNode.parent;
      let prevBalanceFactor = parent.balanceFactor;

      if (currNode.isLeftChild) {
        parent.balanceFactor++;
      } else {
        parent.balanceFactor--;
      }

      if (Math.abs(parent.balanceFactor) < Math.abs(prevBalanceFactor)) {
        break;
      }

      if (parent.balanceFactor < -1 || parent.balanceFactor > 1) {
        this.rebalance(parent);
        break;
      }

      currNode = parent;
    }

    // return node;
  }

  get(key : K) : V {
    let currentNode = this.root;
    while (currentNode) {
      if (this.isEqual(key, currentNode.key)) {
        return currentNode.value;
      }

      if (this.isLessThan(key, currentNode.key)) {
        currentNode = currentNode.left;
      } else {
        currentNode = currentNode.right;
      }
    }
    return null;
  }

  delete(key : K) : void {
    // update this algorithm and remove any
    let node = this.getNode(key) as any;
    if (!node || node.key !== key) {
      return null;
    }

    let parent = node.parent;
    let left = node.left;
    let right = node.right;

    if (!!left !== !!right) { // one child
      let child = left || right;
      if (!parent && !child) {
        this.root = null;
      } else if (parent && !child) {
        this.root = child;
      } else {
        parent.replace(node, null);
        this.rebalance(parent);
      }
    } else { // two children
      let maxLeft = node.left;
      while (maxLeft.right) {
        maxLeft = maxLeft.right;
      }

      if (node.left === maxLeft) {
        if (node.isRoot) {
          this.root = maxLeft;
          maxLeft.parent = null;
        } else {
          if (node.isLeftChild) {
            node.parent.left = maxLeft;
          } else {
            node.parent.right = maxLeft;
          }
          maxLeft.parent = node.parent;
        }

        maxLeft.right = node.right;
        maxLeft.right.parent = maxLeft;
        maxLeft.balanceFactor = node.balanceFactor;
        node = {
          parent: maxLeft, isLeftChild: true
        };
      } else {
        let mlParent = maxLeft.parent;
        let mlLeft = maxLeft.left;

        mlParent.right = mlLeft;
        if (mlLeft) {
          mlLeft.parent = mlParent;
        }

        if (node.isRoot) {
          this.root = maxLeft;
          maxLeft.parent = null;
        } else {
          if (node.isLeftChild) {
            node.parent.left = maxLeft;
          } else {
            node.parent.right = maxLeft;
          }
          maxLeft.parent = node.parent;
        }

        maxLeft.right = node.right;
        maxLeft.right.parent = maxLeft;
        maxLeft.left = node.left;
        maxLeft.left.parent = maxLeft;
        maxLeft.balanceFactor = node.balanceFactor;

        node = {
          parent: mlParent, isLeftChild: false
        };
      }
    }

    this.count--;

    while (node.parent) {
      let parent = node.parent;
      let prevBalanceFactor = parent.balanceFactor;

      if (node.isLeftChild) {
        parent.balanceFactor -= 1;
      } else {
        parent.balanceFactor += 1;
      }

      if (Math.abs(parent.balanceFactor) > Math.abs(prevBalanceFactor)) {
        if (parent.balanceFactor < -1 || parent.balanceFactor > 1) {
          this.rebalance(parent);

          if (parent.parent.balanceFactor === 0) {
            node = parent.parent;
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

    return null;
  }

  private getNode(key : K) : Node<K, V> {
    let currentNode = this.root;
    while (currentNode) {
      if (this.isEqual(key, currentNode.key)) {
        return currentNode;
      }

      if (this.isLessThan(key, currentNode.key)) {
        currentNode = currentNode.left;
      } else {
        currentNode = currentNode.right;
      }
    }
    return null;
  }

  private rebalance(node : Node<K, V>) {
    if (node.balanceFactor < 0) {
      if (node.right.balanceFactor > 0) {
        this.rotateRight(node.right);
        this.rotateLeft(node);
      } else {
        this.rotateLeft(node);
      }
    } else if (node.balanceFactor > 0) {
      if (node.left.balanceFactor < 0) {
        this.rotateLeft(node.left);
        this.rotateRight(node);
      } else {
        this.rotateRight(node);
      }
    }
  }

  private rotateLeft(pivot : Node<K, V>) {
    let root = pivot.right;
    pivot.right = root.left;
    if (root.left !== null) {
      root.left.parent = pivot;
    }

    root.parent = pivot.parent;
    if (root.parent === null) {
      this.root = root;
    } else if (pivot.isLeftChild) {
      root.parent.left = root;
    } else {
      root.parent.right = root;
    }

    root.left = pivot;
    pivot.parent = root;
    pivot.balanceFactor = pivot.balanceFactor + 1 - Math.min(root.balanceFactor, 0);
    root.balanceFactor = root.balanceFactor + 1 - Math.max(pivot.balanceFactor, 0);
  }

  private rotateRight(pivot : Node<K, V>) {
    let root = pivot.left;
    pivot.left = root.right;
    if (root.right !== null) {
      root.right.parent = pivot;
    }

    root.parent = pivot.parent;
    if (root.parent === null) {
      this.root = root;
    } else if (pivot.isLeftChild) {
      root.parent.left = root;
    } else {
      root.parent.right = root;
    }

    root.right = pivot;
    pivot.parent = root;
    pivot.balanceFactor = pivot.balanceFactor - 1 - Math.min(root.balanceFactor, 0);
    root.balanceFactor = root.balanceFactor - 1 - Math.max(pivot.balanceFactor, 0);
  }

  *[Symbol.iterator]() : IterableIterator<[K, V]>{
    for (let iter of this.getIterator()) {
      yield iter;
    }
  }

  *getIterator(key : K = null) : IterableIterator<[K, V]> {
    let currentNode = this.root;
    while (currentNode) {
      if (this.isEqual(key, currentNode.key) || ((key === null) && !currentNode.left)) {
        break;
      }

      if (this.isLessThan(key, currentNode.key) || (key === null)) {
        currentNode = currentNode.left;
      } else {
        currentNode = currentNode.right;
      }
    }

    if (!currentNode) {
      return null;
    }

    let fromleft = true;
    for (;;) {
      if (fromleft) {
        yield [currentNode.key, currentNode.value];
        fromleft = false;

        if (currentNode.right) {
          currentNode = currentNode.right;
          while (currentNode.left) {
            currentNode = currentNode.left;
          }
          fromleft = true;
        } else if (currentNode.parent) {
          fromleft = (currentNode.parent.left === currentNode);
          currentNode = currentNode.parent;
        } else {
          break;
        }
      } else if (currentNode.parent) {
        fromleft = (currentNode.parent.left === currentNode);
        currentNode = currentNode.parent;
      } else {
        break;
      }
    }

    return null;
  }

  *getReverseIterator(key : K = null) : IterableIterator<[K, V]> {
    let currentNode = this.root;
    while (currentNode) {
      if (this.isEqual(key, currentNode.key) || ((key === null) && !currentNode.right)) {
        break;
      }

      if (!this.isLessThan(key, currentNode.key) || (key === null)) {
        currentNode = currentNode.right;
      } else {
        currentNode = currentNode.left;
      }
    }

    if (!currentNode) {
      return null;
    }

    let fromright = true;
    for (;;) {
      if (fromright) {
        yield [currentNode.key, currentNode.value];
        fromright = false;

        if (currentNode.left) {
          currentNode = currentNode.left;
          while (currentNode.right) {
            currentNode = currentNode.right;
          }
          fromright = true;
        } else if (currentNode.parent) {
          fromright = (currentNode.parent.right === currentNode);
          currentNode = currentNode.parent;
        } else {
          break;
        }
      } else if (currentNode.parent) {
        fromright = (currentNode.parent.right === currentNode);
        currentNode = currentNode.parent;
      } else {
        break;
      }
    }

    return null;
  }
}

export { Map, Less, Equal, TreeMapInterface, TreeMap, TreeMap as Tree };
