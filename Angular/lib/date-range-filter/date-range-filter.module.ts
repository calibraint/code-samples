import { SharedModule } from '../../shared.module';
import { NgModule, Provider } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule, MatMenuModule, } from '@angular/material';
import { DateRangeFilterComponent } from './date-range-filter.component';
import { GlobalHelpers } from '../../helpers/global.helpers';
import { DateFilterActionModule } from '../../modals/date-filter-action/date-filter-action.module'


const MODULES: any[] = [
  SharedModule,
  RouterModule,
  MatMenuModule,
  MatIconModule,
  DateFilterActionModule
];

const COMPONENTS: any[] = [
  DateRangeFilterComponent
];

const PROVIDERS: Provider[] = [
  GlobalHelpers
];

@NgModule({
  imports: [
    ...MODULES,
  ],
  declarations: [
    ...COMPONENTS,
  ],
  providers: [
    ...PROVIDERS
  ],
  exports: [
    ...MODULES,
    ...COMPONENTS,
  ]
})
export class DateRangeFilterModule {
}
