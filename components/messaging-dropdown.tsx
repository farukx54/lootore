"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, Send, Clock, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

// Message type definition
interface Message {
  id: string
  content: string
  sender: "user" | "admin"
  timestamp: number
  read: boolean
}

export default function MessagingDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"inbox" | "compose">("inbox")
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [unreadCount, setUnreadCount] = useState(0)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

  // Load messages from localStorage on component mount
  useEffect(() => {
    const storedMessages = localStorage.getItem("userMessages")
    if (storedMessages) {
      const parsedMessages = JSON.parse(storedMessages) as Message[]
      setMessages(parsedMessages)

      // Count unread messages
      const unread = parsedMessages.filter((msg) => !msg.read && msg.sender === "admin").length
      setUnreadCount(unread)
    } else {
      // Add sample messages for demonstration
      const sampleMessages: Message[] = [
        {
          id: "1",
          content:
            "Hoş geldiniz! LootOre'a katıldığınız için teşekkür ederiz. Herhangi bir sorunuz olursa bize mesaj gönderebilirsiniz.",
          sender: "admin",
          timestamp: Date.now() - 86400000, // 1 day ago
          read: false,
        },
        {
          id: "2",
          content: "Bu hafta sonu özel bir etkinliğimiz olacak. Katılarak ekstra puanlar kazanabilirsiniz!",
          sender: "admin",
          timestamp: Date.now() - 43200000, // 12 hours ago
          read: false,
        },
      ]
      setMessages(sampleMessages)
      setUnreadCount(2)
      localStorage.setItem("userMessages", JSON.stringify(sampleMessages))
    }
  }, [])

  // Update localStorage when messages change
  useEffect(() => {
    localStorage.setItem("userMessages", JSON.stringify(messages))
  }, [messages])

  // Update unread count when messages change
  useEffect(() => {
    const unread = messages.filter((msg) => !msg.read && msg.sender === "admin").length
    setUnreadCount(unread)
  }, [messages])

  // Send a new message
  const sendMessage = () => {
    if (newMessage.trim() === "") return

    const userId = localStorage.getItem("userId") || "user_" + Math.random().toString(36).substring(2, 9)

    // Save userId if it doesn't exist
    if (!localStorage.getItem("userId")) {
      localStorage.setItem("userId", userId)
    }

    const newMsg: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "user",
      timestamp: Date.now(),
      read: true,
    }

    setMessages((prev) => [...prev, newMsg])
    setNewMessage("")

    // Simulate admin response after 1-3 seconds
    setTimeout(
      () => {
        const adminResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: `Mesajınız alındı. En kısa sürede size dönüş yapacağız. (UserID: ${userId})`,
          sender: "admin",
          timestamp: Date.now() + 1000,
          read: false,
        }
        setMessages((prev) => [...prev, adminResponse])
      },
      1000 + Math.random() * 2000,
    )
  }

  // Mark a message as read
  const markAsRead = (id: string) => {
    setMessages((prev) => prev.map((msg) => (msg.id === id ? { ...msg, read: true } : msg)))
  }

  // Format timestamp
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) {
      return diffInHours === 0 ? "Az önce" : `${diffInHours} saat önce`
    } else {
      const day = date.getDate().toString().padStart(2, "0")
      const month = (date.getMonth() + 1).toString().padStart(2, "0")
      const year = date.getFullYear()
      return `${day}.${month}.${year}`
    }
  }

  // View a specific message
  const viewMessage = (message: Message) => {
    setSelectedMessage(message)
    if (!message.read) {
      markAsRead(message.id)
    }
  }

  // Back to inbox
  const backToInbox = () => {
    setSelectedMessage(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-white hover:bg-gray-800 w-10 h-10 flex-shrink-0">
          <MessageCircle className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#9146FF] p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <div className="h-[500px] max-h-[80vh]">
          {selectedMessage ? (
            <div className="flex h-full flex-col">
              <div className="flex items-center gap-2 pb-4">
                <Button variant="ghost" size="icon" onClick={backToInbox} className="h-8 w-8">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h3 className="text-lg font-semibold">Mesaj Detayı</h3>
              </div>

              <div className="flex-1 overflow-auto">
                <div className="mb-2 flex items-center justify-between text-sm text-gray-500">
                  <span>{selectedMessage.sender === "admin" ? "Admin" : "Siz"}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTimestamp(selectedMessage.timestamp)}
                  </span>
                </div>
                <div className="rounded-lg bg-gray-800 p-4">
                  <p className="whitespace-pre-wrap text-white">{selectedMessage.content}</p>
                </div>
              </div>

              {selectedMessage.sender === "admin" && (
                <div className="mt-4">
                  <Textarea
                    placeholder="Yanıt yazın..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="min-h-[100px] bg-gray-800 text-white"
                  />
                  <div className="mt-2 flex justify-end">
                    <Button
                      onClick={sendMessage}
                      className="bg-[#9146FF] hover:bg-[#7a38d5]"
                      disabled={newMessage.trim() === ""}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Yanıtla
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Tabs
              defaultValue="inbox"
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as "inbox" | "compose")}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="inbox" className="relative">
                  Gelen Kutusu
                  {unreadCount > 0 && <Badge className="ml-2 bg-[#9146FF]">{unreadCount}</Badge>}
                </TabsTrigger>
                <TabsTrigger value="compose">Yeni Mesaj</TabsTrigger>
              </TabsList>

              <TabsContent value="inbox" className="mt-4 h-[420px]">
                <ScrollArea className="h-full pr-4">
                  {messages.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                      <MessageCircle className="mb-2 h-12 w-12 opacity-20" />
                      <p>Henüz hiç mesajınız yok.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {messages
                        .sort((a, b) => b.timestamp - a.timestamp)
                        .map((message) => (
                          <div
                            key={message.id}
                            onClick={() => viewMessage(message)}
                            className={`cursor-pointer rounded-lg ${
                              message.read ? "bg-gray-800" : "bg-gray-700"
                            } p-3 transition-colors hover:bg-gray-700`}
                          >
                            <div className="mb-1 flex items-center justify-between">
                              <span className="font-medium text-white">
                                {message.sender === "admin" ? "Admin" : "Siz"}
                              </span>
                              <span className="text-xs text-gray-400">{formatTimestamp(message.timestamp)}</span>
                            </div>
                            <p className="line-clamp-2 text-sm text-gray-300">{message.content}</p>
                            {!message.read && message.sender === "admin" && (
                              <Badge className="mt-2 bg-[#9146FF]">Okunmadı</Badge>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="compose" className="mt-4 h-[420px]">
                <div className="flex h-full flex-col">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-white">Yöneticiye Mesaj Gönder</h3>
                    <p className="text-sm text-gray-400">
                      Sorularınız, önerileriniz veya sorunlarınız için bize mesaj gönderebilirsiniz.
                    </p>
                  </div>

                  <Textarea
                    placeholder="Mesajınızı buraya yazın..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 min-h-[200px] bg-gray-800 text-white"
                  />

                  <div className="mt-4 flex justify-end">
                    <Button
                      onClick={sendMessage}
                      className="bg-[#9146FF] hover:bg-[#7a38d5]"
                      disabled={newMessage.trim() === ""}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Gönder
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
