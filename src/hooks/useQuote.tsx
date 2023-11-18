import { FusionSDK, Web3ProviderConnector } from "@1inch/fusion-sdk";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNetwork, useWalletClient } from "wagmi";

async function fetchQuote(
  fromTokenAddress?: string,
  toTokenAddress?: string,
  amount?: string,
  networkId?: number
) {
  if (!amount) {
    throw new Error("Amount is required");
  }

  if (!networkId) {
    throw new Error("Network ID is required");
  }

  if (!fromTokenAddress) {
    throw new Error("From token address is required");
  }

  if (!toTokenAddress) {
    throw new Error("To token address is required");
  }

  if (fromTokenAddress === toTokenAddress) {
    return { fromTokenAmount: amount, toTokenAmount: amount };
  }
  const { data } = await axios.get(
    `https://api.1inch.exchange/v5.0/${networkId}/quote?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${amount}`
  );

  return data;
}

export interface IQuote {
  fromTokenAmount?: string;
  toTokenAmount?: string;
  fromTokenAmountInUSD?: string;
  toTokenAmountInUSD?: string;
  readableFromTokenAmount?: string;
  readableToTokenAmount?: string;
}

export function useQuote(
  fromTokenAddress?: string,
  toTokenAddress?: string,
  amount?: string
) {
  const { data: signer } = useWalletClient();
  const { chain, chains } = useNetwork();

  const [quote, setQuote] = useState<IQuote>({});

  const getQuote = useCallback(async () => {
    try {
      if (
        !signer ||
        !chain?.id ||
        !fromTokenAddress ||
        !toTokenAddress ||
        !amount
      ) {
        return {};
      }
      const sdk = new FusionSDK({
        url: "https://fusion.1inch.io",
        network: chain?.id,
        blockchainProvider: new Web3ProviderConnector(signer as any),
        authKey: process.env.ONE_INCH_API_KEY,
      });

      const quote = await sdk.getQuote({
        fromTokenAddress,
        toTokenAddress,
        amount,
      });

      console.log(quote);

      //   const allTokens = tokens.flatMap((token) => token.tokens);
      //   const fromToken = allTokens.find(
      //     (token) => token.address === fromTokenAddress
      //   );
      //   const toToken = allTokens.find(
      //     (token) => token.address === toTokenAddress
      //   );

      //   let readableFromTokenAmount = "0";
      //   let readableToTokenAmount = "0";

      //   if (fromTokenAddress) {
      //     readableFromTokenAmount = formatUnits(
      //       quote.fromTokenAmount,
      //       fromToken.decimals
      //     );
      //   }

      //   if (toTokenAddress) {
      //     readableToTokenAmount = formatUnits(
      //       quote.toTokenAmount,
      //       toToken.decimals
      //     );
      //   }

      //   return {
      //     fromTokenAmount: quote.fromTokenAmount,
      //     readableFromTokenAmount,
      //     toTokenAmount: quote.toTokenAmount,
      //     readableToTokenAmount,
      //     fromTokenAmountInUSD: quote.prices.usd.fromToken,
      //     toTokenAmountInUSD: quote.prices.usd.toToken,
      //   };
    } catch (error) {
      console.log("error", error);
      return {};
    }
  }, [amount, fromTokenAddress, chain?.id, signer, toTokenAddress]);

  useEffect(() => {
    async function _getQuote() {
      const quote = await getQuote();
      //   setQuote(quote);
    }

    _getQuote();
  }, [getQuote]);

  return quote;
}
