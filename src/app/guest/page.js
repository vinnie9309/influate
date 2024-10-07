"use client"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [typePage, setTypePage] = useState("register")

  return (
    <>
      {typePage === "register" ? (
        <Card className="mx-auto max-w-sm mt-20">
          <CardHeader>
            <CardTitle className="text-xl">Регистрация</CardTitle>
            <CardDescription>
              Въведете вашите данни, за да се регистрирате
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">Име</Label>
                  <Input id="first-name" placeholder="Max" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">Фамилия</Label>
                  <Input id="last-name" placeholder="Robinson" required />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="az@naprimer.com"
                  required
                />
              </div>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Вие сте" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Инфлуенсър/афилиат</SelectItem>
                  <SelectItem value="dark">Компания</SelectItem>
                </SelectContent>
              </Select>
              <div className="grid gap-2">
                <Label htmlFor="password">Парола</Label>
                <Input id="password" type="password" />
              </div>
              <Button type="submit" className="w-full">
                Създайте профил
              </Button>
              <Button variant="outline" className="w-full">
                Влезте с Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Вече сте регистрирани?{" "}
              <Link
                href="#"
                className="underline"
                onClick={() => setTypePage("")}
              >
                Влезте в профила си
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-sm mx-auto mt-20">
          <CardHeader>
            <CardTitle className="text-2xl">Влезте в профила си</CardTitle>
            <CardDescription>Въведете Вашите данни</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="az@naprimer.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Парола</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Button variant="outline" className="w-full">
              Login with Google
            </Button>
          </CardContent>
          <div className="mb-6 text-center text-sm">
            Нямате профил?{" "}
            <Link
              href="#"
              className="underline"
              onClick={() => setTypePage("register")}
            >
              Регистрирайте се
            </Link>
          </div>
        </Card>
      )}
    </>
  )
}
