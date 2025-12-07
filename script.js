// --- LANGUAGE CONFIG ---
const i18n = {
    de: {
        title: "💎 Prostone Master",
        base_values: "1. Basis Werte",
        base_eng: "Basis Energie",
        base_atk: "Basis Physischer Angriff",
        target: "2. Ziel & Einstellungen",
        target_eng: "Gewünschte Ziel-Energie",
        mode: "Methode",
        sort: "Sortierung",
        btn_calc: "🚀 Berechnen",
        res_best: "🏆 Beste Strategie: Immer",
        res_stones_needed: "Benötigte Steine",
        res_total_cost: "Gesamtkosten",
        res_final_stats: "Endwerte",
        res_step_by_step: "Schritt-für-Schritt",
        step: "Schritt",
        take: "Nimm",
        fuse_to: "Fusioniere zu",
        table_strat: "Strategie",
        table_stones: "Basis Steine",
        table_cost: "Kosten",
        table_res: "End-Energie",
        suffix_stones: "er Stacks",
        opt_mat: "📦 Material (Steine)",
        opt_cost: "🧪 Kosten (Leime)",
        lbl_glue: "Leime",
        lbl_dia: "Dias",
        unit_eng: "Energie" // <-- NEU
    },
    en: {
        title: "💎 Prostone Master",
        base_values: "1. Base Values",
        base_eng: "Base Energy",
        base_atk: "Base Phys. Atk",
        target: "2. Target & Settings",
        target_eng: "Target Energy",
        mode: "Method",
        sort: "Sorting",
        btn_calc: "🚀 Calculate",
        res_best: "🏆 Best Strategy: Always",
        res_stones_needed: "Stones Needed",
        res_total_cost: "Total Cost",
        res_final_stats: "Final Stats",
        res_step_by_step: "Step-by-Step",
        step: "Step",
        take: "Take",
        fuse_to: "Fuse to",
        table_strat: "Strategy",
        table_stones: "Base Stones",
        table_cost: "Cost",
        table_res: "End Energy",
        suffix_stones: " stacks",
        opt_mat: "📦 Material (Stones)",
        opt_cost: "🧪 Cost (Glues)",
        lbl_glue: "Glues",
        lbl_dia: "Dias",
        unit_eng: "Energy" // <-- NEU
    },
    fr: {
        title: "💎 Maître Prostone",
        base_values: "1. Valeurs de Base",
        base_eng: "Énergie de Base",
        base_atk: "Attaque Phys. Base",
        target: "2. Cible & Réglages",
        target_eng: "Énergie Cible",
        mode: "Méthode",
        sort: "Tri",
        btn_calc: "🚀 Calculer",
        res_best: "🏆 Meilleure Stratégie: Toujours",
        res_stones_needed: "Pierres Requises",
        res_total_cost: "Coût Total",
        res_final_stats: "Stats Finales",
        res_step_by_step: "Guide Étape",
        step: "Étape",
        take: "Prendre",
        fuse_to: "Fusionner vers",
        table_strat: "Stratégie",
        table_stones: "Pierres Base",
        table_cost: "Coût",
        table_res: "Énergie Fin",
        suffix_stones: " piles",
        opt_mat: "📦 Matériel (Pierres)",
        opt_cost: "🧪 Coût (Colles)",
        lbl_glue: "Colles",
        lbl_dia: "Dias",
        unit_eng: "Énergie" // <-- NEU
    }
};

let curLang = 'de';

function changeLanguage() {
    curLang = document.getElementById('langSelect').value;
    const txt = i18n[curLang];

    // IDs mappen
    document.getElementById('lbl_title').innerText = txt.title;
    document.getElementById('lbl_base_values').innerText = txt.base_values;
    document.getElementById('lbl_base_eng').innerText = txt.base_eng;
    document.getElementById('lbl_base_atk').innerText = txt.base_atk;
    document.getElementById('lbl_target').innerText = txt.target;
    document.getElementById('lbl_target_eng').innerText = txt.target_eng;
    document.getElementById('lbl_mode').innerText = txt.mode;
    document.getElementById('lbl_sort').innerText = txt.sort;
    document.getElementById('btn_calc').innerText = txt.btn_calc;
    
    // Dropdown Options aktualisieren
    const sortSelect = document.getElementById('sortType');
    sortSelect.options[0].text = txt.opt_mat;
    sortSelect.options[1].text = txt.opt_cost;

    calculateOptimize();
}

// --- LOGIC ---
const RATES = {
    standard: {
        val: [0, 0, 1.15, 1.235, 1.32, 1.37, 1.42, 1.47, 1.52, 1.545, 1.576],
        eng: [0, 0, 1.14, 1.22, 1.295, 1.34, 1.387, 1.43, 1.475, 1.50, 1.526]
    },
    premium: {
        val: [0, 0, 1.19, 1.30, 1.415, 1.48, 1.548, 1.615, 1.683, 1.722, 1.762],
        eng: [0, 0, 1.18, 1.28, 1.387, 1.45, 1.51, 1.572, 1.635, 1.673, 1.706]
    }
};

function simulateFusion(inputEnergy, inputValue, count, isPremium) {
    if (count < 2 || count > 10) return null;

    const typeKey = isPremium ? 'premium' : 'standard';
    const rateVal = RATES[typeKey].val[count];
    const rateEng = RATES[typeKey].eng[count];

    // --- KOSTEN LOGIK ---
    // Premium: 1 Leim pro Fusionsvorgang? Nein:
    // User Info: "Anstatt 10 Diamanten bei 2 Prostones, zahlt man einen Leim."
    // 2 Steine = 1 Leim. 3 Steine = 2 Leime ... 10 Steine = 9 Leime.
    // Formel: count - 1
    
    const costLeime = isPremium ? (count - 1) : 0;
    const costDias = costLeime * 10;

    const resultEnergy = Math.floor(inputEnergy * rateEng);
    
    // 1 Decimal Cutoff
    let rawVal = inputValue * rateVal;
    const resultValue = Math.floor(rawVal * 10) / 10;

    return {
        energy: resultEnergy,
        value: resultValue,
        costLeime: costLeime,
        costDias: costDias
    };
}

