import { Component, Output, EventEmitter, ChangeDetectionStrategy, Input, TemplateRef } from '@angular/core';
import { DatatableFooterDirective } from './footer.directive';
import {HttpClient} from "@angular/common/http";
@Component({
  selector: 'datatable-footer',
  template: `
    <div
      class="datatable-footer-inner"
      [ngClass]="{ 'selected-count': selectedMessage }"
      [style.height.px]="footerHeight"
    >
      <ng-template
        *ngIf="footerTemplate"
        [ngTemplateOutlet]="footerTemplate.template"
        [ngTemplateOutletContext]="{
          rowCount: rowCount,
          pageSize: pageSize,
          selectedCount: selectedCount,
          curPage: curPage,
          offset: offset
        }"
      >
      </ng-template>
      <div class="page-count" *ngIf="!footerTemplate">
        <span *ngIf="selectedMessage"> {{ selectedCount?.toLocaleString() }} {{ selectedMessage }} / </span>
        {{ rowCount?.toLocaleString() }} {{ totalMessage }}
      </div>
      <datatable-pager
        *ngIf="!footerTemplate"
        [pagerLeftArrowIcon]="pagerLeftArrowIcon"
        [pagerRightArrowIcon]="pagerRightArrowIcon"
        [pagerPreviousIcon]="pagerPreviousIcon"
        [pagerNextIcon]="pagerNextIcon"
        [page]="curPage"
        [size]="pageSize"
        [count]="rowCount"
        [hidden]="!isVisible"
        (change)="page.emit($event)"
      >
      </datatable-pager>
    </div>
  `,
  host: {
    class: 'datatable-footer'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableFooterComponent {
  @Input() footerHeight: number;
  @Input() rowCount: number;
  @Input() pageSize: number;
  @Input() offset: number;
  @Input() pagerLeftArrowIcon: string;
  @Input() pagerRightArrowIcon: string;
  @Input() pagerPreviousIcon: string;
  @Input() pagerNextIcon: string;
  @Input() totalMessage: string;
  @Input() footerTemplate: DatatableFooterDirective;

  @Input() selectedCount: number = 0;
  @Input() selectedMessage: string | boolean;

  @Output() page: EventEmitter<any> = new EventEmitter();


  // by ehsan amj
  @Input() appUrl: any;
  @Input() resource: any;
  @Input() sortDir: any;
  @Input() sortProp: any;
  @Input() includes: any;
  @Input() filters: any;
  @Input() columns: any;


  constructor(private httpClient: HttpClient) {
  }
  get isVisible(): boolean {
    return this.rowCount / this.pageSize > 1;
  }

  get curPage(): number {
    return this.offset + 1;
  }


  // by ehsan amj

  repairRows(arr: any[]): string {
    const rv: any[] = [];
    for (let i = 0; i < arr.length; ++i)
      if (arr[i] !== undefined) {
        rv.push(Object.assign({}, arr[i]));
        return JSON.stringify(rv);
      }
  }

  repaircolumns(arr: any[]): string {
    const columnsArray = [];
    for (const key in arr) {
      const obj = {
        // key: this.columns[key]['prop'],
        // value: this.columns[key]['name'],
        // is_relationship : this.columns[key]['isRelationship']
        key: arr[key]['prop'],
        value: arr[key]['name'],
        is_relationship: arr[key]['isRelationship']
      };
      if (!obj.is_relationship) {
        obj.is_relationship = false;
      }
      columnsArray.push(obj);
    }
    return JSON.stringify(columnsArray);
  }

  exportExcel(): any {
    return this.httpClient.post<Blob>(this.appUrl + 'excel', 'type=' + 'excel' +
      '&filters=' + JSON.stringify(this.filters) + '&columns=' + this.repaircolumns(this.columns) + '&sortDir=' + this.sortDir +
      '&sortProp=' + this.sortProp + '&resource=' + this.resource,

    ).subscribe(x => {
        const url = window.URL.createObjectURL(new Blob([x['_body']]));
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = 'table.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove(); // remove the element
      }
    );
  }

  exportPdf(): any {

    return this.httpClient.post<Blob>(this.appUrl + 'pdf', 'type=' + 'pdf' +
      '&filters=' + JSON.stringify(this.filters) + '&columns=' + this.repaircolumns(this.columns) +
      '&sortDir=' + this.sortDir +
      '&sortProp=' + this.sortProp + '&resource=' + this.resource
    ).subscribe(x => {
      //     787878
      const newBlob = new Blob([x['_body']], {type: 'application/pdf'});

      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(newBlob);
        return;
      }
      const data = window.URL.createObjectURL(newBlob);
      const link = document.createElement('a');
      link.href = data;
      link.download = 'table.pdf';
      link.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}));
      setTimeout(function() {
        window.URL.revokeObjectURL(data);
      }, 100);
    });
  }
}
