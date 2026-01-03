'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface MarkdownRendererProps {
  content: string
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        // Handle code blocks with syntax highlighting
        code({ node, inline, className, children, ...props }: any) {
          // Check if this is a code block (not inline)
          if (!inline) {
            const match = /language-(\w+)/.exec(className || '')
            const language = match ? match[1] : ''
            
            if (language) {
              return (
                <SyntaxHighlighter
                  style={okaidia}
                  language={language}
                  PreTag="div"
                  className="rounded-lg my-4 code-block-monokai"
                  customStyle={{
                    marginTop: '1rem',
                    marginBottom: '1rem',
                    borderRadius: '0.5rem',
                    background: '#f5f5f5',
                    border: '1px solid #e5e5e5',
                  }}
                  codeTagProps={{
                    style: {
                      background: 'transparent',
                    },
                  }}
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              )
            }
            
            // Code block without language
            return (
              <code className="block bg-gray-100 text-gray-800 p-4 rounded-lg overflow-x-auto my-4 font-mono text-sm border border-gray-200" {...props}>
                {children}
              </code>
            )
          }
          
          // Inline code
          return (
            <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
              {children}
            </code>
          )
        },
        // Handle pre blocks - pass through for code blocks, render normally for others
        pre({ node, children, ...props }: any) {
          // If it contains a code element that we've already handled, don't wrap it
          if (node?.children?.[0]?.tagName === 'code') {
            return <>{children}</>
          }
          return <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4" {...props}>{children}</pre>
        },
        // Handle images
        img({ node, ...props }: any) {
          return (
            <div className="my-6">
              <img
                src={props.src || ''}
                alt={props.alt || ''}
                className="rounded-lg w-full h-auto shadow-lg"
              />
            </div>
          )
        },
        // Handle paragraphs to support math
        p({ node, children, ...props }: any) {
          return <p className="mb-4 leading-7" {...props}>{children}</p>
        },
        // Handle headings
        h1({ node, children, ...props }: any) {
          return <h1 className="text-4xl font-bold mt-8 mb-4" {...props}>{children}</h1>
        },
        h2({ node, children, ...props }: any) {
          return <h2 className="text-3xl font-bold mt-6 mb-3" {...props}>{children}</h2>
        },
        h3({ node, children, ...props }: any) {
          return <h3 className="text-2xl font-bold mt-4 mb-2" {...props}>{children}</h3>
        },
        // Handle lists
        ul({ node, children, ...props }: any) {
          return <ul className="list-disc list-inside mb-4 space-y-2" {...props}>{children}</ul>
        },
        ol({ node, children, ...props }: any) {
          return <ol className="list-decimal list-inside mb-4 space-y-2" {...props}>{children}</ol>
        },
        li({ node, children, ...props }: any) {
          return <li className="ml-4" {...props}>{children}</li>
        },
        // Handle blockquotes
        blockquote({ node, children, ...props }: any) {
          return (
            <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-700" {...props}>
              {children}
            </blockquote>
          )
        },
        // Handle links
        a({ node, children, ...props }: any) {
          return (
            <a className="text-blue-600 hover:text-blue-800 underline" {...props}>
              {children}
            </a>
          )
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

