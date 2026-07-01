import { Upload, Cpu, Briefcase, MessageSquare, TrendingUp, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const HowItWorks = () => {
  const { t } = useLanguage();

  const steps = [
    {
      icon: Upload,
      titleKey: "uploadResumeStep",
      descriptionKey: "uploadResumeStepDesc",
      color: "primary",
    },
    {
      icon: Cpu,
      titleKey: "aiAnalysis",
      descriptionKey: "aiAnalysisDesc",
      color: "secondary",
    },
    {
      icon: Briefcase,
      titleKey: "jobMatchingStep",
      descriptionKey: "jobMatchingStepDesc",
      color: "accent",
    },
    {
      icon: TrendingUp,
      titleKey: "careerInsightsStep",
      descriptionKey: "careerInsightsStepDesc",
      color: "success",
    },
    {
      icon: MessageSquare,
      titleKey: "aiAdvisorStep",
      descriptionKey: "aiAdvisorStepDesc",
      color: "primary",
    },
    {
      icon: CheckCircle,
      titleKey: "takeAction",
      descriptionKey: "takeActionDesc",
      color: "secondary",
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            {t("howItWorks")} <span className="text-gradient">{t("works")}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("howItWorksDesc")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <StepCard 
              key={index} 
              icon={step.icon}
              title={t(step.titleKey)}
              description={t(step.descriptionKey)}
              color={step.color}
              stepNumber={index + 1} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const StepCard = ({ 
  icon: Icon, 
  title, 
  description, 
  color, 
  stepNumber 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  color: string;
  stepNumber: number;
}) => {
  const colorMap: Record<string, string> = {
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    accent: "bg-accent text-accent-foreground",
    success: "bg-success text-success-foreground",
  };

  return (
    <div className="group relative bg-card p-6 rounded-2xl shadow-card border border-border/50 hover:shadow-lg transition-all duration-300">
      {/* Step Number */}
      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-foreground text-background text-sm font-bold flex items-center justify-center shadow-md">
        {stepNumber}
      </div>

      <div className={`w-14 h-14 rounded-xl ${colorMap[color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-7 h-7" />
      </div>

      <h3 className="font-display font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
};

export default HowItWorks;
