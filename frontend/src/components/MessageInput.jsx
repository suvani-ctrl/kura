import React, { useRef, useState } from "react";
import useRandomSounds from "../hooks/KeyboardSounds";
import { chatStore } from "../store/ChatStore";
import { XIcon } from "lucide-react";
import toast from "react-hot-toast";

function MessageInput() {
  const { playRandomKeyStrokeSound } = useRandomSounds();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const { sendMessage, isSoundEnabled } = chatStore();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    if (isSoundEnabled) playRandomKeyStrokeSound();

    sendMessage({
      text: text.trim(),
      image: imagePreview,
    });

    setText("");
    removeImage();
  };

  return (
    <div className="p-4 flex flex-col gap-3">
      
      {imagePreview && (
        <div className="relative inline-block">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-20 h-20 object-cover rounded-md"
          />
          <button
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
          >
            <XIcon className="w-3 h-3 text-white" />
          </button>
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-3 w-full"
      >
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-2 rounded bg-dirty-blue-800 text-white outline-none"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (isSoundEnabled) playRandomKeyStrokeSound();
          }}
        />

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-2 bg-dirty-blue-600 text-white rounded"
        >
          Image
        </button>

        <button
          type="submit"
          className="px-4 py-2 bg-dirty-blue-500 text-white rounded"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default MessageInput;
