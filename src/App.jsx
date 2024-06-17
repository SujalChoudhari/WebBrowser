import { useState } from "react";
import TabList from "./components/TabList";
import TabContent from "./components/TabContent";
import "./App.css";

function App() {
  const [tabs, setTabs] = useState([{ id: 1, name: "", url: "", content: "", isMarkdown: false, history: [], historyIndex: -1 }]);
  const [activeTab, setActiveTab] = useState(1);

  const handleNavigate = async (e, id) => {
    e.preventDefault();
    // const newUrl = e.currentTarget.url.value;
    const newUrl = tabs[id - 1].url;
    const isMarkdown = newUrl.endsWith(".md");
    let content = "";

    if (isMarkdown) {
      const response = await fetch(newUrl);
      content = await response.text();
    }

    setTabs(tabs.map(tab => {
      if (tab.id === id) {
        const newHistory = tab.history.slice(0, tab.historyIndex + 1);
        newHistory.push(newUrl);
        return {
          ...tab,
          name: tab.name || newUrl,
          url: newUrl,
          content,
          isMarkdown,
          history: newHistory,
          historyIndex: newHistory.length - 1
        };
      }
      return tab;
    }));
  };

  const addTab = () => {
    const newId = Math.max(...tabs.map(tab => tab.id)) + 1;
    if (newId > 5) {
      return;
    }
    setTabs([...tabs, { id: newId, name: "", url: "", content: "", isMarkdown: false, history: [], historyIndex: -1 }]);
    setActiveTab(newId);
  };

  const removeTab = (id) => {
    if (tabs.length > 1) {
      setTabs(tabs.filter(tab => tab.id !== id));
      if (activeTab === id) {
        setActiveTab(tabs[0].id);
      }
    }
  };

  const navigateBackward = (id) => {
    setTabs(tabs.map(tab => {
      if (tab.id === id && tab.historyIndex > 0) {
        const newIndex = tab.historyIndex - 1;
        const newUrl = tab.history[newIndex];
        const isMarkdown = newUrl.endsWith(".md");
        let content = newUrl;
        if (isMarkdown) {
          fetch(newUrl)
            .then(response => response.text())
            .then(text => {
              setTabs(tabs.map(t => (t.id === id ? { ...t, content: text } : t)));
            });
        }
        return {
          ...tab,
          url: newUrl,
          historyIndex: newIndex,
          content: isMarkdown ? content : ""
        };
      }
      return tab;
    }));
  };

  const navigateForward = (id) => {
    setTabs(tabs.map(tab => {
      if (tab.id === id && tab.historyIndex < tab.history.length - 1) {
        const newIndex = tab.historyIndex + 1;
        const newUrl = tab.history[newIndex];
        const isMarkdown = newUrl.endsWith(".md");
        let content = newUrl;
        if (isMarkdown) {
          fetch(newUrl)
            .then(response => response.text())
            .then(text => {
              setTabs(tabs.map(t => (t.id === id ? { ...t, content: text } : t)));
            });
        }
        return {
          ...tab,
          url: newUrl,
          isMarkdown,
          historyIndex: newIndex,
          content: isMarkdown ? content : ""
        };
      }
      return tab;
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <TabList tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} removeTab={removeTab} addTab={addTab} />
      {tabs.map(tab => (
        <TabContent
          key={tab.id}
          tab={tab}
          handleNavigate={handleNavigate}
          navigateBackward={navigateBackward}
          navigateForward={navigateForward}
          activeTab={activeTab}
          setTabs={setTabs}
          tabs={tabs}
        />
      ))}
    </div>
  );
}

export default App;
