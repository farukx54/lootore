export default function RewardsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Ödül Geçmişi</h2>

      <div className="rounded-lg border border-gray-700 bg-gray-800">
        <div className="p-4">
          <div className="flex items-center justify-between border-b border-gray-700 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-md">
                <img src="/digital-gift-explosion.png" alt="Discord Nitro" className="h-full w-full object-cover" />
              </div>
              <div>
                <h4 className="font-medium text-white">Discord Nitro</h4>
                <p className="text-sm text-gray-400">1 Aylık Abonelik</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-white">10,000 Ore Points</p>
              <p className="text-xs text-gray-400">15 Nisan 2023</p>
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-gray-700 py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-md">
                <img src="/valorant-skin.png" alt="Valorant Skin" className="h-full w-full object-cover" />
              </div>
              <div>
                <h4 className="font-medium text-white">Valorant Silah Skini</h4>
                <p className="text-sm text-gray-400">Özel Tasarım</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-white">20,000 Ore Points</p>
              <p className="text-xs text-gray-400">2 Mart 2023</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