function calculateOptimize() {
    const baseEng = parseInt(document.getElementById('baseEnergy').value);
    const baseVal = parseFloat(document.getElementById('baseValue').value);
    const target = parseInt(document.getElementById('targetEnergy').value);
    const isPremium = document.getElementById('fusionType').value === "1";
    const sortMode = document.getElementById('sortType').value; 

    const strategies = [2, 3, 4, 5, 6, 7, 8, 9, 10]; 
    let results = [];

    strategies.forEach(stackSize => {
        let currentEng = baseEng;
        let currentVal = baseVal;
        let totalBaseStones = 1;
        
        let totalDiamonds = 0;
        let totalLeime = 0;
        
        let steps = [];
        let iterations = 0;

        while(currentEng < target && iterations < 25) {
            iterations++;
            
            let fusionResult = simulateFusion(currentEng, currentVal, stackSize, isPremium);
            
            // Rekursive Kostenberechnung für Baumstruktur
            totalDiamonds = (totalDiamonds * stackSize) + fusionResult.costDias;
            totalLeime = (totalLeime * stackSize) + fusionResult.costLeime;
            
            totalBaseStones = totalBaseStones * stackSize;

            steps.push({
                step: iterations,
                inputs: stackSize,
                inputEng: currentEng,
                outputEng: fusionResult.energy,
                stepLeime: fusionResult.costLeime,
                currentTotalLeime: totalLeime
            });

            currentEng = fusionResult.energy;
            currentVal = fusionResult.value;
        }

        if(currentEng >= target) {
            results.push({
                strategy: stackSize,
                totalStones: totalBaseStones,
                totalDiamonds: totalDiamonds,
                totalLeime: totalLeime,
                finalEng: currentEng,
                finalVal: currentVal,
                steps: steps
            });
        }
    });

    renderResults(results, isPremium, sortMode);
}

function renderResults(results, isPremium, sortMode) {
    const container = document.getElementById('resultsArea');
    const txt = i18n[curLang];
    container.innerHTML = "";

    if(results.length === 0) {
        container.innerHTML = `<div class='card'><h3>❌ Ziel nicht erreichbar (Limit: 25 Stufen)</h3></div>`;
        return;
    }

    // --- SORTIERUNG ---
    if(sortMode === 'cost') {
        results.sort((a, b) => {
            if(a.totalLeime === b.totalLeime) return a.totalStones - b.totalStones;
            return a.totalLeime - b.totalLeime;
        });
    } else {
        results.sort((a, b) => a.totalStones - b.totalStones);
    }
    
    const best = results[0];

    // HTML Generierung
    let html = `
        <div class="card result-best">
            <h2>${txt.res_best} ${best.strategy} ${txt.suffix_stones}</h2>
            
            <div class="stat-grid">
                <div class="stat-box">
                    <div class="stat-val">${best.totalStones.toLocaleString()}</div>
                    <div class="stat-label">${txt.res_stones_needed}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-val">
                        <span class="cost-glue">${best.totalLeime.toLocaleString()} ${txt.lbl_glue}</span><br>
                        <span class="cost-dia">(${best.totalDiamonds.toLocaleString()} ${txt.lbl_dia})</span>
                    </div>
                    <div class="stat-label">${txt.res_total_cost}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-val">⚡ ${best.finalEng} | ⚔️ ${best.finalVal}</div>
                    <div class="stat-label">${txt.res_final_stats}</div>
                </div>
            </div>
            
            <h3>${txt.res_step_by_step}:</h3>
            <ul class="step-list">
    `;

    best.steps.forEach(s => {
        html += `
            <li class="step-item">
                <strong>${txt.step} ${s.step}:</strong> 
                ${txt.take} ${s.inputs}x <small>(${s.inputEng} ${txt.unit_eng})</small> 
                ➔ ${txt.fuse_to} <strong>${s.outputEng} ${txt.unit_eng}</strong>
                <br>
                <small style="color:var(--muted)">
                   ${txt.table_cost}: <span class="cost-glue">${s.stepLeime} ${txt.lbl_glue}</span> 
                   (Total: ${s.currentTotalLeime.toLocaleString()})
                </small>
            </li>
        `;
    });

    html += `</ul></div>`;

    // Vergleichstabelle
    html += `<div class="card"><h3>${txt.table_strat} (Vergleich)</h3>
             <table>
                <tr>
                    <th>${txt.table_strat}</th>
                    <th>${txt.table_stones}</th>
                    <th>${txt.table_cost} (${txt.lbl_glue})</th>
                    <th>${txt.table_res}</th>
                </tr>`;
    
    results.forEach(r => {
        html += `<tr>
                    <td>${r.strategy} ${txt.suffix_stones}</td>
                    <td>${r.totalStones.toLocaleString()}</td>
                    <td class="cost-glue">${r.totalLeime.toLocaleString()}</td>
                    <td>${r.finalEng}</td>
                 </tr>`;
    });
    
    html += `</table></div>`;

    container.innerHTML = html;
}

// Init beim Laden
window.onload = function() {
    changeLanguage(); // Setzt Text und startet erste Berechnung
}