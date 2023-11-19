export default async function swapTokens(
  src: string,
  dst: string,
  amount: number,
  from: string,
  slippage: string,
  chainId: number
) {
  try {
    const response = await fetch(
      `/api/1inch/swap?src=${src}&dst=${dst}&amount=${amount}&from=${from}&slippage=${slippage}&chainId=${chainId}`
    );
    const data = await response.json();
    return data?.data;
  } catch (error) {
    console.log(error);
  }
}
