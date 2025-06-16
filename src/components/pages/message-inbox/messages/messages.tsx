import React from "react";
import MessageHeader from "./message-header";
import MessageBody from "./message-body";
import MessageFooter from "./message-footer";

const Messages = () => {
  return (
    <section className="flex flex-col h-[80vh] bg-white shadow">
      <MessageHeader />
      <div className="flex-1 overflow-y-hidden">
        <MessageBody />
      </div>
      <MessageFooter />
    </section>
  );
};

export default Messages;
