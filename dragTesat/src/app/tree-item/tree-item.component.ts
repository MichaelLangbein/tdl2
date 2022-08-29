import { Attribute, Component, Input, OnInit } from '@angular/core';
import { Node } from '../data';
import { DataService } from '../data.service';

@Component({
  selector: 'app-tree-item',
  templateUrl: './tree-item.component.html',
  styleUrls: ['./tree-item.component.css']
})
export class TreeItemComponent implements OnInit {

  @Input() tree: Node | null = null;

  constructor(private dataSvc: DataService) { }

  ngOnInit(): void {
  }

  public allowDrop(ev: DragEvent) {
    if (!this.tree) return;
    console.log('dragover on ', this.tree.id)
    ev.preventDefault();
    ev.stopPropagation();
  }

  public onDragStart(ev: DragEvent) {
    if (!this.tree) return;
    console.log('dragstart on ', this.tree.id)
    ev.dataTransfer?.setData('text', JSON.stringify({ 'sourceId': this.tree.id }));
  }

  public onDrop(ev: DragEvent) {
    if (!this.tree) return;
    console.log('drop on ', this.tree.id)
    console.log('drop', ev)
    ev.preventDefault();
    ev.stopPropagation();
    const stringData = ev.dataTransfer?.getData('text');
    if (stringData) {
      const data = JSON.parse(stringData);
      console.log(data, 'dropped into ', this.tree.id)
      this.dataSvc.moveData(data.sourceId, this.tree.id);
    }
  }

}
