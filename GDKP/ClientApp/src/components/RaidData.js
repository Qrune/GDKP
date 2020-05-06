import React, { Component } from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import { DeleteRecordModal } from "./DeleteRecordModal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { RoutePaths } from "./RoutePaths";
import { Link, Redirect } from "react-router-dom";

export class RaidData extends Component {
  static displayName = RaidData.name;

  constructor(props) {
    super(props);
    this.state = {
      raids: [],
      loading: true,
      raidToDelete: "",
      selectedRaidName: "",
      deletePassword: "",
      selectedRaidDate: new Date(),
      modalVisible: false,
      deleteModalVisible: false
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.deleteRaid = this.deleteRaid.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  toggleModal() {
    const modalVisible = !this.state.modalVisible;
    this.setState({
      modalVisible
    });
  }
  toggleDeleteModal() {
    const deleteModalVisible = !this.state.deleteModalVisible;
    this.setState({
      deleteModalVisible
    });
  }
  raiseDeleteModal(raidId) {
    const deleteModalVisible = !this.state.deleteModalVisible;
    this.setState({
      deleteModalVisible,
      raidToDelete: raidId
    });
  }
  handleDateChange = date => {
    this.setState({
      raidDate: date
    });
  };
  handlePasswordChange(e) {
    console.log(this.state.raidToDelete);
    this.setState({ deletePassword: e.target.value });
  }
  handleNameChange(e) {
    this.setState({ raidName: e.target.value });
  }
  handleSubmit(event) {
    event.preventDefault();
    console.log("submitting");

    this.saveRaid(this.state.raidName, this.state.raidDate);

    return false;
  }
  handleAddRecord() {}
  componentDidMount() {
    this.populateRaidData();
  }
  handleClick(id) {
    this.props.history.push("/raid-data/" + id);
  }
  async deleteRaid(event) {
    event.preventDefault();
    console.log(this.state.raidId);
    await fetch("/raids/" + this.state.raidToDelete, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "password=" + this.state.deletePassword
    });
    window.location.reload(false);
  }
  async saveRaid(raidName, raidDate) {
    var prevThis = this;
    await fetch("/raids", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body:
        "name=" + raidName + "&date=" + raidDate.toISOString().substring(0, 10)
    }).then(() => window.location.reload(false));
  }
  renderForecastsTable(raids) {
    return (
      <>
        <table className="table table-hover" aria-labelledby="tabelLabel">
          <thead class="thead-light">
            <tr>
              <th>Raid Name</th>
              <th>Raid Date</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {raids.map(raid => (
              <tr key={raid.raidId}>
                <td onClick={() => this.handleClick(raid.raidId)}>
                  {raid.raidName}
                </td>
                <td onClick={() => this.handleClick(raid.raidId)}>
                  {raid.raidDate}
                </td>
                <td>
                  <Button
                    variant="secondary"
                    onClick={e => this.raiseDeleteModal(raid.raidId)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button variant="primary" onClick={this.toggleModal}>
          Add New Record
        </Button>
        <DeleteRecordModal
          isModalShow={this.state.deleteModalVisible}
          toggleModalVisible={this.toggleDeleteModal}
          onModalSubmit={this.deleteRaid}
          handlePasswordChange={this.handlePasswordChange}
        />

        <Modal show={this.state.modalVisible} onHide={this.toggleModal}>
          <Modal.Header closeButton>
            <Modal.Title>New Raid Record</Modal.Title>
          </Modal.Header>
          <Form onSubmit={e => this.handleSubmit(e)}>
            <Modal.Body>
              <Form.Group as={Row} controlId="formPlaintextEmail">
                <Form.Label column sm="2">
                  Name
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    value={this.state.raidName}
                    onChange={e => this.handleNameChange(e)}
                    name="name"
                    placeholder="Enter Raid Name"
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formPlaintextPassword">
                <Form.Label column sm="2">
                  Date
                </Form.Label>
                <Col sm="10">
                  <DatePicker
                    name="date"
                    selected={this.state.raidDate}
                    onChange={this.handleDateChange}
                    className="form-control"
                  />
                </Col>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.toggleModal}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </>
    );
  }

  render() {
    let contents = this.state.loading ? (
      <p>
        <em>Loading...</em>
      </p>
    ) : (
      this.renderForecastsTable(this.state.raids)
    );

    return (
      <div>
        <h1 id="tabelLabel">All Records</h1>
        <p />
        {contents}
      </div>
    );
  }

  async populateRaidData() {
    const response = await fetch("/raids");
    const data = await response.json();
    this.setState({ raids: data, loading: false });
  }
}
