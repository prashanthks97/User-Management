import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Container, Button } from "@mui/material";
import styles from "./App.module.css";

function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    mobileNumber: "",
    email: "",
    dateOfBirth: null,
    dateOfJoining: null,
    description: "",
    role: "",
    department: "",
  });

  const [emailError, setEmailError] = useState(" ");
  const [mobileNumberError, setMobileNumberError] = useState("");

  useEffect(() => {}, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error Fetching Users: ", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleDateChange = (date, name) => {
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: date,
    }));
  };

  const handleRoleChange = (selectedOption) => {
    setNewUser((prevUser) => ({
      ...prevUser,
      role: selectedOption.value,
    }));
  };

  const handleSubmit = async () => {
    if (!isValidEmail(newUser.email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (!isValidMobileNumber(newUser.mobileNumber)) {
      setMobileNumberError("Please enter a valid 10-digit mobile number");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users",
        newUser
      );
      setUsers((prevUsers) => [...prevUsers, response.data]);
      setNewUser({
        name: "",
        mobileNumber: "",
        email: "",
        dateOfBirth: null,
        dateOfJoining: null,
        description: "",
        role: "",
        department: "",
      });
    } catch (error) {
      console.error("Error adding user: ", error);
    }
  };

  // const addUser = async () => {
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:5000/api/users",
  //       newUser
  //     );
  //     setUsers((prevUsers) => [...prevUsers, response.data]);
  //     setNewUser({ name: "", email: "" });
  //   } catch (error) {
  //     console.error("Error adding user: ", error);
  //   }
  // };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidMobileNumber = (number) => {
    return /^\d{10}$/.test(number);
  };

  return (
    <>
      <Container maxWidth="sm" className={styles.container}>
        <h1>User Management</h1>
        <div className={styles.formGroup}>
          <TextField
            type="text"
            label="Name"
            name="name"
            value={newUser.name}
            onChange={handleInputChange}
            className={styles.inputField}
            fullWidth
            margin="normal"
          />
          <TextField
            type="tel"
            label="Mobile"
            name="mobileNumber"
            value={newUser.mobileNumber}
            onChange={handleInputChange}
            error={!!mobileNumberError}
            helperText={mobileNumberError}
            className={styles.inputField}
            fullWidth
            margin="normal"
          />
          <TextField
            type="email"
            label="Email"
            name="email"
            value={newUser.email}
            onChange={handleInputChange}
            error={!!emailError}
            helperText={emailError}
            className={styles.inputField}
            fullWidth
            margin="normal"
          />
          <div className={styles.formGroup}>
            <label className={styles.label}>Date of Birth:</label>{" "}
            <DatePicker
              selected={newUser.dateOfBirth}
              onChange={(date) => handleDateChange(date, "dateOfBirth")}
              className={styles.datePicker}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Date of Joining:</label>{" "}
            <DatePicker
              selected={newUser.dateOfJoining}
              onChange={(date) => handleDateChange(date, "dateOfJoining")}
              className={styles.datePicker}
            />
          </div>
          <TextField
            label="Description"
            name="description"
            value={newUser.description}
            onChange={handleInputChange}
            className={styles.inputField}
            fullWidth
            margin="normal"
          />
          <label className={styles.label}>Role:</label>{" "}
          <Select
            options={[
              { value: "admin", label: "Admin" },
              { value: "user", label: "User" },
            ]}
            value={
              newUser.role ? { value: newUser.role, label: newUser.role } : null
            }
            onChange={handleRoleChange}
            className={styles.inputField}
          />
          <Autocomplete
            options={[
              "IT",
              "FINANCE",
              "HR",
              "BM",
              "ACCOUNTS",
              "SERVICE",
              "COMPLAINT",
            ]}
            value={newUser.department}
            onChange={(event, newValue) => {
              setNewUser((prevUser) => ({
                ...prevUser,
                department: newValue,
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Department"
                margin="normal"
                fullWidth
              />
            )}
            className={styles.inputField}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSubmit}
            className={styles.button}
          >
            Add User
          </Button>
        </div>
        <br />
        <div>
          <Button
            variant="contained"
            color="secondary"
            onClick={fetchUsers}
            className={styles.button}
          >
            Fetch and Display Users
          </Button>
          <h2>Users</h2>

          <ul>
            {users.map((user) => (
              <li key={user.id}>
                {user.name} - {user.email}{" "}
                <button onClick={() => deleteUser(user.id)}>Delete</button>
              </li>
            ))}
          </ul>

          <ul>
            {users.map((user) => (
              <li key={user.id}>
                Name: {user.name}, Mobile Number: {user.mobileNumber}, Email:{" "}
                {user.email}, Date of Birth: {user.dateOfBirth}, Date of
                Joining: {user.dateOfJoining}, Description: {user.description},
                Role: {user.role}, Department: {user.department}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </>
  );
}

export default App;
