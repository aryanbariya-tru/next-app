"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IUser, ICreateUserPayload } from "@/app/types/user";

const DashBoard: React.FC = () => {
  const [formData, setFormData] = useState<ICreateUserPayload>({
    name: "",
    email: "",
    role: "",
    createdBy: "",
  });

  const [users, setUsers] = useState<IUser[]>([]);
  const [message, setMessage] = useState("");

  // const fetchUsers = async () => {
  //   try {
  //     const storedUser = localStorage.getItem("user");
  //     const loggedUser = storedUser ? JSON.parse(storedUser) : null;

  //     const res = await fetch("/api/auth/create", {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "logged-email": loggedUser?.email || "",
  //         "logged-role": loggedUser?.role || "",
  //       },
  //     });

  //     if (!res.ok) {
  //       return console.log("No-one is logged-in");
  //     }

  //     const data: IUser[] = await res.json();
  //     setUsers(data);
  //   } catch (error) {
  //     console.error("Error fetching users:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchUsers();
  // }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Registering...");

    // const storedUser = localStorage.getItem("user");
    // const loggedUser = storedUser ? JSON.parse(storedUser) : null;

    // if (!loggedUser?.email) {
    //   setMessage("❌ No logged-in user found!");
    //   return;
    // }

    // const payload: ICreateUserPayload = { ...formData, createdBy: loggedUser.email };

    // const res = await fetch("/api/auth/create", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // });

    // const data = await res.json();

    // if (res.ok) {
    //   setMessage("✅ Registration successful!");
    //   setFormData({ name: "", email: "", role: "student", createdBy: "" });
    //   fetchUsers();
    // } else {
    //   setMessage(`❌ ${data.error || "Something went wrong"}`);
    // }
  };

  const handleLogout = () => {
    // localStorage.removeItem("user");
    // fetchUsers();
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 font-sans">
      <div className="bg-blue-500 h-22 w-full flex items-center justify-between p-2">
        <h1 className="font-bold text-white text-3xl">Dashboard</h1>
        <h1 className="font-bold text-white text-3xl">School-login creation</h1>
        <div className="flex space-x-4">
          <Link href="login">
            <button className="bg-green-600 text-white font-bold text-xl p-2 rounded-xl">Login</button>
          </Link>
          <button
            className="bg-red-600 text-white font-bold text-xl p-2 rounded-xl"
            onClick={handleLogout}
            
          >
            Logout
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
        <input name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
        <input name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
        <select name="role" value={formData.role} onChange={handleChange} required>
          <option value="" disabled>Select Role</option>
          <option value="principal">Principal</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg">Add</button>
      </form>

      <p className="mt-2">{message}</p>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4 w-full max-w-5xl">
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          users.map((user) => (
            <div key={user._id} className="bg-white shadow-md rounded-xl p-5 border border-gray-200">
              <h2 className="text-xl font-semibold text-blue-700">{user.name}</h2>
              <p>📧 {user.email}</p>
              <p>🎓 Role: {user.role}</p>
              <p>👤 Created by: {user.createdBy || "Unknown"}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashBoard;
