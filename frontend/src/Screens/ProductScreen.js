import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, FormGroup } from "react-bootstrap";
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
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../slices/productsApiSlice";
import Loader from "../Components/Loader";
import Message from "../Components/Message";
import { addToCart } from "../slices/cartSlice";
import { toast } from "react-toastify";
// import products from "../products";

const ProductScreen = () => {
  const { id: productId } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  const {
    data: prd,
    refetch,
    isLoading,
    isError,
  } = useGetProductDetailsQuery(productId);

  const [createReview, { isLoading: reviewLoading }] =
    useCreateReviewMutation();

  const addToCartHandler = (e) => {
    // prd.qty = qty;
    dispatch(addToCart({ ...prd, qty }));
    navigate("/cart");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({ productId, comment, rating }).unwrap();
      refetch();
      toast.success("Review Added");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
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
          <Row>
            <Col md={6}>
              <h2 className="review">Reviews</h2>
              {prd.reviews.length === 0 && <Message>No Reviews</Message>}
              <ListGroup variant="flush">
                {prd.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>Write a Review</h2>
                  {reviewLoading && <Loader />}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <FormGroup id="rating">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as="select"
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                        >
                          <option value="">Select</option>
                          <option value={1}>1- Poor</option>
                          <option value={2}>2- Fair</option>
                          <option value={3}>3- Good</option>
                          <option value={4}>4- Very Good</option>
                          <option value={5}>5- Excellent</option>
                        </Form.Control>
                      </FormGroup>
                      <FormGroup controlId="comment" className="my-2">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows="3"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </FormGroup>
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={reviewLoading}
                      >
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link to="/login">login</Link> to write a review{" "}
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
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
