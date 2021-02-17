import React from 'react'
import PropTypes from 'prop-types'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import ReactPlaceholder from 'react-placeholder'
import Placeholder from '../Placeholder/Placeholder'

const ConversationsChart = (props) => {
    if (props.reports.loading) {
        return <h2 style={{ textAlign: 'center', lineHeight: '250px' }}>Loading...</h2>
    }

    if (props.reports.success === 'fail') {
        return <h2 style={{ textAlign: 'center', lineHeight: '250px' }}>Something went wrong...</h2>
    }

    return (
        <div className="demo-placeholder" style={{ width: '100%', height: '100%' }} >
            <ReactPlaceholder ready={props.reports.status === 'success'} customPlaceholder={<Placeholder />}>
                {
                    (props.reports.data.conversationReport && props.reports.data.conversationReport.length !== 0)
                        ? (
                            <ResponsiveContainer width="100%" height="100%" minWidth={250} minHeight={250}>
                                <BarChart
                                    width={600}
                                    height={400}
                                    data={props.reports.data.conversationReport}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                    <XAxis dataKey="Date" />
                                    <YAxis />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip wrapperStyle={{ zIndex: 99999 }} />
                                    <Legend payload={[ { value: 'Conversation Count', color: '#82ca9d', type: 'line' } ]} />
                                    <Bar type="monotone" dataKey={"total"} stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        )
                        : (<h2 style={{ textAlign: 'center', lineHeight: '400px' }}>No conversations for this time period.</h2>)
                }
            </ReactPlaceholder>
        </div>
    )
}

ConversationsChart.propTypes = {
    user: PropTypes.object.isRequired,
    reports: PropTypes.object.isRequired,
}

export default ConversationsChart
