import React from "react";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import moment from "moment";

import TimeTrackerTable from "./TimeTrackerTable";
import EntryService from "../service/EntryService";
import { transformEntries, transformForSave } from '../helpers/entryHelpers';
import TimeTrackerHeader from "./TimeTrackerHeader";
import { Entry } from "../models/entry";

type TimeTrackerPageProps = {

}

type TimeTrackerPageState = {
  date: string,
  docId: string | null | undefined,
  title: string | null | undefined,
  entries: Entry[],
  snackbarOpen: boolean,
  hasChanged: boolean
}

export default class TimeTrackerPage extends React.Component<TimeTrackerPageProps, TimeTrackerPageState> {
  slotDuration = moment.duration(30, "m");
  hasChanged = false;
  private entryService: EntryService;

  constructor(props: TimeTrackerPageProps) {
    super(props);
    this.state = this.getInitialState();
    this.entryService = new EntryService();

    this.loadEntries = this.loadEntries.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.changeDate = this.changeDate.bind(this);
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

  componentDidUpdate(prevProps: TimeTrackerPageProps, prevState: TimeTrackerPageState) {
    if (prevState.date !== this.state.date) {
      this.loadEntries();
    }
  }

  changeDate(date: Date | null) {
    let dateString = moment(date).format('YYYY-MM-DD')
    if(dateString !== this.state.date) {
      let initialState = this.getInitialState();
      initialState.date = dateString;
      this.setState(initialState);
    }
  }

  async loadEntries() {
    let { docId, title, items } = await this.entryService
      .fetchEntriesForDate(this.state.date);

    items = transformEntries(items,
      this.state.date,
      this.slotDuration,
      () => {
        if (this.state.hasChanged === false)
          this.setState({ hasChanged: true });}
      );
    
    this.setState({
      docId: docId,
      title: title,
      entries: items
    });
  }

  async save(e: React.MouseEvent) {
    e.preventDefault();
    if (!this.state.hasChanged) {
      return;
    }

    let transformedEntries = transformForSave(
      this.state.entries, this.state.date);

    let docId = await this.entryService.setEntry(this.state.docId, {
      date: this.state.date,
      title: this.state.title,
      entries: transformedEntries
    });

    this.setState({
      docId: docId || this.state.docId,
      hasChanged: false,
      snackbarOpen: true
    });
  }

  onTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ title: e.target.value });
    if (!this.state.hasChanged) {
      this.setState({ hasChanged: true });
    }
  }

  render() {
    return (
      <>  
        <TimeTrackerHeader title={this.state.title}
          hasChanged={this.state.hasChanged}
          date={this.state.date}
          onDateChange={this.changeDate}
          onTitleChange={this.onTitleChange}
          onSave={this.save}
        />
        <TimeTrackerTable key={this.state.date} entries={this.state.entries} />

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
};
