import { motion } from "framer-motion";
import { BrainCircuit, Bot, MessagesSquare, LineChart } from "lucide-react";

const steps = [
  {
    icon: <BrainCircuit className="w-10 h-10" />,
    title: "Train Your AI",
    description: "Upload your knowledge base, FAQs, product information, and company policies. ConnectAI learns your business details to provide accurate responses.",
    color: "bg-blue-50 text-blue-600"
  },
  {
    icon: <Bot className="w-10 h-10" />,
    title: "Customize Your Chatbot",
    description: "Personalize the chatbot's appearance, conversation flow, and tone of voice to match your brand identity and communication style.",
    color: "bg-indigo-50 text-indigo-600"
  },
  {
    icon: <MessagesSquare className="w-10 h-10" />,
    title: "Deploy Across Channels",
    description: "Integrate your AI chatbot on your website, mobile app, and social media platforms with simple embed codes or our API.",
    color: "bg-purple-50 text-purple-600"
  },
  {
    icon: <LineChart className="w-10 h-10" />,
    title: "Monitor & Optimize",
    description: "Track performance metrics, review conversation logs, and continuously refine your chatbot's responses for optimal customer satisfaction.",
    color: "bg-pink-50 text-pink-600"
  }
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-gray-50">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            className="text-sm font-medium text-blue-600 mb-2 block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            How It Works
          </motion.span>
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Get started with ConnectAI
            <span className="block text-blue-600">in just four simple steps</span>
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Our intuitive platform makes it easy to create, deploy, and optimize AI chatbots with minimal technical knowledge.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              {/* Step number */}
              <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-sm font-bold text-blue-600 border border-gray-100">
                {index + 1}
              </div>

              {/* Step content */}
              <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm h-full">
                <div className={`w-14 h-14 rounded-lg ${step.color} flex items-center justify-center mb-4`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
              
              {/* Connector line (except for the last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-1 bg-gray-200">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-300 rounded-full"></div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}