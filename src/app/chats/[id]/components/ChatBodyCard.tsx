import MarkdownReact from "@/components/MarkdownReact";
import PopoverImage from "@/components/PopoverImage";
import { TextAreaWithLabel } from "@/components/textarea-with-label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChatMessageSelect } from "@/features/chat-message/types";
import useChat from "@/features/chat/chat-context";
import useChattingMutations from "@/features/chatting/use-chatting-mutations";
import { setClipboard } from "@/lib/write-to-clipboard";
import {
  Copy,
  EllipsisVertical,
  Loader2,
  MessageCirclePlus,
  Pencil,
} from "lucide-react";
import React, { Dispatch, memo, SetStateAction, useState } from "react";

type props = {
  message: ChatMessageSelect;
  isSelectedEdit: boolean;
  isLastAssistantMessage: boolean;
  setSelectedEdit: Dispatch<SetStateAction<null | number>>;
};

const ChatBodyCardForm: React.FC<{
  onSubmitForm: (message: string) => void;
  onCancel: VoidFunction;
  message: ChatMessageSelect;
  isPending: boolean;
}> = ({ onSubmitForm, onCancel, message, isPending }) => {
  const [editedMessage, setEditedMessage] = useState(message.content ?? "");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        return onSubmitForm(editedMessage);
      }}
      className="space-y-2"
    >
      <TextAreaWithLabel
        value={editedMessage}
        onChange={(e) => setEditedMessage(e.target.value)}
      />
      <div className="flex flex-row gap-2">
        <Button type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button>
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <span>Update message</span>
          )}
        </Button>
      </div>
    </form>
  );
};

function ChatBodyCard({
  isSelectedEdit,
  message,
  setSelectedEdit,
  isLastAssistantMessage,
}: props) {
  const { activePersona, character, chatId } = useChat();
  const {
    doContinueMessage,
    isPending,
    doUpdateMessageAsync,
    isPendingUpdate,
  } = useChattingMutations();
  const name =
    message.role == 0
      ? (activePersona?.name ?? "You")
      : (character?.name ?? "Assistant");
  const image =
    message.role == 0
      ? (activePersona?.image ?? "/images/upload.png")
      : (character?.image?.[0] ?? "/images/upload.png");

  const content =
    message.content
      ?.replaceAll("{{char}}", character?.name ?? "Assistant")
      .replaceAll("{{user}}", activePersona?.name ?? "You") ?? "";

  const handleSubmit = async (msg: string) => {
    try {
      await doUpdateMessageAsync({ message: msg, messageId: message.id });
      setSelectedEdit(null);
    } catch (error) {
      // do something extra
    }
  };
  return (
    <Card className="shrink-0">
      <CardHeader className="flex flex-row items-start">
        <PopoverImage url={image} height={52} width={52} />
        <CardTitle>{name}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size={"icon-sm"} className="ml-auto">
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSelectedEdit(message.id)}>
              <Pencil /> <span>Edit message</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setClipboard(message.content ?? "")}
            >
              <Copy /> <span>Copy Message</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        {!isSelectedEdit ? (
          <MarkdownReact content={content} />
        ) : (
          <ChatBodyCardForm
            message={message}
            onCancel={() => setSelectedEdit(null)}
            onSubmitForm={handleSubmit}
            isPending={isPendingUpdate}
          />
        )}
      </CardContent>
      <CardFooter>
        {isLastAssistantMessage && (
          <>
            <Button
              variant={"ghost"}
              size={"icon-xs"}
              onClick={() => {
                if (isPending) return;
                doContinueMessage(chatId);
              }}
            >
              <MessageCirclePlus />
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}

export default memo(ChatBodyCard);
