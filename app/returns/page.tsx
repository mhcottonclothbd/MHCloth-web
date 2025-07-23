import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, RotateCcw, Clock, Package, CreditCard, AlertCircle } from 'lucide-react'
import Button from '@/components/Button'
import { Card, CardContent, CardHeader } from '@/components/Card'

export const metadata: Metadata = {
  title: 'Returns & Refunds Policy - Physical Store Ltd',
  description: 'Our returns and refunds policy. Learn about your rights, how to return items, and our refund process in compliance with UK consumer law.',
  keywords: 'returns, refunds, policy, consumer rights, UK law, Physical Store Ltd',
}

/**
 * Returns and Refunds Policy page
 * Compliant with UK Consumer Rights Act 2015 and Consumer Contracts Regulations 2013
 */
export default function ReturnsPage() {
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
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white">
              <RotateCcw className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Returns & Refunds Policy
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
          {/* Overview */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">Your Consumer Rights</h2>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Important Notice</h3>
                    <p className="text-blue-800 leading-relaxed">
                      Under UK Consumer Rights Act 2015 and Consumer Contracts Regulations 2013, 
                      you have statutory rights that cannot be excluded. This policy explains your rights 
                      and our procedures in plain English.
                    </p>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed">
                At Physical Store Ltd, we want you to be completely satisfied with your purchase. 
                If you're not happy with your order, we offer flexible returns and refunds in accordance with UK law.
              </p>
            </CardContent>
          </Card>

          {/* 14-Day Cooling Off Period */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Clock className="w-6 h-6" />
                14-Day Cooling Off Period
              </h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">
                Under the Consumer Contracts Regulations 2013, you have the right to cancel your order 
                within 14 days of receiving your goods, without giving any reason.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">What's Included:</h3>
                  <ul className="space-y-1 text-green-800 text-sm">
                    <li>• All online purchases</li>
                    <li>• Phone orders</li>
                    <li>• Mail orders</li>
                    <li>• Items bought away from our premises</li>
                  </ul>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-amber-900 mb-2">Exceptions:</h3>
                  <ul className="space-y-1 text-amber-800 text-sm">
                    <li>• Personalized/custom items</li>
                    <li>• Perishable goods</li>
                    <li>• Hygiene-sensitive items</li>
                    <li>• Digital downloads (once accessed)</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">How to Cancel:</h3>
                <p className="text-gray-700 text-sm mb-2">
                  You can cancel by clearly stating your decision to cancel. You can:
                </p>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Email us at returns@physicalstore.co.uk</li>
                  <li>• Call us on +44 (0) 20 1234 5678</li>
                  <li>• Use our online returns form</li>
                  <li>• Send a letter to our registered address</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Return Process */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Package className="w-6 h-6" />
                How to Return Items
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-600 font-bold text-lg">1</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Contact Us</h3>
                    <p className="text-gray-600 text-sm">
                      Let us know you want to return an item within 14 days of receipt
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-600 font-bold text-lg">2</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Pack & Send</h3>
                    <p className="text-gray-600 text-sm">
                      Return items within 14 days of telling us you want to cancel
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-600 font-bold text-lg">3</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Get Refund</h3>
                    <p className="text-gray-600 text-sm">
                      We'll refund you within 14 days of receiving your return
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Return Conditions:</h3>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Items must be in original condition and packaging</li>
                    <li>• Include all accessories, manuals, and free gifts</li>
                    <li>• Items should be unused (except for examination)</li>
                    <li>• You're responsible for return shipping costs (unless item is faulty)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Refund Information */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <CreditCard className="w-6 h-6" />
                Refund Process
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Refund Timeline:</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• <strong>Standard returns:</strong> 14 days from receipt of returned item</li>
                      <li>• <strong>Faulty items:</strong> Immediate refund upon confirmation</li>
                      <li>• <strong>Cancelled orders:</strong> 14 days from cancellation notice</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Refund Method:</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Same payment method used for purchase</li>
                      <li>• Bank transfers for cash payments</li>
                      <li>• Store credit (if preferred)</li>
                      <li>• No additional charges for refunds</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">What We Refund:</h3>
                  <ul className="space-y-1 text-green-800 text-sm">
                    <li>• Full purchase price of returned items</li>
                    <li>• Original delivery charges (if entire order returned)</li>
                    <li>• Return shipping costs (for faulty items only)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Faulty Items */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">Faulty or Damaged Items</h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">
                Under the Consumer Rights Act 2015, if goods are faulty, not as described, 
                or not fit for purpose, you have additional rights:
              </p>
              
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-900 mb-2">First 30 Days:</h3>
                  <p className="text-red-800 text-sm">
                    You have the right to reject faulty goods and get a full refund.
                  </p>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h3 className="font-semibold text-amber-900 mb-2">After 30 Days:</h3>
                  <p className="text-amber-800 text-sm">
                    We'll offer a repair or replacement. If this isn't possible or fails, 
                    you can claim a refund or price reduction.
                  </p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">What to Do:</h3>
                  <ul className="space-y-1 text-blue-800 text-sm">
                    <li>• Contact us immediately</li>
                    <li>• Don't use the item further</li>
                    <li>• Keep all packaging and accessories</li>
                    <li>• We'll arrange collection at no cost to you</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exchanges */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">Exchanges</h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">
                While there's no legal right to exchange goods that aren't faulty, 
                we offer exchanges as a goodwill gesture:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Exchange Policy:</h3>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Within 30 days of purchase</li>
                    <li>• Items in original condition</li>
                    <li>• Same or higher value items</li>
                    <li>• Subject to availability</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Exchange Process:</h3>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Contact our customer service team</li>
                    <li>• Return original item</li>
                    <li>• We'll send replacement item</li>
                    <li>• Pay any price difference</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">Need Help with Returns?</h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our customer service team is here to help with any returns or refund queries:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Contact Details:</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li><strong>Email:</strong> returns@physicalstore.co.uk</li>
                    <li><strong>Phone:</strong> +44 (0) 20 1234 5678</li>
                    <li><strong>Hours:</strong> Mon-Fri 9AM-6PM GMT</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Return Address:</h3>
                  <address className="text-gray-700 text-sm not-italic">
                    Physical Store Ltd<br />
                    Returns Department<br />
                    [Registered Office Address]<br />
                    United Kingdom
                  </address>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>Tip:</strong> Keep your order confirmation email and any tracking information 
                  to help us process your return quickly.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}