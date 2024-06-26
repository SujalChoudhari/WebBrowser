import React, { useRef } from "react";
import { invoke } from '@tauri-apps/api/tauri';

const NavigationBar = ({
    handleNavigate,
    navigateBackward,
    navigateForward,
    tab,
    activeTab,
    setTabs,
    tabs
}) => {
    const urlInputRef = useRef(null);

    const handleInputChange = async () => {
        let newUrl = urlInputRef.current.value;
        let redirectedUrl = newUrl;
        if (newUrl.startsWith('svc://')) {
            try {
                redirectedUrl = await invoke('get_forwarded_link', { domain: newUrl });
            } catch (error) {
                console.error(`Error fetching redirected URL: ${error}`);
            }
        }
        setTabs(tabs.map(t => (t.id === tab.id ? { ...t, name: newUrl, url: redirectedUrl } : t)));
    };

    return (
        <form onSubmit={(e) => handleNavigate(e, tab.id)} className="flex mb-4">
            <button
                type="button"
                className="btn btn-neutral mr-2"
                onClick={() => navigateBackward(tab.id)}
                disabled={tab.historyIndex <= 0}
            >
                &larr;
            </button>
            <button
                type="button"
                className="btn btn-neutral mr-2"
                onClick={() => navigateForward(tab.id)}
                disabled={tab.historyIndex >= tab.history.length - 1}
            >
                &rarr;
            </button>
            <input
                type="text"
                name="url"
                ref={urlInputRef}
                defaultValue={tab.id === activeTab ? tab.url : ""}
                placeholder="Enter a URL..."
                className="input input-bordered w-full mr-2"
                onChange={handleInputChange}
            />
            <button type="submit" className="btn btn-primary">
                Go
            </button>
        </form>
    );
};

export default NavigationBar;
