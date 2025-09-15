import { useState } from "react";
import { UserCircle2, UserPlus2, LockKeyhole } from "lucide-react";

const EditProfileModal = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        bio: "",
        link: "",
        newPassword: "",
        currentPassword: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <>
            <button
                className='btn btn-primary rounded-full btn-sm'
                onClick={() => {
                    const modal = document.getElementById("edit_profile_modal");
                    if (modal instanceof HTMLDialogElement) {
                        modal.showModal();
                    }
                }}
            >
                Edit profile
            </button>
            <dialog id='edit_profile_modal' className='modal'>
                <div className='modal-box border rounded-md border-accent shadow-md'>
                    <h3 className='font-bold text-2xl text-right mb-4'>Edit Profile</h3>
                    <form
                        className='flex flex-col gap-6'
                        onSubmit={(e) => {
                            e.preventDefault();
                            alert("Profile updated successfully");
                        }}
                    >
                        <div className='flex flex-col flex-wrap gap-2'>
                            <h4 className="flex items-center gap-2"><UserCircle2 className="size-5" />Personal info</h4>
                            <div className="gap-2 flex flex-row items-center">
                                <input
                                    type='text'
                                    placeholder='First name'
                                    className='flex-1 input rounded p-2'
                                    value={formData.firstName}
                                    name='firstName'
                                    onChange={handleInputChange}
                                />
                                <input
                                    type='text'
                                    placeholder='Last name'
                                    className='flex-1 input rounded p-2'
                                    value={formData.lastName}
                                    name='lastName'
                                    onChange={handleInputChange}
                                />
                            </div>
                            <input
                                type='text'
                                placeholder='Username'
                                className='flex-1 input rounded p-2 w-full'
                                value={formData.username}
                                name='username'
                                onChange={handleInputChange}
                            />
                            <input
                                type='email'
                                placeholder='Email'
                                className='flex-1 input rounded p-2 w-full'
                                value={formData.email}
                                name='email'
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='flex flex-col justify-center flex-wrap gap-2'>
                            <h4 className="flex flex-row items-center gap-2"><LockKeyhole className="size-5" />Update password</h4>
                            <div className="space-y-2">
                                <input
                                    type='password'
                                    placeholder='Current password'
                                    className='flex-1 input rounded p-2 w-full'
                                    value={formData.currentPassword}
                                    name='currentPassword'
                                    onChange={handleInputChange}
                                />
                                <input
                                    type='password'
                                    placeholder='New password'
                                    className='flex-1 input rounded p-2 w-full'
                                    value={formData.newPassword}
                                    name='newPassword'
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col justify-center flex-wrap gap-2">
                            <h4 className="flex flex-row items-center gap-2"><UserPlus2 className="size-5" />Additional info</h4>
                            <div className="space-y-2">
                                <input
                                    type='text'
                                    placeholder='Link'
                                    className='flex-1 input rounded p-2  w-full'
                                    value={formData.link}
                                    name='link'
                                    onChange={handleInputChange}
                                />
                                <textarea
                                    placeholder='Bio'
                                    className='textarea flex-1 input rounded p-2 w-full resize-none'
                                    value={formData.bio}
                                    name='bio'
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <button className='btn btn-primary btn-sm rounded-full w-2/3 mx-auto'>Update</button>
                    </form>
                </div>
                <form method='dialog' className='modal-backdrop'>
                    <button className='outline-none'>close</button>
                </form>
            </dialog>
        </>
    );
};
export default EditProfileModal;