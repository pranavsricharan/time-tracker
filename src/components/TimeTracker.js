import React from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  Button,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableContainer,
  Snackbar,
  InputBase,
  CircularProgress
} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import TodayIcon from "@material-ui/icons/Today";
import SaveIcon from "@material-ui/icons/Save";
import moment from "moment";

class TimeTracker extends React.Component {
  slotDuration = moment.duration(30, "m");
  hasChanged = false;
  static defaultProps = {
    date: moment().format("YYYY-MM-DD"),
    db: null,
  };

  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.loadEntries = this.loadEntries.bind(this);
    this.renderEntries = this.renderEntries.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.save = this.save.bind(this);
  }

  getInitialState() {
    return {
      date: moment().format("YYYY-MM-DD"),
      entries: [],
      docId: null,
      hasChanged: false,
      title: "",
      snackbarOpen: false,
    };
  }
  componentDidMount() {
    this.loadEntries();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.date !== this.state.date) {
      this.setState(this.getInitialState());
      this.loadEntries();
    }
  }

  loadEntries() {
    console.log("loading");
    let items = [];
    this.props.db
      .collection("entries")
      .where("date", "==", this.state.date)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // items.push(doc.data().data);
          this.setState({ docId: doc.id, title: doc.data().title });
          items = doc.data().data;
        });
        console.log(items);
        // this.setState({ entries: items });
        this.transformEntries(items);
      });
  }

  transformEntries(items) {
    let data = {};

    items.forEach((item) => {
      let time = moment(item.start);
      while (time.isBefore(moment(item.end))) {
        console.log(time);
        data[time.format("HH:mm")] = {
          title: item.title,
          outcome: item.outcome,
        };
        time = time.clone().add(this.slotDuration);
      }
    });
    console.log({ data });

    let transformedEntries = [];
    let start = moment(this.state.date).startOf("date");
    let end = moment(this.state.date).endOf("date");

    console.log({ start: start.toString(), end: end.toString() });

    let time = start.clone();
    for (let i = 0; i < 48; i++) {
      let startKey = time.format("HH:mm");
      let item = {
        start: startKey,
        end: time.clone().add(this.slotDuration).format("HH:mm"),
        title: "",
        outcome: "",
        onChange: function (e, field, that) {
          console.log({ this: this });
          this[field] = e.target.value;
          if (that.state.hasChanged === false)
            that.setState({ hasChanged: true });
        },
      };

      if (!!data[startKey]) {
        item.title = data[startKey].title;
        item.outcome = data[startKey].outcome;
      }
      transformedEntries.push(item);
      // data[time.format('HH:mm')] = {}
      time = time.clone().add(this.slotDuration);
    }

    console.log({ transformedEntries });
    this.setState({
      entries: transformedEntries,
    });
  }

  renderEntries() {
    if (this.state.entries.length === 0) {
      return;
    }
    return this.state.entries.map((entry) => (
      <TableRow key={`${this.state.date}-${entry.start}-${entry.end}`}>
        <TableCell>
          {entry.start} - {entry.end}
        </TableCell>
        <TableCell>
          <InputBase
            placeholder="Add title"
            defaultValue={entry.title}
            onChange={(e, data) => {
              entry.onChange(e, "title", this);
            }}
            fullWidth
            margin="none"
          />
        </TableCell>
        <TableCell>
          <InputBase
            placeholder="Add outcome"
            defaultValue={entry.outcome}
            onChange={(e, data) => {
              entry.onChange(e, "outcome", this);
            }}
            fullWidth
            multiline
            rowsMax={3}
            size="small"
            margin="none"
          />
        </TableCell>
      </TableRow>
    ));
  }

  save(e) {
    e.preventDefault();
    if (!this.state.hasChanged) {
      return;
    }

    if (this.state.docId === null) {
      this.props.db.collection("entries")
      .add({
        date: this.state.date,
        title: this.state.title,
        data: this.transformForSave()
      }).then(
        (docRef) => {
          this.setState({
            hasChanged: false,
            docId: docRef.id,
            snackbarOpen: true
          });
          console.log('saved');
        }
      );

      return;
    }

    this.props.db
      .collection("entries")
      .doc(this.state.docId)
      .update({
        title: this.state.title,
        data: this.transformForSave(),
      })
      .then(() => {
        this.setState({ hasChanged: false, snackbarOpen: true });
        console.log("saved");
      });
  }

  transformForSave() {
    let out = [];
    this.state.entries.forEach((entry) => {
      if (!!entry.title || !!entry.outcome) {
        out.push({
          start: `${this.state.date} ${entry.start}`,
          end: `${this.state.date} ${entry.end}`,
          title: entry.title,
          outcome: entry.outcome,
        });
      }
    });
    console.log(out);
    return out;
  }

  onTitleChange(e) {
    this.setState({ title: e.target.value });
    if (!this.state.hasChanged) {
      this.setState({ hasChanged: true });
    }
  }

  render() {
    return (
      <>
        <div style={{ textAlign: "right" }}>
          <Button
            variant="outlined"
            color="default"
            size="large"
            startIcon={<SaveIcon />}
            disabled={!this.state.hasChanged}
            onClick={this.save}
          >
            Save
          </Button>
        </div>
        <div style={{ clear: "both" }}></div>
        <div style={{ display: "flex", margin: "1em 0" }}>
          <div>
            <ReactDatePicker
              customInput={<DateLabel />}
              value={this.state.date}
              onChange={(date) => {
                console.log({ date: moment(date).format("YYYY-MM-DD") });
                this.setState({ date: moment(date).format("YYYY-MM-DD") });
              }}
            ></ReactDatePicker>
          </div>
          <div style={{ flex: "1", marginLeft: "1em" }}>
            <InputBase
              key={`${this.state.date}-title`}
              placeholder="Day Title"
              type="text"
              variant="outlined"
              fullWidth
              margin="dense"
              size="small"
              value={this.state.title}
              onChange={this.onTitleChange}
              style={{ fontSize: "2em" }}
            />
          </div>
        </div>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell variant="head" width="12.5%">
                  Time
                </TableCell>
                <TableCell variant="head" width="37.5%">
                  Activity
                </TableCell>
                <TableCell variant="head">Outcome</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.renderEntries() || (
                <TableRow textAlign="center">
                  <TableCell colSpan="3" align="center">
                    <CircularProgress disableShrink />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Snackbar
          key={"snackbar-" + this.state.snackbarOpen}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          open={this.state.snackbarOpen}
          autoHideDuration={5000}
          message="Entry saved."
          onClose={() => this.setState({ snackbarOpen: false })}
        >
          <Alert
            onClose={() => this.setState({ snackbarOpen: false })}
            severity="success"
          >
            Entry Saved
          </Alert>
        </Snackbar>
      </>
    );
  }
}

class DateLabel extends React.Component {
  render() {
    return (
      <Button
        variant="contained"
        disableElevation
        color="primary"
        size="large"
        startIcon={<TodayIcon />}
        onClick={this.props.onClick}
      >
        {moment(this.props.value).format("ll")}
      </Button>
    );
  }
}

export default TimeTracker;
