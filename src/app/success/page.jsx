


import { funding } from '@/lib/actions/donation_requests'
import { stripe } from '@/lib/stripe'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, ArrowRight } from 'lucide-react' 

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams

  if (!session_id)
    throw new Error('Please provide a valid session_id (`cs_test_...`)')

  const {
    status,
    metadata,
    customer_details: { email: customerEmail }
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent']
  })

  if (status === 'open') {
    return redirect('/')
  }

  if (status === 'complete') {
    
    await funding({
        ...metadata,
        sessionId: session_id,
    })

    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-[2rem] shadow-xl p-8 md:p-10 text-center border border-gray-100">
          
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-500 w-12 h-12" />
          </div>
          
          <h1 className="text-3xl font-black text-gray-900 mb-3">Payment Successful!</h1>
          <p className="text-gray-500 font-medium leading-relaxed mb-6">
            Thank you for your generous donation. A confirmation receipt has been sent to <span className="font-bold text-gray-800">{customerEmail}</span>.
          </p>
          
          <div className="bg-gray-50 rounded-2xl p-4 mb-8 border border-gray-100">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Transaction ID</p>
            <p className="text-xs text-gray-400 break-all">{session_id}</p>
          </div>
          
          <Link 
            href="/funding" 
            className="inline-flex items-center justify-center gap-2 w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-600/20 active:scale-95"
          >
            Back to Dashboard <ArrowRight size={18} />
          </Link>
          
        </div>
      </div>
    )
  }
}