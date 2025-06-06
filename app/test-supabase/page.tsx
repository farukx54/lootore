import SupabaseTestUpdated from "@/components/supabase-test-updated"

export default function TestSupabasePage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-10">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Supabase Diagnostics & Health Check</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Bu sayfa, Supabase altyapınızın bağlantı, RLS, environment, auth ve veri erişim testlerini otomatik olarak gerçekleştirir. Tüm testler canlı olarak çalışır ve hata durumunda detaylı loglar sunar. Geliştirici ve operasyon ekipleri için hızlı teşhis ve debugging sağlar.
          </p>
        </div>
        <SupabaseTestUpdated />
        <div className="text-xs text-gray-500 text-center pt-8">
          <p>Bu panel sadece geliştirici/test ortamında kullanılmalıdır. Sonuçlar canlı Supabase ortamınızdan alınır.</p>
        </div>
      </div>
    </div>
  )
}
