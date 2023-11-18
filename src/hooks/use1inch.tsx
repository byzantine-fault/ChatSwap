import { NetworkEnum } from "@1inch/fusion-sdk";
import axios from "axios";
import { useCallback } from "react";

type Use1inchParams = {
  fromTokenAddress: string;
  toTokenAddress: string;
  amount: string;
};

export const CHAIN_MAPPINGS = {
  1: NetworkEnum.ETHEREUM,
  42161: NetworkEnum.ARBITRUM,
  137: NetworkEnum.POLYGON,
  // 1101: NetworkEnum.POLYGON, zk version
  100: NetworkEnum.GNOSIS,
} as Record<number, NetworkEnum>;

export const use1inch = ({
  fromTokenAddress,
  toTokenAddress,
  amount,
}: Use1inchParams) => {
  const getQuote = useCallback(async () => {
    if (fromTokenAddress && toTokenAddress && amount) {
      const _quote = await axios.get("/api/getOneInch", {
        params: {
          fromTokenAddress,
          toTokenAddress,
          amount,
        },
      });
      return _quote;
    }
    return null;
  }, [fromTokenAddress, toTokenAddress, amount]);

  return { getQuote };
};
