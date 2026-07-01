import { useState, useCallback, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/auth";
import { analyzeResume } from "@/lib/gemini";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = auth.onAuthStateChange(
      (event: any, session: any) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    auth.getSession().then(({ data: { session } }: any) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await getDocument({ data: arrayBuffer }).promise;
      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .filter((item: any) => item.str)
          .map((item: any) => item.str)
          .join(" ");
        fullText += pageText + "\n";
      }

      return fullText.trim();
    } catch (err) {
      console.error("PDF extraction error:", err);
      throw err;
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFile = async (selectedFile: File) => {
    if (selectedFile.type === "text/plain" || selectedFile.name.endsWith(".txt")) {
      const text = await selectedFile.text();
      setResumeText(text);
      setFile(selectedFile);
    } else if (selectedFile.type === "application/pdf" || selectedFile.name.endsWith(".pdf")) {
      setFile(selectedFile);
      setIsParsing(true);
      toast({
        title: "Processing PDF",
        description: "Extracting text from your PDF resume...",
      });
      try {
        const extractedText = await extractTextFromPDF(selectedFile);
        if (extractedText) {
          setResumeText(extractedText);
          toast({
            title: "PDF Processed",
            description: "Resume text extracted successfully!",
          });
        } else {
          toast({
            title: "PDF Empty",
            description: "No text found in PDF. Please paste your resume text manually.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("PDF parsing error:", error);
        toast({
          title: "PDF Processing Failed",
          description: "Could not extract text. Please paste your resume text manually.",
          variant: "destructive",
        });
      } finally {
        setIsParsing(false);
      }
    } else {
      toast({
        title: "Unsupported Format",
        description: "Please upload a .pdf or .txt file.",
        variant: "destructive",
      });
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const processResume = async () => {
    if (!resumeText.trim()) {
      toast({
        title: "No Content",
        description: "Please paste your resume text or upload a file.",
        variant: "destructive",
      });
      return;
    }
    
    const apiKey = localStorage.getItem("gemini_api_key");
    if (!apiKey) {
      toast({
        title: "Configuration Required",
        description: "Please set your Gemini API Key in the Configure page.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const data = await analyzeResume(resumeText, apiKey);

      localStorage.setItem("resumeAnalysis", JSON.stringify(data));
      localStorage.setItem("resumeText", resumeText);

      toast({
        title: "Success!",
        description: "Your resume has been analyzed. Redirecting to insights...",
      });

      setTimeout(() => navigate("/recommendations"), 1500);
    } catch (error: any) {
      console.error("Error processing resume:", error);
      toast({
        title: "Processing Failed",
        description: error.message || "Failed to analyze resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Upload Your <span className="text-gradient">Resume</span>
            </h1>
            <p className="text-muted-foreground">
              Our AI will analyze your resume and provide personalized career recommendations.
            </p>
          </div>

          {!isLoading && !user && (
            <Card className="p-8 text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8" />
              </div>
              <h3 className="font-display font-semibold text-xl mb-2">
                Login Required
              </h3>
              <p className="text-muted-foreground mb-6">
                Please login or create an account to analyze your resume and get personalized career recommendations.
              </p>
              <Link to="/auth">
                <Button variant="hero" size="lg">
                  <LogIn className="w-5 h-5" />
                  Login / Sign Up
                </Button>
              </Link>
            </Card>
          )}

          {user && (
            <>
              <Card
                className={`p-8 border-2 border-dashed transition-all duration-300 ${
                  dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                    {file ? <FileText className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">
                    {file ? file.name : "Drag & Drop your resume"}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    or click to browse (.pdf and .txt files supported)
                  </p>
                  <input
                    type="file"
                    accept=".txt,.pdf"
                    onChange={handleFileInput}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" asChild className="cursor-pointer">
                      <span>Browse Files</span>
                    </Button>
                  </label>
                </div>
              </Card>

              <div className="mt-8">
                <label className="block font-medium mb-2">Or paste your resume text:</label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your complete resume content here..."
                  className="w-full h-64 p-4 rounded-xl border border-border bg-card focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
                />
              </div>

              <div className="mt-8 text-center">
                <Button
                  variant="hero"
                  size="xl"
                  onClick={processResume}
                  disabled={isProcessing || isParsing || !resumeText.trim()}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing Resume...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Analyze My Resume
                    </>
                  )}
                </Button>
              </div>

              <div className="mt-8 flex items-start gap-3 p-4 rounded-xl bg-success/10 text-success">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  Your resume data is processed securely and never shared. We use advanced encryption 
                  to protect your personal information.
                </p>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UploadPage;
