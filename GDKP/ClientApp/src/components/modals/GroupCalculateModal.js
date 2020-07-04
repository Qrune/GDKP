import React, { Component } from "react";
import "./Button.css";
import { Form, Button, Modal } from "react-bootstrap";
import { Card, Slider, Statistic, InputNumber, Row, Col } from "antd";
import "antd/dist/antd.css";
export class GroupCalculateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dpsNumber: 5,
        residyNumber: 0,
    };
  }
  onDpsNumberChange = value => {
    this.setState({
      dpsNumber: value
    });
  };
  onResidyNumberChange = value => {
    this.setState({
      residyNumber: value
    });
    };
    calculateGroupValue = () => {
        return this.state.dpsNumber * this.props.dpsWage + this.state.residyNumber * this.props.residyWage
    }
  render() {
    return (
      <Modal
        show={this.props.isModalShow}
        onHide={this.props.toggleModalVisible}
      >
        <Modal.Header closeButton>
          <Modal.Title>分赃计算器</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col span={6}>
              <Form.Label>输出人数:</Form.Label>
            </Col>
            <Col span={12}>
              <Slider
                min={0}
                max={5}
                onChange={this.onDpsNumberChange}
                value={
                  typeof this.state.dpsNumber === "number"
                    ? this.state.dpsNumber
                    : 0
                }
              />
            </Col>
            <Col span={4}>
              <InputNumber
                min={0}
                max={5}
                style={{ margin: "0 16px" }}
                value={this.state.dpsNumber}
                onChange={this.onDpsNumberChange}
              />
            </Col>
          </Row>
          <Row className="mt-2">
            <Col span={6}>
              <label>奶坦人数: </label>
            </Col>
            <Col span={12}>
              <Slider
                min={0}
                max={5}
                onChange={this.onResidyNumberChange}
                value={
                  typeof this.state.residyNumber === "number"
                    ? this.state.residyNumber
                    : 0
                }
              />
            </Col>
            <Col span={4}>
              <InputNumber
                min={0}
                max={5}
                style={{ margin: "0 16px" }}
                value={this.state.residyNumber}
                onChange={this.onResidyNumberChange}
              />
            </Col>
          </Row>
          <Row className="mt-2">
            <Col span={12} offset={6}>
              <Card>
                            <Statistic title="小队金额" value={this.calculateGroupValue()} />
              </Card>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.toggleModalVisible}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
