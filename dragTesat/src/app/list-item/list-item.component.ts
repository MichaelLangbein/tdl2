import { Attribute, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css']
})
export class ListItemComponent implements OnInit {

  @Attribute('id') id: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  public allowDrop(ev: any) {
    ev.preventDefault();
  }

  public onDragStart(ev: any) {
    ev.dataTransfer.setData("text", ev.target.id);
  }

  public onDrop(ev: any) {
    console.log('drop', ev)
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    // ev.target.appendChild(document.getElementById(data));
  }

}
