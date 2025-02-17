import React from "react";
import { Accordion } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const FAQPage = () => {
  return (
    <div className="container mt-5">
      <h2>Frequently Asked Questions</h2>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>What is your return policy?</Accordion.Header>
          <Accordion.Body>
            Our return policy allows for returns within 30 days of purchase. Please keep your receipt.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>How do I track my order?</Accordion.Header>
          <Accordion.Body>
            You can track your order using the tracking number provided in your confirmation email.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>Do you ship internationally?</Accordion.Header>
          <Accordion.Body>
            Yes, we ship to most countries worldwide. Shipping fees and delivery times vary by location.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default FAQPage;