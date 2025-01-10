'use client'

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus } from 'lucide-react'

const products = [
  {
    id: 1,
    name: "Fresh Milk",
    category: "Dairy",
    price: "₹60",
    stock: 234,
    status: "In Stock",
  },
  {
    id: 2,
    name: "Whole Wheat Bread",
    category: "Bakery",
    price: "₹45",
    stock: 123,
    status: "Low Stock",
  },
  {
    id: 3,
    name: "Farm Fresh Eggs",
    category: "Dairy",
    price: "₹90",
    stock: 0,
    status: "Out of Stock",
  },
  {
    id: 4,
    name: "Organic Bananas",
    category: "Fruits",
    price: "₹40",
    stock: 456,
    status: "In Stock",
  },
  {
    id: 5,
    name: "Fresh Tomatoes",
    category: "Vegetables",
    price: "₹30",
    stock: 78,
    status: "Low Stock",
  },
]

export default function ProductsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <div
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.status === 'In Stock'
                        ? 'bg-green-100 text-green-800'
                        : product.status === 'Low Stock'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {product.status}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

