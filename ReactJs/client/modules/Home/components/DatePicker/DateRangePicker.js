import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

const defaultOptionSet = {
    startDate: moment().subtract(29, 'days'),
    endDate: moment(),
    minDate: '01/01/2012',
    maxDate: '12/31/2099',
    showDropdowns: true,
    showWeekNumbers: true,
    timePicker: false,
    timePickerIncrement: 1,
    timePicker12Hour: true,
    ranges: {
        Today: [ moment(), moment() ],
        Yesterday: [ moment().subtract(1, 'days'), moment().subtract(1, 'days') ],
        'Last 7 Days': [ moment().subtract(6, 'days'), moment() ],
        'Last 30 Days': [ moment().subtract(29, 'days'), moment() ],
        'This Month': [ moment().startOf('month'), moment().endOf('month') ],
        'Last Month': [ moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month') ],
        'Last 6 Months': [ moment().subtract(6, 'month'), moment() ],
    },
    opens: 'left',
    buttonClasses: [ 'btn btn-default' ],
    applyClass: 'btn-small btn-primary time-submit',
    cancelClass: 'btn-small time-clear',
    format: 'MM/DD/YYYY',
    separator: ' to ',
    locale: {
        applyLabel: 'Submit',
        cancelLabel: 'Clear',
        fromLabel: 'From',
        toLabel: 'To',
        customRangeLabel: 'Custom',
        daysOfWeek: [ 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa' ],
        monthNames: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
        firstDay: 1,
    },
}

class DateRangePicker extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dateRangeLabel: `${moment().subtract(29, 'days').format('DD/MM/YY')} - ${moment().format('DD/MM/YY')}`,
            optionSet: props.optionSet || defaultOptionSet,
        }
    }

    componentDidMount() {
        this.$el = $(this.el)
        this.$el.daterangepicker(this.state.optionSet, this.onDateRangePickerChange)
        this.$el.on('apply.daterangepicker', this.onDateRangePickerApply)
    }

    componentWillUnmount() {
        this.$el.data('daterangepicker').remove()
    }


    onDateRangePickerChange = (start, end) => {
        const startDate = new Date(start._d).toISOString()
        const endDate = new Date(end._d).toISOString()
        const dateRangeLabel = `${start.format('DD/MM/YY')} - ${end.format('DD/MM/YY')}`

        this.setState({
            startDate,
            endDate,
            dateRangeLabel,
        })
    }

    onDateRangePickerApply = (ev, picker) => {
        this.props.onChange(
            picker.startDate.toDate(),
            picker.endDate.toDate()
        )
    }

    setRange = (start, end) => {
        this.setDateRangeLabel(start, end)
        this.setState({
            startDate: new Date(start._d).toISOString(),
            endDate: new Date(end._d).toISOString(),
        })
    }

    render() {
        const { dateRangeLabel } = this.state

        return (
            <div
                ref={(el) => { this.el = el }} //eslint-disable-line
                className="select2_single"
                style={{ background: '#fff', cursor: 'pointer', padding: '5px 10px', border: '1px solid #ccc', height: '38px', lineHeight: '27px' }}
            >
                <i className="glyphicon glyphicon-calendar fa fa-calendar" style={{ padding: '0px 5px' }}></i>
                <span>
                    {dateRangeLabel}
                </span>
                <b className="caret pull-right" style={{ marginTop: '12px' }}></b>
            </div>
        )
    }
}

DateRangePicker.propTypes = {
    onChange: PropTypes.func.isRequired,
    optionSet: PropTypes.object,
}


export default DateRangePicker
