import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import { toast } from "react-toastify";


const RecruiterLogin = () => {
  const navigate = useNavigate()

  const [state, setState] = useState("Login");

  const [name, setName] = useState("");

  const [password, setPassword] = useState("");

  const [email, setEmail] = useState("");

  const [image, setImage] = useState(false);

  const [isTextDataSubmitted, setIsTextDataSubmitted] = useState(false);

  //When we click on cross(X) our pop up closes
  const {setShowRecruiterLogin, backendUrl, setCompanyToken, setCompanyData} = useContext(AppContext)

  //When we click on login or sign up page shoul not get refresh
  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if(state == 'Sign up' && !isTextDataSubmitted){
      return setIsTextDataSubmitted(true)
    } 

    try {
      
      if (state == 'Login') {
        
        const {data} = await axios.post(backendUrl + '/api/company/login', {email, password})
        
        if(data.success){
          setCompanyData(data.commpany)
          setCompanyToken(data.token)
          localStorage.setItem('companyToken', data.token)
          setShowRecruiterLogin(false)
          navigate('/dashboard')
        }else{
          toast.error(data.message)
        }
      }else{
        const formData = new FormData()
        formData.append('name', name)
        formData.append('password', password)
        formData.append('email', email)
        formData.append('image', image)

        const {data} = await axios.post(backendUrl + '/api/company/register', formData)

        if (data.success) {
          setCompanyData(data.commpany)
          setCompanyToken(data.token)
          localStorage.setItem('companyToken', data.token)
          setShowRecruiterLogin(false)
          navigate('/dashboard')
        }else{
          toast.error(data.message)
        }
      }
    } catch (error) {
        toast.error(error.message)
    }
  }

  //So that when recruiter login pops up we can't scroll the screen
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/20 flex justify-center items-center">
      <form onSubmit={onSubmitHandler} className="relative bg-white p-10 rounded-xl text-slate-500">
        <h1 className="text-center text-2xl text-neutral-700 font-semibold">
          Recruiter {state}
        </h1>
        <p className="text-sm">Welcome back! Please sign in to continue</p>
        {state === "Sign up" && isTextDataSubmitted ? (
          <>
            <div className="flex items-center gap-4 my-10">
              <label htmlFor="image">
                <img className="w-16 rounded-full cursor-pointer" src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
                <input onChange={e => setImage(e.target.files[0])} type="file" id="image" hidden />
              </label>
              <p>Upload Company <br /> logo</p>
            </div>
          </>
        ) : (
          <>
            {state !== "Login" && (
              <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                <img src={assets.person_icon} alt="" />
                <input
                  className="outline-none text-sm"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Company Name"
                  required
                />
              </div>
            )}

            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
              <img src={assets.email_icon} alt="" />
              <input
                className="outline-none text-sm"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Email ID"
                required
              />
            </div>

            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
              <img src={assets.lock_icon} alt="" />
              <input
                className="outline-none text-sm"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Password"
                required
              />
            </div>
          </>
        )}
        {state === 'Login' && (
          <p className="text-sm text-emerald-600 mt-4 cursor-pointer">
            Forgot password?
          </p>
        )}
      
        <button type="submit" className="bg-emerald-600 w-full text-white py-2 mt-4  rounded-full cursor-pointer">
          {state === "Login" ? "login" : isTextDataSubmitted ? "Create Account" : 'Next'}
        </button>
        {state === "Login" ? (
          <p className="mt-5 text-center text-sm ">
            Don't have an account ?{" "}
            <span
              onClick={() => setState("Sign up")}
              className="text-emerald-600 font-semibold cursor-pointer"
            >
              Sign Up
            </span>
          </p>
        ) : (
          <p className="mt-5 text-center text-sm ">
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-emerald-600 font-semibold cursor-pointer"
            >
              Login
            </span>
          </p>
        )}

        <img onClick={e => setShowRecruiterLogin(false)} className="absolute top-5 right-5 cursor-pointer" src={assets.cross_icon} alt="" />
      </form>
    </div>
  );
};

export default RecruiterLogin;
