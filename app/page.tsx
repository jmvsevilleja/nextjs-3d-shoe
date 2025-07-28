"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Heart,
  ShoppingCart,
  Star,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { ShoeViewer } from "@/components/ShoeViewer";
import Image from "next/image";

interface MaterialVariant {
  name: string;
  displayName: string;
  variantIndex: number;
  price: number;
}

const materialVariants: MaterialVariant[] = [
  {
    name: "midnight",
    displayName: "Midnight Black",
    variantIndex: 0,
    price: 189,
  },
  { name: "beach", displayName: "Beach Sand", variantIndex: 1, price: 189 },
  { name: "street", displayName: "Street Gray", variantIndex: 2, price: 189 },
];

const sizes = [
  "7",
  "7.5",
  "8",
  "8.5",
  "9",
  "9.5",
  "10",
  "10.5",
  "11",
  "11.5",
  "12",
];

const variantImageMap: { [key: string]: string } = {
  midnight: "/midnight.png",
  beach: "/beach.png",
  street: "/street.png",
};

const variantBgMap: { [key: string]: string } = {
  midnight: "bg-blue-500",
  beach: "bg-pink-400",
  street: "bg-black",
};

export default function ProductPage() {
  const [selectedVariant, setSelectedVariant] = useState<MaterialVariant>(
    materialVariants[0]
  );
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    console.log("Adding to cart:", {
      variant: selectedVariant,
      size: selectedSize,
      quantity,
    });
    // Add to cart logic here
    alert(`Added ${quantity} pair(s) to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">SHOE SHOP</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 3D Viewer */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <ShoeViewer selectedVariant={selectedVariant.name} />
              </CardContent>
            </Card>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2">
              {materialVariants.map((variant, index) => (
                <Card
                  key={variant.name}
                  className={`aspect-square cursor-pointer transition-all hover:shadow-md ${
                    selectedVariant.name === variant.name
                      ? "ring-2 ring-blue-500"
                      : ""
                  }`}
                  onClick={() => setSelectedVariant(variant)}
                >
                  <CardContent className="p-2">
                    <div
                      className={`w-full h-full rounded-md border-2 border-gray-200 ${
                        variantBgMap[variant.name]
                      }`}
                    >
                      <Image
                        src={variantImageMap[variant.name]}
                        alt={variant.name}
                        width={150}
                        height={150}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">New Release</Badge>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    (128 reviews)
                  </span>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Urban Runner Pro
              </h1>

              <p className="text-gray-600 mb-4">
                Premium athletic footwear designed for comfort and style.
                Features advanced cushioning technology and durable construction
                for everyday wear.
              </p>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  ${selectedVariant.price}
                </span>
                <span className="text-lg text-gray-500 line-through">$249</span>
                <Badge variant="destructive">24% OFF</Badge>
              </div>
            </div>

            <Separator />

            {/* Color Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Color: {selectedVariant.displayName}
              </h3>
              <div className="flex gap-5">
                {materialVariants.map((variant) => (
                  <button
                    key={variant.name}
                    onClick={() => setSelectedVariant(variant)}
                    className={`relative h-16 w-16 rounded-lg border-2 transition-all hover:scale-105 ${
                      variantBgMap[variant.name]
                    }`}
                  >
                    <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium">
                      {variant.displayName.split(" ")[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Size</h3>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {sizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      US {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="text-lg font-medium w-8 text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                className="w-full h-12 text-lg font-semibold"
                disabled={!selectedSize}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>

              <Button
                variant="outline"
                className="w-full h-12"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart
                  className={`mr-2 h-5 w-5 ${
                    isWishlisted ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
              </Button>
            </div>

            <Separator />

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Free Shipping</p>
                  <p className="text-sm text-gray-600">On orders over $75</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">2-Year Warranty</p>
                  <p className="text-sm text-gray-600">
                    Full coverage included
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Easy Returns</p>
                  <p className="text-sm text-gray-600">30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Product Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Features</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Advanced cushioning technology</li>
                    <li>• Breathable mesh upper</li>
                    <li>• Durable rubber outsole</li>
                    <li>• Lightweight construction</li>
                    <li>• Memory foam insole</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Care Instructions</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Clean with damp cloth</li>
                    <li>• Air dry only</li>
                    <li>• Avoid direct sunlight</li>
                    <li>• Store in cool, dry place</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
