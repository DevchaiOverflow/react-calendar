import React, { useState, useRef, useEffect } from 'react'
import * as dateFns from "date-fns"
import '../App.css'
import './Calendar1.css'

// Material ui
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  calendar: {
    width: '100%',
  },
  resultEvent: {
    width: '100%'
  },

  content: {
    margin: 10,
    width: '100%'
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}))

const Calendar1 = props => {

  const classes = useStyles()

  const [state, setState] = useState({
    currentMonth: new Date(),
    selectedDate: new Date(),
    resultDate: null,
  })
  const [open, setOpen] = useState(false);
  const timeOutRef = useRef()

  useEffect(() => {
    return () => clearTimeout(timeOutRef.current)
  }, [])

  const renderHeader = () => {

    const dateFormat = "MMMM yyyy";

    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={prevMonth}>
            chevron_left
          </div>
        </div>
        <div className="col col-center">
          <span>{dateFns.format(state.currentMonth, dateFormat)}</span>
        </div>
        <div className="col col-end" onClick={nextMonth}>
          <div className="icon">chevron_right</div>
        </div>
      </div>
    );
  }

  const renderDays = () => {
    const dateFormat = "EEEE";
    const days = [];

    let startDate = dateFns.startOfWeek(state.currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="days row">{days}</div>;
  }

  const renderCells = () => {
    const { currentMonth, selectedDate } = state;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);

    console.log('selectedDate', selectedDate)

    const dateFormat = "d";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = dateFns.format(day, dateFormat);
        const cloneDay = day;
        days.push(
          <div
            className={`col cell ${
              !dateFns.isSameMonth(day, monthStart)
                ? "disabled"
                : dateFns.isSameDay(day, selectedDate) ? "selected" : ""
              }`}
            key={day}
            // onClick={() => onDateClick(dateFns.parse(cloneDay, 'd', new Date()))}
            onClick={() => onDateClick(cloneDay)}
          >
            <span className="number">{formattedDate}</span>
            <span className="bg">{formattedDate}</span>
          </div>
        );
        day = dateFns.addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }

    return <div className="body">{rows}</div>;
  }

  const renderResultEvent = () => {
    return (
      <Grid item xs={12} className={classes.root}>
        <Paper className={classes.resultEvent}>
          <section id="timeline" className="timeline-outer">
            <div className="container" id="content">
              <div className="row">
                <div className="col s12 m12 l12">
                  <h1 className="blue-text lighten-1 header">{dateFns.format(state.resultDate, 'd MMMM yyyy')}</h1>
                  <ul className="timeline">

                    <li className="event" data-date="(10:00 - 11:30)">
                      <h3>Living Room</h3>
                      <p>
                        สัณหณัฐ งามฉายวงศ์ <br />
                              MEAConnect: UI Meeting
                            </p>
                    </li>

                    <li className="event" data-date="(10:15 - 17:15)">
                      <h3>Meeting Room</h3>
                      <p>
                        ปวริศ โกวิทวีรธรรม <br />
                              Connect
                            </p>
                    </li>

                  </ul>
                </div>
              </div>
            </div>
          </section>
        </Paper>
      </Grid>
    )
  }

  const onDateClick = (day) => {

    setOpen(true)

    timeOutRef.current = setTimeout(() => {
      setState(prevState => ({
        ...prevState,
        selectedDate: day,
        resultDate: day
      }))
      setOpen(false)
    }, 300)
  }

  const nextMonth = () => {
    setState({
      currentMonth: dateFns.addMonths(state.currentMonth, 1)
    });
  };

  const prevMonth = () => {
    setState({
      currentMonth: dateFns.subMonths(state.currentMonth, 1)
    });
  };

  return (<>
    <Grid container>
      <Grid item xs={12} className={classes.root}>
        <Paper className={classes.calendar}>
          <div className="calendar">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
          </div>
        </Paper>
      </Grid>

      {
        (state.resultDate) ?
          renderResultEvent()
          : null
      }

    </Grid>

    <Backdrop className={classes.backdrop} open={open}>
      <CircularProgress color="inherit" />
    </Backdrop>

  </>)
}

export default Calendar1
