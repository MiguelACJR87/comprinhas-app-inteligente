"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Moon,
  Sun,
  ShoppingCart,
  Plus,
  Trash2,
  Share2,
  TrendingUp,
  TrendingDown,
  Users,
  History,
  Settings,
  AlertTriangle,
  Mic,
  MicOff,
  Eye,
  Search,
  BarChart3,
  Clock,
  DollarSign,
  Package,
  Target,
  Zap,
  Copy,
  Check,
  X,
  RefreshCw,
  Store,
  Percent,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Tablet,
  Monitor,
} from "lucide-react"

// Interfaces
interface Produto {
  id: number
  nome: string
  quantidade: number
  valor: number
  total: number
  categoria: string
  emoji: string
  adicionadoEm: Date
  adicionadoPor?: string
  editadoEm?: Date
  observacoes?: string
  marca?: string
  unidade?: string
}

interface ListaCompras {
  id: string
  nome: string
  produtos: Produto[]
  criadaEm: Date
  finalizadaEm?: Date
  totalGasto: number
  orcamento: number
  colaboradores: string[]
  criador: string
  status: "ativa" | "finalizada" | "arquivada"
}

interface ComparacaoPreco {
  produto: string
  precoAtual: number
  melhorPreco: number
  loja: string
  economia: number
  percentualEconomia: number
  disponivel: boolean
  ultimaAtualizacao: Date
}

interface AlertaOrcamento {
  ativo: boolean
  percentual: number
  tipo: "warning" | "danger"
  mensagem: string
}

interface Configuracoes {
  tema: "light" | "dark" | "auto"
  alertaOrcamento: {
    ativo: boolean
    percentuais: number[]
    sons: boolean
    notificacoes: boolean
  }
  colaboracao: {
    permitirEdicao: boolean
    notificarMudancas: boolean
    aprovarNovosColaboradores: boolean
  }
  comparacaoPrecos: {
    ativo: boolean
    lojas: string[]
    atualizacaoAutomatica: boolean
  }
  interface: {
    densidade: "compacta" | "normal" | "espaçosa"
    animacoes: boolean
    sons: boolean
  }
}

// Base de dados expandida
const categoriasExpandidas = {
  "🌾 Cereais & Grãos": {
    itens: [
      "Arroz Branco",
      "Arroz Integral",
      "Arroz Parboilizado",
      "Feijão Preto",
      "Feijão Carioca",
      "Feijão Fradinho",
      "Lentilha",
      "Grão de Bico",
      "Ervilha Seca",
      "Quinoa",
      "Aveia em Flocos",
      "Aveia Integral",
      "Centeio",
      "Cevada",
      "Trigo para Kibe",
      "Farinha de Trigo",
      "Farinha Integral",
      "Farinha de Milho",
      "Fubá",
      "Polenta",
      "Tapioca",
      "Farinha de Mandioca",
      "Farinha de Rosca",
    ],
    cor: "#f59e0b",
  },
  "🥛 Laticínios": {
    itens: [
      "Leite Integral",
      "Leite Desnatado",
      "Leite Semi-desnatado",
      "Leite Condensado",
      "Creme de Leite",
      "Queijo Mussarela",
      "Queijo Prato",
      "Queijo Parmesão",
      "Queijo Minas",
      "Queijo Coalho",
      "Requeijão",
      "Manteiga",
      "Margarina",
      "Iogurte Natural",
      "Iogurte Grego",
      "Coalhada",
      "Nata",
      "Chantilly",
      "Ricota",
      "Queijo Cottage",
      "Leite em Pó",
      "Achocolatado",
    ],
    cor: "#3b82f6",
  },
  "🥩 Proteínas": {
    itens: [
      "Frango Inteiro",
      "Peito de Frango",
      "Coxa de Frango",
      "Asa de Frango",
      "Carne Bovina",
      "Alcatra",
      "Picanha",
      "Maminha",
      "Patinho",
      "Coxão Mole",
      "Carne Moída",
      "Costela",
      "Carne de Porco",
      "Lombo",
      "Pernil",
      "Linguiça",
      "Bacon",
      "Presunto",
      "Mortadela",
      "Salame",
      "Ovos",
      "Peixe",
      "Salmão",
      "Tilápia",
      "Sardinha",
      "Atum",
      "Camarão",
    ],
    cor: "#ef4444",
  },
  "🍎 Hortifrúti": {
    itens: [
      "Banana",
      "Maçã",
      "Laranja",
      "Limão",
      "Mamão",
      "Abacaxi",
      "Manga",
      "Uva",
      "Pêra",
      "Melancia",
      "Melão",
      "Morango",
      "Abacate",
      "Kiwi",
      "Tomate",
      "Cebola",
      "Alho",
      "Batata",
      "Batata Doce",
      "Cenoura",
      "Beterraba",
      "Abobrinha",
      "Berinjela",
      "Pimentão",
      "Brócolis",
      "Couve-flor",
      "Alface",
      "Rúcula",
      "Espinafre",
      "Couve",
      "Repolho",
      "Pepino",
      "Aipo",
      "Salsa",
      "Cebolinha",
    ],
    cor: "#10b981",
  },
  "🍞 Padaria": {
    itens: [
      "Pão de Forma",
      "Pão Francês",
      "Pão Integral",
      "Pão de Açúcar",
      "Pão Doce",
      "Croissant",
      "Biscoito Cream Cracker",
      "Biscoito Maria",
      "Biscoito Recheado",
      "Bolacha Água e Sal",
      "Torrada",
      "Bolo",
      "Sonho",
      "Rosquinha",
      "Pão de Mel",
      "Panetone",
      "Brioche",
    ],
    cor: "#f97316",
  },
  "🧂 Temperos & Condimentos": {
    itens: [
      "Sal",
      "Açúcar Cristal",
      "Açúcar Refinado",
      "Açúcar Mascavo",
      "Açúcar Demerara",
      "Mel",
      "Óleo de Soja",
      "Óleo de Girassol",
      "Azeite",
      "Vinagre",
      "Vinagre Balsâmico",
      "Mostarda",
      "Ketchup",
      "Maionese",
      "Molho de Tomate",
      "Extrato de Tomate",
      "Pimenta do Reino",
      "Cominho",
      "Orégano",
      "Manjericão",
      "Alecrim",
      "Tomilho",
      "Curry",
      "Páprica",
      "Canela",
    ],
    cor: "#8b5cf6",
  },
  "☕ Bebidas": {
    itens: [
      "Café em Pó",
      "Café em Grãos",
      "Café Solúvel",
      "Chá Preto",
      "Chá Verde",
      "Chá de Camomila",
      "Água Mineral",
      "Refrigerante Cola",
      "Refrigerante Guaraná",
      "Suco de Laranja",
      "Suco de Uva",
      "Cerveja",
      "Vinho Tinto",
      "Vinho Branco",
      "Energético",
      "Isotônico",
      "Água de Coco",
    ],
    cor: "#06b6d4",
  },
  "🧽 Limpeza": {
    itens: [
      "Detergente",
      "Sabão em Pó",
      "Amaciante",
      "Desinfetante",
      "Álcool",
      "Água Sanitária",
      "Sabonete",
      "Shampoo",
      "Condicionador",
      "Pasta de Dente",
      "Papel Higiênico",
      "Papel Toalha",
      "Esponja",
      "Pano de Chão",
      "Vassoura",
      "Rodo",
      "Saco de Lixo",
      "Luva de Borracha",
    ],
    cor: "#84cc16",
  },
}

