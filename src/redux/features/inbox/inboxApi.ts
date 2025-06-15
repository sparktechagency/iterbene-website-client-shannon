import { baseApi } from "../api/baseApi";
import { socket } from "@/context/socketProvider";
import { IChat } from "@/types/chatTypes";
import { TError } from "@/types/error";
import { IMessage } from "@/types/messagesType";

const inboxApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createChat: builder.mutation({
      query: (data) => ({
        url: "/chat",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
        try {
          const { data: responseData } = await queryFulfilled;
          if (!responseData?.data?.attributes) return;
          const newChat = responseData.data.attributes;

          const cacheKeys = Object.keys(getState().baseApi.queries);
          const getChatsKey = cacheKeys.find((key) => key.includes("getChats"));

          if (!getChatsKey) return;

          const activeQueryArgs =
            JSON.parse(getChatsKey.replace("getChats(", "").replace(")", "")) ||
            {};

          dispatch(
            inboxApi.util.updateQueryData(
              "getChats",
              activeQueryArgs,
              (draft) => {
                if (!draft?.data?.attributes?.results) return;
                const alreadyExist = draft.data.attributes.results.find(
                  (chat: IChat) => chat._id === newChat._id
                );
                if (!alreadyExist) {
                  draft.data.attributes.results = [
                    newChat,
                    ...draft.data.attributes.results,
                  ];
                }
              }
            )
          );
        } catch (error) {
          const err = error as TError;
          console.log(err?.data?.message);
        }
      },
    }),
    getChats: builder.query({
      query: ({ page = 1, limit = 10 }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        return { url: "/chats", method: "GET", params };
      },
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        try {
          await cacheDataLoaded;
          const chatEvent = "new-chat";
          const handleChat = (chatData: { data: IChat }) => {
            const conversation = chatData.data;
            updateCachedData((draft) => {
              if (!draft?.data?.attributes?.results) return;
              const existingChat = draft.data.attributes.results.find(
                (chat: IChat) => chat._id === conversation._id
              );
              if (existingChat) {
                existingChat.lastMessage = conversation.lastMessage;
              } else {
                draft.data.attributes.results.unshift(conversation);
              }
            });
          };
          socket.on(chatEvent, handleChat);
          await cacheEntryRemoved;
          socket.off(chatEvent, handleChat);
        } catch (error) {
          const err = error as TError;
          console.log(err?.data?.message);
        }
      },
    }),
    getChat: builder.query({
      query: (chatId) => `/chat/${chatId}`,
    }),
    getMessages: builder.query({
      query: (receiverId) => ({
        url: `/messages/${receiverId}`,
        method: "GET",
      }),
      async onCacheEntryAdded(
        arg,
        { cacheDataLoaded, cacheEntryRemoved, updateCachedData }
      ) {
        try {
          await cacheDataLoaded;
          const messageEvent = "new-message";
          const handleNewMessage = (newMessageData: { data: IMessage }) => {
            console.log("New message data:", newMessageData);
            const newMessage = newMessageData.data;
            console.log("New message:", newMessage);
            updateCachedData((draft) => {
              if (!draft?.data?.attributes?.results) return;
              draft.data.attributes.results.push(newMessage);
            });
          };
          socket.on(messageEvent, handleNewMessage);
          await cacheEntryRemoved;
          socket.off(messageEvent, handleNewMessage);
        } catch (error) {
          const err = error as TError;
          console.log(err?.data?.message);
        }
      },
    }),
    sendMessage: builder.mutation({
      query: (data) => ({
        url: "/messages",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
        const messageData: Record<string, string | File> = {};
        if (arg instanceof FormData) {
          arg.forEach((value, key) => (messageData[key] = value));
        } else {
          Object.assign(messageData, arg);
        }

        try {
          const { data: responseData } = await queryFulfilled;
          if (!responseData?.data?.attributes) return;
          const newMessage = responseData.data.attributes;
          const cacheKeys = Object.keys(getState().baseApi.queries);
          const getChatsKey = cacheKeys.find((key) => key.includes("getChats"));

          if (!getChatsKey) return;

          const activeQueryArgs =
            JSON.parse(getChatsKey.replace("getChats(", "").replace(")", "")) ||
            {};

          dispatch(
            inboxApi.util.updateQueryData(
              "getMessages",
              messageData.receiverId,
              (draft) => {
                if (!draft?.data?.attributes?.results) return;
                draft.data.attributes.results.push(newMessage);
              }
            )
          );

          dispatch(
            inboxApi.util.updateQueryData(
              "getChats",
              activeQueryArgs,
              (draft) => {
                if (!draft?.data?.attributes?.results) return;
                const chatToUpdate = draft.data.attributes.results.find(
                  (chat: IChat) => chat._id === newMessage.chatId
                );
                if (chatToUpdate) {
                  chatToUpdate.lastMessage = newMessage;
                  chatToUpdate.updatedAt = newMessage.createdAt;
                  draft.data.attributes.results = [
                    ...draft.data.attributes.results,
                  ];
                }
              }
            )
          );
        } catch (error) {
          const err = error as TError;
          console.log(err?.data?.message);
        }
      },
    }),
  }),
});

export const {
  useCreateChatMutation,
  useGetChatQuery,
  useGetChatsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
} = inboxApi;
