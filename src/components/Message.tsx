import { HiUser } from "react-icons/hi";
import { IoLogoIonitron } from "react-icons/io5";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image,
  Link,
  Skeleton,
} from "@nextui-org/react";
import { use1inch } from "@/hooks/use1inch";
import { useEffect } from "react";

const Message = (props: any) => {
  const { message } = props;
  const { role, content: text } = message;

  const isUser = role === "user";

  const fromTokenAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const toTokenAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

  const { getQuote } = use1inch({
    fromTokenAddress,
    toTokenAddress,
    amount: text?.amount,
  });

  useEffect(() => {
    if (text) {
      const res = getQuote();
      console.log(res);
    }
  });

  return (
    <div
      className={`group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 ${
        isUser ? "dark:bg-background" : "bg-gray-50 dark:bg-background"
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
                        <Card className="max-w-[400px]">
                          <CardHeader className="flex gap-3">
                            <Image
                              alt="nextui logo"
                              height={40}
                              radius="sm"
                              src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                              width={40}
                            />
                            <div className="flex flex-col">
                              <p className="text-md">UniSwap v2</p>
                              <p className="text-small text-default-500">
                                uniswap.org
                              </p>
                            </div>
                          </CardHeader>
                          <Divider />
                          <CardBody>
                            <p> fromToken : {text.fromToken}</p>
                            <p> toToken : {text.toToken}</p>
                            <p> amount : {text.amount}</p>
                          </CardBody>
                          <CardFooter>
                            <Link
                              isExternal
                              showAnchorIcon
                              href="https://github.com/nextui-org/nextui"
                            >
                              tx explorer
                            </Link>
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
