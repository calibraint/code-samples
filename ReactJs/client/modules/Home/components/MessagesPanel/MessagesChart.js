import React from 'react'
import PropTypes from 'prop-types'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import ReactPlaceholder from 'react-placeholder'
import Placeholder from '../Placeholder/Placeholder'

const MessagesChart = (props) => {
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
                    (props.reports.data.intentData && props.reports.data.intentData.length !== 0)
                        ? (
                            <ResponsiveContainer width="100%" height="100%" minWidth={250} minHeight={250}>
                                <BarChart
                                    width={600}
                                    height={400}
                                    data={props.reports.data.intentData}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <XAxis dataKey="Date" />
                                    <YAxis />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip />
                                    <Legend payload={[ { value: 'Intent Count', color: '#82ca9d', type: 'line' } ]} />
                                    <Bar type="monotone" dataKey={"total"} stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        )
                        : <h2 style={{ textAlign: 'center', lineHeight: '400px' }}>No Intents for this time period.</h2>
                }
            </ReactPlaceholder>
        </div>
    )
}

MessagesChart.propTypes = {
    user: PropTypes.object.isRequired,
    reports: PropTypes.object.isRequired,
}

export default MessagesChart
