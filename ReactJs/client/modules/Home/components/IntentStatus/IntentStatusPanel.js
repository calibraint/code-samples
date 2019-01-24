import React from 'react'
import PropTypes from 'prop-types'
import IntentStatus from './IntentStatus'
import DateRangePicker from '../DatePicker/DateRangePicker'
import Select from 'react-select'

const statusOptions = [
    { label: 'Success', value: 'success' },
    { label: 'Unrecognized', value: 'failed' },
    { label: 'Transferred', value: 'transferred' },
]

const IntentStatusPanel = ({
    trainWatson,
    isTraining,
    intentStatus,
    page,
    fetchIntentStatus,
    onPreviousPageClick,
    onNextPageClick,
    onDateRangeChange,
    onSelectIntentStatusFilter,
    intentStatusFilter,
}) => {
    const isLastPage = intentStatus.length < 20
    const isFirstPage = page === 0
    const isNextDisabled = isLastPage
    const isPreviousDisabled = isFirstPage

    return (
        <div className="x_panel">
            <div className="x_title">
                <h2 className="col-md-6">
                    Intents
                    <small>Details of intents</small>
                </h2>
                <div className="col-md-3 searchFilter" style={{ padding: '0px 10px' }}>
                    <Select
                        name="form-field-name"
                        options={statusOptions}
                        value={intentStatusFilter}
                        onChange={onSelectIntentStatusFilter} //eslint-disable-line
                        simpleValue
                        placeholder="Select an Intent Status"
                        clearable
                    />
                </div>
                <div className="col-md-3 searchFilter" style={{ padding: '0px 10px' }}>
                    <DateRangePicker onChange={onDateRangeChange} />
                </div>
                <div className="clearfix"></div>
            </div>
            <div className="x_content" style={{ overflowX: 'auto' }}>
                <span className="pull-right" style={{ marginTop: '20px' }}>
                    <button
                        className={'btn btn-primary intent m-r-8'}
                        onClick={trainWatson}
                        disabled={isTraining}
                    >
                        {
                            isTraining && <i className="fa fa-spinner fa-spin"></i>
                        }
                        Train
                    </button>
                </span>

                <IntentStatus intentStatus={intentStatus} fetchIntentStatus={fetchIntentStatus} />
            </div>
            <span className="pull-right" style={{ marginTop: '20px' }}>
                <button className="btn btn-primary pull-left" id="previous" onClick={onPreviousPageClick} disabled={isPreviousDisabled}>
                    Previous
                </button>
                <button className="btn btn-primary pull-right" id="next" onClick={onNextPageClick} disabled={isNextDisabled}>
                    Next
                </button>
            </span>
        </div>
    )
}

IntentStatusPanel.propTypes = {
    intentStatusFilter: PropTypes.string,
    fetchIntentStatus: PropTypes.func,
    onPreviousPageClick: PropTypes.func,
    page: PropTypes.number,
    onNextPageClick: PropTypes.func,
    trainWatson: PropTypes.func,
    isTraining: PropTypes.bool,
    intentStatus: PropTypes.object,
    onDateRangeChange: PropTypes.func,
    onSelectIntentStatusFilter: PropTypes.func,
}

export default IntentStatusPanel