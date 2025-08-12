const OptimizeStep = () => (
    <div className="max-w-2xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-6">Pronto para Otimizar!</h2>
      
      {/* Indicador do Plano */}
      <div className={`mb-6 p-4 rounded-lg border-2 ${
        userPlan === 'premium' 
          ? 'border-blue-200 bg-blue-50' 
          : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Star className={`mr-2 ${userPlan === 'premium' ? 'text-blue-500' : 'text-gray-400'}`} size={20} />
            <span className="font-medium">
              Plano {userPlan === 'premium' ? 'Premium' : 'Free'}
            </span>
          </div>
          {userPlan === 'free' && (
            <button
              onClick={() => setShowPlanModal(true)}
              className="text-blue-500 text-sm hover:underline"
            >
              Fazer Upgrade
            </button>
          )}
        </div>
        
        {userPlan === 'free' && (
          <div className="text-left text-sm">
            <div className="flex justify-between items-center mb-1">
              <span>Uso mensal:</span>
              <span className="font-medium">{monthlyUsage.used}/{monthlyUsage.limit}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(monthlyUsage.used / monthlyUsage.limit) * 100}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {monthlyUsage.remaining} otimizações restantes este mês
            </p>
          </div>
        )}

        {userPlan === 'premium' && (
          <div className="text-sm text-blue-600">
            🤖 Otimização com IA • 📄 Carta inclusa • ⚡ Processamento prioritário
          </div>
        )}
      </div>
      
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <FileText className="mx-auto mb-2 text-blue-500" size={32} />
            <h3 className="font-medium mb-1">Seu Currículo</h3>
            <p className="text-sm text-gray-600">{resume?.name}</p>
          </div>
          <div>
            <TrendingUp className="mx-auto mb-2 text-green-500" size={32} />
            <h3 className="font-medium mb-1">Análise da Vaga</h3>
            <p className="text-sm text-gray-600">{jobDescription.length} caracteres</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {userPlan === 'premium' ? 'O que a IA fará:' : 'O que faremos:'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div className="flex items-start space-x-3">
            <Zap className="text-yellow-500 mt-1" size={20} />
            <div>
              <p className="font-medium">
                {userPlan === 'premium' ? 'Análise IA Avançada' : 'Análise de Keywords'}
              </p>
              <p className="text-sm text-gray-600">
                {userPlan === 'premium' 
                  ? 'GPT-4/Claude identifica contextos sutis'
                  : 'Identificar termos-chave da vaga'
                }
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <BarChart3 className="text-blue-500 mt-1" size={20} />
            <div>
              <p className="font-medium">Score de Compatibilidade</p>
              <p className="text-sm text-gray-600">
                {userPlan === 'premium' 
                  ? 'Análise semântica profunda'
                  : 'Calcular % de match básico'
                }
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <RefreshCw className="text-purple-500 mt-1" size={20} />
            <div>
              <p className="font-medium">
                {userPlan === 'premium' ? 'Reescrita Inteligente' : 'Reorganização'}
              </p>
              <p className="text-sm text-gray-600">
                {userPlan === 'premium' 
                  ? 'IA reescreve textos naturalmente'
                  : 'Reordenar seções por relevância'
                }
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Star className="text-orange-500 mt-1" size={20} />
            <div>
              <p className="font-medium">
                {userPlan === 'premium' ? 'Carta Personalizada' : 'Sugestões Básicas'}
              </p>
              <p className="text-sm text-gray-600">
                {userPlan === 'premium' 
                  ? 'Carta de apresentação exclusiva'
                  : 'Dicas gerais de melhoria'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={simulateOptimization}
        disabled={loading || (userPlan === 'free' && monthlyUsage.remaining <= 0)}
        className={`w-full py-4 rounded-lg font-medium text-lg mt-8 ${
          userPlan === 'premium'
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
            : monthlyUsage.remaining > 0
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        } disabled:opacity-50`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <RefreshCw className="animate-spin mr-2" size={20} />
            {userPlan === 'premium' ? 'IA Trabalhando...' : 'Otimizando...'}
          </div>
        ) : monthlyUsage.remaining <= 0 && userPlan === 'free' ? (
          'Limite Mensal Atingido'
        ) : (
          <div className="flex items-center justify-center">
            <Zap className="mr-2" size={20} />
            {userPlan === 'premium' ? 'Otimizar com IA' : 'Otimizar Currículo'}
          </div>
        )}
      </button>
    </div>
  );import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Zap, 
  TrendingUp, 
  Download, 
  AlertCircle, 
  CheckCircle,
  Star,
  ArrowRight,
  RefreshCw,
  Upload,
  Link,
  BarChart3
} from 'lucide-react';

const ResumeOptimizer = () => {
  const [currentStep, setCurrentStep] = useState('upload');
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [optimization, setOptimization] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [matchScore, setMatchScore] = useState(0);
  const [userPlan, setUserPlan] = useState('free'); // free ou premium
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [monthlyUsage, setMonthlyUsage] = useState({ used: 1, limit: 3, remaining: 2 });

  // Dados dos planos
  const plans = {
    free: {
      name: 'Free',
      price: 0,
      optimizations: 3,
      features: [
        '✅ 3 otimizações por mês',
        '🔧 Otimização básica',
        '❌ Sem carta de apresentação', 
        '📁 Até 3 currículos',
        '📧 Suporte padrão'
      ],
      limitations: [
        'Sem análise com IA',
        'Sem geração de carta',
        'Sugestões limitadas'
      ]
    },
    premium: {
      name: 'Premium',
      price: 29.90,
      optimizations: 50,
      features: [
        '✅ 50 otimizações por mês',
        '🤖 Otimização com IA avançada',
        '📄 Carta de apresentação automática',
        '📁 Currículos ilimitados', 
        '⚡ Suporte prioritário'
      ],
      benefits: [
        'Análise com GPT-4/Claude',
        'Reescrita inteligente',
        'Insights personalizados'
      ]
    }
  };

  // Dados mockados para demonstração
  const mockOptimization = {
    originalResume: {
      summary: "Desenvolvedor Full Stack com 3 anos de experiência em React e Node.js",
      experience: [
        {
          company: "Tech Corp",
          position: "Desenvolvedor Junior",
          description: "Desenvolvimento de aplicações web usando React, criação de APIs REST",
          duration: "2 anos"
        },
        {
          company: "StartupXYZ", 
          position: "Estagiário",
          description: "Suporte técnico e desenvolvimento de pequenas funcionalidades",
          duration: "1 ano"
        }
      ],
      skills: ["React", "JavaScript", "CSS", "Node.js"]
    },
    optimizedResume: {
      summary: "Desenvolvedor React Senior com 3+ anos de experiência em TypeScript, GraphQL e AWS. Especialista em Next.js e Redux com foco em metodologias ágeis.",
      experience: [
        {
          company: "Tech Corp",
          position: "Desenvolvedor Senior", 
          description: "Desenvolvimento de aplicações web usando React, TypeScript, GraphQL e AWS. Criação de APIs REST com Node.js, implementação de testes automatizados e metodologias Scrum.",
          duration: "2 anos"
        },
        {
          company: "StartupXYZ",
          position: "Desenvolvedor Junior",
          description: "Desenvolvimento com React e Node.js, utilização de Docker para containerização e experiência com Next.js",
          duration: "1 ano"
        }
      ],
      skills: ["React", "TypeScript", "GraphQL", "AWS", "Next.js", "Redux", "Docker", "Kubernetes", "JavaScript", "Node.js"]
    },
    changes: [
      {
        type: 'reorder',
        section: 'experience',
        description: 'Reordenação de experiências por relevância',
        impact: 'Alto'
      },
      {
        type: 'addition',
        section: 'skills',
        description: 'Adicionadas skills: TypeScript, GraphQL, AWS',
        impact: 'Alto'
      },
      {
        type: 'enhancement',
        section: 'summary',
        description: 'Incorporadas keywords da vaga no resumo profissional',
        impact: 'Médio'
      }
    ],
    recommendations: [
      {
        priority: 'Alta',
        action: 'Adicionar keywords técnicas',
        description: 'Incorpore termos como "TypeScript", "GraphQL" e "AWS" nas descrições',
        expectedImpact: '+25% match score'
      },
      {
        priority: 'Média', 
        action: 'Destacar experiência senior',
        description: 'Reposicione experiências mais relevantes no topo',
        expectedImpact: '+15% match score'
      }
    ]
  };

  const simulateOptimization = () => {
    // Verificar limites do plano
    if (userPlan === 'free' && monthlyUsage.remaining <= 0) {
      setShowPlanModal(true);
      return;
    }

    setLoading(true);
    setError('');
    
    setTimeout(() => {
      // Simular resultados diferentes baseados no plano
      const mockResults = userPlan === 'premium' ? {
        ...mockOptimization,
        aiPowered: true,
        coverLetter: `Prezado(a) Recrutador(a),

Tenho grande interesse na vaga de Desenvolvedor React Senior na sua empresa. Com mais de 3 anos de experiência especializada em React, TypeScript e GraphQL, desenvolvi uma expertise sólida em arquiteturas escaláveis e metodologias ágeis.

Minha experiência na Tech Corp me permitiu liderar projetos complexos utilizando AWS e implementar soluções inovadoras com Next.js e Redux. Recentemente, contribuí para a migração de uma aplicação legada que resultou em 40% de melhoria na performance.

Estou entusiasmado com a oportunidade de contribuir com minha experiência técnica e visão estratégica para os desafios da sua equipe. Estou disponível para uma conversa nos próximos dias.

Atenciosamente,
[Seu Nome]`,
        insights: [
          'IA identificou 15 keywords estratégicas',
          'Texto reescrito com tom profissional otimizado',
          'Match score aumentou 34% com otimizações IA'
        ]
      } : {
        ...mockOptimization,
        aiPowered: false,
        insights: [
          'Análise básica identificou 8 keywords',
          'Reordenação por relevância aplicada',
          'Sugestões baseadas em algoritmos tradicionais'
        ]
      };

      setOptimization(mockResults);
      setMatchScore(userPlan === 'premium' ? 92 : 78);
      
      // Atualizar uso mensal para usuários free
      if (userPlan === 'free') {
        setMonthlyUsage(prev => ({
          ...prev,
          used: prev.used + 1,
          remaining: prev.remaining - 1
        }));
      }
      
      setCurrentStep('results');
      setLoading(false);
    }, userPlan === 'premium' ? 4000 : 2000); // IA demora mais
  };

  // Modal de upgrade para Premium
  const PlanUpgradeModal = () => (
    showPlanModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-2xl mx-4 max-h-screen overflow-y-auto">
          <div className="text-center mb-6">
            <AlertCircle className="mx-auto mb-4 text-orange-500" size={48} />
            <h2 className="text-2xl font-bold mb-2">Limite Atingido</h2>
            <p className="text-gray-600">
              Você já usou suas {plans.free.optimizations} otimizações gratuitas este mês.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Plano Free */}
            <div className="border rounded-lg p-6">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold">Free</h3>
                <p className="text-2xl font-bold text-gray-900">R$ 0</p>
                <p className="text-sm text-gray-500">por mês</p>
              </div>
              <ul className="space-y-2 text-sm">
                {plans.free.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">{feature.includes('❌') ? '❌' : '✅'}</span>
                    <span className={feature.includes('❌') ? 'text-gray-400' : ''}>{feature.replace(/^[✅❌]\s/, '')}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 p-3 bg-gray-100 rounded">
                <p className="text-xs text-gray-600">
                  <strong>Limitações:</strong> {plans.free.limitations.join(', ')}
                </p>
              </div>
            </div>

            {/* Plano Premium */}
            <div className="border-2 border-blue-500 rounded-lg p-6 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  RECOMENDADO
                </span>
              </div>
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold">Premium</h3>
                <p className="text-2xl font-bold text-blue-600">R$ {plans.premium.price}</p>
                <p className="text-sm text-gray-500">por mês</p>
              </div>
              <ul className="space-y-2 text-sm">
                {plans.premium.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">✅</span>
                    <span>{feature.replace(/^[✅🤖📄📁⚡]\s/, '')}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 p-3 bg-blue-50 rounded">
                <p className="text-xs text-blue-600">
                  <strong>Exclusivo:</strong> {plans.premium.benefits.join(', ')}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowPlanModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Continuar Free
            </button>
            <button
              onClick={() => {
                setUserPlan('premium');
                setMonthlyUsage({ used: 1, limit: 50, remaining: 49 });
                setShowPlanModal(false);
                simulateOptimization();
              }}
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Upgrade Premium
            </button>
          </div>
        </div>
      </div>
    )
  );

  const StepIndicator = () => {
    const steps = [
      { id: 'upload', label: 'Currículo', completed: resume !== null },
      { id: 'job', label: 'Vaga', completed: jobDescription.length > 0 },
      { id: 'optimize', label: 'Otimizar', completed: false },
      { id: 'results', label: 'Resultados', completed: optimization !== null }
    ];

    return (
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep === step.id 
                  ? 'bg-blue-500 text-white' 
                  : step.completed 
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
              }`}>
                {step.completed ? <CheckCircle size={20} /> : index + 1}
              </div>
              <span className="text-sm mt-2 font-medium">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <ArrowRight className="text-gray-400 mx-4" size={20} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const UploadStep = () => (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Carregue seu Currículo</h2>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors">
        <Upload className="mx-auto mb-4 text-gray-400" size={48} />
        <p className="text-lg mb-4">Arraste e solte seu currículo aqui</p>
        <p className="text-gray-500 mb-6">ou clique para selecionar um arquivo</p>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          id="resume-upload"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setResume(file);
              setCurrentStep('job');
            }
          }}
        />
        <label 
          htmlFor="resume-upload"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 cursor-pointer inline-block"
        >
          Selecionar Arquivo
        </label>
      </div>

      {resume && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg flex items-center">
          <CheckCircle className="text-green-500 mr-3" size={20} />
          <div>
            <p className="font-medium">Arquivo carregado com sucesso!</p>
            <p className="text-sm text-gray-600">{resume.name}</p>
          </div>
        </div>
      )}
    </div>
  );

  const JobStep = () => (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Adicione a Vaga</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            <Link className="inline mr-2" size={16} />
            URL da Vaga (opcional)
          </label>
          <input
            type="url"
            placeholder="https://linkedin.com/jobs/..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={jobUrl}
            onChange={(e) => setJobUrl(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            <FileText className="inline mr-2" size={16} />
            Descrição da Vaga *
          </label>
          <textarea
            placeholder="Cole aqui a descrição completa da vaga..."
            rows={12}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <p className="text-sm text-gray-500 mt-2">
            {jobDescription.length} caracteres • Mínimo recomendado: 200
          </p>
        </div>

        <button
          onClick={() => setCurrentStep('optimize')}
          disabled={jobDescription.length < 50}
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Continuar
        </button>
      </div>
    </div>
  );

  const OptimizeStep = () => (
    <div className="max-w-2xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-6">Pronto para Otimizar!</h2>
      
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <FileText className="mx-auto mb-2 text-blue-500" size={32} />
            <h3 className="font-medium mb-1">Seu Currículo</h3>
            <p className="text-sm text-gray-600">{resume?.name}</p>
          </div>
          <div>
            <TrendingUp className="mx-auto mb-2 text-green-500" size={32} />
            <h3 className="font-medium mb-1">Análise da Vaga</h3>
            <p className="text-sm text-gray-600">{jobDescription.length} caracteres</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">O que faremos:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div className="flex items-start space-x-3">
            <Zap className="text-yellow-500 mt-1" size={20} />
            <div>
              <p className="font-medium">Análise de Keywords</p>
              <p className="text-sm text-gray-600">Identificar termos-chave da vaga</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <BarChart3 className="text-blue-500 mt-1" size={20} />
            <div>
              <p className="font-medium">Score de Compatibilidade</p>
              <p className="text-sm text-gray-600">Calcular % de match</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <RefreshCw className="text-purple-500 mt-1" size={20} />
            <div>
              <p className="font-medium">Otimização Automática</p>
              <p className="text-sm text-gray-600">Reorganizar e melhorar conteúdo</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Star className="text-orange-500 mt-1" size={20} />
            <div>
              <p className="font-medium">Sugestões Personalizadas</p>
              <p className="text-sm text-gray-600">Dicas específicas para a vaga</p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={simulateOptimization}
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 mt-8 font-medium text-lg"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <RefreshCw className="animate-spin mr-2" size={20} />
            Otimizando Currículo...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <Zap className="mr-2" size={20} />
            Otimizar Currículo
          </div>
        )}
      </button>
    </div>
  );

  const ResultsStep = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">
          {userPlan === 'premium' ? '🤖 IA Otimizou seu Currículo!' : '✨ Currículo Otimizado!'}
        </h2>
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className={`px-4 py-2 rounded-full font-medium ${
            userPlan === 'premium' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            Match Score: {matchScore}%
          </div>
          <div className={`px-4 py-2 rounded-full font-medium ${
            userPlan === 'premium' 
              ? 'bg-purple-100 text-purple-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            +{matchScore - (userPlan === 'premium' ? 58 : 62)}% de melhoria
          </div>
        </div>
        
        {/* Badge do plano usado */}
        <div className="flex justify-center">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            userPlan === 'premium'
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}>
            {userPlan === 'premium' ? '🤖 Processado com IA' : '🔧 Otimização Básica'}
          </span>
        </div>

        {/* Insights exclusivos do plano premium */}
        {userPlan === 'premium' && optimization?.insights && (
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">💡 Insights da IA:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              {optimization.insights.map((insight, index) => (
                <li key={index}>• {insight}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Versão Original */}
        <div className="bg-red-50 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4 text-red-800">
            <FileText className="inline mr-2" size={20} />
            Versão Original
          </h3>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium mb-1">Resumo Profissional:</h4>
              <p className="text-gray-700">{optimization?.originalResume.summary}</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Skills:</h4>
              <div className="flex flex-wrap gap-2">
                {optimization?.originalResume.skills.map((skill, index) => (
                  <span key={index} className="bg-gray-200 px-2 py-1 rounded text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Versão Otimizada */}
        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4 text-green-800">
            <CheckCircle className="inline mr-2" size={20} />
            Versão Otimizada {userPlan === 'premium' && '(IA)'}
          </h3>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium mb-1">Resumo Profissional:</h4>
              <p className="text-gray-700">{optimization?.optimizedResume.summary}</p>
              {userPlan === 'premium' && (
                <span className="inline-block mt-1 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  ✨ Reescrito pela IA
                </span>
              )}
            </div>
            <div>
              <h4 className="font-medium mb-1">Skills:</h4>
              <div className="flex flex-wrap gap-2">
                {optimization?.optimizedResume.skills.map((skill, index) => {
                  const isNew = !optimization.originalResume.skills.includes(skill);
                  return (
                    <span 
                      key={index} 
                      className={`px-2 py-1 rounded text-xs ${
                        isNew ? 'bg-green-200 text-green-800' : 'bg-gray-200'
                      }`}
                    >
                      {skill} {isNew && '✨'}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Carta de Apresentação (Premium only) */}
      {userPlan === 'premium' && optimization?.coverLetter && (
        <div className="bg-purple-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-bold mb-4 text-purple-800">
            <FileText className="inline mr-2" size={20} />
            📄 Carta de Apresentação (Gerada pela IA)
          </h3>
          <div className="bg-white rounded p-4 border-2 border-dashed border-purple-200">
            <div className="whitespace-pre-line text-sm text-gray-700">
              {optimization.coverLetter}
            </div>
          </div>
          <p className="text-xs text-purple-600 mt-2">
            💡 Carta personalizada baseada na vaga e seu perfil profissional
          </p>
        </div>
      )}

      {/* Mudanças Realizadas */}
      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-bold mb-4 text-blue-800">
          <RefreshCw className="inline mr-2" size={20} />
          Mudanças Realizadas
        </h3>
        <div className="space-y-3">
          {optimization?.changes.map((change, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                change.impact === 'Alto' ? 'bg-red-500' :
                change.impact === 'Médio' ? 'bg-yellow-500' : 'bg-green-500'
              }`} />
              <div>
                <p className="font-medium">{change.description}</p>
                <p className="text-sm text-gray-600">
                  Impacto: {change.impact}
                  {userPlan === 'premium' && ' • Processado com IA'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparação de Planos para usuários Free */}
      {userPlan === 'free' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <Star className="text-yellow-600 mt-1 mr-3" size={20} />
            <div className="flex-1">
              <h4 className="font-bold text-yellow-800 mb-2">
                🚀 Quer resultados ainda melhores?
              </h4>
              <p className="text-yellow-700 text-sm mb-3">
                Com o plano Premium, sua otimização teria sido processada por IA avançada, 
                resultando em um match score até 15% maior e uma carta de apresentação personalizada.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="font-medium text-yellow-800">✅ Com Premium você teria:</p>
                  <ul className="text-yellow-700 mt-1 space-y-1">
                    <li>• Texto reescrito pela IA</li>
                    <li>• Carta de apresentação inclusa</li>
                    <li>• Insights personalizados</li>
                    <li>• Match score mais preciso</li>
                  </ul>
                </div>
                <div className="text-center">
                  <button 
                    onClick={() => setShowPlanModal(true)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 text-sm font-medium"
                  >
                    Fazer Upgrade
                  </button>
                  <p className="text-xs text-yellow-600 mt-1">
                    Apenas R$ {plans.premium.price}/mês
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ações */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 flex items-center">
          <Download className="mr-2" size={20} />
          Baixar PDF Otimizado
        </button>
        {userPlan === 'premium' && optimization?.coverLetter && (
          <button className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 flex items-center">
            <FileText className="mr-2" size={20} />
            Baixar Carta (PDF)
          </button>
        )}
        <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 flex items-center">
          <FileText className="mr-2" size={20} />
          Salvar Versão
        </button>
        <button 
          onClick={() => {
            setCurrentStep('upload');
            setResume(null);
            setJobDescription('');
            setOptimization(null);
            setMatchScore(0);
          }}
          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 flex items-center"
        >
          <RefreshCw className="mr-2" size={20} />
          Nova Otimização
        </button>
      </div>

      {/* Feedback para usuários Free */}
      {userPlan === 'free' && (
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Restam {monthlyUsage.remaining} otimizações gratuitas este mês
          </p>
          <button 
            onClick={() => setShowPlanModal(true)}
            className="text-blue-500 hover:underline text-sm"
          >
            Upgrade para Premium e tenha 50 otimizações/mês + IA
          </button>
        </div>
      )}
    </div>
  );

  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <RefreshCw className="animate-spin mb-4 text-blue-500" size={48} />
      <h3 className="text-lg font-medium mb-2">Analisando sua vaga...</h3>
      <div className="text-sm text-gray-600 space-y-1 text-center">
        <p>🔍 Extraindo keywords importantes</p>
        <p>⚡ Calculando compatibilidade</p>
        <p>🎯 Otimizando seu currículo</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Otimizador de Currículos
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Otimize automaticamente seu currículo para cada vaga específica e aumente suas chances de ser chamado para entrevistas
          </p>
          
          {/* Indicador de plano no header */}
          <div className="mt-4 flex justify-center">
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${
              userPlan === 'premium' 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}>
              {userPlan === 'premium' ? '⭐ Premium' : '🆓 Free'} 
              {userPlan === 'free' && ` (${monthlyUsage.remaining}/${monthlyUsage.limit} restantes)`}
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        <StepIndicator />

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="text-red-500 mr-3" size={20} />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {loading && <LoadingState />}
          {!loading && currentStep === 'upload' && <UploadStep />}
          {!loading && currentStep === 'job' && <JobStep />}
          {!loading && currentStep === 'optimize' && <OptimizeStep />}
          {!loading && currentStep === 'results' && optimization && <ResultsStep />}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>
            💡 Dica: {userPlan === 'premium' 
              ? 'Com Premium, a IA analisa nuances que algoritmos tradicionais perdem!'
              : 'Quanto mais detalhada for a descrição da vaga, melhor será a otimização!'
            }
          </p>
        </div>
      </div>

      {/* Modal de upgrade */}
      <PlanUpgradeModal />
    </div>
  );
};

export default ResumeOptimizer;