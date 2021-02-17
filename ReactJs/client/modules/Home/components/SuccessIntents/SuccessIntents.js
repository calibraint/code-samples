import PropTypes from 'prop-types'
import React from 'react'

function SuccessIntents(props) {
    if (props.success && props.success.data) {
        if (props.success.data.successIntents.length !== 0) {
            return (
                <table id="example" className="table table-striped responsive-utilities jambo_table">
                    <thead>
                        <tr className="headings">
                            <th>S.No </th>
                            <th>Intent </th>
                            <th>Confidence </th>
                            <th>Output </th>
                            <th>Input </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props.success.data.successIntents.map((value, index) => (
                                <tr key={index + 1} className={`${index % 2 === 0 ? 'even' : 'odd'} pointer`}>
                                    <td>{index + 1}</td>
                                    <td>{value.intent}</td>
                                    <td>{value.confidence}</td>
                                    <td>{value.output}</td>
                                    <td>{value.input}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            )
        }
        return (
            <h2>No Data Found !</h2>
        )
    }
    return null
}

SuccessIntents.propTypes = {
    success: PropTypes.object,
}

export default SuccessIntents
