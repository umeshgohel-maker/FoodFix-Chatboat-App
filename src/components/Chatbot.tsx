import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Camera, Image as ImageIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Theme } from '../types';

interface ChatbotProps {
  theme: Theme;
}

export default function Chatbot({ theme }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ text: string; isBot: boolean; imageUrl?: string }[]>([
    { text: 'Greetings. I am your Boutique Culinary Concierge. How may I assist you today? You can ask about our support policies or upload an image of your order to verify its quality.', isBot: true },
  ]);
  const [selectedImage, setSelectedImage] = useState<{ data: string; mimeType: string; preview: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to the end
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!message.trim() && !selectedImage) return;

    const userMessageText = message.trim() || "Uploaded food image for quality check.";
    const userImgPreview = selectedImage?.preview;
    const userImgPayload = selectedImage ? { data: selectedImage.data, mimeType: selectedImage.mimeType } : undefined;

    // Append user message immediately
    setMessages((prev) => [
      ...prev,
      { text: userMessageText, isBot: false, imageUrl: userImgPreview }
    ]);

    setMessage('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const historyPayload = messages.map(msg => ({
        text: msg.text,
        isBot: msg.isBot
      }));

      const res = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: userMessageText,
          history: historyPayload,
          image: userImgPayload
        })
      });

      if (!res.ok) {
        throw new Error('Support API returned status error');
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { text: data.text || "I apologize, but I could not compute a valid support answer.", isBot: true }
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { text: "I apologize. I suffered a connectivity interruption. Please verify the food-fix server is fully operational.", isBot: true }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      setSelectedImage({
        data: base64String,
        mimeType: file.type,
        preview: URL.createObjectURL(file)
      });
    };
    reader.readAsDataURL(file);
    
    // Clear input
    if (e.target) {
      e.target.value = '';
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-8 right-8 p-5 rounded-full shadow-lg cursor-pointer transition-all active:scale-95 duration-300 z-50 ${theme.buttonBg} ${theme.buttonText} ${theme.buttonHover} border ${theme.border}`}
      >
        <MessageCircle size={26} />
      </button>

      <AnimatePresence>
         {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            className={`fixed inset-4 sm:inset-auto sm:bottom-28 sm:right-8 sm:w-95 sm:h-125 shadow-2xl rounded-3xl border ${theme.border} ${theme.cardBg} z-50 flex flex-col overflow-hidden`}
          >
            {/* Concierge Header */}
            <div className={`p-5 border-b ${theme.border} flex justify-between items-center bg-black/5 dark:bg-white/5`}>
              <div>
                <h3 className={`font-semibold text-sm ${theme.textPrimary} ${theme.fontClass} tracking-wide`}>
                  Culinary Concierge
                </h3>
                <p className={`text-[10px] uppercase tracking-widest ${theme.textSecondary} ${theme.metaFontClass}`}>
                  Curated Assistance
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className={`p-1.5 rounded-full hover:bg-zinc-500/10 transition-colors ${theme.textSecondary} cursor-pointer`}
              >
                <X size={18} />
              </button>
            </div>

            {/* Message Thread */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl text-xs max-w-[85%] leading-relaxed space-y-2.5 ${
                    msg.isBot
                      ? `bg-black/5 dark:bg-white/5 ${theme.textPrimary} border ${theme.border} rounded-tl-none`
                      : `${theme.buttonBg} ${theme.buttonText} rounded-tr-none ml-auto shadow-sm`
                  }`}
                >
                  {msg.imageUrl && (
                    <img
                      src={msg.imageUrl}
                      alt="Attachment"
                      className="w-full max-h-36 object-cover rounded-xl border border-black/10 dark:border-white/10"
                    />
                  )}
                  <p>{msg.text}</p>
                </div>
              ))}
              {isLoading && (
                <div className={`p-4 rounded-2xl text-xs max-w-[85%] bg-black/5 dark:bg-white/5 ${theme.textSecondary} border ${theme.border} rounded-tl-none flex items-center gap-2`}>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Processing curated response...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Attached file input hidden */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Upload thumbnail preview band */}
            {selectedImage && (
              <div className={`px-5 py-2.5 border-t ${theme.border} flex items-center justify-between bg-black/5 dark:bg-white/5`}>
                <div className="flex items-center gap-3">
                  <img
                    src={selectedImage.preview}
                    alt="Upload Preview"
                    className="w-10 h-10 object-cover rounded-lg border border-black/10 dark:border-white/10"
                  />
                  <div className="text-[10px] uppercase tracking-widest opacity-60 font-mono">
                    Image Attached
                  </div>
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-1 rounded-full hover:bg-zinc-500/10 text-red-500 transition-colors cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>
            )}

            {/* Input Box */}
            <div className={`p-4 border-t ${theme.border} flex gap-2 items-center bg-black/5 dark:bg-white/5`}>
              <button
                type="button"
                onClick={triggerUpload}
                title="Attach snapshot of food quality concern"
                className={`p-2.5 rounded-full border ${theme.border} bg-white dark:bg-zinc-800 hover:opacity-85 text-zinc-500 transition-all cursor-pointer`}
              >
                <Camera size={15} />
              </button>

              <input
                type="text"
                placeholder="Ask concierge or report issues..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className={`flex-1 bg-transparent border ${theme.border} rounded-full px-5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-400 ${theme.textPrimary}`}
              />
              <button
                onClick={handleSend}
                className={`p-3 rounded-full border border-transparent transition-all cursor-pointer active:scale-95 flex items-center justify-center ${theme.buttonBg} ${theme.buttonText} ${theme.buttonHover}`}
              >
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
