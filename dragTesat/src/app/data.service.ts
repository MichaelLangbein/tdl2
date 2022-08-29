import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { data, Node } from './data';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private data$ = new BehaviorSubject<Node>(data);

  constructor() { }

  public watchData(): Observable<Node> {
    return this.data$;
  }

  public moveData(toMoveId: number, targetId: number) {
    const data = this.data$.value;
    const subTree = removeChild(toMoveId, data);
    if (subTree) {
      const newData = addChild(targetId, data, subTree);
      if (newData) this.data$.next(newData);
    }
  }
}


function removeChild(id: number, tree: Node): Node | undefined {
  // case 1: immediate hit. return whole tree
  if (id === tree.id) return tree;

  // case 2: hit among first level children. return child.
  for (let i = 0; i < tree.children.length; i++) {
    const child = tree.children[i];
    if (child.id === id) {
      tree.children.splice(i, 1);
      return child;
    }
  }

  // case 3: recursive.
  for (const child of tree.children) {
    const hit = removeChild(id, child);
    if (hit) return hit;
  }

  return undefined;
}


function addChild(targetId: number, tree: Node, childTree: Node): Node | undefined {
  if (tree.id === targetId) {
    tree.children.push(childTree);
    return tree;
  }
  for (const child of tree.children) {
    const added = addChild(targetId, child, childTree);
    if (added) return tree;
  }
  return undefined;
}