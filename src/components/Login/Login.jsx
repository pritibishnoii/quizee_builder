import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import style from "./Style.module.css";
import { server } from "../../App";

// Validation schema with Yup
const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Formik hook
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(`${server}api/user/login`, values);
        console.log(response);

        if (response.data.success) {
          const { token, userId } = response.data;
          localStorage.setItem("token", token);
          localStorage.setItem("userId", userId);
          navigate("/dashboard-page");
          toast.success("Login successful");
        } else {
          toast.error(response.data.error);
        }
      } catch (error) {
        toast.error(error.response?.data?.error || "Internal Server Error");
        console.error(error);
      }
    },
  });

  // Use useEffect to auto-fill email and password if passed from Signup
  useEffect(() => {
    if (location.state) {
      formik.setFieldValue("email", location.state.email || "");
      formik.setFieldValue("password", location.state.password || "");
    }
  }, [location.state, formik.setFieldValue]);

  return (
    <div className={style.login_main}>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label className={style.label}>Email</label>
          <input
            className={`${style.input} ${formik.touched.email && formik.errors.email ? style.error : ""}`}
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            touched={formik.touched.email && formik.errors.email}
            placeholder={formik.touched.email && formik.errors.email ? formik.errors.email : null}
          />

        </div>
        <div>
          <label className={style.label}>Password</label>
          <input
            className={`${style.input} ${formik.touched.password && formik.errors.password ? style.error : ""}`}
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            touched={formik.touched.password && formik.errors.password}
            placeholder={formik.touched.password && formik.errors.password ? formik.errors.password : null}
          />

        </div>
        <div>
          <button
            type="submit"
            className={style.login_btn}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
