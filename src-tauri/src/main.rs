// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use image::{self, Rgba};

#[tauri::command]
fn open_img(path: &str) -> (usize, usize, Vec<u8>) {
    let img = image::open(path).expect("Dimage");
    let width = img.width() as usize;
    let height = img.height() as usize;
    let img_src = img.into_rgba8();
    (width, height, img_src.to_vec())
}

#[tauri::command]
fn save_img(path: &str, width: u32, height: u32, data: Vec<u8>) {
    let img = image::ImageBuffer::<Rgba<u8>, Vec<u8>>::from_vec(width, height, data).unwrap();
    img.save(path).expect("error image");
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![open_img, save_img])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
