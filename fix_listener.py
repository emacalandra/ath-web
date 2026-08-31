with open('db.js', 'r', encoding='utf-8') as f:
    js = f.read()

import re
old_listener = '''            // Listener Tiempo Real: Pricing y Horarios
            onSnapshot(doc(this.db, "ath_core", "pricing"), (docSnap) => {
                const localData = JSON.parse(localStorage.getItem(PRICING_STORAGE_KEY)) || null;
                if (docSnap.exists()) {
                    const cloudData = docSnap.data().pricing;
                    if (JSON.stringify(localData) !== JSON.stringify(cloudData)) {
                        localStorage.setItem(PRICING_STORAGE_KEY, JSON.stringify(cloudData));
                        if (typeof window.renderWidgetDayTimelineGrid === 'function') window.renderWidgetDayTimelineGrid();
                        if (typeof window.calculateAndVerifyMinuteByMinute === 'function') window.calculateAndVerifyMinuteByMinute();
                    }
                } else if (localData) {
                    this.setDoc(doc(this.db, "ath_core", "pricing"), { pricing: localData }).catch(e => console.warn(e));
                }
            });'''

new_listener = '''            // Listener Tiempo Real: Pricing y Horarios
            onSnapshot(doc(this.db, "ath_core", "pricing"), (docSnap) => {
                try {
                    const localStr = localStorage.getItem(PRICING_STORAGE_KEY);
                    let localData = null;
                    if (localStr && localStr !== 'undefined') localData = JSON.parse(localStr);

                    if (docSnap.exists()) {
                        const cloudData = docSnap.data().pricing;
                        if (JSON.stringify(localData) !== JSON.stringify(cloudData)) {
                            localStorage.setItem(PRICING_STORAGE_KEY, JSON.stringify(cloudData));
                            if (typeof window.renderWidgetDayTimelineGrid === 'function') window.renderWidgetDayTimelineGrid();
                            if (typeof window.calculateAndVerifyMinuteByMinute === 'function') window.calculateAndVerifyMinuteByMinute();
                        }
                    } else if (localData) {
                        this.setDoc(doc(this.db, "ath_core", "pricing"), { pricing: localData }).catch(e => console.warn(e));
                    }
                } catch(e) { console.warn("Error en listener pricing:", e); }
            });'''

js = js.replace(old_listener, new_listener)

with open('db.js', 'w', encoding='utf-8') as f:
    f.write(js)