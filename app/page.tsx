"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"
import { type Product, getProducts, initializeDb } from "@/lib/db"

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize the mock database
    initializeDb()

    // Get products
    const allProducts = getProducts()
    setProducts(allProducts)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading products...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Featured Products */}
      <section className="mb-16">
        <h2 className="section-title">
          Featured <span className="text-primary">Products</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products
            .filter((product) => product.featured)
            .map((product) => (
              <div key={product.id} className="product-card">
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
                      <Star key={i} className={`h-3 w-3 ${i < 4 ? "fill-yellow-400" : "fill-gray-300"}`} />
                    ))}
                  </div>

                  <p className="product-price">
                    {product.options.length > 0 && (
                      <>
                        {product.options.reduce((min, option) => Math.min(min, option.price), Number.POSITIVE_INFINITY)}
                        {" - "}
                        {product.options.reduce((max, option) => Math.max(max, option.price), 0)}
                      </>
                    )}
                  </p>

                  <Link href={`/product/${product.id}`} className="select-btn block text-center">
                    Select options
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* All Products */}
      <section className="mb-16">
        <h2 className="section-title">
          All <span className="text-primary">Products</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="product-card">
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
                    <Star key={i} className={`h-3 w-3 ${i < 4 ? "fill-yellow-400" : "fill-gray-300"}`} />
                  ))}
                </div>

                <p className="product-price">
                  {product.options.length > 0 && (
                    <>
                      {product.options.reduce((min, option) => Math.min(min, option.price), Number.POSITIVE_INFINITY)}
                      {" - "}
                      {product.options.reduce((max, option) => Math.max(max, option.price), 0)}
                    </>
                  )}
                </p>

                <Link href={`/product/${product.id}`} className="select-btn block text-center">
                  Select options
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

