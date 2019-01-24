import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersListComponent } from './orders-list.component';

const routes: Routes = [
  {
    path: '',
    component: OrdersListComponent,
    data: {
      helpPageId: 'orders'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersListRoutes {
}
