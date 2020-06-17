import React, { HTMLProps } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  InputBase,
  CircularProgress,
  Paper
} from "@material-ui/core";
import { Entry } from "../models/entry";

interface TimeTrackerTableProps extends HTMLProps<HTMLDivElement> {
  date?: string,
  entries: Entry[]
}
export default class TimeTrackerTable extends React.Component<TimeTrackerTableProps> {
  static defaultProps = {
    entries: []
  };

  constructor(props: TimeTrackerTableProps) {
    super(props);
    this.state = {};
    this.renderEntries = this.renderEntries.bind(this);
  }

  renderEntries() {
    if (this.props.entries.length === 0) {
      return;
    }
    return this.props.entries.map((entry) => (
      <TableRow key={`${entry.start}-${entry.end}`}>
        <TableCell>
          {entry.start} - {entry.end}
        </TableCell>
        <TableCell>
          <InputBase
            placeholder="Add title"
            defaultValue={entry.title}
            onChange={(e) => {
              if(entry.onChange) {
                entry.onChange(e, "title");
              }
            }}
            fullWidth
            margin="none"
          />
        </TableCell>
        <TableCell>
          <InputBase
            placeholder="Add outcome"
            defaultValue={entry.outcome}
            onChange={(e) => {
              if(entry.onChange) {
                entry.onChange(e, "outcome");
              }
            }}
            fullWidth
            multiline
            rowsMax={3}
            margin="none"
          />
        </TableCell>
      </TableRow>
    ));
  }

  render() {
    return (
      <TableContainer key={this.props.date} component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell variant="head" style={{width: "12.5%"}}>
                Time
              </TableCell>
              <TableCell variant="head" style={{width: "37.5%"}}>
                Activity
              </TableCell>
              <TableCell variant="head">Outcome</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.renderEntries() || (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <CircularProgress disableShrink />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}
