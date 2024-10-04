import React, { useState } from "react";
import "../../App.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
 
export default function Login() {
    const [empID, setEmpID] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate=useNavigate();
 
    const handleLogin = async () => {
        setLoading(true);
        setError("");
 
        try {
            const response = await fetch("http://localhost:5000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ empID, password }),
            });
 
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("empID",empID);
                toast.success("Logged in Successfully");
                if(empID==="EMP000"){
                    navigate('/employee-courses');
                }
                else{
                    navigate('/userdash');
                }
            } else {
                setError(data.message || "An error occurred. Please try again.");
                toast.error('Error logging in.');
            }
        } catch (error) {
            setError("Error logging in. Please try again later.");
        } finally {
            setLoading(false);
        }
    };
 
    return (
        <section>
            <div className="container">
                <div className="login_1">
                    <h3>Welcome !!</h3>
                    <Link to={'/register'}>
                        <p>Create new account</p>
                    </Link>
                </div>
                <div className="userform">
                    <h3>User Login</h3>
                    <input
                        className="login_input"
                        type="text"
                        placeholder="Employee ID"
                        aria-label="Employee ID"
                        value={empID}
                        onChange={(e) => setEmpID(e.target.value)}
                    />
                    <input
                        className="login_input"
                        type="password"
                        placeholder="Password"
                        aria-label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="submit" type="button" onClick={handleLogin} disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </div>
            </div>
        </section>
    );
}