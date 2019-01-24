import { Component, Input } from '@angular/core';
import {OrderSummary, Product} from 'essentials-lib';

@Component({
  selector: 'print-receipts',
  templateUrl: './print-receipts.component.html'
})
export class PrintReceiptsComponent {
  @Input() orders: OrderSummary[];
  @Input() products: Product[];
  @Input() stores: any[];
  @Input() publisher: any;
}