const lojasParceiras = [
  { nome: "Extra", logo: "🛒", cor: "#e11d48" },
  { nome: "Carrefour", logo: "🏪", cor: "#2563eb" },
  { nome: "Pão de Açúcar", logo: "🍞", cor: "#dc2626" },
  { nome: "Atacadão", logo: "📦", cor: "#f59e0b" },
  { nome: "Assaí", logo: "🏬", cor: "#059669" },
  { nome: "Sam's Club", logo: "🏢", cor: "#7c3aed" },
  { nome: "Makro", logo: "🏭", cor: "#0891b2" },
  { nome: "Walmart", logo: "⭐", cor: "#1d4ed8" },
]

export default function ComprinhasAppProfessional() {
  // Estados principais
  const [showSplash, setShowSplash] = useState(true)
  const [tema, setTema] = useState<"light" | "dark" | "auto">("dark")
  const [listaAtual, setListaAtual] = useState<ListaCompras>({
    id: Date.now().toString(),
    nome: "Lista Principal",
    produtos: [],
    criadaEm: new Date(),
    totalGasto: 0,
    orcamento: 0,
    colaboradores: [],
    criador: "Usuário Principal",
    status: "ativa",
  })

  // Estados do formulário
  const [nomeProduto, setNomeProduto] = useState("")
  const [quantidade, setQuantidade] = useState(1)
  const [valor, setValor] = useState("")
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("todas")
  const [busca, setBusca] = useState("")

  // Estados de interface
  const [categoriasExpandidas, setCategoriasExpandidas] = useState<string[]>([])
  const [isListening, setIsListening] = useState(false)
  const [showComparacao, setShowComparacao] = useState(false)
  const [showColaboracao, setShowColaboracao] = useState(false)
  const [showHistorico, setShowHistorico] = useState(false)
  const [showConfiguracoes, setShowConfiguracoes] = useState(false)
  const [showNovoItem, setShowNovoItem] = useState(false)

  // Estados de dados
  const [comparacaoPrecos, setComparacaoPrecos] = useState<ComparacaoPreco[]>([])
  const [historicoListas, setHistoricoListas] = useState<ListaCompras[]>([])
  const [alertasAtivos, setAlertasAtivos] = useState<AlertaOrcamento[]>([])
  const [colaboradoresOnline, setColaboradoresOnline] = useState<string[]>([])
  const [linkCompartilhamento, setLinkCompartilhamento] = useState("")
  const [copiado, setCopiado] = useState(false)

  // Configurações
  const [configuracoes, setConfiguracoes] = useState<Configuracoes>({
    tema: "dark",
    alertaOrcamento: {
      ativo: true,
      percentuais: [50, 80, 95],
      sons: true,
      notificacoes: true,
    },
    colaboracao: {
      permitirEdicao: true,
      notificarMudancas: true,
      aprovarNovosColaboradores: false,
    },
    comparacaoPrecos: {
      ativo: true,
      lojas: ["Extra", "Carrefour", "Atacadão"],
      atualizacaoAutomatica: true,
    },
    interface: {
      densidade: "normal",
      animacoes: true,
      sons: true,
    },
  })

  // Estados de responsividade
  const [dispositivoAtual, setDispositivoAtual] = useState<"mobile" | "tablet" | "desktop">("desktop")
  const [orientacao, setOrientacao] = useState<"portrait" | "landscape">("landscape")

  // Refs
  const inicioSessaoRef = useRef<Date>(new Date())
  const [tempoSessao, setTempoSessao] = useState(0)

  // Detectar dispositivo e orientação
  useEffect(() => {
    const detectarDispositivo = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      if (width < 768) {
        setDispositivoAtual("mobile")
      } else if (width < 1024) {
        setDispositivoAtual("tablet")
      } else {
        setDispositivoAtual("desktop")
      }

      setOrientacao(width > height ? "landscape" : "portrait")
    }

    detectarDispositivo()
    window.addEventListener("resize", detectarDispositivo)
    return () => window.removeEventListener("resize", detectarDispositivo)
  }, [])

  // Timer da sessão
  useEffect(() => {
    const interval = setInterval(() => {
      setTempoSessao(Math.floor((new Date().getTime() - inicioSessaoRef.current.getTime()) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Persistência de dados
  useEffect(() => {
    const dadosSalvos = localStorage.getItem("comprinhas-app-data")
    if (dadosSalvos) {
      try {
        const dados = JSON.parse(dadosSalvos)
        setListaAtual(dados.listaAtual || listaAtual)
        setHistoricoListas(dados.historicoListas || [])
        setConfiguracoes(dados.configuracoes || configuracoes)
        setTema(dados.configuracoes?.tema || "dark")
      } catch (error) {
        console.error("Erro ao carregar dados salvos:", error)
      }
    }
  }, [])

  useEffect(() => {
    const dados = {
      listaAtual,
      historicoListas,
      configuracoes,
    }
    localStorage.setItem("comprinhas-app-data", JSON.stringify(dados))
  }, [listaAtual, historicoListas, configuracoes])

  // Verificar alertas de orçamento
  useEffect(() => {
    if (!configuracoes.alertaOrcamento.ativo || listaAtual.orcamento === 0) return

    const percentualGasto = (listaAtual.totalGasto / listaAtual.orcamento) * 100
    const novosAlertas: AlertaOrcamento[] = []

    configuracoes.alertaOrcamento.percentuais.forEach((percentual) => {
      if (percentualGasto >= percentual) {
        const tipo = percentual >= 90 ? "danger" : "warning"
        const mensagem =
          percentual >= 90
            ? `⚠️ Orçamento quase esgotado! ${percentualGasto.toFixed(1)}% utilizado`
            : `📊 ${percentualGasto.toFixed(1)}% do orçamento utilizado`

        novosAlertas.push({
          ativo: true,
          percentual,
          tipo,
          mensagem,
        })
      }
    })

    setAlertasAtivos(novosAlertas)

    // Som de alerta
    if (novosAlertas.length > 0 && configuracoes.alertaOrcamento.sons) {
      playSound("warning")
    }
  }, [listaAtual.totalGasto, listaAtual.orcamento, configuracoes.alertaOrcamento])

  // Funções utilitárias
  const playSound = (tipo: "success" | "error" | "warning" | "info") => {
    if (!configuracoes.interface.sons) return

    if (navigator.vibrate) {
      const padroes = {
        success: [100],
        error: [200, 100, 200],
        warning: [150, 50, 150],
        info: [50],
      }
      navigator.vibrate(padroes[tipo])
    }
  }

  const formatarTempo = (segundos: number) => {
    const horas = Math.floor(segundos / 3600)
    const minutos = Math.floor((segundos % 3600) / 60)
    const segs = segundos % 60

    if (horas > 0) {
      return `${horas}h ${minutos}m`
    } else if (minutos > 0) {
      return `${minutos}m ${segs}s`
    } else {
      return `${segs}s`
    }
  }

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor)
  }

  // Funções principais
  const adicionarProduto = useCallback(() => {
    if (!nomeProduto.trim() || !valor || Number.parseFloat(valor) <= 0) {
      playSound("error")
      return
    }

    // Detectar categoria automaticamente
    let categoriaDetectada = "🧂 Temperos & Condimentos"
    const nomeMinusculo = nomeProduto.toLowerCase()

    for (const [categoria, dados] of Object.entries(categoriasExpandidas)) {
      if (
        dados.itens.some(
          (item) => nomeMinusculo.includes(item.toLowerCase()) || item.toLowerCase().includes(nomeMinusculo),
        )
      ) {
        categoriaDetectada = categoria
        break
      }
    }

    const novoProduto: Produto = {
      id: Date.now(),
      nome: nomeProduto.trim(),
      quantidade,
      valor: Number.parseFloat(valor),
      total: quantidade * Number.parseFloat(valor),
      categoria: categoriaDetectada,
      emoji: categoriasExpandidas[categoriaDetectada as keyof typeof categoriasExpandidas]?.itens[0] || "📦",
      adicionadoEm: new Date(),
      adicionadoPor: listaAtual.criador,
      unidade: "un",
    }

    setListaAtual((prev) => ({
      ...prev,
      produtos: [...prev.produtos, novoProduto],
      totalGasto: prev.totalGasto + novoProduto.total,
    }))

    setNomeProduto("")
    setQuantidade(1)
    setValor("")
    playSound("success")
  }, [nomeProduto, quantidade, valor, listaAtual.criador])

  const removerProduto = useCallback((id: number) => {
    setListaAtual((prev) => {
      const produto = prev.produtos.find((p) => p.id === id)
      if (!produto) return prev

      return {
        ...prev,
        produtos: prev.produtos.filter((p) => p.id !== id),
        totalGasto: prev.totalGasto - produto.total,
      }
    })
    playSound("info")
  }, [])

  const atualizarOrcamento = useCallback((novoOrcamento: number) => {
    setListaAtual((prev) => ({
      ...prev,
      orcamento: novoOrcamento,
    }))
  }, [])

  // Simulação de comparação de preços
  const buscarComparacaoPrecos = useCallback(async () => {
    if (listaAtual.produtos.length === 0) return

    setShowComparacao(true)

    // Simular busca
    const comparacoes: ComparacaoPreco[] = listaAtual.produtos.map((produto) => {
      const precoBase = produto.valor
      const variacao = (Math.random() - 0.5) * 0.4 // -20% a +20%
      const melhorPreco = Math.max(0.1, precoBase * (1 + variacao))
      const loja = lojasParceiras[Math.floor(Math.random() * lojasParceiras.length)]

      return {
        produto: produto.nome,
        precoAtual: precoBase,
        melhorPreco,
        loja: loja.nome,
        economia: Math.max(0, precoBase - melhorPreco),
        percentualEconomia: Math.max(0, ((precoBase - melhorPreco) / precoBase) * 100),
        disponivel: Math.random() > 0.1,
        ultimaAtualizacao: new Date(),
      }
    })

    setComparacaoPrecos(comparacoes)
    playSound("info")
  }, [listaAtual.produtos])

  // Gerar link de compartilhamento
  const gerarLinkCompartilhamento = useCallback(() => {
    const linkId = Math.random().toString(36).substring(2, 15)
    const link = `${window.location.origin}/lista/${linkId}`
    setLinkCompartilhamento(link)

    // Simular salvamento do link
    localStorage.setItem(`lista-${linkId}`, JSON.stringify(listaAtual))

    playSound("success")
  }, [listaAtual])

  const copiarLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(linkCompartilhamento)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
      playSound("success")
    } catch (error) {
      console.error("Erro ao copiar link:", error)
      playSound("error")
    }
  }, [linkCompartilhamento])

  // Finalizar lista
  const finalizarLista = useCallback(() => {
    const listaFinalizada: ListaCompras = {
      ...listaAtual,
      status: "finalizada",
      finalizadaEm: new Date(),
    }

    setHistoricoListas((prev) => [listaFinalizada, ...prev.slice(0, 2)])

    // Criar nova lista
    setListaAtual({
      id: Date.now().toString(),
      nome: "Nova Lista",
      produtos: [],
      criadaEm: new Date(),
      totalGasto: 0,
      orcamento: 0,
      colaboradores: [],
      criador: "Usuário Principal",
      status: "ativa",
    })

    playSound("success")
  }, [listaAtual])

  // Reconhecimento de voz (simulado)
  const iniciarReconhecimentoVoz = useCallback(() => {
    setIsListening(true)
    playSound("info")

    setTimeout(() => {
      const produtosExemplo = [
        "Arroz Integral",
        "Feijão Preto",
        "Leite Integral",
        "Pão Francês",
        "Banana",
        "Frango Inteiro",
        "Óleo de Soja",
        "Açúcar Cristal",
      ]
      const produtoAleatorio = produtosExemplo[Math.floor(Math.random() * produtosExemplo.length)]
      setNomeProduto(produtoAleatorio)
      setIsListening(false)
      playSound("success")
    }, 2000)
  }, [])

  // Alternar tema
  const alternarTema = useCallback(() => {
    const novoTema = tema === "light" ? "dark" : "light"
    setTema(novoTema)
    setConfiguracoes((prev) => ({
      ...prev,
      tema: novoTema,
    }))
    playSound("info")
  }, [tema])

  // Classes CSS responsivas
  const getResponsiveClasses = () => {
    const base = "transition-all duration-300 ease-in-out"
    const densidade = configuracoes.interface.densidade

    switch (dispositivoAtual) {
      case "mobile":
        return {
          container: `${base} px-2 py-4`,
          card: `${base} p-3 ${densidade === "compacta" ? "p-2" : densidade === "espaçosa" ? "p-4" : "p-3"}`,
          grid: `${base} grid-cols-1 gap-3`,
          text: `${base} text-sm`,
          button: `${base} text-sm px-3 py-2`,
        }
      case "tablet":
        return {
          container: `${base} px-4 py-6`,
          card: `${base} p-4 ${densidade === "compacta" ? "p-3" : densidade === "espaçosa" ? "p-6" : "p-4"}`,
          grid: `${base} grid-cols-2 gap-4`,
          text: `${base} text-base`,
          button: `${base} text-base px-4 py-2`,
        }
      default:
        return {
          container: `${base} px-6 py-8`,
          card: `${base} p-6 ${densidade === "compacta" ? "p-4" : densidade === "espaçosa" ? "p-8" : "p-6"}`,
          grid: `${base} grid-cols-3 gap-6`,
          text: `${base} text-base`,
          button: `${base} text-base px-4 py-2`,
        }
    }
  }

  const classes = getResponsiveClasses()

  // Tela de Splash
  if (showSplash) {
    return (
      <div
        className={`min-h-screen ${tema === "dark" ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"} flex items-center justify-center p-4 relative overflow-hidden`}
      >
        {/* Partículas animadas */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 ${tema === "dark" ? "bg-purple-400" : "bg-blue-400"} rounded-full opacity-30 animate-pulse`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="text-center relative z-10 max-w-2xl">
          <div className="text-8xl mb-8 animate-bounce">🛒</div>
          <h1
            className={`text-6xl font-bold mb-4 ${tema === "dark" ? "text-white" : "text-slate-800"} bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent`}
          >
            Comprinhas Pro
          </h1>
          <p className={`text-xl mb-8 ${tema === "dark" ? "text-slate-300" : "text-slate-600"} max-w-lg mx-auto`}>
            A experiência mais avançada e inteligente para suas compras
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-sm">
            <div className={`flex items-center gap-2 ${tema === "dark" ? "text-slate-400" : "text-slate-600"}`}>
              <Smartphone className="w-4 h-4" />
              Responsivo
            </div>
            <div className={`flex items-center gap-2 ${tema === "dark" ? "text-slate-400" : "text-slate-600"}`}>
              <Users className="w-4 h-4" />
              Colaborativo
            </div>
            <div className={`flex items-center gap-2 ${tema === "dark" ? "text-slate-400" : "text-slate-600"}`}>
              <BarChart3 className="w-4 h-4" />
              Comparação
            </div>
            <div className={`flex items-center gap-2 ${tema === "dark" ? "text-slate-400" : "text-slate-600"}`}>
              <Zap className="w-4 h-4" />
              IA Integrada
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => {
                setShowSplash(false)
                playSound("success")
              }}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Começar Jornada
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={alternarTema}
                className={tema === "dark" ? "border-slate-600 text-slate-300" : "border-slate-300 text-slate-700"}
              >
                {tema === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <span className={`text-xs ${tema === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                {dispositivoAtual === "mobile" ? (
                  <Smartphone className="w-4 h-4" />
                ) : dispositivoAtual === "tablet" ? (
                  <Tablet className="w-4 h-4" />
                ) : (
                  <Monitor className="w-4 h-4" />
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen ${tema === "dark" ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white" : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-slate-800"} ${classes.container}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold flex items-center gap-3">
              <ShoppingCart className="h-8 w-8 text-purple-400" />
              Comprinhas Pro
              <Badge variant="secondary" className="text-xs">
                {dispositivoAtual}
              </Badge>
            </h1>
            <p className={`${tema === "dark" ? "text-slate-400" : "text-slate-600"} mt-1`}>
              Lista inteligente • {listaAtual.produtos.length} itens • {formatarTempo(tempoSessao)}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Alertas de Orçamento */}
            {alertasAtivos.map((alerta, index) => (
              <Alert
                key={index}
                className={`${alerta.tipo === "danger" ? "border-red-500 bg-red-500/10" : "border-yellow-500 bg-yellow-500/10"} p-2`}
              >
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs">{alerta.mensagem}</AlertDescription>
              </Alert>
            ))}

            <Button variant="outline" size="sm" onClick={alternarTema}>
              {tema === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <Dialog open={showConfiguracoes} onOpenChange={setShowConfiguracoes}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>⚙️ Configurações Avançadas</DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="geral" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="geral">Geral</TabsTrigger>
                    <TabsTrigger value="orcamento">Orçamento</TabsTrigger>
                    <TabsTrigger value="colaboracao">Colaboração</TabsTrigger>
                    <TabsTrigger value="comparacao">Comparação</TabsTrigger>
                  </TabsList>

                  <TabsContent value="geral" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Interface</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Densidade da Interface</Label>
                          <Select
                            value={configuracoes.interface.densidade}
                            onValueChange={(value: "compacta" | "normal" | "espaçosa") =>
                              setConfiguracoes((prev) => ({
                                ...prev,
                                interface: { ...prev.interface, densidade: value },
                              }))
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="compacta">Compacta</SelectItem>
                              <SelectItem value="normal">Normal</SelectItem>
                              <SelectItem value="espaçosa">Espaçosa</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center justify-between">
                          <Label>Animações</Label>
                          <Switch
                            checked={configuracoes.interface.animacoes}
                            onCheckedChange={(checked) =>
                              setConfiguracoes((prev) => ({
                                ...prev,
                                interface: { ...prev.interface, animacoes: checked },
                              }))
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label>Sons</Label>
                          <Switch
                            checked={configuracoes.interface.sons}
                            onCheckedChange={(checked) =>
                              setConfiguracoes((prev) => ({
                                ...prev,
                                interface: { ...prev.interface, sons: checked },
                              }))
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="orcamento" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Alertas de Orçamento</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Ativar Alertas</Label>
                          <Switch
                            checked={configuracoes.alertaOrcamento.ativo}
                            onCheckedChange={(checked) =>
                              setConfiguracoes((prev) => ({
                                ...prev,
                                alertaOrcamento: { ...prev.alertaOrcamento, ativo: checked },
                              }))
                            }
                          />
                        </div>

                        <div>
                          <Label>Percentuais de Alerta (%)</Label>
                          <div className="grid grid-cols-3 gap-2 mt-2">
                            {[25, 50, 75, 90, 95, 100].map((percentual) => (
                              <div key={percentual} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={configuracoes.alertaOrcamento.percentuais.includes(percentual)}
                                  onChange={(e) => {
                                    const percentuais = e.target.checked
                                      ? [...configuracoes.alertaOrcamento.percentuais, percentual]
                                      : configuracoes.alertaOrcamento.percentuais.filter((p) => p !== percentual)

                                    setConfiguracoes((prev) => ({
                                      ...prev,
                                      alertaOrcamento: { ...prev.alertaOrcamento, percentuais },
                                    }))
                                  }}
                                />
                                <Label className="text-sm">{percentual}%</Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <Label>Sons de Alerta</Label>
                          <Switch
                            checked={configuracoes.alertaOrcamento.sons}
                            onCheckedChange={(checked) =>
                              setConfiguracoes((prev) => ({
                                ...prev,
                                alertaOrcamento: { ...prev.alertaOrcamento, sons: checked },
                              }))
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="colaboracao" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Colaboração em Tempo Real</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Permitir Edição</Label>
                          <Switch
                            checked={configuracoes.colaboracao.permitirEdicao}
                            onCheckedChange={(checked) =>
                              setConfiguracoes((prev) => ({
                                ...prev,
                                colaboracao: { ...prev.colaboracao, permitirEdicao: checked },
                              }))
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label>Notificar Mudanças</Label>
                          <Switch
                            checked={configuracoes.colaboracao.notificarMudancas}
                            onCheckedChange={(checked) =>
                              setConfiguracoes((prev) => ({
                                ...prev,
                                colaboracao: { ...prev.colaboracao, notificarMudancas: checked },
                              }))
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label>Aprovar Novos Colaboradores</Label>
                          <Switch
                            checked={configuracoes.colaboracao.aprovarNovosColaboradores}
                            onCheckedChange={(checked) =>
                              setConfiguracoes((prev) => ({
                                ...prev,
                                colaboracao: { ...prev.colaboracao, aprovarNovosColaboradores: checked },
                              }))
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="comparacao" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Comparação de Preços</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Ativar Comparação</Label>
                          <Switch
                            checked={configuracoes.comparacaoPrecos.ativo}
                            onCheckedChange={(checked) =>
                              setConfiguracoes((prev) => ({
                                ...prev,
                                comparacaoPrecos: { ...prev.comparacaoPrecos, ativo: checked },
                              }))
                            }
                          />
                        </div>

                        <div>
                          <Label>Lojas Parceiras</Label>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {lojasParceiras.map((loja) => (
                              <div key={loja.nome} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={configuracoes.comparacaoPrecos.lojas.includes(loja.nome)}
                                  onChange={(e) => {
                                    const lojas = e.target.checked
                                      ? [...configuracoes.comparacaoPrecos.lojas, loja.nome]
                                      : configuracoes.comparacaoPrecos.lojas.filter((l) => l !== loja.nome)

                                    setConfiguracoes((prev) => ({
                                      ...prev,
                                      comparacaoPrecos: { ...prev.comparacaoPrecos, lojas },
                                    }))
                                  }}
                                />
                                <Label className="text-sm flex items-center gap-1">
                                  <span>{loja.logo}</span>
                                  {loja.nome}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <Label>Atualização Automática</Label>
                          <Switch
                            checked={configuracoes.comparacaoPrecos.atualizacaoAutomatica}
                            onCheckedChange={(checked) =>
                              setConfiguracoes((prev) => ({
                                ...prev,
                                comparacaoPrecos: { ...prev.comparacaoPrecos, atualizacaoAutomatica: checked },
                              }))
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Resumo Financeiro */}
        <div className={`grid ${classes.grid} mb-6`}>
          <Card className={classes.card}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${tema === "dark" ? "text-slate-400" : "text-slate-600"}`}>Orçamento</p>
                  <p className="text-2xl font-bold text-blue-400">{formatarMoeda(listaAtual.orcamento)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className={classes.card}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${tema === "dark" ? "text-slate-400" : "text-slate-600"}`}>Gasto</p>
                  <p className="text-2xl font-bold text-green-400">{formatarMoeda(listaAtual.totalGasto)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className={classes.card}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${tema === "dark" ? "text-slate-400" : "text-slate-600"}`}>Restante</p>
                  <p
                    className={`text-2xl font-bold ${listaAtual.orcamento - listaAtual.totalGasto >= 0 ? "text-green-400" : "text-red-400"}`}
                  >
                    {formatarMoeda(listaAtual.orcamento - listaAtual.totalGasto)}
                  </p>
                </div>
                <Target className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar do Orçamento */}
        {listaAtual.orcamento > 0 && (
          <Card className={`${classes.card} mb-6`}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <Label>Progresso do Orçamento</Label>
                <span className="text-sm font-medium">
                  {((listaAtual.totalGasto / listaAtual.orcamento) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    (listaAtual.totalGasto / listaAtual.orcamento) * 100 > 90
                      ? "bg-gradient-to-r from-red-500 to-red-600"
                      : (listaAtual.totalGasto / listaAtual.orcamento) * 100 > 75
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                        : "bg-gradient-to-r from-green-500 to-blue-500"
                  }`}
                  style={{
                    width: `${Math.min((listaAtual.totalGasto / listaAtual.orcamento) * 100, 100)}%`,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ações Rápidas */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            onClick={buscarComparacaoPrecos}
            disabled={listaAtual.produtos.length === 0}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Comparar Preços
          </Button>

          <Dialog open={showColaboracao} onOpenChange={setShowColaboracao}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Colaborar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>👥 Colaboração em Tempo Real</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Gerar Link de Compartilhamento</Label>
                  <div className="flex gap-2 mt-2">
                    <Button onClick={gerarLinkCompartilhamento} className="flex-1">
                      <Share2 className="mr-2 h-4 w-4" />
                      Gerar Link
                    </Button>
                  </div>
                </div>

                {linkCompartilhamento && (
                  <div>
                    <Label>Link Gerado</Label>
                    <div className="flex gap-2 mt-2">
                      <Input value={linkCompartilhamento} readOnly className="flex-1" />
                      <Button onClick={copiarLink} variant="outline">
                        {copiado ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Compartilhe este link para colaboração em tempo real</p>
                  </div>
                )}

                <div>
                  <Label>Colaboradores Online ({colaboradoresOnline.length})</Label>
                  <div className="mt-2 space-y-2">
                    {colaboradoresOnline.length === 0 ? (
                      <p className="text-sm text-slate-500">Nenhum colaborador online</p>
                    ) : (
                      colaboradoresOnline.map((colaborador, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">{colaborador}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showHistorico} onOpenChange={setShowHistorico}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <History className="mr-2 h-4 w-4" />
                Histórico
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>📊 Histórico de Listas</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {historicoListas.length === 0 ? (
                  <p className="text-center text-slate-500 py-8">Nenhuma lista finalizada ainda</p>
                ) : (
                  historicoListas.map((lista, index) => (
                    <Card key={lista.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{lista.nome}</span>
                          <Badge variant="secondary">{lista.produtos.length} itens</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-slate-500">Criada em</p>
                            <p>{lista.criadaEm.toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Finalizada em</p>
                            <p>{lista.finalizadaEm?.toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Total Gasto</p>
                            <p className="font-bold text-green-400">{formatarMoeda(lista.totalGasto)}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Orçamento</p>
                            <p className="font-bold text-blue-400">{formatarMoeda(lista.orcamento)}</p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">Produtos:</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                            {lista.produtos.map((produto, pIndex) => (
                              <div key={pIndex} className="text-xs bg-slate-100 dark:bg-slate-800 p-2 rounded">
                                {produto.nome} - {produto.quantidade}x {formatarMoeda(produto.valor)}
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Button onClick={finalizarLista} disabled={listaAtual.produtos.length === 0} variant="outline">
            <Check className="mr-2 h-4 w-4" />
            Finalizar Lista
          </Button>
        </div>

        {/* Formulário de Adição */}
        <div
          className={`grid ${dispositivoAtual === "mobile" ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"} gap-6 mb-6`}
        >
          <Card className={classes.card}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Adicionar Produto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Orçamento Total</Label>
                <Input
                  type="number"
                  placeholder="Ex: 500"
                  value={listaAtual.orcamento || ""}
                  onChange={(e) => atualizarOrcamento(Number.parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Nome do Produto</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={nomeProduto}
                    onChange={(e) => setNomeProduto(e.target.value)}
                    placeholder="Ex: Arroz Integral 5kg"
                    className="flex-1"
                    onKeyPress={(e) => e.key === "Enter" && adicionarProduto()}
                  />
                  <Button onClick={iniciarReconhecimentoVoz} disabled={isListening} variant="outline" size="icon">
                    {isListening ? <MicOff className="h-4 w-4 text-red-500" /> : <Mic className="h-4 w-4" />}
                  </Button>
                </div>
                {isListening && <p className="text-xs text-blue-400 mt-1">🎤 Escutando... Fale o nome do produto</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Quantidade</Label>
                  <Input
                    type="number"
                    value={quantidade}
                    onChange={(e) => setQuantidade(Number.parseInt(e.target.value) || 1)}
                    min="1"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Valor (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    placeholder="0,00"
                    className="mt-1"
                    onKeyPress={(e) => e.key === "Enter" && adicionarProduto()}
                  />
                </div>
              </div>

              <Button
                onClick={adicionarProduto}
                disabled={!nomeProduto.trim() || !valor || Number.parseFloat(valor) <= 0}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar à Lista
              </Button>
            </CardContent>
          </Card>

          {/* Categorias Inteligentes */}
          <Card className={classes.card}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Categorias Inteligentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {Object.entries(categoriasExpandidas).map(([categoria, dados]) => (
                  <div key={categoria} className="border rounded-lg">
                    <button
                      onClick={() => {
                        setCategoriasExpandidas((prev) =>
                          prev.includes(categoria) ? prev.filter((c) => c !== categoria) : [...prev, categoria],
                        )
                      }}
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
                    >
                      <span className="font-medium">{categoria}</span>
                      {categoriasExpandidas.includes(categoria) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>

                    {categoriasExpandidas.includes(categoria) && (
                      <div className="p-3 pt-0 grid grid-cols-2 gap-2">
                        {dados.itens.slice(0, 8).map((item) => (
                          <button
                            key={item}
                            onClick={() => {
                              setNomeProduto(item)
                              playSound("info")
                            }}
                            className="text-left p-2 text-sm rounded border hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                          >
                            {item}
                          </button>
                        ))}
                        {dados.itens.length > 8 && (
                          <Dialog open={showNovoItem} onOpenChange={setShowNovoItem}>
                            <DialogTrigger asChild>
                              <button className="text-left p-2 text-sm rounded border border-dashed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-500">
                                + Ver mais ({dados.itens.length - 8})
                              </button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>{categoria}</DialogTitle>
                              </DialogHeader>
                              <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                                {dados.itens.map((item) => (
                                  <button
                                    key={item}
                                    onClick={() => {
                                      setNomeProduto(item)
                                      setShowNovoItem(false)
                                      playSound("info")
                                    }}
                                    className="text-left p-2 text-sm rounded border hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                  >
                                    {item}
                                  </button>
                                ))}
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Produtos */}
        <Card className={classes.card}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Lista de Compras
              </div>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Buscar produto..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-48"
                />
                <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    {Object.keys(categoriasExpandidas).map((categoria) => (
                      <SelectItem key={categoria} value={categoria}>
                        {categoria.split(" ")[0]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {listaAtual.produtos.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-16 w-16 mx-auto text-slate-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Lista vazia</h3>
                <p className="text-slate-500 mb-4">Adicione produtos para começar sua lista inteligente</p>
                <div className="flex justify-center gap-2">
                  <Button onClick={iniciarReconhecimentoVoz} variant="outline">
                    <Mic className="mr-2 h-4 w-4" />
                    Usar Voz
                  </Button>
                  <Button onClick={() => setNomeProduto("Arroz Integral")} variant="outline">
                    <Zap className="mr-2 h-4 w-4" />
                    Sugestão IA
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {listaAtual.produtos
                  .filter(
                    (produto) =>
                      (categoriaFiltro === "todas" || produto.categoria === categoriaFiltro) &&
                      (busca === "" || produto.nome.toLowerCase().includes(busca.toLowerCase())),
                  )
                  .map((produto, index) => (
                    <div
                      key={produto.id}
                      className={`flex items-center justify-between p-4 rounded-lg border ${tema === "dark" ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200"} hover:shadow-md transition-all duration-200`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="text-2xl">{produto.emoji}</div>
                        <div className="flex-1">
                          <h3 className="font-medium">{produto.nome}</h3>
                          <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                            <span>Qtd: {produto.quantidade}</span>
                            <span>{formatarMoeda(produto.valor)} cada</span>
                            <Badge variant="secondary" className="text-xs">
                              {produto.categoria?.split(" ")[0]}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {produto.adicionadoEm.toLocaleTimeString("pt-BR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            {produto.adicionadoPor && (
                              <>
                                <span>•</span>
                                <span>por {produto.adicionadoPor}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-400">{formatarMoeda(produto.total)}</div>
                          <div className="text-xs text-slate-500">
                            {produto.quantidade} × {formatarMoeda(produto.valor)}
                          </div>
                        </div>

                        <Button
                          onClick={() => removerProduto(produto.id)}
                          variant="outline"
                          size="icon"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                {/* Total */}
                <div className={`border-t pt-4 mt-6 ${tema === "dark" ? "border-slate-700" : "border-slate-200"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <h3 className="text-xl font-bold">Total Geral:</h3>
                      <Badge variant="secondary" className="text-sm">
                        {listaAtual.produtos.length} {listaAtual.produtos.length === 1 ? "item" : "itens"}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-400">{formatarMoeda(listaAtual.totalGasto)}</div>
                      {listaAtual.orcamento > 0 && (
                        <div className="text-sm text-slate-500">
                          {((listaAtual.totalGasto / listaAtual.orcamento) * 100).toFixed(1)}% do orçamento
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal de Comparação de Preços */}
        <Dialog open={showComparacao} onOpenChange={setShowComparacao}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Comparação Inteligente de Preços
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Resumo da Comparação */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {formatarMoeda(comparacaoPrecos.reduce((acc, comp) => acc + comp.economia, 0))}
                    </div>
                    <div className="text-sm text-slate-500">Economia Possível</div>
                    <TrendingDown className="h-4 w-4 text-green-400 mx-auto mt-1" />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {comparacaoPrecos.filter((comp) => comp.disponivel).length}
                    </div>
                    <div className="text-sm text-slate-500">Produtos Encontrados</div>
                    <Search className="h-4 w-4 text-blue-400 mx-auto mt-1" />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {Math.round(
                        comparacaoPrecos.reduce((acc, comp) => acc + comp.percentualEconomia, 0) /
                          comparacaoPrecos.length,
                      )}
                      %
                    </div>
                    <div className="text-sm text-slate-500">Economia Média</div>
                    <Percent className="h-4 w-4 text-purple-400 mx-auto mt-1" />
                  </CardContent>
                </Card>
              </div>

              {/* Lista de Comparações */}
              <div className="space-y-3">
                {comparacaoPrecos.map((comp, index) => (
                  <Card key={index} className={comp.disponivel ? "" : "opacity-50"}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium">{comp.produto}</h3>
                          <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                            <span>Seu preço: {formatarMoeda(comp.precoAtual)}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Store className="h-3 w-3" />
                              {comp.loja}: {formatarMoeda(comp.melhorPreco)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div
                              className={`text-lg font-bold ${comp.economia > 0 ? "text-green-400" : "text-slate-400"}`}
                            >
                              {comp.economia > 0 ? "-" : ""}
                              {formatarMoeda(comp.economia)}
                            </div>
                            <div className="text-xs text-slate-500">{comp.percentualEconomia.toFixed(1)}% economia</div>
                          </div>

                          <Badge
                            variant={comp.disponivel ? (comp.economia > 0 ? "default" : "secondary") : "destructive"}
                            className="flex items-center gap-1"
                          >
                            {comp.disponivel ? (
                              comp.economia > 0 ? (
                                <>
                                  <TrendingDown className="h-3 w-3" />
                                  Economia
                                </>
                              ) : (
                                <>
                                  <ArrowUpDown className="h-3 w-3" />
                                  Igual
                                </>
                              )
                            ) : (
                              <>
                                <X className="h-3 w-3" />
                                Indisponível
                              </>
                            )}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-center gap-2">
                <Button onClick={() => setShowComparacao(false)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Entendi!
                </Button>
                <Button variant="outline" onClick={buscarComparacaoPrecos}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Atualizar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Footer */}
        <div className={`mt-8 pt-6 border-t ${tema === "dark" ? "border-slate-700" : "border-slate-200"} text-center`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span>⚡ Powered by IA</span>
              <span>•</span>
              <span>🔒 Dados Seguros</span>
              <span>•</span>
              <span>📱 Responsivo</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Sessão: {formatarTempo(tempoSessao)}</span>
              <span>•</span>
              <span>
                {dispositivoAtual === "mobile" ? (
                  <Smartphone className="w-4 h-4 inline" />
                ) : dispositivoAtual === "tablet" ? (
                  <Tablet className="w-4 h-4 inline" />
                ) : (
                  <Monitor className="w-4 h-4 inline" />
                )}
                {dispositivoAtual}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
