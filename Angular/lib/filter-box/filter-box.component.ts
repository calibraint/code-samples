import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import * as _ from 'lodash';
import { LoDashStatic } from 'lodash';
import { FilterObject } from '../../entities';

/**
 *
 * This component is used as a base for multi select filter
 *
 * @example
 * <filter-box
 *  [label]="'Payment Status'"
 *  [showSearch]="false"
 *  [name]="'PaymentStatuses'"
 *  [filterData]="paymentStatus"
 *  [selectedFilterData]="selectedValue"
 *  (onFilter)="onFilter($event)">
 * </filter-box>
 */

@Component({
  selector: 'filter-box',
  templateUrl: './filter-box.component.html',
  styleUrls: ['./filter-box.component.scss']
})
export class FilterBoxComponent {
  _: LoDashStatic = _;
  searchText: string = '';
  /**
   * label for filter
   */
  @Input() label: string;

  /**
   * displays search input in filter
   */
  @Input() showSearch: boolean = false;

  /**
   * name of the filter
   */
  @Input() name: string;

  /**
   * Array of input filter data
   */
  @Input() filterData: FilterObject[];

  /**
   * Hide The Done Button & do filter action on each checkbox selection
   */
  @Input() hideDoneButton: boolean = false;

  /**
   * Array of selected filter data
   */
  @Input()
  set selectedFilterData(selectedFilterArray: any[]) {
    selectedFilterArray = selectedFilterArray ?
      _.isArray(selectedFilterArray) ? selectedFilterArray : _.split(selectedFilterArray, ',')
      : [];
    this.selection.clear();
    this.selectionTemp.clear();
    _.forEach(selectedFilterArray, (value: any) => {
      const row: FilterObject = <FilterObject> _.find(this.filterData, {Value: value});
      if (_.size(row)) {
        this.selection.select(row);
        this.selectionTemp.select(row);
      }
    });

  };

  /**
   * Emit selected filter array
   */
  @Output() onFilter: EventEmitter<any> = new EventEmitter();

  /**
   * The SelectAll checkbox element
   */
  @ViewChild('theCheckBox') theCheckBox: ElementRef;

  /**
   * The SelectionModel object for managing the selected FilterObject
   */
  selection: any = new SelectionModel<any>(true, []);
  selectionTemp: any = new SelectionModel<any>(true, []);
  constructor() { }

  /**
   * Whether the number of selected elements matches the total number of rows.
   */
  isAllSelected(): boolean {
    const numSelected: number = this.selection.selected.length;
    const numRows: number = this.filterData.length;
    return numSelected === numRows;
  }

  /**
   * Selects all rows if they are not all selected; otherwise clear selection.
   */
  masterToggle(): void {
    (this.isAllSelected() || this.selection.selected.length) ?
      this.clearSelection() :
      this.filterData.forEach((row: FilterObject) => this.selection.select(row));
  }

  /**
   * Clear selection.
   */
  clearSelection(): void {
    this.selection.clear();
    _.set(this, 'theCheckBox.indeterminate', false);
    _.set(this, 'theCheckBox.checked', false);
  }

  /**
   * This function is called on each CheckBox Selection
   */
  performFilter(): void {
    if (this.hideDoneButton) {
      const returnObj: any = {};
      returnObj[this.name] = _.map(this.selection.selected, 'Value');
      this.onFilter.emit(returnObj);
    }
  }

  /**`
   * this method trigger dropdown is closed
   */
  onClose(): void {
    const returnObj: any = {};
    returnObj[this.name] = _.map(this.selection.selected, 'Value');
    this.onFilter.emit(returnObj);
    this.searchText = '';
    this.selectionTemp.clear();
    if (this.selection.selected.length) {
      this.selectionTemp.select(this.selection.selected);
    }
  }

}

