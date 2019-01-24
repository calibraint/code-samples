import React from 'react'
import PropTypes from 'prop-types'
import HourlyChart from './HourlyChart'
import DateRangePicker from '../DatePicker/DateRangePicker'

const Hourly = ({ data, onDateRangeChange }) => (
    <div className="dashboard_graph x_panel" style={{ height: '400px' }}>
        <div className="x_title">
            <h2>
                    Hourly Conversations
                <small>Total started conversations by hour</small>
            </h2>

            <div className="clearfix"></div>

            <div className="col-xs-6 searchFilter pull-right" style={{ padding: '0px 10px' }}>
                <DateRangePicker onChange={onDateRangeChange} />
            </div>

            <div className="clearfix"></div>
        </div>
        <div className="x_content">
            <HourlyChart data={data} />
        </div>
    </div>
)

Hourly.propTypes = {
    data: PropTypes.array,
    onDateRangeChange: PropTypes.func.isRequired,
}

export default Hourly
