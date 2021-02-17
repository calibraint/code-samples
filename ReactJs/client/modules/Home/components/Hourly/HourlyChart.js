import React from 'react'
import PropTypes from 'prop-types'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const Hourly = ({ data }) => {
    if (!data || data.length === 0) {
        return <div>Loading..</div>
    }

    return (
        <ResponsiveContainer width="100%" height="100%" minWidth={250} minHeight={250}>
            <BarChart
                width={600}
                height={400}
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip wrapperStyle={{ zIndex: 99999 }} />
                <Legend payload={[ { value: 'Intent Count', color: '#82ca9d', type: 'line' } ]} />
                <Bar type="monotone" dataKey={"conversations"} stackId="1" stroke="#82ca9d" fill="#82ca9d" />
            </BarChart>
        </ResponsiveContainer>
    )
}

Hourly.propTypes = {
    data: PropTypes.array,
}

export default Hourly
