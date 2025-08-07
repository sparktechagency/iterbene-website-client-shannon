import React, { memo, useMemo } from "react";
import Image from "next/image";
import { IPost } from "@/types/post.types";
import UserTimelineContentRender from "../UserTimeline/UserTimelineContentRender";
// Import other necessary components

interface OptimizedUserTimelineCardProps {
  post: IPost;
  setTimelinePosts?: (post: IPost) => void;
}

/**
 * Sanitizes text content to prevent XSS attacks
 * @param content - Raw content string
 * @returns Sanitized content
 */
const sanitizeContent = (content: string): string => {
  if (!content) return '';
  
  // Remove HTML tags and escape special characters
  return content
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Renders post content with hashtag highlighting and XSS protection
 * @param content - Post content string
 * @returns JSX elements for rendered content
 */
const renderSafeContent = (content: string) => {
  if (!content) return null;

  const sanitizedContent = sanitizeContent(content);
  const words = sanitizedContent.split(/(\s+)/);
  
  return (
    <p className="text-gray-700 flex-1 mb-3">
      {words.map((word, index) => {
        const isHashtag = /^#\w+/.test(word);
        return (
          <span
            key={index}
            className={isHashtag ? "text-blue-500 font-bold" : ""}
          >
            {word}
          </span>
        );
      })}
    </p>
  );
};

/**
 * Optimized and secure UserTimelineCard with memoization and XSS protection
 */
const OptimizedUserTimelineCard = memo<OptimizedUserTimelineCardProps>(({ 
  post
}) => {
  // Memoize content rendering to avoid re-computation
  const renderedContent = useMemo(() => {
    return renderSafeContent(post?.content || '');
  }, [post?.content]);

  // Memoize media rendering
  const renderedMedia = useMemo(() => {
    return <UserTimelineContentRender data={post?.media || []} />;
  }, [post?.media]);

  // Memoize author info to prevent unnecessary re-renders
  const authorInfo = useMemo(() => ({
    name: sanitizeContent(post?.author?.fullName || 'Unknown User'),
    avatar: post?.author?.profilePicture || '/default-avatar.png',
    username: sanitizeContent(post?.author?.userName || '')
  }), [post?.author]);

  // Early return for missing post data
  if (!post || !post._id) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="text-gray-500 text-center">
          Invalid post data
        </div>
      </div>
    );
  }

  return (
    <article className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 relative">
            <Image
              src={authorInfo.avatar}
              alt={`${authorInfo.name}'s avatar`}
              fill
              className="object-cover"
              sizes="40px"
              onError={() => {
                // Handle error with a placeholder
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {authorInfo.name}
            </h3>
            <p className="text-sm text-gray-500 truncate">
              @{authorInfo.username}
            </p>
          </div>
          <time className="text-sm text-gray-500 flex-shrink-0">
            {new Date(post.createdAt).toLocaleDateString()}
          </time>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Post Title */}
        {post.title && (
          <h2 className="font-bold text-lg text-gray-900 mb-2">
            {sanitizeContent(post.title)}
          </h2>
        )}

        {/* Post Content with XSS Protection */}
        {renderedContent}

        {/* Media */}
        {renderedMedia}

        {/* Itinerary section */}
        {post?.itinerary && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-blue-600">🗺️</span>
              <span className="font-semibold text-blue-800">Itinerary</span>
            </div>
            <div className="text-sm text-blue-700">
              {sanitizeContent(post.itinerary.title || 'Travel Itinerary')}
            </div>
            {post.itinerary.description && (
              <div className="text-xs text-blue-600 mt-1">
                {sanitizeContent(post.itinerary.description)}
              </div>
            )}
          </div>
        )}

        {/* Location */}
        {post?.location && (
          <div className="mt-3 flex items-center space-x-2 text-sm text-gray-600">
            <span>📍</span>
            <span>{sanitizeContent(post.location)}</span>
          </div>
        )}
      </div>

      {/* Footer with actions */}
      <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
            aria-label="Like post"
          >
            <span>👍</span>
            <span>{post.likesCount || 0}</span>
          </button>
          <button 
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-green-600 transition-colors"
            aria-label="Comment on post"
          >
            <span>💬</span>
            <span>{post.commentsCount || 0}</span>
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            className="text-sm text-gray-600 hover:text-red-600 transition-colors"
            aria-label="Save post"
          >
            <span>🔖</span>
          </button>
          <button 
            className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            aria-label="Share post"
          >
            <span>📤</span>
          </button>
        </div>
      </div>
    </article>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memoization
  return (
    prevProps.post._id === nextProps.post._id &&
    prevProps.post.updatedAt === nextProps.post.updatedAt &&
    prevProps.post.likesCount === nextProps.post.likesCount &&
    prevProps.post.commentsCount === nextProps.post.commentsCount
  );
});

OptimizedUserTimelineCard.displayName = 'OptimizedUserTimelineCard';

export default OptimizedUserTimelineCard;