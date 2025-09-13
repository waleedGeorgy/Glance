import { useState, type FormEvent } from "react";
import { Mail, User2, LockKeyhole } from "lucide-react"
import { Link } from "react-router";

const SignupPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        firstName: "",
        lastName: "",
        password: "",
    });

    const handleSignup = (e: FormEvent) => {
        e.preventDefault();
        console.log(formData);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const isError = false;

    return (
        <div className='max-w-screen-xl mx-auto flex h-screen px-6 items-center'>
            <div className='flex-1 hidden lg:flex items-center justify-center'>
                <h1 className="text-6xl">Glance</h1>
            </div>
            <div className='flex-1 flex flex-col justify-center items-center'>
                <form className='flex gap-4 flex-col' onSubmit={handleSignup}>
                    <h2 className="lg:hidden">Glance</h2>
                    <h3 className='text-3xl text-center'>Join for free!</h3>
                    <label className='input rounded-lg w-full'>
                        <Mail className="size-5 opacity-50" />
                        <input
                            type='email'
                            className='grow'
                            placeholder='Email*'
                            name='email'
                            onChange={handleInputChange}
                            value={formData.email}
                            autoComplete="on"
                            autoFocus
                        />
                    </label>
                    <label className='input rounded-lg w-full'>
                        <User2 className="size-5 opacity-50" />
                        <input
                            type='text'
                            placeholder='Username*'
                            name='username'
                            className='grow'
                            onChange={handleInputChange}
                            value={formData.username}
                            autoComplete="on"
                        />
                    </label>
                    <div className='flex gap-4 flex-wrap w-full'>
                        <label className='input rounded-lg flex items-center gap-2 flex-1'>
                            <input
                                type='text'
                                className='grow'
                                placeholder='First name*'
                                name='firstName'
                                onChange={handleInputChange}
                                value={formData.firstName}
                                autoComplete="on"
                            />
                        </label>
                        <label className='input rounded-lg flex items-center gap-2 flex-1'>
                            <input
                                type='text'
                                className='grow'
                                placeholder='Last name*'
                                name='lastName'
                                onChange={handleInputChange}
                                value={formData.lastName}
                                autoComplete="on"
                            />
                        </label>
                    </div>
                    <label className='input rounded-lg w-full'>
                        <LockKeyhole className="size-5 opacity-50" />
                        <input
                            type='password'
                            className='grow'
                            placeholder='Password*'
                            name='password'
                            onChange={handleInputChange}
                            value={formData.password}
                            autoComplete="off"
                        />
                    </label>
                    <button className='btn rounded-full btn-primary'>Sign Up</button>
                    {isError && <p className='text-red-400 text-right'>Something went wrong</p>}
                </form>
                <div className='flex flex-col gap-2 mt-6'>
                    <p className='text-center'>Already have an account?</p>
                    <Link viewTransition to='/login'>
                        <button className='btn rounded-full btn-primary btn-outline w-full'>Log In</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
export default SignupPage;