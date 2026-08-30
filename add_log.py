with open('db.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Add logs to getActiveUser to see what's happening
old_func = '''
                    if (dbUser.role !== userObj.role || dbUser.nombre !== userObj.nombre || dbUser.email !== userObj.email) {
                        this.saveActiveUserSession(dbUser);
                        return dbUser;
                    }
'''
new_func = '''
                    if (dbUser.role !== userObj.role || dbUser.nombre !== userObj.nombre || dbUser.email !== userObj.email) {
                        console.log("DBHITS: Sincronizando sesion. Rol antiguo:", userObj.role, "Rol nuevo:", dbUser.role);
                        this.saveActiveUserSession(dbUser);
                        return dbUser;
                    }
'''
if 'DBHITS: Sincronizando' not in js:
    js = js.replace(old_func.strip(), new_func.strip())
    with open('db.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print("Added logging to db.js")