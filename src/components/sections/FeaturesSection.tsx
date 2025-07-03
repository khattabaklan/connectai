import { BrainCircuit, MessageSquareText, Clock, Database, LineChart, Zap, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <BrainCircuit className="w-10 h-10" />,
    title: "AI-Powered Understanding",
    description: "Advanced natural language processing that understands customer queries with human-like comprehension."
  },
  {
    icon: <MessageSquareText className="w-10 h-10" />,
    title: "Contextual Conversations",
    description: "Maintains conversation context for natural, flowing interactions that feel genuinely helpful."
  },
  {
    icon: <Clock className="w-10 h-10" />,
    title: "24/7 Availability",
    description: "Always-on support that responds instantly to customer inquiries at any time of day or night."
  },
  {
    icon: <Database className="w-10 h-10" />,
    title: "Knowledge Integration",
    description: "Seamlessly connects with your company's knowledge base to provide accurate, up-to-date information."
  },
  {
    icon: <LineChart className="w-10 h-10" />,
    title: "Performance Analytics",
    description: "Detailed insights into customer interactions, common questions, and chatbot performance."
  },
  {
    icon: <Zap className="w-10 h-10" />,
    title: "Multi-Channel Support",
    description: "Deploy across website, mobile apps, social media, and messaging platforms from one central hub."
  },
  {
    icon: <ShieldCheck className="w-10 h-10" />,
    title: "Enterprise Security",
    description: "Bank-level encryption and compliance with data protection regulations to keep conversations secure."
  },
  {
    icon: <Sparkles className="w-10 h-10" />,
    title: "Continuous Learning",
    description: "Improves over time through machine learning, adapting to your specific customer interactions."
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            className="text-sm font-medium text-blue-600 mb-2 block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Features
          </motion.span>
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Everything you need to deliver exceptional
            <span className="block text-blue-600">AI-powered customer experiences</span>
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            ConnectAI combines cutting-edge AI with intuitive tools to create chatbots that truly understand your customers and represent your brand.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <div className="w-14 h-14 rounded-lg bg-blue-50 flex items-center justify-center mb-4 text-blue-600">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}