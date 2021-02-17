
import PropTypes from 'prop-types'
import React, { Component } from 'react'

// import * as _ from 'lodash';

export class ClientItem extends Component {

    constructor() {
        super()
        this.handleOnClickEdit = this.handleOnClickEdit.bind(this)
        this.handleOnClickDelete = this.handleOnClickDelete.bind(this)
        this.loadRoute = this.loadRoute.bind(this)
    }

    UNSAFE_componentWillMount() {
    }

    handleOnClickDelete(event) {
        event.preventDefault()
        const id = this.props.client._id
        this.props.showDeleteClient(id)
    }

    handleOnClickEdit(event) {
        event.preventDefault()
        const id = this.props.client._id
        this.props.editClient(id)
    }

    loadRoute() {
        const id = this.props.client._id
        const name = this.props.client.clientAdmin.clientName
        this.props.saveAppDetails(id, name)
    }

    render() {
        return (
            <div className="col-md-4 col-sm-4 col-xs-12 animated fadeInDown">
                <div className="well profile_view cursor_hand" style={{ paddingTop: '1px', cursor: 'default' }}>
                    <div className="col-sm-12">
                        <ul className="nav navbar-right panel_toolbox" style={{ marginRight: '-42px', marginTop: '6px' }}>
                            <li className="dropdown">
                                <a
                                    className="dropdown-toggle"
                                    data-toggle="dropdown"
                                    role="button"
                                    aria-expanded="false"
                                ><i className="fa fa-ellipsis-h" style={{ fontSize: '18px' }}></i>
                                </a>
                                <ul className="dropdown-menu" role="menu" style={{ padding: '6px', borderTop: '0px' }}>
                                    <li style={{ padding: '3px' }} onClick={this.handleOnClickEdit}><a>Edit </a>
                                    </li>
                                    <li style={{ padding: '3px' }} onClick={this.handleOnClickDelete}><a>Delete </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        <div onClick={this.loadRoute.bind(this)} style={{ cursor: 'pointer' }}>
                            {
                                (new Date(this.props.client.createdAt).toISOString().substr(0, 10) === new Date().toISOString().substr(0, 10))
                                    ? <img id="new-icon" className="newIcon" src="../assets/img/new.png" alt="" />
                                    : <br />
                            }
                            <h3 style={{ fontSize: '20px' }}>{this.props.client.clientAdmin.clientName}</h3>
                            <h4 style={{ fontSize: '16px' }}>{this.props.client.clientAdmin.email}</h4>
                            <input type="text" value={this.props.client._id} hidden />
                            <div className="pull-right status">
                                {
                                    this.props.client.isActive
                                        ? <i className="fa fa-circle on" aria-hidden="true"> Enabled</i>
                                        : <i className="fa fa-circle off" aria-hidden="false"> Disabled</i>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

ClientItem.propTypes = {
    client: PropTypes.object.isRequired,
    saveAppDetails: PropTypes.func.isRequired,
    editClient: PropTypes.func.isRequired,
    showDeleteClient: PropTypes.func.isRequired,
    time: PropTypes.time,
}

export default ClientItem
