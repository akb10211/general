// Main application code
let currentFilter = 'all';
let allCombinations = [];
let selectedJusticesForTrios = new Set();
let selectedJusticesForQuads = new Set();

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Generate all possible combinations (2-4 justices only)
    allCombinations = getAllCombinations();

    // Render the visualization
    renderVisualization();

    // Update statistics
    updateStatistics();

    // Set up filter buttons
    setupFilterButtons();

    // Set up modal
    setupModal();
}

// Render the main visualization
function renderVisualization() {
    const container = document.getElementById('visualization');
    container.innerHTML = '';

    // Group combinations by size
    const groupedCombinations = {};
    allCombinations.forEach(combo => {
        const size = combo.length;
        if (!groupedCombinations[size]) {
            groupedCombinations[size] = [];
        }
        groupedCombinations[size].push(combo);
    });

    // Render each size group
    if (shouldShowSize(2)) {
        renderPairsMatrix(groupedCombinations[2], container);
    }
    if (shouldShowSize(3)) {
        renderTriosGrid(groupedCombinations[3], container);
    }
    if (shouldShowSize(4)) {
        renderQuadsGrid(groupedCombinations[4], container);
    }
}

// Check if a size should be shown based on current filter
function shouldShowSize(size) {
    if (currentFilter === 'all') {
        return true;
    }
    return parseInt(currentFilter) === size;
}

// Render pairs as a triangular matrix (like the adjacency matrix)
function renderPairsMatrix(combinations, container) {
    const sizeGroup = document.createElement('div');
    sizeGroup.className = 'size-group';

    const header = document.createElement('div');
    header.className = 'size-group-header';
    header.textContent = 'Pairs';
    sizeGroup.appendChild(header);

    // Create matrix container
    const matrixContainer = document.createElement('div');
    matrixContainer.className = 'matrix-container';

    // Build triangular matrix table
    const table = document.createElement('table');
    table.className = 'matrix-table';

    // Create header row with justice names
    const headerRow = document.createElement('tr');
    headerRow.appendChild(document.createElement('th')); // Empty corner cell

    for (let i = 0; i < justices.length; i++) {
        const th = document.createElement('th');
        th.textContent = justices[i].shortName;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);

    // Create matrix rows (triangular)
    for (let row = 0; row < justices.length; row++) {
        const tr = document.createElement('tr');

        // Row header (justice name)
        const rowHeader = document.createElement('th');
        rowHeader.textContent = justices[row].shortName;
        tr.appendChild(rowHeader);

        // Create cells for each column
        for (let col = 0; col < justices.length; col++) {
            const td = document.createElement('td');

            // Only show cells in the lower triangle (excluding diagonal)
            if (col < row) {
                const combo = [col, row];
                const occurred = hasOccurred(combo);
                td.className = occurred ? 'occurred' : 'not-occurred';
                td.addEventListener('click', () => showCombinationDetails(combo));
            } else {
                td.className = 'empty';
            }

            tr.appendChild(td);
        }

        table.appendChild(tr);
    }

    matrixContainer.appendChild(table);
    sizeGroup.appendChild(matrixContainer);
    container.appendChild(sizeGroup);
}

// Render trios as a grid with justice filters
function renderTriosGrid(combinations, container) {
    const sizeGroup = document.createElement('div');
    sizeGroup.className = 'size-group';

    const header = document.createElement('div');
    header.className = 'size-group-header';
    header.textContent = 'Trios';
    sizeGroup.appendChild(header);

    // Add justice filters
    const filtersDiv = createJusticeFilters(3, selectedJusticesForTrios, () => renderVisualization());
    sizeGroup.appendChild(filtersDiv);

    // Filter combinations based on selected justices
    let filteredCombinations = combinations;
    if (selectedJusticesForTrios.size > 0) {
        filteredCombinations = combinations.filter(combo => {
            return Array.from(selectedJusticesForTrios).every(justiceId => combo.includes(justiceId));
        });
    }

    const grid = document.createElement('div');
    grid.className = 'combinations-grid';

    filteredCombinations.forEach(combo => {
        const card = createCombinationCard(combo);
        grid.appendChild(card);
    });

    sizeGroup.appendChild(grid);
    container.appendChild(sizeGroup);
}

// Render quads as a grid with justice filters
function renderQuadsGrid(combinations, container) {
    const sizeGroup = document.createElement('div');
    sizeGroup.className = 'size-group';

    const header = document.createElement('div');
    header.className = 'size-group-header';
    header.textContent = 'Quads';
    sizeGroup.appendChild(header);

    // Add justice filters
    const filtersDiv = createJusticeFilters(4, selectedJusticesForQuads, () => renderVisualization());
    sizeGroup.appendChild(filtersDiv);

    // Filter combinations based on selected justices
    let filteredCombinations = combinations;
    if (selectedJusticesForQuads.size > 0) {
        filteredCombinations = combinations.filter(combo => {
            return Array.from(selectedJusticesForQuads).every(justiceId => combo.includes(justiceId));
        });
    }

    const grid = document.createElement('div');
    grid.className = 'combinations-grid';

    filteredCombinations.forEach(combo => {
        const card = createCombinationCard(combo);
        grid.appendChild(card);
    });

    sizeGroup.appendChild(grid);
    container.appendChild(sizeGroup);
}

