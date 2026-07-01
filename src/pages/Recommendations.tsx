import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Briefcase, TrendingUp, AlertTriangle, CheckCircle, 
  Lightbulb, Upload, Building, IndianRupee, Target, GraduationCap, ExternalLink
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Course recommendations based on skills
const getCourseRecommendations = (weakness: string): { name: string; platform: string; url: string }[] => {
  const lowercased = weakness.toLowerCase();
  
  if (lowercased.includes("python") || lowercased.includes("programming")) {
    return [
      { name: "Python for Everybody", platform: "Coursera", url: "https://www.coursera.org/specializations/python" },
      { name: "Complete Python Bootcamp", platform: "Udemy", url: "https://www.udemy.com/course/complete-python-bootcamp/" }
    ];
  }
  if (lowercased.includes("data") || lowercased.includes("analytics")) {
    return [
      { name: "Google Data Analytics", platform: "Coursera", url: "https://www.coursera.org/professional-certificates/google-data-analytics" },
      { name: "Data Science Specialization", platform: "Coursera", url: "https://www.coursera.org/specializations/jhu-data-science" }
    ];
  }
  if (lowercased.includes("machine learning") || lowercased.includes("ai") || lowercased.includes("ml")) {
    return [
      { name: "Machine Learning by Stanford", platform: "Coursera", url: "https://www.coursera.org/learn/machine-learning" },
      { name: "Deep Learning Specialization", platform: "Coursera", url: "https://www.coursera.org/specializations/deep-learning" }
    ];
  }
  if (lowercased.includes("cloud") || lowercased.includes("aws") || lowercased.includes("azure")) {
    return [
      { name: "AWS Cloud Practitioner", platform: "AWS", url: "https://aws.amazon.com/training/learn-about/cloud-practitioner/" },
      { name: "Azure Fundamentals", platform: "Microsoft", url: "https://learn.microsoft.com/en-us/certifications/azure-fundamentals/" }
    ];
  }
  if (lowercased.includes("communication") || lowercased.includes("soft skills")) {
    return [
      { name: "Communication Skills", platform: "LinkedIn Learning", url: "https://www.linkedin.com/learning/topics/communication" },
      { name: "Business Communication", platform: "Coursera", url: "https://www.coursera.org/learn/wharton-communication-skills" }
    ];
  }
  if (lowercased.includes("leadership") || lowercased.includes("management")) {
    return [
      { name: "Leadership Principles", platform: "edX", url: "https://www.edx.org/learn/leadership" },
      { name: "Management Essentials", platform: "Coursera", url: "https://www.coursera.org/learn/management-essentials" }
    ];
  }
  if (lowercased.includes("web") || lowercased.includes("frontend") || lowercased.includes("react")) {
    return [
      { name: "The Web Developer Bootcamp", platform: "Udemy", url: "https://www.udemy.com/course/the-web-developer-bootcamp/" },
      { name: "Meta Front-End Developer", platform: "Coursera", url: "https://www.coursera.org/professional-certificates/meta-front-end-developer" }
    ];
  }
  // Default courses for general improvement
  return [
    { name: "Learning How to Learn", platform: "Coursera", url: "https://www.coursera.org/learn/learning-how-to-learn" },
    { name: "Career Success Specialization", platform: "Coursera", url: "https://www.coursera.org/specializations/career-success" }
  ];
};

interface JobMatch {
  role: string;
  matchPercentage: number;
  company: string;
  salaryRange: string;
  description: string;
  requiredSkills: string[];
  missingSkills: string[];
}

interface ResumeAnalysis {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  skills: string[];
  experience: string;
  projects: string;
  education: string;
  careerRecommendations: JobMatch[];
  resumeImprovements: string[];
}

const RecommendationsPage = () => {
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const stored = localStorage.getItem("resumeAnalysis");
    if (stored) {
      setAnalysis(JSON.parse(stored));
    }
  }, []);

  if (!analysis) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
              <Upload className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-display font-bold mb-4">{t("noResumeYet")}</h2>
            <p className="text-muted-foreground mb-6">{t("uploadToGetInsights")}</p>
            <Link to="/upload">
              <Button variant="hero" size="lg">
                <Upload className="w-5 h-5" />
                {t("uploadResume")}
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              {t("yourCareer")} <span className="text-gradient">{t("insights")}</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">{analysis.summary}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Strengths */}
              <Card className="p-6 shadow-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-semibold text-lg">{t("strengths")}</h3>
                </div>
                <ul className="space-y-2">
                  {analysis.strengths?.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Weaknesses with Course Suggestions */}
              <Card className="p-6 shadow-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-warning/10 text-warning flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-semibold text-lg">{t("areasToImprove")}</h3>
                </div>
                <ul className="space-y-4">
                  {analysis.weaknesses?.map((w, i) => {
                    const courses = getCourseRecommendations(w);
                    return (
                      <li key={i} className="space-y-2">
                        <div className="flex items-start gap-2 text-sm">
                          <AlertTriangle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                          <span>{w}</span>
                        </div>
                        {courses.length > 0 && (
                          <div className="ml-6 space-y-1">
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <GraduationCap className="w-3 h-3" />
                              {t("suggestedCourses")}
                            </p>
                            {courses.map((course, j) => (
                              <a
                                key={j}
                                href={course.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-primary hover:underline"
                              >
                                <ExternalLink className="w-3 h-3" />
                                {course.name} ({course.platform})
                              </a>
                            ))}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </Card>

              {/* Skills */}
              <Card className="p-6 shadow-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-semibold text-lg">{t("skills")}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.skills?.map((skill, i) => (
                    <Badge key={i} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </Card>
            </div>

            {/* Center Column - Job Matches */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-display font-bold flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-primary" />
                {t("jobRecommendations")}
              </h2>

              {analysis.careerRecommendations?.map((job, i) => (
                <Card key={i} className="p-6 shadow-card hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-display font-semibold text-xl mb-1">{job.role}</h3>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building className="w-4 h-4" />
                        <span>{job.company}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-success font-semibold">
                          <IndianRupee className="w-4 h-4" />
                          {job.salaryRange}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Match Percentage */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        {t("matchScore")}
                      </span>
                      <span className={`font-bold ${job.matchPercentage >= 70 ? 'text-success' : job.matchPercentage >= 50 ? 'text-warning' : 'text-destructive'}`}>
                        {job.matchPercentage}%
                      </span>
                    </div>
                    <Progress value={job.matchPercentage} className="h-2" />
                  </div>

                  <p className="text-muted-foreground text-sm mb-4">{job.description}</p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-2">{t("requiredSkills")}</p>
                      <div className="flex flex-wrap gap-1">
                        {job.requiredSkills?.map((skill, j) => (
                          <Badge key={j} variant="outline" className="text-xs">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                    {job.missingSkills?.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2 text-warning">{t("skillsToLearn")}</p>
                        <div className="flex flex-wrap gap-1">
                          {job.missingSkills?.map((skill, j) => (
                            <Badge key={j} variant="destructive" className="text-xs">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}

              {/* Resume Improvements */}
              <Card className="p-6 shadow-card bg-accent/5 border-accent/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-semibold text-lg">{t("resumeImprovementTips")}</h3>
                </div>
                <ul className="space-y-3">
                  {analysis.resumeImprovements?.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {i + 1}
                      </span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RecommendationsPage;
