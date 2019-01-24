import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import {
  AddDomainPipe,
  ApiError,
  ApiRes, Attachment,
  DeleteWarningService,
  FilterObject,
  NotifyService,
  OrderList,
  OrderPackage,
  OrderServices,
  OrderStatus,
  Pagination,
  ProcessModalService,
  UserService,
  UserRole,
  UserRoleTypes,
  QueryParams,
  RouterHelpers,
  ServicesHelper,
  STORE_ORGANIZATION_KEY_VALUE_PAIR,
  StoreServices
} from 'essentials-lib';
import { BaseComponent } from 'external-essentials-lib';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { ORDER_LIST_FILTER_DATA, VALID_ORDER_FILTER_VALUES, productionStatuses } from './orders-list.constants';
import { OrdersDatatableComponent } from './orders-datatable/orders-datatable.component';
import { Subscription } from 'rxjs/Subscription';
import { HeaderCountService } from '../core/components/header/header-count-service';
import { AutomaticRefundFailedService } from '../modals/automatic-refund-failed/automatic-refund-failed.service';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver/FileSaver';

interface FilterObjectValues {
  Stores: FilterObject[];
  Organizations: FilterObject[];
  Assignees: FilterObject[];
}

@Component({
  selector: 'orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent extends BaseComponent implements OnInit {

  orders: OrderList[];
  pagination: Pagination;
  loading: boolean;
  searching: boolean;
  showMobileSearch: boolean;
  routerQueryParams: any = <any>{
    Status: 'Open',
    Stores: []
  };
  limit: number;
  filterObjectValues: FilterObjectValues = <FilterObjectValues>{};
  oldRouterQueryParams: any;
  paymentStatus: FilterObject[];
  productionStatus: FilterObject[];
  orderType: FilterObject[];
  storeOrganizationKeyValuePair: any;
  selectedOrders: number[] = [];
  processingBulkActions: Subscription;
  bulkOrderPackage: OrderPackage;
  @ViewChild('SideNavScroll') sideNavScroll: ElementRef;
  @ViewChild(OrdersDatatableComponent) ordersDatatableComponent: OrdersDatatableComponent;
  isInitial: boolean = true;
  index: number = 0;
  isQuickbooksEnabled: boolean = false;
  // This is used for show shopworks in order bulk action
  isShopWorksEnabled: boolean = false;
  // This is used for show quickbooks iif in order bulk actions
  isQuickbooksIIFEnabled: boolean = false;
  win: any = window;

  constructor(private route: ActivatedRoute,
              private orderServices: OrderServices,
              private storeServices: StoreServices,
              private routerHelper: RouterHelpers,
              private processModelService: ProcessModalService,
              private deleteWarningService: DeleteWarningService,
              private userService: UserService,
              private notifyService: NotifyService,
              private services: ServicesHelper,
              private renderer: Renderer2,
              public headerCountService: HeaderCountService,
              private http: HttpClient,
              public automaticRefundFailedServices: AutomaticRefundFailedService,
              private addDomain: AddDomainPipe) {
    super();
    this.productionStatus = ORDER_LIST_FILTER_DATA.productionStatus;
    this.paymentStatus = ORDER_LIST_FILTER_DATA.paymentStatus;
    this.orderType = ORDER_LIST_FILTER_DATA.orderType;
    this.storeOrganizationKeyValuePair = STORE_ORGANIZATION_KEY_VALUE_PAIR;
    this.checkQuickBooksActiveState();
  }

  ngOnInit(): void {
    this.initRoute();
    this.filterObjectValues['OrderTypes'] = this.orderType;
    this.subscribe(this.storeServices.getStores(false), (storesRes: ApiRes) => {
      const filterObjectValues: FilterObjectValues = _.cloneDeep(this.filterObjectValues);
      filterObjectValues['Stores'] = _.get(storesRes, 'Data', []);
      this.filterObjectValues = filterObjectValues;
    });
    this.subscribe(this.orderServices.getInvoiceOrganizations(), (organizaionsRes: ApiRes) => {
      const filterObjectValues: FilterObjectValues = _.cloneDeep(this.filterObjectValues);
      filterObjectValues['Organizations'] = _.map(_.get(organizaionsRes, 'Data', []), (companyName: string) => {
        return {
          ID: companyName,
          Name: companyName
        };
      });
      this.filterObjectValues = filterObjectValues;
    });
    this.getUsers();
  }

  isQueryParamsValid(): boolean {
    let isValid: boolean = true;

    /**
     * Check Order Status
     */
    if (!_.includes(VALID_ORDER_FILTER_VALUES.orderStatuses, this.routerQueryParams['Status'])) {
      this.routerQueryParams['Status'] = 'Open';
      isValid = false;
    }

    if (this.routerQueryParams['OrderBy'] === 'StatusDescription' && this.routerQueryParams['Status'] !== 'All') {
      this.routerQueryParams['OrderBy'] = 'DateCreated';
      isValid = false;
    }

    /**
     * Check Index QueryParam
     */
    if (!(_.parseInt(this.routerQueryParams['Index']) >= 0 && _.isNumber(_.parseInt(this.routerQueryParams['Index'])))) {
      this.routerQueryParams['Index'] = 0;
      isValid = false;
    }

    /**
     * Check MaxResults QueryParam
     */
    if (!(_.parseInt(this.routerQueryParams['MaxResults']) >= 0 && _.isNumber(_.parseInt(this.routerQueryParams['MaxResults'])))) {
      this.routerQueryParams['MaxResults'] = 50;
      isValid = false;
    }

    /**
     * Check Sorting Order
     */
    if (!_.includes(VALID_ORDER_FILTER_VALUES.sortDirections, this.routerQueryParams['OrderByDirection'])) {
      this.routerQueryParams['OrderByDirection'] = 'Descending';
      isValid = false;
    }

    /**
     * Check OrderBy values
     */
    if (!_.includes(VALID_ORDER_FILTER_VALUES.orderBys, this.routerQueryParams['OrderBy'])) {
      this.routerQueryParams['OrderBy'] = 'DateCreated';
      isValid = false;
    }

    if (!isValid) {
      this.goToRoute(this.routerQueryParams);
    }

    return isValid;
  }

  initRoute(): void {
    this.subscribe(this.route.queryParams, (routeQueryParams: QueryParams) => {
      this.resetRouterQueryParams();
      if (this.isQueryParamsValid()) {
        this.getOrders();
      }
    });
  }

  /**
   * This method is used for getting assignees from api
   */
  getUsers(): void {
    this.subscribe(this.userService.getUsers(UserRoleTypes.SALES_ADMIN), (success: ApiRes) => {
      const filterObjectValues: FilterObjectValues = _.cloneDeep(this.filterObjectValues);
      filterObjectValues['Assignees'] = _.map(_.get(success, 'Data', []), (assignee: UserRole) => {
        return {
          ID: assignee.ID,
          Name: assignee.FirstName + ' ' + assignee.LastName,
          Value: _.toString(assignee.ID)
        };
      });
      this.filterObjectValues = filterObjectValues;
    });
  }

  goToRoute(queryParams: any): void {
    this.routerHelper.filterRoutes(queryParams);
  }

  getOrders(infinityScroll?: boolean): void {
    this.loading = true;
    this.headerCountService.setCountValue();
    this.subscribe(this.orderServices.getOrderSummaries(
      this.routerQueryParams.Status || 'Open',
      this.routerQueryParams.Index || 0,
      this.routerQueryParams.MaxResults || 100,
      this.routerQueryParams.OrderBy || 'DateCreated',
      this.routerQueryParams.OrderByDirection || 'Descending',
      this.routerQueryParams.PaymentStatuses || [],
      _.map(this.routerQueryParams.ProductionStatuses, (a: any) => productionStatuses[a]) || [],
      this.routerQueryParams.OrderTypes || [],
      this.routerQueryParams.DateCreatedRange || null,
      this.routerQueryParams.EstimatedShipDateRange || null,
      this.routerQueryParams.Stores || [],
      this.routerQueryParams.Organizations || [],
      [],
      this.routerQueryParams.Query || '',
      [],
      this.routerQueryParams.Assignees || [],
      this.routerQueryParams.DueDate || null), (ordersRes: ApiRes) => {
      this.isInitial = false;
      this.pagination = _.get(ordersRes, 'Pagination');
      this.limit = this.routerQueryParams.Limit || 50;
      if (infinityScroll) {
        this.orders = [...this.orders, ..._.get(ordersRes, 'Data', [])];
        this.index = this.index + _.get(this.pagination, 'IncludedResults', 0);
      } else {
        this.orders = _.get(ordersRes, 'Data', []);
        this.index = _.get(this.pagination, 'IncludedResults', 0);
      }
      this.routerQueryParams.Index = this.index;
    }, (apiErr: ApiError) => {
      this.orders = [];
      this.notifyService.error(apiErr);
    }, () => {
      this.loading = false;
      this.searching = false;
      if (this.ordersDatatableComponent.allSelected) {
        this.ordersDatatableComponent.resetSelectedOrders();
        this.orders.forEach((order: OrderList) => this.ordersDatatableComponent.selection.select(order));
      } else {
        if (window.innerWidth > 640) {
          this.ordersDatatableComponent.resetSelectedOrders();
        }
      }
    });
  }

  setOrderStatus(status: OrderStatus): void {
    this.routerQueryParams.Status = status;
    if (this.routerQueryParams.Status !== 'Open' && this.routerQueryParams.Status !== 'All') {
      this.routerQueryParams.ProductionStatuses = [];
    }
    this.routerQueryParams.Index = 0;
    this.goToRoute(this.routerQueryParams);
  }

  onFilter(event: any): void {
    const queryParams: any = _.cloneDeep(this.routerQueryParams);
    queryParams.Index = '0';
    const cleanedUpNewRouterParams: any = this.routerHelper.removeEmptyParams(_.assign(queryParams, event));
    if (!_.isEqual(cleanedUpNewRouterParams, this.oldRouterQueryParams)) {
      this.routerQueryParams = _.assign(queryParams, event);
    } else {
      this.routerQueryParams = _.cloneDeep(this.oldRouterQueryParams);
    }
  }

  applyFilter(): void {
    this.goToRoute(this.routerQueryParams);
  }

  resetFilter(): void {
    this.resetRouterQueryParams();
  }

  resetProductionStatusesFilter(): void {
    this.routerQueryParams = this.routerHelper.getQueryParams([
      'ProductionStatuses'
    ]);
    this.oldRouterQueryParams = _.cloneDeep(this.routerQueryParams);
  }

  resetRouterQueryParams(): void {
    this.routerQueryParams = this.routerHelper.getQueryParams([
     'ProductionStatuses', 'PaymentStatuses', 'OrderTypes', 'Organizations', 'Stores', 'ShippingMethodIds'
    ]);
    this.oldRouterQueryParams = _.cloneDeep(this.routerQueryParams);
  }

  sideNavOpen(): void {
    _.set(this.sideNavScroll, 'nativeElement.scrollTop', 0);
    const el: any = document.getElementsByClassName('iui-side-nav')[0];
    el.classList.add('sideNav-z-index');
  }

  sideNavClose(): void {
    const el: any = document.getElementsByClassName('iui-side-nav')[0];
    el.classList.remove('sideNav-z-index');
  }

  exportToQuickbooks(): void {
    const {
      Status, Index, Limit, OrderBy, OrderByDirection, PaymentStatuses, OrderTypes, DateCreatedRange, EstimatedShipDateRange, Stores,
      Organizations
    }: QueryParams = this.routerQueryParams;

    if (this.isQuickbooksEnabled) {
      this.processModelService.open('Sit tight while we process your orders', '', () => {
        this.processingBulkActions.unsubscribe();
      });
      this.processingBulkActions = this.subscribe(this.orderServices.exportToQuickbooks(
        this.ordersDatatableComponent.allSelected ? null : this.selectedOrders,
        Status, OrderBy, OrderByDirection, PaymentStatuses, OrderTypes, DateCreatedRange, EstimatedShipDateRange, Stores, Organizations
      ), (res: ApiRes) => {
        this.processModelService.close();
        this.resetOrdersList();
      }, (err: ApiError) => {
        this.processModelService.close();
        this.notifyService.error(err);
      });
    } else if (this.isQuickbooksIIFEnabled) {
      if (_.size(this.selectedOrders) <= 25) {
        this.processModelService.open('Sit tight while we process your orders', '', () => {
        });
        this.orderServices.downloadQuickBooksIIF(this.ordersDatatableComponent.allSelected ? null : this.selectedOrders,
          Status, OrderBy, OrderByDirection, PaymentStatuses, OrderTypes, DateCreatedRange, EstimatedShipDateRange, Stores,
          Organizations, this.successDownloadQuickBooksIIF.bind(this), 'QuickBooksIIF.iif');
      } else {
        this.automaticRefundFailedServices.open(0, 'exportQB', () => {});
      }
    }
  }

  successDownloadQuickBooksIIF(isSuccess: boolean, msg: string): void {
    this.processModelService.close();
    if (!isSuccess) {
      this.automaticRefundFailedServices.open(0, 'exportQB', () => {});
    } else {
      this.ordersDatatableComponent.resetSelectedOrders();
    }
  }

  resetOrdersList(): void {
    this.ordersDatatableComponent.resetSelectedOrders();
    if (_.parseInt(this.oldRouterQueryParams.Index) === 0) {
      this.routerQueryParams.Index = 0;
      this.getOrders();
    } else {
      const queryParams: any = _.cloneDeep(this.routerQueryParams);
      queryParams.Index = 0;
      this.goToRoute(queryParams);
    }
  }

  markAsReadyToShip(): void {
    const selectedOrders: OrderList[] = this.ordersDatatableComponent.selection.selected;
    const messages: object = {
      'assignedJobs': (_.size(selectedOrders) > 1) ? 'There are production cards in these Orders that are currently ' +
        'assigned to a Job. Are you sure you want to remove them from their Job and mark the production cards as Complete?' :
        'There are production cards in this Order that are currently assigned to a Job. Are you sure you want to ' +
        'remove them from their Job and mark the production cards as Complete?',
      'noJobs': (_.size(selectedOrders) > 1) ? 'Are you sure you want to mark all production cards in these orders ' +
        'as complete and update the status to Ready to Ship / Ready to Pickup?' :
        'Are you sure you want to mark all production cards in this order as complete and update the status to ' +
        'Ready to Ship / Ready to Pickup?',
      'noProductionCards': (_.size(selectedOrders) > 1) ? 'Are you sure you want to update the the status of these ' +
        'orders to Ready to Ship / Ready to Pickup?' :
        'Are you sure you want to update the the status of this order to Ready to Ship / Ready to Pickup?'
    };
    const orderProductionCardsCount: number = _.sumBy(selectedOrders, 'ProductionCardCount', 0);
    const orderJobsCount: number = _.sumBy(selectedOrders, 'JobCount', 0);
    const messageType: string = orderProductionCardsCount
      ? (orderJobsCount ? 'assignedJobs' : 'noJobs')
      : 'noProductionCards';
    this.deleteWarningService.open(
      _.size(selectedOrders) > 1 ? 'Mark Orders as Ready to Ship / Pickup' : 'Mark Order as Ready to Ship / Pickup',
      (onSuccess: Function) => {
        this.subscribe(this.orderServices.updateProductionStatus(_.map(selectedOrders, 'ID'), 'ReadyToShip'), () => {
          onSuccess();
          if (_.size(selectedOrders) === 1) {
            this.notifyService.success(_.size(selectedOrders) + ' order has been updated successfully');
          } else {
            this.notifyService.success(_.size(selectedOrders) + ' orders have been updated successfully');
          }
          this.resetOrdersList();
        });
      },
      messages[messageType],
      '',
      'Update Status'
    );
  }

  downloadOrders(): void {
    this.processModelService.open('Sit tight while we process your orders', '', () => {
      this.processingBulkActions.unsubscribe();
    });
    this.processingBulkActions = this.downloadOrdersApi((res: any) => {
      this.ordersDatatableComponent.resetSelectedOrders();
      this.processModelService.close();
      this.notifyService.success('Selected orders were downloaded successfully');
    }, (err: ApiError) => {
      this.processModelService.close();
      this.notifyService.error(err);
    });
  }

  downloadOrdersApi(callback?: any, errFn?: any): Subscription {
    const {
      Status, Index, Limit, OrderBy, OrderByDirection, PaymentStatuses, OrderTypes, DateCreatedRange, EstimatedShipDateRange, Stores,
      Organizations
    }: QueryParams = this.routerQueryParams;

    return this.subscribe(this.orderServices.getSimpleOrderReport(
      this.ordersDatatableComponent && this.ordersDatatableComponent.allSelected ? null : this.selectedOrders,
      Status, OrderBy, OrderByDirection, PaymentStatuses, OrderTypes, DateCreatedRange, EstimatedShipDateRange, Stores, Organizations
    ), (res: any) => {
      const date: Date = new Date();
      this.orderServices.downloadCsv(
        _.get(res, 'Data.Report', ''),
        `Orders_${date.getDate()}-${date.toLocaleString('en', {month: 'short'})}-${date.getFullYear()}.csv`);
      if (callback) {
        callback(res);
      }
    }, (error: any) => {
      if (errFn) {
        errFn(error);
      }
    });
  }

  downloadShopWorks(): void {
    this.processModelService.open('Sit tight while we process your orders', '', () => {
    });
    const {
      Status, Index, Limit, OrderBy, OrderByDirection, PaymentStatuses, OrderTypes, DateCreatedRange, EstimatedShipDateRange, Stores,
      Organizations
    }: QueryParams = this.routerQueryParams;
    this.orderServices.downloadShopWorks(this.ordersDatatableComponent && this.ordersDatatableComponent.allSelected ?
        null : this.selectedOrders, Status, OrderBy, OrderByDirection, PaymentStatuses, OrderTypes, DateCreatedRange,
      EstimatedShipDateRange, Stores, Organizations, this.successShopWorks.bind(this), 'ShopWorks.txt');
  }

  successShopWorks(isSuccess: boolean, msg: string): void {
    this.processModelService.close();
    if (!isSuccess) {
      this.automaticRefundFailedServices.open(0, 'shopWorks', () => {});
    } else {
      this.ordersDatatableComponent.resetSelectedOrders();
    }
  }

  printOrders(): void {
    this.getBulkOrders(() => {
      setTimeout(() => {
        this.services.print('print-section');
      }, 5000);
    });
  }

  getBulkOrders(callback?: any): void {
    this.processModelService.open('Sit tight while we process your orders', '', () => {
      this.processingBulkActions.unsubscribe();
    });
    this.processingBulkActions = this.gettingBulkOrdersApi((res: any) => {
      this.bulkOrderPackage = <OrderPackage>res.Data;
      if (callback) {
        callback();
        this.ordersDatatableComponent.resetSelectedOrders();
      }
      this.processModelService.close();
    }, (err: ApiError) => {
      this.processModelService.close();
      this.notifyService.error(err);
    });
  }

  gettingBulkOrdersApi(callback?: any, errFn?: any): Subscription {
    if (this.ordersDatatableComponent && this.ordersDatatableComponent.allSelected) {
      const {
        Status, Index, Limit, OrderBy, OrderByDirection, PaymentStatuses, OrderTypes, DateCreatedRange, EstimatedShipDateRange, Stores,
        Organizations, ShippingMethod
      }: QueryParams = this.routerQueryParams;
      return this.subscribe(this.orderServices.getOrders(
        Status, Index, '100000', OrderBy, OrderByDirection, PaymentStatuses, OrderTypes, DateCreatedRange, EstimatedShipDateRange, Stores,
        Organizations, ShippingMethod, ''
      ), (res: ApiRes) => {
        if (callback) {
          callback(res);
        }
      }, (error: ApiError) => {
        if (errFn) {
          errFn(error);
        }
      });
    } else {
      return this.subscribe(this.orderServices.getOrderDetail(_.toString(this.selectedOrders)), (res: ApiRes) => {
        if (callback) {
          callback(res);
        }
      }, (error: ApiError) => {
        if (errFn) {
          errFn(error);
        }
      });
    }
  }

  onSearch(val: string): void {
    if (!_.isEqual(val, this.routerQueryParams.Query)) {
      this.searching = true;
      this.routerQueryParams.Query = val;
      this.routerQueryParams.Index = 0;
      this.goToRoute(this.routerQueryParams);
    }
  }

  onClear(): void {
    this.routerQueryParams.Query = '';
    this.routerQueryParams.Index = 0;
    this.goToRoute(this.routerQueryParams);
  }

  infinityScroll(): void {
    if (this.isInitial || (_.get(this.pagination, 'TotalResults') > this.index && !this.isInitial)) {
      this.getOrders(true);
    }
  }

  checkQuickBooksActiveState(): void {
    this.subscribe(this.orderServices.getLicenseOptions(), (apiRes: ApiRes) => {
      this.isQuickbooksEnabled = _.get(apiRes, 'Data.QuickBooks', false);
      this.isShopWorksEnabled = _.get(apiRes, 'Data.ShopWorks', false);
      this.isQuickbooksIIFEnabled = _.get(apiRes, 'Data.QuickBooksIIF', false);
    });
  }

  selectedOrdersType(selectedOrders: object): void {
    this.selectedOrders = _.get(selectedOrders, 'selectedOrders', []);
    const type: string = _.get(selectedOrders, 'type', null);
    if (_.size(this.selectedOrders) <= 25 || (this.isQuickbooksEnabled && _.isEqual(type, 'exportQB'))) {
      if (_.isEqual(type, 'download')) {
        this.downloadOrders();
      } else if (_.isEqual(type, 'shopWorks')) {
        this.downloadShopWorks();
      } else if (_.isEqual(type, 'exportQB')) {
        this.exportToQuickbooks();
      } else if (_.isEqual(type, 'print')) {
        this.printOrders();
      } else if (_.isEqual(type, 'productionPackagingSlip')) {
        this.win.open(this.addDomain.transform('ProductionPackingSlip/' + _.join(this.selectedOrders, '-')
          + '?WEB=1&PRINT=1', 'printBaseURL'), '_blank');
        this.ordersDatatableComponent.resetSelectedOrders();
      }
    } else {
      this.automaticRefundFailedServices.open(0, type, () => {});
    }
  }

}
