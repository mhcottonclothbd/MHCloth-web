import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Scale, Shield, FileText } from 'lucide-react'
import Button from '@/components/Button'
import { Card, CardContent, CardHeader } from '@/components/Card'

export const metadata: Metadata = {
  title: 'Terms and Conditions - Physical Store Ltd',
  description: 'Terms and conditions for Physical Store Ltd. Read our legal terms, conditions of use, and policies governing your use of our services.',
  keywords: 'terms and conditions, legal, policy, Physical Store Ltd, UK company',
}

/**
 * Terms and Conditions page
 * Compliant with UK Consumer Rights Act 2015 and Consumer Contracts Regulations 2013
 */
export default function TermsPage() {
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
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
              <Scale className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Terms and Conditions
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
          {/* Company Information */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <FileText className="w-6 h-6" />
                Company Information
              </h2>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">
                These terms and conditions apply to the website operated by <strong>Physical Store Ltd</strong>, 
                a company registered in England and Wales.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <h3 className="font-semibold text-gray-900 mb-2">Company Details:</h3>
                <ul className="space-y-1 text-gray-700">
                  <li><strong>Company Name:</strong> Physical Store Ltd</li>
                  <li><strong>Company Number:</strong> 14879273</li>
                  <li><strong>Registered Office:</strong> 27 Old Gloucester Street, LONDON, WC1N 3AX United Kingdom</li>
                  <li><strong>VAT Number:</strong> [To be updated if VAT registered]</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Terms Sections */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">1. Acceptance of Terms</h2>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">
                By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">2. Use License</h2>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Permission is granted to temporarily download one copy of the materials on Physical Store Ltd's website 
                for personal, non-commercial transitory viewing only.
              </p>
              <h3 className="font-semibold text-gray-900 mb-2">This license shall automatically terminate if you violate any of these restrictions:</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">3. Product Information and Pricing</h2>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                We strive to ensure that all product information, including descriptions, images, and prices, 
                is accurate and up-to-date. However, we cannot guarantee that all information is completely accurate, 
                complete, or current.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>All prices are displayed in British Pounds (GBP) and include VAT where applicable</li>
                <li>We reserve the right to change prices without prior notice</li>
                <li>Product availability is subject to stock levels</li>
                <li>Colors may vary slightly due to monitor settings</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">4. Orders and Payment</h2>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h3 className="font-semibold text-gray-900 mb-2">Order Process:</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>All orders are subject to acceptance and availability</li>
                <li>We reserve the right to refuse or cancel any order</li>
                <li>Order confirmation will be sent via email</li>
                <li>Contract is formed when we dispatch your goods</li>
              </ul>
              
              <h3 className="font-semibold text-gray-900 mb-2">Payment Terms:</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Payment is required at the time of order</li>
                <li>We accept major credit cards, debit cards, and PayPal</li>
                <li>All transactions are processed securely using SSL encryption</li>
                <li>We do not store your payment information</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">5. Consumer Rights (UK)</h2>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Under the Consumer Rights Act 2015, you have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Receive goods that are of satisfactory quality, fit for purpose, and as described</li>
                <li>A refund, repair, or replacement if goods are faulty</li>
                <li>Cancel your order within 14 days of receipt (Distance Selling Regulations)</li>
              </ul>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800 font-medium">
                  <Shield className="w-5 h-5 inline mr-2" />
                  Your statutory rights are not affected by these terms and conditions.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">6. Limitation of Liability</h2>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                In no event shall Physical Store Ltd or its suppliers be liable for any damages 
                (including, without limitation, damages for loss of data or profit, or due to business interruption) 
                arising out of the use or inability to use the materials on Physical Store Ltd's website.
              </p>
              <p className="text-gray-700 leading-relaxed">
                This limitation applies even if Physical Store Ltd or an authorized representative has been 
                notified orally or in writing of the possibility of such damage.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">7. Privacy and Data Protection</h2>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                We are committed to protecting your privacy and personal data in accordance with the 
                UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
              </p>
              <p className="text-gray-700 leading-relaxed">
                For detailed information about how we collect, use, and protect your data, 
                please refer to our <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">8. Governing Law</h2>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">
                These terms and conditions are governed by and construed in accordance with the laws of England and Wales. 
                Any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts of England and Wales.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">9. Contact Information</h2>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="space-y-2 text-gray-700">
                  <li><strong>Email:</strong> legal@physicalstore.co.uk</li>
                  <li><strong>Phone:</strong> +447575847048</li>
                  <li><strong>Address:</strong> 27 Old Gloucester Street, LONDON, WC1N 3AX United Kingdom</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}