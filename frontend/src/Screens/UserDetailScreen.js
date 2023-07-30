import React, { useState, useEffect } from "react";
import Loader from "../Components/Loader";
import Message from "../Components/Message";
import { Form, Button, Table, FormGroup } from "react-bootstrap";
import {
  useGetUserByIdQuery,
  useUpdateUserByIdMutation,
} from "../slices/usersApiSlice";
import { useParams, Link } from "react-router-dom";
import FormContainer from "../Components/FormContainer";
import { toast } from "react-toastify";

const UserDetailScreen = () => {
  const id = useParams();

  const { data: user, refetch, isLoading, isError } = useGetUserByIdQuery(id);

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  const [updateUser, { isLoading: updateLoading, isError: updateError }] =
    useUpdateUserByIdMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        _id: user._id,
        name,
        email,
        isAdmin,
      };
   
      await updateUser(userData);
      refetch();
      toast.success("user Updated Successfully");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const isAdminChangeHandler = (e) => {
    setIsAdmin(e.target.checked);
  };
  return (
    <>
      <Link className="btn btn-light" to={`/admin/userList`}>
        Back
      </Link>
      {updateLoading && <Loader/>}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message>{isError}</Message>
      ) : (
        <FormContainer>
          <Form onSubmit={submitHandler}>
            <Form.Group className="my-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="my-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="my-2">
              <Form.Check
                id="isAdmin"
                type="checkbox"
                name="admin"
                label="Is Admin"
                checked={isAdmin}
                onChange={isAdminChangeHandler}
              />
            </Form.Group>
            <Button type="submit">Update</Button>
          </Form>
        </FormContainer>

      )}
    </>
  );
};

export default UserDetailScreen;
