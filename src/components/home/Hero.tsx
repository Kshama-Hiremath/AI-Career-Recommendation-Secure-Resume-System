import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Upload, MessageSquare, Sparkles, Shield, TrendingUp, Target } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="min-h-screen pt-24 pb-16 flex items-center relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">{t("aiPoweredCareer")}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight">
              {t("discoverPerfect")}{" "}
              <span className="text-gradient">{t("perfectCareer")}</span>{" "}
              {t("pathWithAI")}
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-xl">
              {t("heroDescription")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/upload">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  <Upload className="w-5 h-5" />
                  {t("uploadResume")}
                </Button>
              </Link>
              <Link to="/chat">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  <MessageSquare className="w-5 h-5" />
                  {t("chatWithAI")}
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-success" />
                <span className="text-sm">{t("securePrivate")}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="text-sm">{t("realTimeInsights")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-accent" />
                <span className="text-sm">{t("personalizedMatches")}</span>
              </div>
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="relative">
            <div className="grid gap-4">
              <FeatureCard
                icon={<Upload className="w-6 h-6" />}
                title={t("smartResume")}
                description={t("smartResumeDesc")}
                color="primary"
                delay={0}
              />
              <FeatureCard
                icon={<Target className="w-6 h-6" />}
                title={t("jobMatching")}
                description={t("jobMatchingDesc")}
                color="secondary"
                delay={1}
              />
              <FeatureCard
                icon={<TrendingUp className="w-6 h-6" />}
                title={t("careerGrowth")}
                description={t("careerGrowthDesc")}
                color="accent"
                delay={2}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  color, 
  delay 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  color: "primary" | "secondary" | "accent";
  delay: number;
}) => {
  const colorClasses = {
    primary: "bg-primary/10 text-primary border-primary/20",
    secondary: "bg-secondary/10 text-secondary border-secondary/20",
    accent: "bg-accent/10 text-accent border-accent/20",
  };

  return (
    <div 
      className="bg-card p-6 rounded-2xl shadow-card border border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in"
      style={{ animationDelay: `${delay * 150}ms` }}
    >
      <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="font-display font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
};

export default Hero;
