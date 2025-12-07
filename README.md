💎 Prostone Optimizer & Calculator
Reverse-Engineered Fusion Logic for Maximum Efficiency.

The Prostone Optimizer is a Single-Page Application (SPA) designed to solve the complex mathematical mechanisms behind the Prostone fusion system. Based on a deep analysis of the game's underlying C++ logic, this tool calculates the mathematically most efficient path to reach target stats—accounting for costs (Diamonds/Glues) and hidden material losses due to "Diminishing Returns."


🧐 The Problem: Why this tool?
In-game, the logic seems simple: "Combine more stones to get stronger results." However, analyzing the game's source code reveals a different reality:

Integer Truncation: The game engine aggressively truncates decimal precision after every calculation step.

Diminishing Returns: The bonus multiplier coefficient decreases as you add more stones to a single stack.

Compounding Effect: It is often mathematically superior to fuse small groups (e.g., 2-stacks) recursively to apply the multiplier more frequently, rather than fusing a large group (10-stack) once.

Players who intuitively fuse "everything at once" lose significant stats and resources in the long run. This tool solves this problem using brute-force simulation.

✨ Features
Precise Simulation: Replicates the game algorithm 1:1, including rounding errors.

Strategy Comparison: Compares iterations (e.g., "Always 2s" vs. "Always 10s") to find the global optimum.

Cost Analysis: Calculates exact requirements for Diamonds 💎 and Glues 🧪.

Multi-Language: Fully localized in 🇩🇪 German, 🇺🇸 English, and 🇫🇷 French.

Step-by-Step Guide: Generates a precise instruction list for the fusion process.

🛠️ Tech Stack
Core: Vanilla JavaScript (ES6+) for maximum performance with zero dependencies.

UI: HTML5 & CSS3 (Responsive Design, Dark Mode).

Deployment: Optimized for GitHub Pages.

🧬 Algorithm (Snippet)
The tool simulates the internal game mechanics where GrowthRates scale non-linearly and values are hard-casted:

JavaScript

// Simplified Logic Representation
function simulateFusion(input, stackSize) {
    // Non-linear scaling based on stack size (Diminishing Returns)
    const rate = LOOKUP_TABLE[stackSize]; 
    
    // Integer Truncation causing 'hidden' stats losses
    // The tool accounts for this precision loss
    const result = Math.floor(input * rate); 
    
    return result;
}
🚀 Installation & Usage
Since this is a client-side application, no complex installation is required.

Clone the repository:

Bash

git clone https://github.com/YOUR-USERNAME/prostone-optimizer.git
Open index.html in any modern web browser.

Or use the live version via GitHub Pages (link above).

🤝 Contributing
Pull requests are welcome! If you discover a discrepancy in the calculation or want to improve the UI:

Fork the project.

Create your feature branch (git checkout -b feature/AmazingFeature).

Commit your changes (git commit -m 'Add some AmazingFeature').

Push to the branch (git push origin feature/AmazingFeature).

Open a Pull Request.

📝 License
Distributed under the MIT License. See LICENSE for more information.

Built with ☕ and C++ Code Analysis.
