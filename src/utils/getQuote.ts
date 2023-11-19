export default async function getQuote(
  src: string,
  dst: string,
  amount: number,
  chainId: number
) {
  try {
    const response = await fetch(
      `/api/1inch/quote?src=${src}&dst=${dst}&amount=${amount}&chainId=${chainId}`
    );
    const data = await response.json();
    return data?.data;
  } catch (error) {
    console.log(error);
  }
}
