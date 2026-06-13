import { useState } from 'react';
import { loginUser } from '../api/auth';
import {
  useNavigate,
  Link
} from 'react-router-dom';

function Login() {
  const navigate =
    useNavigate();

  const [form, setForm] =
    useState({
      email: '',
      password: ''
    });

  const handleChange = e => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value
    });
  };

  const handleSubmit =
    async e => {
      e.preventDefault();

      try {
        const response =
          await loginUser(
            form
          );

        localStorage.setItem(
          'token',
          response.data.token
        );

        localStorage.setItem(
          'user',
          JSON.stringify(
            response.data.user
          )
        );

        alert(
          'Login successful'
        );

        navigate('/');
      } catch (error) {
        alert(
          error.response?.data
            ?.message ||
            'Login failed'
        );
      }
    };

  return (
    <div
      style={{
        padding: '40px'
      }}
    >
      <h1>Login</h1>

      <form
        onSubmit={
          handleSubmit
        }
      >
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={
            handleChange
          }
          required
        />

        <br />
        <br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={
            handleChange
          }
          required
        />

        <br />
        <br />

        <button type="submit">
          Login
        </button>
      </form>

      <p>
        No account?{' '}
        <Link to="/register">
          Register
        </Link>
      </p>
    </div>
  );
}

export default Login;