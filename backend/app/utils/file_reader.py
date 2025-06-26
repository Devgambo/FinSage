import os
from pathlib import Path

def read_files_in_folder(main_folder_path="../../resources/data"):
    md_files_data = []
    
    print(f"Reading files in folder: {main_folder_path}")
    # Convert relative path to absolute path
    if not os.path.isabs(main_folder_path):
        current_dir = os.path.dirname(os.path.abspath(__file__))
        main_folder_path = os.path.abspath(os.path.join(current_dir, main_folder_path))
    
    if not os.path.exists(main_folder_path):
        raise FileNotFoundError(f"Data directory not found at: {main_folder_path}")

    for subfolder, _, files in os.walk(main_folder_path):
        for file in files:
            try:
                file_path = os.path.join(subfolder, file)
                
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()

                md_files_data.append({
                    'subfolder': os.path.basename(subfolder),
                    'file_name': file,
                    'content': content
                })
            except Exception as e:
                print(f"Error reading file {file}: {str(e)}")
                continue

    if not md_files_data:
        raise ValueError("No files were found or could be read in the specified directory")

    return md_files_data