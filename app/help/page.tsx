import Button from "@/components/Button";
import { Card, CardContent, CardHeader } from "@/components/Card";
import {
  ArrowLeft,
  Clock,
  CreditCard,
  HelpCircle,
  Mail,
  MessageCircle,
  Package,
  Phone,
  RotateCcw,
  Search,
  Shield,
  Truck,
  Users,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Help Center - MHCloth",
  description:
    "Find answers to common questions, get support, and learn how to make the most of your shopping experience with MHCloth.",
  keywords:
    "help, support, FAQ, customer service, shipping, returns, orders, MHCloth",
};

/**
 * Help Center page with comprehensive customer support
 * Features FAQ sections, contact options, and self-service resources
 */
export default function HelpPage() {
  const helpCategories = [
    {
      icon: <Package className="w-6 h-6" />,
      title: "Orders & Shipping",
      description: "Track orders, shipping info, and delivery questions",
      topics: [
        "How to track my order",
        "Shipping costs and delivery times",
        "International shipping",
        "Order modifications and cancellations",
      ],
    },
    {
      icon: <RotateCcw className="w-6 h-6" />,
      title: "Returns & Refunds",
      description: "Return policy, refund process, and exchanges",
      topics: [
        "How to return an item",
        "Refund processing times",
        "Exchange policy",
        "Return shipping labels",
      ],
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Payment & Billing",
      description: "Payment methods, billing issues, and invoices",
      topics: [
        "Accepted payment methods",
        "Payment security",
        "Billing address changes",
        "Invoice requests",
      ],
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Account & Profile",
      description: "Account management, login issues, and preferences",
      topics: [
        "Creating an account",
        "Password reset",
        "Update personal information",
        "Email preferences",
      ],
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Privacy & Security",
      description: "Data protection, privacy settings, and security",
      topics: [
        "Privacy policy",
        "Data protection rights",
        "Cookie settings",
        "Account security",
      ],
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Product Information",
      description: "Product details, sizing, and availability",
      topics: [
        "Size guide",
        "Product care instructions",
        "Stock availability",
        "Product specifications",
      ],
    },
  ];

  const quickActions = [
    {
      icon: <Search className="w-5 h-5" />,
      title: "Track Your Order",
      description: "Enter your order number to get real-time updates",
      action: "Track Order",
      href: "/account/orders",
    },
    {
      icon: <RotateCcw className="w-5 h-5" />,
      title: "Start a Return",
      description: "Begin the return process for your recent purchase",
      action: "Start Return",
      href: "/returns",
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      title: "Contact Support",
      description: "Get help from our customer service team",
      action: "Contact Us",
      href: "/contact",
    },
  ];

  const contactOptions = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone Support",
      info: "01648911447",
      availability: "Mon-Fri 9AM-6PM BST",
      description: "Speak directly with our support team",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Support",
      info: "hello@mhcloth.com",
      availability: "Response within 24 hours",
      description: "Send us a detailed message",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Live Chat",
      info: "Available on website",
      availability: "Mon-Fri 9AM-6PM GMT",
      description: "Get instant help through chat",
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8f6f3" }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/" className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white mx-auto mb-4">
              <HelpCircle className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              How Can We Help You?
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions, get support, and learn how to
              make the most of your shopping experience.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-blue-600">{action.icon}</div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{action.description}</p>
                  <Link href={action.href}>
                    <Button className="w-full">{action.action}</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Help Categories */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Browse Help Topics
            </h2>
            <p className="text-lg text-gray-600">
              Find detailed information organized by category
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {helpCategories.map((category, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow duration-300 h-full"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                      {category.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {category.title}
                    </h3>
                  </div>
                  <p className="text-gray-600">{category.description}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2">
                    {category.topics.map((topic, topicIndex) => (
                      <li
                        key={topicIndex}
                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 cursor-pointer transition-colors"
                      >
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Still Need Help?
            </h2>
            <p className="text-lg text-gray-600">
              Our support team is here to assist you with any questions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactOptions.map((option, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white mx-auto mb-6">
                    {option.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {option.title}
                  </h3>
                  <p className="text-lg font-medium text-blue-600 mb-2">
                    {option.info}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    {option.availability}
                  </p>
                  <p className="text-gray-700 mb-6">{option.description}</p>
                  <Link href="/contact">
                    <Button variant="outline" className="w-full">
                      Get in Touch
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Resources */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-8 text-center">
              <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Support Hours
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-md mx-auto">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Phone & Chat Support
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Monday - Friday: 9:00 AM - 6:00 PM GMT
                  </p>
                  <p className="text-gray-700 text-sm">
                    Saturday: 10:00 AM - 4:00 PM GMT
                  </p>
                  <p className="text-gray-700 text-sm">Sunday: Closed</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Email Support
                  </h4>
                  <p className="text-gray-700 text-sm">
                    24/7 - We respond within 24 hours
                  </p>
                  <p className="text-gray-700 text-sm">
                    Priority support for urgent issues
                  </p>
                  <p className="text-gray-700 text-sm">
                    Multilingual support available
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
