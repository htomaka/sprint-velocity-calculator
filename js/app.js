const devCountInput = document.getElementById('devCount');
const sprintDaysInput = document.getElementById('sprintDays');
const devsContainer = document.getElementById('devs-container');
const resultDiv = document.getElementById('result');
const calcBtn = document.getElementById('calcBtn');

function renderDevRows() {
    const devCount = parseInt(devCountInput.value || '0', 10);
    devsContainer.innerHTML = '';
    
    for (let i = 1; i <= devCount; i++) {
        const row = document.createElement('div');
        row.className = 'flex items-center gap-3 text-sm';
        row.innerHTML = `
            <span class="w-20 text-slate-700 font-medium">Dev ${i}</span>
            <div class="flex items-center gap-2">
                <input
                    type="number"
                    min="0"
                    value="0"
                    step="0.5"
                    data-dev-index="${i}"
                    class="dev-absence w-24 rounded-lg border-slate-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <span class="text-xs text-slate-500">jours ouvrés</span>
            </div>
        `;
        devsContainer.appendChild(row);
    }
}

function calculateCapacity() {
    const velocity = parseFloat(document.getElementById('velocity').value || '0');
    const devCount = parseInt(devCountInput.value || '1', 10);
    const sprintDays = parseFloat(sprintDaysInput.value || '1');
    const buildPercent = parseFloat(document.getElementById('buildPercent').value || '0');

    const absenceInputs = document.querySelectorAll('.dev-absence');
    let totalAbsenceDevEquiv = 0;

    absenceInputs.forEach(input => {
        const daysAbsent = parseFloat(input.value || '0');
        const devEquiv = daysAbsent / sprintDays;
        totalAbsenceDevEquiv += devEquiv;
    });

    const lossRatio = totalAbsenceDevEquiv / devCount;
    const adjustedCapacity = velocity * (1 - lossRatio);

    const buildCapacity = adjustedCapacity * (buildPercent / 100);
    const techCapacity = adjustedCapacity - buildCapacity;

    resultDiv.classList.remove('hidden');
    resultDiv.innerHTML = `
        <h2 class="text-sm font-semibold text-slate-800 mb-3">Résultat</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div class="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div class="text-xs text-slate-500 mb-1">Capacité ajustée</div>
                <div class="text-lg font-semibold text-slate-900">
                    ${adjustedCapacity.toFixed(2)} pts
                </div>
            </div>
            <div class="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <div class="text-xs text-emerald-700 mb-1">Build (${buildPercent.toFixed(0)} %)</div>
                <div class="text-lg font-semibold text-emerald-900">
                    ${buildCapacity.toFixed(2)} pts
                </div>
            </div>
            <div class="p-3 rounded-lg bg-amber-50 border border-amber-200">
                <div class="text-xs text-amber-700 mb-1">
                    Fix, dette, améliorations (${(100 - buildPercent).toFixed(0)} %)
                </div>
                <div class="text-lg font-semibold text-amber-900">
                    ${techCapacity.toFixed(2)} pts
                </div>
            </div>
        </div>
        <div class="mt-2 text-xs text-slate-500 space-y-1">
            <div>Équipe: ${devCount} développeurs</div>
            <div>Sprint: ${sprintDays} jours ouvrés</div>
            <div>Absence totale équivalente développeur: ${totalAbsenceDevEquiv.toFixed(2)}</div>
            <div>Perte relative: ${(lossRatio * 100).toFixed(1)} %</div>
        </div>
    `;
}

// Event listeners
devCountInput.addEventListener('change', renderDevRows);
calcBtn.addEventListener('click', calculateCapacity);

// Initialize
renderDevRows();
