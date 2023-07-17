import React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Message from "../Components/Message";
import Loader from "../Components/Loader";
import FormContainer from "../Components/FormContainer";
import {
  useUpdateProductMutation,
  useGetProductDetailsQuery,
  useUploadProductImageMutation,
} from "../slices/productsApiSlice";
import { toast } from "react-toastify";

const ProductEditScreen = () => {
  const { id: productId } = useParams();

  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    isError,
  } = useGetProductDetailsQuery(productId);

  const [updateOrder, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  const [uploadImage, { isLoading: loadingImage }] =
    useUploadProductImageMutation();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setBrand(product.brand);
      setPrice(product.price);
      setDescription(product.description);
      setCountInStock(product.countInStock);
      setCategory(product.category);
      setBrand(product.brand);
      setImage(product.image);
    }
  }, [product]);

  const updateSubmit = async (e) => {
    e.preventDefault();
    console.log("update");
    const updatedProduct = {
      _id: productId,
      name,
      brand,
      price,
      category,
      description,
      countInStock,
      image,
    };

    try {
      await updateOrder(updatedProduct);
      refetch();
      toast.success("Product Updated Successfully");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };
  const imageHandler = async (e) => {
    console.log(e.target.files[0]);
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const response = await uploadImage(formData).unwrap();
      toast.success(response.message);
      setImage(response.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <>
      <Link to="/admin/productList" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h2>Edit Product</h2>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <Message variant="danger">{isError}</Message>
        ) : (
          <Form onSubmit={updateSubmit}>
            <Form.Group className="my-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Name"
              />
            </Form.Group>
            <Form.Group className="my-2">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Enter Brand"
              />
            </Form.Group>
            <Form.Group className="my-2">
              <Form.Label>Category</Form.Label>
              <Form.Control
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Enter Category"
              />
            </Form.Group>

            <Form.Group className="my-2">
              <Form.Label>Image</Form.Label>
              <Form.Control
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Enter Image URL"
              />
              <Form.Control
                type="file"
                onChange={imageHandler}
                placeholder="Enter Image URL"
              />
            </Form.Group>

            <Form.Group className="my-2">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter Price"
              />
            </Form.Group>
            <Form.Group className="my-2">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type="number"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
                placeholder="Enter Count In Stock"
              />
            </Form.Group>
            <Form.Group className="my-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter Description"
              />
            </Form.Group>
            <Button type="submit">Update</Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