// Create justice filter buttons
function createJusticeFilters(maxJustices, selectedSet, onChange) {
    const filtersDiv = document.createElement('div');
    filtersDiv.className = 'justice-filters';

    const headerText = document.createElement('div');
    headerText.className = 'justice-filters-header';
    headerText.textContent = `Filter by justice (select up to ${maxJustices}):`;
    filtersDiv.appendChild(headerText);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'justice-filter-buttons';

    // Create button for each justice
    justices.forEach(justice => {
        const button = document.createElement('button');
        button.className = 'justice-filter-btn';
        button.textContent = justice.shortName;
        button.dataset.justiceId = justice.id;

        if (selectedSet.has(justice.id)) {
            button.classList.add('active');
        }

        // Disable if max justices selected and this one isn't selected
        if (selectedSet.size >= maxJustices && !selectedSet.has(justice.id)) {
            button.disabled = true;
        }

        button.addEventListener('click', () => {
            if (selectedSet.has(justice.id)) {
                selectedSet.delete(justice.id);
            } else {
                if (selectedSet.size < maxJustices) {
                    selectedSet.add(justice.id);
                }
            }
            onChange();
        });

        buttonsContainer.appendChild(button);
    });

    // Add clear filters button
    if (selectedSet.size > 0) {
        const clearButton = document.createElement('button');
        clearButton.className = 'clear-filters-btn';
        clearButton.textContent = 'Clear';
        clearButton.addEventListener('click', () => {
            selectedSet.clear();
            onChange();
        });
        buttonsContainer.appendChild(clearButton);
    }

    filtersDiv.appendChild(buttonsContainer);
    return filtersDiv;
}

// Create a card for a single combination (used for trios and quads)
function createCombinationCard(justiceIds) {
    const card = document.createElement('div');
    card.className = 'combination-card';

    const occurred = hasOccurred(justiceIds);
    card.classList.add(occurred ? 'occurred' : 'not-occurred');

    // Add justice names
    const justicesDiv = document.createElement('div');
    justicesDiv.className = 'combination-justices';
    const justiceNames = justiceIds.map(id => justices[id].shortName).join(', ');
    justicesDiv.textContent = justiceNames;
    card.appendChild(justicesDiv);

    // Add click handler
    card.addEventListener('click', () => showCombinationDetails(justiceIds));

    return card;
}

// Update statistics display
function updateStatistics() {
    const totalCombinations = allCombinations.length;
    const occurredCount = allCombinations.filter(combo => hasOccurred(combo)).length;

    document.getElementById('total-combinations').textContent = totalCombinations;
    document.getElementById('occurred-count').textContent = occurredCount;
}

// Set up filter button handlers
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Update current filter
            currentFilter = button.dataset.filter;

            // Clear justice filters when switching views
            selectedJusticesForTrios.clear();
            selectedJusticesForQuads.clear();

            // Re-render visualization
            renderVisualization();
        });
    });
}

// Modal functionality
function setupModal() {
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close');

    // Close modal when clicking X
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.remove('show');
        }
    });
}

// Show details for a specific combination
function showCombinationDetails(justiceIds) {
    const modal = document.getElementById('modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');

    const occurred = hasOccurred(justiceIds);
    const cases = getCasesForCombination(justiceIds);

    // Set title
    const sizeNames = {
        2: 'Pair',
        3: 'Trio',
        4: 'Quad'
    };
    title.textContent = sizeNames[justiceIds.length] || `${justiceIds.length} Justices`;

    // Build modal content
    let content = '';

    // Show justices
    content += '<div class="modal-justices">';
    content += '<h3>Justices</h3>';
    content += '<ul class="justice-list">';
    justiceIds.forEach(id => {
        const justice = justices[id];
        const titleText = justice.title ? ` (${justice.title})` : '';
        content += `<li>${justice.name}${titleText}</li>`;
    });
    content += '</ul>';
    content += '</div>';

    // Show cases
    content += '<div class="cases-section">';
    if (occurred && cases.length > 0) {
        content += `<h3>Cases</h3>`;
        cases.forEach(caseItem => {
            content += '<div class="case-item">';
            content += `<div class="case-name">${caseItem.caseName}</div>`;
            content += '<div class="case-details">';
            content += `${caseItem.date} &middot; ${caseItem.citation}`;
            content += '</div>';
            content += '</div>';
        });
    } else {
        content += '<div class="no-cases">';
        content += '<p>This combination has not yet occurred in any signed opinion.</p>';
        content += '</div>';
    }
    content += '</div>';

    body.innerHTML = content;
    modal.classList.add('show');
}

// Log statistics on load
console.log(`Total possible combinations (2-4 justices): ${allCombinations.length}`);
console.log(`Combinations by size:`);
for (let size = 2; size <= 4; size++) {
    const count = allCombinations.filter(c => c.length === size).length;
    console.log(`  ${size} justices: ${count}`);
}
