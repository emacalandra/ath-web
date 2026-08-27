with open('styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

old_block = '''
/* Responsive Notifications Fix */
@media (max-width: 576px) {
    #notificationDropdownMenu {
        width: 90vw !important;
        right: -60px !important; /* Offset to center relative to bell icon */
        max-width: 320px;
    }
}
'''
new_block = '''
/* Responsive Notifications Fix */
@media (max-width: 768px) {
    #notificationDropdownMenu {
        position: fixed !important;
        top: 75px !important;
        right: 5vw !important;
        left: 5vw !important;
        width: 90vw !important;
        max-width: none !important;
        box-shadow: 0 10px 40px rgba(0,0,0,0.8) !important;
    }
}
'''

if old_block in css:
    css = css.replace(old_block, new_block)
    with open('styles.css', 'w', encoding='utf-8') as f:
        f.write(css)
    print("Replaced with fixed position")
else:
    print("Old block not found!")