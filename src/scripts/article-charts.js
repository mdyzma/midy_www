import Chart from "chart.js/auto";
function initCharts() {
if (!document.getElementById("osComparisonChart")) return;

            // --- UTILITIES ---
            // Label wrapping logic for Chart.js
            function wrapLabel(label) {
                if (label.length > 16) {
                    const words = label.split(" ");
                    const lines = [];
                    let currentLine = words[0];

                    for (let i = 1; i < words.length; i++) {
                        if ((currentLine + " " + words[i]).length < 16) {
                            currentLine += " " + words[i];
                        } else {
                            lines.push(currentLine);
                            currentLine = words[i];
                        }
                    }
                    lines.push(currentLine);
                    return lines;
                }
                return label;
            }

            // Shared Tooltip Configuration
            const sharedTooltipConfig = {
                callbacks: {
                    title: function (tooltipItems) {
                        const item = tooltipItems[0];
                        let label = item.chart.data.labels[item.dataIndex];
                        if (Array.isArray(label)) {
                            return label.join(" ");
                        } else {
                            return label;
                        }
                    },
                },
            };

            // --- CHART 1: OS COMPARISON (Bar Chart) ---
            const ctxOS = document
                .getElementById("osComparisonChart")
                .getContext("2d");
            new Chart(ctxOS, {
                type: "bar",
                data: {
                    labels: [
                        "macOS (Homebrew)",
                        "Windows 11 (Winget + WSL)",
                        "Ubuntu LTS (Apt)",
                    ].map(wrapLabel),
                    datasets: [
                        {
                            label: "Initial Setup Steps",
                            data: [3, 6, 4],
                            backgroundColor: [
                                "rgba(6, 182, 212, 0.7)", // Cyan
                                "rgba(59, 130, 246, 0.7)", // Blue
                                "rgba(249, 115, 22, 0.7)", // Orange
                            ],
                            borderColor: [
                                "rgba(6, 182, 212, 1)",
                                "rgba(59, 130, 246, 1)",
                                "rgba(249, 115, 22, 1)",
                            ],
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                        legend: { display: false },
                        tooltip: sharedTooltipConfig,
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: "rgba(255, 255, 255, 0.1)" },
                            ticks: { color: "#9ca3af" },
                        },
                        x: {
                            grid: { display: false },
                            ticks: { color: "#9ca3af" },
                        },
                    },
                },
            });

            // --- CHART 2: TERMINAL STACK (Doughnut) ---
            const ctxStack = document
                .getElementById("terminalStackChart")
                .getContext("2d");
            new Chart(ctxStack, {
                type: "doughnut",
                data: {
                    labels: [
                        "Shell Logic (Zsh/Fish)",
                        "Visuals (Starship)",
                        "Emulator (WezTerm/Alacritty)",
                        "Multiplexer (Tmux/Zellij)",
                    ].map(wrapLabel),
                    datasets: [
                        {
                            data: [30, 20, 30, 20],
                            backgroundColor: [
                                "#ec4899", // Pink
                                "#8b5cf6", // Purple
                                "#06b6d4", // Cyan
                                "#10b981", // Emerald
                            ],
                            borderWidth: 0,
                        },
                    ],
                },
                options: {
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                        legend: {
                            position: "bottom",
                            labels: { color: "#9ca3af", usePointStyle: true },
                        },
                        tooltip: sharedTooltipConfig,
                    },
                },
            });

            // --- CHART 3: CONFIG MANAGEMENT (Radar) ---
            const ctxConfig = document
                .getElementById("configChart")
                .getContext("2d");
            new Chart(ctxConfig, {
                type: "radar",
                data: {
                    labels: [
                        "Initial Install",
                        "Maintenance",
                        "Portability",
                        "Recovery Speed",
                        "Complexity",
                    ].map(wrapLabel),
                    datasets: [
                        {
                            label: "Manual Setup",
                            data: [20, 80, 10, 10, 30],
                            backgroundColor: "rgba(239, 68, 68, 0.2)", // Red
                            borderColor: "rgba(239, 68, 68, 1)",
                            pointBackgroundColor: "rgba(239, 68, 68, 1)",
                        },
                        {
                            label: "Dotfiles + Scripts",
                            data: [60, 20, 90, 95, 70],
                            backgroundColor: "rgba(6, 182, 212, 0.2)", // Cyan
                            borderColor: "rgba(6, 182, 212, 1)",
                            pointBackgroundColor: "rgba(6, 182, 212, 1)",
                        },
                    ],
                },
                options: {
                    maintainAspectRatio: false,
                    responsive: true,
                    scales: {
                        r: {
                            angleLines: { color: "rgba(255, 255, 255, 0.1)" },
                            grid: { color: "rgba(255, 255, 255, 0.1)" },
                            pointLabels: { color: "#d1d5db" },
                            ticks: { display: false },
                        },
                    },
                    plugins: {
                        legend: { labels: { color: "#9ca3af" } },
                        tooltip: sharedTooltipConfig,
                    },
                },
            });
        
}
document.addEventListener("astro:page-load", initCharts);
document.addEventListener("astro:before-swap", () => { Object.values(Chart.instances).forEach(chart => chart.destroy()); });
