import { useMediaQuery } from 'react-responsive';
import { useState, useEffect, useRef } from 'react';
import { ActionButtons } from './ActionButtons';
import { Button } from '@ui/Button';
import { Message } from '@/types/Message';
import { Textarea } from '@ui/TextArea';

type MessageBubbleProps = {
  message: Message;
  onEdit: (newContent: string) => void;
  onDelete: () => void;
  onRegenerate: () => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
};

export const MessageBubble = ({
  message,
  onEdit,
  onDelete,
  onRegenerate,
  isEditing,
  setIsEditing,
}: MessageBubbleProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [editedContent, setEditedContent] = useState(message.content);

  // Use react-responsive to detect screen size
  const isDesktop = useMediaQuery({ minWidth: 768 });

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, [isEditing]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedContent(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSubmitEdit = () => {
    onEdit(editedContent);
    setIsEditing(false);
  };

  const isSubmitDisabled = editedContent === message.content;

  // Function to add spacing around bold text and handle line breaks
  const formatContent = (content: string) => {
    // Replace **bold** with <strong> tags and add space above and below
    const boldFormatted = content.replace(/\*\*(.*?)\*\*/g, (match, p1) => {
      return `<strong">${p1}</strong>`;
    });

    // Replace newlines (\n) with <br> tags to create line breaks
    const newLinesFormatted = boldFormatted.replace(/\n/g, '<br>');

    return newLinesFormatted;
  };

  const formattedMessage = formatContent(message.content);

  return (
    <div
      className={`relative px-3 py-2 rounded-lg w-full ${
        message.role === 'user'
          ? 'text-foreground bg-accent'
          : 'bg-muted/50 text-foreground'
      } ${isEditing ? 'bg-transparent' : ''}`}
    >
      {isEditing ? (
        <div className="space-y-2">
          <Textarea
            ref={textareaRef}
            value={editedContent}
            onChange={handleTextareaChange}
            className="w-full p-2 text-foreground bg-background border rounded resize-none"
            rows={isDesktop ? 10 : 5}
          />
          <div className="flex justify-end space-x-2 text-black">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmitEdit}
              disabled={isSubmitDisabled}
            >
              Submit
            </Button>
          </div>
        </div>
      ) : (
        <>
          {message.role === 'user' ? (
            <pre
              className="document-font whitespace-pre-wrap pb-8"
              style={{ maxWidth: '50' }}
            >
              {message.content}
            </pre>
          ) : (
            // Render the formatted message with HTML using dangerouslySetInnerHTML
            <div
              className="leading-8 pb-4"
              dangerouslySetInnerHTML={{ __html: formattedMessage }}
              style={{ whiteSpace: 'pre-wrap' }} // Preserve spaces and line breaks
            />
          )}
          <div
            className={`absolute bottom-1 ${
              message.role === 'user' ? 'left-1' : 'right-1'
            } md:group-hover:opacity-0 transition-opacity duration-300`}
          >
            <ActionButtons
              message={message}
              onEdit={() => setIsEditing(true)}
              onDelete={onDelete}
              onRegenerate={onRegenerate}
            />
          </div>
        </>
      )}
    </div>
  );
};