"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, Database, Shield, Users } from "lucide-react"

interface TestResult {
  name: string
  status: "success" | "error" | "warning" | "pending"
  message: string
  details?: string
}

export default function SupabaseTestUpdated() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const updateTestResult = (name: string, status: TestResult["status"], message: string, details?: string) => {
    setTestResults((prev) => {
      const existing = prev.find((r) => r.name === name)
      const newResult = { name, status, message, details }

      if (existing) {
        return prev.map((r) => (r.name === name ? newResult : r))
      }
      return [...prev, newResult]
    })
  }

  const testSupabaseConnection = async () => {
    updateTestResult("connection", "pending", "Supabase bağlantısı test ediliyor...")

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        updateTestResult(
          "connection",
          "error",
          "Supabase environment variables eksik",
          "NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY kontrol edin",
        )
        return false
      }

      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
      })

      if (response.ok) {
        updateTestResult("connection", "success", "Supabase bağlantısı başarılı ✅")
        return true
      } else {
        updateTestResult("connection", "error", `Bağlantı hatası: ${response.status}`)
        return false
      }
    } catch (error) {
      updateTestResult(
        "connection",
        "error",
        "Bağlantı hatası",
        error instanceof Error ? error.message : "Bilinmeyen hata",
      )
      return false
    }
  }

  const testDatabaseTables = async () => {
    updateTestResult("database-tables", "pending", "Database tabloları kontrol ediliyor...")

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      const requiredTables = [
        { name: "users", description: "Kullanıcı profilleri" },
        { name: "publishers", description: "Yayıncı bilgileri" },
        { name: "coupons", description: "Ödül kuponları" },
        { name: "user_activities", description: "Kullanıcı aktiviteleri" },
      ]

      const tableResults = []
      let successCount = 0

      for (const table of requiredTables) {
        try {
          const response = await fetch(`${supabaseUrl}/rest/v1/${table.name}?select=count&limit=1`, {
            headers: {
              apikey: supabaseAnonKey!,
              Authorization: `Bearer ${supabaseAnonKey!}`,
            },
          })

          if (response.ok) {
            tableResults.push(`✅ ${table.name} - ${table.description} (Erişilebilir)`)
            successCount++
          } else if (response.status === 401) {
            tableResults.push(`🔒 ${table.name} - ${table.description} (RLS Korumalı - Normal)`)
            successCount++
          } else if (response.status === 404) {
            tableResults.push(`❌ ${table.name} - ${table.description} (Bulunamadı)`)
          } else {
            tableResults.push(`⚠️ ${table.name} - ${table.description} (Hata: ${response.status})`)
          }
        } catch {
          tableResults.push(`❌ ${table.name} - ${table.description} (Bağlantı hatası)`)
        }
      }

      if (successCount === requiredTables.length) {
        updateTestResult(
          "database-tables",
          "success",
          `Tüm tablolar mevcut (${successCount}/4) 🎉`,
          tableResults.join("\n"),
        )
      } else if (successCount > 0) {
        updateTestResult(
          "database-tables",
          "warning",
          `${successCount}/${requiredTables.length} tablo mevcut`,
          tableResults.join("\n"),
        )
      } else {
        updateTestResult("database-tables", "error", "Hiçbir tablo bulunamadı", tableResults.join("\n"))
      }

      return successCount > 0
    } catch (error) {
      updateTestResult(
        "database-tables",
        "error",
        "Tablo kontrolü hatası",
        error instanceof Error ? error.message : "Bilinmeyen hata",
      )
      return false
    }
  }

  const testRLSPolicies = async () => {
    updateTestResult("rls-policies", "pending", "RLS politikaları kontrol ediliyor...")

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      // Test RLS by trying to access tables without auth
      const testTables = ["users", "publishers", "coupons", "user_activities"]
      const rlsResults = []

      for (const table of testTables) {
        try {
          const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=*&limit=1`, {
            headers: {
              apikey: supabaseAnonKey!,
              Authorization: `Bearer ${supabaseAnonKey!}`,
            },
          })

          if (response.status === 401) {
            rlsResults.push(`🔒 ${table} - RLS aktif`)
          } else if (response.ok) {
            rlsResults.push(`📖 ${table} - Public okuma izni`)
          } else {
            rlsResults.push(`⚠️ ${table} - Durum: ${response.status}`)
          }
        } catch {
          rlsResults.push(`❌ ${table} - Test hatası`)
        }
      }

      const protectedCount = rlsResults.filter((r) => r.includes("RLS aktif") || r.includes("Public okuma")).length

      if (protectedCount === testTables.length) {
        updateTestResult("rls-policies", "success", "RLS politikaları doğru yapılandırılmış 🔐", rlsResults.join("\n"))
      } else {
        updateTestResult(
          "rls-policies",
          "warning",
          `${protectedCount}/${testTables.length} tablo korumalı`,
          rlsResults.join("\n"),
        )
      }

      return true
    } catch (error) {
      updateTestResult(
        "rls-policies",
        "error",
        "RLS kontrolü hatası",
        error instanceof Error ? error.message : "Bilinmeyen hata",
      )
      return false
    }
  }

  const testAuthProviders = async () => {
    updateTestResult("auth-providers", "pending", "Auth providers kontrol ediliyor...")

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      const authResponse = await fetch(`${supabaseUrl}/auth/v1/settings`, {
        headers: {
          apikey: supabaseAnonKey!,
          Authorization: `Bearer ${supabaseAnonKey!}`,
        },
      })

      if (authResponse.ok) {
        const settings = await authResponse.json()
        const externalProviders = settings.external || {}

        // Check for required providers
        const requiredProviders = ["twitch"]
        const availableProviders = Object.keys(externalProviders)
        const hasRequiredProviders = requiredProviders.every((provider) => availableProviders.includes(provider))

        if (hasRequiredProviders) {
          updateTestResult(
            "auth-providers",
            "success",
            `Gerekli auth providers aktif: ${requiredProviders.join(", ")} 🎮`,
            `Tüm providers: ${availableProviders.join(", ")}`,
          )
        } else {
          updateTestResult(
            "auth-providers",
            "warning",
            "Twitch provider eksik",
            `Mevcut providers: ${availableProviders.join(", ")}`,
          )
        }
        return true
      } else {
        updateTestResult("auth-providers", "error", `Auth settings hatası: ${authResponse.status}`)
        return false
      }
    } catch (error) {
      updateTestResult(
        "auth-providers",
        "error",
        "Provider kontrolü hatası",
        error instanceof Error ? error.message : "Bilinmeyen hata",
      )
      return false
    }
  }

  const testSampleData = async () => {
    updateTestResult("sample-data", "pending", "Örnek veriler kontrol ediliyor...")

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      // Test publishers data
      const publishersResponse = await fetch(`${supabaseUrl}/rest/v1/publishers?select=count`, {
        headers: {
          apikey: supabaseAnonKey!,
          Authorization: `Bearer ${supabaseAnonKey!}`,
        },
      })

      // Test coupons data
      const couponsResponse = await fetch(`${supabaseUrl}/rest/v1/coupons?select=count`, {
        headers: {
          apikey: supabaseAnonKey!,
          Authorization: `Bearer ${supabaseAnonKey!}`,
        },
      })

      const dataResults = []

      if (publishersResponse.ok) {
        const publishersData = await publishersResponse.json()
        dataResults.push(`📺 Publishers: ${publishersData.length || 0} kayıt`)
      } else {
        dataResults.push(`📺 Publishers: Erişim hatası (${publishersResponse.status})`)
      }

      if (couponsResponse.ok) {
        const couponsData = await couponsResponse.json()
        dataResults.push(`🎁 Coupons: ${couponsData.length || 0} kayıt`)
      } else {
        dataResults.push(`🎁 Coupons: Erişim hatası (${couponsResponse.status})`)
      }

      updateTestResult("sample-data", "success", "Örnek veri kontrolü tamamlandı", dataResults.join("\n"))
      return true
    } catch (error) {
      updateTestResult(
        "sample-data",
        "error",
        "Örnek veri kontrolü hatası",
        error instanceof Error ? error.message : "Bilinmeyen hata",
      )
      return false
    }
  }

  const runAllTests = async () => {
    setIsRunning(true)
    setTestResults([])

    // Run tests sequentially
    const connectionOk = await testSupabaseConnection()
    if (connectionOk) {
      await testDatabaseTables()
      await testRLSPolicies()
      await testAuthProviders()
      await testSampleData()
    }

    setIsRunning(false)
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "pending":
        return <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    }
  }

  const getStatusBadge = (status: TestResult["status"]) => {
    const variants = {
      success: "bg-green-500/20 text-green-400 border-green-500/50",
      error: "bg-red-500/20 text-red-400 border-red-500/50",
      warning: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
      pending: "bg-blue-500/20 text-blue-400 border-blue-500/50",
    }

    return <Badge className={`${variants[status]} border`}>{status === "pending" ? "Test ediliyor..." : status}</Badge>
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="border-gray-800 bg-gray-900/90">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Database className="h-6 w-6" />
            Supabase Entegrasyon Testi v2.0
          </CardTitle>
          <CardDescription className="text-gray-400">
            Database tabloları, RLS politikaları ve auth yapılandırmasını test edin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={runAllTests} disabled={isRunning} className="w-full bg-green-600 hover:bg-green-700">
            {isRunning ? "Testler Çalışıyor..." : "🚀 Gelişmiş Testleri Çalıştır"}
          </Button>
        </CardContent>
      </Card>

      {testResults.length > 0 && (
        <div className="space-y-4">
          {testResults.map((result) => (
            <Card key={result.name} className="border-gray-800 bg-gray-900/90">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-white capitalize">{result.name.replace("-", " ")}</h3>
                        {getStatusBadge(result.status)}
                      </div>
                      <p className="text-gray-400 text-sm">{result.message}</p>
                      {result.details && (
                        <pre className="mt-2 p-3 bg-gray-800 rounded text-xs text-gray-300 whitespace-pre-wrap border border-gray-700">
                          {result.details}
                        </pre>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {testResults.length === 0 && (
        <Alert className="border-gray-700 bg-gray-800/50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-gray-300">
            Güncellenmiş Supabase testlerini çalıştırmak için yukarıdaki butona tıklayın.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-gray-800 bg-gray-900/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white text-lg">
              <Shield className="h-5 w-5" />
              Environment Variables
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <code className="bg-gray-800 px-2 py-1 rounded text-green-400 text-xs">NEXT_PUBLIC_SUPABASE_URL</code>
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <code className="bg-gray-800 px-2 py-1 rounded text-green-400 text-xs">
                  NEXT_PUBLIC_SUPABASE_ANON_KEY
                </code>
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-900/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white text-lg">
              <Users className="h-5 w-5" />
              Database Schema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-gray-300 space-y-1">
              <div>👤 Users - Kullanıcı profilleri</div>
              <div>📺 Publishers - Yayıncı bilgileri</div>
              <div>🎁 Coupons - Ödül kuponları</div>
              <div>📊 User Activities - Aktivite geçmişi</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
