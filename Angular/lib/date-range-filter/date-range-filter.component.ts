import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { LoDashStatic } from 'lodash';
import { GlobalHelpers } from '../../helpers/global.helpers';
import { DateFilterActionModalService } from '../../modals/date-filter-action/date-filter-action-modal.service';


/**
 *
 * This component is used as a base for multi select filter
 *
 * @example
 * <date-range-filter [title]="'Order Date Range'" [name]="'DateCreatedRange'"
 *  [isFutureDate]="true" [range]="range" [actionTitle]="'Select the Order date range'"
 *  (onFilter)="onFilter($event)"></date-range-filter>
 */

@Component({
  selector: 'date-range-filter',
  templateUrl: './date-range-filter.component.html',
  styleUrls: ['./date-range-filter.component.scss']
})
export class DateRangeFilterComponent extends BaseComponent {
  _: LoDashStatic = _;

  /**
   * Label for filter
   */
  @Input() title: string;

  /**
   * Name of the filter
   */
  @Input() name: string;

  /**
   * set to return future days
   * @default false
   */
  @Input() isFutureDate: boolean = false;

  /**
   * Should all time option be shown.
   * @default false
   */
  @Input() isAllTimeShown: boolean = false;

  /**
   * Title for custom range modal
   */
  @Input() actionTitle: string;

  /**
   * start and end date range object
   */
  @Input() set range(dateRange: string) {
    if (this.services.isJSON(dateRange)) {
      const obj: any = JSON.parse(dateRange);
      this.isAllTimeSelected = _.isEqual(obj['Begin'], 'ALL_TIME');
      if (!this.isAllTimeSelected) {
        this.start = _.size(obj['Begin']) ? new Date(obj['Begin']) : null;
        this.end = _.size(obj['End']) ? new Date(obj['End']) : null;
      }
    } else {
      this.start = null;
      this.end = null;
    }
  }

  /**
   * return applied date range filter
   */
  @Output() onFilter: EventEmitter<any> = new EventEmitter();

  /**
   * Variable for start date
   */
  start: Date;

  /**
   * Variable for end date
   */
  end: Date;

  /**
   * Variable to check if all time is selected or not
   */
  isAllTimeSelected: boolean = false;

  constructor(public services: GlobalHelpers,
              private dateFilterActionModalService: DateFilterActionModalService) {
    super();
  }

  /**
   * @description apply past days in start and end date
   */
  selectRange(days: number): void {
    this.isAllTimeSelected = false;
    this.end = new Date();
    this.start = new Date(this.end.getTime() - (days * 24 * 60 * 60 * 1000));
    this.updateDate();
  }

  /**
   * @description apply future days in start and end date
   */
  selectFutureDate(days: number): void {
    this.start = new Date();
    this.end = new Date(this.start.getTime() + (days * 24 * 60 * 60 * 1000));
    this.updateDate();
  }

  /**
   * @description set start and end date
   */
  setDate(obj: any): void {
    this.start = _.get(obj, 'startDate', null);
    this.end = _.get(obj, 'endDate', null);
    this.updateDate();
  }

  /**
   * @description update start and end date
   */
  updateDate(): void {
    const obj: any = {};
    obj[this.name] = JSON.stringify({
      Begin: this.start.toISOString().split('T')[0],
      End: this.end.toISOString().split('T')[0]
    });
    this.onFilter.emit(obj);
  }

  /**
   * @description open Date Range Filter Action modal
   */
  openModal(fileName?: string): void {
    this.dateFilterActionModalService.open(this.actionTitle, (obj: any) => {
      this.isAllTimeSelected = false;
      this.start = new Date(_.get(obj, 'Begin'));
      this.end = new Date(_.get(obj, 'End'));
      const returnObj: any = {};
      returnObj[this.name] = JSON.stringify(obj);
      this.onFilter.emit(returnObj);
    });
  }

  /**
   * @description shows all time date range
   */
  showAllTimeData(): void {
    this.isAllTimeSelected = true;
    const obj: any = {};
    obj[this.name] = JSON.stringify({
      Begin: 'ALL_TIME',
      End: ''
    });
    this.onFilter.emit(obj);
  }
}
