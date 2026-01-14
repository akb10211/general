# Minorigami ⚖️

**Exploring Supreme Court Justice Signing Combinations**

Minorigami is a web application that visualizes all possible combinations of the current nine Supreme Court justices and shows which combinations have actually signed opinions together. Inspired by Jon Bois' "Scoragami" concept for football scores, this tool helps you explore patterns in judicial coalitions.

## 🚀 Quick Start

Simply open `index.html` in any modern web browser. No installation or build process required!

```bash
# Option 1: Open directly in your default browser
open index.html

# Option 2: Use Python's built-in server (optional)
python3 -m http.server 8000
# Then visit http://localhost:8000 in your browser
```

## 📊 Features

### Visual Grid Display
- **Interactive Visualization**: See all 502 possible justice combinations (from pairs to all nine)
- **Color Coding**:
  - 🟢 Green = Majority Opinion
  - 🔵 Blue = Concurrence
  - 🔴 Red = Dissent
  - ⚪ Gray = Not Yet Occurred

### Filtering Options
- View all combinations at once
- Filter by specific group sizes (pairs, trios, quads, etc.)
- Quick statistics showing completion rates

### Interactive Details
- Click any combination to see full details
- View all cases where that specific group signed together
- See case names, dates, citations, and opinion types

## 📁 Project Structure

```
minorigami/
├── index.html      # Main HTML structure
├── style.css       # All styling and responsive design
├── data.js         # Justice data and mock case database
└── app.js          # Core JavaScript logic and interactivity
```

## 🏛️ Current Justices (January 2025)

1. John Roberts (Chief Justice)
2. Clarence Thomas
3. Samuel Alito
4. Sonia Sotomayor
5. Elena Kagan
6. Neil Gorsuch
7. Brett Kavanaugh
8. Amy Coney Barrett
9. Ketanji Brown Jackson

## 📚 Data Structure

The application uses a simple JSON-based data structure in `data.js`:

```javascript
const occurredCombinations = {
    "0,1,2": [  // Justice IDs (sorted)
        {
            caseName: "Example v. United States",
            date: "2024-06-15",
            type: "majority",  // or "concurrence" or "dissent"
            citation: "601 U.S. 123"
        }
    ]
};
```

## 🔧 How It Works

### Combination Generation
The app calculates all possible combinations of 2-9 justices:
- **Pairs (2)**: 36 combinations
- **Trios (3)**: 84 combinations
- **Quads (4)**: 126 combinations
- **Five (5)**: 126 combinations
- **Six (6)**: 84 combinations
- **Seven (7)**: 36 combinations
- **Eight (8)**: 9 combinations
- **All Nine (9)**: 1 combination
- **Total**: 502 possible combinations

### Data Lookup
Each combination is represented by a sorted list of justice IDs (0-8). The app checks if that combination key exists in the `occurredCombinations` object.

### Rendering
Combinations are grouped by size and displayed as interactive cards. Cards change color based on whether they've occurred and what type of opinion they represent.

## 🎨 Customization

### Adding Real Data
To add real SCOTUS opinion data, edit `data.js`:

1. Find the `occurredCombinations` object
2. Add a new entry with the justice combination key
3. Include case details (name, date, type, citation)

Example:
```javascript
"0,3,4,8": [  // Roberts, Sotomayor, Kagan, Jackson
    {
        caseName: "Your Case Name Here v. United States",
        date: "2024-12-01",
        type: "majority",
        citation: "602 U.S. 456"
    }
]
```

### Styling Changes
All visual styling is in `style.css`. Key variables to customize:
- Colors: Search for hex codes like `#667eea` (primary purple) and `#10b981` (green)
- Spacing: Adjust `gap`, `padding`, and `margin` values
- Grid layout: Modify `.combinations-grid` for different card sizes

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Tablets
- Mobile phones

## 🔮 Future Enhancements

Potential features to add:
- Import real SCOTUS opinion data from APIs
- Filter by date ranges or specific terms
- Show voting patterns and statistics
- Export combinations to CSV/JSON
- Search functionality for specific cases or justices
- Animated transitions between filters
- Dark mode toggle

## 🤝 Contributing

This is a simple, standalone web application. To modify:

1. Edit the HTML structure in `index.html`
2. Update styles in `style.css`
3. Modify logic in `app.js`
4. Add data in `data.js`

No build process or dependencies required!

## 📝 License

This project is open source and available for educational and non-commercial use.

## 🙏 Acknowledgments

- Inspired by Jon Bois' [Scoragami](https://www.youtube.com/watch?v=9l5C8cGMueY) concept
- Built for exploring patterns in Supreme Court decision-making
- Current as of January 2025

---

**Note**: The current version includes mock/sample data. For accurate results, replace with actual SCOTUS opinion data from official sources like [SCOTUSblog](https://www.scotusblog.com/) or the [Supreme Court's official website](https://www.supremecourt.gov/)
