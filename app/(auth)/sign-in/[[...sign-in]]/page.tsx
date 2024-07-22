import { SignIn } from "@clerk/nextjs"

const SigninPage = () => {
    return (
        <main className="auth-page">
            <SignIn />
        </main>
    )
}

export default SigninPage