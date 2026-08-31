require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Servir archivos estáticos del frontend (HTML, CSS, JS, etc.)
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

// 1. RUTA PARA GUARDAR HTML (CMS Visual)
app.post('/api/save-html', (req, res) => {
    try {
        const { filename, html } = req.body;
        if (!filename || filename.includes('..') || !filename.endsWith('.html')) {
            return res.status(400).json({ status: 'error', message: 'Nombre de archivo inválido' });
        }
        const filepath = path.join(__dirname, filename);
        fs.writeFileSync(filepath, html, 'utf8');
        res.json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// 2. RUTA PARA ENVIAR WHATSAPP (API META)
app.post('/api/send-whatsapp', async (req, res) => {
    try {
        const { usuarioNombre, canchaId, fecha, horaInicio, horaFin, destino } = req.body;
        
        // Mensaje de prueba (texto libre para ventana de 24hs)
        const mensaje_wa = `🎾 *NUEVA RESERVA ATH*\n\n👤 Cliente: ${usuarioNombre}\n🏟️ Cancha: ${canchaId}\n📅 Fecha: ${fecha}\n⏰ Horario: ${horaInicio} a ${horaFin} hs\n⚠️ Revisar en el Panel de Administración.`;

        const payload = {
            messaging_product: "whatsapp",
            to: destino,
            type: "text",
            text: { body: mensaje_wa }
        };

        const response = await fetch(`https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        
        if (!response.ok) throw new Error(data.error?.message || 'Error en la API de Meta');
        
        res.json({ status: 'success', meta: data });
    } catch (error) {
        console.error("Error enviando WhatsApp:", error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor Node.js ATH corriendo en http://localhost:${PORT}`);
});
