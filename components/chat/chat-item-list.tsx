import React, {useEffect, useRef, useState} from "react";
import ChatBadge from "../ui/chat-badge";
import {useAppContext} from "@/hooks/use-app-context";
import {ChatType} from "@/constants";
import ChatItem from "./chat-item";
import ChatSearch from "./chat-search";
import {Separator} from "@/components/ui/separator";
import usePush from "@/hooks/use-push";
import {IFeeds} from "@pushprotocol/restapi";
import ChatItemLoaderSkeleton from "./chat-item-loader-skeleton";

const ChatItemList = () => {
  const [isUserInLastPage, setIsUserInLastPage] = useState({
    feeds: false,
    requests: false,
  });
  const [fetchingMessagesLoader, setFetchingMessagesLoader] = useState(false);
  const {chat, setFeeds, setRequests, activeChatTab} = useAppContext();
  const {getChats, getRequests} = usePush();
  const handleScroll = async (
    feeds: IFeeds[],
    activeChatTab: "all" | "requests" | "pinned" | "archived" | "groups"
  ) => {
    const chatsDiv = document.getElementById("chats");
    if (!chatsDiv) return;

    const {scrollTop, clientHeight, scrollHeight} = chatsDiv;

    if (scrollTop + clientHeight >= scrollHeight) {
      if (
        (activeChatTab === ChatType.ALL || activeChatTab === ChatType.GROUPS) &&
        feeds &&
        !isUserInLastPage.feeds
      ) {
        const page = Math.ceil(Number(feeds.length) / 10);
        if (page % 1 !== 0) {
          return;
        }
        setFetchingMessagesLoader(true);
        window.scrollTo({
          top: document.body.scrollHeight + 100,
          behavior: "smooth",
        });
        const olderChats = await getChats({
          page: page + 1,
        });

        if ("error" in olderChats) {
          setFetchingMessagesLoader(false);
          return;
        }
        if (olderChats.length === 0)
          setIsUserInLastPage({...isUserInLastPage, feeds: true});

        setFeeds([...feeds, ...olderChats]);
        setFetchingMessagesLoader(false);
      }

      if (
        activeChatTab === ChatType.REQUESTS &&
        chat?.requests &&
        !isUserInLastPage.requests
      ) {
        const page = Math.ceil(Number(chat.requests.length) / 10);
        if (page % 1 !== 0) {
          return;
        }
        setFetchingMessagesLoader(true);
        window.scrollTo({
          top: document.body.scrollHeight + 100,
          behavior: "smooth",
        });
        const olderChats = await getRequests({
          page: page + 1,
        });
        if ("error" in olderChats) {
          setFetchingMessagesLoader(false);
          return;
        }

        if (olderChats.length === 0)
          setIsUserInLastPage({...isUserInLastPage, requests: true});
        setRequests([...chat.requests, ...olderChats]);
        setFetchingMessagesLoader(false);
      }

      setFetchingMessagesLoader(false);
    }
  };

  useEffect(() => {
    const chatsDiv = document.getElementById("chats");
    if (!chatsDiv) return;

    const handleScrollEvent = () => {
      if (chat && chat.feeds) {
        handleScroll(chat.feeds!, activeChatTab);
      }
    };

    chatsDiv.addEventListener("scroll", handleScrollEvent);

    return () => {
      chatsDiv.removeEventListener("scroll", handleScrollEvent);
    };
  }, [chat, activeChatTab]);
  return (
    <div className="rounded-md h-20  flex flex-col flex-1 gap-2 py-1 bg-black border-[1px] border-gray-500 border-opacity-50">
      <ChatSearch />
      <div className="flex flex-row gap-2 px-2">
        <ChatBadge text="all" />
        <ChatBadge text="requests" />
        <ChatBadge text="groups" />
      </div>
      <Separator className="w-[96%] m-auto" />
      <section className="w-full h-full flex flex-col overflow-y-auto">
        <div
          className={`flex flex-col flex-1 h-full overflow-y-auto`}
          id="chats"
        >
          {!chat?.feeds && (
            <>
              {Array.from({length: 10}).map((_, index) => (
                <ChatItemLoaderSkeleton key={index} />
              ))}
            </>
          )}
          {!chat?.requests && (
            <>
              {Array.from({length: 10}).map((_, index) => (
                <ChatItemLoaderSkeleton key={index} />
              ))}
            </>
          )}
          {chat &&
            activeChatTab === ChatType.ALL &&
            chat.feeds &&
            chat.feeds.map((chat, index) => (
              <ChatItem key={index} chat={chat} />
            ))}
          {chat &&
            activeChatTab === ChatType.REQUESTS &&
            chat.requests &&
            chat.requests.map((chat, index) => (
              <ChatItem key={index} chat={chat} />
            ))}

          {chat &&
            activeChatTab === ChatType.GROUPS &&
            chat.feeds &&
            chat.feeds
              .filter((chat) => chat.groupInformation?.chatId)
              .map((chat, index) => <ChatItem key={index} chat={chat} />)}

          {fetchingMessagesLoader && (
            <div className="flex flex-row justify-center items-center gap-2 py-4">
              <div className="bg-primary w-1 h-1 animate-ping rounded-full"></div>
              <div className="bg-primary w-1.5 h-1.5 animate-ping rounded-full"></div>
              <div className="bg-primary w-2 h-2 animate-ping rounded-full"></div>
              <p className="text-muted-foreground">Fetching more chats</p>
              <div className="bg-primary w-2 h-2 animate-ping rounded-full"></div>
              <div className="bg-primary w-1.5 h-1.5 animate-ping rounded-full"></div>
              <div className="bg-primary w-1 h-1 animate-ping rounded-full"></div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ChatItemList;
