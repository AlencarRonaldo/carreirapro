import { Injectable } from '@nestjs/common';

export interface ParsedResume {
  // Informações pessoais
  fullName?: string;
  email?: string;
  phone?: string;
  headline?: string;
  locationCity?: string;
  locationState?: string;
  locationCountry?: string;
  maritalStatus?: string;
  linkedin?: string;
  github?: string;
  website?: string;

  // Experiências
  experiences?: Array<{
    title: string;
    company: string;
    startDate?: string | null;
    endDate?: string | null;
    description?: string | null;
  }>;

  // Educação
  education?: Array<{
    institution: string;
    degree: string;
    startDate?: string | null;
    endDate?: string | null;
  }>;

  // Habilidades
  skills?: string[];
}

@Injectable()
export class ResumeParserService {
  /**
   * Analisa texto extraído de um currículo e retorna dados estruturados
   */
  parseResumeText(text: string): ParsedResume {
    const result: ParsedResume = {};

    // Divide o texto em linhas e limpa
    const rawLines = text.split(/\n|\r/).map((s) =>
      s
        .replace(/[\u2022\u25CF\u25A0\u2219]/g, '•')
        .replace(/\s+/g, ' ')
        .trim(),
    );
    const lines = rawLines.filter(Boolean);

    // Helper para encontrar primeira linha que corresponde
    const findFirst = (
      predicate: (s: string, i: number) => boolean,
    ): { line: string; index: number } | null => {
      for (let i = 0; i < lines.length; i++) {
        if (predicate(lines[i], i)) return { line: lines[i], index: i };
      }
      return null;
    };

    // Helper para converter mês PT->MM
    const mapMonth = (m: string): string => {
      const mm = m.toLowerCase();
      const dict: Record<string, string> = {
        janeiro: '01',
        fevereiro: '02',
        março: '03',
        marco: '03',
        abril: '04',
        maio: '05',
        junho: '06',
        julho: '07',
        agosto: '08',
        setembro: '09',
        outubro: '10',
        novembro: '11',
        dezembro: '12',
        jan: '01',
        fev: '02',
        mar: '03',
        abr: '04',
        mai: '05',
        jun: '06',
        jul: '07',
        ago: '08',
        set: '09',
        out: '10',
        nov: '11',
        dez: '12',
      };
      return dict[mm] || '01';
    };

    // 1. INFORMAÇÕES PESSOAIS

    // Email
    const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    if (emailMatch) result.email = emailMatch[0];

    // Telefone (múltiplos formatos)
    const phonePatterns = [
      /\+?55\s*\d{2}\s*9?\d{4}[\s-]?\d{4}/g, // BR com código país
      /\(\d{2}\)\s*9?\d{4}[\s-]?\d{4}/g, // BR com DDD
      /\d{2}\s*9?\d{4}[\s-]?\d{4}/g, // BR simples
      /\+?\d[\d\s()\-]{7,}\d/g, // Genérico
    ];

    for (const pattern of phonePatterns) {
      const phoneMatch = text.match(pattern);
      if (phoneMatch) {
        result.phone = phoneMatch[0];
        break;
      }
    }

    // Nome (primeiras linhas significativas)
    const nameCandidate = findFirst(
      (s) =>
        /^[A-Za-zÀ-ÿ]{2,}\s+[A-Za-zÀ-ÿ]{2,}/.test(s) &&
        s.length <= 120 &&
        !/@/.test(s) &&
        !/\d{4}/.test(s),
    );
    if (nameCandidate) {
      result.fullName = nameCandidate.line;
    }

    // Headline/Cargo atual (linha após o nome)
    if (nameCandidate) {
      const headlineCandidate = findFirst(
        (s, i) =>
          i > nameCandidate.index &&
          i < nameCandidate.index + 3 &&
          /[A-Za-zÀ-ÿ]{3,}/.test(s) &&
          !/@/.test(s) &&
          s.length <= 150,
      );
      if (headlineCandidate) {
        result.headline = headlineCandidate.line;
      }
    }

    // Estado civil
    const maritalPatterns =
      /(solteir[oa]|casad[oa]|viúv[oa]|divorciad[oa]|uni[ãa]o\s+est[áa]vel)/i;
    const maritalMatch = lines.find((l) => maritalPatterns.test(l));
    if (maritalMatch) {
      const match = maritalMatch.match(maritalPatterns);
      if (match) result.maritalStatus = match[0];
    }

    // Localização (cidade, estado, país)
    const cityPatterns = [
      // Cidades brasileiras comuns
      /(S[ãa]o\s+Paulo|Rio\s+de\s+Janeiro|Belo\s+Horizonte|Bras[íi]lia|Salvador|Fortaleza|Curitiba|Recife|Porto\s+Alegre|Manaus|Bel[ée]m|Goi[âa]nia|Guarulhos|Campinas|Santos|Osasco|Ribeir[ãa]o\s+Preto)/i,
      // Padrão genérico cidade - estado
      /([A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇ][a-záàâãéèêíïóôõöúçñ\s]+)\s*[–,]\s*([A-Z]{2})\b/,
      // Com Brasil
      /([A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇ][a-záàâãéèêíïóôõöúçñ\s]+)\s*[–,]\s*Brasil/i,
    ];

    for (const pattern of cityPatterns) {
      const locationMatch = text.match(pattern);
      if (locationMatch) {
        if (pattern.source.includes('A-Z]{2}')) {
          // Cidade - Estado
          result.locationCity = locationMatch[1].trim();
          result.locationState = locationMatch[2].trim();
          result.locationCountry = 'Brasil';
        } else if (pattern.source.includes('Brasil')) {
          result.locationCity = locationMatch[1].trim();
          result.locationCountry = 'Brasil';
        } else {
          result.locationCity = locationMatch[0];
          result.locationCountry = 'Brasil';
        }
        break;
      }
    }

    // Links (LinkedIn, GitHub, Website)
    const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
    if (linkedinMatch) result.linkedin = `https://${linkedinMatch[0]}`;

    const githubMatch = text.match(/github\.com\/[\w-]+/i);
    if (githubMatch) result.github = `https://${githubMatch[0]}`;

    const websiteMatch = text.match(
      /https?:\/\/(?!linkedin|github)[a-z0-9.-]+\.[a-z]{2,}/i,
    );
    if (websiteMatch) result.website = websiteMatch[0];

    // 2. EXPERIÊNCIAS PROFISSIONAIS
    result.experiences = this.parseExperiences(lines, text, mapMonth);

    // 3. EDUCAÇÃO
    result.education = this.parseEducation(lines, text, mapMonth);

    // 4. HABILIDADES
    result.skills = this.parseSkills(lines, text);

    return result;
  }

