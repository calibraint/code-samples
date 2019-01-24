import PropTypes from 'prop-types'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ClientItemRow } from './components/ClientItem/ClientItemRow'
import { getClient, initialState } from './ClientsReducer'
import { fetchClient, createClient, getClientById, updateClient, deleteClient, setClient } from './ClientsActions'
import validator from 'validator'
import * as _ from 'lodash'
import Toggle from 'react-bootstrap-toggle'
import { setClientId, setClientName } from '../App/AppActions'
import { Modal, Button } from 'react-bootstrap'
import Notifications from 'react-notification-system-redux'
import styles from './Clients.css'

const clientNameOrEmailFilter = (searchNameEmail) => (client) => {
    if (!searchNameEmail) {
        return true
    }
    if (client.clientAdmin.email && client.clientAdmin.email.toLowerCase().includes(searchNameEmail)) {
        return true
    }
    if (client.clientAdmin.clientName && client.clientAdmin.clientName.toLowerCase().includes(searchNameEmail)) {
        return true
    }
    if (client.companyName && client.companyName.toLowerCase().includes(searchNameEmail)) {
        return true
    }
    return false
}

const clientsSelector = (state, props) => (props.clients || []).filter(clientNameOrEmailFilter(state.searchNameEmail.toLowerCase()))

// const client = [];
class Clients extends Component {
    constructor() {
        super()
        this.state = {
            name: '',
            companyName: '',
            email: '',
            password: '',
            phoneNumber: '',
            street: '',
            country: '',
            state: '',
            city: '',
            zipCode: '',
            aboutCompany: '',
            websiteUrl: '',
            edit: false,
            id: '',
            status: false,
            showModal: false,
            showDeleteModal: false,
            searchNameEmail: '',
        }
        this.editClient = this.editClient.bind(this)
        this.clearValue = this.clearValue.bind(this)
    }

    componentWillUnmount() {
        this.props.setClient(initialState.clients)
    }

    UNSAFE_componentWillMount() {
        this.props.fetchClient({})
    }

    clearValue() {
        this.setState(Object.assign({}, {
            name: '',
            companyName: '',
            email: '',
            phoneNumber: '',
            password: '',
            street: '',
            country: '',
            state: '',
            city: '',
            zipCode: '',
            aboutCompany: '',
            websiteUrl: '',
            status: false,
            edit: false,
            showDeleteModal: false,
            showModal: false,
            error: '',
        }))
    }

    createClient() {
        if (this.state.phoneNumber && _.isString(this.state.phoneNumber)) {
            this.setState(Object.assign({}, this.state, {
                error: 'Please enter valid Phone Number',
            }))
        } else {
            this.setState(Object.assign({}, {
                error: '',
            }))
            this.props.createClient({
                name: this.state.name,
                companyName: this.state.companyName,
                email: this.state.email,
                password: this.state.password,
                country: this.state.country,
                street: this.state.street,
                state: this.state.state,
                city: this.state.city,
                zipCode: this.state.zipCode,
                phoneNumber: this.state.phoneNumber,
                address: this.state.address,
                aboutCompany: this.state.aboutCompany,
                websiteUrl: this.state.websiteUrl,
            }, () => {
                this.clearValue()
            }, (err) => {
                if (_.isUndefined(err.status)) {
                    this.setState(Object.assign({}, {
                        error: 'Something went wrong',
                    }))
                } else if (err.status === 'fail') {
                    this.setState(Object.assign({}, {
                        error: err.message,
                    }))
                }
            })
        }
    }

    deleteClient() {
        this.setState(Object.assign({}, {
            error: '',
        }))
        this.props.deleteClient({
            id: this.state.id,
        }, () => {
            this.clearValue()
        }, (err) => {
            if (_.isUndefined(err.status)) {
                this.setState(Object.assign({}, {
                    error: 'Something went wrong',
                }))
            } else if (err.status === 'fail') {
                this.setState(Object.assign({}, {
                    error: err.message,
                }))
            }
        })
    }

