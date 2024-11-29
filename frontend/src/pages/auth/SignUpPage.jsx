import { Link } from "react-router-dom";
import { useState } from "react";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { ChevronLeft } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });

const queryClient = useQueryClient();

 const {mutate, isError, isPending, error} =  useMutation({
  mutationFn: async({email, username, fullName, password}) => {
    try {
      const res = await fetch("api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, fullName, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  onSuccess: () => {
    toast.success("Account created successfully!");
  }
 });

  const handleSubmit = (e) => {
    e.preventDefault(); //page wont reload
    mutate(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-zinc-800">
      <div className="max-w-md w-full mx-auto py-16 px-8 bg-white rounded-md shadow-md relative">
        <Link to="/" className="absolute flex items-center top-4 right-4">
          <ChevronLeft className="w-4 text-gray-800" /> Home
        </Link>
        <h1 className="text-3xl font-semibold font-mono text-gray-900 pb-4"><span className=" font-normal">Join</span> CINEMATES</h1>
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col ">
          <div className="flex flex-col mb-4">
            <div className="flex items-center border border-zinc-500 rounded-lg p-2">
              <MdOutlineMail className="text-gray-400 mr-2" />
              <input
                type="email"
                className="w-full p-1 text-gray-700 focus:outline-none"
                placeholder="Email"
                name="email"
                onChange={handleInputChange}
                value={formData.email}
              />
            </div>
          </div>
          <div className="flex flex-col mb-4">
            <div className="flex items-center border border-zinc-500 rounded-lg p-2">
              <FaUser className="text-gray-400 mr-2" />
              <input
                type="text"
                className="w-full p-1 text-gray-700 focus:outline-none"
                placeholder="Username"
                name="username"
                onChange={handleInputChange}
                value={formData.username}
              />
            </div>
          </div>
          <div className="flex flex-col mb-4">
            <div className="flex items-center border border-zinc-500 rounded-lg p-2">
              <MdDriveFileRenameOutline className="text-gray-400 mr-2" />
              <input
                type="text"
                className="w-full p-1 text-gray-700 focus:outline-none"
                placeholder="Full Name"
                name="fullName"
                onChange={handleInputChange}
                value={formData.fullName}
              />
            </div>
          </div>
          <div className="flex flex-col mb-4">
            <div className="flex items-center border border-zinc-500 rounded-lg p-2">
              <MdPassword className="text-gray-400 mr-2" />
              <input
                type="password"
                className="w-full p-1 text-gray-700 focus:outline-none"
                placeholder="Password"
                name="password"
                onChange={handleInputChange}
                value={formData.password}
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-zinc-900 hover:bg-zinc-600 hover:text-black text-white font-bold py-2 px-4 rounded-lg border border-zinc-900"
          >
            {isPending ? "Loading..." : "Sign up"}
          </button>
          {isError && <p className="text-red-500 mt-4">{error.message}</p>}
        </form>
        <div className="mt-4 flex justify-center gap-4">
          <p className="text-gray-700">Already have an account?</p>
          <Link to="/login">
            <button
              className="bg-transparent font-semibold hover:underline rounded-lg"
            >
              Sign in
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;