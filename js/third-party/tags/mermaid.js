document.addEventListener('page:loaded', async () => {
  await NexT.utils.getScript(CONFIG.mermaid.js, {
    condition: window.mermaid
  });

  const initMermaidTheme = () => {
    const isDark = document.body.classList.contains('darkmode--activated');
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? CONFIG.mermaid.theme.dark : CONFIG.mermaid.theme.light,
      logLevel: 4,
      flowchart: { curve: 'linear' },
      gantt: { axisFormat: '%m/%d/%Y' },
      sequence: { actorMargin: 50 }
    });
  };

  const renderMermaid = async () => {
    initMermaidTheme();

    const rawElements = document.querySelectorAll('pre > code.mermaid');
    if (!rawElements.length) return;

    rawElements.forEach(element => {
      const originalCode = element.textContent.trim();
      const mermaidDiv = document.createElement('div');
      mermaidDiv.className = 'mermaid';
      mermaidDiv.textContent = originalCode;

      const box = document.createElement('div');
      box.className = 'code-container';
      box.dataset.mermaidCode = originalCode;
      box.appendChild(mermaidDiv);

      if (CONFIG.codeblock.copy_button.enable) {
        NexT.utils.registerCopyButton(box, box, originalCode);
      }

      const preElement = element.parentNode;
      preElement.parentNode.replaceChild(box, preElement);
    });

    await mermaid.run();
  };

  await renderMermaid();

  const observer = new MutationObserver(async () => {
    document.querySelectorAll('.code-container').forEach(container => {
      const originalCode = container.dataset.mermaidCode;
      if (!originalCode) return;

      const oldMermaid = container.querySelector('.mermaid');
      if (!oldMermaid) return;

      const newMermaid = document.createElement('div');
      newMermaid.className = 'mermaid';
      newMermaid.dataset.mermaidCode = originalCode;
      newMermaid.textContent = originalCode;

      oldMermaid.replaceWith(newMermaid);
    });

    initMermaidTheme();
    await mermaid.run();
  });

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class']
  });
});