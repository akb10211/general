// Main application code
let currentFilter = 'all';
let allCombinations = [];

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Generate all possible combinations
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
    for (let size = 2; size <= 9; size++) {
        if (groupedCombinations[size] && shouldShowSize(size)) {
            renderSizeGroup(size, groupedCombinations[size], container);
        }
    }
}

// Check if a size should be shown based on current filter
function shouldShowSize(size) {
    if (currentFilter === 'all') {
        return true;
    }
    return parseInt(currentFilter) === size;
}

// Render a group of combinations of the same size
function renderSizeGroup(size, combinations, container) {
    // Create size group container
    const sizeGroup = document.createElement('div');
    sizeGroup.className = 'size-group';
    sizeGroup.dataset.size = size;

    // Create header
    const header = document.createElement('div');
    header.className = 'size-group-header';
    const sizeName = getSizeName(size);
    const occurredCount = combinations.filter(combo => hasOccurred(combo)).length;
    header.textContent = `${sizeName} (${occurredCount} of ${combinations.length} occurred)`;
    sizeGroup.appendChild(header);

    // Create grid for combinations
    const grid = document.createElement('div');
    grid.className = 'combinations-grid';

    // Add each combination as a card
    combinations.forEach(combo => {
        const card = createCombinationCard(combo);
        grid.appendChild(card);
    });

    sizeGroup.appendChild(grid);
    container.appendChild(sizeGroup);
}

// Create a card for a single combination
function createCombinationCard(justiceIds) {
    const card = document.createElement('div');
    card.className = 'combination-card';

    const occurred = hasOccurred(justiceIds);
    const cases = getCasesForCombination(justiceIds);

    if (occurred) {
        card.classList.add('occurred');

        // Determine the primary type (use the most recent case's type)
        const primaryType = cases[0].type;
        if (primaryType !== 'majority') {
            card.classList.add(primaryType);
        }
    }

    // Add justice names
    const justicesDiv = document.createElement('div');
    justicesDiv.className = 'combination-justices';
    const justiceNames = justiceIds.map(id => justices[id].shortName).join(', ');
    justicesDiv.textContent = justiceNames;
    card.appendChild(justicesDiv);

    // Add info
    const infoDiv = document.createElement('div');
    infoDiv.className = 'combination-info';

    if (occurred) {
        infoDiv.textContent = `${cases.length} case${cases.length > 1 ? 's' : ''}`;
    } else {
        infoDiv.className = 'not-occurred-label';
        infoDiv.textContent = 'Not yet occurred';
    }

    card.appendChild(infoDiv);

    // Add click handler
    card.addEventListener('click', () => showCombinationDetails(justiceIds));

    return card;
}

// Get a friendly name for combination size
function getSizeName(size) {
    const names = {
        2: 'Pairs (2 Justices)',
        3: 'Trios (3 Justices)',
        4: 'Quads (4 Justices)',
        5: 'Five Justices',
        6: 'Six Justices',
        7: 'Seven Justices',
        8: 'Eight Justices',
        9: 'All Nine Justices (Unanimous)'
    };
    return names[size] || `${size} Justices`;
}

// Update statistics display
function updateStatistics() {
    const totalCombinations = allCombinations.length;
    const occurredCount = allCombinations.filter(combo => hasOccurred(combo)).length;
    const completionRate = ((occurredCount / totalCombinations) * 100).toFixed(1);

    document.getElementById('total-combinations').textContent = totalCombinations;
    document.getElementById('occurred-count').textContent = occurredCount;
    document.getElementById('completion-rate').textContent = `${completionRate}%`;
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
    title.textContent = `${justiceIds.length} Justice Combination`;

    // Build modal content
    let content = '';

    // Show justices
    content += '<div class="modal-justices">';
    content += '<h3>Justices in this Combination</h3>';
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
        content += `<h3>Cases (${cases.length})</h3>`;
        cases.forEach(caseItem => {
            content += '<div class="case-item">';
            content += `<div class="case-name">${caseItem.caseName}</div>`;
            content += '<div class="case-details">';
            content += `<span class="case-type ${caseItem.type}">${capitalizeFirst(caseItem.type)}</span>`;
            content += `<span>${caseItem.date}</span>`;
            content += `<span>${caseItem.citation}</span>`;
            content += '</div>';
            content += '</div>';
        });
    } else {
        content += '<div class="no-cases">';
        content += '<p>This combination has not yet occurred in any signed opinion.</p>';
        content += '<p>When it does, the case details will appear here!</p>';
        content += '</div>';
    }
    content += '</div>';

    body.innerHTML = content;
    modal.classList.add('show');
}

// Helper function to capitalize first letter
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Calculate total possible combinations (for reference)
// This is sum of C(n,k) for k=2 to n, where n=9
// C(9,2) + C(9,3) + ... + C(9,9) = 2^9 - 1 - 9 = 502
console.log(`Total possible combinations: ${allCombinations.length}`);
console.log(`Combinations by size:`);
for (let size = 2; size <= 9; size++) {
    const count = allCombinations.filter(c => c.length === size).length;
    console.log(`  ${size} justices: ${count}`);
}
