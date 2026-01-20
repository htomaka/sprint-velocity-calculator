(() => {
    'use strict';

    // Cache DOM elements
    const elements = {
        devCountInput: document.getElementById('devCount'),
        devsContainer: document.getElementById('devs-container'),
        calcBtn: document.getElementById('calcBtn'),
        velocityInput: document.getElementById('velocity'),
        sprintDaysInput: document.getElementById('sprintDays'),
        buildPercentInput: document.getElementById('buildPercent'),
        resultDiv: document.getElementById('result')
    };

    // Validation helpers
    function validateInput(value, min, max, name) {
        const num = parseFloat(value);
        if (isNaN(num) || num < min || num > max) {
            showError(`${name} doit être entre ${min} et ${max}`);
            return false;
        }
        return true;
    }

    function showError(message) {
        // Create or update error message
        let errorDiv = document.getElementById('error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'error-message';
            errorDiv.className = 'bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4';
            elements.calcBtn.parentNode.insertBefore(errorDiv, elements.calcBtn);
        }
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorDiv.classList.add('hidden');
        }, 5000);
    }

    function hideError() {
        const errorDiv = document.getElementById('error-message');
        if (errorDiv) {
            errorDiv.classList.add('hidden');
        }
    }

    // Safe DOM manipulation
    function createDevRow(devIndex) {
        const row = document.createElement('div');
        row.className = 'flex flex-col sm:flex-row sm:items-center gap-2 gap-y-1 text-sm';
        
        const label = document.createElement('span');
        label.className = 'w-20 text-slate-700 font-medium';
        label.textContent = `Dev ${devIndex}`;
        
        const inputContainer = document.createElement('div');
        inputContainer.className = 'flex items-center gap-2';
        
        const input = document.createElement('input');
        input.type = 'number';
        input.min = '0';
        input.value = '0';
        input.step = '0.5';
        input.setAttribute('data-dev-index', devIndex);
        input.className = 'dev-absence w-full sm:w-24 px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:border-indigo-500 focus:ring-indigo-500';
        input.setAttribute('aria-label', `Absences développeur ${devIndex}`);
        
        const labelSuffix = document.createElement('span');
        labelSuffix.className = 'text-xs text-slate-500';
        labelSuffix.textContent = 'jours ouvrés';
        
        inputContainer.appendChild(input);
        inputContainer.appendChild(labelSuffix);
        row.appendChild(label);
        row.appendChild(inputContainer);
        
        return row;
    }

    function renderDevRows() {
        try {
            const devCount = parseInt(elements.devCountInput.value, 10);
            
            if (isNaN(devCount) || devCount < 1 || devCount > 50) {
                showError('Le nombre de développeurs doit être entre 1 et 50');
                return;
            }

            // Clear existing rows
            elements.devsContainer.innerHTML = '';
            
            // Generate new rows
            for (let i = 1; i <= devCount; i++) {
                elements.devsContainer.appendChild(createDevRow(i));
            }
            
            hideError();
        } catch (error) {
            showError('Erreur lors de la génération des champs');
            console.error('renderDevRows error:', error);
        }
    }

    function calculateCapacity() {
        try {
            // Validate inputs
            const velocity = parseFloat(elements.velocityInput.value);
            const devCount = parseInt(elements.devCountInput.value, 10);
            const sprintDays = parseFloat(elements.sprintDaysInput.value);
            const buildPercent = parseFloat(elements.buildPercentInput.value);

            if (!validateInput(velocity, 0, 1000, 'La vélocité')) return;
            if (!validateInput(devCount, 1, 50, 'Le nombre de développeurs')) return;
            if (!validateInput(sprintDays, 1, 30, 'Les jours ouvrés')) return;
            if (!validateInput(buildPercent, 0, 100, 'Le pourcentage build')) return;

            // Calculate absences
            const absenceInputs = document.querySelectorAll('.dev-absence');
            let totalAbsenceDevEquiv = 0;

            absenceInputs.forEach(input => {
                const daysAbsent = parseFloat(input.value) || 0;
                if (daysAbsent < 0 || daysAbsent > sprintDays) {
                    throw new Error(`Les absences doivent être entre 0 et ${sprintDays} jours`);
                }
                const devEquiv = daysAbsent / sprintDays;
                totalAbsenceDevEquiv += devEquiv;
            });

            // Calculate capacity
            const lossRatio = totalAbsenceDevEquiv / devCount;
            const adjustedCapacity = velocity * (1 - lossRatio);
            const buildCapacity = adjustedCapacity * (buildPercent / 100);
            const techCapacity = adjustedCapacity - buildCapacity;

            // Display results safely
            displayResults({
                adjustedCapacity,
                buildCapacity,
                techCapacity,
                buildPercent,
                devCount,
                sprintDays,
                totalAbsenceDevEquiv,
                lossRatio
            });
            
            hideError();
        } catch (error) {
            showError(error.message);
            console.error('calculateCapacity error:', error);
        }
    }

    function displayResults(data) {
        const { adjustedCapacity, buildCapacity, techCapacity, buildPercent, devCount, sprintDays, totalAbsenceDevEquiv, lossRatio } = data;
        
        // Clear previous results
        elements.resultDiv.innerHTML = '';
        elements.resultDiv.classList.remove('hidden');
        
        // Create result sections safely
        const resultHTML = [
            '<h2 class="text-sm font-semibold text-slate-800 mb-3">Résultat</h2>',
            '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">',
            createResultCard('Capacité ajustée', `${adjustedCapacity.toFixed(2)} pts`, 'slate'),
            createResultCard(`Build (${buildPercent.toFixed(0)} %)`, `${buildCapacity.toFixed(2)} pts`, 'emerald'),
            createResultCard(`Fix, dette, améliorations (${(100 - buildPercent).toFixed(0)} %)`, `${techCapacity.toFixed(2)} pts`, 'amber'),
            '</div>',
            '<div class="mt-2 text-xs text-slate-500 space-y-1">',
            `<div>Équipe: ${devCount} développeurs</div>`,
            `<div>Sprint: ${sprintDays} jours ouvrés</div>`,
            `<div>Absence totale équivalente développeur: ${totalAbsenceDevEquiv.toFixed(2)}</div>`,
            `<div>Perte relative: ${(lossRatio * 100).toFixed(1)} %</div>`,
            '</div>'
        ].join('');
        
        elements.resultDiv.innerHTML = resultHTML;
    }

    function createResultCard(title, value, color) {
        const colorClasses = {
            slate: 'bg-slate-50 border-slate-200 text-slate-900',
            emerald: 'bg-emerald-50 border-emerald-200 text-emerald-900',
            amber: 'bg-amber-50 border-amber-200 text-amber-900'
        };
        
        const textColors = {
            slate: 'text-slate-500',
            emerald: 'text-emerald-700',
            amber: 'text-amber-700'
        };
        
        return `
            <div class="p-3 rounded-lg ${colorClasses[color]} border">
                <div class="text-xs ${textColors[color]} mb-1">${escapeHtml(title)}</div>
                <div class="text-lg font-semibold">${escapeHtml(value)}</div>
            </div>
        `;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Initialize event listeners
    function init() {
        if (elements.devCountInput) {
            elements.devCountInput.addEventListener('change', renderDevRows);
        }
        
        if (elements.calcBtn) {
            elements.calcBtn.addEventListener('click', calculateCapacity);
        }
        
        // Add keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.type === 'number') {
                calculateCapacity();
            }
        });
        
        // Initial render
        renderDevRows();
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
