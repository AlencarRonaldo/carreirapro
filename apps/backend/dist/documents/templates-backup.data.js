"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SIMPLE_TEMPLATES = void 0;
exports.SIMPLE_TEMPLATES = [
    {
        key: 'plain-default',
        name: 'Padrão Simples',
        body: `{{fullName}}\n{{headline}}\n\n{{content}}`,
        html: `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  @page { size: A4; margin: 3cm 2cm 2cm 3cm; }
  body { font-family: 'Times New Roman', Times, serif; color: #000; font-size: 12pt; line-height: 1.5; padding: 0; margin: 0; }
  .name { font-size: 14pt; font-weight: bold; }
  .headline { color: #555; margin-bottom: 16px; }
  .meta { font-size: 12px; color: #666; margin-bottom: 16px; }
  .meta-lines { margin: 8px 0 16px; }
  .meta-line { font-size: 12px; color: #666; margin: 2px 0; }
  .content { white-space: pre-wrap; line-height: 1.4; }
  .section { margin-top: 20px; }
  .item { margin: 6px 0; }
</style>
</head>
<body>
  <div class="name">{{fullName}}</div>
  <div class="headline">{{headline}}</div>
  <div class="meta-lines">
    <div class="meta-line">Email: {{email}}</div>
    <div class="meta-line">Telefone: {{phone}}</div>
    <div class="meta-line">Cidade: {{locationCity}} • {{locationState}} • {{locationCountry}}</div>
    <div class="meta-line">Estado civil: {{maritalStatus}}</div>
  </div>
  <div class="content">{{content}}</div>
  <div class="section">
    <div class="item"><strong>Experiências</strong></div>
    <div>{{experiences}}</div>
  </div>
  <div class="section">
    <div class="item"><strong>Escolaridade</strong></div>
    <div>{{education}}</div>
  </div>
  <div class="section">
    <div class="item"><strong>Skills</strong></div>
    <div>{{skills}}</div>
  </div>
</body>
</html>`,
        atsReady: true,
        premium: false,
    },
    {
        key: 'compact',
        name: 'Compacto',
        body: `{{fullName}} — {{headline}}\n\n{{content}}`,
        html: `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  @page { size: A4; margin: 3cm 2cm 2cm 3cm; }
  body { font-family: 'Times New Roman', Times, serif; color: #000; font-size: 12pt; line-height: 1.5; padding: 0; margin: 0; }
  h1 { font-size: 14pt; margin: 0; font-weight: bold; }
  h2 { font-size: 14px; margin: 4px 0 16px; color: #444; }
  .content { white-space: pre-wrap; line-height: 1.45; }
  .meta { font-size: 11px; color: #666; margin-bottom: 12px; }
  a { color: #0055cc; text-decoration: none; }
  a:hover { text-decoration: underline; }
  .section { margin-top: 16px; }
  .item { margin: 4px 0; }
}</style>
</head>
<body>
  <h1>{{fullName}}</h1>
  <h2>{{headline}}</h2>
  <div class="meta-lines">
    <div class="meta-line">Email: {{email}}</div>
    <div class="meta-line">Telefone: {{phone}}</div>
    <div class="meta-line">Cidade: {{locationCity}} • {{locationState}} • {{locationCountry}}</div>
    <div class="meta-line">Estado civil: {{maritalStatus}}</div>
  </div>
  <div class="content">{{content}}</div>
  <div class="section">
    <div class="item"><strong>Experiências</strong></div>
    <div>{{experiences}}</div>
  </div>
  <div class="section">
    <div class="item"><strong>Escolaridade</strong></div>
    <div>{{education}}</div>
  </div>
  <div class="section">
    <div class="item"><strong>Skills</strong></div>
    <div>{{skills}}</div>
  </div>
</body>
</html>`,
        atsReady: true,
        premium: false,
    },
    {
        key: 'modern-grid',
        name: 'Moderno (2 colunas)',
        body: `{{fullName}} — {{headline}}\n\n{{content}}`,
        html: `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  @page { size: A4; margin: 3cm 2cm 2cm 3cm; }
  body { font-family: 'Times New Roman', Times, serif; color: #000; font-size: 12pt; line-height: 1.5; padding: 0; margin: 0; }
  .name { font-size: 14pt; font-weight: bold; }
  .headline { color: #334155; margin: 6px 0 14px; font-weight: 500; }
  .meta { font-size: 12px; color: #475569; margin-bottom: 18px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: start; }
  .card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; background: #fff; }
  .sec-title { font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 8px; text-transform: uppercase; letter-spacing: .06em; }
  .content { white-space: pre-wrap; line-height: 1.5; }
  ul { margin: 0; padding-left: 18px; }
  a { color: #0ea5e9; text-decoration: none; }
  a:hover { text-decoration: underline; }
</style>
</head>
<body>
  <div class="name">{{fullName}}</div>
  <div class="headline">{{headline}}</div>
  <div class="meta-lines">
    <div class="meta-line">Email: {{email}}</div>
    <div class="meta-line">Telefone: {{phone}}</div>
    <div class="meta-line">Cidade: {{locationCity}} • {{locationState}} • {{locationCountry}}</div>
    <div class="meta-line">Estado civil: {{maritalStatus}}</div>
  </div>
  <div class="grid">
    <div class="card">
      <div class="sec-title">Resumo</div>
      <div class="content">{{content}}</div>
    </div>
    <div class="card">
      <div class="sec-title">Skills</div>
      <div>{{skills}}</div>
    </div>
    <div class="card">
      <div class="sec-title">Experiências</div>
      <div>{{experiences}}</div>
    </div>
    <div class="card">
      <div class="sec-title">Escolaridade</div>
      <div>{{education}}</div>
    </div>
  </div>
</body>
</html>`,
        atsReady: true,
        premium: true,
    },
    {
        key: 'minimal-clean',
        name: 'Minimalista Clean',
        body: `{{fullName}}\n{{headline}}\n\n{{content}}`,
        html: `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  * { box-sizing: border-box; }
  @page { size: A4; margin: 3cm 2cm 2cm 3cm; }
  body { font-family: 'Times New Roman', Times, serif; color: #000; font-size: 12pt; line-height: 1.5; padding: 0; margin: 0; }
  h1 { font-size: 14pt; margin: 0 0 4pt; font-weight: bold; }
  h2 { font-size: 13px; margin: 0 0 14px; color: #6b7280; font-weight: 600; }
  .bar { height: 2px; background: #e5e7eb; margin: 10px 0 18px; }
  .section { margin-bottom: 16px; }
  .label { font-size: 12px; color: #374151; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 6px; font-weight: 700; }
  .content { white-space: pre-wrap; line-height: 1.55; }
  .meta { font-size: 11px; color: #6b7280; margin-bottom: 12px; }
  a { color: #111827; text-decoration: none; border-bottom: 1px dotted #9ca3af; }
</style>
</head>
<body>
  <h1>{{fullName}}</h1>
  <h2>{{headline}}</h2>
  <div class="meta">{{locationCity}}, {{locationState}}, {{locationCountry}} • <a href="{{linkedin}}">LinkedIn</a> • <a href="{{github}}">GitHub</a> • <a href="{{website}}">Website</a></div>
  <div class="bar"></div>
  <div class="section">
    <div class="label">Resumo</div>
    <div class="content">{{content}}</div>
  </div>
  <div class="section">
    <div class="label">Experiências</div>
    <div>{{experiences}}</div>
  </div>
  <div class="section">
    <div class="label">Escolaridade</div>
    <div>{{education}}</div>
  </div>
  <div class="section">
    <div class="label">Skills</div>
    <div>{{skills}}</div>
  </div>
</body>
</html>`,
        atsReady: true,
        premium: false,
    },
    {
        key: 'ats-black-white',
        name: 'ATS Preto e Branco',
        body: `{{fullName}}\n{{headline}}\n\n{{content}}`,
        html: `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  @page { size: A4; margin: 3cm 2cm 2cm 3cm; }
  body { font-family: 'Times New Roman', Times, serif; color: #000; font-size: 12pt; line-height: 1.5; background: #fff; padding: 0; margin: 0; }
  .name { font-size: 14pt; font-weight: bold; }
  .headline { font-size: 12px; margin: 2px 0 10px; }
  .meta, .label { font-size: 11px; }
  .label { font-weight: bold; margin-top: 12px; }
  .content { white-space: pre-wrap; line-height: 1.4; font-size: 12px; }
  ul { margin: 0; padding-left: 16px; }
  a { color: #000; text-decoration: none; }
</style>
</head>
<body>
  <div class="name">{{fullName}}</div>
  <div class="headline">{{headline}}</div>
  <div class="meta-lines">
    <div class="meta-line">Email: {{email}}</div>
    <div class="meta-line">Telefone: {{phone}}</div>
    <div class="meta-line">Cidade: {{locationCity}} • {{locationState}} • {{locationCountry}}</div>
    <div class="meta-line">Estado civil: {{maritalStatus}}</div>
  </div>
  <div class="label">Resumo</div>
  <div class="content">{{content}}</div>
  <div class="label">Experiências</div>
  <div>{{experiences}}</div>
  <div class="label">Escolaridade</div>
  <div>{{education}}</div>
  <div class="label">Skills</div>
  <div>{{skills}}</div>
</body>
</html>`,
        atsReady: true,
        premium: false,
    },
    {
        key: 'professional-onepage',
        name: 'Profissional One-Page',
        body: `{{fullName}} — {{headline}}\n\n{{content}}`,
        html: `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  @page { size: A4; margin: 3cm 2cm 2cm 3cm; }
  body { font-family: 'Times New Roman', Times, serif; color: #000; font-size: 12pt; line-height: 1.5; background: #fff; padding: 0; margin: 0; }
  h1 { margin: 0; font-size: 14pt; font-weight: bold; }
  h2 { margin: 4px 0 0; font-size: 14px; color: #475569; font-weight: 600; }
  .meta { font-size: 12px; color: #64748b; margin: 12px 0 18px; }
  .section { margin-top: 16px; }
  .label { font-size: 12px; color: #0b1220; text-transform: uppercase; letter-spacing: .07em; font-weight: 800; margin-bottom: 6px; }
  .content { white-space: pre-wrap; line-height: 1.55; }
  a { color: #0ea5e9; text-decoration: none; }
  a:hover { text-decoration: underline; }
</style>
</head>
<body>
  <h1>{{fullName}}</h1>
  <h2>{{headline}}</h2>
  <div class="meta-lines">
    <div class="meta-line">Email: {{email}}</div>
    <div class="meta-line">Telefone: {{phone}}</div>
    <div class="meta-line">Cidade: {{locationCity}} • {{locationState}} • {{locationCountry}}</div>
    <div class="meta-line">Estado civil: {{maritalStatus}}</div>
  </div>
  <div class="section">
    <div class="label">Resumo</div>
    <div class="content">{{content}}</div>
  </div>
  <div class="section">
    <div class="label">Experiências</div>
    <div>{{experiences}}</div>
  </div>
  <div class="section">
    <div class="label">Escolaridade</div>
    <div>{{education}}</div>
  </div>
  <div class="section">
    <div class="label">Skills</div>
    <div>{{skills}}</div>
  </div>
</body>
</html>`,
        atsReady: true,
        premium: true,
    },
    {
        key: 'elegant-sidebar',
        name: 'Elegante com Sidebar',
        body: `{{fullName}} — {{headline}}\n\n{{content}}`,
        html: `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  * { box-sizing: border-box; }
  body { font-family: Inter, Arial, sans-serif; color: #0f172a; padding: 0; margin: 0; }
  .wrap { display: grid; grid-template-columns: 240px 1fr; min-height: 100vh; }
  .side { background: #f8fafc; padding: 24px; border-right: 1px solid #e2e8f0; }
  .main { padding: 28px; }
  .name { font-size: 22px; font-weight: 800; letter-spacing: -0.01em; }
  .headline { color: #475569; font-size: 12px; margin-top: 4px; font-weight: 600; }
  .sec { margin-top: 16px; }
  .label { font-size: 12px; color: #0f172a; text-transform: uppercase; letter-spacing: .08em; font-weight: 800; margin-bottom: 6px; }
  .content { white-space: pre-wrap; line-height: 1.5; }
  .meta, .link { font-size: 12px; color: #334155; }
  a { color: #0ea5e9; text-decoration: none; }
  a:hover { text-decoration: underline; }
</style>
</head>
<body>
  <div class="wrap">
    <aside class="side">
      <div class="name">{{fullName}}</div>
      <div class="headline">{{headline}}</div>
      <div class="sec">
        <div class="label">Contato</div>
        <div class="meta">{{locationCity}}, {{locationState}}, {{locationCountry}}</div>
        <div class="meta">Email: {{email}}</div>
        <div class="meta">Telefone: {{phone}}</div>
        <div class="meta"><a href="{{website}}">Website</a></div>
      </div>
      <div class="sec">
        <div class="label">Skills</div>
        <div>{{skills}}</div>
      </div>
    </aside>
    <main class="main">
      <div class="sec">
        <div class="label">Resumo</div>
        <div class="content">{{content}}</div>
      </div>
      <div class="sec">
        <div class="label">Experiências</div>
        <div>{{experiences}}</div>
      </div>
      <div class="sec">
        <div class="label">Escolaridade</div>
        <div>{{education}}</div>
      </div>
    </main>
  </div>
</body>
</html>`,
        atsReady: true,
        premium: true,
    },
    {
        key: 'technical-focus',
        name: 'Técnico (Skills em Destaque)',
        body: `{{fullName}} — {{headline}}\n\n{{content}}`,
        html: `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  body { font-family: Arial, sans-serif; color: #0b1220; padding: 24px; }
  .name { font-size: 24px; font-weight: 800; }
  .headline { color: #475569; margin: 6px 0 10px; font-weight: 600; }
  .meta { font-size: 12px; color: #64748b; margin-bottom: 12px; }
  .grid { display: grid; grid-template-columns: 1.2fr .8fr; gap: 16px; }
  .label { font-size: 12px; color: #0b1220; text-transform: uppercase; letter-spacing: .06em; font-weight: 800; margin-bottom: 6px; }
  .section { margin-top: 8px; }
  .content { white-space: pre-wrap; line-height: 1.55; }
  a { color: #0ea5e9; text-decoration: none; }
  a:hover { text-decoration: underline; }
  .card { border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; background: #fff; }
  ul { margin: 0; padding-left: 18px; }
  li { margin: 4px 0; }
  
</style>
</head>
<body>
  <div class="name">{{fullName}}</div>
  <div class="headline">{{headline}}</div>
  <div class="meta-lines">
    <div class="meta-line">Email: {{email}}</div>
    <div class="meta-line">Telefone: {{phone}}</div>
    <div class="meta-line">Cidade: {{locationCity}} • {{locationState}} • {{locationCountry}}</div>
    <div class="meta-line">Estado civil: {{maritalStatus}}</div>
  </div>
  <div class="grid">
    <div>
      <div class="card section">
        <div class="label">Resumo</div>
        <div class="content">{{content}}</div>
      </div>
      <div class="card section">
        <div class="label">Experiências</div>
        <div>{{experiences}}</div>
      </div>
      <div class="card section">
        <div class="label">Escolaridade</div>
        <div>{{education}}</div>
      </div>
    </div>
    <div>
      <div class="card section">
        <div class="label">Skills</div>
        <div>{{skills}}</div>
      </div>
    </div>
  </div>
</body>
</html>`,
        atsReady: true,
        premium: true,
    },
    {
        key: 'timeline-clean',
        name: 'Timeline Clean',
        body: `{{fullName}} — {{headline}}\n\n{{content}}`,
        html: `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  body { font-family: Arial, sans-serif; color: #0b1220; padding: 28px; }
  .name { font-size: 26px; font-weight: 800; }
  .headline { color: #475569; margin: 6px 0 14px; font-weight: 600; }
  .meta { font-size: 12px; color: #64748b; margin-bottom: 18px; }
  .label { font-size: 12px; color: #0b1220; text-transform: uppercase; letter-spacing: .07em; font-weight: 800; margin: 20px 0 8px; }
  .content { white-space: pre-wrap; line-height: 1.55; }
  .tl { border-left: 2px solid #e2e8f0; margin-left: 8px; padding-left: 16px; }
  .tl .item { margin: 10px 0; }
  a { color: #0ea5e9; text-decoration: none; }
  a:hover { text-decoration: underline; }
</style>
</head>
<body>
  <div class="name">{{fullName}}</div>
  <div class="headline">{{headline}}</div>
  <div class="meta">{{locationCity}}, {{locationState}}, {{locationCountry}} • <a href="{{linkedin}}">LinkedIn</a> • <a href="{{github}}">GitHub</a> • <a href="{{website}}">Website</a></div>
  <div class="label">Resumo</div>
  <div class="content">{{content}}</div>
  <div class="label">Experiências</div>
  <div class="tl">{{experiences}}</div>
  <div class="label">Escolaridade</div>
  <div class="tl">{{education}}</div>
  <div class="label">Skills</div>
  <div>{{skills}}</div>
</body>
</html>`,
        atsReady: true,
        premium: true,
    },
    {
        key: 'modern-accent',
        name: 'Moderno com Acento',
        body: `{{fullName}} — {{headline}}\n\n{{content}}`,
        html: `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  * { box-sizing: border-box; }
  body { font-family: Inter, Arial, sans-serif; color: #0b1220; padding: 0; margin: 0; }
  .bar { height: 6px; background: #0ea5e9; }
  .wrap { padding: 24px; }
  .name { font-size: 26px; font-weight: 900; letter-spacing: -0.02em; }
  .headline { color: #475569; margin: 6px 0 12px; font-weight: 600; }
  .meta { font-size: 12px; color: #64748b; margin-bottom: 16px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; background: #fff; }
  .label { font-size: 12px; color: #0b1220; text-transform: uppercase; letter-spacing: .08em; font-weight: 800; margin-bottom: 6px; }
  .content { white-space: pre-wrap; line-height: 1.55; }
  a { color: #0ea5e9; text-decoration: none; }
  a:hover { text-decoration: underline; }
</style>
</head>
<body>
  <div class="bar"></div>
  <div class="wrap">
    <div class="name">{{fullName}}</div>
    <div class="headline">{{headline}}</div>
    <div class="meta">{{locationCity}}, {{locationState}}, {{locationCountry}} • <a href="{{linkedin}}">LinkedIn</a> • <a href="{{github}}">GitHub</a> • <a href="{{website}}">Website</a></div>
    <div class="grid">
      <div class="card">
        <div class="label">Resumo</div>
        <div class="content">{{content}}</div>
      </div>
      <div class="card">
        <div class="label">Skills</div>
        <div>{{skills}}</div>
      </div>
      <div class="card" style="grid-column: span 2;">
        <div class="label">Experiências</div>
        <div>{{experiences}}</div>
      </div>
      <div class="card" style="grid-column: span 2;">
        <div class="label">Escolaridade</div>
        <div>{{education}}</div>
      </div>
    </div>
  </div>
</body>
</html>`,
        atsReady: true,
        premium: true,
    },
    {
        key: 'abnt-classic',
        name: 'ABNT Clássico (A4, PB)',
        body: `{{fullName}}\n{{headline}}\n\n{{content}}`,
        html: `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  @page { size: A4; margin: 3cm 2cm 2cm 3cm; }
  body { font-family: 'Times New Roman', Times, serif; color: #000; font-size: 12pt; line-height: 1.5; text-align: justify; }
  h1 { font-size: 14pt; margin: 0 0 8pt; font-weight: bold; text-align: left; }
  h2 { font-size: 12pt; margin: 14pt 0 6pt; font-weight: bold; text-transform: uppercase; }
  .meta { font-size: 11pt; margin-bottom: 8pt; }
  ul { margin: 0; padding-left: 16pt; }
  a { color: #000; text-decoration: none; }
  .sep { height: 1px; background: #000; opacity: .1; margin: 6pt 0 10pt; }
  .content { white-space: pre-wrap; }
  .label { font-weight: bold; }
  .block { margin-top: 10pt; }
  
</style>
</head>
<body>
  <h1>{{fullName}}</h1>
  <div class="meta">{{locationCity}}, {{locationState}}, {{locationCountry}} • LinkedIn: {{linkedin}} • GitHub: {{github}} • Site: {{website}}</div>
  <div class="sep"></div>
  <h2>Resumo</h2>
  <div class="content">{{content}}</div>

  <h2>Experiências</h2>
  <ul>{{experiences}}</ul>

  <h2>Escolaridade</h2>
  <ul>{{education}}</ul>

  <h2>Habilidades</h2>
  <ul>{{skills}}</ul>
</body>
</html>`,
        atsReady: true,
        premium: true,
    },
    {
        key: 'ti-ats',
        name: 'TI • ATS (Skills primeiro)',
        body: `{{fullName}} — {{headline}}\n\n{{content}}`,
        html: `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  body { font-family: Arial, sans-serif; color: #0b1220; padding: 24px; }
  .name { font-size: 24px; font-weight: 800; }
  .headline { color: #475569; margin: 6px 0 10px; font-weight: 600; }
  .meta { font-size: 12px; color: #64748b; margin-bottom: 12px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .label { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 6px; }
  .card { border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; background: #fff; }
  .content { white-space: pre-wrap; line-height: 1.55; }
</style>
</head>
<body>
  <div class="name">{{fullName}}</div>
  <div class="headline">{{headline}}</div>
  <div class="meta">{{locationCity}}, {{locationState}}, {{locationCountry}} • <a href="{{linkedin}}">LinkedIn</a> • <a href="{{github}}">GitHub</a> • <a href="{{website}}">Website</a></div>
  <div class="grid">
    <div class="card">
      <div class="label">Habilidades Técnicas</div>
      <div>{{skills}}</div>
    </div>
    <div class="card">
      <div class="label">Resumo</div>
      <div class="content">{{content}}</div>
    </div>
    <div class="card" style="grid-column: span 2;">
      <div class="label">Experiências</div>
      <div>{{experiences}}</div>
    </div>
    <div class="card" style="grid-column: span 2;">
      <div class="label">Escolaridade</div>
      <div>{{education}}</div>
    </div>
  </div>
</body>
</html>`,
        atsReady: true,
        premium: true,
    },
    {
        key: 'marketing-metrics',
        name: 'Marketing • Métricas',
        body: `{{fullName}} — {{headline}}\n\n{{content}}`,
        html: `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  body { font-family: Arial, sans-serif; color: #111; padding: 28px; }
  .name { font-size: 24px; font-weight: 800; }
  .headline { color: #444; margin: 4px 0 12px; }
  .meta { font-size: 12px; color: #666; margin-bottom: 12px; }
  .label { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 6px; }
  .section { margin-top: 14px; }
  .content { white-space: pre-wrap; line-height: 1.55; }
</style>
</head>
<body>
  <div class="name">{{fullName}}</div>
  <div class="headline">{{headline}}</div>
  <div class="meta">{{locationCity}}, {{locationState}}, {{locationCountry}} • {{email}} • {{phone}}</div>
  <div class="section">
    <div class="label">Resumo</div>
    <div class="content">{{content}}</div>
  </div>
  <div class="section">
    <div class="label">Campanhas e Experiências</div>
    <div>{{experiences}}</div>
  </div>
  <div class="section">
    <div class="label">Escolaridade</div>
    <div>{{education}}</div>
  </div>
  <div class="section">
    <div class="label">Ferramentas e Habilidades</div>
    <div>{{skills}}</div>
  </div>
</body>
</html>`,
        atsReady: true,
        premium: true,
    },
    {
        key: 'healthcare-clinical',
        name: 'Saúde • Clínico',
        body: `{{fullName}} — {{headline}}\n\n{{content}}`,
        html: `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  body { font-family: Arial, sans-serif; color: #111; padding: 28px; }
  .name { font-size: 24px; font-weight: 800; }
  .headline { color: #444; margin: 4px 0 12px; }
  .meta { font-size: 12px; color: #666; margin-bottom: 12px; }
  .label { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 6px; }
  .section { margin-top: 14px; }
  .content { white-space: pre-wrap; line-height: 1.55; }
</style>
</head>
<body>
  <div class="name">{{fullName}}</div>
  <div class="headline">{{headline}}</div>
  <div class="meta">{{locationCity}}, {{locationState}}, {{locationCountry}} • {{email}} • {{phone}}</div>
  <div class="section">
    <div class="label">Formação Acadêmica</div>
    <div>{{education}}</div>
  </div>
  <div class="section">
    <div class="label">Experiência Clínica</div>
    <div>{{experiences}}</div>
  </div>
  <div class="section">
    <div class="label">Habilidades</div>
    <div>{{skills}}</div>
  </div>
  <div class="section">
    <div class="label">Resumo</div>
    <div class="content">{{content}}</div>
  </div>
</body>
</html>`,
        atsReady: true,
        premium: true,
    },
    {
        key: 'engineering-projects',
        name: 'Engenharia • Projetos',
        body: `{{fullName}} — {{headline}}\n\n{{content}}`,
        html: `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  body { font-family: Arial, sans-serif; color: #111; padding: 28px; }
  .name { font-size: 24px; font-weight: 800; }
  .headline { color: #444; margin: 4px 0 12px; }
  .meta { font-size: 12px; color: #666; margin-bottom: 12px; }
  .label { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 6px; }
  .section { margin-top: 14px; }
  .content { white-space: pre-wrap; line-height: 1.55; }
</style>
</head>
<body>
  <div class="name">{{fullName}}</div>
  <div class="headline">{{headline}}</div>
  <div class="meta">{{locationCity}}, {{locationState}}, {{locationCountry}} • <a href="{{linkedin}}">LinkedIn</a> • <a href="{{github}}">GitHub</a></div>
  <div class="section">
    <div class="label">Resumo</div>
    <div class="content">{{content}}</div>
  </div>
  <div class="section">
    <div class="label">Projetos e Experiências</div>
    <div>{{experiences}}</div>
  </div>
  <div class="section">
    <div class="label">Escolaridade</div>
    <div>{{education}}</div>
  </div>
  <div class="section">
    <div class="label">Habilidades Técnicas</div>
    <div>{{skills}}</div>
  </div>
</body>
</html>`,
        atsReady: true,
        premium: true,
    },
    {
        key: 'education-teaching',
        name: 'Escolaridade • Docência',
        body: `{{fullName}} — {{headline}}\n\n{{content}}`,
        html: `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  body { font-family: Arial, sans-serif; color: #111; padding: 28px; }
  .name { font-size: 24px; font-weight: 800; }
  .headline { color: #444; margin: 4px 0 12px; }
  .meta { font-size: 12px; color: #666; margin-bottom: 12px; }
  .label { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 6px; }
  .section { margin-top: 14px; }
  .content { white-space: pre-wrap; line-height: 1.55; }
</style>
</head>
<body>
  <div class="name">{{fullName}}</div>
  <div class="headline">{{headline}}</div>
  <div class="meta">{{locationCity}}, {{locationState}}, {{locationCountry}} • <a href="{{linkedin}}">LinkedIn</a> • <a href="{{website}}">Website</a></div>
  <div class="section">
    <div class="label">Objetivo / Resumo</div>
    <div class="content">{{content}}</div>
  </div>
  <div class="section">
    <div class="label">Formação Acadêmica</div>
    <div>{{education}}</div>
  </div>
  <div class="section">
    <div class="label">Experiência em Sala de Aula</div>
    <div>{{experiences}}</div>
  </div>
  <div class="section">
    <div class="label">Habilidades Pedagógicas</div>
    <div>{{skills}}</div>
  </div>
</body>
</html>`,
        atsReady: true,
        premium: true,
    },
    {
        key: 'sales-targets',
        name: 'Vendas • Metas',
        body: `{{fullName}} — {{headline}}\n\n{{content}}`,
        html: `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  body { font-family: Arial, sans-serif; color: #111; padding: 28px; }
  .name { font-size: 24px; font-weight: 800; }
  .headline { color: #444; margin: 4px 0 12px; }
  .meta { font-size: 12px; color: #666; margin-bottom: 12px; }
  .label { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 6px; }
  .section { margin-top: 14px; }
  .content { white-space: pre-wrap; line-height: 1.55; }
</style>
</head>
<body>
  <div class="name">{{fullName}}</div>
  <div class="headline">{{headline}}</div>
  <div class="meta">{{locationCity}}, {{locationState}}, {{locationCountry}} • <a href="{{linkedin}}">LinkedIn</a></div>
  <div class="section">
    <div class="label">Resumo</div>
    <div class="content">{{content}}</div>
  </div>
  <div class="section">
    <div class="label">Experiência em Vendas</div>
    <div>{{experiences}}</div>
  </div>
  <div class="section">
    <div class="label">Escolaridade</div>
    <div>{{education}}</div>
  </div>
  <div class="section">
    <div class="label">Habilidades</div>
    <div>{{skills}}</div>
  </div>
</body>
</html>`,
        atsReady: true,
        premium: true,
    },
    {
        key: 'design-portfolio',
        name: 'Design • Portfólio',
        body: `{{fullName}} — {{headline}}\n\n{{content}}`,
        html: `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  body { font-family: Arial, sans-serif; color: #0b1220; padding: 28px; }
  .name { font-size: 26px; font-weight: 900; letter-spacing: -0.02em; }
  .headline { color: #475569; margin: 6px 0 12px; font-weight: 600; }
  .meta { font-size: 12px; color: #64748b; margin-bottom: 16px; }
  .label { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 6px; }
  .content { white-space: pre-wrap; line-height: 1.55; }
  a { color: #0ea5e9; text-decoration: none; }
  a:hover { text-decoration: underline; }
</style>
</head>
<body>
  <div class="name">{{fullName}}</div>
  <div class="headline">{{headline}}</div>
  <div class="meta">Email: {{email}} • Telefone: {{phone}}</div>
  <div class="label">Resumo</div>
  <div class="content">{{content}}</div>
  <div class="label" style="margin-top:14px;">Experiências</div>
  <div>{{experiences}}</div>
    <div class="label" style="margin-top:14px;">Escolaridade</div>
  <div>{{education}}</div>
  <div class="label" style="margin-top:14px;">Habilidades</div>
  <div>{{skills}}</div>
</body>
</html>`,
        atsReady: true,
        premium: true,
    },
    {
        key: 'data-science-projects',
        name: 'Data Science • Projetos',
        body: `{{fullName}} — {{headline}}\n\n{{content}}`,
        html: `<!doctype html><html><head><meta charset="utf-8" /><style>
  body{font-family:Arial,sans-serif;color:#0b1220;padding:24px}
  .name{font-size:24px;font-weight:900;letter-spacing:-.02em}
  .headline{color:#475569;margin:6px 0 10px;font-weight:600}
  .meta{font-size:12px;color:#64748b;margin-bottom:12px}
  .grid{display:grid;grid-template-columns:1.2fr .8fr;gap:16px}
  .card{border:1px solid #e2e8f0;border-radius:8px;padding:12px;background:#fff}
  .label{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px}
  .content{white-space:pre-wrap;line-height:1.55}
  a{color:#0ea5e9;text-decoration:none}
</style></head><body>
  <div class="name">{{fullName}}</div>
  <div class="headline">{{headline}}</div>
  <div class="meta">{{locationCity}}, {{locationState}}, {{locationCountry}} • {{email}} • {{phone}}</div>
  <div class="card"><div class="label">Resumo</div><div class="content">{{content}}</div></div>
  <div class="grid" style="margin-top:12px">
    <div class="card"><div class="label">Projetos e Resultados (Métricas)</div><div>{{experiences}}</div></div>
    <div class="card"><div class="label">Stack e Habilidades</div><div>{{skills}}</div><div class="label" style="margin-top:10px">Escolaridade</div><div>{{education}}</div></div>
  </div>
</body></html>`,
        atsReady: true,
        premium: true,
    },
    {
        key: 'devops-infra',
        name: 'DevOps • Infraestrutura',
        body: `{{fullName}} — {{headline}}\n\n{{content}}`,
        html: `<!doctype html><html><head><meta charset="utf-8" /><style>
  *{box-sizing:border-box}
  body{font-family:Arial,sans-serif;color:#0b1220;margin:0}
  .wrap{display:grid;grid-template-columns:260px 1fr;min-height:100vh}
  .side{background:#0f172a0d;padding:20px;border-right:1px solid #e2e8f0}
  .main{padding:24px}
  .name{font-size:22px;font-weight:900}
  .headline{color:#475569;margin-top:2px;font-weight:600}
  .label{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;margin:12px 0 6px}
  .content{white-space:pre-wrap;line-height:1.55}
  a{color:#0ea5e9;text-decoration:none}
</style></head><body>
  <div class="wrap">
    <aside class="side">
      <div class="name">{{fullName}}</div>
      <div class="headline">{{headline}}</div>
       <div class="label">Contato</div>
       <div>Email: {{email}}</div>
       <div>Telefone: {{phone}}</div>
      <div class="label">Stack / Ferramentas</div>
      <div>{{skills}}</div>
    </aside>
    <main class="main">
      <div class="label">Resumo</div>
      <div class="content">{{content}}</div>
      <div class="label">Experiências (Infra/Cloud)</div>
      <div>{{experiences}}</div>
      <div class="label">Escolaridade</div>
      <div>{{education}}</div>
    </main>
  </div>
</body></html>`,
        atsReady: true,
        premium: true,
    },
    {
        key: 'admin-office',
        name: 'Administrativo • Escritório',
        body: `{{fullName}} — {{headline}}\n\n{{content}}`,
        html: `<!doctype html><html><head><meta charset="utf-8" /><style>
  body{font-family:Arial,sans-serif;color:#111;padding:28px}
  .name{font-size:22px;font-weight:800}
  .headline{color:#444;margin:4px 0 12px}
  .meta{font-size:12px;color:#666;margin-bottom:12px}
  .label{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px}
  .section{margin-top:14px}
  .content{white-space:pre-wrap;line-height:1.55}
</style></head><body>
  <div class="name">{{fullName}}</div>
  <div class="headline">{{headline}}</div>
  <div class="meta">{{locationCity}}, {{locationState}}, {{locationCountry}} • {{email}} • {{phone}}</div>
  <div class="section"><div class="label">Resumo</div><div class="content">{{content}}</div></div>
  <div class="section"><div class="label">Habilidades</div><div>{{skills}}</div></div>
  <div class="section"><div class="label">Experiência Profissional</div><div>{{experiences}}</div></div>
  <div class="section"><div class="label">Formação Acadêmica</div><div>{{education}}</div></div>
</body></html>`,
        atsReady: true,
        premium: true,
    },
    {
        key: 'finance-accounting',
        name: 'Financeiro • Contabilidade',
        body: `{{fullName}} — {{headline}}\n\n{{content}}`,
        html: `<!doctype html><html><head><meta charset="utf-8" /><style>
  body{font-family:Arial,sans-serif;color:#111;padding:24px}
  .name{font-size:24px;font-weight:900}
  .headline{color:#444;margin:4px 0 12px}
  .meta{font-size:12px;color:#666;margin-bottom:12px}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .card{border:1px solid #e2e8f0;border-radius:6px;padding:12px;background:#fff}
  .label{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px}
  .content{white-space:pre-wrap;line-height:1.55}
</style></head><body>
  <div class="name">{{fullName}}</div>
  <div class="headline">{{headline}}</div>
  <div class="meta">{{locationCity}}, {{locationState}}, {{locationCountry}} • {{email}} • {{phone}}</div>
  <div class="grid">
    <div class="card"><div class="label">Experiências</div><div>{{experiences}}</div></div>
    <div class="card"><div class="label">Habilidades e Ferramentas</div><div>{{skills}}</div><div class="label" style="margin-top:10px">Resumo</div><div class="content">{{content}}</div></div>
    <div class="card" style="grid-column:span 2"><div class="label">Escolaridade</div><div>{{education}}</div></div>
  </div>
</body></html>`,
        atsReady: true,
        premium: true,
    },
    {
        key: 'legal-advocate',
        name: 'Jurídico • Advogado',
        body: `{{fullName}} — {{headline}}\n\n{{content}}`,
        html: `<!doctype html><html><head><meta charset="utf-8" /><style>
  body{font-family:Arial,sans-serif;color:#111;padding:26px}
  .name{font-size:22px;font-weight:900}
  .headline{color:#444;margin:2px 0 10px}
  .meta{font-size:12px;color:#666;margin-bottom:12px}
  .label{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;margin:14px 0 6px}
  .timeline{border-left:2px solid #e2e8f0;margin-left:6px;padding-left:14px}
  .content{white-space:pre-wrap;line-height:1.55}
  a{color:#0ea5e9;text-decoration:none}
</style></head><body>
  <div class="name">{{fullName}}</div>
  <div class="headline">{{headline}}</div>
  <div class="meta">{{locationCity}}, {{locationState}}, {{locationCountry}} • {{email}} • {{phone}}</div>
  <div class="label">Formação</div>
  <div class="timeline">{{education}}</div>
  <div class="label">Experiência Jurídica</div>
  <div class="timeline">{{experiences}}</div>
  <div class="label">Competências</div>
  <div>{{skills}}</div>
  <div class="label">Resumo</div>
  <div class="content">{{content}}</div>
</body></html>`,
        atsReady: true,
        premium: true,
    },
    {
        key: 'retail-service',
        name: 'Varejo • Atendimento',
        body: `{{fullName}} — {{headline}}\n\n{{content}}`,
        html: `<!doctype html><html><head><meta charset="utf-8" /><style>
  body{font-family:Arial,sans-serif;color:#111;padding:24px}
  .name{font-size:22px;font-weight:900}
  .headline{color:#444;margin:4px 0 10px}
  .meta{font-size:12px;color:#666;margin-bottom:12px}
  .card{border:1px solid #e5e7eb;border-radius:6px;padding:12px;background:#fff;margin-top:12px}
  .label{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px}
  .content{white-space:pre-wrap;line-height:1.55}
</style></head><body>
  <div class="name">{{fullName}}</div>
  <div class="headline">{{headline}}</div>
  <div class="meta">{{locationCity}}, {{locationState}}, {{locationCountry}} • {{email}} • {{phone}}</div>
  <div class="card"><div class="label">Habilidades</div><div>{{skills}}</div></div>
  <div class="card"><div class="label">Experiência</div><div>{{experiences}}</div></div>
  <div class="card"><div class="label">Escolaridade</div><div>{{education}}</div></div>
  <div class="card"><div class="label">Resumo</div><div class="content">{{content}}</div></div>
</body></html>`,
        atsReady: true,
        premium: true,
    },
    {
        key: 'hospitality-tourism',
        name: 'Hotelaria • Turismo',
        body: `{{fullName}} — {{headline}}\n\n{{content}}`,
        html: `<!doctype html><html><head><meta charset="utf-8" /><style>
  *{box-sizing:border-box}
  body{font-family:Arial,sans-serif;color:#111;margin:0}
  .bar{height:6px;background:#0ea5e9}
  .wrap{padding:24px}
  .name{font-size:22px;font-weight:900}
  .headline{color:#444;margin:4px 0 10px}
  .meta{font-size:12px;color:#666;margin-bottom:12px}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .card{border:1px solid #e5e7eb;border-radius:6px;padding:12px;background:#fff}
  .label{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px}
  .content{white-space:pre-wrap;line-height:1.55}
</style></head><body>
  <div class="bar"></div>
  <div class="wrap">
    <div class="name">{{fullName}}</div>
    <div class="headline">{{headline}}</div>
    <div class="meta">{{locationCity}}, {{locationState}}, {{locationCountry}} • <a href="{{linkedin}}">LinkedIn</a></div>
    <div class="grid">
      <div class="card"><div class="label">Resumo</div><div class="content">{{content}}</div></div>
      <div class="card"><div class="label">Habilidades de Hospitalidade</div><div>{{skills}}</div></div>
      <div class="card" style="grid-column:span 2"><div class="label">Experiência</div><div>{{experiences}}</div></div>
      <div class="card" style="grid-column:span 2"><div class="label">Escolaridade</div><div>{{education}}</div></div>
    </div>
  </div>
</body></html>`,
        atsReady: true,
        premium: true,
    },
    {
        key: 'product-manager',
        name: 'Produto • PM',
        body: `{{fullName}} — {{headline}}\n\n{{content}}`,
        html: `<!doctype html><html><head><meta charset="utf-8" /><style>
  *{box-sizing:border-box}
  body{font-family:Arial,sans-serif;color:#0b1220;margin:0}
  .bar{height:6px;background:#10b981}
  .wrap{padding:24px}
  .name{font-size:24px;font-weight:900;letter-spacing:-.02em}
  .headline{color:#475569;margin:6px 0 10px;font-weight:600}
  .meta{font-size:12px;color:#64748b;margin-bottom:12px}
  .label{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;margin:12px 0 6px}
  .content{white-space:pre-wrap;line-height:1.55}
</style></head><body>
  <div class="bar"></div>
  <div class="wrap">
    <div class="name">{{fullName}}</div>
    <div class="headline">{{headline}}</div>
    <div class="meta">{{locationCity}}, {{locationState}}, {{locationCountry}} • <a href="{{linkedin}}">LinkedIn</a> • <a href="{{website}}">Website</a></div>
    <div class="label">Experiências (Resultados/KPIs)</div>
    <div>{{experiences}}</div>
    <div class="label">Competências de Produto</div>
    <div>{{skills}}</div>
    <div class="label">Resumo</div>
    <div class="content">{{content}}</div>
    <div class="label">Escolaridade</div>
    <div>{{education}}</div>
  </div>
</body></html>`,
        atsReady: true,
        premium: true,
    },
];
//# sourceMappingURL=templates-backup.data.js.map