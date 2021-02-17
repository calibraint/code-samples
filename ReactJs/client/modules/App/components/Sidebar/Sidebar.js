import PropTypes from 'prop-types'
import React from 'react'
import SidebarList from './SidebarList'

export default class Sidebar extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {

        const { photo, userData, typeID, user, clientId, location, chatbotId } = this.props
        const { name } = userData

        return (
            <div className="col-md-3 left_col menu_fixed">
                <div className="left_col scroll-view">
                    <div className="navbar nav_title" style={{ border: 0 }}>
                        <div className="site_title">
                            <img id="cleverLogo" src="/assets/img/cleverdashboard.png" alt="" style={{ width: '65px', marginLeft: '-6px' }} />
                            <span style={{ paddingLeft: '10px', fontSize: '17px' }}>Dashboard</span>
                        </div>
                    </div>
                    <div className="clearfix"></div>

                    <div className="profile">
                        <div className="profile_pic">
                            <img src={photo} alt="..." className="img-circle profile_img" style={{ height: '60px' }} />
                        </div>
                        <div className="profile_info">
                            <span>Welcome,</span>
                            <h2>
                                {name}
                            </h2>
                        </div>
                    </div>

                    <div id="sidebar-menu" className="main_menu_side hidden-print main_menu">
                        <div className="menu_section">
                            <h3 style={{ opacity: '0' }}>non breakable</h3>

                            <SidebarList chatbotType={typeID} location={location} user={user} clientId={clientId} chatbotId={chatbotId} />

                        </div>
                    </div>
                    <div className="sidebar-footer hidden-small" style={{ paddingLeft: '70px', paddingBottom: '20px' }}>Version 1.0.0 </div>
                </div>
            </div>
        )
    }

}

Sidebar.propTypes = {
    user: PropTypes.object.isRequired,
    photo: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    chatbotId: PropTypes.string,
    clientId: PropTypes.string.isRequired,
    userData: PropTypes.object.isRequired,
    typeID: PropTypes.string.isRequired,
    isPaid: PropTypes.bool.isRequired,
}
