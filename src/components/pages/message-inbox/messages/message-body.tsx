import React from "react";
import Image from "next/image";

interface IMessage {
  id: number;
  sender: string;
  content: string;
  timeStamp: string;
  isSentByUser: boolean;
  image?: string;
}

const demoMessages: IMessage[] = [
  {
    id: 1,
    sender: "Alice",
    content:
      "Vel et commodo et scelerisque aliquam. Sed libero, non praesent felis, sem eget venenatis neque. Massa tincidunt tempor a nisl eu mauris lectus. Amet lobortis at egestas aenean. Rhoncus cras nunc lectus morbi duis sem diam. Sed gravida eget semper vulputate vitae.",
    timeStamp: "10:16",
    isSentByUser: false,
  },
  {
    id: 2,
    sender: "Alice",
    content: "",
    image: "https://images.unsplash.com/photo-1516541196182-6bdb0516ed27",
    timeStamp: "10:16",
    isSentByUser: false,
  },
  {
    id: 3,
    sender: "You",
    content:
      "Est eget quis omnare vulputate placerat. Odio nunc vitae, vel scelerisque tortor vitae egestas. Donec lobortis mattis pellentesque nisl nibh eu.",
    timeStamp: "10:45",
    isSentByUser: true,
  },
  {
    id: 4,
    sender: "Alice",
    content:
      "Vestibulum viverra lacus, congue scelerisque neque. Viverra cursus nisi, in purus dolor at. Nec sed eget scelerisque imperdiet consectetur. Pellentesque aliquam id posuere massa aliquet. Pulvinar.",
    timeStamp: "11:04",
    isSentByUser: false,
  },
  {
    id: 5,
    sender: "You",
    content: "Donec lobortis mattis pellentesque nisl nibh eu.",
    timeStamp: "12:37",
    isSentByUser: true,
  },
  {
    id: 6,
    sender: "Alice",
    content: "OK LETS DO IT",
    timeStamp: "12:37",
    isSentByUser: false,
  },
];

const MessageBody = () => {
  return (
    <div className="flex-1 p-4 overflow-y-auto space-y-4">
      {demoMessages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.isSentByUser ? "justify-end" : "justify-start"
          } items-start space-x-2`}
        >
          {!message.isSentByUser && (
            <Image
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
              alt={message.sender}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full"
            />
          )}
          <div
            className={`flex flex-col ${
              message.isSentByUser ? "items-end" : "items-start"
            }`}
          >
            <span className={`text-sm text-gray-500 ${ message.isSentByUser ? "mr-2 mb-1" : "ml-2 mb-1"} `}>
              {message.timeStamp}
            </span>
            <div
              className={`max-w-md p-3 rounded-xl ${
                message.isSentByUser
                  ? "bg-[#E6E6E6] text-gray-800"
                  : "bg-[#ECFCFA] text-[#1A1A1A]"
              }`}
            >
              {message.content && <p>{message.content}</p>}
              {message.image && (
                <Image
                  src={message.image}
                  alt="Message Image"
                  width={150}
                  height={150}
                  className="mt-2 rounded-lg"
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageBody;