    editClient(id) {
        // TODO:Api Call Trigger
        this.clearValue()
        this.props.getClientById({
            id,
        }, (res) => {
            if (!_.isUndefined(res.status) && res.status === 'success') {
                const data = res.data.client
                this.setState(Object.assign({}, {
                    name: data.clientAdmin.clientName,
                    email: data.clientAdmin.email,
                    companyName: data.companyName,
                    aboutCompany: data.aboutCompany,
                    websiteUrl: data.website,
                    country: data.address.country,
                    state: data.address.state,
                    city: data.address.city,
                    street: data.address.street,
                    zipCode: data.address.postalCode,
                    phoneNumber: data.address.phone,
                    id: data._id,
                    status: data.isActive,
                    edit: true,
                    showModal: true,
                }))
            }
        }, (err) => {
            if (_.isUndefined(err.status)) {
                this.setState(Object.assign({}, {
                    error: 'Something went wrong',
                }))
            } else if (err.status === 'fail') {
                this.setState(Object.assign({}, {
                    error: err.message,
                }))
            }
        })
    }

    handleBlur(evt) {
        if ($(evt.target).attr('id') === 'email') {
            if (!validator.isEmail(evt.target.value)) {
                this.setState({ error: 'Enter Valid Email id' })
            } else {
                this.setState({ error: '' })
            }
        }
    }

    handleChange(evt) {
        if ($(evt.target).attr('id') === 'name') {
            this.setState(Object.assign({}, this.state, {
                name: evt.target.value,
            }))
        }
        if ($(evt.target).attr('id') === 'companyName') {
            this.setState(Object.assign({}, this.state, {
                companyName: evt.target.value,
            }))
        }
        if ($(evt.target).attr('id') === 'email') {
            this.setState(Object.assign({}, this.state, {
                email: evt.target.value,
            }))
        }
        if ($(evt.target).attr('id') === 'password') {
            this.setState(Object.assign({}, this.state, {
                password: evt.target.value,
            }))
        }
        if ($(evt.target).attr('id') === 'street') {
            this.setState(Object.assign({}, this.state, {
                street: evt.target.value,
            }))
        }
        if ($(evt.target).attr('id') === 'country') {
            this.setState(Object.assign({}, this.state, {
                country: evt.target.value,
            }))
        }
        if ($(evt.target).attr('id') === 'state') {
            this.setState(Object.assign({}, this.state, {
                state: evt.target.value,
            }))
        }
        if ($(evt.target).attr('id') === 'city') {
            this.setState(Object.assign({}, this.state, {
                city: evt.target.value,
            }))
        }
        if ($(evt.target).attr('id') === 'zipCode') {
            if (evt.target.value && validator.isNumeric(evt.target.value)) {
                this.setState(Object.assign({}, this.state, {
                    zipCode: parseInt(evt.target.value, 10),
                    error: '',
                }))
            } else if (!evt.target.value) {
                this.setState(Object.assign({}, this.state, {
                    zipCode: evt.target.value,
                }))
            }
        }
        if ($(evt.target).attr('id') === 'phoneNumber') {
            if (evt.target.value && validator.isNumeric(evt.target.value)) {
                this.setState(Object.assign({}, this.state, {
                    phoneNumber: parseInt(evt.target.value, 10),
                    error: '',
                }))
            } else if (!evt.target.value) {
                this.setState(Object.assign({}, this.state, {
                    phoneNumber: evt.target.value,
                }))
            } else if (evt.target.value === '') {
                this.state(Object.assign({}, this.state, {
                    phoneNumber: evt.target.value,
                }))
            }
        }
        if (evt.target.type === 'address') {
            this.setState(Object.assign({}, this.state, {
                address: evt.target.value,
            }))
        }
        if ($(evt.target).attr('id') === 'aboutCompany') {
            this.setState(Object.assign({}, this.state, {
                aboutCompany: evt.target.value,
            }))
        } if ($(evt.target).attr('id') === 'websiteUrl') {
            this.setState(Object.assign({}, this.state, {
                websiteUrl: evt.target.value,
            }))
        }
        if ($(evt.target).attr('id') === 'searchClient') {
            this.setState(Object.assign({}, this.state, {
                searchNameEmail: evt.target.value,
            }))
        }
    }

    handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.loadFirstClient()
        }
    }


    loadFirstClient = () => {
        const firstClient = clientsSelector(this.state, this.props)[0]
        if (!firstClient) {
            return
        }
        const id = firstClient._id
        const name = firstClient.clientAdmin.clientName
        this.saveAppDetails(id, name)
    }

    saveAppDetails = (clientId, clientName) => {
        this.props.setClientId(clientId)
        this.props.setClientName(clientName)
        this.props.history.push(`/chatbots/${clientId}`)
    }

    showDeleteClient(id) {
        this.clearValue()
        this.setState(Object.assign({}, {
            id,
            showDeleteModal: true,
        }))
    }

    showModalPopup() {
        this.clearValue()
        this.setState({ showModal: true })
    }


    statusChangeSwitch() {
        this.setState({ status: !this.state.status })
    }

    updateClient() {
        if (this.state.name === '') {
            this.setState(Object.assign({}, {
                error: 'Please enter all details',
            }))
        } else if (!validator.isEmail(this.state.email)) {
            this.setState(Object.assign({}, {
                error: 'Please enter valid email id',
            }))
        } else if (this.state.phoneNumber && _.isString(this.state.phoneNumber)) {
            this.setState(Object.assign({}, this.state, {
                error: 'Please enter valid Phone Number',
            }))
        } else {
            this.setState(Object.assign({}, {
                error: '',
            }))
            this.props.updateClient({
                name: this.state.name,
                companyName: this.state.companyName,
                email: this.state.email,
                isActive: this.state.status,
                country: this.state.country,
                street: this.state.street,
                state: this.state.state,
                city: this.state.city,
                zipCode: this.state.zipCode,
                phoneNumber: this.state.phoneNumber,
                address: this.state.address,
                aboutCompany: this.state.aboutCompany,
                websiteUrl: this.state.websiteUrl,
                id: this.state.id,
            }, () => {
                this.clearValue()
            }, (err) => {
                if (_.isUndefined(err.status)) {
                    this.setState(Object.assign({}, {
                        error: 'Something went wrong',
                    }))
                } else if (err.status === 'fail') {
                    this.setState(Object.assign({}, {
                        error: err.message,
                    }))
                }
            })
        }
    }

    render() {
        const { notifications } = this.props
        const filteredClients = clientsSelector(this.state, this.props)
        return (
            <div className="right_col" style={{ height: 'calc( 100vh - 45px)' }} >
                <div className="page-title">
                    <div className="title_left">
                        <h3>Clients <small>List of clients</small></h3>
                    </div>

                    <div className="title_right">
                        <div className="col-md-7 col-sm-7 col-xs-12 form-group top_search">
                            <div className="input-group">
                                <input
                                    id="searchClient"
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by name or email..."
                                    onChange={this.handleChange.bind(this)}
                                    value={this.state.searchNameEmail}
                                    style={{ fontSize: '14px' }}
                                    onKeyPress={this.handleSearchKeyPress}
                                    autoFocus
                                />
                                <span className="input-group-btn">
                                    <button className="btn btn-default" type="button" onClick={this.loadFirstClient}>Go!</button>
                                </span>
                            </div>
                        </div>
                        <div className="col-md-5 col-sm-5 col-xs-12 form-group">
                            <button type="button" className="btn btn-primary" onClick={this.showModalPopup.bind(this)}>Create A New Client</button>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <div className="x_panel">
                            <div className="x_content">
                                <table className="table table-striped projects">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '1%' }}>#</th>
                                            <th style={{ width: '20%' }}>Client Name</th>
                                            <th>Email</th>
                                            <th>Status</th>
                                            <th style={{ width: '20%' }}>Manage</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            filteredClients.map((client, index) => (
                                                client.clientAdmin.email
                                                    ? <ClientItemRow
                                                        key={index}
                                                        client={client}
                                                        saveAppDetails={this.saveAppDetails}
                                                        editClient={this.editClient.bind(this)}
                                                        showDeleteClient={this.showDeleteClient.bind(this)}
                                                    /> : null
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal
                    className="modal-container"
                    show={this.state.showModal}
                    onHide={this.clearValue}
                    bsSize="lg"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.edit ? 'Edit Client' : 'Create a New Client'}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p className="red text-center">{this.state.error}</p>
                        <label htmlFor="name">Client Name * :</label>
                        <input
                            style={{ marginBottom: '20px' }}
                            type="text"
                            id="name"
                            className="form-control"
                            name="name"
                            onChange={this.handleChange.bind(this)}
                            value={this.state.name}
                            required
                        />
                        <center> <p className={styles['error-name']} id="error-name">Please enter Name</p></center>
                        <label htmlFor="email">Email * :</label>
                        <input
                            style={{ marginBottom: '20px' }}
                            type="text"
                            id="email"
                            className="form-control"
                            name="email"
                            onChange={this.handleChange.bind(this)}
                            value={this.state.email}
                            disabled={this.state.edit}
                            autoComplete="new-email"
                            required
                        />
                        <center> <p className={styles['error-name']} id="error-email">Please enter Email</p></center>
                        <label htmlFor="password" hidden={this.state.edit}>Password * :</label>
                        <input
                            style={{ marginBottom: '20px' }}
                            type={this.state.edit ? 'hidden' : 'password'}
                            id="password"
                            className="form-control"
                            name="password"
                            onChange={this.handleChange.bind(this)}
                            value={this.state.password}
                            autoComplete="new-password"
                            required
                        />
                        <center> <p className={styles['error-name']} id="error-password">Please enter Password</p></center>
                        <label htmlFor="companyName">Company Name * :</label>
                        <input
                            style={{ marginBottom: '20px' }}
                            type="text"
                            id="companyName"
                            className="form-control"
                            name="companyName"
                            onChange={this.handleChange.bind(this)}
                            value={this.state.companyName}
                            required
                        />
                        <center> <p className={styles['error-name']} id="error-companyName">please enter CompanyName</p></center>
                        <label htmlFor="street">Street Address :</label>
                        <input
                            style={{ marginBottom: '20px' }}
                            type="text"
                            id="street"
                            className="form-control"
                            name="street"
                            onChange={this.handleChange.bind(this)}
                            value={this.state.street}
                            required
                        />
                        <div className="col-md-6 col-xs-12" style={{ marginLeft: '-10px' }}>
                            <label htmlFor="country">Country :</label>
                            <input
                                style={{ marginBottom: '20px' }}
                                type="text"
                                id="country"
                                className="form-control"
                                name="country"
                                onChange={this.handleChange.bind(this)}
                                onBlur={this.handleBlur.bind(this)}
                                value={this.state.country}
                                required
                            />
                        </div>
                        <div className="col-md-6 col-xs-12" style={{ marginLeft: '10px', paddingLeft: '0px' }}>
                            <label htmlFor="state" style={{ marginLeft: '8px' }}>State :</label>
                            <input
                                style={{ marginBottom: '20px', marginLeft: '8px' }}
                                type="text"
                                id="state"
                                className="form-control"
                                name="state"
                                onChange={this.handleChange.bind(this)}
                                onBlur={this.handleBlur.bind(this)}
                                value={this.state.state}
                                required
                            />
                        </div>
                        <div className="col-md-6 col-xs-12" style={{ marginLeft: '-10px' }}>
                            <label htmlFor="city">City :</label>
                            <input
                                style={{ marginBottom: '20px' }}
                                type="text"
                                id="city"
                                className="form-control"
                                name="city"
                                onChange={this.handleChange.bind(this)}
                                onBlur={this.handleBlur.bind(this)}
                                value={this.state.city}
                                required
                            />
                        </div>
                        <div className="col-md-6 col-xs-12" style={{ marginLeft: '10px', paddingLeft: '0px' }}>
                            <label htmlFor="zipCode" style={{ marginLeft: '8px' }}>Zip Code :</label>
                            <input
                                style={{ marginBottom: '20px', marginLeft: '8px' }}
                                type="text"
                                id="zipCode"
                                className="form-control"
                                name="zipCode"
                                maxLength="6"
                                onChange={this.handleChange.bind(this)}
                                onBlur={this.handleBlur.bind(this)}
                                value={this.state.zipCode}
                                required
                            />
                        </div>
                        <div className="col-md-6 col-xs-12" style={{ marginLeft: '-10px' }}>
                            <label htmlFor="phoneNumber">Phone Number :</label>
                            <input
                                style={{ marginBottom: '20px' }}
                                type="text"
                                id="phoneNumber"
                                className="form-control"
                                name="phoneNumber"
                                onChange={this.handleChange.bind(this)}
                                onBlur={this.handleBlur.bind(this)}
                                value={this.state.phoneNumber}
                                required
                            />
                        </div>
                        <div className="col-md-6 col-xs-12" style={{ marginLeft: '10px', paddingLeft: '0px' }}>
                            <label htmlFor="aboutCompany">About Company :</label>
                            <input
                                style={{ marginBottom: '20px' }}
                                type="text"
                                id="aboutCompany"
                                className="form-control"
                                name="aboutCompany"
                                onChange={this.handleChange.bind(this)}
                                onBlur={this.handleBlur.bind(this)}
                                value={this.state.aboutCompany}
                                required
                            />
                        </div>
                        <label htmlFor="email">Website URL :</label>
                        <input
                            style={{ marginBottom: '20px' }}
                            type="text"
                            id="websiteUrl"
                            className="form-control"
                            name="websiteUrl"
                            onChange={this.handleChange.bind(this)}
                            onBlur={this.handleBlur.bind(this)}
                            value={this.state.websiteUrl}
                            required
                        />
                        <div hidden={!this.state.edit}>
                            <div className="form-control" style={{ border: 'none', borderStyle: 'none', boxShadow: 'none', padding: '0px' }}>
                                <label
                                    className="control-label col-md-6 col-sm-3 col-xs-12"
                                    style={{ margin: '0px', padding: '0px', color: '#73879C', fontSize: '13px', fontWeight: '700' }}
                                >
                                    Client Status
                                </label>
                                <div className="pull-right status">
                                    <Toggle
                                        on={<h5>Enabled</h5>}
                                        off={<h5>Disabled</h5>}
                                        size="xs"
                                        offstyle="danger"
                                        active={this.state.status}
                                        onClick={this.statusChangeSwitch.bind(this)}
                                    />
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button id="closeButton" onClick={this.clearValue}>Close</Button>
                        <Button
                            id="createModalButton"
                            bsStyle="primary"
                            onClick={this.state.edit ? this.updateClient.bind(this) : this.createClient.bind(this)}
                        >{this.state.edit ? 'Update Client' : 'Create Client'}
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal
                    className="modal-container"
                    show={this.state.showDeleteModal}
                    onHide={this.clearValue}
                    bsSize="small"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Client</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>
                            This action will delete all the Employees and Chatbots that are associated with this Client.
                            Are you sure you want to delete this Client?
                        </p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button id="closeButton" onClick={this.clearValue}>Close</Button>
                        <Button id="deleteModalButton" bsStyle="primary" onClick={this.deleteClient.bind(this)}>Delete Client</Button>
                    </Modal.Footer>
                </Modal>
                <Notifications
                    notifications={notifications}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    clients: getClient(state),
    notifications: state.notifications,
})

