
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft, Shield } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground hero-gradient">
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center text-sm text-foreground/70 hover:text-love-500 mb-6 transition-colors animate-fade-in">
            <ChevronLeft size={16} className="mr-1" />
            Back to Home
          </Link>
          
          <div className="glass p-8 md:p-12 rounded-3xl animate-scale-in">
            <div className="w-16 h-16 bg-love-100 dark:bg-love-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-love-600 dark:text-love-400" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center gradient-text animate-text-shimmer">
              Privacy Policy
            </h1>
            
            <div className="space-y-6 text-foreground/80 animate-fade-up" style={{ animationDelay: "200ms" }}>
              <p>Last Updated: May 1, 2023</p>
              
              <div>
                <h2 className="text-xl font-semibold mb-3 text-love-600 dark:text-love-400">1. Information We Collect</h2>
                <p className="mb-4">LovelyAI collects information that you provide directly to us, such as when you create an account, update your profile, or communicate with us. This may include:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Contact information (name, email address, phone number)</li>
                  <li>Profile information (age, gender, interests, relationship status)</li>
                  <li>Communication preferences</li>
                  <li>Any other information you choose to provide</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3 text-love-600 dark:text-love-400">2. How We Use Your Information</h2>
                <p className="mb-4">We use the information we collect to:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Personalize your experience</li>
                  <li>Send you technical notices, updates, and administrative messages</li>
                  <li>Respond to your comments, questions, and requests</li>
                  <li>Monitor and analyze trends, usage, and activities</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3 text-love-600 dark:text-love-400">3. Sharing of Information</h2>
                <p className="mb-4">We do not share personal information with companies, organizations, or individuals outside of LovelyAI except in the following circumstances:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>With your consent</li>
                  <li>For legal reasons</li>
                  <li>With trusted service providers who work on our behalf</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3 text-love-600 dark:text-love-400">4. Your Choices</h2>
                <p className="mb-4">You have choices regarding the information we collect and how it is used:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Account Information: You may update, correct, or delete your account information at any time by logging into your account</li>
                  <li>Cookies: Most web browsers are set to accept cookies by default. You can usually choose to set your browser to remove or reject browser cookies</li>
                  <li>Promotional Communications: You may opt out of receiving promotional communications from us by following the instructions in those messages</li>
                </ul>
              </div>
              
              <div className="pt-4">
                <p className="text-sm text-center text-foreground/60">
                  For questions about our privacy practices, please <Link to="/contact" className="text-love-500 hover:underline">contact us</Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
