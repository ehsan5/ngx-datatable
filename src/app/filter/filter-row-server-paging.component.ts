import { Component } from '@angular/core';
import { MockServerResultsService } from '../paging/mock-server-results-service';
import { PagedData } from '../paging/model/paged-data';
import { CorporateEmployee } from '../paging/model/corporate-employee';
import { Page } from '../paging/model/page';
import { ColumnMode } from 'projects/swimlane/ngx-datatable/src/public-api';

@Component({
  selector: 'filter-row-server-paging-demo',
  providers: [MockServerResultsService],
  template: `
    <div>
      <h3>
        Server-side paging
        <small>
          <a
            href="https://github.com/swimlane/ngx-datatable/blob/master/src/app/filter/filter-row-server-paging.component.ts"
          >
            Source
          </a>
        </small>
      </h3>
      <ngx-datatable
        class="material"
        [rows]="rows"
        [columns]="columns"
        [columnMode]="ColumnMode.force"
        [headerHeight]="50"
        [filterRow]="true"
        [filterHeight]="55"
        [footerHeight]="50"
        rowHeight="auto"
        [externalPaging]="true"
        [count]="page.totalElements"
        [offset]="page.pageNumber"
        [limit]="page.size"
        (page)="setPage($event)"
      >
      </ngx-datatable>
    </div>
  `
})
export class FilterRowServerPagingComponent {
  page = new Page();
  rows = new Array<CorporateEmployee>();

  columns = [
    // NOTE: cells for current page only !
    { name: 'Name', filterFunc: cells => `${cells.length} total` },
    { name: 'Gender', filterFunc: () => this.getGenderFilter() },
    { name: 'Company', filterFunc: () => null }
  ];

  ColumnMode = ColumnMode;

  constructor(private serverResultsService: MockServerResultsService) {
    this.page.pageNumber = 0;
    this.page.size = 20;
  }

  ngOnInit() {
    this.setPage({ offset: 0 });
  }

  /**
   * Populate the table with new data based on the page number
   * @param page The page to select
   */
  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.serverResultsService.getResults(this.page).subscribe(pagedData => {
      this.page = pagedData.page;
      this.rows = pagedData.data;
    });
  }

  getGenderFilter(): string {
    // NOTE: there should be logic to get required informations from server
    return '10 males, 10 females';
  }
}
