"use server"

import { cookies } from "next/headers"

export async function login(username: string, password: string) {
  // In a real app, this would validate against a database
  if (username === "admin" && password === "admin") {
    // Set a secure HTTP-only cookie
    cookies().set("adminToken", "admin-token-123", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    })

    return { success: true }
  }

  return { success: false, error: "Invalid credentials" }
}

export async function logout() {
  cookies().delete("adminToken")
  return { success: true }
}

export async function getSession() {
  const token = cookies().get("adminToken")

  if (token) {
    return { isLoggedIn: true }
  }

  return { isLoggedIn: false }
}

