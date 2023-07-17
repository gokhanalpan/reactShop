import React from "react";
import { useGetAllUsersQuery } from "../slices/usersApiSlice";
import { Button, Table } from "react-bootstrap";
import Loader from "../Components/Loader";
import Message from "../Components/Message";
import { FaTimes, FaCheck, FaEdit, FaTrash } from "react-icons/fa";

const UserListScreen = () => {
  const { data: users, isLoading, isError } = useGetAllUsersQuery();
  console.log(users);

  const userDetails = (id) => {
    console.log(id);
  };
  return (
    <>
      <h2>Users</h2>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message>{isError}</Message>
      ) : (
        <Table bordered hover responsive striped>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Is Admin</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {user.isAdmin ? (
                    <FaCheck color="green" />
                  ) : (
                    <FaTimes color="red" />
                  )}
                </td>
                <td>
                  <Button onClick={() => userDetails(user._id)}>
                    <FaEdit />
                  </Button>
                </td>
                <td>
                  <Button variant="danger">
                    <FaTrash color="white" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default UserListScreen;
