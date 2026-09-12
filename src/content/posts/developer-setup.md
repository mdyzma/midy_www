---
title: 'The Modern Developer Setup: Mac, Windows, Ubuntu'
description: 'A practical guide to terminals, package managers, developer tools, and reproducible environments with dotfiles and automation.'
slug: dotfiles_automate.html
category: Automation
tags: [Dotfiles, Developer tools]
charts: true
---

<div class="legacy-article">
<!-- Header Section -->
<header class="container mx-auto px-6 py-16 text-center">
    <h1 class="text-4xl md:text-7xl font-black mb-6 tracking-tight">
        MODERN 
        <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600"
            >ENVIRONMENT</span
        ><br />
        ARCHITECT
    </h1>
    <p class="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
        A unified strategy for bootstrapping high-performance developer
        machines across macOS Tahoe, Windows 11, and Ubuntu 24.
        Featuring Ollama, Zed, VS Code, and automated workflows.
    </p>
    <!-- Intro Stats Grid -->
    <div
        class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
    >
        <div
            class="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl"
        >
            <div class="text-4xl font-bold text-cyan-400 mb-2">3</div>
            <div class="text-gray-400 uppercase text-xs tracking-wider">
                Target OS Platforms
            </div>
        </div>
        <div
            class="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl"
        >
            <div class="text-4xl font-bold text-purple-400 mb-2">
                100%
            </div>
            <div class="text-gray-400 uppercase text-xs tracking-wider">
                Scriptable Setup
            </div>
        </div>
        <div
            class="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl"
        >
            <div class="text-4xl font-bold text-pink-400 mb-2">AI</div>
            <div class="text-gray-400 uppercase text-xs tracking-wider">
                Local Inference Ready
            </div>
        </div>
    </div>
</header>
<!-- SECTION 1: THE FOUNDATION (Package Managers) -->
<section id="foundation" class="container mx-auto px-6 py-16">
    <div class="flex flex-col md:flex-row items-start gap-12">
        <!-- Text Content -->
        <div class="md:w-1/2">
            <h2 class="text-3xl font-bold mb-6 flex items-center">
                <span
                    class="bg-cyan-500 text-gray-900 text-sm font-bold px-3 py-1 rounded mr-4"
                    >01</span
                >
                System Foundation
            </h2>
            <p class="text-gray-300 mb-6 leading-relaxed">
                Before any tools can be installed, the package manager
                must be initialized. This abstracts the installation
                process, allowing for scriptable, reproducible
                environments versus manual dragging-and-dropping.
            </p>
            <div class="space-y-6">
                <!-- macOS Card -->
                <div
                    class="bg-gray-800 p-6 rounded-lg border-l-4 border-cyan-500"
                >
                    <h3 class="font-bold text-lg mb-2 text-cyan-400">
                        macOS (Homebrew)
                    </h3>
                    <p class="text-sm text-gray-400 mb-2">
                        The de-facto standard for Mac.
                    </p>
                    <div class="code-block text-xs">
                        /bin/bash -c "$(curl -fsSL
                        https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
                    </div>
                </div>
                <!-- Windows Card -->
                <div
                    class="bg-gray-800 p-6 rounded-lg border-l-4 border-blue-500"
                >
                    <h3 class="font-bold text-lg mb-2 text-blue-400">
                        Windows 11 (Winget)
                    </h3>
                    <p class="text-sm text-gray-400 mb-2">
                        Native package manager (Pre-installed).
                    </p>
                    <div class="code-block text-xs">
                        winget install --id=Microsoft.PowerShell -e
                    </div>
                </div>
                <!-- Ubuntu Card -->
                <div
                    class="bg-gray-800 p-6 rounded-lg border-l-4 border-orange-500"
                >
                    <h3 class="font-bold text-lg mb-2 text-orange-400">
                        Ubuntu LTS (APT)
                    </h3>
                    <p class="text-sm text-gray-400 mb-2">
                        The reliable classic.
                    </p>
                    <div class="code-block text-xs">
                        sudo apt update && sudo apt upgrade -y
                    </div>
                </div>
            </div>
        </div>
        <!-- Visualization: Comparison Chart -->
        <div class="md:w-1/2 w-full">
            <div
                class="bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700"
            >
                <h3
                    class="text-xl font-bold mb-4 text-center text-gray-200"
                >
                    Setup Complexity Index
                </h3>
                <p class="text-xs text-center text-gray-400 mb-6">
                    Estimated steps to achieve a fully automated
                    baseline.
                </p>
                <div class="chart-container">
                    <canvas id="osComparisonChart" role="img" aria-label="Illustrative developer workflow comparison chart">Illustrative comparison of developer workflows. These values are examples, not measured benchmarks.</canvas>
                </div>
            </div>
            <div class="mt-6 text-sm text-gray-400 italic text-center">
                * Windows requires extra steps for WSL2 integration to
                match Unix-like workflows.
            </div>
        </div>
    </div>
