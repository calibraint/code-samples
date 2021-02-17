import PropTypes from 'prop-types'
import React, { Component } from 'react'
import moment from 'moment'
// import * as _ from 'lodash';

export class ClientItemRow extends Component {

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
        const { client } = this.props
        const avatarSrc = client.avatar || '../../assets/img/empty.png'
        const creationDate = moment(client.createdAt).format('DD-MM-YYYY')
        const isNew = moment(client.createdAt).isSame(new Date(), 'day')
        return (
            <tr>
                <td onClick={this.loadRoute.bind(this)} style={{ cursor: 'pointer' }}>
                    {
                        isNew && <img id="new-icon" className="newIcon" src="../../assets/img/new.png" alt="new" />
                    }
                    <img src={avatarSrc} className="avatar" alt="Avatar" />
                    <input type="text" value={this.props.client._id} hidden />
                </td>
                <td onClick={this.loadRoute.bind(this)} style={{ cursor: 'pointer' }}>
                    <h4>{client.companyName || client.clientAdmin.clientName}</h4>
                    <br />
                    <small>{creationDate}</small>
                </td>
                <td onClick={this.loadRoute.bind(this)} style={{ cursor: 'pointer' }}>
                    {client.clientAdmin.email}
                </td>
                <td onClick={this.loadRoute.bind(this)} style={{ cursor: 'pointer' }}>
                    {
                        this.props.client.isActive
                            ? <button type="button" className="btn btn-success btn-xs">Enabled</button>
                            : <button type="button" className="btn btn-warning btn-xs">Disabled</button>
                    }
                </td>
                <td>
                    <a className="btn btn-primary btn-xs" onClick={this.loadRoute.bind(this)} style={{ cursor: 'pointer' }}><i className="fa fa-folder"></i> Bots</a>
                    <a className="btn btn-info btn-xs" onClick={this.handleOnClickEdit}><i className="fa fa-pencil"></i> Edit </a>
                    <a className="btn btn-danger btn-xs" onClick={this.handleOnClickDelete}><i className="fa fa-trash-o text-white"></i> Delete </a>
                </td>
            </tr>
        )
    }
}

ClientItemRow.propTypes = {
    client: PropTypes.object.isRequired,
    saveAppDetails: PropTypes.func.isRequired,
    editClient: PropTypes.func.isRequired,
    showDeleteClient: PropTypes.func.isRequired,
    time: PropTypes.time,
}

export default ClientItemRow
