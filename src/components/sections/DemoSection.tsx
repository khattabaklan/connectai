import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { CalendarDays, Clock, MessageSquareText } from "lucide-react";

export default function DemoSection() {
  return (
    <section id="demo" className="py-24 bg-white">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-sm font-medium text-blue-600 mb-2 block">Request a Demo</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              See ConnectAI in action
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Schedule a personalized demo with our product experts to see how ConnectAI can transform your customer interactions.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Personalized Walkthrough</h3>
                  <p className="text-muted-foreground">
                    Get a customized demonstration of features relevant to your business needs.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Quick Setup</h3>
                  <p className="text-muted-foreground">
                    Learn how easy it is to get started and integrate ConnectAI with your existing systems.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <MessageSquareText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Expert Q&A</h3>
                  <p className="text-muted-foreground">
                    Ask questions and get advice from our implementation experts on best practices.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl p-8 shadow-md border border-gray-200"
          >
            <h3 className="text-xl font-bold mb-6">Book Your Free Demo</h3>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" placeholder="Enter your first name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" placeholder="Enter your last name" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Work email</Label>
                <Input id="email" type="email" placeholder="your.name@company.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" placeholder="Your company name" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">What are your main goals with ConnectAI?</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your customer service needs and challenges..."
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full">
                Schedule Demo
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By submitting this form, you agree to our{" "}
                <a href="#terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}