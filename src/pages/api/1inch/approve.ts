import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const tokenAddress = req.query.tokenAddress;
  const chainId = req.query.chainId;
  try {
    const response = await fetch(
      `https://api-dzap.1inch.io/v5.2/${chainId}/approve/transaction?tokenAddress=${tokenAddress}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.ONE_INCH_API_KEY as string,
        },
      }
    );
    const data = await response.json();
    return res.status(200).json({ data });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: "1inch API approve error" });
  }
}
