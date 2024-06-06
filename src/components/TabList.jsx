import React from "react";

const TabList = ({ tabs, activeTab, setActiveTab, removeTab, addTab }) => {
    return (
        <div className="tabs mb-4 flex">
            {tabs.map(tab => (
                <div
                    key={tab.id}
                    className={`tab ml-4 btn ${tab.id === activeTab ? "tab-active" : ""}`}
                    onClick={() => setActiveTab(tab.id)}
                >
                    {tab.name ? tab.name : "New Tab"}
                    <button
                        className="close-tab ml-2 text-red-600"
                        onClick={(e) => {
                            e.stopPropagation();
                            removeTab(tab.id);
                        }}
                    >
                        x
                    </button>
                </div>
            ))}
            <button className="btn btn-primary ml-4" onClick={addTab}>
                +
            </button>
        </div>
    );
};

export default TabList;
