"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ShoppingCart,
  Plus,
  Trash2,
  FileText,
  MessageCircle,
  Search,
  TrendingUp,
  MapPin,
  Package,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Target,
  Zap,
  Brain,
  Camera,
  Mic,
  Heart,
  Download,
  Settings,
  Wallet,
  PieChart,
  BarChart3,
  Calendar,
  Clock,
  CheckCircle,
  Lightbulb,
  Rocket,
  Trophy,
  Flame,
  Eye,
  Volume2,
  VolumeX,
  Users,
  AlertTriangle,
  History,
  CheckSquare,
  Vibrate,
} from "lucide-react"
import { ComparacaoModal } from "@/components/comparacao-modal"

interface Produto {
  id: number
  nome: string
  quantidade: number
  valor: number
  total: number
  categoria?: string
  prioridade?: "baixa" | "media" | "alta"
  adicionadoEm: Date
  emoji?: string
  notas?: string
  desconto?: number
  marca?: string
}

interface ListaHistorico {
  id: string
  nome: string
  produtos: Produto[]
  criadaEm: Date
  orcamento: number
  total: number
}

interface Conquista {
  id: string
  titulo: string
  descricao: string
  icone: string
  desbloqueada: boolean
  progresso?: number
  meta?: number
}

interface Configuracoes {
  tema: "escuro" | "claro" | "auto"
  som: boolean
  notificacoes: boolean
  animacoes: boolean
  moeda: "BRL" | "USD" | "EUR"
  idioma: "pt" | "en" | "es"
}

interface CompraCompartilhada {
  id: string
  nome: string
  criador: string
  participantes: Participante[]
  listaCompras: Produto[]
  orcamento: number
  criadaEm: Date
  ativa: boolean
  codigo: string
}

interface Participante {
  id: string
  nome: string
  telefone: string
  avatar?: string
  online: boolean
  ultimaAtualizacao: Date
}

interface HistoricoCompra {
  id: string
  nome: string
  produtos: Produto[]
  orcamento: number
  totalGasto: number
  economia: number
  criadaEm: Date
  finalizadaEm: Date
  participantes?: Participante[]
  observacoes?: string
  status: "finalizada" | "cancelada"
}

interface ComparacaoPreco {
  produto: string
  precoAnterior: number
  precoAtual: number
  diferenca: number
  percentual: number
  tendencia: "subiu" | "desceu" | "igual"
}

const cidadesPorEstado = {
  SP: ["São Paulo", "Campinas", "Santos", "Ribeirão Preto", "Sorocaba", "São José dos Campos"],
  RJ: ["Rio de Janeiro", "Niterói", "Nova Iguaçu", "Duque de Caxias", "Campos dos Goytacazes"],
  MG: ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim"],
  RS: ["Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas", "Santa Maria"],
  PR: ["Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel"],
  SC: ["Florianópolis", "Joinville", "Blumenau", "São José", "Criciúma"],
  BA: ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Juazeiro"],
  GO: ["Goiânia", "Aparecida de Goiânia", "Anápolis", "Rio Verde", "Luziânia"],
  PE: ["Recife", "Jaboatão dos Guararapes", "Olinda", "Caruaru", "Petrolina"],
  CE: ["Fortaleza", "Caucaia", "Juazeiro do Norte", "Maracanaú", "Sobral"],
}

const categorias = {
  "🌾 Cereais": ["Arroz", "Feijão", "Lentilha", "Grão de Bico", "Quinoa", "Aveia"],
  "🥛 Laticínios": ["Leite", "Queijo", "Iogurte", "Manteiga", "Requeijão", "Creme de Leite"],
  "🥩 Proteína": ["Frango", "Carne Bovina", "Peixe", "Ovos", "Presunto", "Mortadela"],
  "🍎 Hortifrúti": ["Banana", "Maçã", "Tomate", "Cebola", "Batata", "Cenoura"],
  "🍞 Padaria": ["Pão de Forma", "Pão Francês", "Biscoito", "Bolo", "Torrada"],
  "🧂 Outros": ["Açúcar", "Sal", "Óleo", "Vinagre", "Temperos", "Café"],
}

const emojisAleatorios = ["🛒", "🛍️", "🎯", "💫", "⭐", "🌟", "✨", "🎉", "🎊", "🔥", "💎", "🏆", "👑", "🎪", "🎭", "🎨"]

const conquistasIniciais: Conquista[] = [
  {
    id: "1",
    titulo: "Primeira Lista",
    descricao: "Crie sua primeira lista de compras",
    icone: "🎯",
    desbloqueada: false,
  },
  { id: "2", titulo: "Economizador", descricao: "Economize R$ 50 em uma lista", icone: "💰", desbloqueada: false },
  {
    id: "3",
    titulo: "Organizador",
    descricao: "Adicione 20 produtos em uma lista",
    icone: "📋",
    desbloqueada: false,
    progresso: 0,
    meta: 20,
  },
  {
    id: "4",
    titulo: "Comparador Expert",
    descricao: "Compare preços 5 vezes",
    icone: "🔍",
    desbloqueada: false,
    progresso: 0,
    meta: 5,
  },
  {
    id: "5",
    titulo: "Mestre das Compras",
    descricao: "Complete 10 listas",
    icone: "👑",
    desbloqueada: false,
    progresso: 0,
    meta: 10,
  },
]

