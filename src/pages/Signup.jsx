import {useEffect} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {registerApi} from "../services/operations/authAPI";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";

const signupSchema = z.object({
  firstName: z.string().min(3, "Name should contain at least 3 characters"),
  lastName: z.string().min(3, "Name should contain at least 3 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must have 8 characters")
});

const Signup = () => {
  const token = useSelector(state => state.auth.token);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) navigate("/problems");
  }, [token, navigate]);

  const {register, handleSubmit, formState:{errors}} =
    useForm({resolver:zodResolver(signupSchema)});

  const submitData = async(data) => {
    await registerApi(data, navigate);
  };

  return (
    <div className="w-full flex justify-center items-center mt-20">
      <form
        className="w-full flex flex-col gap-y-6 items-center p-2"
        onSubmit={handleSubmit(submitData)}
      >

        {/* First Name */}
        <div className="w-[35%]">
          <div className="flex justify-between items-center">
            <label className="border border-orange-500 text-orange-500 p-2 rounded-lg w-[20%] text-center">
              First Name
            </label>
            <input
              {...register("firstName")}
              placeholder="Enter first name"
              className="outline-0 bg-orange-300 text-white p-2 rounded-lg w-[70%]"
            />
          </div>
          {errors.firstName && (
            <span className="text-red-500 text-sm mt-1 block">
              {errors.firstName.message}
            </span>
          )}
        </div>

        {/* Last Name */}
        <div className="w-[35%]">
          <div className="flex justify-between items-center">
            <label className="border border-orange-500 text-orange-500 p-2 rounded-lg w-[20%] text-center">
              Last Name
            </label>
            <input
              {...register("lastName")}
              placeholder="Enter last name"
              className="outline-0 bg-orange-300 text-white p-2 rounded-lg w-[70%]"
            />
          </div>
          {errors.lastName && (
            <span className="text-red-500 text-sm mt-1 block">
              {errors.lastName.message}
            </span>
          )}
        </div>

        {/* Email */}
        <div className="w-[35%]">
          <div className="flex justify-between items-center">
            <label className="border border-orange-500 text-orange-500 p-2 rounded-lg w-[20%] text-center">
              Email
            </label>
            <input
              {...register("email")}
              placeholder="Enter Email"
              className="outline-0 bg-orange-300 text-white p-2 rounded-lg w-[70%]"
            />
          </div>
          {errors.email && (
            <span className="text-red-500 text-sm mt-1 block">
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Password */}
        <div className="w-[35%]">
          <div className="flex justify-between items-center">
            <label className="border border-orange-500 text-orange-500 p-2 rounded-lg w-[20%] text-center">
              Password
            </label>
            <input
              {...register("password")}
              placeholder="Enter password"
              className="outline-0 bg-orange-300 text-white p-2 rounded-lg w-[70%]"
            />
          </div>
          {errors.password && (
            <span className="text-red-500 text-sm mt-1 block">
              {errors.password.message}
            </span>
          )}
        </div>

        <button className="bg-yellow-300 p-2 rounded-lg w-[10%]" type="submit">
          Signup
        </button>

      </form>
    </div>
  );
};

export default Signup;
