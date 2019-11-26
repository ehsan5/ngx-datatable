import { Component } from '@angular/core';
import { ColumnMode } from 'projects/swimlane/ngx-datatable/src/public-api';

@Component({
  selector: 'filter-row-simple-demo',
  template: `
    <div>
      <h3>
        Simple Filter Row
        <small>
          <a href="https://github.com/swimlane/ngx-datatable/blob/master/src/app/filter/filter-row-simple.component.ts">
            Source
          </a>
        </small>
      </h3>
      <div class="controls">
        <div>
          <input
            id="enable-filter"
            type="checkbox"
            [checked]="enableFilter"
            (change)="enableFilter = !enableFilter"
          />
          <label for="enable-filter">Enable Filter Row</label>
        </div>
        <div>
          <label for="position-select">Position</label>
          <select id="position-select" (change)="filterPosition = $event.target.value">
            <option [value]="'top'">Top</option>
            <option [value]="'bottom'">Bottom</option>
          </select>
        </div>
      </div>
      <ngx-datatable
        class="material"
        [filterRow]="enableFilter"
        [filterPosition]="filterPosition"
        [columns]="columns"
        [columnMode]="ColumnMode.force"
        [headerHeight]="50"
        rowHeight="auto"
        [filterHeight]="55"
        [rows]="rows"
      >
      </ngx-datatable>
    </div>
  `,
  styleUrls: ['./filter-row-simple.component.scss']
})
export class FilterRowSimpleComponent {
  rows = [];

  columns = [
    { prop: 'name', filterFunc: null },
    { name: 'Gender', filterFunc: cells => this.filterForGender(cells) },
    { prop: 'age', filterFunc: cells => this.avgAge(cells) }
  ];

  enableFilter = true;
  filterPosition = 'top';

  ColumnMode = ColumnMode;

  constructor() {
    this.fetch(data => {
      this.rows = data.splice(0, 5);
    });
  }

  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/company.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }

  onFilterStateChange(a) {
    console.log(a);
  }

  private filterForGender(cells: string[]) {
    const males = cells.filter(cell => cell === 'male').length;
    const females = cells.filter(cell => cell === 'female').length;

    return `males: ${males}, females: ${females}`;
  }

  private avgAge(cells: number[]): number {
    const filteredCells = cells.filter(cell => !!cell);
    return filteredCells.reduce((sum, cell) => (sum += cell), 0) / filteredCells.length;
  }
}
