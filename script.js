const i18n = {
    de: {
        title: "💎 Prostone Master",
        base_values: "1. Basis Werte",
        base_eng: "Basis Energie",
        base_atk: "Basis Physischer Angriff",
        target: "2. Ziel & Einstellungen",
        target_eng: "Gewünschte Ziel-Energie",
        mode: "Methode",
        btn_calc: "🚀 Berechnen",
        res_best: "🏆 Beste Strategie für deine Einstellung:",
        res_stones_needed: "Benötigte Steine",
        res_total_cost: "Gesamtkosten",
        res_final_stats: "Endwerte",
        res_step_by_step: "Anleitung",
        step: "Schritt",
        take: "Nimm",
        fuse_to: "Fusioniere zu",
        table_strat: "Strategie",
        table_stones: "Basis Steine",
        table_cost: "Kosten",
        table_res: "End-Energie",
        suffix_stones: "er Stacks",
        lbl_glue: "Leime",
        lbl_dia: "Dias",
        unit_eng: "Energie",
        lbl_limit_glue: "Max. Leime (Leer = Egal)",
        lbl_prio_mat: "🪙 Steine sparen",
        lbl_prio_glue: "🧪 Leime sparen",
        slider_bal: "Balance",
        err_limit: "⚠️ Kein Ergebnis gefunden unter dem Leim-Limit!"
    },
    en: {
        title: "💎 Prostone Master",
        base_values: "1. Base Values",
        base_eng: "Base Energy",
        base_atk: "Base Phys. Atk",
        target: "2. Target & Settings",
        target_eng: "Target Energy",
        mode: "Method",
        btn_calc: "🚀 Calculate",
        res_best: "🏆 Best Strategy for your settings:",
        res_stones_needed: "Stones Needed",
        res_total_cost: "Total Cost",
        res_final_stats: "Final Stats",
        res_step_by_step: "Guide",
        step: "Step",
        take: "Take",
        fuse_to: "Fuse to",
        table_strat: "Strategy",
        table_stones: "Base Stones",
        table_cost: "Cost",
        table_res: "End Energy",
        suffix_stones: " stacks",
        lbl_glue: "Glues",
        lbl_dia: "Dias",
        unit_eng: "Energy",
        lbl_limit_glue: "Max Glues (Empty = Any)",
        lbl_prio_mat: "📦 Save Stones",
        lbl_prio_glue: "🧪 Save Glues",
        slider_bal: "Balance",
        err_limit: "⚠️ No strategy found within Glue limit!"
    },
    fr: {
        title: "💎 Maître Prostone",
        base_values: "1. Valeurs de Base",
        base_eng: "Énergie de Base",
        base_atk: "Attaque Phys. Base",
        target: "2. Cible & Réglages",
        target_eng: "Énergie Cible",
        mode: "Méthode",
        btn_calc: "🚀 Calculer",
        res_best: "🏆 Meilleure Stratégie:",
        res_stones_needed: "Pierres Requises",
        res_total_cost: "Coût Total",
        res_final_stats: "Stats Finales",
        res_step_by_step: "Guide",
        step: "Étape",
        take: "Prendre",
        fuse_to: "Fusionner vers",
        table_strat: "Stratégie",
        table_stones: "Pierres Base",
        table_cost: "Coût",
        table_res: "Énergie Fin",
        suffix_stones: " piles",
        lbl_glue: "Colles",
        lbl_dia: "Dias",
        unit_eng: "Énergie",
        lbl_limit_glue: "Max Colles (Vide = Tout)",
        lbl_prio_mat: "📦 Éco. Pierres",
        lbl_prio_glue: "🧪 Éco. Colles",
        slider_bal: "Balance",
        err_limit: "⚠️ Aucun résultat sous la limite de colle !"
    }
};

let curLang = 'de';

function changeLanguage() {
    curLang = document.getElementById('langSelect').value;
    const txt = i18n[curLang];

    document.getElementById('lbl_title').innerText = txt.title;
    document.getElementById('lbl_base_values').innerText = txt.base_values;
    document.getElementById('lbl_base_eng').innerText = txt.base_eng;
    document.getElementById('lbl_base_atk').innerText = txt.base_atk;
    document.getElementById('lbl_target').innerText = txt.target;
    document.getElementById('lbl_target_eng').innerText = txt.target_eng;
    document.getElementById('lbl_mode').innerText = txt.mode;
    document.getElementById('btn_calc').innerText = txt.btn_calc;
    document.getElementById('lbl_limit_glue').innerText = txt.lbl_limit_glue;
    document.getElementById('lbl_prio_mat').innerText = txt.lbl_prio_mat;
    document.getElementById('lbl_prio_glue').innerText = txt.lbl_prio_glue;
    
    updateSliderLabel();
    calculateOptimize();
}

