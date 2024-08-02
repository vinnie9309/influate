import LoginForm from "../components/Login/LoginForm"
import RegisterForm from "../components/Register/RegisterForm"

export default function Home() {
  return (
    <div>
      <LoginForm />
      <h1>Welcome to shortmemory.com</h1>
      <p>where you keep your short memory</p>
      <RegisterForm />
    </div>
  )
}
