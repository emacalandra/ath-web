with open('db.js', 'r', encoding='utf-8') as f:
    js = f.read()

old_func = '''
                    if (dbUser.role !== userObj.role || dbUser.nombre !== userObj.nombre || dbUser.email !== userObj.email) {
                        console.log("DBHITS: Sincronizando sesion. Rol antiguo:", userObj.role, "Rol nuevo:", dbUser.role);
                        this.saveActiveUserSession(dbUser);
                        return dbUser;
                    }
'''
new_func = '''
                    if (dbUser.role !== userObj.role || dbUser.nombre !== userObj.nombre || dbUser.email !== userObj.email) {
                        console.log("DBHITS: Sincronizando sesion. Rol antiguo:", userObj.role, "Rol nuevo:", dbUser.role);
                        this.saveActiveUserSession(dbUser);
                        if (typeof window !== 'undefined') window.__ath_role_changed = true;
                        return dbUser;
                    }
'''
if 'window.__ath_role_changed' not in js:
    js = js.replace(old_func.strip(), new_func.strip())
    with open('db.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print("Patched db.js with reload flag")