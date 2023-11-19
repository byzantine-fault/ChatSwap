export default async function checkAllowance(
  tokenAddress: string,
  walletAddress: string,
  chainId: number
) {
  try {
    const response = await fetch(
      `/api/1inch/allowance?tokenAddress=${tokenAddress}&walletAddress=${walletAddress}&chainId=${chainId}`
    );
    const data = await response.json();
    return data?.data;
  } catch (error) {
    console.log(error);
  }
}
