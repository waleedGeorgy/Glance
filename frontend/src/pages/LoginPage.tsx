import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { User2, LockKeyhole } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createToast } from "../components/Toast";

interface formDataProps {
    username: string,
    password: string
}

const LoginPage = () => {
    const [formData, setFormData] = useState<formDataProps>({
        username: "",
        password: "",
    });

    const queryClient = useQueryClient();

    const { mutate, error, isPending, isError } = useMutation({
        mutationFn: async ({ username, password }: formDataProps) => {
            try {
                const res = await fetch("http://localhost:8000/api/auth/login", {
                    method: "POST",
                    credentials: 'include',
                    body: JSON.stringify({ username, password }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const data = await res.json();

                if (!res.ok) throw new Error(data.error || "Failed to log in");
            } catch (error) {
                console.log(error);
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["auth/checkAuth"] });
            createToast("success", "Logged in successfully! Redirecting...");
        }
    })

    const handleLogin = (e: FormEvent) => {
        e.preventDefault();
        mutate(formData);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className='max-w-screen-xl mx-auto flex h-screen px-6 items-center'>
            <div className='flex-1 hidden lg:flex items-center justify-center'>
                <h1 className="text-6xl">Glance</h1>
            </div>
            <div className='flex-1 flex flex-col justify-center items-center gap-5'>
                <h2 className="lg:hidden">Glance</h2>
                <h3 className='text-3xl text-center'>Let's Continue!</h3>
                <form className='flex gap-4 flex-col w-1/2' onSubmit={handleLogin}>
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
                    <button className='btn rounded-full btn-primary' disabled={isPending}>
                        {isPending ?
                            <span>Logging in <span className="loading loading-dots loading-sm" /></span>
                            :
                            <span>Log In</span>
                        }
                    </button>
                    {isError && <p className='text-red-400 font-semibold animate-pulse'>{error.message}</p>}
                </form>
                <div className='flex flex-col gap-2'>
                    <p className='text-center'>Don't have an account?</p>
                    <Link viewTransition to='/signup'>
                        <button className='btn rounded-full btn-primary btn-outline w-full' disabled={isPending}>Sign Up</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
export default LoginPage;