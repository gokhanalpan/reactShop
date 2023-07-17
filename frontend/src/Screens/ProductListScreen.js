import React from "react";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useCreateProductMutation,
} from "../slices/productsApiSlice";
import Loader from "../Components/Loader";
import Message from "../Components/Message";
import { Table, Row, Col, Button } from "react-bootstrap";
import { FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { toast } from "react-toastify";

const ProductListScreen = () => {
  const { data: products, refetch, isLoading, isError } = useGetProductsQuery();
  const [deletePrd, { isLoading: deleteLoading, isError: deleteError }] =
    useDeleteProductMutation();
  const [createProduct, { isLoading: createLoading, isError: createError }] =
    useCreateProductMutation();

  const deleteHandler = async (id) => {
    try {
      if (window.confirm("Are you sure ?")) {
        await deletePrd(id);
        refetch();
        toast.success("Product deleted Succesfully");
      } 
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
    console.log("delete ", id);
  };

  const createPrdHandler = async () => {
    try {
      if (window.confirm("Are you sure ?")) {
        await createProduct();
        refetch();
        toast.success("Order Created");
      }
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  console.log(products);
  return (
    <>
      <Row>
        <Col>
          <h2>Products</h2>
        </Col>
        <Col className="text-end">
          <Button
            className="btn btn-sm m-3"
            type="button"
            onClick={createPrdHandler}
          >
            <FaEdit /> Create Product
          </Button>
        </Col>
      </Row>
      {deleteLoading && <Loader />}
      {createLoading && <Loader />}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">{isError}</Message>
      ) : (
        <>
          <Table bordered striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Brand</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products &&
                products.map((prd) => (
                  <tr key={prd._id}>
                    <td>{prd._id}</td>
                    <td>{prd.name}</td>
                    <td>{prd.price}</td>
                    <td>{prd.category}</td>
                    <td>{prd.brand}</td>
                    <td>
                      <LinkContainer to={`/admin/product/${prd._id}/edit`}>
                        <Button>
                          <FaEdit />
                        </Button>
                      </LinkContainer>
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={async () => deleteHandler(prd._id)}
                      >
                        <FaTrash color="white" />
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default ProductListScreen;
