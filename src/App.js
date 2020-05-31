import React from "react";
import "./App.css";
import {
  Container,
  Header,
  Button,
  Icon,
  Menu,
  Segment
} from "semantic-ui-react";
import moment from "moment";
import TimeTracker from "./components/TimeTracker";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class App extends React.Component {
  slotDuration = moment.duration(30, "m");
  hasChanged = false;

  constructor(props) {
    super(props);
    this.state = {date: moment().format('YYYY-MM-DD')}
  }

  render() {
    return (
      <Segment inverted style={{minHeight: '100vh'}}>


        <Menu borderless inverted fixed='top'>
          <Container style={{marginTop: '0.75em', marginBottom: '0.75em'}}>
            <Menu.Item as="a" header>
              <Header as="h2" inverted>
              Time Tracker
              </Header>
            </Menu.Item>
          </Container>
        </Menu>
        <Container style={{ marginTop: "7em" }}>
          <div style={{textAlign: "right"}}>
            <ReactDatePicker customInput={<DateLabel />} value={this.state.date}
              onChange={(date) => {
                console.log({date: moment(date).format('YYYY-MM-DD')})
                this.setState({date: moment(date).format('YYYY-MM-DD')})
              }}
            ></ReactDatePicker>
          </div>
          {/* <Header as="h2" color="blue">
            Entry for 
          </Header> */}

          <TimeTracker date={this.state.date} db={this.props.db} />
        </Container>

      </Segment>
    );
  }
}

class DateLabel extends React.Component {
  render() {
    return (
      <Button color="blue" icon labelPosition="left" onClick={this.props.onClick}>
        <Icon name="calendar" />
        {moment(this.props.value).format('ll')}
      </Button>
    );
  }
}

export default App;
