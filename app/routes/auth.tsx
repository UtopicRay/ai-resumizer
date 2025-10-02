import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

export default function Auth() {
    const { auth, isLoading } = usePuterStore();
    const location = useLocation();
    const next = location.search.split('next=')[1];
    const navigate = useNavigate();
    useEffect(() => {
        if (auth.isAuthenticated) {
            navigate(next)
            console.log(next)
        };
    }, [auth.isAuthenticated,next])
    return (
        <main className="bg-cover bg-[url('/images/bg-main.svg')] min-h-screen flex flex-col justify-center items-center">
            <div className="gradient-border shadow-lg">
                <section className="flex rounded-2xl items-center flex-col bg-white p-10 gap-8">
                    <h1>Welcome</h1>
                    <h2>Log In To Continue Your Job Journey</h2>
                    {isLoading ? (
                        <button className="auth-button animate-pulse"><p>Signing your in...</p></button>
                    ) : (
                        <>
                            {auth.isAuthenticated ? (
                                <button className="auth-button" onClick={auth.signOut}><p>Log Out</p></button>
                            ) : (
                                <button className="auth-button" onClick={auth.signIn}><p>Log In</p></button>
                            )}
                        </>

                    )}
                </section>
            </div>
        </main>
    )
}