  private parseExperiences(
    lines: string[],
    text: string,
    mapMonth: (m: string) => string,
  ): ParsedResume['experiences'] {
    const experiences: NonNullable<ParsedResume['experiences']> = [];

    // Palavras-chave expandidas para cargos
    const roleKeywords = [
      /\b(atendente|auxiliar|assistente|analista|coordenador|gerente|supervisor|diretor)\b/i,
      /\b(t[eé]cnico|especialista|consultor|desenvolvedor|programador|designer)\b/i,
      /\b(vendedor|operador|recep[cç]ionista|secret[aá]ri[oa]|administrador)\b/i,
      /\b(engenheir[oa]|professor|instrutor|enfermeiro|m[eé]dico|advogado)\b/i,
      /\b(contador|auditor|arquiteto|jornalista|redator|editor)\b/i,
      /\b(est[aá]gi[aá]rio|trainee|junior|j[úu]nior|pleno|s[eê]nior|senior)\b/i,
      /\b(CEO|CFO|CTO|CMO|COO|CLT|PJ|MEI)\b/i,
    ];

    // Encontra seção de experiências
    const expHeaderIdx = lines.findIndex((l) =>
      /(experi[eê]ncia|profissional|trabalho|emprego|hist[óo]rico\s+profissional|atua[çc][ãa]o)/i.test(
        l,
      ),
    );

    const startIdx = expHeaderIdx >= 0 ? expHeaderIdx + 1 : 0;
    const endIdx = lines.findIndex(
      (l, i) =>
        i > startIdx &&
        /^(forma[cç][aã]o|educa[cç][aã]o|escolaridade|habilidades|compet[eê]ncias|cursos)/i.test(
          l,
        ),
    );

    const searchEnd = endIdx > 0 ? endIdx : lines.length;

    for (let i = startIdx; i < searchEnd && experiences.length < 15; i++) {
      const line = lines[i];

      // Verifica se é um cargo
      let isRole = false;
      for (const pattern of roleKeywords) {
        if (pattern.test(line)) {
          isRole = true;
          break;
        }
      }

      // Também considera linhas que parecem cargos (formato comum)
      if (
        !isRole &&
        /^[A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇ][a-záàâãéèêíïóôõöúçñ\s]+(\s+(de|em|na|no)\s+)/i.test(
          line,
        )
      ) {
        isRole = true;
      }

      if (isRole) {
        const title = line.replace(/^[•\-]\s*/, '').trim();

        // Busca empresa nas linhas próximas
        let company = '';
        let description = '';
        let startDate: string | null = null;
        let endDate: string | null = null;

        // Procura empresa (geralmente vem antes ou depois do cargo)
        const contextLines = [
          ...lines.slice(Math.max(0, i - 2), i),
          ...lines.slice(i + 1, Math.min(i + 5, searchEnd)),
        ];

        // Padrões de empresas
        const companyPatterns = [
          /\b(ltda|ltd|s\.?a\.?|inc|corp|eireli|me|epp|company|empresa|grupo|indústria|comércio|hospital|clínica|escola|universidade|faculdade|instituto)\b/i,
          /^[A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇ][A-Za-záàâãéèêíïóôõöúçñ\s&.]+$/,
        ];

        for (const contextLine of contextLines) {
          if (company) break;
          for (const pattern of companyPatterns) {
            if (
              pattern.test(contextLine) &&
              contextLine.length <= 150 &&
              !/@/.test(contextLine)
            ) {
              company = contextLine.replace(/^[•\-]\s*/, '').trim();
              break;
            }
          }
        }

        // Busca datas
        const dateContext = contextLines.join(' ');

        // Múltiplos formatos de data
        const dateFormats = [
          {
            pattern:
              /(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)[a-z]*\.?\s*\/?\s*(\d{4})/gi,
            parse: (matches: RegExpMatchArray[]) => ({
              start: matches[0]
                ? `${matches[0][2]}-${mapMonth(matches[0][1])}-01`
                : null,
              end: matches[1]
                ? `${matches[1][2]}-${mapMonth(matches[1][1])}-01`
                : null,
            }),
          },
          {
            pattern: /(\d{1,2})\/(\d{4})/g,
            parse: (matches: RegExpMatchArray[]) => ({
              start: matches[0]
                ? `${matches[0][2]}-${matches[0][1].padStart(2, '0')}-01`
                : null,
              end: matches[1]
                ? `${matches[1][2]}-${matches[1][1].padStart(2, '0')}-01`
                : null,
            }),
          },
          {
            pattern: /(\d{4})\s*[-–a]\s*(\d{4}|atual|presente)/gi,
            parse: (matches: RegExpMatchArray[]) => ({
              start: matches[0] ? `${matches[0][1]}-01-01` : null,
              end:
                matches[0] &&
                matches[0][2] &&
                !/atual|presente/i.test(matches[0][2])
                  ? `${matches[0][2]}-12-31`
                  : null,
            }),
          },
        ];

        for (const format of dateFormats) {
          const matches = Array.from(dateContext.matchAll(format.pattern));
          if (matches.length > 0) {
            const dates = format.parse(matches);
            startDate = dates.start;
            endDate = dates.end;
            break;
          }
        }

        // Busca descrição das atividades
        const descLines: string[] = [];
        for (let j = i + 1; j < Math.min(i + 6, searchEnd); j++) {
          const descLine = lines[j];

          // Para se encontrar outro cargo ou seção
          if (roleKeywords.some((rx) => rx.test(descLine))) break;
          if (
            /^(forma[cç][aã]o|educa[cç][aã]o|compet[eê]ncias)/i.test(descLine)
          )
            break;
          if (companyPatterns.some((p) => p.test(descLine))) continue;

          // Adiciona linhas que parecem descrição
          if (descLine.length > 10 && descLine.length < 500) {
            if (/^[•\-]\s*/.test(descLine) || /^[A-Z]/.test(descLine)) {
              descLines.push(descLine.replace(/^[•\-]\s*/, '').trim());
            }
          }
        }

        description = descLines.join('; ').slice(0, 1000);

        if (title) {
          experiences.push({
            title: title.slice(0, 255),
            company: company.slice(0, 255),
            startDate,
            endDate,
            description: description || null,
          });
        }
      }
    }

    return experiences.length > 0 ? experiences : undefined;
  }

