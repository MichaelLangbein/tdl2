import { Component, OnInit } from '@angular/core';
import { StatsService } from 'src/app/services/stats.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  public data: {id: number, title: string, secondsActive: number}[] = [];

  constructor(private statsService: StatsService) { }

  ngOnInit(): void {
  }

  loadData() {
    this.statsService.loadCompletionTimes().subscribe((data: any) => {
      this.data = data;
    });
  }

}
