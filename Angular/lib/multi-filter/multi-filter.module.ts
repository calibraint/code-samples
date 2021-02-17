import { SharedModule } from '../../shared.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchFilterModule } from '../../pipes/search-filter/search-filter.module';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDividerModule,
  MatFormFieldModule,
  MatIconModule,
  MatMenuModule
} from '@angular/material';
import { MultiFilterComponent } from './multi-filter.component';


const MODULES: any[] = [
  SharedModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule,
  MatMenuModule,
  MatFormFieldModule,
  MatIconModule,
  MatCheckboxModule,
  MatDividerModule,
  SearchFilterModule,
  MatButtonModule
];

const COMPONENTS: any[] = [
  MultiFilterComponent
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
export class MultiFilterModule {
}
