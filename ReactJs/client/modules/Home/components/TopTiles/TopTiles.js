import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactPlaceholder from 'react-placeholder'
import { TextBlock, RectShape } from 'react-placeholder/lib/placeholders'
import * as _ from 'lodash'
import styles from './TopTiles.css'
import DateRangePicker from '../DatePicker/DateRangePicker'

export class TopTiles extends Component {

    tile(data, color, decimals = 0) {
        if (!_.isUndefined(data.month) && !_.isUndefined(data.week) && !_.isUndefined(data.today)) {
            return (
                <div>
                    <div className={`count ${color}`}>{data.total}</div>
                    <div className="count_bottom">
                        <i className="green"><i className="fa fa-sort-asc"></i>{data.month} </i>Last Month<br />
                        <i className="green"><i className="fa fa-sort-asc"></i>{data.week} </i>Last Week<br />
                        <i className="green"><i className="fa fa-sort-asc"></i>{data.today} </i>Today
                    </div>
                </div>
            )
        }
        return (<div className={`count ${color}`}>{_.round((data.total), decimals).toFixed(decimals)}</div>)
    }
    render() {
        const placeholder = (
            <div className="right">
                <TextBlock className="count_top animated-background" color="#f0f0f0" rows={1} />
                <br />
                <RectShape className="count animated-background" color="#f0f0f0" style={{ width: '100%', height: 40 }} />
            </div>
        )
        return (
            <div style={{ padding: '5px 30px 0 30px' }}>
                <div className="row tile_count">
                    <div className="col-md-2 col-sm-4 col-xs-4 tile_stats_count">
                        <div className={styles.left}></div>
                        <ReactPlaceholder ready={this.props.counts.conversation.total !== undefined} customPlaceholder={placeholder}>
                            {
                                <div className="animated flipInY right">
                                    <span className="count_top"><i className="fa fa-comments"></i> Total Chats </span>
                                    {this.tile(this.props.counts.conversation, 'green')}
                                </div>
                            }
                        </ReactPlaceholder>
                    </div>
                    {
                        (this.props.typeId === 'Survey Bot')
                            ? <div className="col-md-2 col-sm-4 col-xs-4 tile_stats_count">
                                <div className={styles.left}></div>
                                <ReactPlaceholder ready={this.props.counts.ratingAverage.total !== undefined} customPlaceholder={placeholder}>
                                    {
                                        <div className="animated flipInY right">
                                            <span className="count_top"><i className="fa fa-comments"></i> Total Chats </span>
                                            {this.tile(this.props.counts.conversation, '')}
                                        </div>
                                    }
                                </ReactPlaceholder>
                            </div>
                            : ''
                    }

                    {
                        /* (this.props.typeId !== 'Survey Bot') ?
                        <div className="col-md-2 col-sm-4 col-xs-4 tile_stats_count">
                            <div className={styles.left}></div>
                            <ReactPlaceholder ready={this.props.counts.conversationSuccess.total !== undefined} customPlaceholder={placeholder}>
                                {
                                    <div className="animated flipInY right">
                                        <span className="count_top"><i className="fa fa-comments"></i> Succeeded Chats</span>
                                        {this.tile(this.props.counts.conversationSuccess, 'green')}
                                    </div>
                                }
                            </ReactPlaceholder>
                        </div> : ''
                        */
                    }
                    {(this.props.typeId !== 'Survey Bot')
                        ? <div className="col-md-2 col-sm-4 col-xs-4 tile_stats_count">
                            <div className={styles.left}></div>
                            <ReactPlaceholder ready={this.props.counts.successIntent.total !== undefined} customPlaceholder={placeholder}>
                                {
                                    <div className="animated flipInY right">
                                        <span className="count_top"><i className="fa fa-check"></i> Succeeded Intents </span>
                                        {this.tile(this.props.counts.successIntent, 'green')}
                                    </div>
                                }
                            </ReactPlaceholder>
                        </div> : ''
                    }
                    {(this.props.typeId !== 'Survey Bot')
                        ? <div className="col-md-2 col-sm-4 col-xs-4 tile_stats_count">
                            <div className={styles.left}></div>
                            <ReactPlaceholder ready={this.props.counts.failedIntent.total !== undefined} customPlaceholder={placeholder}>
                                {
                                    <div className="animated flipInY right">
                                        <span className="count_top"><i className="fa fa-question"></i> Unrecognized Intents </span>
                                        {this.tile(this.props.counts.failedIntent, '')}
                                    </div>
                                }
                            </ReactPlaceholder>
                        </div> : ''
                    }
                    <div>
                        <div className="col-md-3 col-sm-4 col-xs-4 pull-right" style={{ marginRight: '15px', marginBottom: '-80px', padding: '0px 15px' }}>
                            <DateRangePicker onChange={this.props.onDateRangeChange} />
                        </div>
                    </div>
                </div>
                {
                    /*
                    (this.props.typeId !== 'Survey Bot') ?
                    <div className="row tile_count" style={{ width: '100%' }}>
                        <div className="col-md-2 col-sm-4 col-xs-4 tile_stats_count">
                            <div className={styles.left}></div>
                            <ReactPlaceholder ready={this.props.counts.liveTransferredCount.total !== undefined} customPlaceholder={placeholder}>
                                {
                                    <div className="animated flipInY right">
                                        <span className="count_top" style={{ whiteSpace: 'normal' }}><i className="fa fa-comments"></i> Transferred without chats</span>
                                        {this.tile(this.props.counts.liveTransferredCount, '')}
                                    </div>
                                }
                            </ReactPlaceholder>
                        </div>
                        <div className="col-md-2 col-sm-4 col-xs-4 tile_stats_count">
                            <div className={styles.left}></div>
                            <ReactPlaceholder ready={this.props.counts.transferIntent.total !== undefined} customPlaceholder={placeholder}>
                                {
                                    <div className="animated flipInY right">
                                        <span className="count_top" style={{ whiteSpace: 'normal' }}><i className="fa fa-comments"></i> Transferred with Chats</span>
                                        {this.tile(this.props.counts.transferIntent, '')}
                                    </div>
                                }
                            </ReactPlaceholder>
                        </div>
                        <div className="col-md-2 col-sm-4 col-xs-4 tile_stats_count">
                            <div className={styles.left}></div>
                            <ReactPlaceholder ready={this.props.counts.totalTransferredCount.total !== undefined} customPlaceholder={placeholder}>
                                {
                                    <div className="animated flipInY right">
                                        <span className="count_top" style={{ whiteSpace: 'normal' }}><i className="fa fa-comments"></i> Total Transferred Chats</span>
                                        {this.tile(this.props.counts.totalTransferredCount, '')}
                                    </div>
                                }
                            </ReactPlaceholder>
                        </div>
                        <div className="col-md-2 col-sm-4 col-xs-4 tile_stats_count">
                            <div className={styles.left}></div>
                            <ReactPlaceholder ready={this.props.counts.ratingAverage.total !== undefined} customPlaceholder={placeholder}>
                                {
                                    <div className="animated flipInY right">
                                        <span className="count_top" style={{ whiteSpace: 'normal' }}><i className="fa fa-comments"></i> Average Customer Rating</span>
                                        {this.tile(this.props.counts.ratingAverage, '')}
                                    </div>
                                }
                            </ReactPlaceholder>
                        </div>
                    </div> : ''
                */
                }
            </div>
        )
    }
}


TopTiles.propTypes = {
    user: PropTypes.object.isRequired,
    counts: PropTypes.object,
    typeId: PropTypes.string.isRequired,
    onDateRangeChange: PropTypes.func.isRequired,
}

export default TopTiles
