import { cn } from '@/lib/utils';
import Markdown, { ReactRenderer } from 'marked-react';
import Lowlight from 'react-lowlight';
import { formatContent } from '@/utils/formatContent';
import javascript from 'highlight.js/lib/languages/javascript';
import css from 'highlight.js/lib/languages/css';
import { removeHttpAndWww } from '@/utils/string';

Lowlight.registerLanguage('javascript', javascript);
Lowlight.registerLanguage('css', css);

const renderer: Partial<ReactRenderer> = {
  link(href, text) {
    return <a href={href} rel="noopener noreferrer" target="_blank">
      {typeof text === 'string'
        ? removeHttpAndWww(text)
        : text instanceof Array
        ? text.map(t => typeof t === 'string' ? removeHttpAndWww(t) : t)
        : text}
    </a>;
  },
  code(snippet, lang) {
    return <Lowlight
      key={this.elementId}
      language={lang || 'text'}
      value={snippet as string}
      markers={[]}
    />;
  },
  paragraph(children) {
    return <p>{
      children instanceof Array
      ? children.map((value: React.ReactNode) => (
        typeof value === 'string'
          ? formatContent(value)
          : value
      ))
      : children
    }</p>
  }
};

interface ThreadContentRendererProps {
  content: string;
  className?: string;
}

export const ThreadContentRenderer: React.FC<ThreadContentRendererProps> = ({
  content,
  className,
}) => {
  return (
    <div 
      className={cn("thread-content", className)}
    >
      <Markdown value={content} renderer={renderer} />
    </div>
  );
};
