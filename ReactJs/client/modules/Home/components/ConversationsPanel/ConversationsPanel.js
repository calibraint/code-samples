import React from 'react'
import PropTypes from 'prop-types'
import ConversationsChart from './ConversationsChart'
import DateRangePicker from '../DatePicker/DateRangePicker'

const ConversationsPanel = (props) => (
    <div className="dashboard_graph x_panel" style={{ height: '400px' }}>
        <div className="x_title">
            <h2>
                    Conversations
                <small>Total daily started conversations</small>
            </h2>

            <div className="clearfix"></div>

            <div className="col-xs-6 searchFilter float-right">
                <DateRangePicker onChange={props.onDateRangeChange} />
            </div>

            <div className="clearfix"></div>

        </div>

        <div className="x_content">
            <ConversationsChart user={props.user} reports={props.reports} />
        </div>
    </div>
)


ConversationsPanel.propTypes = {
    onDateRangeChange: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    reports: PropTypes.object.isRequired,
}

export default ConversationsPanel
