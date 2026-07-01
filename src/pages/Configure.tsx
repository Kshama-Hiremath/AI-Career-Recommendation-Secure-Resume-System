import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Shield, CheckCircle, AlertCircle, Key, Eye, EyeOff, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { chatWithGemini } from "@/lib/gemini";

const ConfigurePage = () => {
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedKey = localStorage.getItem("gemini_api_key");
    if (savedKey) setApiKey(savedKey);
  }, []);

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem("gemini_api_key", apiKey.trim());
      toast({
        title: "API Key Saved",
        description: "Your Gemini API key has been saved locally.",
      });
    } else {
      localStorage.removeItem("gemini_api_key");
      toast({
        title: "Settings Updated",
        description: "API Key removed.",
      });
    }
  };

  const testConnection = async () => {
    setTestStatus("testing");
    
    try {
      if (!apiKey.trim()) {
          throw new Error("No API Key");
      }
      
      const stream = await chatWithGemini([{ role: "user", content: "Hello" }], apiKey);
      for await (const chunk of stream) {
          // just consume to ensure it works
      }

      setTestStatus("success");
      toast({
        title: "Connection Successful",
        description: "Your API key is working correctly.",
      });
    } catch (e: any) {
      console.error(e);
      setTestStatus("error");
      toast({
        title: "Connection Failed",
        description: e.message || "Could not connect with your API key.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              <span className="text-gradient">Configure</span>
            </h1>
            <p className="text-muted-foreground">
              Manage AI configuration and test services.
            </p>
          </div>

          <div className="space-y-6">
            <Card className="p-6 shadow-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Key className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-display font-semibold text-xl">API Key Settings</h2>
                  <p className="text-muted-foreground text-sm">Enter your Gemini API key</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="apiKey">Gemini API Key</Label>
                      <div className="relative">
                        <Input
                          id="apiKey"
                          type={showApiKey ? "text" : "password"}
                          placeholder="Enter your Gemini API key..."
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                      <div className="flex gap-2">
                        <Info className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-muted-foreground">
                          <p className="font-medium text-foreground mb-1">How to get your Gemini API key:</p>
                          <ol className="list-decimal list-inside space-y-1">
                            <li>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google AI Studio</a></li>
                            <li>Sign in with your Google account</li>
                            <li>Click "Create API Key"</li>
                            <li>Copy the key and paste it here</li>
                          </ol>
                          <p className="mt-2 text-xs">Your API key is stored locally in your browser and never sent to our servers.</p>
                        </div>
                      </div>
                    </div>

                    <Button onClick={saveApiKey} variant="outline" className="w-full">
                      Save API Key
                    </Button>
                  </div>
              </div>
            </Card>

            <Card className="p-6 shadow-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Settings className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-display font-semibold text-xl">Test Connection</h2>
                  <p className="text-muted-foreground text-sm">Verify AI service is working</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="font-medium">
                      Gemini API
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {testStatus === "success" && (
                      <span className="flex items-center gap-1 text-success text-sm">
                        <CheckCircle className="w-4 h-4" />
                        Connected
                      </span>
                    )}
                    {testStatus === "error" && (
                      <span className="flex items-center gap-1 text-destructive text-sm">
                        <AlertCircle className="w-4 h-4" />
                        Error
                      </span>
                    )}
                    {testStatus === "idle" && (
                      <span className="text-muted-foreground text-sm">Not tested</span>
                    )}
                    {testStatus === "testing" && (
                      <span className="text-muted-foreground text-sm">Testing...</span>
                    )}
                  </div>
                </div>

                <Button 
                  onClick={testConnection} 
                  variant="hero" 
                  className="w-full"
                  disabled={testStatus === "testing" || !apiKey.trim()}
                >
                  {testStatus === "testing" ? "Testing..." : "Test AI Connection"}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ConfigurePage;
