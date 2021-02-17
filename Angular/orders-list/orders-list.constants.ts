import { FilterObject } from 'essentials-lib';

export const ORDER_LIST_FILTER_DATA: any = {
  orderType: <FilterObject[]> [
    {
      Name: 'Web Order',
      Value: 'WebOrder'
    },
    {
      Name: 'Proposal',
      Value: 'Proposal'
    }
  ],
  paymentStatus: <FilterObject[]>[
    {
      Name: 'Not Paid',
      Value: 'NOT PAID'
    }, {
      Name: 'Partially Paid',
      Value: 'PARTIALLY PAID'
    }, {
      Name: 'Paid',
      Value: 'PAID'
    }, {
      Name: 'Past Due',
      Value: 'PAST DUE'
    }
  ],
  productionStatus: <FilterObject[]> [
    {
      Name: 'New',
      Value: 'New'
    }, {
      Name: 'Scheduled',
      Value: 'Scheduled'
    }, {
      Name: 'In Progress',
      Value: 'In Progress'
    }, {
      Name: 'Ready To Ship',
      Value: 'Ready To Ship'
    }, {
      Name: 'Ready For Pickup',
      Value: 'Ready For Pickup'
    }
  ]
};

export const productionStatuses: object = {
  'Open': 'New',
  'InProduction': 'In Progress',
  'ReadyToShip': 'Ready To Ship',
  'ReadyForPickup': 'Ready For Pickup',
  'New': 'Open',
  'In Progress': 'InProduction',
  'Ready To Ship': 'ReadyToShip',
  'Ready For Pickup': 'ReadyForPickup',
  'Scheduled': 'Scheduled',
  'Completed': 'Completed',
  'Canceled': 'Canceled'
};

export const VALID_ORDER_FILTER_VALUES: any = {
  orderTypes: [
    'WebOrder',
    'Proposal'
  ],
  paymentStatuses: [
    'PAID',
    'NOT PAID',
    'PARTIAL',
    'PAST DUE'
  ],
  orderBys: [
    'DateCreated',
    'FirstName',
    'StatusDescription',
    'LastName',
    'Email',
    'ID',
    'StoreName',
    'TotalAmount',
    'EstimatedShipDate',
    'PaymentStatus',
    'ProductionStatus',
    'CreatedDate',
    'Customer'
  ],
  orderStatuses: ['Open', 'Completed', 'Canceled', 'All'],
  sortDirections: ['Ascending', 'Descending']
};
