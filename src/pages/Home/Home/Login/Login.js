import { FaFacebookF, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { getAuth, GithubAuthProvider, GoogleAuthProvider, sendPasswordResetEmail } from 'firebase/auth';
import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import img from '../../../../assets/images/login/login.svg'
import { AuthContext } from '../../../../contexts/AuthProvider/AuthProvider';
import app from '../../../../firebase/Firebase.config';

const Login = () => {

    const auth = getAuth(app);

    const [error, setError] = useState('');
    const [userEmail, setUserEmail] = useState('');

    const { signIn, setLoading, providerLogin } = useContext(AuthContext);

    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleLogin = event => {
        event.preventDefault();

        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;

        signIn(email, password)
            .then(result => {
                const user = result.user;
                console.log(user.email);

                const currentUser = {
                    email: user.email
                }
                console.log(currentUser);

                //get jwt token
                fetch('http://localhost:9000/jwt', {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(currentUser)
                })
                    .then(res => res.json())
                    .then(data => {
                        console.log(data)
                        // local storage is the easiest but not the best place to store the token
                        localStorage.setItem('secretToken', data.token);
                        navigate(from, { replace: true });
                    })

                form.reset();

            })
            .catch(error => {
                console.error(error);
                setError(error.message);
            })
            .finally(() => {
                setLoading(false);
            })

    }

    const googleProvider = new GoogleAuthProvider();
    const githubProvider = new GithubAuthProvider();

    const handleGoogleSignIn = () => {
        providerLogin(googleProvider)
            .then(result => {
                const user = result.user;
                navigate(from, { replace: true });
            })
            .catch(error => console.error(error));
    }

    const handleGithubSignIn = () => {
        providerLogin(githubProvider)
            .then(result => {
                const user = result.user;
            })
            .catch(error => console.error(error));
    }

    const handleEmailBlur = event => {
        const email = event.target.value;
        setUserEmail(email);
        console.log(email);
    }

    const handleForgetPassword = () => {
        if (!userEmail) {
            alert('please enter your email address')
            return;
        }
        sendPasswordResetEmail(auth, userEmail)


            .then(() => {
                alert('password reset email send')
            })
            .catch(error => {
                console.error(error);
            })
    }

    return (
        <div className="hero w-full my-20">
            <div className="hero-content grid gap-20 md:grid-cols-2  flex-col lg:flex-row">
                <div className="text-center lg:text-left">
                    <img className='w-3/4' src={img} alt="" />

                </div>
                <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100 py-10">
                    <h1 className="text-5xl font-bold text-center">Login </h1>
                    <form onSubmit={handleLogin} className="card-body">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input onBlur={handleEmailBlur} type="email" name='email' placeholder="email" className="input input-bordered" />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input type="password" name="password" placeholder="password" className="input input-bordered" />
                            <label className="label">
                                <p className="mt-3">Forget Password? <Link onClick={handleForgetPassword} className='text-orange-600 font-bold'>Reset Password</Link></p>
                            </label>
                        </div>
                        <div className="form-control mt-3">
                            <p className='text-error mb-5'>
                                {error}
                            </p>
                            <input className="btn bg-red-500 text-white border-0" type="submit" value="Login"></input>
                        </div>
                        <div className='text-center'>
                            <p className="font-semibold" >Or Sign In With</p>
                            <div className="flex justify-center mt-7">
                                <button > <FcGoogle onClick={handleGoogleSignIn} style={{ height: '50px', width: '40px' }}
                                ></FcGoogle></button>
                                <FaFacebookF style={{ height: '40px', width: '40px' }} className="mx-5"></FaFacebookF>
                                <button onClick={handleGithubSignIn}> <FaGithub style={{ height: '40px', width: '40px' }}></FaGithub></button>
                            </div>

                        </div>
                    </form>

                    <p className='text-center mt-5'>New to our website? <Link className='text-orange-600 font-bold' to='/register'>Sign Up</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;