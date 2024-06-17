// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{collections::HashMap, io::Read};

use reqwest::blocking::get;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_forwarded_link(domain: &str) -> Result<String, String> {
    // URL of the raw data
    let url = "https://raw.githubusercontent.com/SujalChoudhari/WebBrowser/main/res/dns.md";
    
    // Fetch the data from the URL
    let response = get(url).map_err(|err| err.to_string())?;
    let mut content = String::new();
    response.take(10_000).read_to_string(&mut content).map_err(|err| err.to_string())?;
    
    // Parse the data into a HashMap
    let mut map: HashMap<String, String> = HashMap::new();
    for line in content.lines() {
        let parts: Vec<&str> = line.split_whitespace().collect();
        if parts.len() == 2 {
            map.insert(parts[0].to_string(), parts[1].to_string());
        }
    }
    
    // Find and return the forwarded link
    map.get(domain).cloned().ok_or_else(|| "Domain not found".to_string())
}


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![get_forwarded_link])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