  private parseEducation(
    lines: string[],
    text: string,
    mapMonth: (m: string) => string,
  ): ParsedResume['education'] {
    const education: NonNullable<ParsedResume['education']> = [];

    // Encontra seção de educação
    const eduHeaderIdx = lines.findIndex((l) =>
      /(forma[cç][aã]o|educa[cç][aã]o|acad[eê]mica|escolaridade|gradua[cç][aã]o|cursos)/i.test(
        l,
      ),
    );

    if (eduHeaderIdx < 0) return undefined;

    const startIdx = eduHeaderIdx + 1;
    const endIdx = lines.findIndex(
      (l, i) =>
        i > startIdx &&
        /^(experi[eê]ncia|profissional|habilidades|compet[eê]ncias|objetivo)/i.test(
          l,
        ),
    );

    const searchEnd =
      endIdx > 0 ? endIdx : Math.min(startIdx + 30, lines.length);

    // Padrões de graus acadêmicos
    const degreePatterns = [
      /ensino\s+(fundamental|m[eé]dio|superior)/i,
      /t[eé]cnico\s+(em|de)\s+/i,
      /tecn[oó]logo\s+(em|de)\s+/i,
      /gradua[cç][aã]o\s+(em|de)\s+/i,
      /bacharel(ado)?\s+(em|de)\s+/i,
      /licenciatura\s+(em|de)\s+/i,
      /p[oó]s[-\s]?gradua[cç][aã]o\s+(em|de)\s+/i,
      /especializa[cç][aã]o\s+(em|de)\s+/i,
      /MBA\s+(em|de)?\s*/i,
      /mestrado\s+(em|de)\s+/i,
      /doutorado\s+(em|de)\s+/i,
      /curso\s+(de|t[eé]cnico|superior)\s+/i,
    ];

    // Cursos específicos
    const coursePatterns = [
      /\b(administra[cç][aã]o|direito|medicina|engenharia|psicologia|contabilidade|economia)/i,
      /\b(pedagogia|letras|hist[oó]ria|geografia|matem[aá]tica|f[ií]sica|qu[ií]mica|biologia)/i,
      /\b(ci[eê]ncias?\s+da\s+computa[cç][aã]o|sistemas\s+de\s+informa[cç][aã]o|an[aá]lise\s+de\s+sistemas)/i,
      /\b(enfermagem|odontologia|farmácia|fisioterapia|nutrição|biomedicina)/i,
      /\b(arquitetura|design|publicidade|jornalismo|marketing|com[eé]rcio\s+exterior)/i,
      /\b(gest[aã]o|log[ií]stica|recursos\s+humanos|finanças|turismo|hotelaria)/i,
    ];

    for (let i = startIdx; i < searchEnd && education.length < 10; i++) {
      const line = lines[i];

      let isDegree = false;
      let degree = '';

      // Verifica padrões de grau
      for (const pattern of degreePatterns) {
        if (pattern.test(line)) {
          isDegree = true;
          degree = line.replace(/^[•\-]\s*/, '').trim();
          break;
        }
      }

      // Verifica cursos específicos
      if (!isDegree) {
        for (const pattern of coursePatterns) {
          if (pattern.test(line)) {
            isDegree = true;
            degree = line.replace(/^[•\-]\s*/, '').trim();
            break;
          }
        }
      }

      if (isDegree && degree) {
        let institution = '';
        let startDate: string | null = null;
        let endDate: string | null = null;

        // Busca instituição
        const contextLines = [
          ...lines.slice(Math.max(startIdx, i - 2), i),
          ...lines.slice(i + 1, Math.min(i + 4, searchEnd)),
        ];

        const institutionPatterns = [
          /(universidade|faculdade|escola|instituto|centro|funda[cç][aã]o|col[eé]gio)/i,
          /\b(SENAI|SENAC|SESI|SESC|SEBRAE|FATEC|ETEC|IFSP|UFRJ|UFMG|USP|UNICAMP|UNESP|PUC|FGV|MACKENZIE|UNIP|UNINOVE|ANHANGUERA)\b/i,
        ];

        for (const contextLine of contextLines) {
          if (institution) break;
          for (const pattern of institutionPatterns) {
            if (pattern.test(contextLine) && contextLine.length <= 200) {
              institution = contextLine.replace(/^[•\-]\s*/, '').trim();
              break;
            }
          }
        }

        // Busca datas
        const dateContext = contextLines.join(' ');

        // Padrões de conclusão
        if (
          /(conclu[ií]do|formado|completo)\s+(em\s+)?(\d{4})/i.test(dateContext)
        ) {
          const match = dateContext.match(
            /(conclu[ií]do|formado|completo)\s+(em\s+)?(\d{4})/i,
          );
          if (match) {
            endDate = `${match[3]}-12-31`;
          }
        } else {
          // Outros formatos de data
          const datePatterns = [
            /(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)[a-z]*\.?\s*\/?\s*(\d{4})/gi,
            /(\d{1,2})\/(\d{4})/g,
            /(\d{4})\s*[-–a]\s*(\d{4}|atual|presente)/gi,
          ];

          for (const pattern of datePatterns) {
            const matches = Array.from(dateContext.matchAll(pattern));
            if (matches.length > 0) {
              if (pattern.source.includes('jan|fev')) {
                startDate = matches[0]
                  ? `${matches[0][2]}-${mapMonth(matches[0][1])}-01`
                  : null;
                endDate = matches[1]
                  ? `${matches[1][2]}-${mapMonth(matches[1][1])}-01`
                  : null;
              } else if (pattern.source.includes('\\d{1,2}')) {
                startDate = matches[0]
                  ? `${matches[0][2]}-${matches[0][1].padStart(2, '0')}-01`
                  : null;
                endDate = matches[1]
                  ? `${matches[1][2]}-${matches[1][1].padStart(2, '0')}-01`
                  : null;
              } else if (pattern.source.includes('\\d{4}')) {
                startDate = matches[0] ? `${matches[0][1]}-01-01` : null;
                endDate =
                  matches[0][2] && !/atual|presente/i.test(matches[0][2])
                    ? `${matches[0][2]}-12-31`
                    : null;
              }
              break;
            }
          }
        }

        education.push({
          degree: degree.slice(0, 255),
          institution: institution.slice(0, 255),
          startDate,
          endDate,
        });
      }
    }

    return education.length > 0 ? education : undefined;
  }

