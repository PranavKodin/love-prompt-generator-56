
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Hero } from "@/components/Hero";
import { CustomizationForm } from "@/components/CustomizationForm";
import { Footer } from "@/components/Footer";
import { Heart, Upload, Sliders, Sparkles, Send, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="flex">
          <Sidebar />
          <div className="w-full md:ml-64">
            {/* Hero Section */}
            <Hero />
            
            {/* Features Section */}
            <section id="features" className="py-20 px-4">
              <div className="container mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <div className="inline-block rounded-full bg-secondary px-4 py-1 mb-4">
                    <span className="text-sm font-medium text-love-600 dark:text-love-400">
                      Features
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Create the Perfect Compliment in Seconds</h2>
                  <p className="text-foreground/80">
                    Our AI-powered platform helps you craft personalized, heartfelt compliments for your special someone.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      icon: Heart,
                      title: "Personalized Compliments",
                      description: "Create unique compliments tailored to your special someone's personality and your relationship."
                    },
                    {
                      icon: Sliders,
                      title: "Customizable Options",
                      description: "Choose from various styles, tones, and moods to craft the perfect compliment for any occasion."
                    },
                    {
                      icon: Upload,
                      title: "Image Upload",
                      description: "Upload a photo to help our AI create more personalized and relevant compliments."
                    },
                    {
                      icon: Sparkles,
                      title: "Advanced AI",
                      description: "Powered by state-of-the-art language models to create natural, heartfelt compliments."
                    },
                    {
                      icon: Send,
                      title: "Easy Sharing",
                      description: "Save your favorite prompts and share them across social media or messaging apps."
                    },
                    {
                      icon: Code,
                      title: "API Access",
                      description: "Integrate our compliment generator into your own applications with our developer API."
                    }
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-midnight-800/50 rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="w-12 h-12 rounded-full bg-love-100 dark:bg-love-900/30 flex items-center justify-center mb-4">
                        <feature.icon className="h-6 w-6 text-love-600 dark:text-love-400" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-foreground/70">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            
            {/* Advanced Customization Section */}
            <section id="customize" className="py-20 px-4 bg-secondary/50 dark:bg-midnight-900/30">
              <div className="container mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <div className="inline-block rounded-full bg-love-100 dark:bg-love-900/30 px-4 py-1 mb-4">
                    <span className="text-sm font-medium text-love-600 dark:text-love-400">
                      Advanced Customization
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Fine-tune Your Compliment Prompts</h2>
                  <p className="text-foreground/80">
                    Create perfectly crafted compliment prompts with our advanced customization options.
                  </p>
                </div>
                
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white dark:bg-midnight-800/50 rounded-xl p-6 md:p-8 border border-border shadow-sm">
                    <CustomizationForm />
                  </div>
                </div>
              </div>
            </section>
            
            {/* API Access Section */}
            <section id="api" className="py-20 px-4">
              <div className="container mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <div className="inline-block rounded-full bg-secondary px-4 py-1 mb-4">
                    <span className="text-sm font-medium text-love-600 dark:text-love-400">
                      Developer API
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Integrate Our Compliment Generator</h2>
                  <p className="text-foreground/80">
                    Add AI-powered compliment generation to your own applications with our developer API.
                  </p>
                </div>
                
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white dark:bg-midnight-800/50 rounded-xl p-6 md:p-8 border border-border shadow-sm">
                    <div className="bg-secondary/60 dark:bg-midnight-700/60 rounded-lg p-4 mb-6 overflow-x-auto">
                      <pre className="text-sm">
                        <code className="text-foreground/90">
{`// Example API Request
fetch('https://api.lovelyai.com/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    style: 'romantic',
    tone: 'sincere',
    length: 50,
    keywords: ['smile', 'kindness'],
    imageUrl: 'https://example.com/image.jpg' // optional
  })
})
.then(response => response.json())
.then(data => console.log(data.prompt))`}
                        </code>
                      </pre>
                    </div>
                    
                    <div className="text-center">
                      <Button className="bg-gradient-love hover:opacity-90 transition-opacity button-glow">
                        Get API Access
                      </Button>
                      <p className="text-sm text-muted-foreground mt-4">
                        Check out our <a href="#" className="text-love-600 dark:text-love-400 hover:underline">documentation</a> for more information.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Contact Section */}
            <section id="contact" className="py-20 px-4 bg-secondary/50 dark:bg-midnight-900/30">
              <div className="container mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <div className="inline-block rounded-full bg-love-100 dark:bg-love-900/30 px-4 py-1 mb-4">
                    <span className="text-sm font-medium text-love-600 dark:text-love-400">
                      Contact Us
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
                  <p className="text-foreground/80">
                    Have questions or feedback? We'd love to hear from you!
                  </p>
                </div>
                
                <div className="max-w-2xl mx-auto">
                  <div className="bg-white dark:bg-midnight-800/50 rounded-xl p-6 md:p-8 border border-border shadow-sm">
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">
                            Name
                          </label>
                          <input
                            id="name"
                            type="text"
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                            placeholder="Your name"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium">
                            Email
                          </label>
                          <input
                            id="email"
                            type="email"
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                            placeholder="your.email@example.com"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-medium">
                          Subject
                        </label>
                        <input
                          id="subject"
                          type="text"
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                          placeholder="Subject of your message"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium">
                          Message
                        </label>
                        <textarea
                          id="message"
                          rows={5}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 resize-none"
                          placeholder="Your message..."
                        />
                      </div>
                      
                      <Button type="submit" className="w-full bg-gradient-love hover:opacity-90 transition-opacity button-glow">
                        Send Message
                      </Button>
                    </form>
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
