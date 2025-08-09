import { useMemo, useCallback } from 'react';
import { useAddOrRemoveReactionMutation } from "@/redux/features/post/postApi";
import { IPost, IReaction, ISortedReaction, ReactionType } from "@/types/post.types";
import { TError } from "@/types/error";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/redux/hooks";
import { openAuthModal } from "@/redux/features/auth/authModalSlice";

export const usePostReactions = (post: IPost, userId?: string) => {
  const [addOrRemoveReaction] = useAddOrRemoveReactionMutation();
  const dispatch = useAppDispatch();

  // Memoized reaction processing
  const processedReactions = useMemo(() => {
    if (!post.reactions?.length) {
      return {
        sortedReactions: [],
        totalReactions: 0,
        userReaction: null,
        hasUserReacted: false
      };
    }

    // Group reactions by type and count
    const reactionCounts: Record<ReactionType, IReaction[]> = {
      [ReactionType.LOVE]: [],
      [ReactionType.LUGGAGE]: [],
      [ReactionType.BAN]: [],
      [ReactionType.SMILE]: []
    };

    let userReaction: IReaction | null = null;

    post.reactions.forEach(reaction => {
      if (reactionCounts[reaction.reactionType]) {
        reactionCounts[reaction.reactionType].push(reaction);
      }
      
      if (reaction.userId._id === userId) {
        userReaction = reaction;
      }
    });

    // Sort reactions by count (descending)
    const sortedReactions: ISortedReaction[] = Object.entries(reactionCounts)
      .filter(([, reactions]) => reactions.length > 0)
      .map(([type, reactions]) => ({
        type: type as ReactionType,
        count: reactions.length
      }))
      .sort((a, b) => b.count - a.count);

    return {
      sortedReactions,
      totalReactions: post.reactions.length,
      userReaction,
      hasUserReacted: !!userReaction
    };
  }, [post.reactions, userId]);

  // Handle reaction toggle
  const handleReactionToggle = useCallback(async (reactionType: ReactionType) => {
    console.log("handleReactionToggle called:", { userId, reactionType });
    if (!userId) {
      console.log("No userId in usePostReactions, opening auth modal");
      dispatch(openAuthModal("welcome"));
      return;
    }

    try {
      await addOrRemoveReaction({
        postId: post._id,
        reaction: reactionType,
      }).unwrap();
      
      // Success handled by RTK Query cache updates
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  }, [addOrRemoveReaction, post._id, userId, dispatch]);

  return {
    ...processedReactions,
    handleReactionToggle
  };
};