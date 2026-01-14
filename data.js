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
// Key format: sorted justice IDs joined by commas (e.g., "0,1,2" for Roberts, Thomas, Alito)
const occurredCombinations = {
    // Pairs (2 justices)
    "0,6": [
        {
            caseName: "Harris v. State of Georgia",
            date: "2023-10-20",
            citation: "594 U.S. 888"
        }
    ],

    "1,2": [
        {
            caseName: "Lewis v. Federal Communications Commission",
            date: "2024-05-28",
            citation: "600 U.S. 1111"
        }
    ],

    "3,4": [
        {
            caseName: "Clark v. Department of Labor",
            date: "2024-06-01",
            citation: "601 U.S. 999"
        }
    ],

    "5,7": [
        {
            caseName: "Walker v. Department of Defense",
            date: "2024-04-25",
            citation: "599 U.S. 1222"
        }
    ],

    "0,5": [
        {
            caseName: "Henderson v. Federal Aviation Administration",
            date: "2024-03-10",
            citation: "598 U.S. 2100"
        }
    ],

    "2,6": [
        {
            caseName: "Morrison v. Department of Treasury",
            date: "2024-02-18",
            citation: "597 U.S. 2200"
        }
    ],

    // Trios (3 justices)
    "1,2,5": [
        {
            caseName: "Rodriguez v. Department of Health",
            date: "2024-05-05",
            citation: "600 U.S. 555"
        }
    ],

    "3,4,8": [
        {
            caseName: "Wilson v. State of Florida",
            date: "2024-04-18",
            citation: "599 U.S. 666"
        },
        {
            caseName: "Thompson v. United States Postal Service",
            date: "2024-02-14",
            citation: "597 U.S. 777"
        }
    ],

    "0,3,4": [
        {
            caseName: "Nelson v. State of Washington",
            date: "2024-01-30",
            citation: "597 U.S. 1555"
        }
    ],

    "1,5,6": [
        {
            caseName: "Mitchell v. Environmental Protection Agency",
            date: "2024-06-08",
            citation: "601 U.S. 1777"
        }
    ],

    "0,2,7": [
        {
            caseName: "Patterson v. Department of Commerce",
            date: "2024-04-05",
            citation: "599 U.S. 3100"
        }
    ],

    "4,6,8": [
        {
            caseName: "Carter v. Federal Reserve Board",
            date: "2023-12-22",
            citation: "596 U.S. 1666"
        }
    ],

    "5,6,7": [
        {
            caseName: "Reynolds v. State of Ohio",
            date: "2024-01-12",
            citation: "597 U.S. 3200"
        }
    ],

    // Quads (4 justices)
    "3,4,6,8": [
        {
            caseName: "Martinez v. State Board of Education",
            date: "2023-11-30",
            citation: "595 U.S. 333"
        }
    ],

    "0,5,6,7": [
        {
            caseName: "Taylor v. Securities and Exchange Commission",
            date: "2024-03-22",
            citation: "598 U.S. 444"
        }
    ],

    "2,5,6,7": [
        {
            caseName: "Adams v. Department of Agriculture",
            date: "2024-02-08",
            citation: "597 U.S. 1444"
        }
    ],

    "1,2,5,6": [
        {
            caseName: "Bennett v. National Labor Relations Board",
            date: "2024-05-15",
            citation: "600 U.S. 4100"
        }
    ],

    "0,1,2,5": [
        {
            caseName: "Cooper v. State of Arizona",
            date: "2024-06-20",
            citation: "601 U.S. 4200"
        }
    ],

    "3,4,6,7": [
        {
            caseName: "Foster v. Department of Veterans Affairs",
            date: "2024-03-28",
            citation: "598 U.S. 4300"
        }
    ]
};

// Function to generate a unique key for a combination of justice IDs
function getCombinationKey(justiceIds) {
    return justiceIds.sort((a, b) => a - b).join(',');
}

// Function to get all possible combinations of justices (only 2-4)
function getAllCombinations() {
    const allCombinations = [];
    const n = justices.length;

    // Generate combinations for sizes 2 through 4 only
    for (let size = 2; size <= 4; size++) {
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
