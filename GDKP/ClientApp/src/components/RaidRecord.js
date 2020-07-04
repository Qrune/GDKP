import React, { Component } from "react";
import { RoutePaths } from "./RoutePaths";
import { Container, Button, Modal, Form, Row, Col } from "react-bootstrap";
import { DeleteRecordModal } from "./DeleteRecordModal";
import { GroupCalculateModal } from "./modals/GroupCalculateModal";
import { WclLinkComponent } from "./WclLink";
import { List, Statistic, Card } from "antd";
import { Link, Redirect } from "react-router-dom";
import "antd/dist/antd.css";
export class RaidRecord extends Component {
  static displayName = RaidRecord.name;
  constructor(props) {
    super(props);
    this.state = {
      raidId: "",
      itemName: "",
      itemPrice: 50,
      buyerName: "",
      groupModalVisible: false,
      deleteModalVisible: false,
      groupCalculateModalVisible: false,
      isExpense: false,
      comment: "",
      records: [],
      groupTax: 5,
      groupPeople: 0,
      groupSubsidyPeople: 0,
      groupSubsidyAmount: 0,
      recordToDelete: "",
      groupPassword: "",
      recordDeletePassword: "",
      wclLink: "",
      loading: true
    };
    this.handleAddNewRecord = this.handleAddNewRecord.bind(this);
    this.handleWclLinkChange = this.handleWclLinkChange.bind(this);
    this.handleRecordDeletePasswordChange = this.handleRecordDeletePasswordChange.bind(
      this
    );
    this.toggleGroupModal = this.toggleGroupModal.bind(this);
    this.ComputeTax = this.ComputeTax.bind(this);
    this.ComputeDps = this.ComputeDps.bind(this);
    this.ComputeSubsidy = this.ComputeSubsidy.bind(this);
    this.modifyGroupDetail = this.modifyGroupDetail.bind(this);
    this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
    this.toggleGroupCalculateModal = this.toggleGroupCalculateModal.bind(this);
    this.raiseDeleteModal = this.raiseDeleteModal.bind(this);
    this.deleteRecord = this.deleteRecord.bind(this);
    this.colorPrice = this.colorPrice.bind(this);
  }
  handleWclLinkChange(e) {
    this.setState({ wclLink: e.target.value });
  }
  handleItemNameChange(e) {
    this.setState({ itemName: e.target.value });
  }
  handlePriceChange(e) {
    this.setState({ itemPrice: e.target.value });
  }
  handleBuyerNameChange(e) {
    this.setState({ buyerName: e.target.value });
  }
  handleCommentChange(e) {
    this.setState({ comment: e.target.value });
  }
  handleGroupTaxChange(e) {
    this.setState({ groupTax: e.target.value });
  }
  handleGroupPeopleNumberChange(e) {
    this.setState({ groupPeople: e.target.value });
  }
  handleGroupSubsidyPeopleChange(e) {
    this.setState({ groupSubsidyPeople: e.target.value });
  }
  handleGroupSubsidyAmountChange(e) {
    this.setState({ groupSubsidyAmount: e.target.value });
  }
  handleGroupPasswordChange(e) {
    this.setState({ groupPassword: e.target.value });
  }
  handleRecordDeletePasswordChange(e) {
    this.setState({ recordDeletePassword: e.target.value });
  }
  handleExpenseChange(e) {
    this.setState({ isExpense: !this.state.isExpense });
  }
  colorPrice(value) {
    if (parseInt(value) > 1000) {
      return <p className="text-danger font-weight-bold">{value}</p>;
    } else if (parseInt(value) > 500) {
      return <p className="text-warning font-weight-bold">{value}</p>;
    } else if (parseInt(value) > 200) {
      return <p className="text-primary font-weight-bold">{value}</p>;
    }
    return value;
  }
  componentDidMount() {
    if (this.props.match.path == RoutePaths.Raid) {
      this.state.raidId = this.props.match.params.id;
      this.populateRecordData(this.props.match.params.id);
    }
  }
  ComputeTotal() {
    var total = 0;
    this.state.records.forEach(record => {
      total += parseInt(record.amount);
    });
    return total;
  }
  ComputeTax() {
    return this.ComputeTotal() * this.state.groupTax / 100.0;
  }
  ComputeRealTotal() {
    return this.ComputeTotal() * 0.995;
  }
  ComputeDps() {
    return Math.floor(
      (this.ComputeRealTotal() -
        (this.state.groupSubsidyPeople == 0
          ? this.ComputeTax()
          : 2 * this.ComputeTax())) /
        this.state.groupPeople
    );
  }
  ComputeSubsidy() {
    return this.state.groupSubsidyPeople == 0
      ? 0
      : Math.floor(
          this.ComputeDps() + this.ComputeTax() / this.state.groupSubsidyPeople
        );
  }
  async deleteRecord(event) {
    event.preventDefault();
  }
  async handleAddNewRecord(event) {
    event.preventDefault();

    this.realItemPrice = this.state.isExpense
      ? Math.abs(this.state.itemPrice) * -1
      : Math.abs(this.state.itemPrice);
    const response = await fetch("/records/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body:
        "raidId=" +
        this.state.raidId +
        "&itemName=" +
        this.state.itemName +
        "&price=" +
        this.realItemPrice +
        "&buyerName=" +
        this.state.buyerName +
        "&comment=" +
        this.state.comment
    });
    const data = await response.json();
    var newRecord = this.state.records.slice();
    newRecord.unshift({
      recordId: data,
      buyerName: this.state.buyerName,
      itemName: this.state.itemName,
      amount: this.realItemPrice,
      comment: this.state.comment
    });
    this.setState({
      records: newRecord,
      itemName: "",
      buyerName: "",
      itemPrice: 50,
      comment: "",
      isExpense: false
    });
  }

  toggleGroupModal() {
    const groupModalVisible = !this.state.groupModalVisible;
    this.setState({
      groupModalVisible
    });
  }
  toggleDeleteModal() {
    const deleteModalVisible = !this.state.deleteModalVisible;
    this.setState({
      deleteModalVisible
    });
  }
  toggleGroupCalculateModal() {
    const groupCalculateModalVisible = !this.state.groupCalculateModalVisible;
    this.setState({
      groupCalculateModalVisible
    });
  }
  raiseDeleteModal(id) {
    this.state.recordToDelete = id;
    const deleteModalVisible = !this.state.deleteModalVisible;
    this.setState({
      deleteModalVisible
    });
  }
  async deleteRecord(event) {
    event.preventDefault();
    await fetch("/records/" + this.state.recordToDelete, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "password=" + this.state.recordDeletePassword
    }).then(window.location.reload(false));
  }
  async modifyGroupDetail(event) {
    event.preventDefault();
    await fetch("/raids/" + this.state.raidId + "/updateGroup/", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body:
        "raidPeople=" +
        this.state.groupPeople +
        "&raidSubsidyPeople=" +
        this.state.groupSubsidyPeople +
        "&raidTax=" +
        this.state.groupTax +
        "&password=" +
        this.state.groupPassword
    }).then(window.location.reload(false));
  }
  renderRecordsTable(records) {
    return (
      <>
        <Form onSubmit={e => this.handleAddNewRecord(e)}>
          <Form.Row>
            <Form.Group as={Col} md="3" controlId="validationCustom01">
              <Form.Label>Item Name</Form.Label>
              <Form.Control
                type="text"
                value={this.state.itemName}
                onChange={e => this.handleItemNameChange(e)}
                placeholder="Item Name"
              />
            </Form.Group>
            <Form.Group as={Col} md="2" controlId="validationCustom01">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={this.state.itemPrice}
                onChange={e => this.handlePriceChange(e)}
                placeholder="Item Price"
              />
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="validationCustom01">
              <Form.Label>Buyer Name</Form.Label>
              <Form.Control
                type="text"
                value={this.state.buyerName}
                onChange={e => this.handleBuyerNameChange(e)}
                placeholder="Buyer Name"
              />
            </Form.Group>
            <Form.Group as={Col} md="2" controlId="validationCustom01">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                type="text"
                value={this.state.comment}
                onChange={e => this.handleCommentChange(e)}
                placeholder="Comment"
              />
            </Form.Group>
            <Form.Group as={Col} md="1" controlId="validationCustom01">
              <Form.Label>Expenses?</Form.Label>
              <Form.Check
                type="switch"
                className="pt-1"
                id="price-switch"
                checked={this.state.isExpense}
                onChange={e => this.handleExpenseChange(e)}
                label=""
              />
            </Form.Group>
            <Form.Group as={Col} md="1" controlId="validationCustom01">
              <Button type="submit">Add Record</Button>
            </Form.Group>
          </Form.Row>
        </Form>
        <table className="table table-striped " aria-labelledby="tabelLabel">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Buyer Name</th>
              <th>Price</th>
              <th>Comment</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {records.map(record => (
              <tr key={record.recordId}>
                <td>{record.itemName}</td>
                <td>{record.buyerName}</td>
                <td>{this.colorPrice(record.amount)}</td>
                <td>{record.comment}</td>
                <td className="text-center">
                  <Button
                    variant="secondary"
                    onClick={e => this.raiseDeleteModal(record.recordId)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p hidden>{this.ComputeTotal() * 0.005}</p>
        <Container>
          <Row className="mb-3">
            <Col sm="3">
              <Card>
                <Statistic title="合格人数" value={this.state.groupPeople} />
              </Card>
            </Col>
            <Col sm="3">
              <Card>
                <Statistic
                  title="DPS 人数"
                  value={this.state.groupPeople - this.state.groupSubsidyPeople}
                />
              </Card>
            </Col>
            <Col sm="3">
              <Card>
                <Statistic
                  title="奶坦总数"
                  value={this.state.groupSubsidyPeople}
                />
              </Card>
            </Col>
            <Col sm="3">
              <Card>
                <Statistic title="税率" value={this.state.groupTax} />
              </Card>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col sm="3">
              <Card>
                <Statistic title="总收入" value={this.ComputeTotal()} />
              </Card>
            </Col>
            <Col sm="3">
              <Card>
                <Statistic title="Tax :" value={this.ComputeTax()} />
              </Card>
            </Col>
            <Col sm="3">
              <Card>
                <Statistic title="人均" value={this.ComputeDps()} />
              </Card>
            </Col>
            <Col sm="3">
              <Card>
                <Statistic
                  title="坦克治疗补贴后"
                  value={this.ComputeSubsidy()}
                />
              </Card>
            </Col>
          </Row>
        </Container>
        <Form className="mh-10">
          <Form.Row>
            <Form.Group as={Col} md="11" controlId="wclLinkForm">
              <Form.Label>WCL 链接</Form.Label>
              <Form.Control type="text" value="text link" />
            </Form.Group>
            <Form.Group as={Col} md="1" controlId="wclLinkForm">
              <Button type="submit">Update Link</Button>
            </Form.Group>
          </Form.Row>
        </Form>
        <Row>
          <Button
            className="ml-3 mb-5"
            onClick={this.toggleGroupModal}
            variant="primary"
          >
            团队设定
          </Button>
          <Button
            className="ml-3 mb-5"
            onClick={this.toggleGroupCalculateModal}
            variant="secondary"
          >
            分赃计算器
          </Button>
        </Row>
        <DeleteRecordModal
          isModalShow={this.state.deleteModalVisible}
          toggleModalVisible={this.toggleDeleteModal}
          onModalSubmit={this.deleteRecord}
          handlePasswordChange={this.handleRecordDeletePasswordChange}
        />
        <GroupCalculateModal
          isModalShow={this.state.groupCalculateModalVisible}
          toggleModalVisible={this.toggleGroupCalculateModal}
          dpsWage={this.ComputeDps()}
          residyWage={this.ComputeSubsidy()}
        />
        <Modal
          show={this.state.groupModalVisible}
          onHide={this.toggleGroupModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>Group Setting</Modal.Title>
          </Modal.Header>
          <Form onSubmit={this.modifyGroupDetail}>
            <Modal.Body>
              <Form.Group as={Row} controlId="deletePasswordForm">
                <Form.Label column sm="4">
                  合格人数
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    type="number"
                    value={this.state.groupPeople}
                    onChange={e => this.handleGroupPeopleNumberChange(e)}
                    name="groupPeopleNumber"
                    placeholder="输入合格人数"
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="deletePasswordForm">
                <Form.Label column sm="4">
                  坦奶补贴人数
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    type="number"
                    value={this.state.groupSubsidyPeople}
                    onChange={e => this.handleGroupSubsidyPeopleChange(e)}
                    name="groupSubsidyPeople"
                    placeholder="输入坦克治疗补贴人数"
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="deletePasswordForm">
                <Form.Label column sm="4">
                  Tax
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    type="number"
                    value={this.state.groupTax}
                    onChange={e => this.handleGroupTaxChange(e)}
                    name="groupTax"
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="deletePasswordForm">
                <Form.Label column sm="4">
                  管理密码
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    type="password"
                    onChange={e => this.handleGroupPasswordChange(e)}
                    name="password"
                    placeholder="输入密码"
                  />
                </Col>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.toggleGroupModal}>
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
      this.renderRecordsTable(this.state.records)
    );

    return (
      <div>
        <h1 id="tabelLabel">Raid Details</h1>
        <p />
        {contents}
      </div>
    );
  }

  async populateRecordData(raidId) {
    const response = await fetch("/raids/" + raidId);
    const data = await response.json();
    this.setState({ records: data, loading: false });
    const groupResponse = await fetch("/raids/" + raidId + "/groupSetting");
    const groupData = await groupResponse.json();
    this.setState({
      groupPeople: groupData.raidPeople,
      groupSubsidyPeople: groupData.raidSubsidyPeople,
      groupTax: groupData.raidTax
    });
  }
}
