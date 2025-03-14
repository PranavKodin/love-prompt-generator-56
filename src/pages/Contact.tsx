
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { Heart, Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function Contact() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const { toast } = useToast();
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. We'll get back to you soon!",
        variant: "default",
      });
      
      setIsSubmitting(false);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-background text-foreground">
      <Navbar toggleSidebar={toggleSidebar} />
      <main className="flex-1 pt-24">
        <div className="flex">
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
          <div className="w-full">
            {/* Hero Section */}
            <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-love-50/40 via-background to-background dark:from-midnight-900/20 dark:via-background dark:to-background z-0"></div>
              
              {/* Floating elements */}
              <div className="absolute top-1/4 right-1/5 w-64 h-64 rounded-full bg-love-200/20 dark:bg-love-800/10 blur-3xl animate-float opacity-70"></div>
              <div className="absolute bottom-1/3 left-1/5 w-56 h-56 rounded-full bg-love-300/20 dark:bg-love-700/20 blur-3xl animate-float opacity-60" style={{animationDelay: "2s"}}></div>
              
              <div className="container mx-auto relative z-10">
                <div className="text-center max-w-3xl mx-auto">
                  <div className="inline-block rounded-full bg-love-100 dark:bg-love-900/30 px-4 py-1 mb-4 animate-fade-in">
                    <span className="text-sm font-medium text-love-600 dark:text-love-400 flex items-center justify-center">
                      <Heart size={14} className="mr-1.5 animate-pulse-slow" />
                      Get in Touch
                      <Heart size={14} className="ml-1.5 animate-pulse-slow" style={{animationDelay: "1s"}} />
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-text-shimmer">
                    Let's <span className="font-great-vibes text-5xl md:text-6xl lg:text-7xl gradient-text">Connect</span>
                  </h1>
                  <p className="text-lg md:text-xl text-foreground/80 animate-text-fade">
                    Have questions or feedback? We'd love to hear from you!
                  </p>
                </div>
              </div>
            </section>
            
            {/* Contact Form Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 relative">
              <div className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  {/* Contact Info */}
                  <div className="lg:col-span-1">
                    <div className="bg-white/60 dark:bg-midnight-800/40 backdrop-blur-sm rounded-2xl p-6 border border-white/40 dark:border-white/5 shadow-sm h-full animate-slide-in-mobile lg:animate-fade-in-tablet">
                      <h2 className="text-2xl font-bold mb-6 gradient-text">Contact Information</h2>
                      
                      <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 rounded-full bg-love-100 dark:bg-love-900/30 flex items-center justify-center flex-shrink-0">
                            <Mail className="h-5 w-5 text-love-600 dark:text-love-400" />
                          </div>
                          <div>
                            <h3 className="font-medium">Email</h3>
                            <p className="text-foreground/70 mt-1">hello@lovelyai.com</p>
                            <p className="text-foreground/70">support@lovelyai.com</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 rounded-full bg-love-100 dark:bg-love-900/30 flex items-center justify-center flex-shrink-0">
                            <Phone className="h-5 w-5 text-love-600 dark:text-love-400" />
                          </div>
                          <div>
                            <h3 className="font-medium">Phone</h3>
                            <p className="text-foreground/70 mt-1">+1 (555) 123-4567</p>
                            <p className="text-foreground/70">Mon-Fri, 9am-5pm EST</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 rounded-full bg-love-100 dark:bg-love-900/30 flex items-center justify-center flex-shrink-0">
                            <MapPin className="h-5 w-5 text-love-600 dark:text-love-400" />
                          </div>
                          <div>
                            <h3 className="font-medium">Address</h3>
                            <p className="text-foreground/70 mt-1">123 Love Lane</p>
                            <p className="text-foreground/70">Heartsville, CA 90210</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-12 relative">
                        <div className="absolute inset-0 bg-gradient-radial from-love-50/50 to-transparent dark:from-love-900/10 dark:to-transparent rounded-xl"></div>
                        <div className="relative p-6 text-center">
                          <h3 className="font-great-vibes text-3xl gradient-text mb-3">Connect With Us</h3>
                          <p className="text-foreground/70">We value your feedback and are here to assist you with any questions you may have.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Contact Form */}
                  <div className="lg:col-span-2">
                    <div className="bg-white/70 dark:bg-midnight-800/40 backdrop-blur-md rounded-2xl p-8 border border-white/40 dark:border-white/5 shadow-card animate-scale-in-desktop">
                      <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                      
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium flex items-center">
                              <Heart size={12} className="mr-1.5 text-love-500 dark:text-love-400" />
                              Your Name
                            </label>
                            <Input
                              id="name"
                              name="name"
                              type="text"
                              value={formData.name}
                              onChange={handleChange}
                              className="rounded-xl border-love-200/50 dark:border-love-800/30 focus-visible:ring-love-400/30 dark:focus-visible:ring-love-600/30 bg-white/50 dark:bg-midnight-700/30"
                              placeholder="Your name"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium flex items-center">
                              <Heart size={12} className="mr-1.5 text-love-500 dark:text-love-400" />
                              Email
                            </label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="rounded-xl border-love-200/50 dark:border-love-800/30 focus-visible:ring-love-400/30 dark:focus-visible:ring-love-600/30 bg-white/50 dark:bg-midnight-700/30"
                              placeholder="your.email@example.com"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="subject" className="text-sm font-medium flex items-center">
                            <Heart size={12} className="mr-1.5 text-love-500 dark:text-love-400" />
                            Subject
                          </label>
                          <Input
                            id="subject"
                            name="subject"
                            type="text"
                            value={formData.subject}
                            onChange={handleChange}
                            className="rounded-xl border-love-200/50 dark:border-love-800/30 focus-visible:ring-love-400/30 dark:focus-visible:ring-love-600/30 bg-white/50 dark:bg-midnight-700/30"
                            placeholder="What's on your mind?"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="message" className="text-sm font-medium flex items-center">
                            <Heart size={12} className="mr-1.5 text-love-500 dark:text-love-400" />
                            Your Message
                          </label>
                          <Textarea
                            id="message"
                            name="message"
                            rows={5}
                            value={formData.message}
                            onChange={handleChange}
                            className="rounded-xl border-love-200/50 dark:border-love-800/30 focus-visible:ring-love-400/30 dark:focus-visible:ring-love-600/30 bg-white/50 dark:bg-midnight-700/30 resize-none"
                            placeholder="Share your thoughts, questions, or your love story..."
                            required
                          />
                        </div>
                        
                        <Button 
                          type="submit" 
                          className={cn(
                            "w-full bg-gradient-love hover:opacity-90 transition-opacity button-glow rounded-xl py-6",
                            isSubmitting && "opacity-80"
                          )}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin mr-2 w-5 h-5 border-2 border-current border-t-transparent rounded-full"></div>
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send size={18} className="mr-2 animate-pulse-slow" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Map Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 relative">
              <div className="container mx-auto">
                <div className="max-w-5xl mx-auto">
                  <div className="bg-white/60 dark:bg-midnight-800/40 backdrop-blur-sm rounded-2xl p-4 border border-white/40 dark:border-white/5 shadow-sm animate-blur-in-tv">
                    <div className="aspect-[16/9] w-full rounded-xl overflow-hidden">
                      <div className="w-full h-full bg-love-50 dark:bg-midnight-900 flex items-center justify-center">
                        <div className="text-center p-12">
                          <Heart className="w-16 h-16 text-love-400 dark:text-love-600 mx-auto mb-4 animate-pulse-slow" />
                          <h3 className="text-2xl font-bold mb-2">Visit Our Office</h3>
                          <p className="text-foreground/70">
                            Our interactive map is coming soon! We're located in the heart of Heartsville,<br /> 
                            where technology meets heartfelt connection.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            <Footer />
          </div>
        </div>
      </main>
    </div>
  );
}
