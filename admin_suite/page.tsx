'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Script from 'next/script'
import {
  Plus,
  Edit2,
  Trash2,
  LogOut,
  ShoppingBag,
  Layers,
  Users,
  CheckCircle,
  FileText,
  DollarSign,
  ChevronRight,
  TrendingUp,
  Tag as TagIcon,
  X,
  RefreshCw,
  Search,
  Sliders,
  Settings,
  Store,
  Clock,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Percent,
  Eye,
  Check,
  AlertCircle,
  PackageCheck,
  Truck,
  ShieldCheck,
  Image as ImageIcon,
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────
export interface Product {
  id: number
  name: string
  description: string | null
  price: string | number
  original_price?: string | number | null
  discount_percent?: string | number | null
  image_path: string | null
  tag: string | null
  category_id: number | null
  category_name?: string | null
  is_available: boolean
  created_at?: string
}

export interface Category {
  id: number
  name: string
  description: string | null
}

export interface OrderItem {
  id: number
  product_id: number
  product_name?: string
  quantity: number
  unit_price: string | number
}

export interface Order {
  id: number
  customer_id: number
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  total_amount: string | number
  status: 'pending' | 'preparing' | 'delivered' | 'cancelled' | string
  delivery_address: string | null
  notes: string | null
  created_at: string
  items?: OrderItem[]
}

export interface Customer {
  id: number
  name: string
  email: string
  phone: string | null
  address: string | null
  created_at: string
}

export interface StoreSettings {
  announcementEnabled: boolean
  announcementText: string
  announcementBadge: string
  storeStatus: 'open' | 'busy' | 'closed'
  closedMessage: string
  heroHeadline: string
  heroSubheadline: string
  deliveryFee: number
  freeDeliveryThreshold: number
  bakeryPhone: string
  bakeryEmail: string
  bakeryAddress: string
  bakeryHours: string
  instagramUrl: string
  whatsappNumber: string
}

const DEFAULT_SETTINGS: StoreSettings = {
  announcementEnabled: true,
  announcementText: '✨ Festive Season Special: Enjoy 20% OFF on all signature Rasmalai & Fusion cakes!',
  announcementBadge: 'LIMITED TIME',
  storeStatus: 'open',
  closedMessage: 'We are currently baking fresh batches. Taking pre-orders for tomorrow!',
  heroHeadline: 'Artisanal Indian Fusion Bakery',
  heroSubheadline: 'Handcrafted pastries, saffron-infused cakes, and artisanal sweets made fresh daily.',
  deliveryFee: 50,
  freeDeliveryThreshold: 500,
  bakeryPhone: '+91 98765 43210',
  bakeryEmail: 'orders@thegulabibaker.com',
  bakeryAddress: 'Shop 14, Heritage Lane, Gulabi Nagar, Ahmedabad, Gujarat',
  bakeryHours: 'Mon – Sun: 9:00 AM – 10:00 PM',
  instagramUrl: 'https://instagram.com/thegulabibaker',
  whatsappNumber: '+919876543210',
}

const PRESET_IMAGES = [
  { label: 'Rasmalai Cake', path: '/Rasmalai2.0.png' },
  { label: 'Gulab Jamun Cupcake', path: '/Gulabjamuncupcake.png' },
  { label: 'Masala Chai Cake', path: '/Masalachaicake.png' },
  { label: 'Bakery Hero Showcase', path: '/bakery-hero.png' },
  { label: 'Mango Mawa Tart', path: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=900&q=85' },
  { label: 'Cardamom Buns', path: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=85' },
  { label: 'Pistachio Eclair', path: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=85' },
  { label: 'Kesar Macarons', path: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=900&q=85' },
]

const PRESET_TAGS = [
  'Best seller',
  'Festive Offer',
  '20% OFF',
  '30% OFF',
  '50% OFF',
  'New',
  'Chef Special',
  'Seasonal',
  'Diwali Special',
  'Eggless',
]

export default function AdminPage() {
  // ── Auth state ──
  const [adminToken, setAdminToken] = useState<string | null>(null)
  const [adminUser, setAdminUser] = useState<any>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState<string | null>(null)
  const [loginLoading, setLoginLoading] = useState(false)

  // ── Tabs ──
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'orders' | 'customers' | 'settings'>('products')

  // ── Data states ──
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS)
  const [settingsSavedToast, setSettingsSavedToast] = useState(false)

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all')

  // ── Product CRUD Modal/Form state ──
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [prodName, setProdName] = useState('')
  const [prodOriginalPrice, setProdOriginalPrice] = useState('')
  const [prodDiscountPercent, setProdDiscountPercent] = useState('')
  const [prodPrice, setProdPrice] = useState('')
  const [prodDesc, setProdDesc] = useState('')
  const [prodTag, setProdTag] = useState('')
  const [prodCatId, setProdCatId] = useState('')
  const [prodImgPath, setProdImgPath] = useState('')
  const [prodIsAvailable, setProdIsAvailable] = useState(true)

  // ── Category Modal state ──
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [catName, setCatName] = useState('')
  const [catDesc, setCatDesc] = useState('')

  // ── View order detail modal state ──
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // ── Load Token & Settings on Mount ──
  useEffect(() => {
    const token = localStorage.getItem('gulabi_admin_token')
    const user = localStorage.getItem('gulabi_admin_info')
    if (token && user) {
      setAdminToken(token)
      try {
        setAdminUser(JSON.parse(user))
      } catch (e) {
        setAdminUser({ name: 'Admin', email: 'owner@gulabi.com' })
      }
    }

    const savedSettings = localStorage.getItem('gulabi_store_settings')
    if (savedSettings) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) })
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  // ── Fetch Data ──
  const fetchData = async () => {
    if (!adminToken) return
    setLoading(true)
    setErrorMsg(null)
    try {
      const headers = { Authorization: `Bearer ${adminToken}` }

      // Always fetch categories for modal dropdowns and category filter
      const catRes = await fetch('/api/admin/categories', { headers }).catch(() => null)
      if (catRes && catRes.ok) {
        const catData = await catRes.json()
        setCategories(catData.categories || [])
      }

      if (activeTab === 'products') {
        const res = await fetch('/api/admin/products', { headers }).catch(() => null)
        if (res && res.ok) {
          const data = await res.json()
          setProducts(data.products || [])
        }
      } else if (activeTab === 'categories') {
        const res = await fetch('/api/admin/categories', { headers }).catch(() => null)
        if (res && res.ok) {
          const data = await res.json()
          setCategories(data.categories || [])
        }
      } else if (activeTab === 'orders') {
        const res = await fetch('/api/admin/orders', { headers }).catch(() => null)
        if (res && res.ok) {
          const data = await res.json()
          const sorted = (data.orders || []).sort(
            (a: Order, b: Order) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
          setOrders(sorted)
        }
      } else if (activeTab === 'customers') {
        const res = await fetch('/api/admin/customers', { headers }).catch(() => null)
        if (res && res.ok) {
          const data = await res.json()
          setCustomers(data.customers || [])
        }
      }
    } catch (err: any) {
      setErrorMsg('Failed to sync data with backend server.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [adminToken, activeTab])

  // ── Login handler ──
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError(null)
    setLoginLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Login failed. Invalid credentials.')
      }

      setAdminToken(data.token)
      setAdminUser(data.admin)
      localStorage.setItem('gulabi_admin_token', data.token)
      localStorage.setItem('gulabi_admin_info', JSON.stringify(data.admin))
    } catch (err: any) {
      setLoginError(err.message || 'Connection error. Make sure your backend server is running on port 5000.')
    } finally {
      setLoginLoading(false)
    }
  }

  // ── Google Admin Login handler ──
  const handleGoogleAdminLogin = async (response: any) => {
    setLoginLoading(true)
    setLoginError(null)
    try {
      const res = await fetch('/api/admin/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Google admin login failed.')
      }
      setAdminToken(data.token)
      setAdminUser(data.admin)
      localStorage.setItem('gulabi_admin_token', data.token)
      localStorage.setItem('gulabi_admin_info', JSON.stringify(data.admin))
    } catch (err: any) {
      setLoginError(err.message || 'Error signing in as owner.')
    } finally {
      setLoginLoading(false)
    }
  }

  useEffect(() => {
    if (!adminToken && typeof window !== 'undefined') {
      const initGsi = () => {
        const google = (window as any).google
        if (!google) return

        const clientId =
          process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
          '158913926839-placeholderclientid.apps.googleusercontent.com'
        google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleAdminLogin,
        })

        const btnContainer = document.getElementById('google-admin-signin-btn')
        if (btnContainer) {
          google.accounts.id.renderButton(btnContainer, {
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            shape: 'pill',
            width: 320,
          })
        }
      }

      if ((window as any).google) {
        initGsi()
      } else {
        const timer = setTimeout(initGsi, 500)
        return () => clearTimeout(timer)
      }
    }
  }, [adminToken])

  // ── Logout ──
  const handleLogout = () => {
    setAdminToken(null)
    setAdminUser(null)
    localStorage.removeItem('gulabi_admin_token')
    localStorage.removeItem('gulabi_admin_info')
  }

  // ── Discount Calculator Helpers ──
  const applyDiscountPercent = (percent: number) => {
    const orig = parseFloat(prodOriginalPrice || prodPrice)
    if (isNaN(orig) || orig <= 0) return

    if (!prodOriginalPrice) {
      setProdOriginalPrice(orig.toString())
    }

    if (percent === 0) {
      setProdDiscountPercent('')
      setProdPrice(orig.toString())
      return
    }

    const discounted = Math.round(orig * (1 - percent / 100) * 100) / 100
    setProdDiscountPercent(percent.toString())
    setProdPrice(discounted.toString())
    setProdTag(`${percent}% OFF`)
  }

  const handleOriginalPriceChange = (val: string) => {
    setProdOriginalPrice(val)
    const orig = parseFloat(val)
    const disc = parseFloat(prodDiscountPercent)
    if (!isNaN(orig) && orig > 0 && !isNaN(disc) && disc > 0) {
      const discounted = Math.round(orig * (1 - disc / 100) * 100) / 100
      setProdPrice(discounted.toString())
    } else if (!prodPrice || !prodDiscountPercent) {
      setProdPrice(val)
    }
  }

  const handleDiscountPercentChange = (val: string) => {
    setProdDiscountPercent(val)
    const disc = parseFloat(val)
    const orig = parseFloat(prodOriginalPrice || prodPrice)
    if (!isNaN(orig) && orig > 0 && !isNaN(disc) && disc >= 0 && disc <= 100) {
      if (!prodOriginalPrice) setProdOriginalPrice(orig.toString())
      const discounted = Math.round(orig * (1 - disc / 100) * 100) / 100
      setProdPrice(discounted.toString())
    }
  }

  const handlePriceChange = (val: string) => {
    setProdPrice(val)
    const finalP = parseFloat(val)
    const orig = parseFloat(prodOriginalPrice)
    if (!isNaN(orig) && orig > 0 && !isNaN(finalP) && finalP < orig) {
      const disc = Math.round(((orig - finalP) / orig) * 100)
      setProdDiscountPercent(disc.toString())
    }
  }

  // ── Open Modals ──
  const openAddProduct = () => {
    setEditingProduct(null)
    setProdName('')
    setProdOriginalPrice('')
    setProdDiscountPercent('')
    setProdPrice('')
    setProdDesc('')
    setProdTag('')
    setProdCatId(categories[0]?.id?.toString() || '')
    setProdImgPath('/Rasmalai2.0.png')
    setProdIsAvailable(true)
    setIsProductModalOpen(true)
  }

  const openEditProduct = (prod: Product) => {
    setEditingProduct(prod)
    setProdName(prod.name)
    setProdOriginalPrice(prod.original_price ? parseFloat(prod.original_price as string).toString() : '')
    setProdDiscountPercent(prod.discount_percent ? prod.discount_percent.toString() : '')
    setProdPrice(parseFloat(prod.price as string).toString())
    setProdDesc(prod.description || '')
    setProdTag(prod.tag || '')
    setProdCatId(prod.category_id?.toString() || '')
    setProdImgPath(prod.image_path || '')
    setProdIsAvailable(prod.is_available)
    setIsProductModalOpen(true)
  }

  // ── Quick Toggle Product Availability ──
  const handleToggleProductAvailability = async (prod: Product) => {
    const newStatus = !prod.is_available
    // Optimistic UI update
    setProducts((prev) => prev.map((p) => (p.id === prod.id ? { ...p, is_available: newStatus } : p)))

    try {
      await fetch(`/api/admin/products/${prod.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          ...prod,
          is_available: newStatus,
        }),
      })
    } catch (e) {
      console.error(e)
    }
  }

  // ── Save Product (Create / Update) ──
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    const payload = {
      name: prodName,
      price: parseFloat(prodPrice),
      original_price: prodOriginalPrice ? parseFloat(prodOriginalPrice) : null,
      discount_percent: prodDiscountPercent ? parseFloat(prodDiscountPercent) : null,
      description: prodDesc || null,
      tag: prodTag || null,
      category_id: prodCatId ? parseInt(prodCatId) : null,
      image_path: prodImgPath || null,
      is_available: prodIsAvailable,
    }

    try {
      const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products'
      const method = editingProduct ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save product.')
      }

      // Re-fetch list
      const updatedRes = await fetch('/api/admin/products', {
        headers: { Authorization: `Bearer ${adminToken}` },
      })
      const updatedData = await updatedRes.json()
      if (updatedRes.ok) setProducts(updatedData.products || [])

      setIsProductModalOpen(false)
      setEditingProduct(null)
    } catch (err: any) {
      alert(err.message)
    }
  }

  // ── Delete Product ──
  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this sweet treat?')) return

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete product.')
      }

      setProducts(products.filter((p) => p.id !== id))
    } catch (err: any) {
      alert(err.message)
    }
  }

  // ── Category CRUD ──
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      name: catName,
      description: catDesc || null,
    }

    try {
      const url = editingCategory ? `/api/admin/categories/${editingCategory.id}` : '/api/admin/categories'
      const method = editingCategory ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save category.')
      }

      const updatedRes = await fetch('/api/admin/categories', {
        headers: { Authorization: `Bearer ${adminToken}` },
      })
      const updatedData = await updatedRes.json()
      if (updatedRes.ok) setCategories(updatedData.categories || [])

      setIsCategoryModalOpen(false)
      setEditingCategory(null)
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Deleting this category may unassign it from products. Continue?')) return

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete category.')
      }

      setCategories(categories.filter((c) => c.id !== id))
    } catch (err: any) {
      alert(err.message)
    }
  }

  // ── Update Order Status ──
  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update order status.')
      }

      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status } : o)))
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status })
      }
    } catch (err: any) {
      alert(err.message)
    }
  }

  // ── Save Store Settings ──
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('gulabi_store_settings', JSON.stringify(settings))
    // Dispatch custom event so other open tabs/storefront can instantly receive updates
    window.dispatchEvent(new Event('gulabi_settings_updated'))
    setSettingsSavedToast(true)
    setTimeout(() => setSettingsSavedToast(false), 3500)
  }

  // ── Metrics / KPIs ──
  const metrics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => {
      if (o.status !== 'cancelled') {
        return sum + (typeof o.total_amount === 'number' ? o.total_amount : parseFloat(o.total_amount as string) || 0)
      }
      return sum
    }, 0)

    const activeOrdersCount = orders.filter((o) => o.status === 'pending' || o.status === 'preparing').length
    const availableProducts = products.filter((p) => p.is_available).length
    const totalCustomers = customers.length

    return {
      totalRevenue,
      activeOrdersCount,
      totalOrders: orders.length,
      availableProducts,
      totalProducts: products.length,
      totalCustomers,
    }
  }, [orders, products, customers])

  // ── Filtered Products ──
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.tag && p.tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory =
        categoryFilter === 'all' || p.category_id?.toString() === categoryFilter || p.category_name === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [products, searchQuery, categoryFilter])

  // ── Filtered Orders ──
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = orderStatusFilter === 'all' || o.status.toLowerCase() === orderStatusFilter.toLowerCase()
      const matchesSearch =
        searchQuery === '' ||
        o.id.toString().includes(searchQuery) ||
        (o.customer_name && o.customer_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (o.customer_email && o.customer_email.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesStatus && matchesSearch
    })
  }, [orders, orderStatusFilter, searchQuery])

  // ── Render: Login Portal ──────────────────────────────────────────
  if (!adminToken) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-stone-950 p-4 text-stone-100 selection:bg-rose-500 selection:text-white">
        <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
        <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-stone-900/90 border border-stone-800 p-8 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-bold uppercase tracking-widest mb-3">
              <Sparkles size={13} /> The Gulabi Baker Portal
            </div>
            <h1 className="font-serif text-3xl font-bold text-stone-50 tracking-tight">Owner & Admin Access</h1>
            <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
              Full live control over bakery products, special offers, menu categories, customer orders, and site banner announcements.
            </p>
          </div>

          {loginError && (
            <div className="mb-5 rounded-2xl bg-red-500/10 border border-red-500/20 p-3.5 text-xs text-red-400 font-medium flex items-center gap-2.5">
              <AlertCircle size={16} className="shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5" htmlFor="admin-email">
                Admin Email
              </label>
              <input
                required
                id="admin-email"
                type="email"
                placeholder="devanshi / deep / parthiv@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-stone-800 bg-stone-950/60 px-4 py-3 text-sm text-stone-100 outline-none ring-rose-500/40 focus:ring-2 placeholder:text-stone-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5" htmlFor="admin-password">
                Secret Password
              </label>
              <input
                required
                id="admin-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-stone-800 bg-stone-950/60 px-4 py-3 text-sm text-stone-100 outline-none ring-rose-500/40 focus:ring-2 placeholder:text-stone-600 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-semibold text-sm transition-all shadow-lg shadow-rose-950/50 active:scale-[0.98] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loginLoading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <ShieldCheck size={16} /> Enter Management Suite
                </>
              )}
            </button>
          </form>

          {/* Google Sign-In */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-stone-800" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Or Owner Auth</span>
            <div className="flex-1 h-px bg-stone-800" />
          </div>

          <div className="flex flex-col items-center justify-center py-2 bg-stone-950/40 rounded-2xl border border-stone-800/80">
            <div id="google-admin-signin-btn" className="w-full flex justify-center"></div>
          </div>

          {/* Quick Demo Bypass for Instant Testing */}
          <div className="mt-5 pt-4 border-t border-stone-800/60 text-center">
            <button
              type="button"
              onClick={() => {
                const demoToken = 'demo-admin-jwt-token'
                const demoUser = { name: 'Gulabi Owner', email: 'owner@thegulabibaker.com' }
                setAdminToken(demoToken)
                setAdminUser(demoUser)
                localStorage.setItem('gulabi_admin_token', demoToken)
                localStorage.setItem('gulabi_admin_info', JSON.stringify(demoUser))
              }}
              className="text-xs text-stone-500 hover:text-rose-400 transition-colors font-medium cursor-pointer"
            >
              ⚡ Instant Offline Preview Mode (Demo Login)
            </button>
          </div>
        </div>
      </main>
    )
  }

  // ── Render: Admin Dashboard ───────────────────────────────────────
  return (
    <main className="min-h-screen bg-stone-950 text-stone-100 flex flex-col md:flex-row selection:bg-rose-500 selection:text-white">
      {/* ── SIDEBAR NAVIGATION ── */}
      <aside className="w-full md:w-72 bg-stone-900/90 border-b md:border-b-0 md:border-r border-stone-800 p-6 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2.5">
              <span className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white font-serif font-bold text-lg shadow-md shadow-rose-900/30">
                G
              </span>
              <div>
                <h2 className="font-serif text-xl font-bold tracking-tight text-stone-50 leading-none">
                  Gulabi Baker<span className="text-rose-500">.</span>
                </h2>
                <p className="text-[11px] text-stone-400 font-medium mt-1">Master Control Room</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => {
                setActiveTab('products')
                setSearchQuery('')
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/40'
                  : 'text-stone-400 hover:bg-stone-800 hover:text-stone-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} /> Products & Treats
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-stone-950/40 font-mono">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('categories')
                setSearchQuery('')
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/40'
                  : 'text-stone-400 hover:bg-stone-800 hover:text-stone-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers size={18} /> Menu Categories
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-stone-950/40 font-mono">
                {categories.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('orders')
                setSearchQuery('')
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/40'
                  : 'text-stone-400 hover:bg-stone-800 hover:text-stone-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText size={18} /> Orders & Kitchen
              </div>
              {metrics.activeOrdersCount > 0 && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 font-bold animate-pulse">
                  {metrics.activeOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('customers')
                setSearchQuery('')
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'customers'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/40'
                  : 'text-stone-400 hover:bg-stone-800 hover:text-stone-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users size={18} /> Customer Directory
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-stone-950/40 font-mono">
                {customers.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('settings')
                setSearchQuery('')
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/40'
                  : 'text-stone-400 hover:bg-stone-800 hover:text-stone-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sliders size={18} /> Storefront Settings
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            </button>
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="mt-8 border-t border-stone-800 pt-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center font-bold text-rose-300 text-sm uppercase shrink-0">
              {adminUser?.name?.slice(0, 2) || 'AD'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-stone-100 truncate">{adminUser?.name || 'Store Owner'}</p>
              <p className="text-[11px] text-stone-500 truncate">{adminUser?.email || 'owner@thegulabibaker.com'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl border border-stone-800 text-xs font-bold text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all cursor-pointer"
          >
            <LogOut size={14} /> Log Out Portal
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <section className="flex-1 p-6 md:p-10 max-w-7xl overflow-y-auto">
        {/* Top KPI Metrics Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-3xl bg-stone-900/60 border border-stone-800 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <DollarSign size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Gross Sales</p>
              <p className="text-xl font-extrabold text-stone-100 font-mono mt-0.5">
                ${metrics.totalRevenue.toFixed(0)}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-3xl bg-stone-900/60 border border-stone-800 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShoppingBag size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Catalog Items</p>
              <p className="text-xl font-extrabold text-stone-100 font-mono mt-0.5">
                {metrics.availableProducts} <span className="text-xs text-stone-500">/ {metrics.totalProducts} active</span>
              </p>
            </div>
          </div>

          <div className="p-4 rounded-3xl bg-stone-900/60 border border-stone-800 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Active Orders</p>
              <p className="text-xl font-extrabold text-stone-100 font-mono mt-0.5">
                {metrics.activeOrdersCount} <span className="text-xs text-stone-500">pending</span>
              </p>
            </div>
          </div>

          <div className="p-4 rounded-3xl bg-stone-900/60 border border-stone-800 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Users size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Registered Users</p>
              <p className="text-xl font-extrabold text-stone-100 font-mono mt-0.5">
                {metrics.totalCustomers}
              </p>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-stone-50 capitalize">
              {activeTab === 'settings' ? 'Storefront & Announcement Controls' : `${activeTab} Management`}
            </h1>
            <p className="text-xs text-stone-400 mt-1 leading-relaxed">
              {activeTab === 'products' && 'Add new pastry creations, configure discount sales %, tags, and manage live menu availability.'}
              {activeTab === 'categories' && 'Create and organize dessert collections (e.g. Signature Cakes, Festive Rolls, Cupcakes).'}
              {activeTab === 'orders' && 'Real-time kitchen order dispatch, delivery status updater, and customer request inspection.'}
              {activeTab === 'customers' && 'View registered patrons, phone numbers, delivery addresses, and order histories.'}
              {activeTab === 'settings' && 'Customize hero taglines, top promotional banner message, delivery charges, and contact info.'}
            </p>
          </div>

          {/* Action Buttons Header */}
          <div className="flex items-center gap-3">
            {activeTab === 'products' && (
              <button
                onClick={openAddProduct}
                className="px-5 py-3 rounded-full bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-rose-950/40 transition-all active:scale-98 cursor-pointer"
              >
                <Plus size={16} /> Add New Product
              </button>
            )}

            {activeTab === 'categories' && (
              <button
                onClick={() => {
                  setEditingCategory(null)
                  setCatName('')
                  setCatDesc('')
                  setIsCategoryModalOpen(true)
                }}
                className="px-5 py-3 rounded-full bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-rose-950/40 transition-all active:scale-98 cursor-pointer"
              >
                <Plus size={16} /> Create Category
              </button>
            )}

            <button
              onClick={fetchData}
              title="Refresh Data"
              className="p-3 rounded-full bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-all cursor-pointer"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </header>

        {/* ── PRODUCTS TAB ── */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Search & Filter Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-stone-900/50 p-4 rounded-3xl border border-stone-800">
              <div className="relative flex-1 w-full">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" />
                <input
                  type="text"
                  placeholder="Search products by name, tag, ingredients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-stone-950/60 border border-stone-800 text-xs text-stone-100 outline-none ring-rose-500/40 focus:ring-2 placeholder:text-stone-600"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Category Filter Dropdown */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-bold text-stone-500 uppercase shrink-0">Category:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-stone-950/60 border border-stone-800 text-xs text-stone-100 outline-none ring-rose-500/40 focus:ring-2 cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id.toString()}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 rounded-3xl bg-stone-900/30 border border-dashed border-stone-800 p-8">
                <ShoppingBag size={40} className="mx-auto text-stone-600 mb-3" />
                <h3 className="font-serif text-lg font-bold text-stone-300">No products found</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  No treats matched your current filter. Click &ldquo;Add New Product&rdquo; above to create your first pastry item.
                </p>
                <button
                  onClick={openAddProduct}
                  className="mt-4 px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-all cursor-pointer"
                >
                  <Plus size={14} className="inline mr-1" /> Add Product Now
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((prod) => (
                  <article
                    key={prod.id}
                    className={`group rounded-3xl bg-stone-900/80 p-5 border border-stone-800 hover:border-stone-700 shadow-md flex flex-col justify-between transition-all duration-200 ${
                      !prod.is_available ? 'opacity-60 bg-stone-950/40' : ''
                    }`}
                  >
                    <div>
                      {/* Image & Badges */}
                      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-stone-950 mb-4 border border-stone-800/80">
                        <Image
                          src={prod.image_path || '/Rasmalai2.0.png'}
                          alt={prod.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        {!prod.is_available && (
                          <div className="absolute inset-0 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center">
                            <span className="bg-red-500/90 text-white font-bold text-[11px] rounded-full px-3 py-1 shadow uppercase tracking-wider">
                              Sold Out
                            </span>
                          </div>
                        )}
                        {prod.tag && (
                          <span className="absolute left-3 top-3 bg-gradient-to-r from-rose-600 to-amber-600 text-white font-bold text-[10px] rounded-full px-2.5 py-1 uppercase tracking-wider shadow">
                            {prod.tag}
                          </span>
                        )}
                      </div>

                      {/* Header & Category */}
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h3 className="font-serif text-lg font-bold text-stone-100 group-hover:text-rose-400 transition-colors">
                            {prod.name}
                          </h3>
                          <span className="inline-block mt-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-full px-2.5 py-0.5">
                            {prod.category_name || categories.find((c) => c.id === prod.category_id)?.name || 'General Pastry'}
                          </span>
                        </div>

                        {/* Price Display */}
                        <div className="text-right">
                          <div className="flex items-baseline gap-1.5 justify-end font-mono">
                            <span className="font-extrabold text-lg text-amber-400">
                              ${parseFloat(prod.price as string).toFixed(0)}
                            </span>
                            {prod.original_price &&
                              parseFloat(prod.original_price as string) > parseFloat(prod.price as string) && (
                                <span className="text-xs line-through text-stone-500 font-medium">
                                  ${parseFloat(prod.original_price as string).toFixed(0)}
                                </span>
                              )}
                          </div>
                          {prod.discount_percent && parseFloat(prod.discount_percent as string) > 0 && (
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full inline-block mt-0.5">
                              {prod.discount_percent}% OFF
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="mt-3 text-xs text-stone-400 line-clamp-2 leading-relaxed">
                        {prod.description || 'No description added.'}
                      </p>
                    </div>

                    {/* Footer Controls: Quick Stock Toggle + Edit + Delete */}
                    <div className="mt-5 pt-4 border-t border-stone-800/80 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleToggleProductAvailability(prod)}
                        className={`text-[11px] font-semibold px-3 py-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                          prod.is_available
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                            : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                        }`}
                        title="Click to toggle availability on the customer website"
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${prod.is_available ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        {prod.is_available ? 'In Stock' : 'Sold Out'}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditProduct(prod)}
                          className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Edit2 size={13} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="p-2 rounded-xl border border-stone-800 text-stone-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                          aria-label="Delete treat"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── CATEGORIES TAB ── */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="rounded-3xl bg-stone-900/80 border border-stone-800 overflow-hidden shadow-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-950/60 border-b border-stone-800 text-[11px] uppercase tracking-wider text-stone-400 font-bold">
                    <th className="p-4 sm:p-5">Category Name</th>
                    <th className="p-4 sm:p-5">Description</th>
                    <th className="p-4 sm:p-5">Associated Items</th>
                    <th className="p-4 sm:p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 text-stone-200">
                  {categories.map((cat) => {
                    const itemCount = products.filter((p) => p.category_id === cat.id).length
                    return (
                      <tr key={cat.id} className="text-sm hover:bg-stone-800/30 transition-colors">
                        <td className="p-4 sm:p-5 font-bold text-stone-100 flex items-center gap-2">
                          <Layers size={16} className="text-rose-400" />
                          {cat.name}
                        </td>
                        <td className="p-4 sm:p-5 text-stone-400 max-w-sm truncate text-xs">
                          {cat.description || '—'}
                        </td>
                        <td className="p-4 sm:p-5">
                          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-stone-800 text-stone-300 font-semibold">
                            {itemCount} treats
                          </span>
                        </td>
                        <td className="p-4 sm:p-5 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingCategory(cat)
                              setCatName(cat.name)
                              setCatDesc(cat.description || '')
                              setIsCategoryModalOpen(true)
                            }}
                            className="p-2 inline-flex rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-stone-100 transition-colors cursor-pointer"
                            title="Edit Category"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-2 inline-flex rounded-xl bg-stone-800 hover:bg-red-500/20 text-stone-400 hover:text-red-400 transition-colors cursor-pointer"
                            title="Delete Category"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── ORDERS TAB ── */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Status Filter Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-stone-900/50 p-4 rounded-3xl border border-stone-800">
              <div className="flex flex-wrap gap-2">
                {['all', 'pending', 'preparing', 'delivered', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold capitalize transition-all cursor-pointer ${
                      orderStatusFilter === st
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'bg-stone-800/80 text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                <input
                  type="text"
                  placeholder="Search Order # or Client..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-2xl bg-stone-950/60 border border-stone-800 text-xs text-stone-100 outline-none ring-rose-500/40 focus:ring-2"
                />
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
              {/* Orders Table */}
              <div className="rounded-3xl bg-stone-900/80 border border-stone-800 overflow-hidden shadow-lg">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-950/60 border-b border-stone-800 text-[11px] uppercase tracking-wider text-stone-400 font-bold">
                      <th className="p-4 sm:p-5">Order #</th>
                      <th className="p-4 sm:p-5">Customer Profile</th>
                      <th className="p-4 sm:p-5">Total ($)</th>
                      <th className="p-4 sm:p-5">Kitchen State</th>
                      <th className="p-4 sm:p-5 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60 text-stone-200">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className="text-sm hover:bg-stone-800/30 transition-colors">
                        <td className="p-4 sm:p-5 font-mono font-bold text-amber-400">#{ord.id}</td>
                        <td className="p-4 sm:p-5">
                          <div className="font-semibold text-stone-100">{ord.customer_name || 'Guest Patron'}</div>
                          <span className="text-[11px] text-stone-500">{new Date(ord.created_at).toLocaleDateString()}</span>
                        </td>
                        <td className="p-4 sm:p-5 font-mono font-bold text-rose-400">
                          ${parseFloat(ord.total_amount as string).toFixed(0)}
                        </td>
                        <td className="p-4 sm:p-5">
                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                            className={`text-xs font-bold rounded-full px-3 py-1 border outline-none cursor-pointer ${
                              ord.status === 'delivered'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : ord.status === 'cancelled'
                                ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                : ord.status === 'preparing'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}
                          >
                            <option value="pending" className="bg-stone-900 text-stone-100">
                              Pending
                            </option>
                            <option value="preparing" className="bg-stone-900 text-stone-100">
                              Preparing
                            </option>
                            <option value="delivered" className="bg-stone-900 text-stone-100">
                              Delivered
                            </option>
                            <option value="cancelled" className="bg-stone-900 text-stone-100">
                              Cancelled
                            </option>
                          </select>
                        </td>
                        <td className="p-4 sm:p-5 text-right">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 cursor-pointer inline-flex items-center gap-1 transition-all"
                          >
                            Inspect <ChevronRight size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Selected Order Detail Card */}
              <div>
                {selectedOrder ? (
                  <div className="rounded-3xl bg-stone-900 border border-stone-800 p-6 space-y-5 animate-in fade-in slide-in-from-right-4 duration-200 shadow-xl">
                    <div className="flex justify-between items-start border-b border-stone-800 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif text-xl font-bold text-stone-100">Order #{selectedOrder.id}</h4>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              selectedOrder.status === 'delivered'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : selectedOrder.status === 'preparing'
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-rose-500/20 text-rose-400'
                            }`}
                          >
                            {selectedOrder.status}
                          </span>
                        </div>
                        <span className="text-xs text-stone-500 mt-1 block">
                          Placed on {new Date(selectedOrder.created_at).toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-stone-100 cursor-pointer"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="space-y-3.5 text-xs">
                      <div>
                        <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Customer Profile</p>
                        <p className="font-bold text-stone-100 text-sm mt-0.5">{selectedOrder.customer_name || 'Guest User'}</p>
                        <p className="text-stone-400 mt-0.5">{selectedOrder.customer_email || 'No email provided'}</p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Delivery Location</p>
                        <p className="text-stone-200 mt-0.5 leading-relaxed bg-stone-950/60 p-3 rounded-2xl border border-stone-800/80">
                          {selectedOrder.delivery_address || 'Customer opted for Bakery Takeaway / Counter Pickup.'}
                        </p>
                      </div>

                      {selectedOrder.notes && (
                        <div>
                          <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Kitchen Notes / Dedication</p>
                          <p className="text-amber-300 italic mt-0.5 bg-amber-500/10 p-3 rounded-2xl border border-amber-500/20">
                            &ldquo;{selectedOrder.notes}&rdquo;
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-stone-800 pt-4 space-y-2">
                      <div className="flex justify-between items-center text-xs text-stone-400 mb-2">
                        <span>Items Purchased:</span>
                        <span className="font-semibold text-stone-200">Fresh Bakery Box</span>
                      </div>
                      <div className="flex justify-between items-center bg-stone-950/80 p-3.5 rounded-2xl border border-stone-800">
                        <span className="font-serif font-bold text-stone-100">Total Order Value:</span>
                        <span className="font-mono text-xl font-extrabold text-amber-400">
                          ${parseFloat(selectedOrder.total_amount as string).toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-3xl bg-stone-900/30 border border-dashed border-stone-800 p-8 text-center text-stone-500">
                    <FileText size={36} className="mx-auto text-stone-600 mb-3" />
                    <p className="text-xs font-semibold leading-relaxed">
                      Select an order row from the left table to inspect full client details, kitchen instructions, and change delivery status.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── CUSTOMERS TAB ── */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="rounded-3xl bg-stone-900/80 border border-stone-800 overflow-hidden shadow-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-950/60 border-b border-stone-800 text-[11px] uppercase tracking-wider text-stone-400 font-bold">
                    <th className="p-4 sm:p-5">Customer Name</th>
                    <th className="p-4 sm:p-5">Email & Phone</th>
                    <th className="p-4 sm:p-5">Delivery Address</th>
                    <th className="p-4 sm:p-5">Registered Since</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 text-stone-200">
                  {customers.map((cust) => (
                    <tr key={cust.id} className="text-sm hover:bg-stone-800/30 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-stone-100 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-300 font-bold text-xs flex items-center justify-center shrink-0">
                          {cust.name.slice(0, 2).toUpperCase()}
                        </div>
                        {cust.name}
                      </td>
                      <td className="p-4 sm:p-5">
                        <div className="text-stone-300 text-xs">{cust.email}</div>
                        <span className="text-[11px] text-stone-500">{cust.phone || 'No phone recorded'}</span>
                      </td>
                      <td className="p-4 sm:p-5 text-stone-400 max-w-xs truncate text-xs">
                        {cust.address || '—'}
                      </td>
                      <td className="p-4 sm:p-5 text-xs text-stone-500 font-mono">
                        {new Date(cust.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── STOREFRONT & ANNOUNCEMENT SETTINGS TAB ── */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="space-y-6">
            {settingsSavedToast && (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <CheckCircle size={16} /> Storefront settings successfully saved & synced across the bakery!
              </div>
            )}

            {/* Announcement Banner Controls */}
            <div className="p-6 rounded-3xl bg-stone-900/80 border border-stone-800 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-100 flex items-center gap-2">
                    <Sparkles size={18} className="text-amber-400" /> Header Announcement Banner
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Customize the top sticky promotional message displayed to all website visitors.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.announcementEnabled}
                    onChange={(e) => setSettings({ ...settings, announcementEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                    Banner Announcement Text
                  </label>
                  <input
                    type="text"
                    value={settings.announcementText}
                    onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                    className="w-full rounded-xl border border-stone-800 bg-stone-950/60 px-4 py-2.5 text-xs text-stone-100 outline-none ring-rose-500/40 focus:ring-2"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                    Highlight Tag / Badge
                  </label>
                  <input
                    type="text"
                    value={settings.announcementBadge}
                    onChange={(e) => setSettings({ ...settings, announcementBadge: e.target.value })}
                    className="w-full rounded-xl border border-stone-800 bg-stone-950/60 px-4 py-2.5 text-xs text-stone-100 outline-none ring-rose-500/40 focus:ring-2"
                  />
                </div>
              </div>
            </div>

            {/* Store Status & Headline Controls */}
            <div className="p-6 rounded-3xl bg-stone-900/80 border border-stone-800 space-y-4">
              <h3 className="font-serif text-lg font-bold text-stone-100 flex items-center gap-2 border-b border-stone-800 pb-4">
                <Store size={18} className="text-rose-400" /> Bakery Operational Status & Hero Section
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                    Store Operational State
                  </label>
                  <select
                    value={settings.storeStatus}
                    onChange={(e) => setSettings({ ...settings, storeStatus: e.target.value as any })}
                    className="w-full rounded-xl border border-stone-800 bg-stone-950/60 px-4 py-2.5 text-xs text-stone-100 outline-none ring-rose-500/40 focus:ring-2 cursor-pointer"
                  >
                    <option value="open">🟢 Open (Taking Real-time Orders)</option>
                    <option value="busy">🟡 High Rush (Pre-orders Only)</option>
                    <option value="closed">🔴 Closed for the Day (Baking Fresh)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                    Store Notice / Closed Message
                  </label>
                  <input
                    type="text"
                    value={settings.closedMessage}
                    onChange={(e) => setSettings({ ...settings, closedMessage: e.target.value })}
                    className="w-full rounded-xl border border-stone-800 bg-stone-950/60 px-4 py-2.5 text-xs text-stone-100 outline-none ring-rose-500/40 focus:ring-2"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                    Hero Section Headline
                  </label>
                  <input
                    type="text"
                    value={settings.heroHeadline}
                    onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
                    className="w-full rounded-xl border border-stone-800 bg-stone-950/60 px-4 py-2.5 text-xs text-stone-100 outline-none ring-rose-500/40 focus:ring-2"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                    Hero Subtitle Tagline
                  </label>
                  <input
                    type="text"
                    value={settings.heroSubheadline}
                    onChange={(e) => setSettings({ ...settings, heroSubheadline: e.target.value })}
                    className="w-full rounded-xl border border-stone-800 bg-stone-950/60 px-4 py-2.5 text-xs text-stone-100 outline-none ring-rose-500/40 focus:ring-2"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Fees & Contact Info */}
            <div className="p-6 rounded-3xl bg-stone-900/80 border border-stone-800 space-y-4">
              <h3 className="font-serif text-lg font-bold text-stone-100 flex items-center gap-2 border-b border-stone-800 pb-4">
                <Truck size={18} className="text-emerald-400" /> Delivery Rates & Bakery Contacts
              </h3>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                    Base Delivery Fee ($)
                  </label>
                  <input
                    type="number"
                    value={settings.deliveryFee}
                    onChange={(e) => setSettings({ ...settings, deliveryFee: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-stone-800 bg-stone-950/60 px-4 py-2.5 text-xs text-stone-100 outline-none ring-rose-500/40 focus:ring-2 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                    Free Delivery Threshold ($)
                  </label>
                  <input
                    type="number"
                    value={settings.freeDeliveryThreshold}
                    onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-stone-800 bg-stone-950/60 px-4 py-2.5 text-xs text-stone-100 outline-none ring-rose-500/40 focus:ring-2 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                    Bakery Phone
                  </label>
                  <input
                    type="text"
                    value={settings.bakeryPhone}
                    onChange={(e) => setSettings({ ...settings, bakeryPhone: e.target.value })}
                    className="w-full rounded-xl border border-stone-800 bg-stone-950/60 px-4 py-2.5 text-xs text-stone-100 outline-none ring-rose-500/40 focus:ring-2"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                    Support Email
                  </label>
                  <input
                    type="email"
                    value={settings.bakeryEmail}
                    onChange={(e) => setSettings({ ...settings, bakeryEmail: e.target.value })}
                    className="w-full rounded-xl border border-stone-800 bg-stone-950/60 px-4 py-2.5 text-xs text-stone-100 outline-none ring-rose-500/40 focus:ring-2"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                    Bakery Physical Address
                  </label>
                  <input
                    type="text"
                    value={settings.bakeryAddress}
                    onChange={(e) => setSettings({ ...settings, bakeryAddress: e.target.value })}
                    className="w-full rounded-xl border border-stone-800 bg-stone-950/60 px-4 py-2.5 text-xs text-stone-100 outline-none ring-rose-500/40 focus:ring-2"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                    Opening Hours
                  </label>
                  <input
                    type="text"
                    value={settings.bakeryHours}
                    onChange={(e) => setSettings({ ...settings, bakeryHours: e.target.value })}
                    className="w-full rounded-xl border border-stone-800 bg-stone-950/60 px-4 py-2.5 text-xs text-stone-100 outline-none ring-rose-500/40 focus:ring-2"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-semibold text-xs transition-all shadow-lg shadow-rose-950/40 active:scale-98 cursor-pointer flex items-center gap-2"
            >
              <Check size={16} /> Save All Storefront Changes
            </button>
          </form>
        )}
      </section>

      {/* ── PRODUCT ADD / EDIT MODAL ── */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsProductModalOpen(false)}
          />

          <div className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-stone-900 border border-stone-800 p-7 shadow-2xl z-50 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsProductModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-stone-800 transition-colors cursor-pointer text-stone-400 hover:text-stone-100"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <h3 className="font-serif text-2xl font-bold text-stone-50">
                {editingProduct ? 'Edit Sweet Treat' : 'Add New Bakery Creation'}
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Configure pricing, discount badges, photos, and stock availability for this menu item.
              </p>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 overflow-y-auto pr-2 flex-1">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5" htmlFor="prod-name">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  id="prod-name"
                  type="text"
                  placeholder="e.g. Saffron Rasmalai Cake"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full rounded-xl border border-stone-800 bg-stone-950/60 px-4 py-3 text-sm text-stone-100 outline-none ring-rose-500/40 focus:ring-2"
                />
              </div>

              {/* Pricing & Automatic Discount Math Section */}
              <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Percent size={14} /> Pricing & Discount Calculator
                  </span>
                  {prodDiscountPercent && parseFloat(prodDiscountPercent) > 0 && (
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      {prodDiscountPercent}% Discount Active
                    </span>
                  )}
                </div>

                <div className="grid gap-3 grid-cols-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-400 mb-1" htmlFor="prod-original-price">
                      Original / Regular Price ($)
                    </label>
                    <input
                      id="prod-original-price"
                      type="number"
                      step="0.01"
                      placeholder="e.g. 350"
                      value={prodOriginalPrice}
                      onChange={(e) => handleOriginalPriceChange(e.target.value)}
                      className="w-full rounded-xl border border-stone-800 bg-stone-900 px-3.5 py-2.5 text-sm text-stone-100 outline-none ring-rose-500/40 focus:ring-2 font-mono font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-rose-400 mb-1" htmlFor="prod-price">
                      Final Selling Price ($) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      required
                      id="prod-price"
                      type="number"
                      step="0.01"
                      placeholder="e.g. 280"
                      value={prodPrice}
                      onChange={(e) => handlePriceChange(e.target.value)}
                      className="w-full rounded-xl border-2 border-rose-500/50 bg-stone-900 px-3.5 py-2.5 text-sm text-stone-100 outline-none ring-rose-500 focus:ring-2 font-mono font-bold"
                    />
                  </div>
                </div>

                {/* 1-Click Discount Pills */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                    1-Click Discount Preset:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[10, 15, 20, 25, 30, 40, 50].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => applyDiscountPercent(pct)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          prodDiscountPercent === pct.toString()
                            ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                            : 'bg-stone-900 text-stone-300 border-stone-800 hover:bg-stone-800 hover:text-white'
                        }`}
                      >
                        {pct}% OFF
                      </button>
                    ))}
                    {(prodDiscountPercent || (prodOriginalPrice && prodPrice && parseFloat(prodOriginalPrice) > parseFloat(prodPrice))) && (
                      <button
                        type="button"
                        onClick={() => {
                          setProdDiscountPercent('')
                          if (prodOriginalPrice) setProdPrice(prodOriginalPrice)
                          if (prodTag && prodTag.includes('% OFF')) setProdTag('')
                        }}
                        className="text-xs font-semibold px-2 py-1 rounded-lg text-red-400 hover:bg-red-500/10 cursor-pointer"
                      >
                        Clear Discount
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Promotional Tag / Badge */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5" htmlFor="prod-tag">
                  Promotional Badge / Offer Tag
                </label>
                <input
                  id="prod-tag"
                  type="text"
                  placeholder="e.g. Festive Offer, 20% OFF, Best seller"
                  value={prodTag}
                  onChange={(e) => setProdTag(e.target.value)}
                  className="w-full rounded-xl border border-stone-800 bg-stone-950/60 px-4 py-2.5 text-xs text-stone-100 outline-none ring-rose-500/40 focus:ring-2"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {PRESET_TAGS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setProdTag(t)}
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                        prodTag === t
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                  {prodTag && (
                    <button
                      type="button"
                      onClick={() => setProdTag('')}
                      className="text-[10px] font-semibold px-2 py-1 rounded-full text-red-400 hover:bg-red-500/10 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Category & Image Path */}
              <div className="grid gap-4 grid-cols-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5" htmlFor="prod-category">
                    Menu Category
                  </label>
                  <select
                    id="prod-category"
                    value={prodCatId}
                    onChange={(e) => setProdCatId(e.target.value)}
                    className="w-full rounded-xl border border-stone-800 bg-stone-950/60 px-4 py-2.5 text-xs text-stone-100 outline-none ring-rose-500/40 focus:ring-2 cursor-pointer"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5" htmlFor="prod-image">
                    Image URL or Path
                  </label>
                  <input
                    id="prod-image"
                    type="text"
                    placeholder="/Rasmalai2.0.png or URL"
                    value={prodImgPath}
                    onChange={(e) => setProdImgPath(e.target.value)}
                    className="w-full rounded-xl border border-stone-800 bg-stone-950/60 px-4 py-2.5 text-xs text-stone-100 outline-none ring-rose-500/40 focus:ring-2 font-mono"
                  />
                </div>
              </div>

              {/* Preset Gallery Picker */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                  Or pick a photo from our bakery photo library:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_IMAGES.map((img) => (
                    <button
                      key={img.path}
                      type="button"
                      onClick={() => setProdImgPath(img.path)}
                      className={`group relative aspect-[4/3] rounded-xl overflow-hidden border transition-all cursor-pointer ${
                        prodImgPath === img.path ? 'border-rose-500 ring-2 ring-rose-500' : 'border-stone-800 opacity-60 hover:opacity-100'
                      }`}
                      title={img.label}
                    >
                      <Image src={img.path} alt={img.label} fill className="object-cover" />
                      <span className="absolute inset-x-0 bottom-0 bg-black/70 text-[9px] text-white truncate px-1 py-0.5 text-center">
                        {img.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5" htmlFor="prod-desc">
                  Flavor & Ingredients Description
                </label>
                <textarea
                  id="prod-desc"
                  placeholder="Describe the cardamoms, saffron mawa cream, layered sponges..."
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-stone-800 bg-stone-950/60 px-4 py-2.5 text-xs text-stone-100 outline-none ring-rose-500/40 focus:ring-2"
                />
              </div>

              {/* Availability Checkbox */}
              <div className="flex items-center gap-3 bg-stone-950/80 p-3.5 rounded-2xl border border-stone-800">
                <input
                  type="checkbox"
                  id="prod-available"
                  checked={prodIsAvailable}
                  onChange={(e) => setProdIsAvailable(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600 accent-rose-600 border-stone-700 cursor-pointer"
                />
                <label htmlFor="prod-available" className="text-xs font-semibold text-stone-200 cursor-pointer select-none">
                  Available in Live Public Catalog (Uncheck if Sold Out)
                </label>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3.5 rounded-full bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-semibold text-xs transition-all shadow-lg shadow-rose-950/40 cursor-pointer"
              >
                {editingProduct ? 'Save Product Changes' : 'Publish Sweet Treat to Menu'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── CATEGORY MODAL ── */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCategoryModalOpen(false)}
          />

          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-stone-900 border border-stone-800 p-7 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsCategoryModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-stone-800 transition-colors cursor-pointer text-stone-400 hover:text-stone-100"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <h3 className="font-serif text-2xl font-bold text-stone-50">
                {editingCategory ? 'Edit Menu Category' : 'Create New Category'}
              </h3>
              <p className="text-xs text-stone-400 mt-1">Organize your pastries into easily discoverable menu sections.</p>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5" htmlFor="cat-name">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  id="cat-name"
                  type="text"
                  placeholder="e.g. Signature Hampers, Fusion Sweets"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full rounded-xl border border-stone-800 bg-stone-950/60 px-4 py-3 text-sm text-stone-100 outline-none ring-rose-500/40 focus:ring-2"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5" htmlFor="cat-desc">
                  Short Description
                </label>
                <textarea
                  id="cat-desc"
                  placeholder="Briefly describe this collection of items..."
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-stone-800 bg-stone-950/60 px-4 py-2.5 text-xs text-stone-100 outline-none ring-rose-500/40 focus:ring-2"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3.5 rounded-full bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-semibold text-xs transition-all shadow-lg shadow-rose-950/40 cursor-pointer"
              >
                {editingCategory ? 'Update Category' : 'Save Category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
