import sys
import glob

def check_encoding_issues():
    files = glob.glob('*.html') + glob.glob('*.js')
    for f in files:
        try:
            with open(f, 'r', encoding='utf-8') as file:
                content = file.read()
                if '\ufffd' in content:
                    print(f"Found U+FFFD (Replacement Character) in {f}")
                if 'Ã³' in content or 'Ã¡' in content or 'Ã©' in content or 'Ã' in content:
                    print(f"Found Mojibake (UTF-8 double encoded) in {f}")
        except Exception as e:
            print(f"Error reading {f}: {e}")

check_encoding_issues()