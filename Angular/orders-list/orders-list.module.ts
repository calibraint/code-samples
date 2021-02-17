import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { OrdersListComponent } from './orders-list.component';
import { OrdersListRoutes } from './orders-list.routes';
import { OrdersDatatableComponent } from './orders-datatable/orders-datatable.component';
import {
  MatButtonModule, MatCheckboxModule,
  MatIconModule, MatMenuModule, MatPaginatorModule, MatProgressSpinnerModule, MatSidenavModule, MatSortModule,
  MatTableModule
} from '@angular/material';
import {
  FilterBoxModule, FilterChipsModule, InkPaginatorModule, PillStatusModule, MultiFilterModule,
  DateRangeFilterModule, OrderHelpers, ProcessModalService, ProcessModule, ServicesHelper, AddDomainModule, AddDomainPipe
} from 'essentials-lib';
import { PrintReceiptsComponent } from './print-receipts/print-receipts.component';
import { AutomaticRefundFailedService } from '../modals/automatic-refund-failed/automatic-refund-failed.service';
import { AutomaticRefundFailedModule } from '../modals/automatic-refund-failed/automatic-refund-failed.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    OrdersListRoutes,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatSidenavModule,
    InkPaginatorModule,
    MatCheckboxModule,
    PillStatusModule,
    FilterBoxModule,
    MultiFilterModule,
    DateRangeFilterModule,
    FilterChipsModule,
    AddDomainModule,
    ProcessModule,
    AutomaticRefundFailedModule
  ],
  declarations: [
    OrdersListComponent,
    OrdersDatatableComponent,
    PrintReceiptsComponent
  ],
  providers: [
    OrderHelpers,
    ProcessModalService,
    AutomaticRefundFailedService,
    ServicesHelper,
    AddDomainPipe
  ]
})
export class OrdersListModule { }
