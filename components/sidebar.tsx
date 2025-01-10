'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { BarChart3, LayoutDashboard, Settings, ShoppingCart, Store, TrendingUp, Users } from 'lucide-react'

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    label: 'Demand Analysis',
    icon: TrendingUp,
    href: '/demand-analysis',
  },
  {
    label: 'Scenario Analysis',
    icon: BarChart3,
    href: '/scenario-analysis',
  },
  {
    label: 'Products',
    icon: ShoppingCart,
    href: '/products',
  },
  {
    label: 'Stores',
    icon: Store,
    href: '/stores',
  },
  {
    label: 'Users',
    icon: Users,
    href: '/users',
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/settings',
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex h-full w-64 flex-col fixed inset-y-0">
      <div className="flex flex-col flex-grow border-r bg-white pt-5 pb-4">
        <div className="flex items-center flex-shrink-0 px-4">
         <img
            className="h-8 w-auto"
            src="https://upload.wikimedia.org/wikipedia/en/6/6a/Swiggy_logo.svg"
            alt="Swiggy Logo"
          />
        </div>
        <div className="mt-8 flex-grow flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  'group flex items-center px-4 py-2 text-sm font-medium rounded-md',
                  pathname === route.href
                    ? 'bg-orange-100 text-orange-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <route.icon
                  className={cn(
                    'mr-3 h-5 w-5',
                    pathname === route.href
                      ? 'text-orange-600'
                      : 'text-gray-400 group-hover:text-gray-500'
                  )}
                />
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}

