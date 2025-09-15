import toast from "react-hot-toast";

export const createToast = (state: string, contents: string) => {
    switch (state) {
        case "error":
            return toast.error(contents, {
                style: {
                    borderRadius: "8px",
                    background: "#222",
                    color: "#f5f5f5",
                },
                duration: 4000,
            });
        case "success":
            return toast.success(contents, {
                style: {
                    borderRadius: "8px",
                    background: "#222",
                    color: "#f5f5f5",
                },
                duration: 4000,
            });
        default:
            break;
    }
};