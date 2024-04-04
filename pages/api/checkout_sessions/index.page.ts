import { formatAmountForStripe } from '@/base/libs/utils/stripe-helpers';
import { NextApiRequest, NextApiResponse } from 'next';

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2023-10-16',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const amount: number = req.body.amount;
    const currency: string = req.body.currency;
    const userId: string = req.body.userId;
    try {
      // Create Checkout Sessions from body params.
      const params: Stripe.Checkout.SessionCreateParams = {
        submit_type: 'donate',
        line_items: [
          {
            price_data: {
              currency: currency,
              unit_amount: formatAmountForStripe(amount, currency),
              product_data: {
                name: 'Deposit Fiat',
                images: ['https://bonenza.com/img/logo.png'],
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          user_id: userId,
        },
        payment_intent_data: {
          metadata: {
            user_id: userId,
          },
        },
        mode: 'payment',
        success_url: `${req.headers.origin}/deposit/result?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/deposit/fiat`,
      };
      const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(params);

      res.status(200).json(checkoutSession);
    } catch (err: any) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
