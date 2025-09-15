import { useRouteError, isRouteErrorResponse, Link, useNavigate } from "react-router";

export default function ErrorPage() {
    const error = useRouteError();
    const navigate = useNavigate();

    const getErrorMessage = () => {
        if (isRouteErrorResponse(error)) {
            switch (error.status) {
                case 404:
                    return "Page not found";
                case 401:
                    return "Unauthorized access";
                case 500:
                    return "Server error";
                default:
                    return error.statusText;
            }
        }
        if (error instanceof Error) {
            return error.message;
        }

        return "An unknown error occurred";
    };

    const getErrorStatus = () => {
        if (isRouteErrorResponse(error)) {
            return error.status;
        }
        return "Unknown error";
    };

    return (
        <div className="min-h-screen p-2 flex flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-2xl sm:text-5xl font-bold">
                Oops! Something went wrong
            </h1>
            <p className="text-lg sm:text-2xl font-semibold">
                <span className="text-primary font-bold">{getErrorStatus()}</span> - {getErrorMessage()}
            </p>
            <div className="flex flex-row items-center gap-3 mt-2">
                <button onClick={() => { void navigate(-1) }} className="cursor-pointer btn btn-primary rounded-md">
                    Return
                </button>
                <button className="cursor-pointer btn btn-accent rounded-md">
                    <Link viewTransition to="/">
                        Home
                    </Link>
                </button>
            </div>
        </div>
    );
}
