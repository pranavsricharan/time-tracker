import React from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button, InputBase } from "@material-ui/core";
import TodayIcon from "@material-ui/icons/Today";
import SaveIcon from "@material-ui/icons/Save";
import moment from "moment";

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

export default class TimeTrackerHeader extends React.Component {

  render() {
    return (
      <>
        <div style={{ display: "flex", marginBottom: "1em" }}>
          <div>
            <ReactDatePicker
              customInput={<DateLabel />}
              selected={new Date(this.props.date)}
              value={this.props.date}
              onChange={(date) => {
                this.props.onDateChange(date);
              }}
            ></ReactDatePicker>
          </div>
          <div style={{ flex: "1", marginLeft: "1em" }}>
            <InputBase
              key={`${this.props.date}-title`}
              placeholder="Day Title"
              type="text"
              variant="outlined"
              fullWidth
              margin="dense"
              size="small"
              value={this.props.title || ""}
              onChange={this.props.onTitleChange}
              style={{ fontSize: "2em" }}
            />
          </div>

          <div style={{ textAlign: "right" }}>
            <Button
              variant="outlined"
              color="default"
              startIcon={<SaveIcon />}
              disabled={!this.props.hasChanged}
              onClick={this.props.onSave}
            >
              Save
            </Button>
          </div>
        </div>
      </>
    );
  }
}
