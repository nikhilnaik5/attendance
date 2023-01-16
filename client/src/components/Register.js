import React from 'react'
import axios from 'axios'
import { useState} from "react";
import { Link } from "react-router-dom";
import registerImage from "../images/20943593.jpg"
const Register = () => {

    const [message, setMessage] = useState(null);
    const [userregister, setUserRegister] = useState({
        email: "", password: "",phone:null,password:"",cpassword:""
    });

    let name, value;

    const handleRegisterInputs = (e) => {
        e.preventDefault();
        name = e.target.name;
        value = e.target.value;

        setUserRegister({ ...userregister, [name]: value });
    }

    const PostUserRegister = () => {
        let email = userregister.email;
        let password = userregister.password;
        let cpassword = userregister.cpassword;
        let name = userregister.name;
        let phone = userregister.phone;
        axios.post('/auth/register', { email, password,cpassword,name,phone }).then(res => {
            // console.log(res);
            setMessage("Account successfully created");
        }).catch((err) => { setMessage(err.response.data.message); console.log(err) })
    }


    return (
        <div>
            {message == null ? null : <div class="m-5 flex p-4 mb-4 text-sm text-red-700 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800" role="alert">
                <svg aria-hidden="true" class="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
                <span class="sr-only">Info</span>
                <div>
                    {message}
                </div>
            </div>}
            <section >
                <div class="px-6 h-full text-gray-800">
                    <div
                        class="flex xl:justify-center lg:justify-between justify-center items-center flex-wrap h-full g-6"
                    >
                        <div
                            class="grow-0 shrink-1 md:shrink-0 basis-auto xl:w-6/12 lg:w-6/12 md:w-9/12 mb-12 md:mb-0"
                        >
                            <img
                                src={registerImage}
                                class="w-full"
                                alt="Sample image"
                            />
                        </div>
                        <div class="xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0">
                            <form>

                                <div
                                    class="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5"
                                >
                                    <p class="text-center font-semibold mx-4 mb-0">Register</p>
                                </div>
                                <div class="mb-6">
                                    <input
                                        type="text"
                                        class="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                        id="exampleFormControlInput2"
                                        placeholder="Name" name='name' value={userregister.name} onChange={handleRegisterInputs}
                                    />
                                </div>
                                <div class="mb-6">
                                    <input
                                        type="text"
                                        class="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                        id="exampleFormControlInput2"
                                        placeholder="Email address" name='email' value={userregister.email} onChange={handleRegisterInputs}
                                    />
                                </div>
                                <div class="mb-6">
                                    <input
                                        type="number"
                                        class="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                        id="exampleFormControlInput2"
                                        placeholder="Number" name='phone' value={userregister.phone} onChange={handleRegisterInputs}
                                    />
                                </div>
                                <div class="mb-6">
                                    <input
                                        type="password"
                                        class="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                        id="exampleFormControlInput2"
                                        placeholder="Password" name='password' value={userregister.password} onChange={handleRegisterInputs}
                                    />
                                </div>
                                <div class="mb-6">
                                    <input
                                        type="password"
                                        class="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                        id="exampleFormControlInput2"
                                        placeholder="Confirm Password" name='cpassword' value={userregister.cpassword} onChange={handleRegisterInputs}
                                    />
                                </div>

                                <div class="text-center lg:text-left">
                                    <button
                                        type="button"
                                        class="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                                        onClick={PostUserRegister}>
                                        Register
                                    </button>
                                    <p class="text-sm font-semibold mt-2 pt-1 mb-0">
                                        Already have an account?
                                        <Link
                                            to="/login"
                                            class="text-red-600 hover:text-red-700 focus:text-red-700 transition duration-200 ease-in-out"
                                        >Login</Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Register