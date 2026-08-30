# Let's simulate the logic
userObj = {'id': '1', 'role': 'usuario'}
dbUser = {'id': '1', 'role': 'admin'}

if dbUser['role'] != userObj['role']:
    print('Difference detected, updating session...')
else:
    print('No difference detected.')