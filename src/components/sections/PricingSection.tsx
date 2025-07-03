import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

const pricingPlans = [
  {
    name: "Starter",
    price: 49,
    description: "Perfect for small businesses and startups looking to enhance customer support.",
    features: [
      "1 chatbot",
      "1,000 messages/month",
      "Basic customization",
      "Standard response time",
      "Email support",
      "Basic analytics"
    ],
    popular: false,
    buttonText: "Start Free Trial",
    buttonVariant: "outline" as const
  },
  {
    name: "Business",
    price: 149,
    description: "Ideal for growing businesses with increased support needs and multiple channels.",
    features: [
      "3 chatbots",
      "10,000 messages/month",
      "Advanced customization",
      "Priority response time",
      "Email & chat support",
      "Advanced analytics",
      "CRM integrations",
      "Multi-channel support"
    ],
    popular: true,
    buttonText: "Start Free Trial",
    buttonVariant: "default" as const
  },
  {
    name: "Enterprise",
    price: 499,
    description: "For large organizations requiring comprehensive support solutions and custom integrations.",
    features: [
      "Unlimited chatbots",
      "50,000+ messages/month",
      "Full customization",
      "Instant response time",
      "24/7 priority support",
      "Custom analytics",
      "Custom integrations",
      "Dedicated account manager",
      "Team training & onboarding"
    ],
    popular: false,
    buttonText: "Contact Sales",
    buttonVariant: "outline" as const
  }
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            className="text-sm font-medium text-blue-600 mb-2 block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Pricing
          </motion.span>
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Simple, transparent pricing
            <span className="block text-blue-600">for businesses of all sizes</span>
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Choose a plan that scales with your business needs, with no hidden fees or long-term commitments.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`relative rounded-xl border ${plan.popular ? 'border-blue-600 shadow-lg' : 'border-gray-200 shadow-sm'} bg-white p-8 flex flex-col`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground mb-6">{plan.description}</p>
              </div>

              <div className="mb-8 grow">
                <div className="text-sm font-semibold mb-3">Includes:</div>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center">
                        <Check className="w-3 h-3 text-blue-600" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button 
                variant={plan.buttonVariant} 
                className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                asChild
              >
                <a href="#signup">{plan.buttonText}</a>
              </Button>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Need a custom plan? <a href="#contact" className="text-blue-600 font-medium hover:underline">Contact us</a> for tailored solutions.
          </p>
        </div>
      </div>
    </section>
  );
}