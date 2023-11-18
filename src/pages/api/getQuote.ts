import { FusionSDK, NetworkEnum } from "@1inch/fusion-sdk";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { parseEther } from "viem";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = req.body;
  let response = null;

  // try {
  //   response = await axios.get(
  //     `https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?symbol=${body.fromToken}}`,
  //     {
  //       headers: {
  //         "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY,
  //       },
  //     }
  //   );
  // } catch (ex) {
  //   response = null;
  //   // error
  //   console.log(ex);
  //   // reject(ex);
  // }
  // if (response) {
  //   // success
  //   const json = response.data.data;
  //   return json;
  // }

  const fromTokenAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const toTokenAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
  const amount = body.amount;

  // return res.json("hello~!");

  const sdk = new FusionSDK({
    url: "https://api.1inch.dev/fusion",
    network: NetworkEnum.ETHEREUM,
    authKey: process.env.ONE_INCH_API_KEY,
  });

  try {
    const quote = await sdk.getQuote({
      fromTokenAddress: fromTokenAddress as string,
      toTokenAddress: toTokenAddress as string,
      amount: parseEther(amount.toString()).toString(),
    });

    console.log("getquote :", quote);

    return NextResponse.json({ quote });
  } catch (error) {
    console.log(error);
    return NextResponse.json({});
  }
}
