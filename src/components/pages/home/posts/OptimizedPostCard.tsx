"use client";

import React, { useState, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck } from "lucide-react";
import { FaBan, FaHeart } from "react-icons/fa";
import { FaFaceSmile } from "react-icons/fa6";
import { MdOutlineLuggage } from "react-icons/md";
import toast from "react-hot-toast";

// Types
import { IPost, ReactionType } from "@/types/post.types";

// Hooks
import useUser from "@/hooks/useUser";
import { usePostReactions } from "@/hooks/usePostReactions";
import { usePostVisibility } from "@/hooks/usePostVisibility";
import { useIncrementItineraryViewCountMutation } from "@/redux/features/post/postApi";
import { useAppDispatch } from "@/redux/hooks";

// Components
import PostHeader from "./post.header";
import PostContentRender from "./post.content-render";
import PostCommentSection from "./post.comment.section";
import PostCommentInput from "./post.comment.input";
import CustomModal from "@/components/custom/custom-modal";
import PostDetails from "../post-details/PostDetails";
import ShowItineraryModal from "../create-post/ShowItineraryModal";
import PostEditModal from "../create-post/PostEditModal";

// Redux
import { openAuthModal } from "@/redux/features/auth/authModalSlice";

// Utils
import formatPostReactionNumber from "@/utils/formatPostReactionNumber";

interface PostCardProps {
  post: IPost;
  setAllPosts?: (posts: IPost[] | ((prev: IPost[]) => IPost[])) => void;
}

// Reaction icons mapping (memoized outside component)
const REACTION_ICONS = {
  Like: FaHeart,
  Love: FaFaceSmile,
  Dislike: FaBan,
  Luggage: MdOutlineLuggage,
} as const;

// Reaction colors mapping
const REACTION_COLORS = {
  Like: "text-red-500",
  Love: "text-yellow-500", 
  Dislike: "text-red-600",
  Luggage: "text-blue-500",
} as const;

