"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateStoryMutation } from "@/redux/features/stories/storiesApi";

export default function CreateStoryPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [textContent, setTextContent] = useState("");
  const [privacy, setPrivacy] = useState("FOLLOWERS");
  const router = useRouter();
  const [createStory, { isLoading }] = useCreateStoryMutation();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    files.forEach((file) => formData.append("storyFiles", file));
    try {
     const res = await createStory(formData).unwrap();
      toast.success(res?.message);
      router.push("/");
    } catch (err) {
      console.error("Error creating story:", err);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Create New Story</h1>
      <textarea
        value={textContent}
        onChange={(e) => setTextContent(e.target.value)}
        placeholder="Add text to your story..."
        className="w-full p-2 mb-4 border rounded"
      />
      <select
        value={privacy}
        onChange={(e) => setPrivacy(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      >
        <option value="PUBLIC">Public</option>
        <option value="FOLLOWERS">Followers</option>
      </select>
      <input
        type="file"
        multiple
        onChange={handleFileUpload}
        accept="image/*,video/*"
        className="w-full p-2 mb-4 border rounded"
      />
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isLoading ? "Sharing..." : "Share Story"}
      </button>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {files.map((file, i) => (
          <div key={i} className="relative">
            <img
              src={URL.createObjectURL(file)}
              alt="Upload"
              className="w-full h-32 object-cover rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
