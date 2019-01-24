import React from 'react'; // eslint-disable-line
import PropTypes from 'prop-types'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import ReactPlaceholder from 'react-placeholder'
import Placeholder from '../Placeholder/Placeholder'


const COLORS = [ '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8042FF', '#C4009F' ]

const renderCustomLabel = ({ percent }) => `${(percent * 100).toFixed(1)}%`

const IntentsPercentagePieChart = (props) => {
    if (props.reports.loading) {
        return <h2 style={{ textAlign: 'center', lineHeight: '250px' }}>Loading...</h2>
    }

    if (props.reports.success === 'fail') {
        return <h2 style={{ textAlign: 'center', lineHeight: '250px' }}>Something went wrong...</h2>
    }

    return (
        <ReactPlaceholder ready={props.reports.status === 'success'} customPlaceholder={<Placeholder />}>
            {
                (props.reports.data.intentsReport.length !== 0)
                    ? (
                        <ResponsiveContainer width="100%" height="100%" minWidth={250} minHeight={250}>
                            <PieChart>
                                <Pie
                                    data={props.reports.data.intentsReport}
                                    fill="#8884d8"
                                    cx={'40%'}
                                    label={renderCustomLabel}
                                    outerRadius={80}
                                >
                                    {
                                        props.reports.data.intentsReport.map(
                                            (entry, index) => (<Cell key={entry.toString()} fill={COLORS[index % COLORS.length]} />)
                                        )
                                    }
                                </Pie>
                                <Tooltip />
                                <Legend align={'right'} layout={'vertical'} verticalAlign={'middle'} />
                            </PieChart>
                        </ResponsiveContainer>
                    )
                    : <h2 style={{ textAlign: 'center', lineHeight: '250px' }}>No Intents for this time period.</h2>
            }
        </ReactPlaceholder>
    )
}

IntentsPercentagePieChart.propTypes = {
    cx: PropTypes.number,
    cy: PropTypes.number,
    midAngle: PropTypes.number,
    innerRadius: PropTypes.number,
    outerRadius: PropTypes.number,
    percent: PropTypes.number,
    reports: PropTypes.object.isRequired,
}

export default IntentsPercentagePieChart
