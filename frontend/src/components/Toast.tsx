import toast from "react-hot-toast";

export const createToast = (state: "error" | "success", contents: string) => {
    const toastStyling = {
        style: {
            borderRadius: "8px",
            background: "#222",
            color: "#f5f5f5",
        },
        duration: 4000,
    }
    switch (state) {
        case "error":
            return toast.error(contents, toastStyling);
        case "success":
            return toast.success(contents, toastStyling);
        default:
            break;
    }
};