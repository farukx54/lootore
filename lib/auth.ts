// Twitch ve Kick kimlik doğrulama için yardımcı fonksiyonlar
export type AuthProvider = "twitch" | "kick"

export interface UserProfile {
  id: string
  username: string | null
  displayName: string
  avatar: string
  provider: AuthProvider
  providerUsername: string
}

// Kullanıcı oturum bilgilerini localStorage'da saklama
export const saveUserSession = (profile: UserProfile) => {
  localStorage.setItem("userProfile", JSON.stringify(profile))
  localStorage.setItem("isLoggedIn", "true")
}

// Kullanıcı oturum bilgilerini localStorage'dan alma
export const getUserSession = (): UserProfile | null => {
  const profile = localStorage.getItem("userProfile")
  return profile ? JSON.parse(profile) : null
}

// Kullanıcı oturumunu sonlandırma
export const clearUserSession = () => {
  localStorage.removeItem("userProfile")
  localStorage.setItem("isLoggedIn", "false")
}

// Kullanıcının ilk kez giriş yapıp yapmadığını kontrol etme
export const isFirstTimeLogin = (profile: UserProfile): boolean => {
  return profile.username === null
}

// Twitch ile kimlik doğrulama (gerçek uygulamada OAuth kullanılacak)
export const authenticateWithTwitch = (): Promise<UserProfile> => {
  // Bu fonksiyon gerçek uygulamada Twitch OAuth API'sini kullanacak
  // Şimdilik simüle ediyoruz
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `twitch-${Math.random().toString(36).substring(2, 9)}`,
        username: null, // İlk girişte null, kullanıcı adı oluşturma ekranı gösterilecek
        displayName: "Twitch Kullanıcısı",
        avatar: "/abstract-user-icon.png",
        provider: "twitch",
        providerUsername: "twitch_user",
      })
    }, 1000)
  })
}

// Kick ile kimlik doğrulama (gerçek uygulamada OAuth kullanılacak)
export const authenticateWithKick = (): Promise<UserProfile> => {
  // Bu fonksiyon gerçek uygulamada Kick OAuth API'sini kullanacak
  // Şimdilik simüle ediyoruz
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `kick-${Math.random().toString(36).substring(2, 9)}`,
        username: null, // İlk girişte null, kullanıcı adı oluşturma ekranı gösterilecek
        displayName: "Kick Kullanıcısı",
        avatar: "/abstract-user-icon.png",
        provider: "kick",
        providerUsername: "kick_user",
      })
    }, 1000)
  })
}

// Kullanıcı adını güncelleme
export const updateUsername = (profile: UserProfile, username: string): UserProfile => {
  const updatedProfile = { ...profile, username }
  saveUserSession(updatedProfile)
  return updatedProfile
}