</section>
<!-- SECTION 2: THE TERMINAL (Shell & Prompts) -->
<section id="terminal" class="bg-gray-800 py-16">
    <div class="container mx-auto px-6">
        <h2
            class="text-3xl font-bold mb-12 flex items-center justify-center"
        >
            <span
                class="bg-purple-500 text-white text-sm font-bold px-3 py-1 rounded mr-4"
                >02</span
            >
            The Modern Terminal Core
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
            <!-- Concept: The Stack -->
            <div class="order-2 md:order-1">
                <div class="chart-container">
                    <canvas id="terminalStackChart" role="img" aria-label="Illustrative developer workflow comparison chart">Illustrative comparison of developer workflows. These values are examples, not measured benchmarks.</canvas>
                </div>
            </div>
            <!-- Implementation Details -->
            <div class="order-1 md:order-2">
                <h3 class="text-2xl font-bold text-purple-400 mb-4">
                    Shell & Prompt Strategy
                </h3>
                <p class="text-gray-300 mb-6">
                    We move beyond default Bash/Zsh configurations. The
                    modern standard utilizes
                    <strong>Starship</strong> for a cross-shell,
                    high-performance prompt, and either
                    <strong>Fish</strong> (for out-of-the-box features)
                    or configured <strong>Zsh</strong>.
                </p>
                <div class="space-y-4">
                    <div
                        class="bg-gray-900 p-4 rounded-lg border border-purple-500/30"
                    >
                        <h4 class="font-bold text-white mb-2">
                            Step 1: Install Starship (Cross-Platform)
                        </h4>
                        <div class="code-block text-xs">
                            curl -sS https://starship.rs/install.sh | sh
                        </div>
                        <p class="text-xs text-gray-500 mt-2">
                            Add `starship init zsh | source` to your
                            .zshrc
                        </p>
                    </div>
                    <div
                        class="bg-gray-900 p-4 rounded-lg border border-purple-500/30"
                    >
                        <h4 class="font-bold text-white mb-2">
                            Step 2: Install Modern Terminal Emulator
                        </h4>
                        <ul
                            class="text-sm text-gray-400 space-y-2 list-disc pl-5"
                        >
                            <li>
                                <strong>Mac:</strong>
                                <span class="text-cyan-400"
                                    >WezTerm</span
                                >
                                or Alacritty (`brew install --cask
                                wezterm`)
                            </li>
                            <li>
                                <strong>Windows:</strong>
                                <span class="text-blue-400"
                                    >Windows Terminal</span
                                >
                                (Default in Win 11)
                            </li>
                            <li>
                                <strong>Ubuntu:</strong>
                                <span class="text-orange-400"
                                    >Alacritty</span
                                >
                                (`sudo apt install alacritty`)
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<!-- SECTION 3: THE TOOLBELT (Tools & Timeline) -->
<section id="tools" class="container mx-auto px-6 py-16">
    <h2 class="text-3xl font-bold mb-8 flex items-center">
        <span
            class="bg-pink-500 text-white text-sm font-bold px-3 py-1 rounded mr-4"
            >03</span
        >
        Toolbelt Installation Pipeline
    </h2>
    <p class="text-gray-300 mb-12 max-w-3xl">
        The core productivity suite consists of <strong>Zed</strong> for
        speed, <strong>VS Code</strong> for ecosystem extensions,
        <strong>Ollama</strong> for local AI, and
        <strong>Brave</strong> for privacy-focused browsing.
    </p>
    <!-- Vertical Timeline CSS Implementation -->
    <div
        class="relative border-l-4 border-gray-700 ml-6 md:ml-12 space-y-12"
    >
        <!-- Item 1: Zed -->
        <div class="relative pl-8 md:pl-12">
            <div
                class="absolute -left-[14px] top-0 h-6 w-6 rounded-full bg-pink-500 border-4 border-gray-900"
            ></div>
            <div
                class="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-pink-500/10 transition-shadow"
            >
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-xl font-bold text-white">
                        High-Performance Editor: Zed
                    </h3>
                    <span
                        class="px-2 py-1 bg-gray-700 text-xs rounded text-pink-300"
                        >Rust-based</span
                    >
                </div>
                <p class="text-sm text-gray-400 mb-4">
                    Use for rapid editing, massive files, and
                    collaborative coding.
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <span class="text-xs font-bold text-gray-500"
                            >Mac</span
                        >
                        <div class="code-block text-xs">
                            brew install --cask zed
                        </div>
                    </div>
                    <div>
                        <span class="text-xs font-bold text-gray-500"
                            >Linux (Curl)</span
                        >
                        <div class="code-block text-xs">
                            curl -f https://zed.dev/install.sh | sh
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Item 2: VS Code -->
        <div class="relative pl-8 md:pl-12">
            <div
                class="absolute -left-[14px] top-0 h-6 w-6 rounded-full bg-blue-500 border-4 border-gray-900"
            ></div>
            <div class="bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 class="text-xl font-bold text-white mb-2">
                    Ecosystem Editor: VS Code
                </h3>
                <p class="text-sm text-gray-400 mb-4">
                    Essential for specific language extensions and
                    debugging.
                </p>
                <div class="code-block text-xs">
                    code --install-extension ms-python.python code
                    --install-extension esbenp.prettier-vscode
                </div>
            </div>
        </div>
        <!-- Item 3: Ollama -->
        <div class="relative pl-8 md:pl-12">
            <div
                class="absolute -left-[14px] top-0 h-6 w-6 rounded-full bg-white border-4 border-gray-900"
            ></div>
            <div class="bg-gray-800 rounded-lg p-6 shadow-lg">
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-xl font-bold text-white">
                        Local AI: Ollama
                    </h3>
                    <span
                        class="px-2 py-1 bg-gray-700 text-xs rounded text-white"
                        >LLM Runner</span
                    >
                </div>
                <p class="text-sm text-gray-400 mb-4">
                    Run Llama 3, Mistral, and coding models locally.
                </p>
                <div class="bg-black/50 p-4 rounded mb-4">
                    <span class="text-green-400">$</span> ollama run
                    llama3
                    <br />
                    <span class="text-gray-500"
                        >>>> System initialized. How can I help?</span
                    >
                </div>
                <div class="code-block text-xs">
                    # Mac/Linux curl -fsSL https://ollama.com/install.sh
                    | sh # Windows # Download installer from ollama.com
                </div>
            </div>
        </div>
        <!-- Item 4: Brave -->
        <div class="relative pl-8 md:pl-12">
            <div
                class="absolute -left-[14px] top-0 h-6 w-6 rounded-full bg-orange-500 border-4 border-gray-900"
            ></div>
            <div class="bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 class="text-xl font-bold text-white mb-2">
                    Browser: Brave
                </h3>
                <p class="text-sm text-gray-400 mb-4">
                    Setup Sync Chain immediately to restore
                    bookmarks/extensions without manual export.
                </p>
                <div
                    class="grid grid-cols-1 md:grid-cols-3 gap-2 text-center"
                >
                    <div class="bg-gray-700 p-2 rounded">
                        <div class="text-2xl">⚙️</div>
                        <div class="text-xs mt-1">Settings</div>
                    </div>
                    <div
                        class="text-gray-500 flex items-center justify-center"
                    >
                        →
                    </div>
                    <div class="bg-gray-700 p-2 rounded">
                        <div class="text-2xl">🔄</div>
                        <div class="text-xs mt-1">Sync</div>
                    </div>
                    <div
                        class="text-gray-500 flex items-center justify-center"
                    >
                        →
                    </div>
                    <div class="bg-gray-700 p-2 rounded">
                        <div class="text-2xl">🔗</div>
                        <div class="text-xs mt-1">Add Device</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<!-- SECTION 4: AUTOMATION & CONFIG (Dotfiles) -->