  private parseSkills(lines: string[], text: string): string[] | undefined {
    const skills: string[] = [];
    const skillSet = new Set<string>();

    // Encontra seção de habilidades
    const skillHeaderIdx = lines.findIndex((l) =>
      /(compet[eê]ncias|habilidades|skills|conhecimentos|ferramentas|tecnologias|idiomas|qualifica[cç][oõ]es)/i.test(
        l,
      ),
    );

    if (skillHeaderIdx >= 0) {
      const startIdx = skillHeaderIdx + 1;
      const endIdx = lines.findIndex(
        (l, i) =>
          i > startIdx &&
          /^(experi[eê]ncia|forma[cç][aã]o|educa[cç][aã]o|objetivo|resumo)/i.test(
            l,
          ),
      );

      const searchEnd =
        endIdx > 0 ? endIdx : Math.min(startIdx + 20, lines.length);

      for (let i = startIdx; i < searchEnd; i++) {
        const line = lines[i];

        // Ignora cabeçalhos
        if (/^[A-Z\s]{10,}$/.test(line)) continue;

        // Extrai skills de diferentes formatos
        let items: string[] = [];

        if (line.includes(',') || line.includes(';') || line.includes('|')) {
          // Skills separadas por delimitadores
          items = line
            .split(/[,;|]/)
            .map((s) => s.replace(/^[•\-]\s*/, '').trim());
        } else if (/^[•\-]\s*/.test(line)) {
          // Skills em lista
          items = [line.replace(/^[•\-]\s*/, '').trim()];
        } else if (line.length <= 100) {
          // Skill em linha única
          items = [line.trim()];
        }

        for (const item of items) {
          if (item && item.length <= 100 && item.length >= 2) {
            if (
              !/@/.test(item) &&
              !/\d{4}/.test(item) &&
              /[A-Za-zÀ-ÿ]+/.test(item)
            ) {
              const normalized = item.toLowerCase().trim();
              if (!skillSet.has(normalized)) {
                skillSet.add(normalized);
                skills.push(item);
              }
            }
          }
        }
      }
    }

    // Busca tecnologias e ferramentas mencionadas no texto todo
    const techPatterns = [
      // Linguagens de programação
      /\b(JavaScript|TypeScript|Python|Java|C\+\+|C#|PHP|Ruby|Go|Rust|Swift|Kotlin|Scala|R|MATLAB)\b/gi,
      // Frameworks e bibliotecas
      /\b(React|Angular|Vue|Node\.?js|Express|Django|Flask|Spring|Laravel|Rails|\.NET|jQuery)\b/gi,
      // Bancos de dados
      /\b(MySQL|PostgreSQL|MongoDB|Redis|Oracle|SQL Server|SQLite|Cassandra|DynamoDB|Firebase)\b/gi,
      // Ferramentas e plataformas
      /\b(Git|Docker|Kubernetes|Jenkins|AWS|Azure|GCP|Linux|Windows|MacOS|Terraform|Ansible)\b/gi,
      // Software de escritório
      /\b(Excel|Word|PowerPoint|Outlook|Access|Google Sheets|Google Docs)\b/gi,
      // Design e criação
      /\b(Photoshop|Illustrator|Figma|Sketch|Adobe XD|InDesign|Premiere|After Effects|AutoCAD|SolidWorks)\b/gi,
      // Metodologias
      /\b(Scrum|Agile|Kanban|Lean|Six Sigma|ITIL|DevOps|CI\/CD)\b/gi,
      // Idiomas
      /\b(Ingl[eê]s|Espanhol|Franc[eê]s|Alem[aã]o|Italiano|Mandarim|Japon[eê]s|Portugu[eê]s)\s+(b[aá]sico|intermedi[aá]rio|avan[cç]ado|fluente|nativo)/gi,
      // Soft skills comuns
      /\b(lideran[cç]a|comunica[cç][aã]o|trabalho\s+em\s+equipe|organiza[cç][aã]o|proatividade|criatividade)\b/gi,
    ];

    for (const pattern of techPatterns) {
      const matches = text.match(pattern) || [];
      for (const match of matches) {
        const normalized = match.toLowerCase().trim();
        if (!skillSet.has(normalized) && skills.length < 50) {
          skillSet.add(normalized);
          skills.push(match.trim());
        }
      }
    }

    return skills.length > 0 ? skills : undefined;
  }
}
