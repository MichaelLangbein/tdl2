import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {

  @Input() estimate: any;
  @Input() active: number = 0;
  public bestEstimate: number = 0;
  public percentage: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.bestEstimate = (this.estimate["buvs"] + this.estimate["tdvs"]) / 2.0;
    this.percentage = Math.round(100 * this.active / this.bestEstimate);
  }

}
