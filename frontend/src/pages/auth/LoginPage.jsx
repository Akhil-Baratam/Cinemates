import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineMail, MdPassword } from "react-icons/md";
import { ChevronLeft } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const LoginPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const baseURL =
  import.meta.env.MODE === "development"
    ? "" // Use proxy in development
    : import.meta.env.VITE_REACT_APP_BACKEND_BASEURL; // Use absolute URL in production

  const {mutate:loginMutation, isPending, isError, error} = useMutation({
    mutationFn: async ({username, password}) => {
      try {
        const res = await fetch(`${baseURL}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({username, password}),
        });

        const data = await res.json();

        if(!res.ok) throw new Error(data.error || "Something went wrong");

      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ querykey: ["authUser"]});
      // toast.success("Login successful");
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
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
        <h1 className="text-3xl font-semibold font-mono text-gray-900 pb-4">
          <span className="font-normal">Welcome back to</span> CINEMATES
        </h1>
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col">
          <div className="flex flex-col mb-4">
            <div className="flex items-center border border-zinc-500 rounded-lg p-2">
              <MdOutlineMail className="text-gray-400 mr-2" />
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
            className="bg-zinc-900 hover:bg-zinc-100 hover:text-black text-white font-bold py-2 px-4 rounded-lg border border-zinc-900"
          >
            {isPending ? "Loading..." : "Login"}
          </button>
          {isError && <p className="text-red-500 mt-4">{error.message}</p>}
        </form>
        <div className="mt-4 flex justify-center gap-4">
          <p className="text-gray-700">{"Don't have an account?"}</p>
          <Link to="/signup">
            <button className="bg-transparent font-semibold hover:underline rounded-lg">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
