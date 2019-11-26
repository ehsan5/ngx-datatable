import { Component, Input, OnChanges, PipeTransform, TemplateRef } from '@angular/core';

export interface IFilterColumn {
  filterFunc?: (cells: any[]) => any;
  filterTemplate?: TemplateRef<any>;

  prop: string;
  pipe?: PipeTransform;
}

function defaultFilterFunc(cells: any[]): any {
  const cellsWithValues = cells.filter(cell => !!cell);

  if (!cellsWithValues.length) {
    return null;
  }
  if (cellsWithValues.some(cell => typeof cell !== 'number')) {
    return null;
  }

  return cellsWithValues.reduce((res, cell) => res + cell);
}

function noopSumFunc(cells: any[]): void {
  return null;
}

@Component({
  selector: 'datatable-filter-row',
  template: `
    <datatable-body-row
      *ngIf="filterRow && _internalColumns"
      tabindex="-1"
      [innerWidth]="innerWidth"
      [offsetX]="offsetX"
      [columns]="_internalColumns"
      [rowHeight]="rowHeight"
      [row]="filterRow"
      [rowIndex]="-1"
    >
    </datatable-body-row>
  `,
  host: {
    class: 'datatable-filter-row'
  }
})
export class DataTableFilterRowComponent implements OnChanges {
  @Input() rows: any[];
  @Input() columns: IFilterColumn[];

  @Input() rowHeight: number;
  @Input() offsetX: number;
  @Input() innerWidth: number;

  _internalColumns: IFilterColumn[];
  filterRow: any = {};

  ngOnChanges() {
    if (!this.columns || !this.rows) {
      return;
    }
    this.updateInternalColumns();
    this.updateValues();
  }

  private updateInternalColumns() {
    this._internalColumns = this.columns.map(col => ({
      ...col,
      cellTemplate: col.filterTemplate
    }));
  }

  private updateValues() {
    this.filterRow = {};
    this.columns
      .filter(col => !col.filterTemplate)
      .forEach(col => {
        const cellsFromSingleColumn = this.rows.map(row => row[col.prop]);
        const sumFunc = this.getFilterFunction(col);

        this.filterRow[col.prop] = col.pipe
          ? col.pipe.transform(sumFunc(cellsFromSingleColumn))
          : sumFunc(cellsFromSingleColumn);
      });
  }

  private getFilterFunction(column: IFilterColumn): (a: any[]) => any {
    if (column.filterFunc === undefined) {
      return defaultFilterFunc;
    } else if (column.filterFunc === null) {
      return noopSumFunc;
    } else {
      return column.filterFunc;
    }
  }
}
