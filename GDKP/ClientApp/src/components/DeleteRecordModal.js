import React, { Component } from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
export class DeleteRecordModal extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Modal
        show={this.props.isModalShow}
        onHide={this.props.toggleModalVisible}
      >
        <Modal.Header closeButton>
          <Modal.Title>Input Password</Modal.Title>
        </Modal.Header>
        <Form onSubmit={this.props.onModalSubmit}>
          <Modal.Body>
            <Form.Group as={Row} controlId="deletePasswordForm">
              <Form.Label column sm="2">
                Password
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="password"
                  onChange={e => this.props.handlePasswordChange(e)}
                  name="password"
                  placeholder="Enter Password"
                />
              </Col>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.props.toggleModalVisible}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}
