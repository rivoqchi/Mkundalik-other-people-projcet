import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const Application = () => {
    const [formData, setFormData] = useState({
        option: '',
        text: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log(formData);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formSelect">
                <Form.Label>Select Option</Form.Label>
                <Form.Control as="select" name="option" value={formData.option} onChange={handleChange}>
                    <option value="">Choose...</option>
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                </Form.Control>
            </Form.Group>

            <Form.Group controlId="formTextarea">
                <Form.Label>Textarea</Form.Label>
                <Form.Control as="textarea" rows={3} name="text" value={formData.text} onChange={handleChange} />
            </Form.Group>

            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    );
};

export default Application;