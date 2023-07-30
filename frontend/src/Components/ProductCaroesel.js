import React from "react";
import { useGetToproductsQuery } from "../slices/productsApiSlice";
import { Link } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";
import Loader from "./Loader";
import Message from "./Message";

const ProductCaroesel = () => {
  const { data: products, isLoading, isError } = useGetToproductsQuery();

  return isError ? (
    <Message variant="danger">{isError}</Message>
  ) : (
    <Carousel pause="hover"  className="bg-primary mb-4">
      {products.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/product/${product._id}`}>
            <Image src={product.image} alt="" />
            <Carousel.Caption className="carousel-caption">
              <h2>
                {product.name} - (${product.price})
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCaroesel;
