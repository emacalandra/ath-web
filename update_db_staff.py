import sys

filepath = r'c:\Users\Emanu\OneDrive\Documentos\prueba de pagina ath\db.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

# Add to constants
if 'const STAFF_STORAGE_KEY' not in js:
    js = js.replace('const BOOKINGS_STORAGE_KEY = \'ath_bookings_db\';', "const BOOKINGS_STORAGE_KEY = 'ath_bookings_db';\nconst STAFF_STORAGE_KEY = 'ath_staff_db';")

# Add staff functions
staff_funcs = '''
    // ==========================================
    // STAFF & EQUIPO
    // ==========================================
    getStaffRaw() {
        try {
            let data = JSON.parse(localStorage.getItem(STAFF_STORAGE_KEY));
            if (!Array.isArray(data) || data.length === 0) {
                // Seed inicial
                data = [
                    { id: "1", nombre: "Emanuel Calandra", rol: "Director & Profe Principal", desc: "Coordinador general de la academia con más de 10 años de experiencia.", foto: "" },
                    { id: "2", nombre: "Carlos Gómez", rol: "Encargado de Mantenimiento", desc: "Responsable del cuidado integral de las canchas e instalaciones.", foto: "" },
                    { id: "3", nombre: "Lucía Martínez", rol: "Profesora de Escuela Formativa", desc: "Especialista en tenis infantil y desarrollo de menores.", foto: "" }
                ];
                this.saveStaffRaw(data);
            }
            return data;
        } catch {
            return [];
        }
    }

    saveStaffRaw(data) {
        localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(data));
        this._notifyCmsChange('staff');
    }

    agregarMiembroStaff(data) {
        const staff = this.getStaffRaw();
        const newStaff = {
            id: Date.now().toString(),
            nombre: data.nombre,
            rol: data.rol,
            desc: data.desc,
            foto: data.foto || ''
        };
        staff.push(newStaff);
        this.saveStaffRaw(staff);
        return newStaff;
    }

    actualizarMiembroStaff(id, data) {
        const staff = this.getStaffRaw();
        const index = staff.findIndex(s => s.id === id);
        if (index !== -1) {
            staff[index] = { ...staff[index], ...data };
            this.saveStaffRaw(staff);
            return staff[index];
        }
        throw new Error("Staff no encontrado");
    }

    eliminarMiembroStaff(id) {
        let staff = this.getStaffRaw();
        staff = staff.filter(s => s.id !== id);
        this.saveStaffRaw(staff);
    }
'''

if 'getStaffRaw()' not in js:
    # insert before getClubConfig()
    search = '    // ==========================================\n    // CONFIGURACIÓN DEL CLUB'
    if search in js:
        js = js.replace(search, staff_funcs + '\n' + search)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(js)
print("Updated db.js")