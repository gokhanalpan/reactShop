import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Form } from "react-bootstrap";
import {
  Button,
  Row,
  Col,
  ListGroup,
  Card,
  Image,
  ListGroupItem,
} from "react-bootstrap";
import Rating from "../Components/Rating";
import { useGetProductDetailsQuery } from "../slices/productsApiSlice";
import Loader from "../Components/Loader";
import Message from "../Components/Message";
import { addToCart } from "../slices/cartSlice";
// import products from "../products";

const ProductScreen = () => {
  const { id: productId } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [qty, setQty] = useState(1);
  const {
    data: prd,
    isLoading,
    isError,
  } = useGetProductDetailsQuery(productId);

  const addToCartHandler = (e) => {
    // prd.qty = qty;
    dispatch(addToCart({ ...prd, qty }));
    navigate("/cart");
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data?.message || isError.error}
        </Message>
      ) : (
        <>
          <Row>
            <Col md={5}>
              <Image src={prd.image} alt={prd.image} fluid />
            </Col>
            <Col md={4}>
              <ListGroup variant="flush">
                <ListGroupItem>{prd.name}</ListGroupItem>
                <ListGroupItem>
                  <Rating
                    value={prd.rating}
                    text={`${prd.numReviews} reviews`}
                  ></Rating>
                </ListGroupItem>
                <ListGroupItem>Price : ${prd.price}</ListGroupItem>
                <ListGroupItem>Description : {prd.description}</ListGroupItem>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup>
                  <ListGroupItem>
                    <Row>
                      <Col>Price :</Col>
                      <Col>
                        <strong>${prd.price}</strong>
                      </Col>
                    </Row>
                  </ListGroupItem>
                  <ListGroupItem>
                    <Row>
                      <Col>Stok :</Col>
                      <Col>
                        <strong>{prd.countInStock}</strong>
                      </Col>
                    </Row>
                  </ListGroupItem>
                  {prd.countInStock > 0 && (
                    <ListGroupItem>
                      <Row>
                        <Col>Qty</Col>
                        <Col>
                          <Form.Control
                            value={qty}
                            as="select"
                            onChange={(e) => setQty(Number(e.target.value))}
                          >
                            {[...Array(prd.countInStock).keys()].map((x) => (
                              <option key={x + 1} value={x + 1}>
                                {x + 1}
                              </option>
                            ))}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroupItem>
                  )}
                  <ListGroupItem>
                    <Button
                      className="btn-block"
                      type="button"
                      disabled={prd.countInStock === 0}
                      onClick={addToCartHandler}
                    >
                      Add to Cart
                    </Button>
                  </ListGroupItem>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
    </>
  );
};

export default ProductScreen;
