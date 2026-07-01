import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Send, Bot, User, Loader2, LogIn } from "lucide-react";
import { auth } from "@/lib/auth";
import { chatWithGemini, Message } from "@/lib/gemini";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

const ChatPage = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: t("chatWelcome"),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const { data: { subscription } } = auth.onAuthStateChange(
      (event: any, session: any) => {
        setUser(session?.user ?? null);
        setIsAuthLoading(false);
      }
    );

    auth.getSession().then(({ data: { session } }: any) => {
      setUser(session?.user ?? null);
      setIsAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const apiKey = localStorage.getItem("gemini_api_key");
    if (!apiKey) {
      toast({
        title: "Configuration Required",
        description: "Please set your Gemini API Key in the Configure page.",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const resumeText = localStorage.getItem("resumeText");
    const resumeContext = resumeText ? `Resume summary available for context.` : undefined;

    try {
      const stream = await chatWithGemini([...messages, userMessage], apiKey, resumeContext);

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      let assistantContent = "";

      for await (const chunk of stream) {
        const chunkText = chunk.text();
        assistantContent += chunkText;
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            role: "assistant",
            content: assistantContent,
          };
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: t("chatError"),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-8 flex flex-col">
        <div className="container mx-auto px-4 flex-1 flex flex-col max-w-4xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-display font-bold">
              <span className="text-gradient">{t("aiCareerAdvisor")}</span>
            </h1>
          </div>

          {!isAuthLoading && !user && (
            <Card className="p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8" />
              </div>
              <h3 className="font-display font-semibold text-xl mb-2">
                {t("loginRequired")}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t("loginRequiredDesc")}
              </p>
              <Link to="/auth">
                <Button variant="hero" size="lg">
                  <LogIn className="w-5 h-5" />
                  {t("loginSignUp")}
                </Button>
              </Link>
            </Card>
          )}

          {user && (
            <Card className="flex-1 p-4 shadow-card overflow-hidden flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    {msg.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && messages[messages.length - 1]?.role === "user" && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-muted p-4 rounded-2xl rounded-bl-md">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder={t("askAboutCareers")}
                  className="flex-1 px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  disabled={isLoading}
                />
                <Button onClick={sendMessage} disabled={isLoading || !input.trim()} size="icon" className="w-12 h-12 rounded-xl">
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ChatPage;
