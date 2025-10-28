import { BellOffIcon } from "lucide-react";

const NoNotificationsFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <BellOffIcon className="size-16 text-base-content opacity-30 mb-4" />
      <h3 className="text-xl font-semibold mb-2">No notifications yet</h3>
      <p className="text-base-content opacity-70 text-center max-w-md">
        When someone sends you a friend request or accepts yours, you'll see it here!
      </p>
    </div>
  );
};

export default NoNotificationsFound;
