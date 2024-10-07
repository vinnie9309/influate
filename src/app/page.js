import LoginForm from "../components/Login/LoginForm"
import RegisterForm from "../components/Register/RegisterForm"
import GuestPage from "../components/Guest/Guest"

export default function Home() {
  return (
    <div className="bg-main-bg min-h-screen">
      <GuestPage />
    </div>
  )
}
