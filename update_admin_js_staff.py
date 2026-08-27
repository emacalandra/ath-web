import sys

filepath = r'c:\Users\Emanu\OneDrive\Documentos\prueba de pagina ath\admin.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

staff_logic = '''
    /* ==========================================================================
       MÓDULO 7: GESTIÓN DE STAFF
       ========================================================================== */
    function cargarTablaStaff() {
        const container = document.getElementById('adminStaffList');
        if (!container) return;

        if (!window.DBHits || !window.DBHits.getStaffRaw) return;
        const staff = window.DBHits.getStaffRaw();
        container.innerHTML = '';

        if (staff.length === 0) {
            container.innerHTML = '<div style="color:#94A3B8; text-align:center; padding: 20px;">No hay miembros del staff registrados.</div>';
            return;
        }

        staff.forEach(s => {
            const card = document.createElement('div');
            card.style.cssText = 'background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 12px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; gap: 12px;';
            
            const avatar = s.foto ? s.foto : 'assets/avatar.png';
            
            card.innerHTML = 
                <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                    <img src="" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid var(--color-ath-orange);" onerror="this.src='assets/avatar.png'">
                    <div>
                        <div style="font-weight: 700; color: #FFF; font-size: 0.95rem;"></div>
                        <div style="color: var(--color-ath-orange); font-size: 0.75rem;"></div>
                    </div>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="btn-edit-staff" data-id="" style="background: rgba(59, 130, 246, 0.15); color: #60A5FA; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer;"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn-del-staff" data-id="" style="background: rgba(239, 68, 68, 0.15); color: #EF4444; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer;"><i class="fa-solid fa-trash"></i></button>
                </div>
            ;
            container.appendChild(card);
        });

        // Eventos de botones
        document.querySelectorAll('.btn-edit-staff').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.getAttribute('data-id');
                const s = staff.find(x => x.id === id);
                if (s) {
                    document.getElementById('staffId').value = s.id;
                    document.getElementById('staffName').value = s.nombre;
                    document.getElementById('staffRole').value = s.rol;
                    document.getElementById('staffDesc').value = s.desc;
                    document.getElementById('staffPhoto').value = s.foto || '';
                    document.getElementById('staffFormTitle').innerHTML = '<i class="fa-solid fa-pen" style="color:var(--color-ath-orange);"></i> Editar Miembro';
                    document.getElementById('btnCancelStaff').style.display = 'flex';
                }
            });
        });

        document.querySelectorAll('.btn-del-staff').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (confirm('¿Estás seguro de eliminar a este miembro del staff?')) {
                    const id = btn.getAttribute('data-id');
                    window.DBHits.eliminarMiembroStaff(id);
                    cargarTablaStaff();
                }
            });
        });
    }

    const formStaffAdmin = document.getElementById('formStaffAdmin');
    if (formStaffAdmin) {
        formStaffAdmin.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('staffId').value;
            const data = {
                nombre: document.getElementById('staffName').value.trim(),
                rol: document.getElementById('staffRole').value.trim(),
                desc: document.getElementById('staffDesc').value.trim(),
                foto: document.getElementById('staffPhoto').value.trim()
            };

            if (id) {
                window.DBHits.actualizarMiembroStaff(id, data);
                alert('Staff actualizado con éxito.');
            } else {
                window.DBHits.agregarMiembroStaff(data);
                alert('Staff agregado con éxito.');
            }

            formStaffAdmin.reset();
            document.getElementById('staffId').value = '';
            document.getElementById('staffFormTitle').textContent = 'Nuevo Miembro del Staff';
            document.getElementById('btnCancelStaff').style.display = 'none';
            cargarTablaStaff();
        });

        const btnCancelStaff = document.getElementById('btnCancelStaff');
        if (btnCancelStaff) {
            btnCancelStaff.addEventListener('click', () => {
                formStaffAdmin.reset();
                document.getElementById('staffId').value = '';
                document.getElementById('staffFormTitle').textContent = 'Nuevo Miembro del Staff';
                btnCancelStaff.style.display = 'none';
            });
        }
    }
'''

if 'MÓDULO 7: GESTIÓN DE STAFF' not in js:
    # Insert at the end before the last closing brace
    # Actually wait, admin.js might just be one big DOMContentLoaded block or IIFE.
    # We will just append it if not found, but it might need to go inside the listener.
    # The last line of admin.js is usually:
    #     });
    # }
    js = js + '\n' + staff_logic

    # Let's fix the append to be inside DOMContentLoaded if necessary.
    # Searching for cargarTablaStaff();
    js = js.replace('cargarTablaUsuarios();', 'cargarTablaUsuarios();\n        if (typeof cargarTablaStaff === "function") cargarTablaStaff();')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(js)
    
print("Updated admin.js")