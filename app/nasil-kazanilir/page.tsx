import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Clock, Gift, TrendingUp, Zap } from "lucide-react"
import Image from "next/image"

export default function NasilKazanilir() {
  return (
    <main className="flex min-h-screen flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-black via-gray-900 to-black py-16 earn-points-hero-section">
        <div className="absolute inset-0 bg-[url('/digital-weave.png')] bg-cover bg-center opacity-10 mix-blend-overlay max-h-full"></div>
        <div className="absolute -bottom-48 -left-48 h-96 w-96 rounded-full bg-[#9146FF] opacity-20 blur-3xl"></div>
        <div className="absolute -top-48 -right-48 h-96 w-96 rounded-full bg-[#00FF00] opacity-10 blur-3xl"></div>

        <div className="container relative mx-auto px-4 w-full max-w-full">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl break-words">
              Nasıl{" "}
              <span className="bg-gradient-to-r from-[#9146FF] to-[#00FF00] bg-clip-text text-transparent">
                Puan Kazanılır?
              </span>
            </h1>
            <p className="mb-8 text-lg text-gray-300 break-words">
              LootOre'da puan kazanmak ve ödüllere ulaşmak çok kolay! İşte adım adım nasıl yapacağınız.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section - This is the section with the issue */}
      <section className="bg-gray-950 py-16 earn-points-content-section">
        <div className="container mx-auto px-4 w-full max-w-full">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">Nasıl Çalışır?</h2>
            <p className="mx-auto max-w-2xl text-gray-400 break-words">
              LootOre, favori Twitch ve Kick yayıncılarınızı izlerken puan kazanmanızı sağlayan bir platformdur. İşte
              sistemin nasıl çalıştığına dair adım adım açıklama:
            </p>
          </div>

          <div className="grid gap-3 sm:gap-4 md:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 w-full">
            <Card className="flex h-full flex-col bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg overflow-hidden">
              <CardHeader className="pb-2">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#9146FF]/20">
                  <Clock className="h-6 w-6 text-[#9146FF]" />
                </div>
                <CardTitle className="text-xl text-white break-words">1. İzle</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow overflow-hidden">
                <p className="text-sm text-gray-400 break-words">
                  Twitch veya Kick hesabınızla giriş yapın ve desteklenen yayıncıları izlemeye başlayın. Her platform
                  için ayrı puan kazanırsınız.
                </p>
              </CardContent>
            </Card>

            <Card className="flex h-full flex-col bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg overflow-hidden">
              <CardHeader className="pb-2">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#00FF00]/20">
                  <TrendingUp className="h-6 w-6 text-[#00FF00]" />
                </div>
                <CardTitle className="text-xl text-white break-words">2. Puan Kazanın</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow overflow-hidden">
                <p className="text-sm text-gray-400 break-words">
                  Her izleme dakikası için puan kazanırsınız. Bazı yayınlar daha yüksek puan çarpanlarına sahip
                  olabilir, bu da daha hızlı puan biriktirmenizi sağlar.
                </p>
              </CardContent>
            </Card>

            <Card className="flex h-full flex-col bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg overflow-hidden">
              <CardHeader className="pb-2">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#9146FF]/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-[#9146FF]"
                  >
                    <path d="M7 10v12" />
                    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                  </svg>
                </div>
                <CardTitle className="text-xl text-white break-words">3. Etkileşimde Bulunun</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow overflow-hidden">
                <p className="text-sm text-gray-400 break-words">
                  Yayıncılara abone olarak ve içerikleri beğenerek ekstra puanlar kazanın. Her abonelik için 500 puan,
                  her beğeni için 50 puan kazanabilirsiniz. Düzenli etkileşim, puan çarpanınızı artırır.
                </p>
              </CardContent>
            </Card>

            <Card className="flex h-full flex-col bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg overflow-hidden">
              <CardHeader className="pb-2">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#9146FF]/20">
                  <Zap className="h-6 w-6 text-[#9146FF]" />
                </div>
                <CardTitle className="text-xl text-white break-words">4. Bonus Kazanın</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow overflow-hidden">
                <p className="text-sm text-gray-400 break-words">
                  Yayıncıların paylaştığı hediye kodlarını kullanarak ekstra bonus puanlar kazanabilirsiniz. Ayrıca özel
                  etkinlikler sırasında daha fazla puan kazanma fırsatı yakalayın.
                </p>
              </CardContent>
            </Card>

            <Card className="flex h-full flex-col bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg overflow-hidden">
              <CardHeader className="pb-2">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#00FF00]/20">
                  <Gift className="h-6 w-6 text-[#00FF00]" />
                </div>
                <CardTitle className="text-xl text-white break-words">5. Ödülleri Alın</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow overflow-hidden">
                <p className="text-sm text-gray-400 break-words">
                  Biriktirdiğiniz puanları kullanarak Discord Nitro, Steam Gift Card, Riot Points ve daha fazlası gibi
                  ödülleri alabilirsiniz.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Platform Comparison */}
      <section className="bg-black py-16 earn-points-content-section">
        <div className="container mx-auto px-4 w-full max-w-full">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">Platform Karşılaştırması</h2>
            <p className="mx-auto max-w-2xl text-gray-400 break-words">
              Twitch ve Kick platformlarında nasıl puan kazanacağınızı karşılaştırın ve stratejinizi belirleyin.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-8 grid-cols-1 md:grid-cols-2 w-full">
            <div className="overflow-hidden rounded-xl bg-gradient-to-br from-[#9146FF]/20 to-black p-1">
              <div className="flex h-full flex-col rounded-lg bg-gray-900 p-4 sm:p-6 w-full overflow-hidden">
                <div className="mb-4 flex items-center gap-3">
                  <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#9146FF]" fill="currentColor">
                    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
                  </svg>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">Twitch</h3>
                </div>

                <ul className="mb-6 space-y-3 flex-grow">
                  <li className="flex items-start gap-2 text-gray-300 text-sm sm:text-base">
                    <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-[#9146FF]" />
                    <span className="break-words">
                      Her izleme dakikası için <strong className="text-white">1 puan</strong> kazanırsınız
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300 text-sm sm:text-base">
                    <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-[#9146FF]" />
                    <span className="break-words">
                      Öne çıkan yayınlarda <strong className="text-white">1.5x - 2x</strong> puan çarpanı
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300 text-sm sm:text-base">
                    <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-[#9146FF]" />
                    <span className="break-words">
                      Twitch Prime aboneleri için <strong className="text-white">%10 bonus</strong> puan
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300 text-sm sm:text-base">
                    <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-[#9146FF]" />
                    <span className="break-words">
                      Yayıncı hediye kodları ile <strong className="text-white">ekstra puanlar</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300 text-sm sm:text-base">
                    <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-[#9146FF]" />
                    <span className="break-words">
                      Abone olduğunuz yayıncılar için <strong className="text-white">500 bonus puan</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300 text-sm sm:text-base">
                    <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-[#9146FF]" />
                    <span className="break-words">
                      Her beğeni için <strong className="text-white">50 puan</strong> kazanın
                    </span>
                  </li>
                </ul>

                <div className="rounded-lg bg-[#9146FF]/10 p-4 mt-auto">
                  <p className="text-xs sm:text-sm text-gray-300 break-words">
                    <strong className="text-white">İpucu:</strong> Twitch'te öne çıkan yayınları takip ederek daha hızlı
                    puan kazanabilirsiniz. Ayrıca yayıncıların chat'te paylaştığı bonus kodları kaçırmayın!
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl bg-gradient-to-br from-[#00FF00]/20 to-black p-1">
              <div className="flex h-full flex-col rounded-lg bg-gray-900 p-4 sm:p-6 w-full overflow-hidden">
                <div className="mb-4 flex items-center gap-3">
                  <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#00FF00]" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-2 16.5v-9l7 4.5-7 4.5z" />
                  </svg>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">Kick</h3>
                </div>

                <ul className="mb-6 space-y-3 flex-grow">
                  <li className="flex items-start gap-2 text-gray-300 text-sm sm:text-base">
                    <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-[#00FF00]" />
                    <span className="break-words">
                      Her izleme dakikası için <strong className="text-white">1.2 puan</strong> kazanırsınız
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300 text-sm sm:text-base">
                    <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-[#00FF00]" />
                    <span className="break-words">
                      Öne çıkan yayınlarda <strong className="text-white">1.8x - 2.5x</strong> puan çarpanı
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300 text-sm sm:text-base">
                    <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-[#00FF00]" />
                    <span className="break-words">
                      Kick aboneleri için <strong className="text-white">%15 bonus</strong> puan
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300 text-sm sm:text-base">
                    <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-[#00FF00]" />
                    <span className="break-words">
                      Özel etkinliklerde <strong className="text-white">2x - 3x</strong> puan kazanma fırsatı
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300 text-sm sm:text-base">
                    <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-[#00FF00]" />
                    <span className="break-words">
                      Abone olduğunuz yayıncılar için <strong className="text-white">600 bonus puan</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300 text-sm sm:text-base">
                    <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-[#00FF00]" />
                    <span className="break-words">
                      Her beğeni için <strong className="text-white">75 puan</strong> kazanın
                    </span>
                  </li>
                </ul>

                <div className="rounded-lg bg-[#00FF00]/10 p-4 mt-auto">
                  <p className="text-xs sm:text-sm text-gray-300 break-words">
                    <strong className="text-white">İpucu:</strong> Kick platformunda yeni yayıncıları takip ederek daha
                    yüksek puan çarpanlarından yararlanabilirsiniz. Ayrıca hafta sonu etkinliklerinde ekstra puanlar
                    kazanabilirsiniz!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-950 py-16 earn-points-content-section">
        <div className="container mx-auto px-4 max-w-full">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">Sıkça Sorulan Sorular</h2>
            <p className="mx-auto max-w-2xl text-gray-400 break-words">
              LootOre hakkında merak ettiğiniz soruların cevaplarını bulun.
            </p>
          </div>

          <div className="mx-auto grid max-w-3xl gap-6">
            <div className="rounded-lg bg-gray-900 p-6">
              <h3 className="mb-3 text-xl font-bold text-white">Puanlarım ne kadar sürede hesabıma geçer?</h3>
              <p className="text-gray-400 break-words">
                İzleme puanlarınız genellikle yayın bittikten sonra 15-30 dakika içinde hesabınıza geçer. Bazı
                durumlarda bu süre 1 saate kadar uzayabilir.
              </p>
            </div>

            <div className="rounded-lg bg-gray-900 p-6">
              <h3 className="mb-3 text-xl font-bold text-white">Twitch ve Kick puanlarımı birleştirebilir miyim?</h3>
              <p className="text-gray-400 break-words">
                Evet, her iki platformdan kazandığınız puanlar aynı hesapta toplanır ve istediğiniz ödülü almak için
                toplam puanlarınızı kullanabilirsiniz.
              </p>
            </div>

            <div className="rounded-lg bg-gray-900 p-6">
              <h3 className="mb-3 text-xl font-bold text-white">Puanlarımın süresi doluyor mu?</h3>
              <p className="text-gray-400 break-words">
                Hayır, kazandığınız puanlar süresiz olarak hesabınızda kalır. Dilediğiniz zaman istediğiniz ödülü almak
                için kullanabilirsiniz.
              </p>
            </div>

            <div className="rounded-lg bg-gray-900 p-6">
              <h3 className="mb-3 text-xl font-bold text-white">Hangi yayıncılar destekleniyor?</h3>
              <p className="text-gray-400 break-words">
                LootOre'da Twitch ve Kick platformlarındaki çoğu popüler yayıncı desteklenmektedir. Desteklenen
                yayıncıların tam listesini görmek için hesabınıza giriş yapabilirsiniz.
              </p>
            </div>

            <div className="rounded-lg bg-gray-900 p-6">
              <h3 className="mb-3 text-xl font-bold text-white">Etkileşim puanları nasıl hesaplanır?</h3>
              <p className="text-gray-400 break-words">
                Etkileşim puanları, yayıncılara abone olduğunuzda ve içerikleri beğendiğinizde kazanılır. Twitch'te her
                abonelik için 500 puan, her beğeni için 50 puan kazanırsınız. Kick'te ise her abonelik için 600 puan,
                her beğeni için 75 puan kazanırsınız. Ayrıca, düzenli etkileşimde bulunduğunuz yayıncılar için puan
                çarpanınız artar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Infographic Section */}
      <section className="bg-black py-16 earn-points-content-section">
        <div className="container mx-auto px-4 max-w-full">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">Puan Kazanma Rehberi</h2>
            <p className="mx-auto max-w-2xl text-gray-400 break-words">
              Görsel rehberimizle puan kazanma sürecini daha iyi anlayın.
            </p>
          </div>

          <div className="relative mx-auto max-w-4xl w-full overflow-hidden rounded-xl bg-gray-900 p-3 sm:p-6 shadow-xl">
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#9146FF] opacity-20 blur-3xl"></div>
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#00FF00] opacity-20 blur-3xl"></div>

            <div className="relative grid gap-4 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full max-w-full">
              {/* Step 1 */}
              <div className="flex h-full flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#9146FF] to-[#00FF00] text-xl sm:text-2xl font-bold text-white">
                  1
                </div>
                <h3 className="mb-2 text-base sm:text-lg font-bold text-white">Hesap Oluşturun</h3>
                <p className="mb-4 text-xs sm:text-sm text-gray-400 break-words">
                  Twitch veya Kick hesabınızla LootOre'a giriş yapın ve hesabınızı oluşturun.
                </p>
                <div className="mt-auto w-full">
                  <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-800">
                    <Image
                      src="/modern-login-interface.png"
                      alt="Hesap Oluşturma"
                      width={300}
                      height={200}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex h-full flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#9146FF] to-[#00FF00] text-xl sm:text-2xl font-bold text-white">
                  2
                </div>
                <h3 className="mb-2 text-base sm:text-lg font-bold text-white">Yayınları İzleyin</h3>
                <p className="mb-4 text-xs sm:text-sm text-gray-400 break-words">
                  Desteklenen yayıncıları izleyin ve her dakika için puan kazanın.
                </p>
                <div className="mt-auto w-full">
                  <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-800">
                    <Image
                      src="/modern-streaming-interface.png"
                      alt="Yayın İzleme"
                      width={300}
                      height={200}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex h-full flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#9146FF] to-[#00FF00] text-xl sm:text-2xl font-bold text-white">
                  3
                </div>
                <h3 className="mb-2 text-base sm:text-lg font-bold text-white">Ödülleri Alın</h3>
                <p className="mb-4 text-xs sm:text-sm text-gray-400 break-words">
                  Biriktirdiğiniz puanlarla istediğiniz ödülü seçin ve hemen kullanmaya başlayın.
                </p>
                <div className="mt-auto w-full">
                  <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-800">
                    <Image
                      src="/colorful-gift-card-array.png"
                      alt="Ödül Alma"
                      width={300}
                      height={200}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 flex justify-center">
              <div className="rounded-full bg-gradient-to-r from-[#9146FF]/20 to-[#00FF00]/20 px-3 py-2 sm:px-4 sm:py-3 text-center text-xs sm:text-sm md:text-lg font-bold text-white">
                Her ay <span className="text-[#00FF00]">milyonlarca puan</span> dağıtıyoruz!
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
