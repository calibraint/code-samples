import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { LoDashStatic } from 'lodash';

/**
 *
 * This component is used as a base for multi select filter
 *
 * @example
 * <multi-filter [label]="'Store/Organization'" [elementID]="'store'"
 *  [showSearch]="true" [valueKey]="'ID'" [filterData]="storeOrganization"
 *  [keyValuePair]="storeOrganizationKeyValuePair" [filterName]="null"
 *  [selectedFilterData]="{Stores: newQuery.Stores || [],Organizations: newQuery.Organizations || []}"
 *  [urlNames]="['StoreIds', 'CompanyIds']" (onFilter)="changeQuery($event)">
 * </multi-filter>
 */

@Component({
  selector: 'multi-filter',
  templateUrl: './multi-filter.component.html',
  styleUrls: ['./multi-filter.component.scss']
})

export class MultiFilterComponent implements OnChanges {

 /*
  *Static Lodash Variable
  */
  _: LoDashStatic = _;

  /*
   *Filter Array Variable
   */
  OldfilterArr: any[];

  /*
   *Temporary Filter Array Variable
   */
  tempFilterArr: any[];

  /*
   *Selected Filter Array Variable
   */
  capturedFields: any[];

  /*
   * Used display Indeterminate  if filter is partially selected
   */
  showIndeterminate: boolean = false;

  /*
   *Single Selected filter Label
   */
  selectedLabel: string = '';

  /*
  *Filter data
  */
  filterArr: any[];

  /*
  *To Display Divider Line
  */
  showLine: boolean = false;

  /*
  *Search the text in filter
  */
  searchText: string = '';

  /*
  *Static Label variable
  */
  @Input() label: string;

  /*
  *Element Id
  */
  @Input() elementID: string;

  /*
  *Default filter Data
  */
  @Input() filterData: any[];

  /*
  *Tto display the search
  */
  @Input() showSearch: boolean = false;

  /*
  *Static ValueKey
  */
  @Input() valueKey: string = 'ID';

  /*
  *Routing Query params with default Key Value
  */
  @Input() urlNames: string[];

  /*
  * Structure of Key Value which is passed
  */
  @Input() keyValuePair: any;

  /*
  *Selected Filter Field
  */
  @Input() selectedFilterData: any;

  /*
  *Name of the filter
  */
  @Input() filterName: string = '';

  /**
   * Hide The Done Button & do filter action on each checkbox selection
   */
  @Input() hideDoneButton: boolean = false;

  /*
  *Filter emitter
  */
  @Output() onFilter: EventEmitter<any> = new EventEmitter();
  @ViewChild('theCheckBox') theCheckBox: ElementRef;

  constructor() { }

  /*
  *Invoked when any changes on the filter
  */
  ngOnChanges(changes: SimpleChanges): void {
    let tempArr: any[];
    tempArr = [];
    let selectArr: any[];
    selectArr = [];
    const objectKeys: string[] = _.keys(this.filterData);
    _.forEach(objectKeys, (value: string) => {
      this.selectedFilterData[value] = this.selectedFilterData[value] ?
        _.isArray(this.selectedFilterData[value])
          ? this.selectedFilterData[value] : _.split(this.selectedFilterData[value], ',')
        : [];
    });
    _.forEach(this.selectedFilterData, (value: any, key: any) => {
      _.forEach(this.selectedFilterData[key], (svalue: any, skey: any) => {
        selectArr.push(_.toString(svalue));
      });
    });
    this.capturedFields = _.cloneDeep(selectArr);
    _.forEach(this.keyValuePair, (value: any, key: any) => {
      _.forEach(_.get(this.filterData, key, []), (fvalue: any, fkey: any) => {
        tempArr.push({
          key: key,
          apiName: _.get(value, 'apiName', ''),
          ID: _.get(fvalue, 'ID', ''),
          Name: _.get(fvalue, 'Name', ''),
          Checked: _.includes(this.capturedFields, _.toString(_.get(fvalue, 'ID')))
        });
      });
    });
    this.OldfilterArr = _.cloneDeep(tempArr);
    this.tempFilterArr = _.cloneDeep(tempArr);
    this.updateFilter();
  }

  /*
  *Used to Update the filter values
  */
  updateFilter(): void {
    // _.set(this.filterScroll, 'nativeElement.scrollTop', 0);
    this.filterArr = _.cloneDeep(this.OldfilterArr);
    this.filterArr = _.orderBy(this.filterArr, [(row: any): any => row.Name.toLowerCase()], ['asc']);
    const checkedList: any[] = _.filter(this.OldfilterArr, ['Checked', true]);
    this.capturedFields = _.map(checkedList, 'ID');
    this.showLine = !!(_.size(checkedList) !== _.size(this.OldfilterArr) && _.size(checkedList));
    this.showIndeterminate = false;

    if (_.size(this.capturedFields) === 1) {
      this.selectedLabel = _.get(_.find(this.OldfilterArr, {ID: _.first(this.capturedFields)}), 'Name', '');
    } else {
      this.showSelected();
    }

    if (_.size(this.capturedFields) > 0 && _.size(this.capturedFields) < _.size(this.OldfilterArr)) {
      this.showIndeterminate = true;
      _.set(this, 'theCheckBox.indeterminate', true);
    }
  }

