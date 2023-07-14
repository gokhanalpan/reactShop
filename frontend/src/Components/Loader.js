import { Spinner } from "react-bootstrap";

import React from "react";

const Loader = () => {
  return (
    <Spinner
      animation="border"
      role="status"
      style={{
        margin: "auto",
        display: "block",
        width: "100px",
        height: "100px",
      }}
    />
  );
};

export default Loader;
