import React from 'react';
import ContactListCard from './contact-list-card';
const ContactList: React.FC = () => {
  const contacts = [
    { id: 1, name: 'Turel Barrows', profileImage: 'https://i.ibb.co.com/hFTPRsW0/0de9d1146da18068833210d399cd593e.jpg', messagesCount: 0 },
    { id: 2, name: 'Jane Doe', profileImage: 'https://i.ibb.co.com/hFTPRsW0/0de9d1146da18068833210d399cd593e.jpg', messagesCount: 2 },
    { id: 3, name: 'John Smith', profileImage: 'https://i.ibb.co.com/hFTPRsW0/0de9d1146da18068833210d399cd593e.jpg', messagesCount: 0 },
    { id: 4, name: 'Alice Johnson', profileImage: 'https://i.ibb.co.com/hFTPRsW0/0de9d1146da18068833210d399cd593e.jpg', messagesCount: 3 },
    { id: 5, name: 'Bob Brown', profileImage: 'https://i.ibb.co.com/hFTPRsW0/0de9d1146da18068833210d399cd593e.jpg', messagesCount: 0 },
  ];

  return (
    <section className="w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold uppercase">Contacts</h1>
        <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white">
          <span>{contacts.length}</span>
        </div>
      </div>
      <div className="w-full space-y-4 mt-4">
        {contacts.map(contact => (
          <ContactListCard key={contact.id} contact={contact} />
        ))}
      </div>
    </section>
  );
};

export default ContactList;
