export const UserStatsCard = () => {
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
      <div className="mb-4 text-center">
        <div className="mx-auto mb-3 h-20 w-20 overflow-hidden rounded-full border-2 border-[#9146FF]">
          <img src="/abstract-user-icon.png" alt="Kullanıcı" className="h-full w-full object-cover" />
        </div>
        <h2 className="text-xl font-bold text-white">KullanıcıTR</h2>
        <p className="text-sm text-gray-400">kullanici@example.com</p>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-400">Ore Points</p>
          <p className="text-xl font-bold bg-gradient-to-r from-[#9146FF] to-[#00FF00] bg-clip-text text-transparent">
            15,000
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Toplam İzleme Süresi</p>
          <p className="text-lg font-medium text-white">124 saat</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Üyelik Tarihi</p>
          <p className="text-lg font-medium text-white">12 Mart 2023</p>
        </div>
      </div>
    </div>
  )
}
