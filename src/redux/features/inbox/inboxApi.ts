import { socket } from "@/lib/socket";
import { baseApi } from "../api/baseApi";
import { IChat } from "@/types/chatTypes";
import { IMessage } from "@/types/messagesType";
import { IUser } from "@/types/user.types";

const inboxApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getChats: builder.query({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.length > 0) {
          filters.forEach(
            (filter: { key: string; value: string }) =>
              filter?.value && params.append(filter.key, filter.value)
          );
        }
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
            updateCachedData((draft) => {
              if (!draft?.data?.attributes?.results) {
                draft.data = { attributes: { results: [] } };
              }
              const conversation = chatData?.data;
              const existingChat = draft.data.attributes.results.find(
                (chat: IChat) => chat._id === conversation._id
              );
              if (existingChat) {
                existingChat.lastMessage = conversation.lastMessage;
                existingChat.updatedAt = conversation.updatedAt;
              } else {
                draft.data.attributes.results.unshift(conversation);
              }
            });
          };
          socket.on(chatEvent, handleChat);
          await cacheEntryRemoved;
          socket.off(chatEvent, handleChat);
        } catch (error) {
          console.error("Get chats socket error:", error);
        }
      },
    }),
    getChat: builder.query({
      query: (chatId) => `/chat/${chatId}`,
    }),
    getMessages: builder.query({
      query: ({ receiverId, filters }) => {
        const params = new URLSearchParams();
        if (filters?.length > 0) {
          filters.forEach(
            (filter: { key: string; value: string }) =>
              filter?.value && params.append(filter.key, filter.value)
          );
        }
        return {
          url: `/messages/${receiverId}`,
          method: "GET",
          params,
        };
      },
      async onCacheEntryAdded(
        arg,
        { cacheDataLoaded, cacheEntryRemoved, updateCachedData }
      ) {
        try {
          await cacheDataLoaded;
          const messageEvent = "new-message";
          const handleNewMessage = (newMessageData: { data: IMessage }) => {
            const newMessage = newMessageData.data;
            if (
              newMessage.receiverId?._id === arg.receiverId ||
              newMessage.senderId === arg.receiverId
            ) {
              updateCachedData((draft) => {
                if (!draft?.data?.attributes?.results) {
                  draft.data = { attributes: { results: [] } };
                }
                const exists = draft.data.attributes.results.find(
                  (msg: IMessage) => msg._id === newMessage._id
                );
                if (!exists) {
                  draft.data.attributes.results.unshift(newMessage);
                }
              });
            }
          };
          socket.on(messageEvent, handleNewMessage);
          await cacheEntryRemoved;
          socket.off(messageEvent, handleNewMessage);
        } catch (error) {
          console.error("Get messages socket error:", error);
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
        try {
          const cacheKeys = Object.keys(getState().baseApi.queries);
          const getMyProfileKey = cacheKeys.find((key) =>
            key.includes("getMyProfile")
          );
          let senderInfo: IUser | undefined;
          if (getMyProfileKey) {
            const profileQuery = getState().baseApi.queries[getMyProfileKey];
            if (
              profileQuery &&
              typeof profileQuery === "object" &&
              "data" in profileQuery &&
              profileQuery.data &&
              typeof profileQuery.data === "object" &&
              "data" in profileQuery.data &&
              profileQuery.data.data &&
              typeof profileQuery.data.data === "object" &&
              "attributes" in profileQuery.data.data
            ) {
              senderInfo = (profileQuery.data.data as { attributes: IUser })
                .attributes;
            }
          }

          if (!senderInfo) {
            throw new Error("Sender info is missing");
          }

          const { data: responseData } = await queryFulfilled;
          const newMessage = responseData.data.attributes;
          const chatId = newMessage.chatId;
          const receiverId = arg.receiverId || newMessage.receiverId?._id;

          let receiverInfo: IUser | undefined;
          if (
            newMessage.receiverId &&
            typeof newMessage.receiverId === "object"
          ) {
            receiverInfo = newMessage.receiverId;
          } else {
            const getChatsCacheKeys = cacheKeys.filter((key) =>
              key.includes("getChats")
            );
            for (const cacheKey of getChatsCacheKeys) {
              try {
                const chatCache = getState().baseApi.queries[cacheKey];
                if (chatCache && "data" in chatCache && chatCache.data) {
                  const chats =
                    (
                      chatCache.data as {
                        data?: { attributes?: { results?: IChat[] } };
                      }
                    )?.data?.attributes?.results || [];
                  for (const chat of chats) {
                    const participant = chat.participants.find(
                      (p: IUser | string) =>
                        (typeof p === "string" ? p : p._id) === receiverId
                    );
                    if (participant && typeof participant === "object") {
                      receiverInfo = participant;
                      break;
                    }
                  }
                  if (receiverInfo) break;
                }
              } catch (error) {
                console.error("Get chats cache error:", error);
                continue;
              }
            }
          }

          if (!receiverInfo) {
            console.warn("Receiver info not found, using basic info");
            receiverInfo = { _id: receiverId } as IUser;
          }

          const getMessagesCacheKeys = cacheKeys.filter((key) =>
            key.includes("getMessages")
          );

          getMessagesCacheKeys.forEach((cacheKey) => {
            try {
              const messageQueryArgs = JSON.parse(
                cacheKey.replace("getMessages(", "").replace(")", "")
              );
              if (messageQueryArgs?.receiverId === receiverId) {
                dispatch(
                  inboxApi.util.updateQueryData(
                    "getMessages",
                    messageQueryArgs,
                    (draft) => {
                      if (!draft?.data?.attributes?.results) {
                        draft.data = { attributes: { results: [] } };
                      }
                      const exists = draft.data.attributes.results.find(
                        (msg: IMessage) => msg._id === newMessage._id
                      );
                      if (!exists) {
                        draft.data.attributes.results.unshift(newMessage);
                      }
                    }
                  )
                );
              }
            } catch (e) {
              console.error("Failed to parse message query args:", e);
            }
          });

          const getChatsCacheKeys = cacheKeys.filter((key) =>
            key.includes("getChats")
          );

          getChatsCacheKeys.forEach((cacheKey) => {
            try {
              const chatQueryArgs = JSON.parse(
                cacheKey.replace("getChats(", "").replace(")", "")
              );
              dispatch(
                inboxApi.util.updateQueryData(
                  "getChats",
                  chatQueryArgs,
                  (draft) => {
                    if (!draft?.data?.attributes?.results) {
                      draft.data = { attributes: { results: [] } };
                    }
                    const normalizedReceiverId = receiverId;
                    const chatToUpdate = draft.data.attributes.results.find(
                      (chat: IChat) =>
                        chat._id === chatId ||
                        ((chat.participants as (IUser | string)[]).some(
                          (p) =>
                            (typeof p === "string" ? p : p._id) ===
                            senderInfo._id
                        ) &&
                          (chat.participants as (IUser | string)[]).some(
                            (p) =>
                              (typeof p === "string" ? p : p._id) ===
                              normalizedReceiverId
                          ))
                    );

                    if (chatToUpdate) {
                      chatToUpdate.lastMessage = newMessage;
                      chatToUpdate.updatedAt = newMessage.createdAt;
                      draft.data.attributes.results = [
                        chatToUpdate,
                        ...draft.data.attributes.results.filter(
                          (chat: IChat) => chat._id !== chatToUpdate._id
                        ),
                      ];
                    } else {
                      const newChat: IChat = {
                        _id: chatId,
                        chatType: "single",
                        participants: [
                          senderInfo as IUser,
                          receiverInfo as IUser,
                        ] as (IUser | string)[],
                        lastMessage: newMessage,
                        unviewedCount: 0,
                        createdAt: newMessage.createdAt,
                        updatedAt: newMessage.createdAt,
                      };
                      draft.data.attributes.results.unshift(newChat);
                    }
                  }
                )
              );
            } catch (e) {
              console.error("Failed to parse chat query args:", e);
            }
          });
        } catch (error) {
          console.error("Send message error:", error);
        }
      },
    }),
    viewAllMessagesInChat: builder.mutation({
      query: (chatId) => ({
        url: `/messages/view-all-messages/${chatId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["MessageNotifications"],
    }),
  }),
});

export const {
  useGetChatQuery,
  useGetChatsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useViewAllMessagesInChatMutation,
} = inboxApi;
