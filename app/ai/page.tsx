"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Bot, Send, Code, Eye, Download, Copy, Check } from "lucide-react"

export default function AIPage() {
  const [userType, setUserType] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const [generatedCode, setGeneratedCode] = useState("")
  const [previewContent, setPreviewContent] = useState("")
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType")
    if (!storedUserType) {
      router.push("/")
      return
    }
    setUserType(storedUserType)

    // Initialize with welcome message
    setMessages([
      {
        role: "assistant",
        content:
          "Hello! I'm LuaGuard AI, your intelligent coding assistant. I can help you with:\n\n• Lua scripting and UI libraries\n• HTML/CSS/JavaScript web development\n• Code optimization and debugging\n• Live previews and 3D visualizations\n• LuaGuard platform guidance\n\nWhat would you like to create today?",
        timestamp: new Date().toLocaleTimeString(),
      },
    ])
  }, [router])

  const simulateAIResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("lua") && (lowerMessage.includes("ui") || lowerMessage.includes("library"))) {
      return {
        content:
          "I'll create a modern Lua UI library for you! Here's a comprehensive library with smooth animations and modern styling:",
        code: `-- LuaGuard Modern UI Library
local UILibrary = {}
local TweenService = game:GetService("TweenService")
local UserInputService = game:GetService("UserInputService")

-- Create main UI
function UILibrary:CreateWindow(title)
    local ScreenGui = Instance.new("ScreenGui")
    local MainFrame = Instance.new("Frame")
    local TitleBar = Instance.new("Frame")
    local TitleLabel = Instance.new("TextLabel")
    local CloseButton = Instance.new("TextButton")
    
    -- Setup ScreenGui
    ScreenGui.Name = "LuaGuardUI"
    ScreenGui.Parent = game.Players.LocalPlayer:WaitForChild("PlayerGui")
    
    -- Main Frame
    MainFrame.Name = "MainFrame"
    MainFrame.Parent = ScreenGui
    MainFrame.BackgroundColor3 = Color3.fromRGB(20, 20, 20)
    MainFrame.BorderSizePixel = 0
    MainFrame.Position = UDim2.new(0.5, -200, 0.5, -150)
    MainFrame.Size = UDim2.new(0, 400, 0, 300)
    MainFrame.Active = true
    MainFrame.Draggable = true
    
    -- Add corner radius
    local Corner = Instance.new("UICorner")
    Corner.CornerRadius = UDim.new(0, 8)
    Corner.Parent = MainFrame
    
    -- Title Bar
    TitleBar.Name = "TitleBar"
    TitleBar.Parent = MainFrame
    TitleBar.BackgroundColor3 = Color3.fromRGB(255, 107, 53)
    TitleBar.BorderSizePixel = 0
    TitleBar.Size = UDim2.new(1, 0, 0, 30)
    
    local TitleCorner = Instance.new("UICorner")
    TitleCorner.CornerRadius = UDim.new(0, 8)
    TitleCorner.Parent = TitleBar
    
    -- Title Label
    TitleLabel.Name = "TitleLabel"
    TitleLabel.Parent = TitleBar
    TitleLabel.BackgroundTransparency = 1
    TitleLabel.Position = UDim2.new(0, 10, 0, 0)
    TitleLabel.Size = UDim2.new(1, -40, 1, 0)
    TitleLabel.Font = Enum.Font.GothamBold
    TitleLabel.Text = title or "LuaGuard UI"
    TitleLabel.TextColor3 = Color3.fromRGB(0, 0, 0)
    TitleLabel.TextSize = 14
    TitleLabel.TextXAlignment = Enum.TextXAlignment.Left
    
    return {
        ScreenGui = ScreenGui,
        MainFrame = MainFrame,
        AddButton = function(text, callback)
            local Button = Instance.new("TextButton")
            Button.Name = text
            Button.Parent = MainFrame
            Button.BackgroundColor3 = Color3.fromRGB(255, 107, 53)
            Button.BorderSizePixel = 0
            Button.Size = UDim2.new(0, 100, 0, 30)
            Button.Font = Enum.Font.Gotham
            Button.Text = text
            Button.TextColor3 = Color3.fromRGB(255, 255, 255)
            Button.TextSize = 12
            
            local ButtonCorner = Instance.new("UICorner")
            ButtonCorner.CornerRadius = UDim.new(0, 4)
            ButtonCorner.Parent = Button
            
            Button.MouseButton1Click:Connect(callback)
            return Button
        end
    }
end

return UILibrary`,
        preview:
          "This Lua UI library creates modern, draggable windows with smooth animations and cyberpunk orange styling that matches LuaGuard's theme.",
      }
    }

    if (lowerMessage.includes("website") || lowerMessage.includes("html")) {
      return {
        content: "I'll create a modern website for you! Here's a responsive design with animations:",
        code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LuaGuard Style Website</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            background: linear-gradient(135deg, #000000, #1a1a1a);
            color: #ff6b35;
            font-family: 'Arial', sans-serif;
            min-height: 100vh;
            overflow-x: hidden;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            text-align: center;
            padding: 50px 0;
            animation: fadeInUp 1s ease-out;
        }
        
        .header h1 {
            font-size: 3rem;
            margin-bottom: 20px;
            text-shadow: 0 0 20px #ff6b35;
        }
        
        .card {
            background: rgba(0, 0, 0, 0.8);
            border: 2px solid #ff6b35;
            border-radius: 10px;
            padding: 30px;
            margin: 20px 0;
            box-shadow: 0 0 30px rgba(255, 107, 53, 0.3);
            animation: slideIn 0.8s ease-out;
        }
        
        .button {
            background: linear-gradient(45deg, #ff6b35, #ff4500);
            color: black;
            border: none;
            padding: 15px 30px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
        }
        
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 107, 53, 0.4);
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(-50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛡️ LuaGuard Style</h1>
            <p>Modern cyberpunk design with smooth animations</p>
        </div>
        
        <div class="card">
            <h2>Welcome to the Future</h2>
            <p>This website features the same cyberpunk aesthetic as LuaGuard with smooth animations and modern styling.</p>
            <button class="button" onclick="alert('Button clicked!')">Get Started</button>
        </div>
        
        <div class="card">
            <h2>Features</h2>
            <ul>
                <li>Responsive design</li>
                <li>Smooth animations</li>
                <li>Cyberpunk theme</li>
                <li>Modern styling</li>
            </ul>
        </div>
    </div>
</body>
</html>`,
        preview:
          "A modern cyberpunk-themed website with smooth animations, gradient backgrounds, and LuaGuard's signature orange color scheme.",
      }
    }

    if (lowerMessage.includes("luaguard") || lowerMessage.includes("script protection")) {
      return {
        content:
          "I can help you with LuaGuard! Here's what you can do:\n\n• Upload scripts in the Projects tab\n• Use User Management for whitelist/blacklist\n• Monitor analytics in the Status tab\n• Obfuscate code for extra protection\n• Generate keys in the admin panel (owner only)\n\nWould you like me to explain any specific feature?",
        code: "",
        preview:
          "LuaGuard offers comprehensive script protection with user management, analytics, and advanced obfuscation.",
      }
    }

    return {
      content:
        "I understand you want help with coding! I can assist with:\n\n• Lua scripting and game development\n• Web development (HTML, CSS, JavaScript)\n• UI/UX design and libraries\n• Code optimization and debugging\n• 3D visualizations and animations\n\nPlease be more specific about what you'd like to create, and I'll provide detailed code examples with live previews!",
      code: "",
      preview: "I'm ready to help you code anything you need!",
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = {
      role: "user",
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = simulateAIResponse(inputMessage)

      const assistantMessage = {
        role: "assistant",
        content: aiResponse.content,
        code: aiResponse.code,
        preview: aiResponse.preview,
        timestamp: new Date().toLocaleTimeString(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      if (aiResponse.code) {
        setGeneratedCode(aiResponse.code)
        setPreviewContent(aiResponse.preview || "")
        setActiveTab("code")
      }

      setIsLoading(false)
    }, 1500)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadCode = () => {
    const element = document.createElement("a")
    const file = new Blob([generatedCode], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "luaguard-ai-generated.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  if (!userType) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-orange-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-black border-b border-orange-500/30 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => router.push("/dashboard")}
              variant="ghost"
              size="sm"
              className="text-orange-400 hover:text-orange-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Bot className="w-8 h-8 text-orange-400" />
            <h1 className="text-2xl font-bold text-orange-400">LuaGuard AI Assistant</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Chat Panel */}
          <Card className="bg-black border-orange-500 flex flex-col">
            <div className="p-4 border-b border-orange-500/30">
              <h3 className="text-lg font-semibold text-orange-400">AI Chat</h3>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-orange-500 text-black"
                        : "bg-black border border-orange-500 text-orange-400"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className="text-xs opacity-60 mt-1">{message.timestamp}</div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-black border border-orange-500 text-orange-400 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                      <div
                        className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                      <span className="ml-2">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-orange-500/30">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask me to code anything..."
                  className="bg-black border-orange-500 text-orange-400"
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading}
                  className="bg-orange-500 hover:bg-orange-600 text-black"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Code/Preview Panel */}
          <Card className="bg-black border-orange-500 flex flex-col">
            <div className="p-4 border-b border-orange-500/30">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button
                    onClick={() => setActiveTab("code")}
                    variant={activeTab === "code" ? "default" : "ghost"}
                    size="sm"
                    className={activeTab === "code" ? "bg-orange-500 text-black" : "text-orange-400"}
                  >
                    <Code className="w-4 h-4 mr-2" />
                    Code
                  </Button>
                  <Button
                    onClick={() => setActiveTab("preview")}
                    variant={activeTab === "preview" ? "default" : "ghost"}
                    size="sm"
                    className={activeTab === "preview" ? "bg-orange-500 text-black" : "text-orange-400"}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </div>

                {generatedCode && (
                  <div className="flex gap-2">
                    <Button
                      onClick={copyCode}
                      size="sm"
                      className="bg-black border border-orange-500 text-orange-400 hover:bg-orange-500/10"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <Button
                      onClick={downloadCode}
                      size="sm"
                      className="bg-black border border-orange-500 text-orange-400 hover:bg-orange-500/10"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              {activeTab === "code" ? (
                <div className="h-full">
                  {generatedCode ? (
                    <Textarea
                      value={generatedCode}
                      readOnly
                      className="h-full bg-black border-orange-500 text-orange-400 font-mono text-sm resize-none"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-orange-400/60">
                      Generated code will appear here
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full">
                  {previewContent ? (
                    <div className="bg-black/50 border border-orange-500/30 rounded p-4 h-full">
                      <h4 className="text-orange-400 font-semibold mb-2">Live Preview</h4>
                      <p className="text-orange-400">{previewContent}</p>
                      <div className="mt-4 p-4 bg-orange-500/10 border border-orange-500/30 rounded">
                        <div className="text-orange-400 text-sm">
                          🚀 This code is ready to use! Copy or download it from the Code tab.
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-orange-400/60">
                      Live preview will appear here
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
