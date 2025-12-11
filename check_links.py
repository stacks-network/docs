import os
import re
from pathlib import Path
import urllib.parse

def check_links(root_dir):
    # Match [text](link) or [text]: link
    link_pattern = re.compile(r'\[([^\]]+)\]\(([^)]+)\)')
    
    root_path = Path(root_dir).resolve()
    broken_links = []
    
    print(f"Scanning for broken links in {root_path}...")
    
    for markdown_file in root_path.rglob('*.md'):
        # Skip node_modules or .git
        if '.git' in markdown_file.parts or 'node_modules' in markdown_file.parts:
            continue
            
        try:
            content = markdown_file.read_text()
        except Exception as e:
            print(f"Could not read {markdown_file}: {e}")
            continue
            
        # Find all lines with links
        lines = content.split('\n')
        for line_num, line in enumerate(lines, 1):
            matches = link_pattern.findall(line)
            for text, link in matches:
                # Ignore external links, anchors, and mailto
                if link.startswith(('http', 'https', 'mailto:', '#', '<')):
                    continue
                
                # split anchor if present
                url_parts = link.split('#')
                file_part = url_parts[0]
                
                if not file_part:
                    # just an anchor on same page
                    continue
                
                # Resolve relative path
                try:
                    # Decode URL encoding (e.g. %20 -> space)
                    file_part = urllib.parse.unquote(file_part)
                    
                    target_path = (markdown_file.parent / file_part).resolve()
                    
                    if not target_path.exists():
                        # Check if it might be a directory with README.md implicit
                        if not target_path.exists() and not file_part.endswith('.md'):
                             target_path_md = (markdown_file.parent / (file_part + ".md")).resolve()
                             if target_path_md.exists():
                                 continue
                        
                        relative_path = markdown_file.relative_to(root_path)
                        broken_links.append({
                            'file': str(relative_path),
                            'line': line_num,
                            'text': text,
                            'target': link,
                            'resolved': str(target_path)
                        })
                except Exception as e:
                    print(f"Error checking link {link} in {markdown_file}: {e}")

    return broken_links

if __name__ == "__main__":
    broken = check_links(".")
    
    if broken:
        print(f"\nFound {len(broken)} broken links:")
        with open('broken_links_report.csv', 'w') as f:
            f.write("File,Line,Link Text,Target,Resolved Path\n")
            for link in broken:
                print(f"{link['file']}:{link['line']} -> {link['target']}")
                f.write(f"{link['file']},{link['line']},{link['text']},{link['target']},{link['resolved']}\n")
    else:
        print("\nNo broken links found!")
