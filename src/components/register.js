import React, { useState } from "react";
import "../App.css";
import {  useNavigate } from "react-router-dom";
 
export default function Register() {
    const [empID, setEmpID] = useState("");
    const [name, setName] = useState("");
    const [designation, setDesignation] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
 
    const handleRegister = async () => {
        setLoading(true);
        setError("");
 
        try {
            const response = await fetch("http://localhost:5000/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ empID, name, designation, password, email, mobile }),
            });
 
            const data = await response.json();
 
            if (response.ok) {
                alert("Registration successful");
                navigate("/");
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError("Error registering. Please try again later.");
        } finally {
            setLoading(false);
        }
    };
 
    return (
        <section>
            <div className="container">
                <div className="login_1">
                    <h3>Welcome !!</h3>
                    <p>Register Yourself</p>
                </div>
                <div className="userform">
                    <h3>Registration Form</h3>
                    {error && <p className="error">{error}</p>}
                    <label htmlFor="empID" className="register_label">Employee ID</label>
                    <input
                        id="empID"
                        className="register_input"
                        type="text"
                        placeholder="Enter employee ID"
                        value={empID}
                        onChange={(e) => setEmpID(e.target.value)}
                    />
                    <label htmlFor="name" className="register_label">Name</label>
                    <input
                        id="name"
                        className="register_input"
                        type="text"
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <label htmlFor="designation" className="register_label">Designation</label>
                    <input
                        id="designation"
                        className="register_input"
                        type="text"
                        placeholder="Enter designation"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                    />
                    <label htmlFor="password" className="register_label">Password</label>
                    <input
                        id="password"
                        className="register_input"
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label htmlFor="email" className="register_label">Email address</label>
                    <input
                        id="email"
                        className="register_input"
                        type="text"
                        placeholder="Enter email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="mobile" className="register_label">Mobile</label>
                    <input
                        id="mobile"
                        className="register_input"
                        type="text"
                        placeholder="Enter mobile number"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                    />
                    <button className="submit" type="button" onClick={handleRegister} disabled={loading}>
                        {loading ? "Registering..." : "Register"}
                    </button>
                </div>
            </div>
        </section>
    );
}