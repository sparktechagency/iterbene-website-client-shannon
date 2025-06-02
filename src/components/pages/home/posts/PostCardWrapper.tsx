"use client";
import React, { useEffect, useRef, useState } from "react";
import { IPost } from "@/types/post.types";
import { useVideoContext } from "@/contexts/VideoContext";
interface PostCardWrapperProps {
  post: IPost;
  children: React.ReactElement<{ shouldAutoplay?: boolean; post: IPost }>;
}

const PostCardWrapper = ({ post, children }: PostCardWrapperProps) => {
  const postRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const { currentPlayingVideo, setCurrentPlayingVideo } = useVideoContext();
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting && entry.intersectionRatio >= 0.5;
        setIsInView(isVisible);

        const hasVideo = post.media?.some((media) => media.mediaType === "video");
        if (hasVideo && isVisible) {
          // Video playback is handled by PostCard
        } else if (!isVisible && currentPlayingVideo) {
          const postVideoUrls = post.media
            ?.filter((media) => media.mediaType === "video")
            .map((media) => media.mediaUrl) || [];

          if (currentPlayingVideo && postVideoUrls.includes(currentPlayingVideo)) {
            setCurrentPlayingVideo(null);
          }
        }
      },
      {
        threshold: 0.5,
        rootMargin: "-50px 0px",
      }
    );

    const currentRef = postRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [post.media, currentPlayingVideo, setCurrentPlayingVideo]);

  return (
    <div ref={postRef} data-post-id={post._id}>
      {React.cloneElement(children, {
        shouldAutoplay: isInView,
        post,
      })}
    </div>
  );
};

export default PostCardWrapper;