// Memoized Reaction Button Component
const ReactionButton = React.memo<{
  type: ReactionType;
  isActive: boolean;
  onClick: () => void;
}>(({ type, isActive, onClick }) => {
  const Icon = REACTION_ICONS[type];
  const activeColor = REACTION_COLORS[type];
  
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
        isActive ? activeColor : "text-gray-600"
      }`}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
});

ReactionButton.displayName = 'ReactionButton';

// Memoized Reaction Summary Component  
const ReactionSummary = React.memo<{
  sortedReactions: Array<{reaction: ReactionType; count: number}>;
  totalReactions: number;
  onClick: () => void;
}>(({ sortedReactions, totalReactions, onClick }) => {
  if (totalReactions === 0) return null;

  return (
    <button 
      onClick={onClick}
      className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
    >
      <div className="flex -space-x-1">
        {sortedReactions.slice(0, 3).map(({ reaction }) => {
          const Icon = REACTION_ICONS[reaction];
          const color = REACTION_COLORS[reaction];
          return (
            <div key={reaction} className={`p-1 bg-white rounded-full border ${color}`}>
              <Icon className="w-3 h-3" />
            </div>
          );
        })}
      </div>
      <span>{formatPostReactionNumber(totalReactions)}</span>
    </button>
  );
});

ReactionSummary.displayName = 'ReactionSummary';

const OptimizedPostCard: React.FC<PostCardProps> = ({ post, setAllPosts }) => {
  const user = useUser();
  const dispatch = useAppDispatch();
  const { elementRef, isVisible } = usePostVisibility();
  
  // Custom hooks for complex logic
  const {
    sortedReactions,
    totalReactions,
    userReaction,
    handleReactionToggle
  } = usePostReactions(post, user?._id);

  // Local state (minimized)
  const [modalStates, setModalStates] = useState({
    showReactions: false,
    showReactionDetails: false,
    showPostDetails: false,
    showItineraryModal: false,
    showPostEditModal: false,
  });

  const [editComment, setEditComment] = useState({
    id: null as string | null,
    text: ""
  });

  // Mutations
  const [incrementItinerary] = useIncrementItineraryViewCountMutation();

  // Modal toggle handlers (memoized)
  const toggleModal = useCallback((modal: keyof typeof modalStates) => {
    setModalStates(prev => ({ ...prev, [modal]: !prev[modal] }));
  }, []);

  // Memoized handlers
  const handlers = useMemo(() => ({
    handleReactionClick: (reactionType: ReactionType) => {
      if (!user) {
        dispatch(openAuthModal('welcome'));
        return;
      }
      handleReactionToggle(reactionType);
    },
    
    handleItineraryView: async () => {
      if (post.itinerary?._id) {
        try {
          await incrementItinerary(post.itinerary._id).unwrap();
        } catch (error) {
          console.error("Failed to increment itinerary view:", error);
        }
      }
      toggleModal('showItineraryModal');
    },
    
    handleEditComment: (commentId: string, commentText: string) => {
      setEditComment({ id: commentId, text: commentText });
    },
    
    handleCancelEdit: () => {
      setEditComment({ id: null, text: "" });
    }
  }), [user, dispatch, handleReactionToggle, post.itinerary?._id, incrementItinerary, toggleModal]);

  // Memoized reaction buttons
  const reactionButtons = useMemo(() => (
    <div className="flex items-center space-x-2">
      {(['Like', 'Love', 'Dislike', 'Luggage'] as ReactionType[]).map(type => (
        <ReactionButton
          key={type}
          type={type}
          isActive={userReaction?.reaction === type}
          onClick={() => handlers.handleReactionClick(type)}
        />
      ))}
      
      <button
        onClick={() => toggleModal('showReactions')}
        className="text-sm text-gray-500 hover:text-gray-700"
      >
        {modalStates.showReactions ? 'Hide' : 'More'}
      </button>
    </div>
  ), [userReaction?.reaction, handlers.handleReactionClick, toggleModal, modalStates.showReactions]);

  return (
    <>
      <motion.article
        ref={elementRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0.8, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        {/* Post Header */}
        <PostHeader 
          post={post} 
          onEdit={() => toggleModal('showPostEditModal')}
          setAllPosts={setAllPosts}
        />

        {/* Post Content */}
        <PostContentRender post={post} />

        {/* Itinerary Button (if exists) */}
        {post.itinerary && (
          <div className="px-4 py-2">
            <button
              onClick={handlers.handleItineraryView}
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <CalendarCheck className="w-5 h-5" />
              <span className="text-sm font-medium">View Itinerary</span>
            </button>
          </div>
        )}

        {/* Reactions Summary */}
        <div className="px-4 py-2 border-t border-gray-100">
          <ReactionSummary
            sortedReactions={sortedReactions}
            totalReactions={totalReactions}
            onClick={() => toggleModal('showReactionDetails')}
          />
        </div>

        {/* Reaction Buttons */}
        <div className="px-4 py-2 border-t border-gray-100">
          {reactionButtons}
        </div>

        {/* Reaction Details (expanded) */}
        <AnimatePresence>
          {modalStates.showReactions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 py-2 border-t border-gray-100 bg-gray-50"
            >
              <div className="grid grid-cols-4 gap-2">
                {sortedReactions.map(({ reaction, count }) => {
                  const Icon = REACTION_ICONS[reaction];
                  const color = REACTION_COLORS[reaction];
                  return (
                    <div key={reaction} className="text-center">
                      <Icon className={`w-6 h-6 mx-auto mb-1 ${color}`} />
                      <span className="text-sm text-gray-600">{count}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comments Section */}
        <div className="border-t border-gray-100">
          <PostCommentSection
            post={post}
            editCommentId={editComment.id}
            editCommentText={editComment.text}
            onEditComment={handlers.handleEditComment}
            onCancelEdit={handlers.handleCancelEdit}
            setAllPosts={setAllPosts}
          />
          
          <PostCommentInput 
            post={post} 
            setAllPosts={setAllPosts}
          />
        </div>

        {/* Click for Details */}
        <div className="px-4 py-2 border-t border-gray-100">
          <button
            onClick={() => toggleModal('showPostDetails')}
            className="text-sm text-gray-500 hover:text-primary transition-colors"
          >
            View full post
          </button>
        </div>
      </motion.article>

      {/* Modals */}
      <CustomModal
        isOpen={modalStates.showPostDetails}
        onClose={() => toggleModal('showPostDetails')}
        maxWidth="max-w-4xl"
        maxHeight="max-h-[90vh]"
      >
        <PostDetails post={post} />
      </CustomModal>

      {modalStates.showItineraryModal && post.itinerary && (
        <ShowItineraryModal
          visible={modalStates.showItineraryModal}
          onClose={() => toggleModal('showItineraryModal')}
          itinerary={post.itinerary}
          isEditing={false}
        />
      )}

      {modalStates.showPostEditModal && (
        <PostEditModal
          isOpen={modalStates.showPostEditModal}
          onClose={() => toggleModal('showPostEditModal')}
          post={post}
          onPostUpdated={() => {
            toggleModal('showPostEditModal');
            toast.success('Post updated successfully!');
          }}
        />
      )}
    </>
  );
};

// Export memoized component for better performance
export default React.memo(OptimizedPostCard);