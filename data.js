// Current Supreme Court Justices (as of January 2025)
const justices = [
    { id: 0, name: "John Roberts", shortName: "Roberts", title: "Chief Justice" },
    { id: 1, name: "Clarence Thomas", shortName: "Thomas" },
    { id: 2, name: "Samuel Alito", shortName: "Alito" },
    { id: 3, name: "Sonia Sotomayor", shortName: "Sotomayor" },
    { id: 4, name: "Elena Kagan", shortName: "Kagan" },
    { id: 5, name: "Neil Gorsuch", shortName: "Gorsuch" },
    { id: 6, name: "Brett Kavanaugh", shortName: "Kavanaugh" },
    { id: 7, name: "Amy Coney Barrett", shortName: "Barrett" },
    { id: 8, name: "Ketanji Brown Jackson", shortName: "Jackson" }
];

// Mock data: Cases where specific justice combinations have signed together
// Each entry represents a unique combination that HAS occurred
// Key format: sorted justice IDs joined by commas (e.g., "0,1,2" for Roberts, Thomas, Alito)
const occurredCombinations = {
    // Example: All 9 justices (unanimous decision)
    "0,1,2,3,4,5,6,7,8": [
        {
            caseName: "Smith v. United States",
            date: "2024-06-15",
            type: "majority",
            citation: "601 U.S. 123"
        }
    ],

    // Example: 8 justices (all but one)
    "0,1,2,4,5,6,7,8": [
        {
            caseName: "Johnson v. State of California",
            date: "2024-05-20",
            type: "majority",
            citation: "600 U.S. 456"
        }
    ],

    // Example: 7 justice majority
    "0,1,2,5,6,7,8": [
        {
            caseName: "Williams v. Department of Education",
            date: "2024-04-12",
            type: "majority",
            citation: "599 U.S. 789"
        }
    ],

    // Example: 6 justice majority (common voting bloc)
    "0,1,2,5,6,7": [
        {
            caseName: "Brown v. Environmental Protection Agency",
            date: "2024-03-08",
            type: "majority",
            citation: "598 U.S. 234"
        },
        {
            caseName: "Garcia v. Immigration and Customs Enforcement",
            date: "2024-01-22",
            type: "majority",
            citation: "597 U.S. 567"
        }
    ],

    // Example: Liberal-leaning bloc
    "0,3,4,6,8": [
        {
            caseName: "Davis v. State of Texas",
            date: "2023-12-10",
            type: "majority",
            citation: "596 U.S. 890"
        }
    ],

    // Example: 5-4 decision (conservative majority)
    "0,1,2,5,6": [
        {
            caseName: "Miller v. Federal Trade Commission",
            date: "2024-02-28",
            type: "majority",
            citation: "598 U.S. 111"
        }
    ],

    // Example: Different 5-justice combination
    "1,2,5,6,7": [
        {
            caseName: "Anderson v. City of New York",
            date: "2024-01-15",
            type: "majority",
            citation: "597 U.S. 222"
        }
    ],

    // Example: 4 justice concurrence
    "3,4,6,8": [
        {
            caseName: "Martinez v. State Board of Education",
            date: "2023-11-30",
            type: "concurrence",
            citation: "595 U.S. 333"
        }
    ],

    // Example: 4 justice dissent
    "0,5,6,7": [
        {
            caseName: "Taylor v. Securities and Exchange Commission",
            date: "2024-03-22",
            type: "dissent",
            citation: "598 U.S. 444"
        }
    ],

    // Example: 3 justice dissent
    "1,2,5": [
        {
            caseName: "Rodriguez v. Department of Health",
            date: "2024-05-05",
            type: "dissent",
            citation: "600 U.S. 555"
        }
    ],

    // Example: Another 3 justice combination
    "3,4,8": [
        {
            caseName: "Wilson v. State of Florida",
            date: "2024-04-18",
            type: "dissent",
            citation: "599 U.S. 666"
        },
        {
            caseName: "Thompson v. United States Postal Service",
            date: "2024-02-14",
            type: "concurrence",
            citation: "597 U.S. 777"
        }
    ],

    // Example: Justice pairs (2 justices)
    "0,6": [
        {
            caseName: "Harris v. State of Georgia",
            date: "2023-10-20",
            type: "concurrence",
            citation: "594 U.S. 888"
        }
    ],

    "3,4": [
        {
            caseName: "Clark v. Department of Labor",
            date: "2024-06-01",
            type: "dissent",
            citation: "601 U.S. 999"
        }
    ],

    "1,2": [
        {
            caseName: "Lewis v. Federal Communications Commission",
            date: "2024-05-28",
            type: "dissent",
            citation: "600 U.S. 1111"
        }
    ],

    "5,7": [
        {
            caseName: "Walker v. Department of Defense",
            date: "2024-04-25",
            type: "concurrence",
            citation: "599 U.S. 1222"
        }
    ],

    // Additional examples to show variety
    "0,1,2,3,4,5,6,7": [
        {
            caseName: "Green v. State of Michigan",
            date: "2024-03-15",
            type: "majority",
            citation: "598 U.S. 1333"
        }
    ],

    "2,5,6,7": [
        {
            caseName: "Adams v. Department of Agriculture",
            date: "2024-02-08",
            type: "concurrence",
            citation: "597 U.S. 1444"
        }
    ],

    "0,3,4": [
        {
            caseName: "Nelson v. State of Washington",
            date: "2024-01-30",
            type: "dissent",
            citation: "597 U.S. 1555"
        }
    ],

    "4,6,8": [
        {
            caseName: "Carter v. Federal Reserve Board",
            date: "2023-12-22",
            type: "concurrence",
            citation: "596 U.S. 1666"
        }
    ],

    "1,5,6": [
        {
            caseName: "Mitchell v. Environmental Protection Agency",
            date: "2024-06-08",
            type: "concurrence",
            citation: "601 U.S. 1777"
        }
    ]
};

// Function to generate a unique key for a combination of justice IDs
function getCombinationKey(justiceIds) {
    return justiceIds.sort((a, b) => a - b).join(',');
}

// Function to get all possible combinations of justices
function getAllCombinations() {
    const allCombinations = [];
    const n = justices.length;

    // Generate all possible subsets (2^n - 1, excluding empty set and single justices)
    for (let size = 2; size <= n; size++) {
        const combinations = getCombinationsOfSize(size);
        allCombinations.push(...combinations);
    }

    return allCombinations;
}

// Helper function to get all combinations of a specific size
function getCombinationsOfSize(size) {
    const result = [];
    const n = justices.length;

    function combine(start, combo) {
        if (combo.length === size) {
            result.push([...combo]);
            return;
        }

        for (let i = start; i < n; i++) {
            combo.push(i);
            combine(i + 1, combo);
            combo.pop();
        }
    }

    combine(0, []);
    return result;
}

// Function to check if a combination has occurred
function hasOccurred(justiceIds) {
    const key = getCombinationKey(justiceIds);
    return occurredCombinations.hasOwnProperty(key);
}

// Function to get cases for a specific combination
function getCasesForCombination(justiceIds) {
    const key = getCombinationKey(justiceIds);
    return occurredCombinations[key] || [];
}
