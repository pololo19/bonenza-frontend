import { formatAmountForStripe } from '@/base/libs/utils/stripe-helpers';
import { NextApiRequest, NextApiResponse } from 'next';

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2022-11-15',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req);
  if (req.method === 'POST') {
    const { amount }: { amount: number } = req.body;
    try {
      // Validate the amount that was passed from the client.
      if (!(amount >= 5 && amount <= 5000)) {
        throw new Error('Invalid amount.');
      }
      // Create PaymentIntent from body params.
      const params: Stripe.PaymentIntentCreateParams = {
        payment_method_types: ['card'],
        amount: formatAmountForStripe(amount, 'usd'),
        currency: 'usd',
      };

      const payment_intent: Stripe.PaymentIntent = await stripe.paymentIntents.create(params);

      res.status(200).json(payment_intent);
    } catch (err: any) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
