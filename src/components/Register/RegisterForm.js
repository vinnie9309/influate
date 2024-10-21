import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { signUp } from "../../lib/auth"
import { loggedIn } from "../../app/api/authSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useDispatch } from "react-redux"
import Link from "next/link"
import { useRouter } from "next/navigation"

const RegisterForm = ({ setLogin }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [role, setRole] = useState("")
  const handleSignUp = async (e) => {
    e.preventDefault()
    try {
      const user = await signUp(email, password)
      const userData = {
        uid: user.uid,
        email: user.email,
        userName: user.displayName
      }
      dispatch(loggedIn(userData))
      router.push("/")
    } catch (error) {
      alert("Error during registration: " + error.message)
    }
  }
  return (
    <Card className="mx-auto max-w-sm mt-20">
      <CardHeader>
        <CardTitle className="text-xl">Регистрация</CardTitle>
        <CardDescription>
          Въведете вашите данни, за да се регистрирате
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignUp}>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">Име</Label>
                <Input
                  id="first-name"
                  placeholder="Иван"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Фамилия</Label>
                <Input
                  id="last-name"
                  placeholder="Иванов"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            <Select
              value={role}
              onValueChange={(value) => setRole(value)}
              required
            >
              <SelectTrigger className="w-100">
                <SelectValue placeholder="Вие сте" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="influencer">Инфлуенсър/афилиат</SelectItem>
                  <SelectItem value="company">Компания</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
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
              />
            </div>
            <Button type="submit" className="w-full">
              Създайте профил
            </Button>
            <Button variant="outline" className="w-full">
              Влезте с Google
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          Вече сте регистрирани?{" "}
          <Link href="#" className="underline" onClick={setLogin}>
            Влезте в профила си
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default RegisterForm
