import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import img from '../../../../assets/images/login/login.svg'
import { AuthContext } from '../../../../contexts/AuthProvider/AuthProvider';

const Register = () => {

    const [passwordError, setPasswordError] = useState('');
    const [success, setSuccess] = useState(false);

    const { createUser, verifyEmail } = useContext(AuthContext);

    const handleSignUp = event => {
        event.preventDefault();
        setSuccess(false);
        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;

        if (!/(?=.*[A-Z].*[A-Z])/.test(password)) {
            setPasswordError('Please provide at least two uppercase');
            return;
        }
        setPasswordError('');

        createUser(email, password)
            .then(result => {
                const user = result.user;
                console.log(user);
                setSuccess(true);
                form.reset();
                handleEmailVerification();

            })
            .catch(error => {
                console.error('error', error);
                setPasswordError(error.message);
            });

    }

    const handleEmailVerification = () => {
        verifyEmail()
            .then(() => { alert('Please verify your email') })
            .catch(error => console.error(error));
    }

    return (
        <div className="hero w-full my-20">
            <div className="hero-content grid gap-20 md:grid-cols-2  flex-col lg:flex-row">
                <div className="text-center lg:text-left">
                    <img className='w-3/4' src={img} alt="" />

                </div>
                <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100 py-10">
                    <h1 className="text-5xl font-bold text-center">Sign Up </h1>
                    <form onSubmit={handleSignUp} className="card-body">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Name</span>
                            </label>
                            <input type="text" name='name' placeholder="Your Name" className="input input-bordered" />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input type="email" name='email' placeholder="email" className="input input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input type="password" name='password' placeholder="password" className="input input-bordered" required />
                        </div>
                        <p className='text-error'>{passwordError}</p>
                        {success && <p className='text-success py-3'>User Created Successfully </p>}
                        <div className="form-control mt-6">
                            <input className="btn btn-primary" type="submit" value="SignUp"></input>
                        </div>
                    </form>
                    <p className='px-9'>Already have an account? <Link className='text-orange-600 font-bold' to="/login">Login</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;