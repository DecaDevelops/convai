import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import React, { memo } from "react";

function MarkdownReact({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, ...props }) => <h1 className="text-3xl" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-2xl" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-xl" {...props} />,
        h4: ({ node, ...props }) => <h4 className="text-sm" {...props} />,
        h5: ({ node, ...props }) => <h5 className="text-xs" {...props} />,
        code: ({ node, ...props }) => (
          <code
            className="bg-yellow-500 rounded p-2 text-black"
            style={{ fontFamily: "inherit", fontSize: "inherit" }}
            {...props}
          />
        ),
        em: ({ node, ...props }) => (
          <em className="text-blue-700 dark:text-blue-400 " {...props} />
        ),
        p: ({ node, ...props }) => (
          <p className="border-none py-1" {...props} />
        ),
        hr: () => null,
        strong: ({ node, ...props }) => (
          <strong className="font-bold text-black dark:text-white" {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export default memo(MarkdownReact);
