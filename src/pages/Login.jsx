import {useEffect} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {loginApi} from "../services/operations/authAPI";
import {useNavigate} from "react-router-dom";
import {useSelector,useDispatch} from "react-redux";

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must have 8 characters")
});

const Login = () => {
  const token = useSelector(state => state.auth.token);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) navigate("/problems");
  }, [token, navigate]);

  const {register, handleSubmit, formState:{errors}} =
    useForm({resolver:zodResolver(loginSchema)});

  const submitData = async(data) => {
    await loginApi(data, navigate, dispatch);
  };

  return (
    <div className="w-full flex justify-center items-center mt-20">
      <form
        className="w-full flex flex-col gap-y-6 items-center p-2"
        onSubmit={handleSubmit(submitData)}
      >

        {/* Email */}
        <div className="w-[35%]">
          <div className="flex justify-between items-center">
            <label className="border border-orange-500 text-orange-500 p-2 rounded-lg w-[20%] text-center">
              Email
            </label>
            <input
              {...register("email")}
              placeholder="Enter Email"
              className="outline-0 bg-orange-300 p-2 rounded-lg text-white w-[70%]"
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
              className="outline-0 bg-orange-300 p-2 rounded-lg text-white w-[70%]"
            />
          </div>
          {errors.password && (
            <span className="text-red-500 text-sm mt-1 block">
              {errors.password.message}
            </span>
          )}
        </div>

        <button className="bg-yellow-300 p-2 rounded-lg w-[10%]" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
