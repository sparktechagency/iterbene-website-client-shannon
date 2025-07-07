import React from "react";
import MessageHeader from "./message-header";
import MessageBody from "./message-body";
import MessageFooter from "./message-footer";

const Messages = () => {
  return (
    <section className="w-full flex flex-col h-full bg-white shadow-lg rounded-xl">
      <MessageHeader />
      <div className="flex-1 overflow-y-auto">
        <MessageBody />
      </div>
      <MessageFooter />
    </section>
  );
};

export default Messages;
