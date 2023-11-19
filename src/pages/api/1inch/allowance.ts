import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const tokenAddress = req.query.tokenAddress;
  const walletAddress = req.query.walletAddress;
  const chainId = req.query.chainId;
  try {
    const response = await fetch(
      `https://api-dzap.1inch.io/v5.2/${chainId}/approve/allowance?tokenAddress=${tokenAddress}&walletAddress=${walletAddress}`,
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
