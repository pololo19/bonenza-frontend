import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

import { formatAmountForStripe } from '@/base/libs/utils/stripe-helpers';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const amount: number = req.body.amount;
    const currency: string = req.body.currency;
    const userId: string = req.body.userId;
    try {
      // Create Checkout Sessions from body params.
      const params: Stripe.PayoutCreateParams = {
        amount: formatAmountForStripe(amount, currency),
        currency: currency,
        metadata: {
          user_id: userId,
        },
      };
      const checkoutSession: Stripe.Payout = await stripe.payouts.create(params);

      res.status(200).json(checkoutSession);
    } catch (err: any) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
