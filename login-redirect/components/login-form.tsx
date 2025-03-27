"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, Mail, Phone, Lock, User, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("password")
  const [showRegister, setShowRegister] = useState(false)

  // 登录表单数据
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
    phone: "",
    verificationCode: "",
    rememberMe: false,
  })

  // 注册表单数据
  const [registerData, setRegisterData] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    organization: "",
    position: "",
    verificationCode: "",
    agreeTerms: false,
  })

  // 注册方式
  const [registerMethod, setRegisterMethod] = useState<"email" | "phone">("email")

  // 检查用户是否已登录
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      router.push("/marketplace")
    }
  }, [router])

  // 处理登录表单变化
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setLoginData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  // 处理注册表单变化
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setRegisterData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  // 处理登录提交
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      let response

      if (activeTab === "password") {
        // 账号密码登录
        response = await loginWithPassword(loginData.username, loginData.password)
      } else if (activeTab === "phone") {
        // 手机验证码登录
        response = await loginWithPhone(loginData.phone, loginData.verificationCode)
      }

      // 登录成功，存储用户信息和token
      localStorage.setItem("user", JSON.stringify(response.user))
      localStorage.setItem("token", response.token)

      // 记住登录状态
      if (loginData.rememberMe) {
        localStorage.setItem("rememberMe", "true")
      }

      // 重定向到应用市场页面
      console.log("登录成功，正在跳转到应用市场...")
      router.push("/marketplace")
    } catch (err) {
      setError("登录失败，请检查您的输入信息")
    } finally {
      setIsLoading(false)
    }
  }

  // 处理注册提交
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // 验证密码匹配
    if (registerData.password !== registerData.confirmPassword) {
      setError("两次输入的密码不一致")
      setIsLoading(false)
      return
    }

    // 验证用户协议
    if (!registerData.agreeTerms) {
      setError("请阅读并同意用户协议与隐私政策")
      setIsLoading(false)
      return
    }

    try {
      let response

      if (registerMethod === "email") {
        // 邮箱注册
        response = await registerWithEmail(
          registerData.email,
          registerData.password,
          registerData.fullName,
          registerData.organization,
          registerData.position,
        )
      } else {
        // 手机号注册
        response = await registerWithPhone(
          registerData.phone,
          registerData.verificationCode,
          registerData.password,
          registerData.fullName,
          registerData.organization,
          registerData.position,
        )
      }

      // 注册成功，切换到登录页面
      setShowRegister(false)
      setActiveTab("password")
      setLoginData((prev) => ({
        ...prev,
        username: registerMethod === "email" ? registerData.email : registerData.phone,
      }))

      // 显示成功消息
      alert("注册成功，请登录您的账号")
    } catch (err) {
      setError("注册失败，请检查您的输入信息")
    } finally {
      setIsLoading(false)
    }
  }

  // 发送验证码
  const sendVerificationCode = async (target: string, type: "login" | "register") => {
    try {
      // 模拟发送验证码
      console.log(`向 ${target} 发送验证码，类型: ${type}`)
      alert(`验证码已发送至 ${target}`)
    } catch (err) {
      setError("验证码发送失败，请稍后重试")
    }
  }

  // 模拟账号密码登录
  const loginWithPassword = async (username: string, password: string) => {
    return new Promise<{ user: { name: string }; token: string }>((resolve, reject) => {
      setTimeout(() => {
        if (username === "admin" && password === "password") {
          resolve({
            user: { name: username },
            token: "sample-jwt-token",
          })
        } else {
          reject(new Error("Invalid credentials"))
        }
      }, 1000)
    })
  }

  // 模拟手机验证码登录
  const loginWithPhone = async (phone: string, code: string) => {
    return new Promise<{ user: { name: string }; token: string }>((resolve, reject) => {
      setTimeout(() => {
        if (phone && code === "123456") {
          resolve({
            user: { name: `用户${phone.substring(phone.length - 4)}` },
            token: "sample-jwt-token",
          })
        } else {
          reject(new Error("Invalid code"))
        }
      }, 1000)
    })
  }

  // 模拟邮箱注册
  const registerWithEmail = async (
    email: string,
    password: string,
    fullName: string,
    organization: string,
    position: string,
  ) => {
    return new Promise<{ success: boolean }>((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          resolve({ success: true })
        } else {
          reject(new Error("Registration failed"))
        }
      }, 1000)
    })
  }

  // 模拟手机号注册
  const registerWithPhone = async (
    phone: string,
    code: string,
    password: string,
    fullName: string,
    organization: string,
    position: string,
  ) => {
    return new Promise<{ success: boolean }>((resolve, reject) => {
      setTimeout(() => {
        if (phone && code === "123456" && password) {
          resolve({ success: true })
        } else {
          reject(new Error("Registration failed"))
        }
      }, 1000)
    })
  }

  // 处理第三方登录
  const handleThirdPartyLogin = (provider: string) => {
    setIsLoading(true)
    // 模拟第三方登录流程
    console.log(`尝试使用 ${provider} 登录`)
    setTimeout(() => {
      alert(`模拟 ${provider} 登录成功`)
      localStorage.setItem("token", "third-party-token")
      localStorage.setItem("user", JSON.stringify({ name: `${provider}用户` }))
      router.push("/marketplace")
    }, 1500)
  }

  // 处理忘记密码
  const handleForgotPassword = () => {
    router.push("/forgot-password")
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md">
        {showRegister ? (
          // 注册表单
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">创建新账号</CardTitle>
              <CardDescription>请填写以下信息完成注册</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-start space-x-2 mb-4">
                    <Button
                      type="button"
                      variant={registerMethod === "email" ? "default" : "outline"}
                      onClick={() => setRegisterMethod("email")}
                      className="flex-1"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      邮箱注册
                    </Button>
                    <Button
                      type="button"
                      variant={registerMethod === "phone" ? "default" : "outline"}
                      onClick={() => setRegisterMethod("phone")}
                      className="flex-1"
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      手机注册
                    </Button>
                  </div>

                  {registerMethod === "email" ? (
                    <div className="space-y-2">
                      <Label htmlFor="email">电子邮箱</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="输入您的电子邮箱"
                          value={registerData.email}
                          onChange={handleRegisterChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="phone">手机号码</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="输入您的手机号码"
                          value={registerData.phone}
                          onChange={handleRegisterChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {registerMethod === "phone" && (
                    <div className="space-y-2">
                      <Label htmlFor="verificationCode">验证码</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="verificationCode"
                          name="verificationCode"
                          placeholder="输入验证码"
                          value={registerData.verificationCode}
                          onChange={handleRegisterChange}
                          required
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => sendVerificationCode(registerData.phone, "register")}
                        >
                          获取验证码
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="fullName">姓名</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="fullName"
                        name="fullName"
                        placeholder="输入您的姓名"
                        value={registerData.fullName}
                        onChange={handleRegisterChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organization">单位/组织</Label>
                    <Input
                      id="organization"
                      name="organization"
                      placeholder="输入您的单位或组织名称"
                      value={registerData.organization}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">职位</Label>
                    <Input
                      id="position"
                      name="position"
                      placeholder="输入您的职位"
                      value={registerData.position}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">密码</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="设置密码"
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        className="pl-10 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        className="absolute right-0 top-0 h-10 w-10 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">确认密码</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="再次输入密码"
                        value={registerData.confirmPassword}
                        onChange={handleRegisterChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="agreeTerms"
                      name="agreeTerms"
                      checked={registerData.agreeTerms}
                      onCheckedChange={(checked) =>
                        setRegisterData((prev) => ({
                          ...prev,
                          agreeTerms: !!checked,
                        }))
                      }
                    />
                    <label
                      htmlFor="agreeTerms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      我已阅读并同意
                      <Link href="#" className="text-primary hover:underline ml-1">
                        用户协议
                      </Link>
                      和
                      <Link href="#" className="text-primary hover:underline ml-1">
                        隐私政策
                      </Link>
                    </label>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "注册中..." : "注册"}
                </Button>
                <div className="text-center mt-4">
                  <span className="text-sm text-muted-foreground">已有账号？</span>
                  <Button
                    type="button"
                    variant="link"
                    className="text-sm"
                    onClick={() => setShowRegister(false)}
                  >
                    返回登录
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          // 登录表单
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">欢迎回来</CardTitle>
              <CardDescription>请登录您的账号</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Tabs defaultValue="password" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="password">账号密码</TabsTrigger>
                  <TabsTrigger value="phone">手机验证码</TabsTrigger>
                </TabsList>
                <TabsContent value="password">
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">用户名/邮箱</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="username"
                          name="username"
                          placeholder="输入用户名或邮箱"
                          value={loginData.username}
                          onChange={handleLoginChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">密码</Label>
                        <Button
                          variant="link"
                          className="px-0 text-xs"
                          onClick={handleForgotPassword}
                        >
                          忘记密码?
                        </Button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="输入密码"
                          value={loginData.password}
                          onChange={handleLoginChange}
                          className="pl-10 pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          className="absolute right-0 top-0 h-10 w-10 p-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="rememberMe"
                        name="rememberMe"
                        checked={loginData.rememberMe}
                        onCheckedChange={(checked) =>
                          setLoginData((prev) => ({ ...prev, rememberMe: !!checked }))
                        }
                      />
                      <label
                        htmlFor="rememberMe"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        记住我
                      </label>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "登录中..." : "登录"}
                    </Button>
                  </form>
                </TabsContent>
                <TabsContent value="phone">
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-phone">手机号码</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-phone"
                          name="phone"
                          type="tel"
                          placeholder="输入手机号码"
                          value={loginData.phone}
                          onChange={handleLoginChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-verification-code">验证码</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="login-verification-code"
                          name="verificationCode"
                          placeholder="输入验证码"
                          value={loginData.verificationCode}
                          onChange={handleLoginChange}
                          required
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => sendVerificationCode(loginData.phone, "login")}
                        >
                          获取验证码
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="phone-rememberMe"
                        name="rememberMe"
                        checked={loginData.rememberMe}
                        onCheckedChange={(checked) =>
                          setLoginData((prev) => ({ ...prev, rememberMe: !!checked }))
                        }
                      />
                      <label
                        htmlFor="phone-rememberMe"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        记住我
                      </label>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "登录中..." : "登录"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">或</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleThirdPartyLogin("微信")}
                  disabled={isLoading}
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                    <path d="M8 20H3v-2c0-2.8 2.2-5 5-5 .4 0 .9 0 1.3.1" />
                    <path d="M15 8.2c1.8.4 3 2 3 3.8 0 0 0 2-.5 3" />
                    <path d="M13.6 14.4c1.1.7 1.9 1.9 1.9 3.1v2" />
                    <path d="M22 20h-3" />
                    <path d="M19 17v6" />
                  </svg>
                  微信登录
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleThirdPartyLogin("钉钉")}
                  disabled={isLoading}
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                  钉钉登录
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <div className="text-center w-full">
                <span className="text-sm text-muted-foreground">没有账号？</span>
                <Button
                  type="button"
                  variant="link"
                  className="text-sm"
                  onClick={() => setShowRegister(true)}
                >
                  注册账号
                </Button>
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}