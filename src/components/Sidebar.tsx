import { Button, LockSVG } from "@ensdomains/thorin";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { AiOutlineMessage, AiOutlinePlus } from "react-icons/ai";
import { FiMessageSquare } from "react-icons/fi";
import { useAccount, usePublicClient, useSignMessage } from "wagmi";
import {
  useManageSubscription,
  useW3iAccount,
  useInitWeb3InboxClient,
} from "@web3inbox/widget-react";
import { useCallback, useEffect, useState } from "react";
import useSendNotification from "@/hooks/useSendNotification";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID as string;
const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN as string;

const Sidebar = () => {
  const { isConnected } = useAccount();
  const { open, close } = useWeb3Modal();

  /** Web3Inbox SDK hooks **/
  const isW3iInitialized = useInitWeb3InboxClient({
    projectId,
    domain: appDomain,
    isLimited: process.env.NODE_ENV == "production",
  });
  const {
    account,
    setAccount,
    register: registerIdentity,
    identityKey,
  } = useW3iAccount();
  const {
    subscribe,
    unsubscribe,
    isSubscribed,
    isSubscribing,
    isUnsubscribing,
  } = useManageSubscription(account);

  const { address } = useAccount({
    onDisconnect: () => {
      setAccount("");
    },
  });
  const { signMessageAsync } = useSignMessage();
  const wagmiPublicClient = usePublicClient();

  const { handleSendNotification, isSending } = useSendNotification();
  const [lastBlock, setLastBlock] = useState<string>();
  const [isBlockNotificationEnabled, setIsBlockNotificationEnabled] =
    useState(true);

  const signMessage = useCallback(
    async (message: string) => {
      const res = await signMessageAsync({
        message,
      });

      return res as string;
    },
    [signMessageAsync]
  );

  // We need to set the account as soon as the user is connected
  useEffect(() => {
    if (!Boolean(address)) return;
    setAccount(`eip155:1:${address}`);
  }, [signMessage, address, setAccount]);

  const handleRegistration = useCallback(async () => {
    if (!account) return;
    try {
      await registerIdentity(signMessage);
    } catch (registerIdentityError) {
      console.error({ registerIdentityError });
    }
  }, [signMessage, registerIdentity, account]);

  useEffect(() => {
    // register even if an identity key exists, to account for stale keys
    handleRegistration();
  }, [handleRegistration]);

  const handleSubscribe = useCallback(async () => {
    if (!identityKey) {
      await handleRegistration();
    }

    await subscribe();
  }, [subscribe, identityKey]);

  // handleSendNotification will send a notification to the current user and includes error handling.
  // If you don't want to use this hook and want more flexibility, you can use sendNotification.
  const handleTestNotification = useCallback(async () => {
    if (isSubscribed) {
      handleSendNotification({
        title: "Test!",
        body: "Test!",
        icon: `${window.location.origin}/WalletConnect-blue.svg`,
        url: window.location.origin,
        // ID retrieved from explorer api - Copy your notification type from WalletConnect Cloud and replace the default value below
        type: "6c6a438b-d6d1-4c95-9440-312ed6780c78",
      });
    }
  }, [handleSendNotification, isSubscribed]);

  useEffect(() => {
    isConnected
      ? isSubscribed &&
        handleSendNotification({
          title: "GM from ChatSwap!",
          body: "See you!",
          icon: `${window.location.origin}/WalletConnect-blue.svg`,
          url: window.location.origin,
          type: "9b791aa1-ea28-498b-8113-7259d1edc060",
        })
      : isSubscribed &&
        handleSendNotification({
          title: "See you!",
          body: "See you!",
          icon: `${window.location.origin}/WalletConnect-blue.svg`,
          url: window.location.origin,
          type: "b4732e4f-b26e-49ce-8629-4a3729c67f46",
        });
  }, [address, isConnected, isSubscribed]);

  return (
    <div className="scrollbar-trigger flex h-full w-full flex-1 items-start border-white/20 border-r">
      <nav className="flex h-full flex-1 flex-col space-y-1 p-2">
        <a className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-1 flex-shrink-0 border border-white/20">
          <AiOutlinePlus className="h-4 w-4" />
          New chat
        </a>
        <div className="flex-col flex-1 overflow-y-auto border-b border-white/20">
          <div className="flex flex-col gap-2 pb-2 text-gray-100 text-sm">
            <a className="flex py-3 px-3 items-center gap-3 relative rounded-md hover:bg-[#2A2B32] cursor-pointer break-all hover:pr-4 group">
              <FiMessageSquare className="h-4 w-4" />
              <div className="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative">
                New conversation
                <div className="absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-purple-950 group-hover:from-[#2A2B32]"></div>
              </div>
            </a>
          </div>
        </div>
        <a className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
          <AiOutlineMessage className="h-4 w-4" />
          Clear conversations
        </a>
        {/* <a className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
          <AiOutlineUser className="h-4 w-4" />
          My plan
        </a> */}
        {/* <a className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
          <AiOutlineSetting className="h-4 w-4" />
          Settings
        </a>
        <a
          href="https://help.openai.com/en/collections/3742473-chatgpt"
          target="_blank"
          className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
        >
          <BiLinkExternal className="h-4 w-4" />
          Get help
        </a> */}
        {isSubscribed ? (
          <Button
            onClick={handleTestNotification}
            disabled={!isW3iInitialized}
            loading={isSending}
          >
            {isSending ? "sending..." : " Send test notification"}
          </Button>
        ) : (
          <Button
            onClick={handleSubscribe}
            loading={isSubscribing}
            disabled={!Boolean(address) || !Boolean(account)}
          >
            {isSubscribing ? "Subscribing..." : "Subscribe"}
          </Button>
        )}
        {/* <div className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
          <MdLogin className="h-4 w-4" />
          {isConnected ? "Disconnect Wallet" : "Connect Wallat"}
        </div> */}
        <div style={{ width: "240px" }}>
          {address && isConnected ? (
            <Button prefix={<LockSVG />} onClick={() => open()}>
              Disconnect Wallet
            </Button>
          ) : (
            <Button prefix={<LockSVG />} onClick={() => open()}>
              Connect Wallat
            </Button>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