function updateSliderLabel() {
    const val = document.getElementById('prioSlider').value;
    const txt = i18n[curLang];
    document.getElementById('lbl_slider_desc').innerText = `${txt.slider_bal}: ${100-val}% Material / ${val}% Cost`;
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

    const costLeime = isPremium ? (count - 1) : 0;
    const costDias = costLeime * 10;

    const resultEnergy = Math.floor(inputEnergy * rateEng);
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
    updateSliderLabel();
    
    const baseEng = parseInt(document.getElementById('baseEnergy').value);
    const baseVal = parseFloat(document.getElementById('baseValue').value);
    const target = parseInt(document.getElementById('targetEnergy').value);
    const isPremium = document.getElementById('fusionType').value === "1";
    
    // Inputs holen
    const sliderVal = parseInt(document.getElementById('prioSlider').value); // 0 (Steine) bis 100 (Leime)
    const maxGluesInput = document.getElementById('maxGlues').value;
    const maxGlues = maxGluesInput === "" ? Infinity : parseInt(maxGluesInput);

    const strategies = [2, 3, 4, 5, 6, 7, 8, 9, 10]; 
    let results = [];

    // 1. Alle Möglichkeiten berechnen
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
                totalLeime: totalLeime,
                totalDiamonds: totalDiamonds,
                finalEng: currentEng,
                finalVal: currentVal,
                steps: steps
            });
        }
    });

    // 2. Filtern nach Hard Limit (Max Glues)
    let validResults = results.filter(r => r.totalLeime <= maxGlues);

    if (validResults.length === 0) {
        // Falls nichts gefunden, UI Error anzeigen
        renderError(i18n[curLang].err_limit);
        return;
    }

    // 3. Score Berechnung basierend auf Slider
    // Wir müssen die Werte normalisieren, da Steine (z.B. 1000) und Leime (z.B. 50) unterschiedliche Skalen haben.
    
    // Finde Min/Max Werte im aktuellen Set
    let minStones = Math.min(...validResults.map(r => r.totalStones));
    let minLeime = Math.min(...validResults.map(r => r.totalLeime));
    // Vermeide Division durch Null
    if(minLeime === 0) minLeime = 1; 

    validResults.forEach(r => {
        // Wie viel schlechter ist dieser Wert als das theoretische Optimum?
        // 1.0 = Bester Wert, 2.0 = Doppelt so teuer
        let stoneScore = r.totalStones / minStones;
        let glueScore = (r.totalLeime === 0) ? 1 : (r.totalLeime / minLeime);

        // Gewichtung anwenden
        // Slider 0 -> 100% Stone Prio
        // Slider 100 -> 100% Glue Prio
        let weightGlue = sliderVal / 100;
        let weightStone = 1 - weightGlue;

        // Finaler Score (Niedriger ist besser)
        r.finalScore = (stoneScore * weightStone) + (glueScore * weightGlue);
    });

    // Sortieren nach Score (Niedrigster Score gewinnt)
    validResults.sort((a, b) => a.finalScore - b.finalScore);

    renderResults(validResults, isPremium);
}

function renderError(msg) {
    document.getElementById('resultsArea').innerHTML = `<div class='card' style='border-left:4px solid #cf6679'><h3>${msg}</h3></div>`;
}

function renderResults(results, isPremium) {
    const container = document.getElementById('resultsArea');
    const txt = i18n[curLang];
    const best = results[0];

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
        // Highlight für den Gewinner
        let style = (r === best) ? "background:rgba(3, 218, 198, 0.1); font-weight:bold;" : "";
        
        html += `<tr style="${style}">
                    <td>${r.strategy} ${txt.suffix_stones}</td>
                    <td>${r.totalStones.toLocaleString()}</td>
                    <td class="cost-glue">${r.totalLeime.toLocaleString()}</td>
                    <td>${r.finalEng}</td>
                 </tr>`;
    });
    
    html += `</table></div>`;
    container.innerHTML = html;
}

window.onload = function() {
    changeLanguage(); 
}
