import { Map, OrderedMap } from "./interfaces/map";

class Node<K, V> {
    parent: Node<K, V>;
    left: Node<K, V>;
    right: Node<K, V>;
    balanceFactor: number;

    key: K;
    value: V;

    constructor(key: K, value: V) {
        this.balanceFactor = 0;
        this.key = key;
        this.value = value;
        this.parent = null;
        this.left = null;
        this.right = null;
    }

    get isRoot(): boolean { return this.parent === null; }
    get isLeaf(): boolean { return (this.left === null) && (this.right === null); }
    get isLeftChild(): boolean { return this.parent.left === this; }

    update(value: V): void {
        this.value = value;
    }

    replace(target: Node<K, V>, replacement: Node<K, V>): void {
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

type Less<T> = (x: T, y: T) => boolean;
type Equal<T> = (x: T, y: T) => boolean;

/**
 * @property length
 */
class TreeMap<K, V> implements OrderedMap<K, V> {
    private isLessThan: Less<K>;
    private isEqual: Equal<K>;

    private root: Node<K, V>;
    private count: number;

    constructor(less? : Less<K>, equal? : Equal<K>) {
        this.isLessThan = less || ((x, y): boolean => x < y);
        this.isEqual = equal || ((x, y): boolean => x === y);
        this.root = null;
        this.count = null;
    }

    get size(): number { return this.count; }

    clear(): void {
        this.root = null;
        this.count = 0;
    }

    set(key: K, value: V): void {
        const node = this.getNode(key);
        if (node) {
            node.update(value);
        } else {
            this.insert(key, value);
        }
        // return node;
    }

    insert(key: K, value: V): void {
        const node = new Node(key, value);
        this.count++;

        if (!this.root) {
            this.root = node;
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
                if (currNode.right) {
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
            const parent = currNode.parent;
            const prevBalanceFactor = parent.balanceFactor;

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
    }

    get(key: K): V {
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

    delete(key: K): void {
        // update this algorithm and remove any
        let node = this.getNode(key);
        if (!node || node.key !== key) {
            return null;
        }

        const parent = node.parent;
        const left = node.left;
        const right = node.right;

        if (!!left !== !!right) { // one child
            const child = left || right;
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
                } as Node<K, V>;
            } else {
                const mlParent = maxLeft.parent;
                const mlLeft = maxLeft.left;

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
                } as Node<K, V>;
            }
        }

        this.count--;

        while (node.parent) {
            const parent = node.parent;
            const prevBalanceFactor = parent.balanceFactor;

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

    private getNode(key: K): Node<K, V> {
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

    private rebalance(node: Node<K, V>): void {
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

    private rotateLeft(pivot: Node<K, V>): void {
        const root = pivot.right;
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

    private rotateRight(pivot: Node<K, V>): void {
        const root = pivot.left;
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

    *[Symbol.iterator](): IterableIterator<[K, V]> {
        for (const iter of this.getIterator()) {
            yield iter;
        }
    }

    *getIterator(key: K = null): IterableIterator<[K, V]> {
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

    *getReverseIterator(key: K = null): IterableIterator<[K, V]> {
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

export { Map, OrderedMap, Less, Equal, TreeMap };
