import { useCallback, useState } from "react";
import { useW3iAccount } from "@web3inbox/widget-react";
import { INotification } from "./types";
import { sendNotification } from "./fetchNotify";
import { Toast } from "@ensdomains/thorin";

function useSendNotification() {
  const [isSending, setIsSending] = useState<boolean>(false);
  const { account } = useW3iAccount();

  const handleSendNotification = useCallback(
    async (notification: INotification) => {
      if (!account) {
        return;
      }
      setIsSending(true);
      try {
        const { success, message } = await sendNotification({
          accounts: [account],
          notification,
        });
        setIsSending(false);

        <Toast
          description="This is an example toast."
          open={true}
          onClose={() => {}}
          title="Example Toast"
          variant="desktop"
        >
          {success ? notification.title : "Message failed."}
        </Toast>;
      } catch (error: any) {
        setIsSending(false);
        console.error({ sendNotificationError: error });

        <Toast
          description="error.cause"
          open={true}
          onClose={() => {}}
          title="error.message"
          variant="desktop"
        ></Toast>;
      }
    },
    [account]
  );

  return {
    handleSendNotification,
    isSending,
  };
}

export default useSendNotification;
