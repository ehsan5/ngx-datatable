import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ColumnMode } from 'projects/swimlane/ngx-datatable/src/public-api';

@Component({
  selector: 'filter-row-custom-template-demo',
  template: `
    <div>
      <h3>
        Filter Row with Custom Template
        <small>
          <a
            href="https://github.com/swimlane/ngx-datatable/blob/master/src/app/filter/filter-row-custom-template.component.ts"
          >
            Source
          </a>
        </small>
      </h3>
      <ngx-datatable
        class="material"
        [filterRow]="true"
        [columns]="columns"
        [columnMode]="ColumnMode.force"
        [headerHeight]="50"
        [rowHeight]="'auto'"
        [filterHeight]="55"
        [rows]="rows"
      >
      </ngx-datatable>
      <ng-template #nameFilterCell let-row="row" let-value="value">
        <div class="name-container">
          <div class="chip" *ngFor="let name of getNames()">
            <span class="chip-content">{{ name }}</span>
          </div>
        </div>
      </ng-template>
    </div>
  `,
  styleUrls: ['./filter-row-custom-template.component.scss']
})
export class FilterRowCustomTemplateComponent implements OnInit {
  rows = [];

  @ViewChild('nameFilterCell', { static: false })
  nameFilterCell: TemplateRef<any>;

  columns = [];

  ColumnMode = ColumnMode;

  constructor() {
    this.fetch(data => {
      this.rows = data.splice(0, 5);
    });
  }

  ngOnInit() {
    this.columns = [
      {
        prop: 'name',
        filterFunc: () => null,
        filterTemplate: this.nameFilterCell
      },
      { name: 'Gender', filterFunc: cells => this.filterForGender(cells) },
      { prop: 'age', filterFunc: cells => this.avgAge(cells) }
    ];
  }

  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/company.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }

  getNames(): string[] {
    return this.rows.map(row => row.name).map(fullName => fullName.split(' ')[1]);
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
