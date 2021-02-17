import React from 'react'
import PropTypes from 'prop-types'
import DateRangePicker from '../DatePicker/DateRangePicker'
import MessagesChart from './MessagesChart'
import Select from 'react-select'

const MessagesPanel = (props = {}) => (
    <div className="dashboard_graph x_panel" style={{ height: '400px' }}>
        <div className="x_title">
            <h2>
                    Messages
                <small>Total daily user messages</small>
            </h2>

            <div className="clearfix"></div>

            <div className="col-xs-6 searchFilter float-right" style={{ padding: '0px 10px' }}>
                <DateRangePicker onChange={props.onDateRangeChange} />
            </div>
            <div className="col-xs-6 searchFilter float-left" style={{ padding: '0px 10px' }}>
                <Select
                    name="form-field-name"
                    options={props.intentOptions}
                    value={props.selectedIntent}
                    onChange={props.selectIntent} //eslint-disable-line
                    simpleValue
                    placeholder="Select an Intent"
                    clearable
                />
            </div>

            <div className="clearfix"></div>
        </div>
        <div className="x_content">
            <MessagesChart user={props.user} reports={props.reports} />
        </div>
    </div>


)

MessagesPanel.propTypes = {
    onDateRangeChange: PropTypes.func.isRequired,
    intentOptions: PropTypes.array.isRequired,
    selectedIntent: PropTypes.string.isRequired,
    selectIntent: PropTypes.func.isRequired,
    reports: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
}

export default MessagesPanel
