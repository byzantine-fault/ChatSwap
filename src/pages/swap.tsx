import checkAllowance from "@/utils/checkAllowance";
import { useToast } from "@chakra-ui/react";
import { Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import {
  useAccount,
  useBalance,
  useSendTransaction,
  useWaitForTransaction,
} from "wagmi";
import { fetchBalance } from "wagmi/actions";
import TOKENLIST from "../tokenList.json";
import swapTokens from "@/utils/swapToken";
import formatBalance from "@/utils/formatBalance";
import approveTrasaction from "@/utils/approveTransaction";
import getQuote from "@/utils/getQuote";

const Swap = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isConnected, address } = useAccount();
  const [sellToken, setSellToken] = useState(1);
  const [sellAmount, setSellAmount] = useState(1);
  const [buyToken, setBuyToken] = useState(2);
  const [buyAmount, setBuyAmount] = useState(1);

  const toast = useToast();

  useEffect(() => {
    setSellToken(TOKENLIST.findIndex((token) => token.ticker === "USDC"));
    setBuyToken(TOKENLIST.findIndex((token) => token.ticker === "USDT"));
  }, []);

  useEffect(() => {
    setBuyAmount(0);
  }, [sellAmount, sellToken, buyToken]);

  const { data: balance } = useBalance({
    address: address,
  });

  const { data, sendTransaction, error } = useSendTransaction();

  const { isLoading: loading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  if (error) {
    console.log(error, "error");
  }

  if (data) {
    console.log(data, "data");
  }

  async function checkBalance() {
    if (sellToken === 0) {
      if (!(parseFloat(balance?.formatted!) > sellAmount)) {
        toast({
          position: "top-right",
          title: "Insufficient balance",
        });
        return false;
      }
    } else {
      const data = await fetchBalance({
        address: address!,
        token: TOKENLIST[sellToken].address as any,
      });
      if (!(parseFloat(data?.formatted!) > sellAmount)) {
        toast({
          position: "top-right",
          title: "Insufficient balance",
        });
        return false;
      }
    }
  }

  async function handleTransaction() {
    if (buyToken === undefined || !address) return;
    console.log(sellAmount, "sell");
    const transaction = await swapTokens(
      TOKENLIST[sellToken].address,
      TOKENLIST[buyToken].address,
      formatBalance(sellAmount, sellToken),
      address,
      "1"
    );
    console.log(transaction);
    if (transaction.tx) {
      sendTransaction({
        to: transaction.tx.to,
        value: BigInt(transaction.tx.value),
        data: transaction.tx.data,
      });
    }
  }

  async function handleApproval() {
    const approve = await approveTrasaction(TOKENLIST[sellToken].address);
    console.log(approve);
    if (approve.data) {
      sendTransaction({
        to: approve.to,
        data: approve.data,
      });
    }
  }

  async function handleSwap() {
    if (address) {
      setIsLoading(true);
      // const hasBalance = await checkBalance();
      // if (!hasBalance) {
      //   setIsLoading(false);
      //   return;
      // }
      const allowance = await checkAllowance(
        TOKENLIST[sellToken].address,
        address
      );
      console.log(allowance);
      if (allowance?.allowance === "0") {
        await handleApproval();
      }
      handleTransaction();
      setIsLoading(false);
      if (isSuccess) {
        toast({
          title: "Swapped successfully 🎉",
          position: "top-right",
        });
      }
    }
  }

  async function handleQuote() {
    if (buyToken === undefined || sellAmount === 0) return;
    setIsLoading(true);
    const quote = await getQuote(
      TOKENLIST[sellToken].address,
      TOKENLIST[buyToken].address,
      sellAmount
    );
    console.log("quote : ", quote);
    if (quote.toAmount) {
      setBuyAmount(Number(quote.toAmount));
    } else {
      toast({
        title: quote.description,
        position: "top-right",
      });
    }
    setIsLoading(false);
  }
  return (
    <div className="bg-gray-900 w-96 p-4 rounded-2xl">
      <h4 className="font-semibold text-md">Swap</h4>
      <div>
        <div className="mt-4">{/* //   <SellCard /> */}</div>
        <div className="bg-gray-800 w-fit mx-auto rounded-full -my-1 z-50">
          {/* <BsArrowDownShort className="w-5 h-5 text-gray-600" /> */}
        </div>
        <div>{/* //   <BuyCard /> */}</div>
        {buyAmount ? (
          <button
            className={`flex items-center bg-[#2f8af5] ${
              isConnected ? "bg-opacity-20" : "bg-opacity-10"
            } p-3 rounded-xl gap-4 mt-4 w-full justify-center text-[#2F8AF5] font-semibold text-lg`}
            // disabled={isConnected ? false : true}
            onClick={handleSwap}
          >
            {isLoading ? <Spinner /> : <p>Swap</p>}
          </button>
        ) : (
          <button
            className={`flex items-center bg-[#2f8af5] bg-opacity-20 p-3 rounded-xl gap-4 mt-4 w-full justify-center text-[#2F8AF5] font-semibold text-lg`}
            onClick={handleQuote}
          >
            {isLoading ? <Spinner /> : <p>Get Quote</p>}
          </button>
        )}
      </div>
    </div>
  );
};

export default Swap;
