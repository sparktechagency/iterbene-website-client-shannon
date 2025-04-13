"use client";
import React from "react";
import InvitationCard from "./invitation-card";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

// Import required modules
import { FreeMode, Pagination, Autoplay } from "swiper/modules";

// Define types for the invitation data
interface IAuthor {
  fullName: string;
  profileImage: {
    imageUrl: string;
  };
}

interface IInvitation {
  id: number;
  title: string;
  author: IAuthor;
  image: {
    imageUrl: string;
  };
  type: string; // Assuming type can be something like "event", "trip", etc.
}

const Invitations: React.FC = () => {
  const allInvitations: IInvitation[] = [
    {
      id: 1,
      title: "Holiday trip to Barcelona Spain",
      author: {
        fullName: "John Doe",
        profileImage: {
          imageUrl:
            "https://i.ibb.co.com/hFTPRsW0/0de9d1146da18068833210d399cd593e.jpg",
        },
      },
      image: {
        imageUrl:
          "https://i.ibb.co.com/6RknjBzS/35b873adc5c444a2d66ee10e62d473d6.jpg",
      },
      type: "trip",
    },
    {
      id: 2,
      title: "Holiday trip to Barcelona Spain",
      author: {
        fullName: "John Doe",
        profileImage: {
          imageUrl:
            "https://i.ibb.co.com/hFTPRsW0/0de9d1146da18068833210d399cd593e.jpg",
        },
      },
      image: {
        imageUrl:
          "https://i.ibb.co.com/hFVGYMF0/2588a7b47b42d6dddfdfa08bb9300d00.jpg",
      },
      type: "trip",
    },
    {
      id: 3,
      title: "Holiday trip to Barcelona Spain",
      author: {
        fullName: "John Doe",
        profileImage: {
          imageUrl:
            "https://i.ibb.co.com/hFTPRsW0/0de9d1146da18068833210d399cd593e.jpg",
        },
      },
      image: {
        imageUrl:
          "https://i.ibb.co.com/JVfh3WK/36fe2823b98504660e2f44dc3c1ffb97.jpg",
      },
      type: "trip",
    },
    {
      id: 4,
      title: "Holiday trip to Barcelona Spain",
      author: {
        fullName: "John Doe",
        profileImage: {
          imageUrl:
            "https://i.ibb.co.com/hFTPRsW0/0de9d1146da18068833210d399cd593e.jpg",
        },
      },
      image: {
        imageUrl:
          "https://i.ibb.co.com/6RknjBzS/35b873adc5c444a2d66ee10e62d473d6.jpg",
      },
      type: "trip",
    },
  ];

  return (
    <section className="w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold uppercase">Invitations</h1>
        <div className="size-8 rounded-full bg-[#40E0D0] flex items-center justify-center text-white">
          <span>5</span>
        </div>
      </div>
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        freeMode={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          el: null,
        }}
        modules={[FreeMode, Pagination, Autoplay]}
        className="mySwiper mt-5"
      >
        {allInvitations?.map((invitation) => (
          <SwiperSlide key={invitation.id}>
            <InvitationCard invitation={invitation} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Invitations;