<section id="automation" class="bg-gray-800 py-16">
    <div class="container mx-auto px-6">
        <h2 class="text-3xl font-bold mb-8 flex items-center">
            <span
                class="bg-cyan-500 text-gray-900 text-sm font-bold px-3 py-1 rounded mr-4"
                >04</span
            >
            Persistence & Automation
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
                <h3 class="text-xl font-bold text-cyan-400 mb-4">
                    The "Dotfiles" Strategy
                </h3>
                <p class="text-gray-300 mb-6">
                    Never configure a machine manually twice. Store all
                    configs (`.zshrc`, `settings.json`,
                    `alacritty.toml`) in a Git repository and symlink
                    them.
                </p>
                <div
                    class="bg-gray-900 p-6 rounded-xl border border-gray-700"
                >
                    <h4 class="font-bold text-white mb-4">
                        Recommended Structure
                    </h4>
                    <ul class="space-y-3 text-sm text-gray-400">
                        <li class="flex items-center">
                            <span class="w-6 text-cyan-500">📂</span>
                            ~/dotfiles
                        </li>
                        <li class="flex items-center pl-6">
                            <span class="w-6 text-gray-500">├─</span> 📁
                            zsh/ (.zshrc)
                        </li>
                        <li class="flex items-center pl-6">
                            <span class="w-6 text-gray-500">├─</span> 📁
                            nvim/ (init.lua)
                        </li>
                        <li class="flex items-center pl-6">
                            <span class="w-6 text-gray-500">├─</span> 📁
                            scripts/ (install.sh)
                        </li>
                    </ul>
                    <div class="mt-6">
                        <p
                            class="text-xs font-bold text-gray-500 uppercase mb-1"
                        >
                            Restoration Command
                        </p>
                        <div class="code-block text-xs">
                            git clone
                            https://github.com/yourname/dotfiles.git cd
                            dotfiles && ./install.sh
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <h3 class="text-xl font-bold text-cyan-400 mb-4">
                    Config Management Breakdown
                </h3>
                <p class="text-xs text-center text-gray-400 mb-2">
                    Where time is spent during setup vs maintenance
                </p>
                <div class="chart-container">
                    <canvas id="configChart" role="img" aria-label="Illustrative developer workflow comparison chart">Illustrative comparison of developer workflows. These values are examples, not measured benchmarks.</canvas>
                </div>
            </div>
        </div>
    </div>
</section>
</div>
