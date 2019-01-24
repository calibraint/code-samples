import { SharedModule } from '../../shared.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDividerModule,
  MatFormFieldModule,
  MatIconModule,
  MatMenuModule
} from '@angular/material';
import { FilterBoxComponent } from './filter-box.component';
import { SearchFilterModule } from '../../pipes/search-filter/search-filter.module';


const MODULES: any[] = [
  RouterModule,
  SearchFilterModule,
  FormsModule,
  ReactiveFormsModule,
  MatMenuModule,
  MatFormFieldModule,
  MatIconModule,
  MatCheckboxModule,
  MatButtonModule,
  MatDividerModule,
  SharedModule
];

const COMPONENTS: any[] = [
  FilterBoxComponent
];

@NgModule({
  imports: [
    ...MODULES,
  ],
  declarations: [
    ...COMPONENTS,
  ],
  providers: [],
  exports: [
    ...MODULES,
    ...COMPONENTS,
  ]
})
export class FilterBoxModule {
}
