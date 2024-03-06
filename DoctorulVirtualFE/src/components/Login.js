import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert, Button } from "react-bootstrap";
import { useUserAuth } from "../context/UserAuthContext";

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { logIn, user, role } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(usernameOrEmail, password)
    setError("");
    try {

      const loggedInUser = await logIn(usernameOrEmail, password)
      if (loggedInUser.role === "ROLE_ADMIN"){
        navigate("/admin");
      } else {
        navigate("/chat");
      }
      
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="p-4 box" style={{borderRadius: "15px" }}>
        <h2 className="mb-3">Doctorul Virtual Login</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="text"
              placeholder="Email address or username"
              onChange={(e) => setUsernameOrEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <div className="d-grid gap-2">
            <Button variant="primary" type="Submit">
              Log In
            </Button>
          </div>
        </Form>
      </div>
      <div className="p-4 box mt-3 text-center" style={{borderRadius: "15px" }}>
        Nu ai cont? Inregistreaza-te <Link to="/signup">Sign up</Link>
      </div>
    </>
  );
};

export default Login;
