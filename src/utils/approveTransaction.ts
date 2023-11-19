export default async function approveTrasaction(
  tokenAddress: string,
  chainId: number
) {
  try {
    const response = await fetch(
      `/api/1inch/approve?tokenAddress=${tokenAddress}&chainId=${chainId}`
    );
    const data = await response.json();
    return data?.data;
  } catch (error) {
    console.log(error, "error");
  }
}
