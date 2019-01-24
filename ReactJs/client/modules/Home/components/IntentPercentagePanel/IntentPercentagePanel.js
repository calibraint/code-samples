import React from 'react'
import PropTypes from 'prop-types'
import DateRangePicker from '../DatePicker/DateRangePicker'
import IntentsPercentagePieChart from './IntentPercentagePieChart'
import Select from 'react-select'

const IntentPercentagePanel = (props) => (
    <div className="dashboard_graph x_panel" style={{ height: '400px' }}>
        <div className="x_title">
            <h2>
                    Intents
                <small>Intent popularity</small>
            </h2>

            <div className="clearfix"></div>

            <div className="col-xs-6">
                <Select
                    name="form-field-name"
                    options={props.intentOptions}
                    value={props.selectedIntents}
                    onChange={props.selectIntents} //eslint-disable-line
                    isMulti
                    simpleValue
                    placeholder="Filter the Intents"
                />
            </div>

            <div className="col-xs-6 searchFilter" style={{ padding: '0px 10px' }}>
                <DateRangePicker onChange={props.onDateRangeChange} />
            </div>

            <div className="clearfix"></div>
        </div>
        <div className="x_content">
            <IntentsPercentagePieChart reports={props.reports} />
        </div>
    </div>
)

IntentPercentagePanel.propTypes = {
    onDateRangeChange: PropTypes.func.isRequired,
    intentOptions: PropTypes.array.isRequired,
    selectedIntents: PropTypes.array.isRequired,
    selectIntents: PropTypes.func.isRequired,
    reports: PropTypes.object.isRequired,
}

export default IntentPercentagePanel
