with open('styles.css', 'a', encoding='utf-8') as f:
    f.write('''

/* Responsive Notifications Fix */
@media (max-width: 576px) {
    #notificationDropdownMenu {
        width: 90vw !important;
        right: -60px !important; /* Offset to center relative to bell icon */
        max-width: 320px;
    }
}
''')
    print('Added media query for notificationDropdownMenu')