  /** Select Fields in Datatable **/
  selectField(recordId: number): void {
    if (_.indexOf(this.capturedFields, recordId) === -1) {
      const temp: any[] = _.cloneDeep(this.capturedFields);
      temp.push(recordId);
      this.capturedFields = _.cloneDeep(temp);
    } else {
      const temp: any[] = _.cloneDeep(this.capturedFields);
      _.pull(temp, recordId);
      this.capturedFields = _.cloneDeep(temp);
    }

    if (_.size(this.capturedFields) > 0 && _.size(this.capturedFields) < _.size(this.OldfilterArr)) {
      this.showIndeterminate = true;
      _.set(this, 'theCheckBox.indeterminate', true);
    } else {
      this.showIndeterminate = false;
      _.set(this, 'theCheckBox.indeterminate', false);
    }

    if (_.size(this.capturedFields) === 1) {
      this.selectedLabel = _.get(_.find(this.OldfilterArr, {ID: _.first(this.capturedFields)}), 'Name', '');
    } else {
      this.showSelected();
    }

    this.selectCheck(recordId);
  }

  /*
  *Used to show the selected value
  */
  showSelected(): void {
    if (_.size(this.capturedFields) > 0) {
      this.selectedLabel = _.chain(this.capturedFields).size().toString() + ' Selected';
    } else {
      this.selectedLabel = '';
    }
  }

  /*
  *Used to check If the data is selected
  */
  selectCheck(id: number): void {
    _.map(this.OldfilterArr, (r: any) => {
      if (r.ID === id) {
        r['Checked'] = !r['Checked'];
      }
      return r;
    });

    this.OldfilterArr = _.chain(this.OldfilterArr).sortBy(['Checked', 'Name']).value();
  }

  /*
  *Used to select all values in filter
  */
  selectedAllFields(): void {
    const fields: any = _.map(this.OldfilterArr, 'ID');
    this.capturedFields = _.size(fields) !== _.size(this.capturedFields) ? fields : [];
    if (this.showIndeterminate) {
      _.set(this, 'theCheckBox.checked', false);
      this.capturedFields = [];
    }
    this.showIndeterminate = false;
    this.showSelected();
    this.applyChecked();
  }

  /*
  *Make the filter value as checked or unchecked
  */
  applyChecked(): void {
    if (_.size(this.capturedFields)) {
      _.map(this.OldfilterArr, (r: any) => {
        r['Checked'] = true;
        return r;
      });
    } else {
      _.map(this.OldfilterArr, (r: any) => {
        r['Checked'] = false;
        return r;
      });
    }
  }

  /*
  *On exit or close the changes in filter are updated
  */
  onClose(): void {
    this.searchText = '';
    this.filterArr = _.cloneDeep(this.OldfilterArr);
    this.updateFilter();
    const objectKeys: string[] = _.keys(this.filterData);
    const object: any = {};
    _.forEach(objectKeys, (value: string) => {
      object[value] = [];
    });
    _.forEach(this.capturedFields, (field: string | number) => {
      const filterData: any = _.find(this.OldfilterArr, (data: any) => _.toString(data.ID) === _.toString(field));
      if (filterData.Checked) {
        object[filterData.key] = [...object[filterData.key], filterData.ID];
      }
    });
    this.onFilter.emit(object);
  }

  /*
  *To get the Checked value from the filter
  */
  getCheckedFilter(arrValue: any[], name: string, status: boolean): any {
    return _.filter(arrValue, (value: any, key: any) => {
      return ((value.Checked === status) && (value.key === name));
    });
  }

  /**
   * This function is called on each CheckBox Selection
   */
  performFilter(): void {
    if (this.hideDoneButton) {
      const objectKeys: string[] = _.keys(this.filterData);
      const object: any = {};
      _.forEach(objectKeys, (value: string) => {
        object[value] = [];
      });
      _.forEach(this.capturedFields, (field: string | number) => {
        const filterData: any = _.find(this.OldfilterArr, (data: any) => _.toString(data.ID) === _.toString(field));
        if (filterData.Checked) {
          object[filterData.key] = [...object[filterData.key], filterData.ID];
        }
      });
      this.onFilter.emit(object);
    }
  }

}
