import React, { Component } from 'react'
import { connect } from 'react-redux'

class notFound extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    render() {
        return (
            <div>
                <h3 style={{ width: '370px' }}>404 page not found</h3>
                <p>We are sorry but the page you are looking for does not exist.</p>
            </div>
        )
    }
}
export default connect(
)(notFound)
