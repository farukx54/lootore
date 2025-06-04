"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, Database, Shield } from "lucide-react"
// clearUserSession referansını kaldırın veya supabase client'dan alın

interface TestResult {
  name: string
  status: "success" | "error" | "warning" | "pending"
  message: string
  details?: string
}

export default function SupabaseTest() {
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
      // Test environment variables
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

      // Test basic connection
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
      })

      if (response.ok) {
        updateTestResult("connection", "success", "Supabase bağlantısı başarılı")
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

  const testAuthTables = async () => {
    updateTestResult("auth-tables", "pending", "Auth tabloları kontrol ediliyor...")

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      // Test users table
      const usersResponse = await fetch(`${supabaseUrl}/rest/v1/users?select=count`, {
        headers: {
          apikey: supabaseAnonKey!,
          Authorization: `Bearer ${supabaseAnonKey!}`,
          "Content-Type": "application/json",
        },
      })

      if (usersResponse.ok) {
        updateTestResult("auth-tables", "success", "Users tablosu erişilebilir")
        return true
      } else if (usersResponse.status === 401) {
        updateTestResult("auth-tables", "warning", "Users tablosu RLS korumalı (normal)")
        return true
      } else {
        updateTestResult("auth-tables", "error", `Users tablosu hatası: ${usersResponse.status}`)
        return false
      }
    } catch (error) {
      updateTestResult(
        "auth-tables",
        "error",
        "Tablo kontrolü hatası",
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

      // Test auth settings endpoint
      const authResponse = await fetch(`${supabaseUrl}/auth/v1/settings`, {
        headers: {
          apikey: supabaseAnonKey!,
          Authorization: `Bearer ${supabaseAnonKey!}`,
        },
      })

      if (authResponse.ok) {
        const settings = await authResponse.json()
        const hasExternalProviders = settings.external && Object.keys(settings.external).length > 0

        if (hasExternalProviders) {
          const providers = Object.keys(settings.external).join(", ")
          updateTestResult("auth-providers", "success", `Auth providers aktif: ${providers}`)
        } else {
          updateTestResult("auth-providers", "warning", "Harici auth provider bulunamadı")
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

  const testDatabaseSchema = async () => {
    updateTestResult("database-schema", "pending", "Database schema kontrol ediliyor...")

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      // Test required tables
      const requiredTables = ["users", "publishers", "coupons", "user_activities"]
      const tableResults = []

      for (const table of requiredTables) {
        try {
          const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=*&limit=1`, {
            headers: {
              apikey: supabaseAnonKey!,
              Authorization: `Bearer ${supabaseAnonKey!}`,
            },
          })

          if (response.ok || response.status === 401) {
            // 401 means table exists but RLS protected
            tableResults.push(`✓ ${table}`)
          } else {
            tableResults.push(`✗ ${table} (${response.status})`)
          }
        } catch {
          tableResults.push(`✗ ${table} (error)`)
        }
      }

      const successCount = tableResults.filter((r) => r.startsWith("✓")).length
      if (successCount === requiredTables.length) {
        updateTestResult("database-schema", "success", "Tüm gerekli tablolar mevcut", tableResults.join("\n"))
      } else {
        updateTestResult(
          "database-schema",
          "warning",
          `${successCount}/${requiredTables.length} tablo mevcut`,
          tableResults.join("\n"),
        )
      }

      return true
    } catch (error) {
      updateTestResult(
        "database-schema",
        "error",
        "Schema kontrolü hatası",
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
      await testAuthTables()
      await testAuthProviders()
      await testDatabaseSchema()
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
            Supabase Entegrasyon Testi
          </CardTitle>
          <CardDescription className="text-gray-400">
            Supabase bağlantısı, auth yapılandırması ve database schema'sını test edin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={runAllTests} disabled={isRunning} className="w-full bg-green-600 hover:bg-green-700">
            {isRunning ? "Testler Çalışıyor..." : "Tüm Testleri Çalıştır"}
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
                        <pre className="mt-2 p-2 bg-gray-800 rounded text-xs text-gray-300 whitespace-pre-wrap">
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
            Supabase entegrasyonunu test etmek için yukarıdaki butona tıklayın.
          </AlertDescription>
        </Alert>
      )}

      <Card className="border-gray-800 bg-gray-900/90">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Shield className="h-6 w-6" />
            Gerekli Environment Variables
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <code className="bg-gray-800 px-2 py-1 rounded text-green-400">NEXT_PUBLIC_SUPABASE_URL</code>
              {process.env.NEXT_PUBLIC_SUPABASE_URL ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <code className="bg-gray-800 px-2 py-1 rounded text-green-400">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
              {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
