import {
  ChannelList,
  ChannelPreviewMessenger,
  ChannelPreviewUIComponentProps,
} from "stream-chat-react";
import MenuBar from "./MenuBar";
import { useUser } from "@clerk/nextjs";
import { UserResource } from "@clerk/types";
import { useCallback, useEffect, useState } from "react";
import UsersMenu from "./UsersMenu";

interface ChatSidebarProps {
  user: UserResource;
  show: boolean;
  onClose: () => void;
}

export default function ChatSidebar({ user, show, onClose }: ChatSidebarProps) {
  const [usersMenu, setUsersMenu] = useState(false);
  useEffect(() => {
    if (!show) setUsersMenu(false);
  }, [show]);
  const channelPreviewCustom = useCallback(
    (props: ChannelPreviewUIComponentProps) => (
      <ChannelPreviewMessenger
        {...props}
        onSelect={() => {
          props.setActiveChannel?.(props.channel, props.watchers);
          onClose();
        }}
      />
    ),
    [onClose]
  );

  return (
    <div
      className={`relative w-full flex-col md:max-w-[360px] ${show ? "flex" : "hidden"}`}
    >
        {usersMenu && <UsersMenu loggedInUser={user} onClose={()=> setUsersMenu(false)} onChannelSelected={()=>{
            setUsersMenu(false);
            onClose();
        }} />}
      <MenuBar onUserMenuClick={()=> setUsersMenu(true)} />
      <ChannelList
        filters={{
          type: "messaging",
          members: { $in: [user.id] },
        }}
        sort={{ last_message_at: -1 }}
        options={{ state: true, presence: true, limit: 10 }}
        showChannelSearch
        additionalChannelSearchProps={{
          searchForChannels: true,
          searchQueryParams: {
            channelFilters: {
              filters: { members: { $in: [user.id] } },
            },
          },
        }}
        Preview={channelPreviewCustom}
      />
    </div>
  );
}
