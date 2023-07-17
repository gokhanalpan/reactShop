import React, { useState, useEffect } from "react";
import { Table, Form, Button, Row, Col, FormGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { toast } from "react-toastify";
import Message from "../Components/Message";
import Loader from "../Components/Loader";
import { useProfileMutation } from "../slices/usersApiSlice";
import { useGetMyOrdersQuery } from "../slices/ordersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { FaTimes } from "react-icons/fa";

const ProfileScreen = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const [updateProfile, { isLoading: updateProfileLoading }] =
    useProfileMutation();

  const {
    data: myOrders,
    isLoading: ordersLoading,
    isError: ordersError,
  } = useGetMyOrdersQuery();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          name,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials(res));
        toast.success("Profile updated successfully");
      } catch (error) {
        toast.error(error.error || error?.data?.message);
      }
    }
  };

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
        <Form onSubmit={submitHandler}>
          <FormGroup controlId="name" className="my-2">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Name"
            />
          </FormGroup>
          <FormGroup controlId="email" className="my-2">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
            />
          </FormGroup>
          <FormGroup controlId="password" className="my-2">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
            />
          </FormGroup>
          <FormGroup controlId="confirmPassword" className="my-2">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
            />
          </FormGroup>
          <Button type="submit" className="my-2" variant="primary">
            Update
          </Button>
          {updateProfileLoading && <Loader />}
        </Form>
      </Col>
      <Col md={9}>
        <h2>Order History</h2>
        {ordersLoading ? (
          <Loader />
        ) : ordersError ? (
          <Message>{ordersError?.data?.message || ordersError.error}</Message>
        ) : (
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Delivered</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {myOrders.map((order, index) => (
                <tr key={index}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substr(0, 10)}</td>
                  <td>{order.totalPrice}</td>
                  {order.isPaid ? (
                    <td>{order.paidAt.substr(0, 10)}</td>
                  ) : (
                    <td>
                      <FaTimes style={{ color: "red" }} />
                    </td>
                  )}
                  {order.isDelivered ? (
                    <td>{order.deliveredAt.substr(0, 10)}</td>
                  ) : (
                    <td>
                      <FaTimes style={{ color: "red" }} />
                    </td>
                  )}
                  <td>
                    <LinkContainer to={`/orders/${order._id}`}>
                      <Button className="btn-sm">Details</Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};

export default ProfileScreen;
