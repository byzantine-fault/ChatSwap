import { Button, LockSVG } from "@ensdomains/thorin";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { AiOutlineMessage, AiOutlinePlus } from "react-icons/ai";
import { FiMessageSquare } from "react-icons/fi";
import { useAccount, useEnsName, useSignMessage } from "wagmi";
import {
  useManageSubscription,
  useSubscription,
  useW3iAccount,
  useInitWeb3InboxClient,
  useMessages,
} from "@web3inbox/widget-react";
import { useCallback, useEffect } from "react";

const Sidebar = () => {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { open, close } = useWeb3Modal();
  const { signMessageAsync } = useSignMessage();

  // Initialize the Web3Inbox SDK
  const isReady = useInitWeb3InboxClient({
    // The project ID and domain you setup in the Domain Setup section
    projectId: "484ba4de0a4e19e8c1c8d5b289e9631c",
    domain: "chatswap.vercel.app",

    // Allow localhost development with "unlimited" mode.
    // This authorizes this dapp to control notification subscriptions for all domains (including `app.example.com`), not just `window.location.host`
    isLimited: false,
  });

  const { account, setAccount, isRegistered, isRegistering, register } =
    useW3iAccount();
  useEffect(() => {
    if (!address) return;
    // Convert the address into a CAIP-10 blockchain-agnostic account ID and update the Web3Inbox SDK with it
    setAccount(`eip155:1:${address}`);
  }, [address, setAccount]);

  // In order to authorize the dapp to control subscriptions, the user needs to sign a SIWE message which happens automatically when `register()` is called.
  // Depending on the configuration of `domain` and `isLimited`, a different message is generated.
  const performRegistration = useCallback(async () => {
    if (!address) return;
    try {
      await register((message) => signMessageAsync({ message }));
    } catch (registerIdentityError) {
      alert(registerIdentityError);
    }
  }, [signMessageAsync, register, address]);

  useEffect(() => {
    // Register even if an identity key exists, to account for stale keys
    performRegistration();
  }, [performRegistration]);

  const { isSubscribed, isSubscribing, subscribe } = useManageSubscription();

  const performSubscribe = useCallback(async () => {
    // Register again just in case
    await performRegistration();
    await subscribe();
  }, [subscribe, isRegistered]);

  const { subscription } = useSubscription();
  const { messages } = useMessages();

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
        {!isReady && !address && !isRegistered ? (
          <div>
            To manage notifications, sign and register an identity key:&nbsp;
            <Button onClick={performRegistration} disabled={isRegistering}>
              {isRegistering ? "Signing..." : "Sign"}
            </Button>
          </div>
        ) : (
          <>
            {!isSubscribed ? (
              <>
                <Button onClick={performSubscribe} disabled={isSubscribing}>
                  {isSubscribing
                    ? "Subscribing..."
                    : "Subscribe to notifications"}
                </Button>
              </>
            ) : (
              <>
                <div>You are subscribed</div>
                <div>Subscription: {JSON.stringify(subscription)}</div>
                <div>Messages: {JSON.stringify(messages)}</div>
              </>
            )}
          </>
        )}
        {/* <div className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
          <MdLogin className="h-4 w-4" />
          {isConnected ? "Disconnect Wallet" : "Connect Wallat"}
        </div> */}
        <div style={{ width: "240px" }}>
          <Button prefix={<LockSVG />} onClick={() => open()}>
            {isConnected ? (!!ensName ? ensName : address) : "Connect Wallat"}
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
