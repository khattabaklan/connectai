import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, Bot, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 -z-10"></div>
      
      {/* Decorative shapes */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute top-1/2 -left-24 w-80 h-80 bg-indigo-300 rounded-full opacity-20 blur-3xl"></div>
      
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                AI-Powered Customer Engagement
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Transform Customer Support with
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                AI-Driven Conversations
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-muted-foreground max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Connect with your customers 24/7 through intelligent chatbots that understand your business, answer questions, and generate quality leads while you focus on growth.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button size="lg" asChild>
                <a href="#signup" className="gap-2">
                  Try For Free <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#demo" className="gap-2">
                  Book a Demo <MessageCircle className="w-4 h-4" />
                </a>
              </Button>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-3 text-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <span className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </span>
              <span className="text-muted-foreground">
                Trusted by 500+ businesses worldwide
              </span>
            </motion.div>
          </div>
          
          <motion.div 
            className="relative order-first md:order-last"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative z-10 bg-white p-1 rounded-2xl shadow-xl border border-gray-100">
              {/* Chat interface mockup */}
              <div className="bg-white rounded-xl overflow-hidden">
                {/* Chat header */}
                <div className="bg-blue-600 p-4 flex items-center gap-3 text-white">
                  <Bot className="w-6 h-6" />
                  <div>
                    <p className="font-medium">ConnectAI Assistant</p>
                    <p className="text-xs opacity-80">Online • Responding instantly</p>
                  </div>
                </div>
                
                {/* Chat content */}
                <div className="p-4 space-y-4">
                  {/* Bot message */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="bg-gray-100 rounded-2xl rounded-tl-none p-3 max-w-xs">
                      <p className="text-sm">Hello! Welcome to ConnectAI demo. How can I help you today?</p>
                    </div>
                  </div>
                  
                  {/* User message */}
                  <div className="flex gap-3 justify-end">
                    <div className="bg-blue-600 text-white rounded-2xl rounded-tr-none p-3 max-w-xs">
                      <p className="text-sm">I'd like to learn more about your pricing plans.</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium">U</span>
                    </div>
                  </div>
                  
                  {/* Bot message */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="bg-gray-100 rounded-2xl rounded-tl-none p-3 max-w-xs">
                      <p className="text-sm">We offer three plans: Starter ($49/mo), Business ($149/mo), and Enterprise ($499/mo). Each includes different features tailored to your business needs. Would you like me to explain the differences?</p>
                    </div>
                  </div>
                  
                  {/* Quick reply options */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="text-xs">Yes, tell me more</Button>
                    <Button variant="outline" size="sm" className="text-xs">Book a demo</Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-200 rounded-full opacity-60 blur-2xl"></div>
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-indigo-300 rounded-full opacity-60 blur-2xl"></div>
          </motion.div>
        </div>
      </div>
      
      {/* Brands */}
      <div className="container mt-16">
        <p className="text-sm text-center text-muted-foreground mb-6">Trusted by leading brands worldwide</p>
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 opacity-70">
          {["Brand", "Company", "Enterprise", "Tech", "Startup", "Global"].map((name, i) => (
            <div key={i} className="text-xl font-bold text-muted-foreground">{name}</div>
          ))}
        </div>
      </div>
    </section>
  );
}