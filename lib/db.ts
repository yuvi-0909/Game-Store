"use client"

// This is a client-side mock database using localStorage
// In a real app, you would use a real database with server-side code

export interface Product {
  id: string
  title: string
  description: string
  image: string
  categoryId: string
  inStock: boolean
  onSale: boolean
  featured: boolean
  createdAt: string
  options: ProductOption[]
}

export interface ProductOption {
  id: string
  name: string
  price: number
  inStock: boolean
}

export interface Category {
  id: string
  name: string
  description: string
}

export interface Order {
  id: string
  date: string
  customerName: string
  customerEmail: string
  customerPhone: string
  productId: string
  productTitle: string
  optionId: string
  optionName: string
  price: number
  uid: string
  paymentMethod: string
  paymentProof: string | null
  status: "pending" | "completed" | "cancelled"
}

export interface User {
  id: string
  name: string
  email: string
  password: string
}

// Initialize localStorage with default data if empty
export function initializeDb() {
  if (typeof window === "undefined") return

  // Initialize categories
  if (!localStorage.getItem("categories")) {
    const defaultCategories: Category[] = [
      {
        id: "cat-1",
        name: "Mobile Games",
        description: "Top-up for popular mobile games",
      },
      {
        id: "cat-2",
        name: "Gift Cards",
        description: "Gift cards for various platforms",
      },
    ]
    localStorage.setItem("categories", JSON.stringify(defaultCategories))
  }

  // Initialize products
  if (!localStorage.getItem("products")) {
    const defaultProducts: Product[] = [
      {
        id: "prod-1",
        title: "Free Fire Diamonds",
        description: "Top up your Free Fire account with diamonds",
        image: "/placeholder.svg?height=192&width=256",
        categoryId: "cat-1",
        inStock: true,
        onSale: true,
        featured: true,
        createdAt: new Date().toISOString(),
        options: [
          { id: "opt-1", name: "100 Diamonds", price: 100, inStock: true },
          { id: "opt-2", name: "310 Diamonds", price: 300, inStock: true },
          { id: "opt-3", name: "520 Diamonds", price: 500, inStock: true },
          { id: "opt-4", name: "1060 Diamonds", price: 1000, inStock: true },
        ],
      },
      {
        id: "prod-2",
        title: "PUBG Mobile UC",
        description: "Top up your PUBG Mobile account with UC",
        image: "/placeholder.svg?height=192&width=256",
        categoryId: "cat-1",
        inStock: true,
        onSale: false,
        featured: true,
        createdAt: new Date().toISOString(),
        options: [
          { id: "opt-5", name: "60 UC", price: 100, inStock: true },
          { id: "opt-6", name: "325 UC", price: 500, inStock: true },
          { id: "opt-7", name: "660 UC", price: 1000, inStock: true },
        ],
      },
    ]
    localStorage.setItem("products", JSON.stringify(defaultProducts))
  }

  // Initialize orders
  if (!localStorage.getItem("orders")) {
    localStorage.setItem("orders", JSON.stringify([]))
  }

  // Initialize users
  if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify([]))
  }
}

// Products
export function getProducts(): Product[] {
  if (typeof window === "undefined") return []

  try {
    const products = localStorage.getItem("products")
    return products ? JSON.parse(products) : []
  } catch (error) {
    console.error("Failed to get products:", error)
    return []
  }
}

export function getProductById(id: string): Product | null {
  const products = getProducts()
  return products.find((product) => product.id === id) || null
}

