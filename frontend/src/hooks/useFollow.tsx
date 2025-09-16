import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createToast } from "../components/Toast";

const useFollow = () => {
    const queryClient = useQueryClient();

    const { mutate: followUnfollow, isPending } = useMutation({
        mutationFn: async (userId: string) => {
            try {
                const res = await fetch(`http://localhost:8000/api/users/follow/${userId}`, {
                    method: "POST",
                    credentials: "include"
                });
                const data = await res.json();

                if (!res.ok) throw new Error(data.error || "Something went wrong");

                return;
            } catch (error) {
                console.log(error);
                throw error;
            }
        },
        onSuccess: () => {
            Promise.all([
                queryClient.invalidateQueries({ queryKey: ["auth/checkAuth"] }),
                queryClient.invalidateQueries({ queryKey: ["users/suggested"] })
            ]);
        },
        onError: (error) => {
            createToast("error", error.message);
        }
    });

    return { followUnfollow, isPending };
}

export default useFollow;