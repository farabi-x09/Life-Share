import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe';
import { auth } from '@/lib/auth';



export async function POST(request) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')

    const userSession = await auth.api.getSession({
      headers: await headers()
    })
    const user = userSession?.user;

    const formData = await request.formData();
    const price = formData.get('price');
    const title = formData.get('title');
    const productId = formData.get('productId');

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      customer_email: user?.email,
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price_data: {
            currency: 'usd',
            unit_amount: Number(price) * 100,
            product_data: {
              name: title,
            }
          },
          quantity: 1,
        },
      ],
     
      metadata: {
        price: String(price),
        userId: String(user.id),
        userName: String(user.name || "Anonymous"), 
        userEmail: String(user.email),
        title: String(title),
        productId: String(productId),
        date: new Date().toISOString(),
      },
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    });

    
    return NextResponse.redirect(session.url, 303)
    // return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}