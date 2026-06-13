import { useState } from 'react';
import { registerUser } from '../api/auth';
import {
  useNavigate,
  Link
} from 'react-router-dom';

function Register() {
  const navigate =
    useNavigate();

  const [form, setForm] =
    useState({
      name: '',
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
        await registerUser(
          form
        );

        alert(
          'Registration successful'
        );

        navigate(
          '/login'
        );
      } catch (error) {
        alert(
          error.response?.data
            ?.message ||
            'Registration failed'
        );
      }
    };

  return (
    <div
      style={{
        padding: '40px'
      }}
    >
      <h1>
        Register
      </h1>

      <form
        onSubmit={
          handleSubmit
        }
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={
            handleChange
          }
          required
        />

        <br />
        <br />

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
          Register
        </button>
      </form>

      <p>
        Already have an
        account?{' '}
        <Link to="/login">
          Login
        </Link>
      </p>
    </div>
  );
}

export default Register;