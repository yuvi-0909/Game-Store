import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"

interface ProductProps {
  product: {
    id: string
    title: string
    image: string
    minPrice: number
    maxPrice: number
    rating: number
    inStock: boolean
    onSale: boolean
  }
}

export default function ProductCard({ product }: ProductProps) {
  return (
    <div className="product-card">
      {product.onSale && <span className="sale-badge">Sale!</span>}

      <div className="relative">
        <div className="product-image">
          <Image
            src={product.image || "/placeholder.svg?height=192&width=256"}
            alt={product.title}
            fill
            className="object-cover"
          />
        </div>

        {!product.inStock && <div className="out-of-stock">OUT OF STOCK</div>}
      </div>

      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>

        <div className="product-rating">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-3 w-3 ${i < product.rating ? "fill-yellow-400" : "fill-gray-300"}`} />
          ))}
        </div>

        <p className="product-price">
          NPR {product.minPrice} {product.maxPrice > product.minPrice && `– NPR ${product.maxPrice}`}
        </p>

        <Link href={`/product/${product.id}`} className="select-btn block text-center">
          Select options
        </Link>
      </div>
    </div>
  )
}

