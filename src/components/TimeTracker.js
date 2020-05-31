import React from "react";
import {
  Table,
  Button,
  Icon,
  Input,
  Loader,
} from "semantic-ui-react";
import moment from "moment";

class TimeTracker extends React.Component {
  slotDuration = moment.duration(30, "m");
  hasChanged = false;
  static defaultProps = {
    'date': moment().format('YYYY-MM-DD'),
    'db': null
  }

  constructor(props) {
    super(props);
    console.log('the date', this.props.date)
    this.state = this.getInitialState();
    this.loadEntries = this.loadEntries.bind(this);
    this.renderEntries = this.renderEntries.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.save = this.save.bind(this);
  }

  getInitialState() {
    return { entries: [], docId: null, hasChanged: false, title: '' }
  }
  componentDidMount() {
    this.loadEntries();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.date !== this.props.date) {
      this.setState(this.getInitialState())
      this.loadEntries();
    }
  }

  loadEntries() {
    console.log("loading");
    let items = [];
    this.props.db
      .collection("entries")
      .where("date", "==", this.props.date)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // items.push(doc.data().data);
          this.setState({docId: doc.id})
          this.setState({title: doc.data().title})
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
          outcome: item.outcome
        };
        time = time.clone().add(this.slotDuration);
      }
    });
    console.log({ data });

    let transformedEntries = [];
    let start = moment(this.props.date).startOf("date");
    let end = moment(this.props.date).endOf("date");

    console.log({ start: start.toString(), end: end.toString() });

    let time = start.clone();
    for (let i = 0; i < 48; i++) {
      let startKey = time.format("HH:mm");
      let item = {
        start: startKey,
        end: time.clone().add(this.slotDuration).format("HH:mm"),
        title: "",
        outcome: "",
        onChange: function(e, data, field, that) {
          console.log(data);
          console.log({this: this});
          this[field] = data.value;
          if(that.state.hasChanged == false)
            that.setState({hasChanged: true});
        }
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
      <Table.Row key={Math.random()}>
        <Table.Cell>
          {entry.start} - {entry.end}
        </Table.Cell>
        <Table.Cell>
          <Input
            inverted
            transparent
            placeholder="Add title"
            defaultValue={entry.title}
            onChange={(e, data) => {entry.onChange(e, data, "title", this)}}
            fluid={true}
          />
        </Table.Cell>
        <Table.Cell>
          <Input
            inverted
            transparent
            placeholder="Add outcome"
            defaultValue={entry.outcome}
            onChange={(e, data) => {entry.onChange(e, data, "outcome", this)}}
            fluid={true}
          />
        </Table.Cell>
      </Table.Row>
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
        date: this.props.date,
        title: this.state.title,
        data: this.transformForSave()
      }).then(
        () => {
          this.setState({hasChanged: false});
          console.log('saved');
        }
      );

      return;
    }

    this.props.db.collection("entries")
      .doc(this.state.docId)
      .update({
        title: this.state.title,
        data: this.transformForSave()
      }).then(
        () => {
          this.setState({hasChanged: false});
          console.log('saved');
        }
      );
  }

  transformForSave() {
    let out = []
    this.state.entries.forEach(entry => {
      if(!!entry.title || !! entry.outcome) {
        out.push(
          {
            start: `${this.props.date} ${entry.start}`,
            end:  `${this.props.date} ${entry.end}`,
            title: entry.title,
            outcome: entry.outcome
          }
        )
      }
    });
    console.log(out);
    return out;
  }

  onTitleChange(e, data) {
    this.setState({title: data.value});
    if(!this.state.hasChanged) {
      this.setState({hasChanged: true});
    }
  }

  render() {
    return (
      <>
        <Input
          fluid
          inverted
          transparent
          placeholder="Untitled day"
          defaultValue={this.state.title} size="massive"
          onChange={this.onTitleChange}
          style={{fontSize: '2.5em'}} />
        <Table inverted celled compact selectable fixed>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width="2">Time</Table.HeaderCell>
              <Table.HeaderCell width="6">Activity</Table.HeaderCell>
              <Table.HeaderCell width="8">Outcome</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.renderEntries() || (
              <Table.Row textAlign="center">
                <Table.Cell colSpan="3"><Loader active inverted inline='centered' /></Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
          {this.state.entries.length > 0 && (
            <Table.Footer fullWidth>
              <Table.Row>
                <Table.HeaderCell colSpan="3">
                  <Button
                    floated="right"
                    icon
                    labelPosition="left"
                    primary
                    size="small"
                    onClick={this.save}
                    disabled={!this.state.hasChanged}
                  >
                    <Icon name="save" />
                    Save
                  </Button>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          )}
        </Table>
      </>
    );
  }
}

export default TimeTracker;
