import {
  Component, EventEmitter, Input, OnInit, Output, ViewChild,
  HostListener, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { MatCheckbox, MatMenuTrigger, MatPaginator, MatTableDataSource } from '@angular/material';
import * as _ from 'lodash';
import {
  BaseDataTable, NotifyService,
  OrderList,
  ORDER_STATUS_COLOR,
  ORDER_STATUS_DESCRIPTION_MATCH_STATUS,
  ORDER_STATUS_ICON,
  OrderHelpers,
  OrderServices,
  RouterHelpers,
  AddDomainPipe,
  orderProductionStatus
} from 'external-lib';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { productionStatuses } from '../orders-list.constants';

declare const document: any;

@Component({
  selector: 'orders-datatable',
  templateUrl: './orders-datatable.component.html',
  styleUrls: ['./orders-datatable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class OrdersDatatableComponent extends BaseDataTable implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'checkbox',
    'orderId',
    'customer_name',
    'store_organization',
    'order_date',
    'ship_pickUp',
    'order_total',
    'production_status',
    'payment_status'
  ];
  productionStatus: object = {};
  orderProductionStatus: object = {};
  isAllOrder: boolean = false;
  ordersDataSource: MatTableDataSource<OrderList> = new MatTableDataSource();
  selection: SelectionModel<OrderList> = new SelectionModel<OrderList>(true, []);
  @Output() markAsShipped: EventEmitter<void> = new EventEmitter();
  @Output() selectedOrders: EventEmitter<object> = new EventEmitter();

  @ViewChild('headerCheckbox') private headerCheckbox: MatCheckbox;
  @Input() isQuickbooksEnabled: boolean;
  @Input() isShopWorksEnabled: boolean;
  @Input() isQuickbooksIIFEnabled: boolean;
  @Input() set orders(orders: OrderList[]) {
    this.ordersDataSource.data = orders;

    _.last(document.getElementsByTagName('mat-table')).scrollTop = 0;
    if (_.get(this.routerParams, 'Status') === 'All') {
      this.displayedColumns = _.filter(this.displayedColumns, (column: string) => column !== 'status');
      this.displayedColumns = [..._.slice(this.displayedColumns, 0, 1), 'status', ..._.slice(this.displayedColumns, 1)];
      this.isAllOrder = true;
    } else {
      this.isAllOrder = false;
      this.displayedColumns = _.filter(this.displayedColumns, (column: string) => column !== 'status');
    }
  }

  @Input() pagination: {
    IncludedResults: number,
    Index: number,
    TotalResults: number
  };

  @Input() routerParams: any;

  @Input() limit: number;

  @Input() loading: boolean;

  orderBy: string = '';
  orderStatusMatch: any = ORDER_STATUS_DESCRIPTION_MATCH_STATUS;
  statusIconMatch: any = ORDER_STATUS_ICON;
  statusColorMatch: any = ORDER_STATUS_COLOR;
  allSelected: boolean;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  innerWidth: number;
  selectedFields: string[];
  win: any = window;
  @Output() infinityScroll: EventEmitter<void> = new EventEmitter();

  constructor(private orderServices: OrderServices,
              private orderHelpers: OrderHelpers,
              public notifyService: NotifyService,
              private router: Router,
              private route: ActivatedRoute,
              private routerHelper: RouterHelpers,
              public addDomain: AddDomainPipe,
              private changeDetectorRef: ChangeDetectorRef) {
    super(router, route, routerHelper);
  }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.productionStatus = productionStatuses;
    this.orderProductionStatus = orderProductionStatus;
  }

  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  isDescending(orderByValue: string): string {
    return this.routerParams.OrderBy === orderByValue && this.routerParams.OrderByDirection === 'Ascending' ? 'dc-order' : '';
  }

  trackById(index: number, item: OrderList): number {
    return item.ID;
  }

  isAllSelected(): boolean {
    this.selectedFields = _.map(this.selection.selected, (selected: any) => {
      return selected.ID;
    });
    const numSelected: number = this.selection.selected.length;
    const numRows: number = this.ordersDataSource.data.length;
    return numSelected === numRows;
  }

  isAllPagesSelected(): boolean {
    const numSelected: number = this.selection.selected.length;
    const numRows: number = this.pagination.TotalResults;
    return numSelected === numRows;
  }

  headerToggle(menuTrigger?: MatMenuTrigger): void {
    if (this.ordersDataSource.data.length === this.pagination.TotalResults) {
      this.headerCheckbox.checked ? this.selectCurrentPageFields() : this.selection.clear();
    } else if (this.selection.selected.length === 0) {
      menuTrigger.openMenu();
      this.headerCheckbox.toggle();
    } else {
      if (this.isAllSelected() || this.isAllPagesSelected()) {
        this.selection.clear();
        this.allSelected = false;
      } else {
        this.allSelected = false;
        this.ordersDataSource.data.forEach((order: OrderList) => this.selection.select(order));
      }
      if (this.headerCheckbox.indeterminate) {
        this.selection.clear();
        this.headerCheckbox.toggle();
      }
    }
  }

  selectAllFields(): void {
    this.ordersDataSource.data.forEach((order: OrderList) => this.selection.select(order));
    this.allSelected = true;
  }

  selectCurrentPageFields(): void {
    this.ordersDataSource.data.forEach((order: OrderList) => this.selection.select(order));
    this.allSelected = false;
  }

  downloadSelectedOrders(): void {
    const selectedOrders: number[] = [];
    this.selection.selected.forEach((order: OrderList, i: number) => selectedOrders[i] = order.ID);
    this.selectedOrders.emit({'selectedOrders': selectedOrders, 'type': 'download'});
  }

  printSelectedOrders(): void {
    const selectedOrders: number[] = [];
    this.selection.selected.forEach((order: OrderList, i: number) => selectedOrders[i] = order.ID);
    this.selectedOrders.emit({'selectedOrders': selectedOrders, 'type': 'print'});
  }

  exportToQuickBooks(): void {
    const selectedOrders: number[] = [];
    this.selection.selected.forEach((order: OrderList, i: number) => selectedOrders[i] = order.ID);
    this.selectedOrders.emit({'selectedOrders': selectedOrders, 'type': 'exportQB'});
  }

  resetSelectedOrders(): void {
    this.allSelected = false;
    this.selection.clear();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.innerWidth = window.innerWidth;
  }

  onScrollDown(): void {
    if (this.innerWidth <= 640) {
      this.infinityScroll.emit();
    }
  }

  downloadShopWorksexport(): void {
    const selectedOrders: number[] = [];
    this.selection.selected.forEach((order: OrderList, i: number) => selectedOrders[i] = order.ID);
    this.selectedOrders.emit({'selectedOrders': selectedOrders, 'type': 'shopWorks'});
  }

  productionPackagingSlip(): void {
    this.selectedOrders.emit({'selectedOrders': this.selectedFields, 'type': 'productionPackagingSlip'});
  }

}
