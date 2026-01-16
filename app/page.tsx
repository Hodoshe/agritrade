import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="glass-card mx-2 md:mx-4 mt-2 md:mt-4 p-3 md:p-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0">
          <h1 className="text-xl md:text-2xl font-bold gradient-text">AgriTrade</h1>
          <div className="flex gap-3 md:gap-4 text-sm md:text-base">
            <Link href="/marketplace" className="text-white hover:text-agri-green transition">
              Marketplace
            </Link>
            <Link href="/pricing" className="text-white hover:text-agri-green transition">
              Pricing
            </Link>
            <Link href="/auth/login" className="btn-primary text-white px-4 md:px-6 py-2">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-3 md:px-4 py-10 md:py-20">
        <div className="text-center">
          <h2 className="text-3xl md:text-6xl font-bold mb-4 md:mb-6 leading-tight">
            South Africa's Premier
            <br />
            <span className="gradient-text">Agricultural Marketplace</span>
          </h2>
          <p className="text-base md:text-xl text-gray-300 mb-8 md:mb-12 max-w-2xl mx-auto px-4">
            Connect with farmers, suppliers, and buyers across all nine provinces.
            Buy and sell livestock, crops, equipment, and materials with ease.
          </p>
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center px-4">
            <Link href="/auth/signup" className="btn-primary text-white text-base md:text-lg py-3 md:py-4 px-8 text-center">
              Get Started Free
            </Link>
            <Link href="/marketplace" className="glass-card px-6 md:px-8 py-3 md:py-4 text-base md:text-lg hover:border-agri-green transition text-center">
              Browse Marketplace
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-12 md:mt-24 px-4">
          <div className="glass-card p-6 md:p-8 text-center">
            <div className="text-4xl md:text-5xl mb-3 md:mb-4">🌾</div>
            <h3 className="text-lg md:text-xl font-bold mb-2 gradient-text">Crops & Produce</h3>
            <p className="text-sm md:text-base text-gray-300">Fresh produce direct from South African farms</p>
          </div>
          <div className="glass-card p-6 md:p-8 text-center">
            <div className="text-4xl md:text-5xl mb-3 md:mb-4">🐄</div>
            <h3 className="text-lg md:text-xl font-bold mb-2 gradient-text">Livestock</h3>
            <p className="text-sm md:text-base text-gray-300">Quality livestock with health certifications</p>
          </div>
          <div className="glass-card p-6 md:p-8 text-center">
            <div className="text-4xl md:text-5xl mb-3 md:mb-4">🚜</div>
            <h3 className="text-lg md:text-xl font-bold mb-2 gradient-text">Equipment</h3>
            <p className="text-sm md:text-base text-gray-300">Agricultural tools and machinery</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="glass-card p-6 md:p-12 mt-12 md:mt-24 mx-2 md:mx-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
            <div>
              <div className="text-3xl md:text-5xl font-bold gradient-text mb-2">Growing</div>
              <p className="text-sm md:text-base text-gray-300">Community of Sellers</p>
            </div>
            <div>
              <div className="text-3xl md:text-5xl font-bold gradient-text mb-2">Fast</div>
              <p className="text-sm md:text-base text-gray-300">Growing Marketplace</p>
            </div>
            <div>
              <div className="text-3xl md:text-5xl font-bold gradient-text mb-2">9</div>
              <p className="text-sm md:text-base text-gray-300">Provinces Covered</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="glass-card mx-2 md:mx-4 mb-2 md:mb-4 p-6 md:p-8 mt-12 md:mt-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          <div>
            <h3 className="text-lg md:text-xl font-bold gradient-text mb-3 md:mb-4">AgriTrade</h3>
            <p className="text-sm md:text-base text-gray-300">Connecting South Africa's agricultural community</p>
          </div>
          <div>
            <h4 className="font-bold mb-3 md:mb-4 text-sm md:text-base">Quick Links</h4>
            <ul className="space-y-2 text-sm md:text-base text-gray-300">
              <li><Link href="/marketplace" className="hover:text-agri-green transition">Marketplace</Link></li>
              <li><Link href="/pricing" className="hover:text-agri-green transition">Pricing</Link></li>
              <li><Link href="/about" className="hover:text-agri-green transition">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 md:mb-4 text-sm md:text-base">Support</h4>
            <ul className="space-y-2 text-sm md:text-base text-gray-300">
              <li><Link href="/contact" className="hover:text-agri-green transition">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-agri-green transition">FAQ</Link></li>
              <li><Link href="/terms" className="hover:text-agri-green transition">Terms</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 md:mb-4 text-sm md:text-base">Contact</h4>
            <p className="text-sm md:text-base text-gray-300">support@agritrade.co.za</p>
            <p className="text-sm md:text-base text-gray-300">+27 (0)11 123 4567</p>
          </div>
        </div>
        <div className="text-center text-gray-400 mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-700 text-xs md:text-sm">
          © 2026 AgriTrade. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
