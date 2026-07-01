import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Briefcase, MessageSquare, Settings, Upload, Home, Menu, X, LogIn, User as UserIcon, Moon, Sun, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { auth } from "@/lib/auth";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage, languages } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const { data: { subscription } } = auth.onAuthStateChange(
      (event: any, session: any) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          setUserName(session.user.user_metadata?.full_name || null);
        } else {
          setUserName(null);
        }
      }
    );

    auth.getSession().then(({ data: { session } }: any) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setUserName(session.user.user_metadata?.full_name || null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const navItems = [
    { path: "/", label: t("home"), icon: Home },
    { path: "/upload", label: t("uploadResume"), icon: Upload },
    { path: "/recommendations", label: t("careerInsights"), icon: Briefcase },
    { path: "/chat", label: t("aiAdvisor"), icon: MessageSquare },
    { path: "/configure", label: t("configure"), icon: Settings },
  ];

  const handleSignOut = async () => {
    await auth.signOut();
    setUserName(null);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow">
              <Briefcase className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold text-gradient">Career Explorer</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  size="sm"
                  className={isActive(item.path) ? "shadow-md" : ""}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
            
            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Globe className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={language === lang.code ? "bg-accent" : ""}
                  >
                    {lang.nativeName}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth Button */}
            {user ? (
              <div className="flex items-center gap-2">
                {userName && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <UserIcon className="w-4 h-4" />
                    <span className="font-medium">{userName}</span>
                  </div>
                )}
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  {t("signOut")}
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="hero" size="sm">
                  <LogIn className="w-4 h-4" />
                  {t("login")}
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 animate-slide-up">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className="w-full justify-start"
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              ))}
              
              {/* Mobile Theme and Language */}
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm" onClick={toggleTheme} className="flex-1">
                  {theme === "light" ? <Moon className="w-4 h-4 mr-2" /> : <Sun className="w-4 h-4 mr-2" />}
                  {theme === "light" ? "Dark" : "Light"}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Globe className="w-4 h-4 mr-2" />
                      {languages.find(l => l.code === language)?.nativeName}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {languages.map((lang) => (
                      <DropdownMenuItem
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={language === lang.code ? "bg-accent" : ""}
                      >
                        {lang.nativeName}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Mobile Auth Button */}
              {user ? (
                <div className="space-y-2">
                  {userName && (
                    <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
                      <UserIcon className="w-4 h-4" />
                      <span className="font-medium">{userName}</span>
                    </div>
                  )}
                  <Button variant="outline" className="w-full justify-start" onClick={handleSignOut}>
                    {t("signOut")}
                  </Button>
                </div>
              ) : (
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="hero" className="w-full justify-start">
                    <LogIn className="w-4 h-4 mr-2" />
                    {t("login")}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
