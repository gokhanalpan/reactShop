import React, { useEffect } from "react";
import { Row, Col, Button, Image, ListGroup, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  useGetOrderByIdQuery,
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
} from "../slices/ordersApiSlice";
import { Link, useParams } from "react-router-dom";
import Loader from "../Components/Loader";
import Message from "../Components/Message";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

const OrderScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const { id: orderId } = useParams();
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderByIdQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const {
    data: paypal,
    isLoading: loadingPayPal,
    isError: errorPayPal,
  } = useGetPayPalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPayPalScript();
        }
      }
    }
  }, [order, paypal, errorPayPal, paypalDispatch, loadingPayPal]);

  const approveTest = async () => {
    await payOrder({ orderId, detail: { payer: {} } });
    refetch();
    toast.success("payment ok");
  };
  const onApprove = (data, actions) => {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Payment successfull");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    });
  };
  const onError = (error) => {
    toast.error(error.message);
  };
  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: order.totalPrice,
            },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  };

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger" />
      ) : (
        <>
          <h1>Order : {order._id}</h1>
          <Row>
            <Col md={8}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>Shipping</h2>
                  <p>
                    <strong>Name: </strong>
                    {userInfo.name}
                  </p>

                  <p>
                    <strong> Email: </strong>
                    {userInfo.email}
                  </p>
                  <p>
                    <strong>Shipping Address :</strong>
                    {order.shippingAddress.address}-
                    {order.shippingAddress.postal} -{" "}
                    {order.shippingAddress.country}
                  </p>
                  {order.isDelivered ? (
                    <Message variant="success">
                      Delivered At : {order.deliveredAt}
                    </Message>
                  ) : (
                    <Message variant="danger">Not Delivered</Message>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <h2>Payment Method</h2>
                  <p>{order.paymentMethod}</p>
                  {order.isPaid ? (
                    <Message variant="success">Paid At :{order.paidAt}</Message>
                  ) : (
                    <Message variant="danger">Not Paid</Message>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <h2>Order Items</h2>
                  {order.orderItems.map((orderx, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={2}>
                          <Image src={orderx.image} fluid rounded />
                        </Col>
                        <Col>
                          <Link to={`/product/${orderx.product}`}>
                            {orderx.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {orderx.qty} X ${orderx.price} =$
                          {orderx.qty * orderx.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={4}>
              <Card>
                <ListGroup>
                  <ListGroup.Item>
                    <h2>Order Summary</h2>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Items:</Col>
                      <Col>${order.itemsPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Shipping:</Col>
                      <Col>${order.shippingPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Tax:</Col>
                      <Col>${order.taxPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <Card.Footer className="p-0">
                    <ListGroup.Item>
                      <Row>
                        <Col>
                          {" "}
                          <strong> Total</strong>
                        </Col>
                        <Col>
                          <strong> ${order.totalPrice}</strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  </Card.Footer>
                  {!order.isPaid && (
                    <ListGroup.Item>
                      {loadingPay && <Loader />}
                      {isPending ? (
                        <Loader />
                      ) : (
                        <div>
                          <Button
                            onClick={approveTest}
                            style={{ marginBottom: "10px" }}
                          >
                            Test Pay Order
                          </Button>
                          <div>
                            <PayPalButtons
                              createOrder={createOrder}
                              onApprove={onApprove}
                              onError={onError}
                            ></PayPalButtons>
                          </div>
                        </div>
                      )}
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default OrderScreen;
