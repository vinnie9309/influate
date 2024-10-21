import { useState } from "react"
import { useDispatch } from "react-redux"
import { signIn } from "../../lib/auth"
import { loggedIn } from "../../app/api/authSlice"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"

const LoginForm = (props) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const dispatch = useDispatch()
  const router = useRouter()
  const handleSignIn = async (e) => {
    e.preventDefault()
    try {
      const user = await signIn(email, password)
      const userData = {
        uid: user.uid,
        email: user.email,
        userName: user.displayName
      }
      dispatch(loggedIn(userData))
      router.push("/")
    } catch (error) {
      alert("Error during login: " + error.message)
    }
  }
  return (
    <Card className="w-full max-w-sm mx-auto mt-20">
      <CardHeader>
        <CardTitle className="text-2xl">Влезте в профила си</CardTitle>
        <CardDescription>Въведете Вашите данни</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignIn} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="az@naprimer.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Парола</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
          <Button variant="outline" className="w-full">
            Login with Google
          </Button>
        </form>
      </CardContent>
      <div className="mb-6 text-center text-sm">
        Нямате профил?{" "}
        <Link
          href="#"
          className="underline"
          onClick={() => props.setRegister("register")}
        >
          Регистрирайте се
        </Link>
      </div>
    </Card>
  )
}

export default LoginForm
