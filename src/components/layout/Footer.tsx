import { Briefcase, Shield, Lock, Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gradient-dark text-primary-foreground py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold">{t("careerExplorer")}</span>
            </div>
            <p className="text-primary-foreground/70 max-w-md">
              {t("footerDesc")}
            </p>
          </div>

          {/* Security Features */}
          <div>
            <h4 className="font-display font-semibold mb-4">{t("securityFirst")}</h4>
            <ul className="space-y-3 text-primary-foreground/70">
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-secondary" />
                <span>{t("endToEndEncryption")}</span>
              </li>
              <li className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-secondary" />
                <span>{t("privacyProtected")}</span>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">{t("quickLinks")}</h4>
            <ul className="space-y-2 text-primary-foreground/70">
              <li><a href="/upload" className="hover:text-primary-foreground transition-colors">{t("uploadResume")}</a></li>
              <li><a href="/recommendations" className="hover:text-primary-foreground transition-colors">{t("careerInsights")}</a></li>
              <li><a href="/chat" className="hover:text-primary-foreground transition-colors">{t("aiAdvisor")}</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/50 text-sm">
            © 2025 {t("careerExplorer")}. {t("allRightsReserved")}
          </p>
          <p className="text-primary-foreground/50 text-sm flex items-center gap-1">
            {t("madeWith")} <Heart className="w-4 h-4 text-destructive fill-destructive" /> {t("forCareer")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