// Função para gerar PDF
const gerarPDF = () => {
  if (listaCompras.length === 0) return

  // Criar conteúdo HTML para o PDF
  const conteudoHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Lista de Compras - ${new Date().toLocaleDateString()}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .info { background: #f5f5f5; padding: 15px; margin-bottom: 20px; border-radius: 8px; }
        .produto { border-bottom: 1px solid #eee; padding: 10px 0; display: flex; justify-content: space-between; }
        .total { background: #e8f5e8; padding: 15px; margin-top: 20px; font-weight: bold; text-align: center; }
        .categoria { color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🛒 Lista de Compras</h1>
        <p>Gerada em ${new Date().toLocaleString()}</p>
      </div>
      
      <div class="info">
        <p><strong>Local:</strong> ${cidade ? `${cidade} - ${estado}` : "Não informado"}</p>
        <p><strong>Orçamento:</strong> R$ ${orcamento.toFixed(2)}</p>
        <p><strong>Total de Itens:</strong> ${listaCompras.length}</p>
      </div>

      <div class="produtos">
        ${listaCompras
          .map(
            (produto) => `
          <div class="produto">
            <div>
              <strong>${produto.nome}</strong>
              <div class="categoria">${produto.categoria || "Outros"}</div>
              <small>Qtd: ${produto.quantidade} | Valor unitário: R$ ${produto.valor.toFixed(2)}</small>
            </div>
            <div style="text-align: right;">
              <strong>R$ ${produto.total.toFixed(2)}</strong>
            </div>
          </div>
        `,
          )
          .join("")}
      </div>

      <div class="total">
        <h2>Total Geral: R$ ${totalGasto.toFixed(2)}</h2>
        ${orcamento > 0 ? `<p>Restante do orçamento: R$ ${restante.toFixed(2)}</p>` : ""}
      </div>

      ${
        notasLista
          ? `
        <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 8px;">
          <h3>Observações:</h3>
          <p>${notasLista}</p>
        </div>
      `
          : ""
      }
    </body>
    </html>
  `

  // Criar blob e fazer download
  const blob = new Blob([conteudoHTML], { type: "text/html" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `lista-compras-${new Date().toISOString().split("T")[0]}.html`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  playSound("sucesso")
  setAnimacaoAtiva("pdf-gerado")
  setTimeout(() => setAnimacaoAtiva(""), 2000)
}

// Função para compartilhar no WhatsApp
const compartilharWhatsApp = () => {
  if (listaCompras.length === 0) return

  const emoji = "🛒"
  const titulo = `${emoji} *LISTA DE COMPRAS*\n`
  const data = `📅 ${new Date().toLocaleDateString()}\n`
  const local = cidade ? `📍 ${cidade} - ${estado}\n` : ""
  const orcamentoInfo = orcamento > 0 ? `💰 Orçamento: R$ ${orcamento.toFixed(2)}\n` : ""

  const produtos = listaCompras
    .map(
      (produto, index) =>
        `${index + 1}. ${produto.emoji || "📦"} *${produto.nome}*\n` +
        `   Qtd: ${produto.quantidade} | R$ ${produto.valor.toFixed(2)} = *R$ ${produto.total.toFixed(2)}*\n` +
        `   ${produto.categoria ? `📂 ${produto.categoria}` : ""}\n`,
    )
    .join("\n")

  const resumo = `\n💵 *TOTAL: R$ ${totalGasto.toFixed(2)}*\n`
  const restanteInfo = orcamento > 0 ? `💳 Restante: R$ ${restante.toFixed(2)}\n` : ""
  const estatisticas = `📊 ${listaCompras.length} ${listaCompras.length === 1 ? "item" : "itens"}\n`

  const observacoes = notasLista ? `\n📝 *Observações:*\n${notasLista}\n` : ""

  const rodape = `\n✨ _Gerado pelo app Comprinhas_`

  const mensagem =
    titulo +
    data +
    local +
    orcamentoInfo +
    "\n" +
    produtos +
    resumo +
    restanteInfo +
    estatisticas +
    observacoes +
    rodape

  const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`
  window.open(url, "_blank")

  playSound("sucesso")
  setAnimacaoAtiva("whatsapp-compartilhado")
  setTimeout(() => setAnimacaoAtiva(""), 2000)
}

// Função para comparar preços
const compararPrecos = () => {
  if (listaCompras.length === 0 || !estado || !cidade) return

  setIsComparing(true)
  playSound("click")

  // Simular comparação de preços (em um app real, seria uma API)
  setTimeout(() => {
    const comparacoes: ComparacaoPreco[] = listaCompras.map((produto) => {
      // Simular variação de preços entre -20% e +15%
      const variacao = (Math.random() - 0.6) * 0.35
      const precoComparado = produto.valor * (1 + variacao)
      const diferenca = precoComparado - produto.valor
      const percentual = (diferenca / produto.valor) * 100

      return {
        produto: produto.nome,
        precoAnterior: produto.valor,
        precoAtual: precoComparado,
        diferenca,
        percentual,
        tendencia: diferenca > 0 ? "subiu" : diferenca < 0 ? "desceu" : "igual",
      }
    })

    setComparacaoPrecos(comparacoes)
    setIsComparing(false)
    setShowComparacao(true)
    playSound("sucesso")
    setAnimacaoAtiva("comparacao-concluida")
    setTimeout(() => setAnimacaoAtiva(""), 2000)
  }, 2000)
}

export default function ComprinhasApp() {
  const [showSplash, setShowSplash] = useState(true)
  const [listaCompras, setListaCompras] = useState<Produto[]>([])
  const [orcamento, setOrcamento] = useState(0)
  const [estado, setEstado] = useState("")
  const [cidade, setCidade] = useState("")
  const [nomeProduto, setNomeProduto] = useState("")
  const [quantidade, setQuantidade] = useState(1)
  const [valor, setValor] = useState("")
  const [categoriasExpandidas, setCategoriasExpandidas] = useState<string[]>([])
  const [isComparing, setIsComparing] = useState(false)
  const [configuracoes, setConfiguracoes] = useState<Configuracoes>({
    tema: "escuro",
    som: true,
    notificacoes: true,
    animacoes: true,
    moeda: "BRL" | "USD" | "EUR",
    idioma: "pt" | "en" | "es",
  })
  const [conquistasDesbloqueadas, setConquistasDesbloqueadas] = useState<Conquista[]>(conquistasIniciais)
  const [historicoListas, setHistoricoListas] = useState<ListaHistorico[]>([])
  const [showConquista, setShowConquista] = useState<Conquista | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [sugestaoIA, setSugestaoIA] = useState("")
  const [modoFoco, setModoFoco] = useState(false)
  const [tempoSessao, setTempoSessao] = useState(0)
  const [produtosFavoritos, setProdutosFavoritos] = useState<string[]>([])
  const [metaEconomia, setMetaEconomia] = useState(100)
  const [notasLista, setNotasLista] = useState("")
  const [filtroCategoria, setFiltroCategoria] = useState("todas")
  const [ordenacao, setOrdenacao] = useState("nome")
  const [showEstatisticas, setShowEstatisticas] = useState(false)
  const [animacaoAtiva, setAnimacaoAtiva] = useState("")
  const [comprasCompartilhadas, setComprasCompartilhadas] = useState<CompraCompartilhada[]>([])
  const [compraAtual, setCompraAtual] = useState<CompraCompartilhada | null>(null)
  const [showCompartilhar, setShowCompartilhar] = useState(false)
  const [showAlertaOrcamento, setShowAlertaOrcamento] = useState(false)
  const [historicoCompras, setHistoricoCompras] = useState<HistoricoCompra[]>([])
  const [showHistorico, setShowHistorico] = useState(false)
  const [showComparacao, setShowComparacao] = useState(false)
  const [comparacaoPrecos, setComparacaoPrecos] = useState<ComparacaoPreco[]>([])
  const [nomeParticipante, setNomeParticipante] = useState("")
  const [telefoneParticipante, setTelefoneParticipante] = useState("")
  const [observacoesFinalizacao, setObservacoesFinalizacao] = useState("")
  const [alertaVibrando, setAlertaVibrando] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const inicioSessaoRef = useRef<Date>(new Date())

  const totalGasto = listaCompras.reduce((sum, produto) => sum + produto.total, 0)
  const restante = orcamento - totalGasto
  const progressoOrcamento = orcamento > 0 ? (totalGasto / orcamento) * 100 : 0
  const economiaAtual = metaEconomia - totalGasto
  const progressoEconomia = metaEconomia > 0 ? Math.max(0, (economiaAtual / metaEconomia) * 100) : 0

  // Timer da sessão
  useEffect(() => {
    const interval = setInterval(() => {
      setTempoSessao(Math.floor((new Date().getTime() - inicioSessaoRef.current.getTime()) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Sons
  const playSound = (tipo: "sucesso" | "erro" | "click" | "conquista") => {
    if (!configuracoes.som) return

    const frequencias = {
      sucesso: [523, 659, 784],
      erro: [220, 196, 174],
      click: [800],
      conquista: [523, 659, 784, 1047],
    }

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    frequencias[tipo].forEach((freq, index) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.1)
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime + index * 0.1)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.1 + 0.1)

      oscillator.start(audioContext.currentTime + index * 0.1)
      oscillator.stop(audioContext.currentTime + index * 0.1 + 0.1)
    })
  }

  // Verificar conquistas
  const verificarConquistas = () => {
    const novasConquistas = [...conquistasDesbloqueadas]
    let conquistaDesbloqueada = false

    // Primeira lista
    if (!novasConquistas[0].desbloqueada && listaCompras.length > 0) {
      novasConquistas[0].desbloqueada = true
      conquistaDesbloqueada = true
      setShowConquista(novasConquistas[0])
    }

    // Organizador (20 produtos)
    if (!novasConquistas[2].desbloqueada) {
      novasConquistas[2].progresso = listaCompras.length
      if (listaCompras.length >= 20) {
        novasConquistas[2].desbloqueada = true
        conquistaDesbloqueada = true
        setShowConquista(novasConquistas[2])
      }
    }

    if (conquistaDesbloqueada) {
      playSound("conquista")
      setAnimacaoAtiva("conquista")
      setTimeout(() => setAnimacaoAtiva(""), 2000)
    }

    setConquistasDesbloqueadas(novasConquistas)
  }

  useEffect(() => {
    verificarConquistas()
  }, [listaCompras])

  // IA Sugestões
  const gerarSugestaoIA = () => {
    const sugestoes = [
      "💡 Que tal adicionar frutas para uma alimentação mais saudável?",
      "🎯 Considere comprar produtos em promoção para economizar!",
      "🥗 Não esqueça dos vegetais para uma dieta equilibrada!",
      "💰 Produtos de marca própria podem ser mais econômicos!",
      "📅 Planeje suas refeições da semana para otimizar as compras!",
      "🛒 Agrupe produtos por seção do mercado para facilitar!",
      "⏰ Compre produtos não perecíveis em maior quantidade!",
      "🎪 Aproveite ofertas sazonais para economizar mais!",
    ]

    setSugestaoIA(sugestoes[Math.floor(Math.random() * sugestoes.length)])
    setAnimacaoAtiva("sugestao")
    setTimeout(() => setAnimacaoAtiva(""), 3000)
  }

  // Reconhecimento de voz
  const iniciarReconhecimentoVoz = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Reconhecimento de voz não suportado neste navegador")
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.lang = "pt-BR"
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => {
      setIsListening(true)
      playSound("click")
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setNomeProduto(transcript)
      playSound("sucesso")
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.onerror = () => {
      setIsListening(false)
      playSound("erro")
    }

    recognition.start()
  }

  const toggleCategoria = (categoria: string) => {
    setCategoriasExpandidas((prev) =>
      prev.includes(categoria) ? prev.filter((c) => c !== categoria) : [...prev, categoria],
    )
    playSound("click")
  }

  const selecionarProduto = (produto: string) => {
    setNomeProduto(produto)
    setQuantidade(1)
    playSound("click")
    setAnimacaoAtiva("produto-selecionado")
    setTimeout(() => setAnimacaoAtiva(""), 1000)
  }

  const adicionarProduto = () => {
    if (!nomeProduto.trim() || !valor || Number.parseFloat(valor) <= 0) {
      playSound("erro")
      return
    }

    // Detectar categoria automaticamente
    let categoriaDetectada = "Outros"
    const nomeMinusculo = nomeProduto.toLowerCase()

    for (const [categoria, produtos] of Object.entries(categorias)) {
      if (
        produtos.some(
          (produto) => nomeMinusculo.includes(produto.toLowerCase()) || produto.toLowerCase().includes(nomeMinusculo),
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
      adicionadoEm: new Date(),
      emoji: emojisAleatorios[Math.floor(Math.random() * emojisAleatorios.length)],
    }

    setListaCompras((prev) => [...prev, novoProduto])
    setNomeProduto("")
    setQuantidade(1)
    setValor("")
    playSound("sucesso")
    setAnimacaoAtiva("produto-adicionado")
    setTimeout(() => setAnimacaoAtiva(""), 1000)
  }

  const removerProduto = (id: number) => {
    setListaCompras((prev) => prev.filter((produto) => produto.id !== id))
    playSound("click")
  }

  const toggleFavorito = (nome: string) => {
    setProdutosFavoritos((prev) => (prev.includes(nome) ? prev.filter((p) => p !== nome) : [...prev, nome]))
    playSound("click")
  }

  const salvarLista = () => {
    if (listaCompras.length === 0) return

    const novaLista: ListaHistorico = {
      id: Date.now().toString(),
      nome: `Lista ${new Date().toLocaleDateString()}`,
      produtos: [...listaCompras],
      criadaEm: new Date(),
      orcamento,
      total: totalGasto,
    }

    setHistoricoListas((prev) => [novaLista, ...prev])
    playSound("sucesso")
    setAnimacaoAtiva("lista-salva")
    setTimeout(() => setAnimacaoAtiva(""), 2000)
  }

  const carregarLista = (lista: ListaHistorico) => {
    setListaCompras(lista.produtos)
    setOrcamento(lista.orcamento)
    playSound("sucesso")
  }

  const limparLista = () => {
    setListaCompras([])
    playSound("click")
  }

  const formatarTempo = (segundos: number) => {
    const horas = Math.floor(segundos / 3600)
    const minutos = Math.floor((segundos % 3600) / 60)
    const segs = segundos % 60

    if (horas > 0) {
      return `${horas}h ${minutos}m ${segs}s`
    } else if (minutos > 0) {
      return `${minutos}m ${segs}s`
    } else {
      return `${segs}s`
    }
  }

  const gerarEstatisticas = () => {
    const categoriasMaisCompradas = listaCompras.reduce(
      (acc, produto) => {
        const categoria = produto.categoria || "Outros"
        acc[categoria] = (acc[categoria] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const produtoMaisCaro = listaCompras.reduce(
      (max, produto) => (produto.valor > max.valor ? produto : max),
      listaCompras[0] || { valor: 0, nome: "Nenhum" },
    )

    const mediaPrecos =
      listaCompras.length > 0 ? listaCompras.reduce((sum, p) => sum + p.valor, 0) / listaCompras.length : 0

    return {
      categoriasMaisCompradas,
      produtoMaisCaro,
      mediaPrecos,
      totalItens: listaCompras.length,
      ticketMedio: totalGasto / Math.max(listaCompras.length, 1),
    }
  }

  // Verificar alerta de orçamento (10% restante)
  useEffect(() => {
    // Só mostrar alerta se:
    // 1. Há orçamento definido
    // 2. Há gasto
    // 3. Restante é positivo mas <= 10% do orçamento
    // 4. Alerta não está sendo mostrado
    const shouldShowAlert =
      orcamento > 0 && totalGasto > 0 && restante > 0 && restante <= orcamento * 0.1 && !showAlertaOrcamento

    if (shouldShowAlert) {
      setShowAlertaOrcamento(true)
      setAlertaVibrando(true)
      playSound("erro")

      // Vibrar se suportado
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200, 100, 200])
      }

      setTimeout(() => setAlertaVibrando(false), 2000)
    }
  }, [orcamento, totalGasto, restante])

  const criarCompraCompartilhada = () => {
    const codigo = Math.random().toString(36).substring(2, 8).toUpperCase()
    const novaCompra: CompraCompartilhada = {
      id: Date.now().toString(),
      nome: `Compra ${new Date().toLocaleDateString()}`,
      criador: "Você",
      participantes: [
        {
          id: "criador",
          nome: "Você",
          telefone: "",
          online: true,
          ultimaAtualizacao: new Date(),
        },
      ],
      listaCompras: [...listaCompras],
      orcamento,
      criadaEm: new Date(),
      ativa: true,
      codigo,
    }

    setComprasCompartilhadas((prev) => [...prev, novaCompra])
    setCompraAtual(novaCompra)
    playSound("sucesso")
    setAnimacaoAtiva("compartilhamento-criado")
    setTimeout(() => setAnimacaoAtiva(""), 2000)
  }

  const adicionarParticipante = () => {
    if (!nomeParticipante.trim() || !telefoneParticipante.trim() || !compraAtual) return

    const novoParticipante: Participante = {
      id: Date.now().toString(),
      nome: nomeParticipante.trim(),
      telefone: telefoneParticipante.trim(),
      online: Math.random() > 0.3, // Simular status online
      ultimaAtualizacao: new Date(),
    }

    const compraAtualizada = {
      ...compraAtual,
      participantes: [...compraAtual.participantes, novoParticipante],
    }

    setCompraAtual(compraAtualizada)
    setComprasCompartilhadas((prev) => prev.map((c) => (c.id === compraAtual.id ? compraAtualizada : c)))

    setNomeParticipante("")
    setTelefoneParticipante("")
    playSound("sucesso")
  }

  const enviarConviteWhatsApp = (participante: Participante) => {
    if (!compraAtual) return

    const mensagem = `🛒 *Convite para Compra Compartilhada*

Olá ${participante.nome}! 

Você foi convidado(a) para participar da nossa lista de compras compartilhada.

📋 *Lista:* ${compraAtual.nome}
💰 *Orçamento:* R$ ${compraAtual.orcamento.toFixed(2)}
🛍️ *Itens:* ${compraAtual.listaCompras.length} produtos
🔑 *Código:* ${compraAtual.codigo}

Acesse o app Comprinhas e use o código acima para participar!

*Vamos economizar juntos!* 🎯`

    const url = `https://wa.me/${participante.telefone.replace(/\D/g, "")}?text=${encodeURIComponent(mensagem)}`
    window.open(url, "_blank")
    playSound("sucesso")
  }

  const finalizarCompra = () => {
    if (listaCompras.length === 0) return

    // Calcular comparação de preços com histórico
    const novasComparacoes: ComparacaoPreco[] = []

    if (historicoCompras.length > 0) {
      const ultimaCompra = historicoCompras[0]

      listaCompras.forEach((produtoAtual) => {
        const produtoAnterior = ultimaCompra.produtos.find(
          (p) =>
            p.nome.toLowerCase().includes(produtoAtual.nome.toLowerCase()) ||
            produtoAtual.nome.toLowerCase().includes(p.nome.toLowerCase()),
        )

        if (produtoAnterior) {
          const diferenca = produtoAtual.valor - produtoAnterior.valor
          const percentual = (diferenca / produtoAnterior.valor) * 100

          novasComparacoes.push({
            produto: produtoAtual.nome,
            precoAnterior: produtoAnterior.valor,
            precoAtual: produtoAtual.valor,
            diferenca,
            percentual,
            tendencia: diferenca > 0 ? "subiu" : diferenca < 0 ? "desceu" : "igual",
          })
        }
      })
    }

    setComparacaoPrecos(novasComparacoes)

    const novoHistorico: HistoricoCompra = {
      id: Date.now().toString(),
      nome: `Compra ${new Date().toLocaleDateString()}`,
      produtos: [...listaCompras],
      orcamento,
      totalGasto,
      economia: Math.max(0, orcamento - totalGasto),
      criadaEm: new Date(),
      finalizadaEm: new Date(),
      participantes: compraAtual?.participantes,
      observacoes: observacoesFinalizacao,
      status: "finalizada",
    }

    setHistoricoCompras((prev) => [novoHistorico, ...prev.slice(0, 5)]) // Manter apenas 6 últimas

    // Limpar lista atual
    setListaCompras([])
    setOrcamento(0)
    setObservacoesFinalizacao("")
    setCompraAtual(null)

    playSound("conquista")
    setAnimacaoAtiva("compra-finalizada")
    setTimeout(() => setAnimacaoAtiva(""), 3000)

    // Mostrar comparação se houver
    if (novasComparacoes.length > 0) {
      setTimeout(() => setShowComparacao(true), 1000)
    }
  }

  const gerarRelatorioComparacao = () => {
    if (historicoCompras.length < 2) return "Histórico insuficiente para comparação"

    const compraAtual = historicoCompras[0]
    const compraAnterior = historicoCompras[1]

    const diferencaTotal = compraAtual.totalGasto - compraAnterior.totalGasto
    const percentualDiferenca = (diferencaTotal / compraAnterior.totalGasto) * 100

    return {
      diferencaTotal,
      percentualDiferenca,
      economiaAtual: compraAtual.economia,
      economiaAnterior: compraAnterior.economia,
      tendencia: diferencaTotal > 0 ? "gastou_mais" : diferencaTotal < 0 ? "economizou" : "igual",
    }
  }

  const fecharAlertaOrcamento = () => {
    setShowAlertaOrcamento(false)
    setAlertaVibrando(false)
    // Forçar um pequeno delay para garantir que o estado seja atualizado
    setTimeout(() => {
      // Estado já foi atualizado
    }, 100)
  }

  // Resetar alerta se as condições mudaram
  useEffect(() => {
    if (showAlertaOrcamento && (orcamento === 0 || totalGasto === 0 || restante > orcamento * 0.1)) {
      setShowAlertaOrcamento(false)
      setAlertaVibrando(false)
    }
  }, [showAlertaOrcamento, orcamento, totalGasto, restante])

  if (showSplash) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Partículas animadas */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-purple-400/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="text-center space-y-8 animate-in fade-in-50 duration-1000 relative z-10">
          <div className="space-y-4">
            <div className="text-6xl md:text-8xl animate-bounce">🛒</div>
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Comprinhas
            </h1>
            <div className="space-y-2">
              <p className="text-xl md:text-2xl text-slate-300 max-w-md mx-auto">
                A experiência mais inteligente para suas compras
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-1">
                  <Brain className="h-4 w-4" />
                  IA Integrada
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="h-4 w-4" />
                  Super Rápido
                </span>
                <span className="flex items-center gap-1">
                  <Trophy className="h-4 w-4" />
                  Gamificado
                </span>
              </div>
            </div>
          </div>

          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 group"
            onClick={() => {
              setShowSplash(false)
              playSound("sucesso")
            }}
          >
            <Rocket className="mr-2 h-5 w-5 group-hover:animate-pulse" />
            Começar Jornada
            <Sparkles className="ml-2 h-5 w-5 group-hover:animate-spin" />
          </Button>

          <div className="text-xs text-slate-500 max-w-sm mx-auto">
            ✨ Reconhecimento de voz • 🎯 Comparação inteligente • 🏆 Sistema de conquistas
          </div>
        </div>
      </div>
    )
  }

  const estatisticas = gerarEstatisticas()

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        configuracoes.tema === "escuro"
          ? "bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900"
          : "bg-gradient-to-br from-blue-50 via-purple-50/20 to-blue-50"
      } ${modoFoco ? "blur-sm" : ""}`}
    >
      {/* Conquista Modal */}
      {showConquista && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 border-yellow-300 max-w-md mx-4 animate-in zoom-in-95 duration-500">
            <CardContent className="p-6 text-center">
              <div className="text-6xl mb-4 animate-bounce">{showConquista.icone}</div>
              <h3 className="text-2xl font-bold text-white mb-2">{showConquista.titulo}</h3>
              <p className="text-yellow-100 mb-4">{showConquista.descricao}</p>
              <Button onClick={() => setShowConquista(null)} className="bg-white text-orange-600 hover:bg-yellow-50">
                <Trophy className="mr-2 h-4 w-4" />
                Incrível!
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Alerta de Orçamento Modal */}
      {showAlertaOrcamento && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-red-900/50 backdrop-blur-sm ${alertaVibrando ? "animate-pulse" : ""}`}
        >
          <Card
            className={`bg-gradient-to-r from-red-500 to-orange-600 border-red-400 max-w-md mx-4 ${alertaVibrando ? "animate-bounce" : "animate-in zoom-in-95"} duration-500`}
          >
            <CardContent className="p-6 text-center">
              <div className="text-6xl mb-4 animate-bounce">⚠️</div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <AlertTriangle className="h-6 w-6 text-white animate-pulse" />
                <h3 className="text-2xl font-bold text-white">ATENÇÃO!</h3>
                <Vibrate className="h-6 w-6 text-white animate-pulse" />
              </div>
              <p className="text-red-100 mb-2 text-lg font-semibold">Seu saldo atual é R$ {restante.toFixed(2)}</p>
              <p className="text-red-200 mb-4 text-sm">Você está próximo do limite do seu orçamento!</p>
              <Button onClick={fecharAlertaOrcamento} className="bg-white text-red-600 hover:bg-red-50 w-full">
                <CheckCircle className="mr-2 h-4 w-4" />
                Entendi
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modo Foco Overlay */}
      {modoFoco && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <Card className="bg-slate-800/90 border-slate-600 max-w-md mx-4">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-white mb-2">Modo Foco Ativado</h3>
              <p className="text-slate-300 mb-4">Concentre-se na sua lista atual</p>
              <Button onClick={() => setModoFoco(false)} className="bg-purple-600 hover:bg-purple-700">
                Sair do Foco
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="container mx-auto p-4 max-w-7xl">
        {/* Header com Status Bar */}
        <div className="mb-6 space-y-4">
          {/* Status Bar */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4 text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatarTempo(tempoSessao)}
              </span>
              <span className="flex items-center gap-1">
                <Trophy className="h-4 w-4" />
                {conquistasDesbloqueadas.filter((c) => c.desbloqueada).length}/{conquistasDesbloqueadas.length}
              </span>
              <span className="flex items-center gap-1">
                <Flame className="h-4 w-4" />
                {listaCompras.length} itens
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setModoFoco(!modoFoco)}
                className="text-slate-400 hover:text-white"
              >
                <Eye className="h-4 w-4" />
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => setConfiguracoes((prev) => ({ ...prev, som: !prev.som }))}
                className="text-slate-400 hover:text-white"
              >
                {configuracoes.som ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-slate-600 max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-white">Configurações</DialogTitle>
                  </DialogHeader>

                  <Tabs defaultValue="geral" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-slate-700">
                      <TabsTrigger value="geral">Geral</TabsTrigger>
                      <TabsTrigger value="conquistas">Conquistas</TabsTrigger>
                      <TabsTrigger value="historico">Histórico</TabsTrigger>
                    </TabsList>

                    <TabsContent value="geral" className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-slate-300">Sons</Label>
                          <Switch
                            checked={configuracoes.som}
                            onCheckedChange={(checked) => setConfiguracoes((prev) => ({ ...prev, som: checked }))}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label className="text-slate-300">Notificações</Label>
                          <Switch
                            checked={configuracoes.notificacoes}
                            onCheckedChange={(checked) =>
                              setConfiguracoes((prev) => ({ ...prev, notificacoes: checked }))
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label className="text-slate-300">Animações</Label>
                          <Switch
                            checked={configuracoes.animacoes}
                            onCheckedChange={(checked) => setConfiguracoes((prev) => ({ ...prev, animacoes: checked }))}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-slate-300">Meta de Economia (R$)</Label>
                          <Slider
                            value={[metaEconomia]}
                            onValueChange={([value]) => setMetaEconomia(value)}
                            max={1000}
                            min={50}
                            step={10}
                            className="w-full"
                          />
                          <div className="text-center text-slate-400">R$ {metaEconomia}</div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="conquistas" className="space-y-4">
                      {conquistasDesbloqueadas.map((conquista) => (
                        <Card
                          key={conquista.id}
                          className={`bg-slate-700/50 border-slate-600 ${conquista.desbloqueada ? "ring-2 ring-yellow-500" : ""}`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className={`text-2xl ${conquista.desbloqueada ? "" : "grayscale"}`}>
                                {conquista.icone}
                              </div>
                              <div className="flex-1">
                                <h4
                                  className={`font-semibold ${conquista.desbloqueada ? "text-yellow-400" : "text-slate-300"}`}
                                >
                                  {conquista.titulo}
                                </h4>
                                <p className="text-sm text-slate-400">{conquista.descricao}</p>
                                {conquista.progresso !== undefined && conquista.meta && (
                                  <div className="mt-2">
                                    <Progress value={(conquista.progresso / conquista.meta) * 100} className="h-2" />
                                    <div className="text-xs text-slate-400 mt-1">
                                      {conquista.progresso}/{conquista.meta}
                                    </div>
                                  </div>
                                )}
                              </div>
                              {conquista.desbloqueada && <CheckCircle className="h-5 w-5 text-yellow-500" />}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </TabsContent>

                    <TabsContent value="historico" className="space-y-4">
                      {historicoListas.length === 0 ? (
                        <div className="text-center py-8 text-slate-400">
                          <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>Nenhuma lista salva ainda</p>
                        </div>
                      ) : (
                        historicoListas.map((lista) => (
                          <Card key={lista.id} className="bg-slate-700/50 border-slate-600">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold text-white">{lista.nome}</h4>
                                  <p className="text-sm text-slate-400">
                                    {lista.produtos.length} itens • R$ {lista.total.toFixed(2)}
                                  </p>
                                  <p className="text-xs text-slate-500">{lista.criadaEm.toLocaleDateString()}</p>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => carregarLista(lista)}
                                  className="bg-purple-600 hover:bg-purple-700"
                                >
                                  Carregar
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Header Principal */}
          <Card
            className={`bg-gradient-to-r ${
              configuracoes.tema === "escuro"
                ? "from-slate-800/50 to-slate-700/50 border-slate-600"
                : "from-white/80 to-blue-50/80 border-blue-200"
            } backdrop-blur-sm ${animacaoAtiva === "conquista" ? "animate-pulse ring-4 ring-yellow-500" : ""}`}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle
                  className={`text-2xl font-bold ${
                    configuracoes.tema === "escuro" ? "text-white" : "text-slate-800"
                  } flex items-center gap-2`}
                >
                  <ShoppingCart className="h-6 w-6 text-purple-400" />
                  Comprinhas Inteligentes
                  {animacaoAtiva === "produto-adicionado" && (
                    <Sparkles className="h-5 w-5 text-yellow-500 animate-spin" />
                  )}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-purple-600/20 text-purple-300 border-purple-500/30">
                    {listaCompras.length} {listaCompras.length === 1 ? "item" : "itens"}
                  </Badge>
                  {listaCompras.length > 0 && (
                    <Button size="sm" onClick={salvarLista} className="bg-green-600 hover:bg-green-700 text-white">
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {compraAtual && (
                <Alert className="border-blue-500/30 bg-blue-500/10 mb-4">
                  <Users className="h-4 w-4 text-blue-400" />
                  <AlertDescription className="text-blue-300">
                    Compra compartilhada ativa com {compraAtual.participantes.length} participante(s) • Código:{" "}
                    {compraAtual.codigo}
                  </AlertDescription>
                </Alert>
              )}

              {/* Sugestão da IA */}
              {sugestaoIA && (
                <Alert
                  className={`border-blue-500/30 ${
                    animacaoAtiva === "sugestao" ? "animate-pulse bg-blue-500/10" : "bg-blue-500/5"
                  }`}
                >
                  <Brain className="h-4 w-4 text-blue-400" />
                  <AlertDescription className="text-blue-300">{sugestaoIA}</AlertDescription>
                </Alert>
              )}

              {/* Location e Orçamento */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label
                    className={`${
                      configuracoes.tema === "escuro" ? "text-slate-300" : "text-slate-600"
                    } flex items-center gap-2`}
                  >
                    <MapPin className="h-4 w-4" />
                    Estado
                  </Label>
                  <Select
                    value={estado}
                    onValueChange={(value) => {
                      setEstado(value)
                      setCidade("")
                      playSound("click")
                    }}
                  >
                    <SelectTrigger
                      className={`${
                        configuracoes.tema === "escuro"
                          ? "bg-slate-800/50 border-slate-600 text-white"
                          : "bg-white border-slate-300 text-slate-800"
                      }`}
                    >
                      <SelectValue placeholder="Selecione o estado..." />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(cidadesPorEstado).map((uf) => (
                        <SelectItem key={uf} value={uf}>
                          {uf}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className={configuracoes.tema === "escuro" ? "text-slate-300" : "text-slate-600"}>
                    Cidade
                  </Label>
                  <Select
                    value={cidade}
                    onValueChange={(value) => {
                      setCidade(value)
                      playSound("click")
                    }}
                    disabled={!estado}
                  >
                    <SelectTrigger
                      className={`${
                        configuracoes.tema === "escuro"
                          ? "bg-slate-800/50 border-slate-600 text-white"
                          : "bg-white border-slate-300 text-slate-800"
                      }`}
                    >
                      <SelectValue placeholder="Selecione a cidade..." />
                    </SelectTrigger>
                    <SelectContent>
                      {estado &&
                        cidadesPorEstado[estado as keyof typeof cidadesPorEstado]?.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    className={`${
                      configuracoes.tema === "escuro" ? "text-slate-300" : "text-slate-600"
                    } flex items-center gap-2`}
                  >
                    <Target className="h-4 w-4" />
                    Orçamento
                  </Label>
                  <Input
                    type="number"
                    placeholder="Ex: 500"
                    value={orcamento || ""}
                    onChange={(e) => setOrcamento(Number.parseFloat(e.target.value) || 0)}
                    className={`${
                      configuracoes.tema === "escuro"
                        ? "bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
                        : "bg-white border-slate-300 text-slate-800 placeholder:text-slate-500"
                    }`}
                  />
                </div>
              </div>

              {/* Resumo Financeiro Avançado */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 border-blue-500/30">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-300">R$ {orcamento.toFixed(2)}</div>
                    <div className="text-sm text-blue-200">Orçamento</div>
                    <Wallet className="h-4 w-4 text-blue-400 mx-auto mt-1" />
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-600/20 to-green-700/20 border-green-500/30">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-300">R$ {totalGasto.toFixed(2)}</div>
                    <div className="text-sm text-green-200">Gasto</div>
                    <TrendingUp className="h-4 w-4 text-green-400 mx-auto mt-1" />
                  </CardContent>
                </Card>

                <Card
                  className={`bg-gradient-to-br ${
                    restante >= 0
                      ? "from-emerald-600/20 to-emerald-700/20 border-emerald-500/30"
                      : "from-red-600/20 to-red-700/20 border-red-500/30"
                  }`}
                >
                  <CardContent className="p-4 text-center">
                    <div className={`text-2xl font-bold ${restante >= 0 ? "text-emerald-300" : "text-red-300"}`}>
                      R$ {restante.toFixed(2)}
                    </div>
                    <div className={`text-sm ${restante >= 0 ? "text-emerald-200" : "text-red-200"}`}>Restante</div>
                    <Target className={`h-4 w-4 ${restante >= 0 ? "text-emerald-400" : "text-red-400"} mx-auto mt-1`} />
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 border-purple-500/30">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-300">
                      {listaCompras.length > 0 ? (totalGasto / listaCompras.length).toFixed(2) : "0.00"}
                    </div>
                    <div className="text-sm text-purple-200">Ticket Médio</div>
                    <BarChart3 className="h-4 w-4 text-purple-400 mx-auto mt-1" />
                  </CardContent>
                </Card>
              </div>

              {/* Progress Bars */}
              <div className="space-y-4">
                {orcamento > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className={configuracoes.tema === "escuro" ? "text-slate-300" : "text-slate-600"}>
                        Progresso do Orçamento
                      </span>
                      <span className={configuracoes.tema === "escuro" ? "text-slate-300" : "text-slate-600"}>
                        {progressoOrcamento.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={Math.min(progressoOrcamento, 100)} className="h-3" />
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={configuracoes.tema === "escuro" ? "text-slate-300" : "text-slate-600"}>
                      Meta de Economia
                    </span>
                    <span className={configuracoes.tema === "escuro" ? "text-slate-300" : "text-slate-600"}>
                      {progressoEconomia.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={Math.min(progressoEconomia, 100)} className="h-3" />
                  <div className="text-xs text-center text-slate-400">
                    {economiaAtual > 0 ? `Economize mais R$ ${economiaAtual.toFixed(2)}` : "Meta atingida! 🎉"}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={gerarPDF}
                  disabled={listaCompras.length === 0}
                  className="bg-slate-700 hover:bg-slate-600 text-white"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  PDF
                </Button>

                <Button
                  onClick={compartilharWhatsApp}
                  disabled={listaCompras.length === 0}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>

                <Button
                  onClick={compararPrecos}
                  disabled={listaCompras.length === 0 || !estado || !cidade || isComparing}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  {isComparing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Comparando...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Comparar
                    </>
                  )}
                </Button>

                <Button onClick={gerarSugestaoIA} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Brain className="mr-2 h-4 w-4" />
                  IA
                </Button>

                <Button
                  onClick={() => setShowEstatisticas(true)}
                  disabled={listaCompras.length === 0}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <PieChart className="mr-2 h-4 w-4" />
                  Stats
                </Button>

                <Button onClick={limparLista} disabled={listaCompras.length === 0} variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Limpar
                </Button>

                <Button onClick={() => setShowCompartilhar(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Users className="mr-2 h-4 w-4" />
                  Compartilhar
                </Button>

                <Button onClick={() => setShowHistorico(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  <History className="mr-2 h-4 w-4" />
                  Histórico
                </Button>

                <Button
                  onClick={finalizarCompra}
                  disabled={listaCompras.length === 0}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckSquare className="mr-2 h-4 w-4" />
                  Finalizar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Categories and Add Product */}
          <div className="space-y-6">
            {/* Adicionar Produto com IA */}
            <Card
              className={`${
                configuracoes.tema === "escuro" ? "bg-slate-800/50 border-slate-600" : "bg-white/80 border-slate-200"
              } backdrop-blur-sm ${animacaoAtiva === "produto-selecionado" ? "ring-2 ring-purple-500" : ""}`}
            >
              <CardHeader>
                <CardTitle
                  className={`${
                    configuracoes.tema === "escuro" ? "text-white" : "text-slate-800"
                  } flex items-center gap-2`}
                >
                  <Plus className="h-5 w-5 text-green-400" />
                  Adicionar Produto
                  <Badge variant="outline" className="ml-auto">
                    <Zap className="h-3 w-3 mr-1" />
                    IA
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className={configuracoes.tema === "escuro" ? "text-slate-300" : "text-slate-600"}>
                    Nome do Produto
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={nomeProduto}
                      onChange={(e) => setNomeProduto(e.target.value)}
                      placeholder="Ex: Arroz 5kg"
                      className={`flex-1 ${
                        configuracoes.tema === "escuro"
                          ? "bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                          : "bg-white border-slate-300 text-slate-800 placeholder:text-slate-500"
                      }`}
                      onKeyPress={(e) => e.key === "Enter" && adicionarProduto()}
                    />
                    <Button
                      size="icon"
                      onClick={iniciarReconhecimentoVoz}
                      className={`${
                        isListening ? "bg-red-600 hover:bg-red-700 animate-pulse" : "bg-blue-600 hover:bg-blue-700"
                      }`}
                      disabled={isListening}
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      onClick={() => setShowCamera(true)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  {isListening && (
                    <div className="text-sm text-blue-400 animate-pulse">🎤 Escutando... Fale o nome do produto</div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className={configuracoes.tema === "escuro" ? "text-slate-300" : "text-slate-600"}>
                      Quantidade
                    </Label>
                    <Input
                      type="number"
                      value={quantidade}
                      onChange={(e) => setQuantidade(Number.parseInt(e.target.value) || 1)}
                      min="1"
                      className={`${
                        configuracoes.tema === "escuro"
                          ? "bg-slate-700/50 border-slate-600 text-white"
                          : "bg-white border-slate-300 text-slate-800"
                      }`}
                      onKeyPress={(e) => e.key === "Enter" && adicionarProduto()}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className={configuracoes.tema === "escuro" ? "text-slate-300" : "text-slate-600"}>
                      Valor (R$)
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={valor}
                      onChange={(e) => setValor(e.target.value)}
                      placeholder="0,00"
                      className={`${
                        configuracoes.tema === "escuro"
                          ? "bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                          : "bg-white border-slate-300 text-slate-800 placeholder:text-slate-500"
                      }`}
                      onKeyPress={(e) => e.key === "Enter" && adicionarProduto()}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className={configuracoes.tema === "escuro" ? "text-slate-300" : "text-slate-600"}>
                    Notas (opcional)
                  </Label>
                  <Textarea
                    placeholder="Ex: Marca específica, promoção..."
                    className={`${
                      configuracoes.tema === "escuro"
                        ? "bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                        : "bg-white border-slate-300 text-slate-800 placeholder:text-slate-500"
                    } h-20`}
                  />
                </div>

                <div className="space-y-2">
                  <Label className={configuracoes.tema === "escuro" ? "text-slate-300" : "text-slate-600"}>
                    Observações para Finalização
                  </Label>
                  <Textarea
                    value={observacoesFinalizacao}
                    onChange={(e) => setObservacoesFinalizacao(e.target.value)}
                    placeholder="Ex: Compra do mês, promoções aproveitadas..."
                    className={`${
                      configuracoes.tema === "escuro"
                        ? "bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                        : "bg-white border-slate-300 text-slate-800 placeholder:text-slate-500"
                    } h-20`}
                  />
                </div>

                <Button
                  onClick={adicionarProduto}
                  disabled={!nomeProduto.trim() || !valor || Number.parseFloat(valor) <= 0}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white group"
                >
                  <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform" />
                  Adicionar à Lista
                  <Sparkles className="ml-2 h-4 w-4 group-hover:animate-pulse" />
                </Button>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card
              className={`${
                configuracoes.tema === "escuro" ? "bg-slate-800/50 border-slate-600" : "bg-white/80 border-slate-200"
              } backdrop-blur-sm`}
            >
              <CardHeader>
                <CardTitle
                  className={`${
                    configuracoes.tema === "escuro" ? "text-white" : "text-slate-800"
                  } flex items-center gap-2`}
                >
                  <Package className="h-5 w-5 text-purple-400" />
                  Categorias Inteligentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(categorias).map(([categoria, produtos]) => (
                    <Card
                      key={categoria}
                      className={`${
                        configuracoes.tema === "escuro"
                          ? "bg-slate-700/30 border-slate-600"
                          : "bg-slate-50/50 border-slate-200"
                      } hover:shadow-lg transition-all duration-300`}
                    >
                      <CardContent className="p-3">
                        <button
                          onClick={() => toggleCategoria(categoria)}
                          className={`w-full flex items-center justify-between text-left hover:${
                            configuracoes.tema === "escuro" ? "bg-slate-600/30" : "bg-slate-100/50"
                          } p-2 rounded transition-colors group`}
                        >
                          <span
                            className={`font-medium ${
                              configuracoes.tema === "escuro" ? "text-white" : "text-slate-800"
                            } group-hover:text-purple-400 transition-colors`}
                          >
                            {categoria}
                          </span>
                          {categoriasExpandidas.includes(categoria) ? (
                            <ChevronUp className="h-4 w-4 text-slate-400 group-hover:text-purple-400 transition-colors" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-purple-400 transition-colors" />
                          )}
                        </button>

                        {categoriasExpandidas.includes(categoria) && (
                          <div className="mt-3 grid grid-cols-2 gap-2 animate-in slide-in-from-top-2 duration-300">
                            {produtos.map((produto) => (
                              <button
                                key={produto}
                                onClick={() => selecionarProduto(produto)}
                                className={`text-left p-2 text-sm ${
                                  configuracoes.tema === "escuro"
                                    ? "text-slate-300 hover:bg-purple-600/20 hover:text-purple-300"
                                    : "text-slate-600 hover:bg-purple-100 hover:text-purple-700"
                                } rounded transition-colors group flex items-center justify-between`}
                              >
                                <span>{produto}</span>
                                {produtosFavoritos.includes(produto) && (
                                  <Heart className="h-3 w-3 text-red-400 fill-current" />
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleFavorito(produto)
                                  }}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Heart
                                    className={`h-3 w-3 ${
                                      produtosFavoritos.includes(produto)
                                        ? "text-red-400 fill-current"
                                        : "text-slate-400"
                                    }`}
                                  />
                                </button>
                              </button>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Shopping List */}
          <Card
            className={`${
              configuracoes.tema === "escuro" ? "bg-slate-800/50 border-slate-600" : "bg-white/80 border-slate-200"
            } backdrop-blur-sm`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle
                  className={`${
                    configuracoes.tema === "escuro" ? "text-white" : "text-slate-800"
                  } flex items-center gap-2`}
                >
                  <ShoppingCart className="h-5 w-5 text-blue-400" />
                  Lista Inteligente
                  {animacaoAtiva === "lista-salva" && <CheckCircle className="h-5 w-5 text-green-500 animate-pulse" />}
                </CardTitle>

                {listaCompras.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Select value={ordenacao} onValueChange={setOrdenacao}>
                      <SelectTrigger className="w-32 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nome">Nome</SelectItem>
                        <SelectItem value="valor">Valor</SelectItem>
                        <SelectItem value="quantidade">Quantidade</SelectItem>
                        <SelectItem value="recente">Recente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {listaCompras.length === 0 ? (
                <div className="text-center py-12">
                  <div className="relative">
                    <ShoppingCart className="h-16 w-16 text-slate-600 mx-auto mb-4 animate-pulse" />
                    <Sparkles className="h-6 w-6 text-purple-400 absolute -top-2 -right-2 animate-ping" />
                  </div>
                  <p className={`${configuracoes.tema === "escuro" ? "text-slate-400" : "text-slate-500"} text-lg`}>
                    Sua lista está esperando
                  </p>
                  <p
                    className={`${configuracoes.tema === "escuro" ? "text-slate-500" : "text-slate-400"} text-sm mt-2`}
                  >
                    Adicione produtos e veja a mágica acontecer ✨
                  </p>

                  <div className="mt-6 flex justify-center gap-2">
                    <Button size="sm" onClick={gerarSugestaoIA} className="bg-blue-600 hover:bg-blue-700">
                      <Lightbulb className="mr-2 h-4 w-4" />
                      Sugestão IA
                    </Button>
                    <Button size="sm" onClick={iniciarReconhecimentoVoz} className="bg-purple-600 hover:bg-purple-700">
                      <Mic className="mr-2 h-4 w-4" />
                      Falar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {listaCompras
                    .sort((a, b) => {
                      switch (ordenacao) {
                        case "valor":
                          return b.valor - a.valor
                        case "quantidade":
                          return b.quantidade - a.quantidade
                        case "recente":
                          return b.adicionadoEm.getTime() - a.adicionadoEm.getTime()
                        default:
                          return a.nome.localeCompare(b.nome)
                      }
                    })
                    .map((produto, index) => (
                      <Card
                        key={produto.id}
                        className={`${
                          configuracoes.tema === "escuro"
                            ? "bg-slate-700/30 border-slate-600 hover:bg-slate-700/50"
                            : "bg-slate-50/50 border-slate-200 hover:bg-slate-100/50"
                        } transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group animate-in slide-in-from-left-2`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 flex items-center gap-3">
                              <div className="text-2xl group-hover:animate-bounce">{produto.emoji}</div>
                              <div className="flex-1">
                                <h3
                                  className={`font-medium ${
                                    configuracoes.tema === "escuro" ? "text-white" : "text-slate-800"
                                  } group-hover:text-purple-400 transition-colors`}
                                >
                                  {produto.nome}
                                </h3>
                                <p
                                  className={`text-sm ${
                                    configuracoes.tema === "escuro" ? "text-slate-400" : "text-slate-500"
                                  }`}
                                >
                                  Qtd: {produto.quantidade} | Valor unitário: R$ {produto.valor.toFixed(2)}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {produto.categoria || "Outros"}
                                  </Badge>
                                  {produto.prioridade && (
                                    <Badge
                                      variant={
                                        produto.prioridade === "alta"
                                          ? "destructive"
                                          : produto.prioridade === "media"
                                            ? "default"
                                            : "secondary"
                                      }
                                      className="text-xs"
                                    >
                                      {produto.prioridade}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <div className="text-lg font-bold text-green-400">R$ {produto.total.toFixed(2)}</div>
                                <div className="text-xs text-slate-400">
                                  {new Date(produto.adicionadoEm).toLocaleTimeString("pt-BR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </div>
                              </div>
                              <div className="flex flex-col gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => toggleFavorito(produto.nome)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Heart
                                    className={`h-4 w-4 ${
                                      produtosFavoritos.includes(produto.nome)
                                        ? "text-red-400 fill-current"
                                        : "text-slate-400"
                                    }`}
                                  />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => removerProduto(produto.id)}
                                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                  <Separator className={configuracoes.tema === "escuro" ? "bg-slate-600" : "bg-slate-300"} />

                  <div className="flex justify-between items-center pt-4">
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-lg font-semibold ${
                          configuracoes.tema === "escuro" ? "text-white" : "text-slate-800"
                        }`}
                      >
                        Total Geral:
                      </span>
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1">
                        {listaCompras.length} {listaCompras.length === 1 ? "item" : "itens"}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-green-400">R$ {totalGasto.toFixed(2)}</span>
                      {orcamento > 0 && (
                        <div className="text-xs text-slate-400">
                          {((totalGasto / orcamento) * 100).toFixed(1)}% do orçamento
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Notas da Lista */}
                  <div className="mt-4">
                    <Label
                      className={`text-sm ${configuracoes.tema === "escuro" ? "text-slate-300" : "text-slate-600"}`}
                    >
                      Notas da Lista
                    </Label>
                    <Textarea
                      value={notasLista}
                      onChange={(e) => setNotasLista(e.target.value)}
                      placeholder="Adicione observações sobre sua lista..."
                      className={`mt-2 ${
                        configuracoes.tema === "escuro"
                          ? "bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                          : "bg-white border-slate-300 text-slate-800 placeholder:text-slate-500"
                      } h-20`}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Estatísticas Modal */}
        <Dialog open={showEstatisticas} onOpenChange={setShowEstatisticas}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-800 border-slate-600">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2">
                <PieChart className="h-5 w-5 text-purple-400" />
                Estatísticas Inteligentes
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Resumo Geral</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{estatisticas.totalItens}</div>
                      <div className="text-sm text-slate-400">Total de Itens</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">R$ {estatisticas.ticketMedio.toFixed(2)}</div>
                      <div className="text-sm text-slate-400">Ticket Médio</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">R$ {estatisticas.mediaPrecos.toFixed(2)}</div>
                      <div className="text-sm text-slate-400">Preço Médio</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-amber-400">
                        {estatisticas.produtoMaisCaro.nome.substring(0, 10)}...
                      </div>
                      <div className="text-sm text-slate-400">Mais Caro</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Categorias</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(estatisticas.categoriasMaisCompradas)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([categoria, quantidade]) => (
                        <div key={categoria} className="flex items-center justify-between">
                          <span className="text-slate-300">{categoria}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-slate-600 rounded-full h-2">
                              <div
                                className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                                style={{
                                  width: `${(quantidade / Math.max(...Object.values(estatisticas.categoriasMaisCompradas))) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-purple-400 font-semibold w-8 text-right">{quantidade}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 text-center">
              <Button onClick={() => setShowEstatisticas(false)} className="bg-purple-600 hover:bg-purple-700">
                <Eye className="mr-2 h-4 w-4" />
                Entendi!
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {/* Modal de Comparação de Preços */}
      <ComparacaoModal
        open={showComparacao}
        onOpenChange={setShowComparacao}
        comparacoes={comparacaoPrecos}
        cidade={cidade}
        estado={estado}
      />
    </div>
  )
}
