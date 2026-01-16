import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="glass-card mx-4 mt-4 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold gradient-text">AgriTrade</h1>
          <div className="flex gap-4">
            <Link href="/marketplace" className="text-white hover:text-agri-green transition">
              Marketplace
            </Link>
            <Link href="/pricing" className="text-white hover:text-agri-green transition">
              Pricing
            </Link>
            <Link href="/auth/login" className="btn-primary text-white">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center">
          <h2 className="text-6xl font-bold mb-6">
            South Africa's Premier
            <br />
            <span className="gradient-text">Agricultural Marketplace</span>
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Connect with farmers, suppliers, and buyers across all nine provinces.
            Buy and sell livestock, crops, equipment, and materials with ease.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/signup" className="btn-primary text-white text-lg">
              Get Started Free
            </Link>
            <Link href="/marketplace" className="glass-card px-8 py-3 text-lg hover:border-agri-green transition">
              Browse Marketplace
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="glass-card p-8 text-center">
            <div className="text-5xl mb-4">🌾</div>
            <h3 className="text-xl font-bold mb-2 gradient-text">Crops & Produce</h3>
            <p className="text-gray-300">Fresh produce direct from South African farms</p>
          </div>
          <div className="glass-card p-8 text-center">
            <div className="text-5xl mb-4">🐄</div>
            <h3 className="text-xl font-bold mb-2 gradient-text">Livestock</h3>
            <p className="text-gray-300">Quality livestock with health certifications</p>
          </div>
          <div className="glass-card p-8 text-center">
            <div className="text-5xl mb-4">🚜</div>
            <h3 className="text-xl font-bold mb-2 gradient-text">Equipment</h3>
            <p className="text-gray-300">Agricultural tools and machinery</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="glass-card p-12 mt-24">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold gradient-text mb-2">Growing</div>
              <p className="text-gray-300">Community of Sellers</p>
            </div>
            <div>
              <div className="text-5xl font-bold gradient-text mb-2">Fast</div>
              <p className="text-gray-300">Growing Marketplace</p>
            </div>
            <div>
              <div className="text-5xl font-bold gradient-text mb-2">9</div>
              <p className="text-gray-300">Provinces Covered</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="glass-card mx-4 mb-4 p-8 mt-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold gradient-text mb-4">AgriTrade</h3>
            <p className="text-gray-300">Connecting South Africa's agricultural community</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/marketplace" className="hover:text-agri-green transition">Marketplace</Link></li>
              <li><Link href="/pricing" className="hover:text-agri-green transition">Pricing</Link></li>
              <li><Link href="/about" className="hover:text-agri-green transition">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/contact" className="hover:text-agri-green transition">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-agri-green transition">FAQ</Link></li>
              <li><Link href="/terms" className="hover:text-agri-green transition">Terms</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <p className="text-gray-300">support@agritrade.co.za</p>
            <p className="text-gray-300">+27 (0)11 123 4567</p>
          </div>
        </div>
        <div className="text-center text-gray-400 mt-8 pt-8 border-t border-gray-700">
          © 2026 AgriTrade. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
