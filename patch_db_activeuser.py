with open('db.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace getActiveUser implementation
old_func = '''
    getActiveUser() {
        try {
            const stored = localStorage.getItem('ath_active_user');
            if (stored) {
                const userObj = JSON.parse(stored);
                if (userObj && userObj.id) return userObj;
            }
        } catch (e) {}

        // Fallback de persistencia para protocolo local file:/// (Explorador de Windows)
        try {
            return window.athActiveUserGlobal || null;
        } catch(e) {}
        return null;
    }
'''

new_func = '''
    getActiveUser() {
        let userObj = null;
        try {
            const stored = localStorage.getItem('ath_active_user');
            if (stored) {
                userObj = JSON.parse(stored);
            }
        } catch (e) {}

        if (!userObj || !userObj.id) {
            try { userObj = window.athActiveUserGlobal || null; } catch(e) {}
        }
        
        // Sincronizar siempre con la base de datos de usuarios para obtener el rol real actualizado
        if (userObj && userObj.id) {
            try {
                const users = this.getUsersRaw();
                const dbUser = users.find(u => u.id === userObj.id || String(u.id) === String(userObj.id));
                if (dbUser) {
                    // Actualizar la sesin si hay cambios
                    if (dbUser.role !== userObj.role || dbUser.nombre !== userObj.nombre || dbUser.email !== userObj.email) {
                        this.saveActiveUserSession(dbUser);
                        return dbUser;
                    }
                    return userObj;
                }
            } catch(e) {}
        }
        return userObj;
    }
'''

if 'Sincronizar siempre con la base de datos de usuarios' not in content:
    content = content.replace(old_func.strip(), new_func.strip())
    with open('db.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("db.js updated")