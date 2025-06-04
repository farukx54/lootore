// Yeni dosya: components/footer.tsx
"use client"

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-black py-8 mt-auto">
      {" "}
      {/* mt-auto ile aşağıya yapışır */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-extrabold">
                <span className="bg-gradient-to-r from-[#9146FF] via-white to-[#00FF00] bg-clip-text text-transparent">
                  LootOre
                </span>
              </span>
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
            <Link href="/hakkimizda" className="hover:text-white">
              Hakkımızda
            </Link>
            <Link href="/gizlilik-politikasi" className="hover:text-white">
              Gizlilik Politikası
            </Link>
            <Link href="/kullanim-sartlari" className="hover:text-white">
              Kullanım Şartları
            </Link>
            <Link href="/iletisim" className="hover:text-white">
              İletişim
            </Link>
          </div>
          <div className="text-sm text-gray-500">&copy; {new Date().getFullYear()} LootOre. Tüm hakları saklıdır.</div>
        </div>
      </div>
    </footer>
  )
}
