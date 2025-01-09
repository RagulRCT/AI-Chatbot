import { ArrowRight, Square } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

import { Button } from '@ui/Button';
import { Textarea } from '@ui/TextArea';

type MessageInputProps = {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  stop: () => void;
};

export default function MessageInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  stop,
}: MessageInputProps) {
  const [rows, setRows] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    adjustTextareaRows();
  }, [input]);

  const adjustTextareaRows = () => {
    if (textareaRef.current) {
      const textareaLineHeight = 24;
      const minRows = 1;
      const maxRows = 5;

      const previousRows = textareaRef.current.rows;
      textareaRef.current.rows = minRows;

      const currentRows = Math.floor(
        textareaRef.current.scrollHeight / textareaLineHeight,
      );

      if (currentRows === previousRows) {
        textareaRef.current.rows = currentRows;
      }

      if (currentRows >= maxRows) {
        textareaRef.current.rows = maxRows;
        textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
      }

      setRows(currentRows < maxRows ? currentRows : maxRows);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      const form = event.currentTarget.form;
      if (form && !isLoading) {
        form.dispatchEvent(
          new Event('submit', { cancelable: true, bubbles: true }),
        );
      }
    }
  };

  return (
    <div className="p-2 sm:p-4 mt-auto bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
      <form
        onSubmit={handleSubmit}
        className="relative max-w-2xl mx-auto flex items-center"
      >
        <Textarea
          ref={textareaRef}
          rows={1}
          placeholder="Ask your Question"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="resize-none pr-10 sm:pr-12 py-2 sm:py-3 min-h-[40px] sm:min-h-[44px] rounded-xl sm:rounded-2xl border-muted-foreground/20 bg-background focus-visible:ring-1 focus-visible:ring-offset-1 text-sm sm:text-base"
          style={{ height: rows === 1 ? '40px' : 'auto' }}
          disabled={isLoading}
        />
        {isLoading ? (
          <Button
            type="button"
            size="icon"
            onClick={stop}
            className="absolute right-1 sm:right-1.5 top-1 sm:top-1.5 h-8 w-8 rounded-full"
          >
            <Square className="h-4 w-4" />
            <span className="sr-only">Stop generating</span>
          </Button>
        ) : (
          <Button
            type="submit"
            size="icon"
            className="absolute right-1 sm:right-1.5 top-1 sm:top-1.5 h-8 w-8 rounded-full"
            disabled={!input.trim()}
          >
            <ArrowRight className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        )}
      </form>
      <div className="text-xs text-center mt-2 text-muted-foreground">
        My Chatbot can make mistakes. Consider checking important
        information.
      </div>
    </div>
  );
}
