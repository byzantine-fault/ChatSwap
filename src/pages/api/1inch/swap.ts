import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const src = req.query.src;
  const dst = req.query.dst;
  const amount = req.query.amount;
  const from = req.query.from;
  const slippage = req.query.slippage;
  const chainId = req.query.chainId;
  try {
    const response = await fetch(
      `https://api-dzap.1inch.io/v5.2/${chainId}/swap?src=${src}&dst=${dst}&amount=${amount}&from=${from}&slippage=${slippage}`,
      {
        method: "GET",
        headers: {
          Authorization: process.env.ONE_INCH_API_KEY as string,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
}
