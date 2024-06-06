import React from "react";
import ReactMarkdown from "react-markdown";
import NavigationBar from "./NavigationBar";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";


const TabContent = ({
    tab,
    handleNavigate,
    navigateBackward,
    navigateForward,
    activeTab,
    setTabs,
    tabs
}) => {
    const renderers = {
        a: ({ href, children }) => (
            <a href={href} className="text-blue-500 hover:underline">
                {children}
            </a>
        ),
        h1: ({ children }) => (
            <h1 className="text-5xl font-bold mb-4">{children}</h1>
        ),
        h2: ({ children }) => (
            <h2 className="text-4xl font-semibold mb-3">{children}</h2>
        ),
        h3: ({ children }) => (
            <h3 className="text-3xl font-semibold mb-2">{children}</h3>
        ),
        h4: ({ children }) => (
            <h4 className="text-md font-semibold mb-1">{children}</h4>
        ),
        p: ({ children }) => (
            <p className="mb-2">{children}</p>
        ),
        img: ({ src, children }) => (
            <img src={src} className=" m-4 rounded-xl max-w-[90vw] mx-auto">
                {children}
            </img>
        ), table: ({ children }) => (
            <table className="table-auto w-full border-collapse border border-gray-300">
                {children}
            </table>
        ),
        th: ({ children }) => (
            <th className="border border-gray-300 px-4 py-2 bg-gray-900">{children}</th>
        ),
        td: ({ children }) => (
            <td className="border border-gray-300 px-4 py-2">{children}</td>
        ),
        li : ({children}) => (
            <li>{children}</li>
        )

    };

    return (
        <div className={`tab-content ${tab.id === activeTab ? "block" : "hidden"}`}>
            <NavigationBar
                handleNavigate={handleNavigate}
                navigateBackward={navigateBackward}
                navigateForward={navigateForward}
                setTabs={setTabs}
                tabs={tabs}
                tab={tab}
            />
            {tab.url && !tab.url.endsWith(".md") && (
                <iframe
                    src={tab.url}
                    title={`webview-${tab.id}`}
                    className="w-full h-[81vh] rounded-2xl"
                ></iframe>
            )}
            {tab.url && tab.url.endsWith(".md") && (
                <div className="markdown-content w-full h-[80vh] p-4 overflow-auto">
                    <ReactMarkdown components={renderers} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                        {tab.content}
                    </ReactMarkdown>
                </div>
            )}
        </div>
    );
};

export default TabContent;
