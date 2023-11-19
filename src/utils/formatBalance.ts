import TOKENLIST from "../tokenList.json";

export default function formatBalance(amount: number, chain: number) {
  console.log(amount, chain, TOKENLIST[chain].decimals);
  const formatBal = amount * 10 ** TOKENLIST[chain].decimals;
  console.log(formatBal);
  return formatBal;
}
