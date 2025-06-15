import { baseApi } from "../api/baseApi";
import { socket } from "@/context/socketProvider"; // Import the socket instance
import { IChat } from "@/types/chatTypes";
import { TError } from "@/types/error";
import { IMessage } from "@/types/messagesType";

const inboxApi = baseApi.injectEndpoints({
  overrideExisting: true, // ✅ Ensures endpoints override correctly
  endpoints: (builder) => ({
    /** 📌 Create a New Chat */
    createChat: builder.mutation({
      query: (data) => ({
        url: "/chat",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
        try {
          // **Await API Response**
          const { data: responseData } = await queryFulfilled;
          if (!responseData?.data?.attributes) {
            return;
          }
          const newChat = responseData?.data?.attributes;

          // 🔥 **Find Active Query Key from RTK Cache**
          const cacheKeys = Object.keys(getState().baseApi.queries);
          const getChatsKey = cacheKeys.find((key) => key.includes("getChats"));

          if (!getChatsKey) return;

          // 🔥 **Extract Filters from the Cache Key**
          const activeQueryArgs =
            JSON.parse(getChatsKey.replace("getChats(", "").replace(")", "")) ||
            {};

          // 🔥 **Use Active Filters in Cache Update**
          dispatch(
            inboxApi.util.updateQueryData(
              "getChats",
              activeQueryArgs,
              (draft) => {
                if (!draft?.data?.attributes?.results) return;
                //if already exist this
                const alreadyExist = draft?.data?.attributes?.results?.find(
                  (chat: IChat) => chat?._id === newChat?._id
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

    /** 📌 Get All Chats */
    getChats: builder.query({
      query: ({ page = 1, limit = 10, userName }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (userName) params.append("userName", userName);
        return { url: `/chats`, method: "GET", params };
      },
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        try {
          await cacheDataLoaded;
          const chatEvent = `new-chat`;
          const handleChat = (chatData: { data: IChat }) => {
            const conversation = chatData?.data;
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

    /** 📌 Get Single Chat */
    getChat: builder.query({
      query: (chatId) => `/chat/${chatId}`,
    }),

    /** 📌 Get Messages in a Chat */
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
          const messageEvent = `new-message`;
          const handleNewMessage = (newMessageData: { data: IMessage }) => {
            const newMessage = newMessageData?.data;
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

    /** 📌 Send a Message */
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
          if (!responseData?.data?.attributes) {
            return;
          }
          const newMessage = responseData.data.attributes;

          const cacheKeys = Object.keys(getState().baseApi.queries);
          const getChatsKey = cacheKeys.find((key) => key.includes("getChats"));

          if (!getChatsKey) return;

          // 🔥 **Extract Filters from the Cache Key**
          const activeQueryArgs =
            JSON.parse(getChatsKey.replace("getChats(", "").replace(")", "")) ||
            {};

          // 🔥 **Update Messages Cache**
          dispatch(
            inboxApi.util.updateQueryData(
              "getMessages",
              messageData.chatId,
              (draft) => {
                if (!draft?.data?.attributes?.results) return;
                draft.data.attributes.results.push(newMessage);
              }
            )
          );

          // 🔥 **Update Chats Cache (Last Message)**
          dispatch(
            inboxApi.util.updateQueryData(
              "getChats",
              activeQueryArgs,
              (draft) => {
                if (!draft?.data?.attributes?.results) return;
                const chatToUpdate = draft.data.attributes.results.find(
                  (chat: IChat) => chat._id === messageData.chatId
                );
                if (chatToUpdate) {
                  chatToUpdate.lastMessage = newMessage;
                  chatToUpdate.updatedAt = newMessage?.createdAt;

                  // 🔥 **Ensure React detects the change**
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
