import { IComment } from "@/types/post.types";
import Image from "next/image";
import { FaHeart } from "react-icons/fa";

const PostCommentSection = ({ comments }: { comments: IComment[] }) => {
  return (
    <section className="mt-4">
      {comments.map((comment) => (
        <div key={comment.id} className="mb-3">
          {/* Comment */}
          <div className="flex items-start space-x-2">
            <Image
              src={comment.profilePic}
              alt={comment.username}
              width={48}
              height={48}
              className="size-[48px] ring ring-primary rounded-full"
            />
            <div className="bg-[#ECFCFA] p-3 rounded-xl flex-1 space-y-2">
              <p className="font-bold">{comment.username}</p>
              <p className="text-gray-700 text-sm">{comment.text}</p>
              <div className="flex items-center gap-5">
                <div className="flex items-center space-x-2 mt-1 text-gray-500 text-xs">
                  <FaHeart className="size-5 text-primary" />
                  <span className="font-semibold">
                    {" "}
                    {comment.replies?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Replies */}
          {/* {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-10 mt-2">
                    {comment.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className="flex items-start space-x-2 mb-2"
                      >
                        <Image
                          src={reply.profilePic}
                          alt={reply.username}
                          width={28}
                          height={28}
                          className="rounded-full"
                        />
                        <div className="bg-blue-50 p-2 rounded-xl flex-1">
                          <p className="font-semibold text-sm">{reply.username}</p>
                          <p className="text-gray-700 text-sm">{reply.text}</p>
                          <div className="flex items-center space-x-2 mt-1 text-gray-500 text-xs">
                            <span>{reply.timestamp}</span>
                            <button className="hover:text-blue-500">Like</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )} */}

          {/* Reply Input */}
          {/* {replyTo === comment.id && (
                  <div className="ml-10 mt-2 flex items-center space-x-2">
                    <input
                      type="text"
                      value={newReply}
                      onChange={(e) => setNewReply(e.target.value)}
                      placeholder="Write a reply..."
                      className="w-full p-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleAddReply(comment.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm"
                    >
                      Reply
                    </button>
                  </div>
                )} */}
        </div>
      ))}
      <div className="flex justify-center items-center my-5">
        {comments.length > 2 && (
          <button className="text-primary text-center">
            View all {comments.length} comments
          </button>
        )}
      </div>
    </section>
  );
};

export default PostCommentSection;
