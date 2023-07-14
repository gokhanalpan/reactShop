import React from "react";
import { useState, useEffect } from "react";
import FormContainer from "../Components/FormContainer";
import { Form, Button } from "react-bootstrap";
import { saveShippingAddress } from "../slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../Components/CheckoutSteps";

const ShippingScreen = () => {
  const { shippingAddress } = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [postal, setPostal] = useState(shippingAddress?.postal || "");
  const [country, setCountry] = useState(shippingAddress?.country || "");

  const shippingSubmitHandler = (e) => {
    e.preventDefault();
    const addressObj = {
      address,
      city,
      postal,
      country,
    };

    dispatch(saveShippingAddress(addressObj));

    navigate("/payment");
  };

  return (
    <FormContainer>
        <CheckoutSteps step1 step2/>
      <h1>Shipping</h1>
      <Form onSubmit={shippingSubmitHandler}>
        <Form.Group controlId="address" className="my-3">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="enter address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="city" className="my-3">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            placeholder="enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="postal" className="my-3">
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            type="text"
            placeholder="enter postal code"
            value={postal}
            onChange={(e) => setPostal(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="country" className="my-3">
          <Form.Label>Country</Form.Label>
          <Form.Control
            type="text"
            placeholder="enter Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button
          type="submit"
          variant="primary"
          className="mt-2"
          //   disabled={isLoading}
        >
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingScreen;