export function createProduct(product: Omit<Product, "id" | "createdAt">): Product {
  const products = getProducts()

  // Validate required fields
  if (!product.title || !product.categoryId) {
    throw new Error("Product title and category are required")
  }

  // Ensure options are valid
  if (!product.options || !Array.isArray(product.options) || product.options.length === 0) {
    throw new Error("At least one product option is required")
  }

  // Validate each option
  for (const option of product.options) {
    if (!option.name || option.price === undefined) {
      throw new Error("Each option must have a name and price")
    }
  }

  // Optimize image storage - if it's a data URL, it might be too large
  let optimizedImage = product.image
  if (product.image && product.image.startsWith("data:image")) {
    // Use a placeholder instead of the full data URL to save space
    optimizedImage = "/placeholder.svg?height=192&width=256"
  }

  const newProduct: Product = {
    ...product,
    image: optimizedImage,
    id: `prod-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }

  try {
    // Check if we need to clean up some space
    if (products.length > 20) {
      // Keep only the 20 most recent products to avoid quota issues
      const sortedProducts = [...products].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      const productsToKeep = sortedProducts.slice(0, 19) // Keep 19 most recent + our new one
      localStorage.setItem("products", JSON.stringify([...productsToKeep, newProduct]))
    } else {
      localStorage.setItem("products", JSON.stringify([...products, newProduct]))
    }
    return newProduct
  } catch (error) {
    console.error("Failed to save product:", error)

    // If we hit quota limit, try to save with minimal data
    try {
      // Create a minimal version of the product with less data
      const minimalProduct: Product = {
        ...newProduct,
        description: newProduct.description.substring(0, 100), // Truncate description
        image: "/placeholder.svg?height=192&width=256", // Use placeholder instead of data URL
        options: newProduct.options.slice(0, 3), // Limit to 3 options
      }

      // Remove the oldest product to make space
      if (products.length > 0) {
        const oldestProduct = products.reduce((oldest, current) =>
          new Date(oldest.createdAt).getTime() < new Date(current.createdAt).getTime() ? oldest : current,
        )
        const filteredProducts = products.filter((p) => p.id !== oldestProduct.id)
        localStorage.setItem("products", JSON.stringify([...filteredProducts, minimalProduct]))
        return minimalProduct
      } else {
        localStorage.setItem("products", JSON.stringify([minimalProduct]))
        return minimalProduct
      }
    } catch (fallbackError) {
      // If all else fails, throw a more helpful error
      throw new Error("Storage quota exceeded. Try clearing your browser data or using smaller images.")
    }
  }
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const products = getProducts()
  const index = products.findIndex((product) => product.id === id)

  if (index === -1) return null

  const updatedProduct = { ...products[index], ...updates }
  products[index] = updatedProduct

  localStorage.setItem("products", JSON.stringify(products))
  return updatedProduct
}

export function deleteProduct(id: string): boolean {
  const products = getProducts()
  const filteredProducts = products.filter((product) => product.id !== id)

  if (filteredProducts.length === products.length) return false

  localStorage.setItem("products", JSON.stringify(filteredProducts))
  return true
}

// Categories
export function getCategories(): Category[] {
  if (typeof window === "undefined") return []

  try {
    const categories = localStorage.getItem("categories")
    return categories ? JSON.parse(categories) : []
  } catch (error) {
    console.error("Failed to get categories:", error)
    return []
  }
}

export function getCategoryById(id: string): Category | null {
  const categories = getCategories()
  return categories.find((category) => category.id === id) || null
}

export function createCategory(category: Omit<Category, "id">): Category {
  const categories = getCategories()

  const newCategory: Category = {
    ...category,
    id: `cat-${Date.now()}`,
  }

  localStorage.setItem("categories", JSON.stringify([...categories, newCategory]))
  return newCategory
}

export function updateCategory(id: string, updates: Partial<Category>): Category | null {
  const categories = getCategories()
  const index = categories.findIndex((category) => category.id === id)

  if (index === -1) return null

  const updatedCategory = { ...categories[index], ...updates }
  categories[index] = updatedCategory

  localStorage.setItem("categories", JSON.stringify(categories))
  return updatedCategory
}

export function deleteCategory(id: string): boolean {
  const categories = getCategories()
  const filteredCategories = categories.filter((category) => category.id !== id)

  if (filteredCategories.length === categories.length) return false

  localStorage.setItem("categories", JSON.stringify(filteredCategories))
  return true
}

// Orders
export function getOrders(): Order[] {
  if (typeof window === "undefined") return []

  try {
    const orders = localStorage.getItem("orders")
    return orders ? JSON.parse(orders) : []
  } catch (error) {
    console.error("Failed to get orders:", error)
    return []
  }
}

export function getOrderById(id: string): Order | null {
  const orders = getOrders()
  return orders.find((order) => order.id === id) || null
}

export function createOrder(order: Omit<Order, "id" | "date" | "status">): Order {
  const orders = getOrders()

  const newOrder: Order = {
    ...order,
    id: `order-${Date.now()}`,
    date: new Date().toISOString().split("T")[0],
    status: "pending",
  }

  localStorage.setItem("orders", JSON.stringify([...orders, newOrder]))
  return newOrder
}

export function updateOrder(id: string, updates: Partial<Order>): Order | null {
  const orders = getOrders()
  const index = orders.findIndex((order) => order.id === id)

  if (index === -1) return null

  const updatedOrder = { ...orders[index], ...updates }
  orders[index] = updatedOrder

  localStorage.setItem("orders", JSON.stringify(orders))
  return updatedOrder
}

export function deleteOrder(id: string): boolean {
  const orders = getOrders()
  const filteredOrders = orders.filter((order) => order.id !== id)

  if (filteredOrders.length === orders.length) return false

  localStorage.setItem("orders", JSON.stringify(filteredOrders))
  return true
}

// Users
export function getUsers(): User[] {
  if (typeof window === "undefined") return []

  try {
    const users = localStorage.getItem("users")
    return users ? JSON.parse(users) : []
  } catch (error) {
    console.error("Failed to get users:", error)
    return []
  }
}

export function getUserById(id: string): User | null {
  const users = getUsers()
  return users.find((user) => user.id === id) || null
}

export function getUserByEmail(email: string): User | null {
  const users = getUsers()
  return users.find((user) => user.email === email) || null
}

export function createUser(user: Omit<User, "id">): User {
  const users = getUsers()

  // Check if email already exists
  if (users.some((u) => u.email === user.email)) {
    throw new Error("Email already exists")
  }

  const newUser: User = {
    ...user,
    id: `user-${Date.now()}`,
  }

  localStorage.setItem("users", JSON.stringify([...users, newUser]))
  return newUser
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const users = getUsers()
  const index = users.findIndex((user) => user.id === id)

  if (index === -1) return null

  const updatedUser = { ...users[index], ...updates }
  users[index] = updatedUser

  localStorage.setItem("users", JSON.stringify(users))
  return updatedUser
}

export function deleteUser(id: string): boolean {
  const users = getUsers()
  const filteredUsers = users.filter((user) => user.id !== id)

  if (filteredUsers.length === users.length) return false

  localStorage.setItem("users", JSON.stringify(filteredUsers))
  return true
}

// Authentication
export function loginUser(email: string, password: string): User | null {
  const user = getUserByEmail(email)

  if (!user || user.password !== password) {
    return null
  }

  // Store user session
  localStorage.setItem("currentUser", JSON.stringify(user))
  return user
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  try {
    const currentUser = localStorage.getItem("currentUser")
    return currentUser ? JSON.parse(currentUser) : null
  } catch (error) {
    console.error("Failed to get current user:", error)
    return null
  }
}

export function logoutUser(): void {
  localStorage.removeItem("currentUser")
}

// Admin authentication
export function checkAdminAuth(): boolean {
  if (typeof window === "undefined") return false

  const adminToken = localStorage.getItem("adminToken")
  return !!adminToken
}

export function adminLogin(username: string, password: string): boolean {
  // Get stored admin credentials
  const storedUsername = localStorage.getItem("adminUsername") || "admin"
  const storedPassword = localStorage.getItem("adminPassword") || "admin"

  // Check if credentials match
  if (username === storedUsername && password === storedPassword) {
    localStorage.setItem("adminToken", "admin-token-123")
    return true
  }
  return false
}

export function adminLogout(): void {
  localStorage.removeItem("adminToken")
}

export function updateAdminCredentials(username: string, password: string): boolean {
  if (!username || !password) return false

  localStorage.setItem("adminUsername", username)
  localStorage.setItem("adminPassword", password)
  return true
}

export function getAdminCredentials(): { username: string; password: string } {
  return {
    username: localStorage.getItem("adminUsername") || "admin",
    password: localStorage.getItem("adminPassword") || "admin",
  }
}

// Add a utility function to clear localStorage data
export function clearStorageData(keepAdminAuth = true): boolean {
  if (typeof window === "undefined") return false

  try {
    // Save admin token if needed
    const adminToken = keepAdminAuth ? localStorage.getItem("adminToken") : null

    // Clear all data
    localStorage.clear()

    // Restore admin token if needed
    if (keepAdminAuth && adminToken) {
      localStorage.setItem("adminToken", adminToken)
    }

    // Reinitialize the database with default data
    initializeDb()

    return true
  } catch (error) {
    console.error("Failed to clear storage data:", error)
    return false
  }
}

// Add these interfaces and functions for contact submissions

export interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string
  message: string
  date: string
  isRead: boolean
}

// Get contact submissions
export function getContactSubmissions(): ContactSubmission[] {
  if (typeof window === "undefined") return []

  try {
    const submissions = localStorage.getItem("contactSubmissions")
    return submissions ? JSON.parse(submissions) : []
  } catch (error) {
    console.error("Failed to get contact submissions:", error)
    return []
  }
}

// Create contact submission
export function createContactSubmission(
  submission: Omit<ContactSubmission, "id" | "date" | "isRead">,
): ContactSubmission {
  const submissions = getContactSubmissions()

  const newSubmission: ContactSubmission = {
    ...submission,
    id: `contact-${Date.now()}`,
    date: new Date().toISOString(),
    isRead: false,
  }

  localStorage.setItem("contactSubmissions", JSON.stringify([...submissions, newSubmission]))
  return newSubmission
}

// Mark contact submission as read
export function markContactSubmissionAsRead(id: string): ContactSubmission | null {
  const submissions = getContactSubmissions()
  const index = submissions.findIndex((submission) => submission.id === id)

  if (index === -1) return null

  submissions[index].isRead = true
  localStorage.setItem("contactSubmissions", JSON.stringify(submissions))
  return submissions[index]
}

// Delete contact submission
export function deleteContactSubmission(id: string): boolean {
  const submissions = getContactSubmissions()
  const filteredSubmissions = submissions.filter((submission) => submission.id !== id)

  if (filteredSubmissions.length === submissions.length) return false

  localStorage.setItem("contactSubmissions", JSON.stringify(filteredSubmissions))
  return true
}

