// typer script

document.addEventListener('DOMContentLoaded', function() {
    let currentCommandIndex = 0;
    let commands = [];
    let typed = null;

    async function loadCommands() {
        try {
            const response = await fetch('commands.json');
            const data = await response.json();
            commands = data.commands;
            initTyped();
        } catch (error) {
            console.error('Error loading commands:', error);
            commands = [
                { command: "/tk https://youtube.com/watch?v=example", delay: 1000, blackbox: ["Error loading commands"] }
            ];
            initTyped();
        }
    }

    function updateBlackbox(content) {
        const blackbox = document.querySelector('.blackbox');
        blackbox.innerHTML = content.map(line => `<div>${line}</div>`).join('');
    }

    function updateStatus(status, pulse) {
        const statusBox = document.querySelector('.status-box');
        if (status) {
            statusBox.textContent = status;
            statusBox.classList.add('active');
            if (pulse) {
                statusBox.classList.add('pulse');
            } else {
                statusBox.classList.remove('pulse');
            }
        } else {
            statusBox.classList.remove('active', 'pulse');
        }
    }

    function initTyped() {
        if (typed) {
            typed.destroy();
        }

        const currentCommand = commands[currentCommandIndex];
        updateBlackbox(currentCommand.blackbox);
        updateStatus(currentCommand.status || '', currentCommand.statusPulse);

        typed = new Typed('#typed-text', {
            strings: [currentCommand.command, ''],
            typeSpeed: 50,
            backSpeed: 15,
            showCursor: true,
            cursorChar: '█',
            backDelay: currentCommand.delay,
            loop: false,
            onComplete: function() {
                currentCommandIndex = (currentCommandIndex + 1) % commands.length;
                setTimeout(initTyped, 100); // Small delay before starting next command
            }
        });
    }

    loadCommands();
});
