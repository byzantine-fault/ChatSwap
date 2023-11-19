import { HiUser } from "react-icons/hi";
import { IoLogoIonitron } from "react-icons/io5";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image,
  Skeleton,
  Spinner,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import TOKENLIST from "../tokenList.json";
import {
  useAccount,
  useBalance,
  useNetwork,
  useSendTransaction,
  useWaitForTransaction,
} from "wagmi";

import swapTokens from "@/utils/swapToken";
import formatBalance from "@/utils/formatBalance";
import approveTrasaction from "@/utils/approveTransaction";
import checkAllowance from "@/utils/checkAllowance";
import getQuote from "@/utils/getQuote";
import { fetchBalance } from "wagmi/actions";

const Message = (props: any) => {
  const { message } = props;
  const { role, content: text } = message;

  const isUser = role === "user";

  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sellToken, setSellToken] = useState(1);
  const [sellAmount, setSellAmount] = useState(1);
  const [buyToken, setBuyToken] = useState(2);
  const [buyAmount, setBuyAmount] = useState(1);
  const [protocolInfo, setProtocolInfo] = useState<any>();

  const toast = useToast();

  const { chain } = useNetwork();

  useEffect(() => {
    if (typeof text !== "string" && text?.fromToken) {
      setSellToken(
        TOKENLIST.findIndex((token) => token.ticker === text.fromToken)
      );
      setBuyToken(
        TOKENLIST.findIndex((token) => token.ticker === text.toToken)
      );
      setSellAmount(Number(text.amount));
    }
  }, [text]);

  // useEffect(() => {
  //   setBuyAmount(0);
  // }, [sellAmount, sellToken, buyToken]);

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
      "1",
      chain?.id as number
    );
    console.log(transaction);
    console.log(transaction.protocols);
    setProtocolInfo(transaction.protocols && transaction.protocols[0][0][0]);
    if (transaction.tx) {
      sendTransaction({
        to: transaction.tx.to,
        value: BigInt(transaction.tx.value),
        data: transaction.tx.data,
      });
    }
  }

  async function handleApproval() {
    const approve = await approveTrasaction(
      TOKENLIST[sellToken].address,
      chain?.id as number
    );
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
        address,
        chain?.id as number
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
      sellAmount,
      chain?.id as number
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
    <div
      className={`group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 ${
        isUser ? "dark:bg-black" : "bg-gray-50 dark:bg-black"
      }`}
    >
      <div className="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl flex lg:px-0 m-auto w-full">
        <div className="flex flex-row gap-4 md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl p-4 md:py-6 lg:px-0 m-auto w-full">
          <div className="w-8 flex flex-col relative items-end">
            <div className="relative h-7 w-7 p-1 rounded-sm text-white flex items-center justify-center bg-black/75 text-opacity-100r">
              {isUser ? (
                <HiUser className="h-4 w-4 text-white" />
              ) : (
                <IoLogoIonitron className="h-4 w-4 text-white" />
              )}
            </div>
            <div className="text-xs flex items-center justify-center gap-1 absolute left-0 top-2 -ml-4 -translate-x-full group-hover:visible !invisible">
              <button
                disabled
                className="text-gray-300 dark:text-gray-400"
              ></button>
              <span className="flex-grow flex-shrink-0">1 / 1</span>
              <button
                disabled
                className="text-gray-300 dark:text-gray-400"
              ></button>
            </div>
          </div>
          <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
            <div className="flex flex-grow flex-col gap-3">
              <div className="min-h-20 flex flex-col items-start gap-4 whitespace-pre-wrap break-words">
                <div className="markdown prose w-full break-words dark:prose-invert dark">
                  {!isUser && text === null ? (
                    <Skeleton className="w-3/5 rounded-lg">
                      <div className="h-6 w-2/5 rounded-lg bg-default-200"></div>
                    </Skeleton>
                  ) : (
                    <>
                      {typeof text === "string" ? (
                        <p>{text}</p>
                      ) : (
                        <Card className="max-w-[400px] z-50">
                          <CardHeader className="flex gap-3">
                            <Image
                              alt="nextui logo"
                              height={40}
                              radius="sm"
                              src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                              width={40}
                            />
                            <div className="flex flex-col">
                              {!!protocolInfo ? (
                                <p className="text-md">{protocolInfo?.name} </p>
                              ) : (
                                <p className="text-md">Searching Protocol.. </p>
                              )}
                            </div>
                          </CardHeader>
                          <Divider />
                          <CardBody>
                            <p> fromToken : {text.fromToken}</p>
                            <p> toToken : {text.toToken}</p>
                            <p> amount : {text.amount}</p>
                          </CardBody>
                          <CardFooter>
                            <Button onClick={handleSwap} fullWidth>
                              {buyAmount ? (
                                isLoading ? (
                                  <Spinner />
                                ) : (
                                  <p>Swap</p>
                                )
                              ) : isLoading ? (
                                <Spinner />
                              ) : (
                                <p>Get Quote</p>
                              )}
                            </Button>
                          </CardFooter>
                        </Card>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
