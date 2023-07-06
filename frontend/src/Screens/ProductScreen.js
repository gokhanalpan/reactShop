import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
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
// import products from "../products";

const ProductScreen = () => {
  const [prd, setPrd] = useState({});
  const { id: productId } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {

      const { data } = await axios.get(`/api/products/${productId}`);
      setPrd(data);
    };
    fetchProduct();
  }, [productId]);
  // const prd = products.find((p) => p._id === productId);

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
      <Row>
        <Col md={5}>
          <Image src={ prd.image } alt={prd.image} fluid />
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
              <ListGroupItem>
                <Button
                  className="btn-block"
                  type="button"
                  disabled={prd.countInStock === 0}
                >
                  Add to Cart
                </Button>
              </ListGroupItem>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ProductScreen;
