(() => {
  const lessons = Array.isArray(window.PATHLINE_LESSONS) ? window.PATHLINE_LESSONS : [];
  const byId = new Map(lessons.map((lesson) => [lesson.id, lesson]));
  const TRACKS = [
    ["python", "Python"],
    ["django", "Django"],
    ["project", "Projects"],
    ["practice", "Practice"],
    ["reference", "Reference"],
    ["lab", "Labs"],
  ];
  const DONE_KEY = "pathline-done";
  const THEME_KEY = "pathline-theme";
  const stage = document.getElementById("stage");
  const nav = document.getElementById("nav");
  const search = document.getElementById("search");
  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("backdrop");

  const done = new Set(loadDone());
  applyTheme(localStorage.getItem(THEME_KEY) || "light");

  const KEYWORDS = new Set(
    "False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield match case type lazy".split(" ")
  );
  const BUILTINS = new Set(
    "abs all any ascii bin bool breakpoint bytearray bytes callable chr classmethod compile complex delattr dict dir divmod enumerate eval exec filter float format frozenset frozendict getattr globals hasattr hash help hex id input int isinstance issubclass iter len list locals map max memoryview min next object oct open ord pow print property range repr reversed round set setattr slice sorted staticmethod str sum super tuple type vars zip sentinel".split(" ")
  );

  function loadDone() {
    try {
      const parsed = JSON.parse(localStorage.getItem(DONE_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveDone() {
    localStorage.setItem(DONE_KEY, JSON.stringify([...done]));
    renderProgress();
    renderNav(search.value.trim());
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme === "dark" ? "dark" : "light";
    localStorage.setItem(THEME_KEY, document.documentElement.dataset.theme);
    const button = document.getElementById("theme-btn");
    if (button) button.textContent = document.documentElement.dataset.theme === "dark" ? "Light" : "Dark";
  }

  function esc(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function inline(raw) {
    let text = esc(raw);
    text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
    text = text.replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
    return text;
  }

  function highlightPython(code) {
    let i = 0;
    let html = "";
    const n = code.length;
    const wordChar = (ch) => /[A-Za-z0-9_]/.test(ch || "");

    while (i < n) {
      const stringStart = readString(code, i);
      if (stringStart) {
        html += `<span class="tok-s">${esc(code.slice(i, stringStart))}</span>`;
        i = stringStart;
        continue;
      }
      if (code[i] === "#") {
        let j = i;
        while (j < n && code[j] !== "\n") j += 1;
        html += `<span class="tok-c">${esc(code.slice(i, j))}</span>`;
        i = j;
        continue;
      }
      if (code[i] === "@") {
        let j = i + 1;
        while (j < n && /[A-Za-z0-9_.]/.test(code[j])) j += 1;
        html += `<span class="tok-b">${esc(code.slice(i, j))}</span>`;
        i = j;
        continue;
      }
      if (/[0-9]/.test(code[i]) && !wordChar(code[i - 1])) {
        let j = i;
        while (j < n && /[0-9_]/.test(code[j])) j += 1;
        if (code[j] === "." && /[0-9]/.test(code[j + 1] || "")) {
          j += 1;
          while (j < n && /[0-9_]/.test(code[j])) j += 1;
        }
        if (code[j] === "e" || code[j] === "E") {
          const mark = j;
          j += 1;
          if (code[j] === "+" || code[j] === "-") j += 1;
          while (j < n && /[0-9_]/.test(code[j])) j += 1;
          if (j === mark + 1) j = mark;
        }
        html += `<span class="tok-n">${esc(code.slice(i, j))}</span>`;
        i = j;
        continue;
      }
      if (/[A-Za-z_]/.test(code[i])) {
        let j = i + 1;
        while (j < n && wordChar(code[j])) j += 1;
        const word = code.slice(i, j);
        const cls = KEYWORDS.has(word) ? "tok-k" : BUILTINS.has(word) ? "tok-b" : "";
        html += cls ? `<span class="${cls}">${esc(word)}</span>` : esc(word);
        i = j;
        continue;
      }
      html += esc(code[i]);
      i += 1;
    }
    return html;
  }

  function readString(code, i) {
    let k = i;
    let prefix = "";
    while (k < code.length && "rRbBuUfFtT".includes(code[k]) && prefix.length < 3) {
      prefix += code[k];
      k += 1;
    }
    if (!prefixLooksReal(prefix) || (code[k] !== '"' && code[k] !== "'")) return 0;
    const quote = code[k];
    const triple = code.slice(k, k + 3) === quote.repeat(3);
    let j = k + (triple ? 3 : 1);
    const end = triple ? quote.repeat(3) : quote;
    while (j < code.length) {
      if (!triple && code[j] === "\n") return 0;
      if (code.startsWith(end, j) && !escaped(code, j)) return j + end.length;
      j += 1;
    }
    return code.length;
  }

  function prefixLooksReal(prefix) {
    if (!prefix) return true;
    const flags = new Set(prefix.toLowerCase());
    if (flags.size !== prefix.length) return false;
    return [...flags].every((ch) => "rbuft".includes(ch));
  }

  function escaped(code, index) {
    let slashes = 0;
    for (let p = index - 1; p >= 0 && code[p] === "\\"; p -= 1) slashes += 1;
    return slashes % 2 === 1;
  }

  function highlight(code, lang) {
    if (lang === "python" || lang === "py" || lang === "pycon") return highlightPython(code);
    if (lang === "django" || lang === "htmldjango") {
      return esc(code)
        .replace(/\{#([\s\S]*?)#\}/g, '<span class="tok-c">{#$1#}</span>')
        .replace(/\{%([\s\S]*?)%\}/g, '<span class="tok-k">{%$1%}</span>')
        .replace(/\{\{([\s\S]*?)\}\}/g, '<span class="tok-s">{{$1}}</span>');
    }
    if (lang === "html") {
      return esc(code).replace(/(&lt;\/?)([\w:-]+)/g, '$1<span class="tok-k">$2</span>');
    }
    return esc(code);
  }

  function renderMarkdown(md) {
    const lines = md.replace(/\r\n/g, "\n").split("\n");
    const blocks = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (!line.trim()) {
        i += 1;
        continue;
      }
      if (line.startsWith("```")) {
        const lang = line.slice(3).trim().toLowerCase() || "text";
        const body = [];
        i += 1;
        while (i < lines.length && !lines[i].startsWith("```")) {
          body.push(lines[i]);
          i += 1;
        }
        i += 1;
        blocks.push(codeBlock(body.join("\n"), lang));
        continue;
      }
      if (line.startsWith(":::")) {
        const kind = line.slice(3).trim().toLowerCase();
        const body = [];
        i += 1;
        while (i < lines.length && lines[i].trim() !== ":::") {
          body.push(lines[i]);
          i += 1;
        }
        i += 1;
        blocks.push(kind === "quiz" ? quizBlock(body) : callout(kind, body.join("\n")));
        continue;
      }
      if (line.startsWith("|") && lines[i + 1] && /^\|\s*-+/.test(lines[i + 1])) {
        const rows = [];
        while (i < lines.length && lines[i].startsWith("|")) {
          rows.push(lines[i]);
          i += 1;
        }
        blocks.push(table(rows));
        continue;
      }
      if (/^#{1,3} /.test(line)) {
        const level = Math.min(line.match(/^#+/)[0].length, 3);
        const text = line.replace(/^#+\s+/, "");
        const id = slug(text);
        blocks.push(`<h${level} id="${id}">${inline(text)}</h${level}>`);
        i += 1;
        continue;
      }
      if (/^(- |\* |\d+\. )/.test(line)) {
        const ordered = /^\d+\. /.test(line);
        const items = [];
        while (i < lines.length && /^(- |\* |\d+\. )/.test(lines[i])) {
          items.push(lines[i].replace(/^(- |\* |\d+\. )/, ""));
          i += 1;
        }
        const tag = ordered ? "ol" : "ul";
        blocks.push(`<${tag}>${items.map((item) => `<li>${inline(item)}</li>`).join("")}</${tag}>`);
        continue;
      }
      if (line.startsWith("> ")) {
        const quote = [];
        while (i < lines.length && lines[i].startsWith("> ")) {
          quote.push(lines[i].slice(2));
          i += 1;
        }
        const joined = quote.join(" ");
        const tagged = joined.match(/^(TIP|WHY|WATCH|TRY|SOLUTION):\s*([\s\S]*)$/i);
        if (tagged) blocks.push(callout(tagged[1].toLowerCase(), tagged[2]));
        else blocks.push(`<blockquote class="callout"><p>${inline(joined)}</p></blockquote>`);
        continue;
      }
      const para = [line];
      i += 1;
      while (i < lines.length && lines[i].trim() && !blockStart(lines[i])) {
        para.push(lines[i]);
        i += 1;
      }
      blocks.push(`<p>${inline(para.join(" "))}</p>`);
    }
    return `<div class="prose">${blocks.join("\n")}</div>`;
  }

  function blockStart(line) {
    return (
      line.startsWith("```") ||
      line.startsWith(":::") ||
      line.startsWith("|") ||
      line.startsWith("> ") ||
      /^#{1,3} /.test(line) ||
      /^(- |\* |\d+\. )/.test(line)
    );
  }

  function slug(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
  }

  function callout(kind, body) {
    const labels = {
      tip: "Tip",
      why: "Why this works",
      watch: "Watch this",
      try: "Try this",
      solution: "Solution",
      note: "Note",
      keyword: "Keyword",
    };
    const label = labels[kind] || "Note";
    const inner = renderMarkdown(body).replace(/^<div class="prose">|<\/div>$/g, "");
    if (kind === "solution") {
      return `<details class="callout solution"><summary>${label}</summary>${inner}</details>`;
    }
    return `<aside class="callout ${esc(kind)}"><span class="label">${label}</span>${inner}</aside>`;
  }

  function quizBlock(lines) {
    const question = [];
    const choices = [];
    let why = "";
    lines.forEach((line) => {
      if (line.startsWith("+ ") || line.startsWith("- ")) choices.push(line);
      else if (line.toLowerCase().startsWith("because:")) why = line.slice(8).trim();
      else if (line.trim()) question.push(line);
    });
    const answer = choices.findIndex((choice) => choice.startsWith("+ "));
    const buttons = choices
      .map((choice, index) => `<button type="button" class="choice" data-choice="${index}">${inline(choice.slice(2))}</button>`)
      .join("");
    return `<div class="quiz" data-answer="${answer}"><p class="quiz-q">${inline(question.join(" "))}</p>${buttons}<p class="quiz-why" hidden>${inline(why)}</p></div>`;
  }

  function table(rows) {
    const cells = (row) => row.split("|").slice(1, -1).map((cell) => cell.trim());
    const head = cells(rows[0]);
    const body = rows.slice(2).map(cells);
    return `<table><thead><tr>${head.map((cell) => `<th>${inline(cell)}</th>`).join("")}</tr></thead><tbody>${body
      .map((row) => `<tr>${row.map((cell) => `<td>${inline(cell)}</td>`).join("")}</tr>`)
      .join("")}</tbody></table>`;
  }

  function codeBlock(code, lang) {
    const runnable = lang === "python";
    const label = { python: "Python", py: "Python", pycon: "REPL", django: "Django template", html: "HTML", bash: "Shell", powershell: "PowerShell", text: "Text", json: "JSON", ini: "Config" }[lang] || lang;
    return `<div class="frame"><div class="frame-bar"><span>${esc(label)}</span><span class="frame-actions">${
      runnable ? '<button type="button" data-run>Run</button>' : ""
    }<button type="button" data-copy>Copy</button></span></div><pre><code data-lang="${esc(lang)}">${highlight(code, lang)}</code></pre></div>`;
  }

  function groupsFor(track) {
    const groups = [];
    lessons
      .filter((lesson) => lesson.track === track)
      .forEach((lesson) => {
        let group = groups.find((item) => item.module === lesson.module);
        if (!group) {
          group = { module: lesson.module, lessons: [] };
          groups.push(group);
        }
        group.lessons.push(lesson);
      });
    return groups;
  }

  function renderNav(query) {
    if (!lessons.length) {
      nav.innerHTML = '<p class="empty">Course data did not load. Run <code>python tools/build_course.py</code> and reload.</p>';
      return;
    }
    if (query) {
      const needle = query.toLowerCase();
      const hits = lessons
        .filter((lesson) =>
          [lesson.title, lesson.summary, lesson.module, lesson.keywords.join(" "), lesson.md]
            .join("\n")
            .toLowerCase()
            .includes(needle)
        )
        .slice(0, 40);
      nav.innerHTML = `<div class="results">${
        hits.length
          ? hits.map((lesson) => `<a class="result-link" href="#/lesson/${lesson.id}"><b>${esc(lesson.title)}</b><small>${esc(lesson.module)}</small></a>`).join("")
          : '<p class="empty">No lessons match that search.</p>'
      }</div>`;
      return;
    }
    const current = currentLesson();
    nav.innerHTML = TRACKS.map(([id, label]) => {
      const groups = groupsFor(id);
      if (!groups.length) return "";
      return `<p class="nav-track">${label}</p>${groups
        .map((group) => {
          const open = current && current.module === group.module ? " open" : "";
          return `<details class="module"${open}><summary>${esc(group.module)}</summary>${group.lessons
            .map((lesson) => {
              const active = current && current.id === lesson.id ? " active" : "";
              const mark = done.has(lesson.id) ? "✓" : "○";
              return `<a class="lesson-link${active}" href="#/lesson/${lesson.id}"><span class="tick">${mark}</span><span>${esc(lesson.title)}<small>${lesson.minutes} min · ${esc(lesson.level)}</small></span></a>`;
            })
            .join("")}</details>`;
        })
        .join("")}`;
    }).join("");
  }

  function renderProgress() {
    const label = document.getElementById("progress-label");
    const bar = document.getElementById("progress-bar");
    const count = lessons.filter((lesson) => done.has(lesson.id)).length;
    label.textContent = `${count} of ${lessons.length} lessons`;
    bar.style.width = lessons.length ? `${(count / lessons.length) * 100}%` : "0";
  }

  function currentLesson() {
    const match = location.hash.match(/^#\/lesson\/([^/]+)/);
    return match ? byId.get(decodeURIComponent(match[1])) : null;
  }

  function route() {
    const hash = location.hash || "#/home";
    closeSidebar();
    if (hash.startsWith("#/lesson/")) {
      const lesson = currentLesson();
      if (!lesson) renderMissing();
      else renderLesson(lesson);
    } else renderHome();
    renderNav(search.value.trim());
    window.scrollTo(0, 0);
  }

  function renderMissing() {
    document.title = "Lesson not found — Pathline";
    stage.innerHTML = `<article class="reading"><h1>That lesson is not on this path.</h1><p><a href="#/home">Back to the start</a></p></article>`;
  }

  function renderHome() {
    document.title = "Pathline — Python and Django, from zero to production";
    document.getElementById("crumb").textContent = "Start";
    const minutes = lessons.reduce((sum, lesson) => sum + lesson.minutes, 0);
    const pythonCount = lessons.filter((lesson) => lesson.track === "python").length;
    const djangoCount = lessons.filter((lesson) => lesson.track === "django").length;
    const projectCount = lessons.filter((lesson) => lesson.track === "project").length;
    const practiceCount = lessons.filter((lesson) => lesson.track === "practice").length;
    const lastId = localStorage.getItem("pathline-last");
    const last = byId.get(lastId);
    const first = lessons.find((lesson) => lesson.track === "python");
    stage.innerHTML = `
      <section class="hero">
        <p class="kicker">A complete local course · Python 3.15 · Django 6.1</p>
        <h1>Learn Python, then build real sites with Django.</h1>
        <p class="lede">This path is for someone who has never programmed, and it keeps going until you can design, secure, test, and deploy a Django application. Every keyword is named. The hidden rules — name binding, mutability, the request journey, when the ORM hits the database — are taught on purpose, not left as surprises.</p>
        <div class="hero-actions">
          <a class="btn" href="#/lesson/${first ? first.id : ""}">Start at lesson one</a>
          ${last ? `<a class="btn secondary" href="#/lesson/${last.id}">Continue: ${esc(last.title)}</a>` : ""}
        </div>
        <ul class="stats">
          <li><strong>${lessons.length}</strong><span>lessons, labs, and references</span></li>
          <li><strong>${pythonCount}</strong><span>Python lessons</span></li>
          <li><strong>${djangoCount}</strong><span>Django lessons</span></li>
          <li><strong>${projectCount}</strong><span>projects, beginner to pro</span></li>
          <li><strong>${practiceCount}</strong><span>logic lessons, tasks, and cheat codes</span></li>
          <li><strong>${Math.round(minutes / 60)}</strong><span>hours if you read straight through</span></li>
        </ul>
      </section>
      <section class="grid-3">
        <article class="card"><h3>1. Read it in order</h3><p>The sidebar is the syllabus. Finish a lesson, mark it done, and open the next one. Search when you need a keyword later.</p></article>
        <article class="card"><h3>2. Run the Python</h3><p>Blocks labeled Python have a Run button. They execute in your browser. Fragments and Django code are for your editor, where the full project lives.</p></article>
        <article class="card"><h3>3. Build the projects</h3><p>The Projects track is a ladder: guessing games, then files and tests, then Django sites, then a team app with an API and a deploy checklist. Finished Python programs live in <code>labs/projects</code>.</p></article>
        <article class="card"><h3>4. Practice the logic</h3><p>The Practice track teaches how to turn a sentence into steps, then gives tasks with solutions and cheat-code pages for the shapes you look up while you work.</p></article>
      </section>
      <h2 class="section-title">How the course is covered</h2>
      <section class="grid-2">
        <article class="card">
          <h3>Python, from the first name to the import system</h3>
          <p>Syntax, every keyword, data types, control flow, functions, modules, files, exceptions, OOP, protocols, typing, tests, concurrency, asyncio, packaging, and the 3.14 / 3.15 additions: t-strings, lazy imports, <code>frozendict</code>, and <code>sentinel</code>.</p>
        </article>
        <article class="card">
          <h3>Django, from a URL to a deployed app</h3>
          <p>Projects, settings, URLs, views, templates, models, migrations, the ORM, admin, forms, class-based views, auth, security, tests, REST, tasks, cache, channels, and deployment. Django 6 partials, CSP, tasks, fetch modes, and mailers are included.</p>
        </article>
      </section>
      <h2 class="section-title">Syllabus</h2>
      ${TRACKS.map(([id, label]) => {
        const items = lessons.filter((lesson) => lesson.track === id);
        if (!items.length) return "";
        return `<h3>${label}</h3><ol class="home-list">${items
          .map((lesson) => `<li><a href="#/lesson/${lesson.id}">${esc(lesson.title)}</a></li>`)
          .join("")}</ol>`;
      }).join("")}
      <article class="card continue">
        <p>Official language and framework specs stay the source of truth: <a href="https://docs.python.org/3/" target="_blank" rel="noopener">Python docs</a> and <a href="https://docs.djangoproject.com/en/stable/" target="_blank" rel="noopener">Django docs</a>. This course teaches them in an order a person can finish.</p>
      </article>`;
  }

  function renderLesson(lesson) {
    document.title = `${lesson.title} — Pathline`;
    document.getElementById("crumb").textContent = `${trackLabel(lesson.track)} · ${lesson.module}`;
    localStorage.setItem("pathline-last", lesson.id);
    const index = lessons.indexOf(lesson);
    const prev = lessons[index - 1];
    const next = lessons[index + 1];
    const body = renderMarkdown(lesson.md);
    const headings = [...body.matchAll(/<h([23]) id="([^"]+)">([\s\S]*?)<\/h\1>/g)];
    stage.innerHTML = `
      <div class="layout">
        <article class="reading">
          <div class="lesson-kicker">
            <span class="pill">${esc(lesson.level)}</span>
            <span class="pill pine">${esc(trackLabel(lesson.track))}</span>
            <span class="pill copper">${lesson.minutes} min</span>
          </div>
          <h1>${esc(lesson.title)}</h1>
          <p class="summary">${esc(lesson.summary)}</p>
          <div class="lesson-tools">
            <button type="button" class="text-btn done-btn" id="done-btn" aria-pressed="${done.has(lesson.id)}">${done.has(lesson.id) ? "Completed" : "Mark lesson complete"}</button>
          </div>
          ${body}
          <div class="keywords">${lesson.keywords.map((word) => `<span>${esc(word)}</span>`).join("")}</div>
          <nav class="pager" aria-label="Lesson pager">
            ${prev ? `<a href="#/lesson/${prev.id}"><small>Previous</small>${esc(prev.title)}</a>` : "<span></span>"}
            ${next ? `<a href="#/lesson/${next.id}"><small>Next</small>${esc(next.title)}</a>` : "<span></span>"}
          </nav>
        </article>
        <aside class="toc">
          <p>On this page</p>
          ${headings.map((match) => `<a href="#${match[2]}">${match[3].replace(/<[^>]+>/g, "")}</a>`).join("") || "<span class='empty'>No subsections</span>"}
        </aside>
      </div>`;
    document.getElementById("done-btn").addEventListener("click", () => {
      if (done.has(lesson.id)) done.delete(lesson.id);
      else done.add(lesson.id);
      saveDone();
      document.getElementById("done-btn").textContent = done.has(lesson.id) ? "Completed" : "Mark lesson complete";
      document.getElementById("done-btn").setAttribute("aria-pressed", String(done.has(lesson.id)));
    });
  }

  function trackLabel(id) {
    return (TRACKS.find((track) => track[0] === id) || [id, id])[1];
  }

  function closeSidebar() {
    sidebar.classList.remove("open");
    backdrop.hidden = true;
  }

  async function runCode(button) {
    const frame = button.closest(".frame");
    const code = frame.querySelector("code").textContent;
    button.disabled = true;
    button.textContent = "Loading…";
    let panel = frame.querySelector(".run-out");
    if (!panel) {
      panel = document.createElement("pre");
      panel.className = "run-out";
      frame.appendChild(panel);
    }
    panel.textContent = "Starting the Python runner. The first run downloads it.";
    try {
      const pyodide = await ensurePyodide();
      let output = "";
      pyodide.setStdout({ batched: (text) => { output += `${text}\n`; } });
      pyodide.setStderr({ batched: (text) => { output += `${text}\n`; } });
      const result = await pyodide.runPythonAsync(code);
      if (result !== undefined && String(result) !== "undefined" && String(result) !== "None") {
        output += `${result}\n`;
      }
      panel.textContent = output.trimEnd() || "(no output)";
    } catch (error) {
      panel.textContent = String(error && error.message ? error.message : error);
    } finally {
      button.disabled = false;
      button.textContent = "Run";
    }
  }

  async function ensurePyodide() {
    if (window.__pathlinePyodide) return window.__pathlinePyodide;
    if (!window.loadPyodide) {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js";
        script.onload = resolve;
        script.onerror = () => reject(new Error("The Python runner could not be downloaded. Check your connection, or run the example on your computer."));
        document.head.appendChild(script);
      });
    }
    window.__pathlinePyodide = await window.loadPyodide();
    return window.__pathlinePyodide;
  }

  document.getElementById("menu-btn").addEventListener("click", () => {
    sidebar.classList.add("open");
    backdrop.hidden = false;
  });
  document.getElementById("sidebar-close").addEventListener("click", closeSidebar);
  backdrop.addEventListener("click", closeSidebar);
  document.getElementById("theme-btn").addEventListener("click", () => {
    applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  });
  document.getElementById("reset-progress").addEventListener("click", () => {
    if (confirm("Clear every lesson you marked complete?")) {
      done.clear();
      saveDone();
    }
  });
  search.addEventListener("input", () => renderNav(search.value.trim()));
  window.addEventListener("hashchange", route);
  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && document.activeElement !== search) {
      event.preventDefault();
      search.focus();
    }
  });
  stage.addEventListener("click", async (event) => {
    const copy = event.target.closest("[data-copy]");
    if (copy) {
      const text = copy.closest(".frame").querySelector("code").textContent;
      await navigator.clipboard.writeText(text);
      copy.textContent = "Copied";
      setTimeout(() => { copy.textContent = "Copy"; }, 1200);
      return;
    }
    const run = event.target.closest("[data-run]");
    if (run) {
      await runCode(run);
      return;
    }
    const choice = event.target.closest(".choice");
    if (choice) {
      const quiz = choice.closest(".quiz");
      const correct = Number(quiz.dataset.answer);
      [...quiz.querySelectorAll(".choice")].forEach((button, index) => {
        button.classList.toggle("good", index === correct);
        button.classList.toggle("bad", button === choice && index !== correct);
        button.disabled = true;
      });
      const why = quiz.querySelector(".quiz-why");
      if (why.textContent.trim()) why.hidden = false;
    }
  });

  renderProgress();
  if (!location.hash) location.hash = "#/home";
  route();
})();
