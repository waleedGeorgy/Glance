import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { User2, LockKeyhole } from "lucide-react";

const LoginPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const handleLogin = (e: FormEvent) => {
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
                <form className='flex gap-4 flex-col w-2/3' onSubmit={handleLogin}>
                    <h2 className="w-24 lg:hidden">Glance</h2>
                    <h3 className='text-3xl text-center'>Let's Continue!</h3>
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
                            autoFocus
                        />
                    </label>
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
                    <Link viewTransition to='/signup'>
                        <button className='btn rounded-full btn-primary btn-outline w-full'>Log In</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
export default LoginPage;