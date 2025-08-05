"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface Step {
  id: number
  name: string
  description: string
}

interface CheckoutProgressProps {
  steps: Step[]
  currentStep: number
}

export default function CheckoutProgress({ steps, currentStep }: CheckoutProgressProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="relative">
        {/* Progress Bar */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10">
          <motion.div
            className="h-full bg-black"
            initial={{ width: 0 }}
            animate={{ 
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` 
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        {/* Steps */}
        <div className="flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.id
            const isCurrent = currentStep === step.id
            const isUpcoming = currentStep < step.id

            return (
              <div key={step.id} className="flex flex-col items-center">
                {/* Step Circle */}
                <motion.div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                    ${isCompleted 
                      ? 'bg-black border-black text-white' 
                      : isCurrent 
                        ? 'bg-white border-black text-black' 
                        : 'bg-white border-gray-300 text-gray-400'
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <Check className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <span className="text-sm font-semibold">{step.id}</span>
                  )}
                </motion.div>

                {/* Step Info */}
                <div className="mt-3 text-center">
                  <p className={`
                    text-sm font-medium transition-colors
                    ${isCurrent || isCompleted ? 'text-gray-900' : 'text-gray-500'}
                  `}>
                    {step.name}
                  </p>
                  <p className={`
                    text-xs mt-1 transition-colors
                    ${isCurrent || isCompleted ? 'text-gray-600' : 'text-gray-400'}
                  `}>
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile Progress Bar */}
      <div className="mt-6 sm:hidden">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Step {currentStep} of {steps.length}</span>
          <span className="text-gray-900 font-medium">
            {Math.round((currentStep / steps.length) * 100)}% Complete
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-black h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / steps.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  )
}