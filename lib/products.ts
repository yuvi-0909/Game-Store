// Mock product data - in a real app, this would come from a database
export interface Product {
  id: string
  title: string
  image: string
  minPrice: number
  maxPrice: number
  rating: number
  inStock: boolean
  onSale: boolean
  category: string
  options?: ProductOption[]
}

export interface ProductOption {
  id: string
  name: string
  price: number
  inStock: boolean
}

const products: Product[] = [
  {
    id: "free-fire-uid",
    title: "Free Fire UID Topup BD/NP Server",
    image: "/placeholder.svg?height=192&width=256",
    minPrice: 27,
    maxPrice: 7999,
    rating: 4.5,
    inStock: true,
    onSale: true,
    category: "mobile-games",
    options: [
      { id: "ff-1", name: "100 Diamonds", price: 27, inStock: true },
      { id: "ff-2", name: "310 Diamonds", price: 80, inStock: true },
      { id: "ff-3", name: "520 Diamonds", price: 135, inStock: true },
      { id: "ff-4", name: "1060 Diamonds", price: 270, inStock: true },
      { id: "ff-5", name: "2180 Diamonds", price: 540, inStock: true },
      { id: "ff-6", name: "5600 Diamonds", price: 1350, inStock: true },
      { id: "ff-7", name: "11200 Diamonds", price: 2700, inStock: true },
      { id: "ff-8", name: "Weekly Membership", price: 135, inStock: true },
      { id: "ff-9", name: "Monthly Membership", price: 540, inStock: true },
      { id: "ff-10", name: "Level Up Pass", price: 270, inStock: true },
    ],
  },
  {
    id: "pubg-mobile-uc",
    title: "Pubg Mobile UC Topup (Global)",
    image: "/placeholder.svg?height=192&width=256",
    minPrice: 135,
    maxPrice: 13499,
    rating: 5,
    inStock: false,
    onSale: true,
    category: "mobile-games",
    options: [
      { id: "pubg-1", name: "60 UC", price: 135, inStock: false },
      { id: "pubg-2", name: "325 UC", price: 675, inStock: false },
      { id: "pubg-3", name: "660 UC", price: 1350, inStock: false },
      { id: "pubg-4", name: "1800 UC", price: 3375, inStock: false },
      { id: "pubg-5", name: "3850 UC", price: 6750, inStock: false },
      { id: "pubg-6", name: "8100 UC", price: 13499, inStock: false },
    ],
  },
  {
    id: "mobile-legends",
    title: "Mobile Legends Topup (Global)",
    image: "/placeholder.svg?height=192&width=256",
    minPrice: 130,
    maxPrice: 6599,
    rating: 5,
    inStock: false,
    onSale: true,
    category: "mobile-games",
    options: [
      { id: "ml-1", name: "86 Diamonds", price: 130, inStock: false },
      { id: "ml-2", name: "172 Diamonds", price: 260, inStock: false },
      { id: "ml-3", name: "257 Diamonds", price: 390, inStock: false },
      { id: "ml-4", name: "706 Diamonds", price: 1040, inStock: false },
      { id: "ml-5", name: "2195 Diamonds", price: 3120, inStock: false },
      { id: "ml-6", name: "4394 Diamonds", price: 6599, inStock: false },
    ],
  },
  {
    id: "free-fire-indonesia",
    title: "Free Fire Indonesia Server Topup",
    image: "/placeholder.svg?height=192&width=256",
    minPrice: 10,
    maxPrice: 1080,
    rating: 5,
    inStock: true,
    onSale: true,
    category: "mobile-games",
    options: [
      { id: "ffi-1", name: "5 Diamonds", price: 10, inStock: true },
      { id: "ffi-2", name: "12 Diamonds", price: 20, inStock: true },
      { id: "ffi-3", name: "50 Diamonds", price: 80, inStock: true },
      { id: "ffi-4", name: "140 Diamonds", price: 220, inStock: true },
      { id: "ffi-5", name: "355 Diamonds", price: 540, inStock: true },
      { id: "ffi-6", name: "720 Diamonds", price: 1080, inStock: true },
    ],
  },
  {
    id: "call-of-duty-mobile",
    title: "Call of Duty Mobile CP",
    image: "/placeholder.svg?height=192&width=256",
    minPrice: 135,
    maxPrice: 6750,
    rating: 4.5,
    inStock: true,
    onSale: false,
    category: "mobile-games",
    options: [
      { id: "cod-1", name: "80 CP", price: 135, inStock: true },
      { id: "cod-2", name: "400 CP", price: 675, inStock: true },
      { id: "cod-3", name: "800 CP", price: 1350, inStock: true },
      { id: "cod-4", name: "2000 CP", price: 3375, inStock: true },
      { id: "cod-5", name: "4000 CP", price: 6750, inStock: true },
    ],
  },
  {
    id: "steam-wallet-code",
    title: "Steam Wallet Code (Global)",
    image: "/placeholder.svg?height=192&width=256",
    minPrice: 1350,
    maxPrice: 13500,
    rating: 5,
    inStock: true,
    onSale: false,
    category: "gift-cards",
    options: [
      { id: "steam-1", name: "$10 Steam Wallet", price: 1350, inStock: true },
      { id: "steam-2", name: "$20 Steam Wallet", price: 2700, inStock: true },
      { id: "steam-3", name: "$50 Steam Wallet", price: 6750, inStock: true },
      { id: "steam-4", name: "$100 Steam Wallet", price: 13500, inStock: true },
    ],
  },
  {
    id: "google-play-gift-card",
    title: "Google Play Gift Card (US)",
    image: "/placeholder.svg?height=192&width=256",
    minPrice: 1350,
    maxPrice: 13500,
    rating: 5,
    inStock: true,
    onSale: false,
    category: "gift-cards",
    options: [
      { id: "gp-1", name: "$10 Google Play", price: 1350, inStock: true },
      { id: "gp-2", name: "$25 Google Play", price: 3375, inStock: true },
      { id: "gp-3", name: "$50 Google Play", price: 6750, inStock: true },
      { id: "gp-4", name: "$100 Google Play", price: 13500, inStock: true },
    ],
  },
  {
    id: "netflix-gift-card",
    title: "Netflix Gift Card (Global)",
    image: "/placeholder.svg?height=192&width=256",
    minPrice: 1350,
    maxPrice: 6750,
    rating: 4.5,
    inStock: true,
    onSale: false,
    category: "subscription",
    options: [
      { id: "nf-1", name: "$10 Netflix", price: 1350, inStock: true },
      { id: "nf-2", name: "$25 Netflix", price: 3375, inStock: true },
      { id: "nf-3", name: "$50 Netflix", price: 6750, inStock: true },
    ],
  },
]

export async function getProducts(): Promise<Product[]> {
  // In a real app, this would fetch from a database
  return products
}

export async function getProductById(id: string): Promise<Product | undefined> {
  return products.find((product) => product.id === id)
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  if (category === "all") {
    return products
  }
  return products.filter((product) => product.category === category)
}

