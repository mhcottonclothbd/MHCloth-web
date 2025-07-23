import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Shield, Eye, Lock, Database, UserCheck, Mail } from 'lucide-react'
import Button from '@/components/Button'
import { Card, CardContent, CardHeader } from '@/components/Card'

export const metadata: Metadata = {
  title: 'Privacy Policy - Physical Store Ltd',
  description: 'Our privacy policy explains how we collect, use, and protect your personal data in compliance with UK GDPR and Data Protection Act 2018.',
  keywords: 'privacy policy, data protection, GDPR, personal data, Physical Store Ltd',
}

/**
 * Privacy Policy page
 * Compliant with UK GDPR and Data Protection Act 2018
 */
export default function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f6f3' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/" className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Privacy Policy
              </h1>
              <p className="text-gray-600 mt-2">
                Last updated: {new Date().toLocaleDateString('en-GB')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">Introduction</h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">
                Physical Store Ltd ("we", "our", or "us") is committed to protecting and respecting your privacy. 
                This policy explains how we collect, use, and safeguard your personal information when you visit our website 
                or use our services.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <UserCheck className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">Your Rights</h3>
                    <p className="text-blue-800 text-sm">
                      Under UK GDPR and the Data Protection Act 2018, you have specific rights regarding your personal data. 
                      We respect these rights and will help you exercise them.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Controller */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">Data Controller</h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">
                Physical Store Ltd is the data controller for the personal information we collect about you.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Contact Details:</h3>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li><strong>Company:</strong> Physical Store Ltd</li>
                  <li><strong>Company Number:</strong> 14879273</li>
                  <li><strong>Registered Office:</strong> [To be updated with registered address]</li>
                  <li><strong>Email:</strong> privacy@physicalstore.co.uk</li>
                  <li><strong>Phone:</strong> +447575847048</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Database className="w-6 h-6" />
                Information We Collect
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Personal Information You Provide:</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Account Information:</h4>
                      <ul className="space-y-1 text-gray-700 text-sm">
                        <li>• Name and contact details</li>
                        <li>• Email address</li>
                        <li>• Phone number</li>
                        <li>• Billing and delivery addresses</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Transaction Information:</h4>
                      <ul className="space-y-1 text-gray-700 text-sm">
                        <li>• Purchase history</li>
                        <li>• Payment information</li>
                        <li>• Order details</li>
                        <li>• Customer service interactions</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Information We Collect Automatically:</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Technical Information:</h4>
                      <ul className="space-y-1 text-gray-700 text-sm">
                        <li>• IP address</li>
                        <li>• Browser type and version</li>
                        <li>• Device information</li>
                        <li>• Operating system</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Usage Information:</h4>
                      <ul className="space-y-1 text-gray-700 text-sm">
                        <li>• Pages visited</li>
                        <li>• Time spent on site</li>
                        <li>• Click patterns</li>
                        <li>• Referral sources</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Eye className="w-6 h-6" />
                How We Use Your Information
              </h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use your personal information for the following purposes, based on legitimate legal grounds:
              </p>
              
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Contract Performance:</h3>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Processing and fulfilling your orders</li>
                    <li>• Managing your account</li>
                    <li>• Providing customer support</li>
                    <li>• Processing payments and refunds</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Legitimate Interests:</h3>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Improving our website and services</li>
                    <li>• Analyzing usage patterns</li>
                    <li>• Preventing fraud and security threats</li>
                    <li>• Personalizing your experience</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Consent (where required):</h3>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Marketing communications</li>
                    <li>• Non-essential cookies</li>
                    <li>• Newsletter subscriptions</li>
                    <li>• Promotional offers</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Legal Compliance:</h3>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Meeting regulatory requirements</li>
                    <li>• Responding to legal requests</li>
                    <li>• Tax and accounting obligations</li>
                    <li>• Consumer protection compliance</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Sharing */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">How We Share Your Information</h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">
                We do not sell your personal information. We may share your information in the following circumstances:
              </p>
              
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Service Providers:</h3>
                  <p className="text-blue-800 text-sm mb-2">
                    We work with trusted third parties who help us operate our business:
                  </p>
                  <ul className="space-y-1 text-blue-800 text-sm">
                    <li>• Payment processors (Stripe, PayPal)</li>
                    <li>• Shipping and logistics companies</li>
                    <li>• Email service providers</li>
                    <li>• Analytics providers (Google Analytics)</li>
                    <li>• Customer support platforms</li>
                  </ul>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h3 className="font-semibold text-amber-900 mb-2">Legal Requirements:</h3>
                  <p className="text-amber-800 text-sm">
                    We may disclose your information if required by law, court order, or to protect our rights, 
                    property, or safety, or that of others.
                  </p>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">Business Transfers:</h3>
                  <p className="text-green-800 text-sm">
                    In the event of a merger, acquisition, or sale of assets, your information may be transferred 
                    as part of that transaction, subject to the same privacy protections.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Lock className="w-6 h-6" />
                Data Security
              </h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">
                We implement appropriate technical and organizational measures to protect your personal information:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Technical Measures:</h3>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• SSL encryption for data transmission</li>
                    <li>• Secure hosting infrastructure</li>
                    <li>• Regular security updates</li>
                    <li>• Access controls and authentication</li>
                    <li>• Data backup and recovery systems</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Organizational Measures:</h3>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Staff training on data protection</li>
                    <li>• Limited access on need-to-know basis</li>
                    <li>• Regular security assessments</li>
                    <li>• Incident response procedures</li>
                    <li>• Vendor security requirements</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">
                  <strong>Important:</strong> While we implement strong security measures, no method of transmission 
                  over the internet is 100% secure. Please contact us immediately if you suspect any unauthorized 
                  access to your account.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">Your Rights</h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">
                Under UK GDPR, you have the following rights regarding your personal data:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="border border-gray-200 rounded-lg p-3">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">Right of Access</h3>
                    <p className="text-gray-600 text-xs">Request a copy of your personal data</p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-3">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">Right to Rectification</h3>
                    <p className="text-gray-600 text-xs">Correct inaccurate personal data</p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-3">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">Right to Erasure</h3>
                    <p className="text-gray-600 text-xs">Request deletion of your personal data</p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-3">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">Right to Restrict Processing</h3>
                    <p className="text-gray-600 text-xs">Limit how we use your data</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="border border-gray-200 rounded-lg p-3">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">Right to Data Portability</h3>
                    <p className="text-gray-600 text-xs">Receive your data in a portable format</p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-3">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">Right to Object</h3>
                    <p className="text-gray-600 text-xs">Object to processing based on legitimate interests</p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-3">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">Right to Withdraw Consent</h3>
                    <p className="text-gray-600 text-xs">Withdraw consent for processing</p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-3">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">Right to Complain</h3>
                    <p className="text-gray-600 text-xs">Lodge a complaint with the ICO</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">How to Exercise Your Rights:</h3>
                <p className="text-green-800 text-sm mb-2">
                  To exercise any of these rights, please contact us at:
                </p>
                <ul className="space-y-1 text-green-800 text-sm">
                  <li>• Email: privacy@physicalstore.co.uk</li>
                  <li>• Phone: +447575847048</li>
                  <li>• Post: [Registered office address]</li>
                </ul>
                <p className="text-green-800 text-sm mt-2">
                  We'll respond to your request within one month (or two months for complex requests).
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">Cookies and Tracking</h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use cookies and similar technologies to improve your experience on our website:
              </p>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2">Essential Cookies</h3>
                    <p className="text-green-800 text-sm mb-2">Required for website functionality</p>
                    <ul className="space-y-1 text-green-800 text-xs">
                      <li>• Shopping cart</li>
                      <li>• User authentication</li>
                      <li>• Security features</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Analytics Cookies</h3>
                    <p className="text-blue-800 text-sm mb-2">Help us understand usage patterns</p>
                    <ul className="space-y-1 text-blue-800 text-xs">
                      <li>• Google Analytics</li>
                      <li>• Performance monitoring</li>
                      <li>• User behavior analysis</li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-900 mb-2">Marketing Cookies</h3>
                    <p className="text-purple-800 text-sm mb-2">Personalize ads and content</p>
                    <ul className="space-y-1 text-purple-800 text-xs">
                      <li>• Social media pixels</li>
                      <li>• Retargeting ads</li>
                      <li>• Preference tracking</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 text-sm">
                    You can manage your cookie preferences through your browser settings or our cookie consent banner. 
                    Note that disabling certain cookies may affect website functionality.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">Data Retention</h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">
                We retain your personal information only as long as necessary for the purposes outlined in this policy:
              </p>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">Account Information</span>
                  <span className="text-gray-600 text-sm">Until account deletion + 7 years for tax records</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">Transaction Records</span>
                  <span className="text-gray-600 text-sm">7 years (legal requirement)</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">Marketing Preferences</span>
                  <span className="text-gray-600 text-sm">Until you unsubscribe</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">Website Analytics</span>
                  <span className="text-gray-600 text-sm">26 months (Google Analytics default)</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">Customer Support</span>
                  <span className="text-gray-600 text-sm">3 years after last contact</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Mail className="w-6 h-6" />
                Contact Us
              </h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about this privacy policy or how we handle your personal data, please contact us:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Data Protection Officer:</h3>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li><strong>Email:</strong> privacy@physicalstore.co.uk</li>
                    <li><strong>Phone:</strong> +447575847048</li>
                    <li><strong>Response Time:</strong> Within 48 hours</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Postal Address:</h3>
                  <address className="text-gray-700 text-sm not-italic">
                    Physical Store Ltd<br />
                    Data Protection Team<br />
                    [Registered Office Address]<br />
                    United Kingdom
                  </address>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Complaints to the ICO:</h3>
                <p className="text-blue-800 text-sm mb-2">
                  If you're not satisfied with our response, you can complain to the Information Commissioner's Office:
                </p>
                <ul className="space-y-1 text-blue-800 text-sm">
                  <li>• Website: <a href="https://ico.org.uk" className="underline">ico.org.uk</a></li>
                  <li>• Phone: 0303 123 1113</li>
                  <li>• Post: Information Commissioner's Office, Wycliffe House, Water Lane, Wilmslow, Cheshire SK9 5AF</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}