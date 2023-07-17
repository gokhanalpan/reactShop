import React from "react";
import { useGetAllOrdersQuery } from "../slices/ordersApiSlice";
import Loader from "../Components/Loader";
import Message from "../Components/Message";
import { Table, Button } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import { LinkContainer  } from "react-router-bootstrap";

const OrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetAllOrdersQuery();
  console.log(orders);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Order Date</th>
              <th>User</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Delivered</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index}>
                <td>{order._id}</td>
                <td>{order.createdAt.substr(0, 10)}</td>
                <td>{order.user._id}</td>
                <td>${order.totalPrice}</td>
                <td>
                  {order.isPaid ? order.paidAt.substr(0, 10) : <FaTimes />}
                </td>
                <td>
                  {order.isDelivered ? (
                    order.deliveredAt.substr(0, 10)
                  ) : (
                    <FaTimes style={{ color: "red" }} />
                  )}
                </td>
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
    </>
  );
};

export default OrderListScreen;
