
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft, ScrollText } from "lucide-react";

const Terms = () => {
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
              <ScrollText className="h-8 w-8 text-love-600 dark:text-love-400" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center gradient-text animate-text-shimmer">
              Terms of Service
            </h1>
            
            <div className="space-y-6 text-foreground/80 animate-fade-up" style={{ animationDelay: "200ms" }}>
              <p>Last Updated: May 1, 2023</p>
              
              <div>
                <h2 className="text-xl font-semibold mb-3 text-love-600 dark:text-love-400">1. Acceptance of Terms</h2>
                <p className="mb-4">By accessing or using loverprompt, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3 text-love-600 dark:text-love-400">2. Use License</h2>
                <p className="mb-4">Permission is granted to temporarily access loverprompt for personal, non-commercial use only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose</li>
                  <li>Remove any copyright or other proprietary notations from the materials</li>
                  <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3 text-love-600 dark:text-love-400">3. Disclaimer</h2>
                <p className="mb-4">The materials on loverprompt are provided on an 'as is' basis. loverprompt makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3 text-love-600 dark:text-love-400">4. Limitations</h2>
                <p className="mb-4">In no event shall loverprompt or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on loverprompt, even if loverprompt or a loverprompt authorized representative has been notified orally or in writing of the possibility of such damage.</p>
              </div>
              
              <div className="pt-4">
                <p className="text-sm text-center text-foreground/60">
                  For questions about these Terms, please <Link to="/contact" className="text-love-500 hover:underline">contact us</Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
