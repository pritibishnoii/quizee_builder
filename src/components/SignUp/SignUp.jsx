import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import style from "./Style.module.css";
import { server } from "../../App";

// Validation schema with Yup
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Add loading state

  // Formik hook
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await axios.post(`${server}api/user/signup`, values);
        // Navigate to login with email and password
        navigate("/login", { state: { email: values.email, password: values.password } });
        toast.success("Signup successful!");
      } catch (error) {
        toast.error(error.response?.data?.error || "Internal Server Error");
        console.error("Signup error:", error.response?.data?.error || "Internal Server Error");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className={style.main}>
      <form onSubmit={formik.handleSubmit}>
        <div className={style.fieldWrapper}>
          <label className={style.label}>Name</label>
          <input
            className={`${style.input} ${formik.touched.name && formik.errors.name ? style.error : ""}`}
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            touched={formik.touched.name && formik.errors.name}
            placeholder={formik.touched.name && formik.errors.name ? formik.errors.name : null}
          />
        </div>

        <div className={style.fieldWrapper}>
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

        <div className={style.fieldWrapper}>
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

        <div className={style.fieldWrapper}>
          <label className={style.label}>Confirm Password</label>
          <input
            className={`${style.input} ${formik.touched.confirmPassword && formik.errors.confirmPassword ? style.error : ""}`}
            type="password"
            name="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            touched={formik.touched.confirmPassword && formik.errors.confirmPassword}
            placeholder={formik.touched.confirmPassword && formik.errors.confirmPassword ?
              formik.errors.confirmPassword
              : null}
          />
        </div>

        <button type="submit" className={style.signup_btn} disabled={loading}>
          {loading ? <div className="loader"></div> : " Sign Up  "}
        </button>
      </form>
    </div>
  );
};

export default Signup;
