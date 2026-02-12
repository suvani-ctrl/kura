import React, { useRef, useReducer } from "react";
import Webcam from "react-webcam";
import { XIcon, Paperclip, Camera, Send, Image } from "lucide-react";
import useRandomSounds from "../hooks/KeyboardSounds";
import { chatStore } from "../store/ChatStore";

function reducer(state, action) {
  switch (action.type) {
    case "SET_TEXT":
      return { ...state, text: action.payload };
    case "TOGGLE_CAMERA":
      return { ...state, isCameraActive: !state.isCameraActive };
    case "SET_ATTACHMENT":
      return { ...state, attachment: action.payload };
    case "REMOVE_ATTACHMENT":
      return { ...state, attachment: null };
    case "SHARE_PDFS":
      return {...state,sharepdfs:action.payload}
    default:
      return state;
  }
}

const initialState = {
  text: "",
  isCameraActive: false,
  attachment: null, // can be string (image) or object { rawFile, previewUrl, fileSize }
};

export default function MessageInput() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const webcamRef = useRef(null);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const { playRandomKeyStrokeSound } = useRandomSounds();
  const { sendMessage, isSoundEnabled } = chatStore();
  const pdfRef = useRef(null)
  const videoConstraints = { width: 640, height: 480, facingMode: "user" };

  // --- Handlers ---
  const handleTextChange = (e) => {
    dispatch({ type: "SET_TEXT", payload: e.target.value });
    if (isSoundEnabled) playRandomKeyStrokeSound();
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!state.text.trim() && !state.attachment) return;
    sendMessage({
      text: state.text,
      attachment: state.attachment,
    });

    dispatch({ type: "SET_TEXT", payload: "" });
    dispatch({ type: "REMOVE_ATTACHMENT" });
  };

  const handleRemoveAttachment = () => {
    dispatch({ type: "REMOVE_ATTACHMENT" });
    if (imageInputRef.current) imageInputRef.current.value = "";
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if(!file){
      dispatch({type: "REMOVE_ATTACHMENT"});
      return;
    }
    const attachmentData = {
      rawFile: file,
      previewUrl: URL.createObjectURL(file),
      fileSize: file.size 
    };
    dispatch({
      type: "SET_ATTACHMENT",
      payload: attachmentData})
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      dispatch({ type: "SET_ATTACHMENT", payload: reader.result });
    };
    reader.readAsDataURL(file);
  };

    const handlePdfs = (e) =>{
    e.preventDefault();
    fileInputRef.current?.click();
  }

  const handleCapture = () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    dispatch({ type: "SET_ATTACHMENT", payload: imageSrc });
    dispatch({ type: "TOGGLE_CAMERA" });
  };

 
  const formatSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div className="w-full p-4 bg-dirty-blue-850/50 border-t border-white/5">
      {/* Hidden Inputs */}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={imageInputRef}
        onChange={handleImageSelect}
      />
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileSelect}
        accept=".pdf,application/pdf"
      />

      {/* Camera Modal */}
      {state.isCameraActive && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-dirty-blue-900 border border-white/10 p-4 rounded-xl flex flex-col gap-4">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="rounded-lg border border-white/10"
            />
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleCapture}
                className="flex items-center gap-2 bg-dirty-blue-600 hover:bg-dirty-blue-500 px-6 py-2 rounded-full"
              >
                <Camera size={20} /> Capture
              </button>
              <button
                onClick={() => dispatch({ type: "TOGGLE_CAMERA" })}
                className="bg-zinc-700 hover:bg-zinc-600 px-6 py-2 rounded-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attachment Preview */}
      {state.attachment && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative group">
            {typeof state.attachment === "string" ? (
              <img
                src={state.attachment}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-lg border border-zinc-700 shadow-md"
              />
            ) : (
              <div className="flex flex-col bg-dirty-blue-900 p-2 rounded-lg border border-zinc-700">
                <p>File: {state.attachment.rawFile.name}</p>
                <p>Size: {formatSize(state.attachment.fileSize)}</p>
              </div>
            )}
            <button
              onClick={handleRemoveAttachment}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600"
            >
              <XIcon size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSend} method = "post" encType="multipart/form-data" className="flex items-center gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="btn btn-circle btn-sm btn-ghost"
          >
            <Image size={22} />
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: "TOGGLE_CAMERA" })}
            className="btn btn-circle btn-sm btn-ghost"
          >
            <Camera size={22} />
          </button>
          <button
            type="button"
            onClick={handlePdfs}
            className="btn btn-circle btn-sm btn-ghost"
          >
            <Paperclip size={19} />
          </button>
         
        </div>

        <input
          type="text"
          placeholder="Type a message..."
          value={state.text}
          onChange={handleTextChange}
          className="flex-1 bg-dirty-blue-900/50 border border-white/10 rounded-full px-5 py-3 focus:outline-none focus:border-dirty-blue-500 focus:ring-1 focus:ring-dirty-blue-500 transition-all"
        />

        <button
          type="submit"
          disabled={!state.text.trim() && !state.attachment}
          className="btn btn-circle bg-dirty-blue-600 hover:bg-dirty-blue-500 border-none shadow-lg disabled:opacity-50"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
 