import type { NextApiRequest, NextApiResponse } from "next";
import { FusionSDK, NetworkEnum } from "@1inch/fusion-sdk";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const fromTokenAddress = req.query.fromTokenAddress;
  const toTokenAddress = req.query.toTokenAddress;
  const amount = req.query.amount;
  console.log(fromTokenAddress, toTokenAddress, amount);

  try {
    const sdk = new FusionSDK({
      url: "https://api.1inch.dev/fusion",
      network: NetworkEnum.ETHEREUM,
      authKey: process.env.ONE_INCH_API_KEY,
    });

    const quote = await sdk.getQuote({
      fromTokenAddress: fromTokenAddress as string,
      toTokenAddress: toTokenAddress as string,
      amount: amount as string,
    });
    res.status(200).json({ quote });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "1inch API error",
    });
    return;
  }
}