const mapDispatchToProps = (dispatch) => ({
    fetchClient: (data) => {
        dispatch(fetchClient(data))
    },
    createClient: (data, successFn, errorFn) => {
        dispatch(createClient(data, successFn, errorFn))
    },
    getClientById: (data, successFn, errorFn) => {
        dispatch(getClientById(data, successFn, errorFn))
    },
    updateClient: (data, successFn, errorFn) => {
        dispatch(updateClient(data, successFn, errorFn))
    },
    deleteClient: (data, successFn, errorFn) => {
        dispatch(deleteClient(data, successFn, errorFn))
    },
    setClientId: (clientId) => {
        dispatch(setClientId(clientId))
    },
    setClientName: (clientName) => {
        dispatch(setClientName(clientName))
    },
    setClient: (data) => {
        dispatch(setClient(data))
    },
})

Clients.propTypes = {
    clients: PropTypes.array.isRequired,
    setBotId: PropTypes.func.isRequired,
    setClientId: PropTypes.func.isRequired,
    setClientName: PropTypes.func.isRequired,
    fetchClient: PropTypes.func.isRequired,
    createClient: PropTypes.func.isRequired,
    getClientById: PropTypes.func.isRequired,
    updateClient: PropTypes.func.isRequired,
    deleteClient: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    notifications: PropTypes.array,
    setClient: PropTypes.func.isRequired,
}

Clients.contextTypes = {
    router: PropTypes.object,
    store: PropTypes.object,
}

export default connect(mapStateToProps, mapDispatchToProps)(Clients)
