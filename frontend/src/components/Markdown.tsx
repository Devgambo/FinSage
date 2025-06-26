import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; 
import rehypeHighlight from 'rehype-highlight';


export default function Markdown({ text }: { text: string }) {
  return (
    <div className="prose max-w-none">
        <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        >
            {text}
        </ReactMarkdown>
    </div>
  );
}
