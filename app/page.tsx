"use client"

import { useState, useEffect, useRef } from "react"

interface Produto {
  id: number
  nome: string
  quantidade: number
  valor: number
  total: number
  categoria?: string
  emoji?: string
  adicionadoEm: Date
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

const categorias = {
  "🌾 Cereais": ["Arroz", "Feijão", "Lentilha", "Grão de Bico", "Quinoa", "Aveia"],
  "🥛 Laticínios": ["Leite", "Queijo", "Iogurte", "Manteiga", "Requeijão", "Creme de Leite"],
  "🥩 Proteína": ["Frango", "Carne Bovina", "Peixe", "Ovos", "Presunto", "Mortadela"],
  "🍎 Hortifrúti": ["Banana", "Maçã", "Tomate", "Cebola", "Batata", "Cenoura"],
  "🍞 Padaria": ["Pão de Forma", "Pão Francês", "Biscoito", "Bolo", "Torrada"],
  "🧂 Outros": ["Açúcar", "Sal", "Óleo", "Vinagre", "Temperos", "Café"],
}

const emojisAleatorios = ["🛒", "🛍️", "🎯", "💫", "⭐", "🌟", "✨", "🎉", "🎊", "🔥"]

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
    descricao: "Adicione 20 produtos",
    icone: "📋",
    desbloqueada: false,
    progresso: 0,
    meta: 20,
  },
]

export default function ComprinhasApp() {
  const [showSplash, setShowSplash] = useState(true)
  const [listaCompras, setListaCompras] = useState<Produto[]>([])
  const [orcamento, setOrcamento] = useState(0)
  const [nomeProduto, setNomeProduto] = useState("")
  const [quantidade, setQuantidade] = useState(1)
  const [valor, setValor] = useState("")
  const [categoriasExpandidas, setCategoriasExpandidas] = useState<string[]>([])
  const [conquistasDesbloqueadas, setConquistasDesbloqueadas] = useState<Conquista[]>(conquistasIniciais)
  const [showConquista, setShowConquista] = useState<Conquista | null>(null)
  const [sugestaoIA, setSugestaoIA] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [showEstatisticas, setShowEstatisticas] = useState(false)
  const [tempoSessao, setTempoSessao] = useState(0)
  const [som, setSom] = useState(true)

  const inicioSessaoRef = useRef<Date>(new Date())
  const totalGasto = listaCompras.reduce((sum, produto) => sum + produto.total, 0)
  const restante = orcamento - totalGasto
  const progressoOrcamento = orcamento > 0 ? (totalGasto / orcamento) * 100 : 0

  // Timer da sessão
  useEffect(() => {
    const interval = setInterval(() => {
      setTempoSessao(Math.floor((new Date().getTime() - inicioSessaoRef.current.getTime()) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Sons
  const playSound = (tipo: "sucesso" | "erro" | "click" | "conquista") => {
    if (!som) return
    // Simular som com vibração se disponível
    if (navigator.vibrate) {
      const padroes = {
        sucesso: [100],
        erro: [200, 100, 200],
        click: [50],
        conquista: [100, 50, 100, 50, 100],
      }
      navigator.vibrate(padroes[tipo])
    }
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
    ]
    setSugestaoIA(sugestoes[Math.floor(Math.random() * sugestoes.length)])
    playSound("click")
  }

  // Reconhecimento de voz (simulado)
  const iniciarReconhecimentoVoz = () => {
    setIsListening(true)
    playSound("click")

    // Simular reconhecimento
    setTimeout(() => {
      const produtosExemplo = ["Arroz", "Feijão", "Leite", "Pão", "Banana", "Frango"]
      const produtoAleatorio = produtosExemplo[Math.floor(Math.random() * produtosExemplo.length)]
      setNomeProduto(produtoAleatorio)
      setIsListening(false)
      playSound("sucesso")
    }, 2000)
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
  }

  const adicionarProduto = () => {
    if (!nomeProduto.trim() || !valor || Number.parseFloat(valor) <= 0) {
      playSound("erro")
      return
    }

    // Detectar categoria automaticamente
    let categoriaDetectada = "🧂 Outros"
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
  }

  const removerProduto = (id: number) => {
    setListaCompras((prev) => prev.filter((produto) => produto.id !== id))
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

  const gerarPDF = () => {
    if (listaCompras.length === 0) return

    const conteudo = `
LISTA DE COMPRAS - ${new Date().toLocaleDateString()}

${listaCompras
  .map(
    (produto, index) =>
      `${index + 1}. ${produto.nome}
   Qtd: ${produto.quantidade} | R$ ${produto.valor.toFixed(2)} = R$ ${produto.total.toFixed(2)}
   Categoria: ${produto.categoria || "Outros"}
`,
  )
  .join("\n")}

TOTAL GERAL: R$ ${totalGasto.toFixed(2)}
${orcamento > 0 ? `ORÇAMENTO: R$ ${orcamento.toFixed(2)}` : ""}
${orcamento > 0 ? `RESTANTE: R$ ${restante.toFixed(2)}` : ""}

Gerado pelo Comprinhas App
    `

    const blob = new Blob([conteudo], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `lista-compras-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    playSound("sucesso")
  }

  const compartilharWhatsApp = () => {
    if (listaCompras.length === 0) return

    const mensagem = `🛒 *LISTA DE COMPRAS*
📅 ${new Date().toLocaleDateString()}

${listaCompras
  .map(
    (produto, index) =>
      `${index + 1}. ${produto.emoji || "📦"} *${produto.nome}*
   Qtd: ${produto.quantidade} | R$ ${produto.valor.toFixed(2)} = *R$ ${produto.total.toFixed(2)}*`,
  )
  .join("\n\n")}

💵 *TOTAL: R$ ${totalGasto.toFixed(2)}*
${orcamento > 0 ? `💳 Orçamento: R$ ${orcamento.toFixed(2)}` : ""}
${orcamento > 0 ? `💰 Restante: R$ ${restante.toFixed(2)}` : ""}

✨ _Gerado pelo Comprinhas App_`

    const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`
    window.open(url, "_blank")
    playSound("sucesso")
  }

  // Tela de Splash
  if (showSplash) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(to bottom right, #1e293b, #7c3aed, #1e293b)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Partículas animadas */}
        <div style={{ position: "absolute", inset: 0 }}>
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: "8px",
                height: "8px",
                background: "rgba(124, 58, 237, 0.3)",
                borderRadius: "50%",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div style={{ textAlign: "center", position: "relative", zIndex: 10 }}>
          <div style={{ fontSize: "6rem", marginBottom: "2rem", animation: "bounce 2s ease-in-out infinite" }}>🛒</div>
          <h1
            style={{
              fontSize: "4rem",
              fontWeight: "bold",
              color: "white",
              marginBottom: "1rem",
              background: "linear-gradient(to right, #a855f7, #3b82f6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Comprinhas
          </h1>
          <p style={{ fontSize: "1.5rem", color: "#e2e8f0", marginBottom: "3rem", maxWidth: "600px" }}>
            A experiência mais inteligente para suas compras
          </p>

          <div
            style={{ display: "flex", justifyContent: "center", gap: "2rem", marginBottom: "3rem", flexWrap: "wrap" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#cbd5e1" }}>
              <span>🧠</span> IA Integrada
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#cbd5e1" }}>
              <span>⚡</span> Super Rápido
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#cbd5e1" }}>
              <span>🏆</span> Gamificado
            </div>
          </div>

          <button
            onClick={() => {
              setShowSplash(false)
              playSound("sucesso")
            }}
            style={{
              background: "linear-gradient(to right, #7c3aed, #3b82f6)",
              color: "white",
              padding: "1rem 2rem",
              fontSize: "1.2rem",
              border: "none",
              borderRadius: "50px",
              cursor: "pointer",
              boxShadow: "0 10px 30px rgba(124, 58, 237, 0.3)",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              margin: "0 auto",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-3px) scale(1.05)"
              e.currentTarget.style.boxShadow = "0 15px 40px rgba(124, 58, 237, 0.4)"
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)"
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(124, 58, 237, 0.3)"
            }}
          >
            🚀 Começar Jornada ✨
          </button>

          <div
            style={{
              marginTop: "2rem",
              fontSize: "0.8rem",
              color: "#64748b",
              maxWidth: "400px",
              margin: "2rem auto 0",
            }}
          >
            ✨ Reconhecimento de voz • 🎯 Comparação inteligente • 🏆 Sistema de conquistas
          </div>
        </div>

        <style jsx>{`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-20px); }
            60% { transform: translateY(-10px); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.2); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #1e293b, #7c3aed, #1e293b)",
        color: "white",
        padding: "1rem",
      }}
    >
      {/* Conquista Modal */}
      {showConquista && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              background: "linear-gradient(to right, #f59e0b, #f97316)",
              padding: "2rem",
              borderRadius: "16px",
              textAlign: "center",
              maxWidth: "400px",
              margin: "1rem",
              boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>{showConquista.icone}</div>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>{showConquista.titulo}</h3>
            <p style={{ marginBottom: "1.5rem", opacity: 0.9 }}>{showConquista.descricao}</p>
            <button
              onClick={() => setShowConquista(null)}
              style={{
                background: "white",
                color: "#f97316",
                padding: "0.75rem 1.5rem",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              🏆 Incrível!
            </button>
          </div>
        </div>
      )}

      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header com Status */}
        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
              fontSize: "0.9rem",
              color: "#cbd5e1",
            }}
          >
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <span>⏱️ {formatarTempo(tempoSessao)}</span>
              <span>
                🏆 {conquistasDesbloqueadas.filter((c) => c.desbloqueada).length}/{conquistasDesbloqueadas.length}
              </span>
              <span>🔥 {listaCompras.length} itens</span>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => setSom(!som)}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  color: "white",
                  padding: "0.5rem",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                {som ? "🔊" : "🔇"}
              </button>
              <button
                onClick={() => setShowEstatisticas(true)}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  color: "white",
                  padding: "0.5rem",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                ⚙️
              </button>
            </div>
          </div>

          {/* Header Principal */}
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              padding: "2rem",
              borderRadius: "16px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "2rem",
              }}
            >
              <h1
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  margin: 0,
                }}
              >
                🛒 Comprinhas Inteligentes
              </h1>
              <div
                style={{
                  background: "rgba(124, 58, 237, 0.2)",
                  color: "#a855f7",
                  padding: "0.5rem 1rem",
                  borderRadius: "20px",
                  border: "1px solid rgba(124, 58, 237, 0.3)",
                }}
              >
                {listaCompras.length} {listaCompras.length === 1 ? "item" : "itens"}
              </div>
            </div>

            {/* Sugestão da IA */}
            {sugestaoIA && (
              <div
                style={{
                  background: "rgba(59, 130, 246, 0.1)",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                  padding: "1rem",
                  borderRadius: "8px",
                  marginBottom: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span>🧠</span>
                <span style={{ color: "#93c5fd" }}>{sugestaoIA}</span>
              </div>
            )}

            {/* Orçamento */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem" }}>🎯 Orçamento (R$)</label>
              <input
                type="number"
                placeholder="Ex: 500"
                value={orcamento || ""}
                onChange={(e) => setOrcamento(Number.parseFloat(e.target.value) || 0)}
                style={{
                  width: "200px",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.1)",
                  color: "white",
                  fontSize: "1rem",
                }}
              />
            </div>

            {/* Resumo Financeiro */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  background: "linear-gradient(to bottom right, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.1))",
                  padding: "1rem",
                  borderRadius: "8px",
                  textAlign: "center",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                }}
              >
                <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#60a5fa" }}>
                  R$ {orcamento.toFixed(2)}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#93c5fd" }}>Orçamento</div>
              </div>

              <div
                style={{
                  background: "linear-gradient(to bottom right, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1))",
                  padding: "1rem",
                  borderRadius: "8px",
                  textAlign: "center",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                }}
              >
                <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#34d399" }}>
                  R$ {totalGasto.toFixed(2)}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#6ee7b7" }}>Gasto</div>
              </div>

              <div
                style={{
                  background: `linear-gradient(to bottom right, ${restante >= 0 ? "rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1)"})`,
                  padding: "1rem",
                  borderRadius: "8px",
                  textAlign: "center",
                  border: `1px solid ${restante >= 0 ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                }}
              >
                <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: restante >= 0 ? "#34d399" : "#f87171" }}>
                  R$ {restante.toFixed(2)}
                </div>
                <div style={{ fontSize: "0.8rem", color: restante >= 0 ? "#6ee7b7" : "#fca5a5" }}>Restante</div>
              </div>
            </div>

            {/* Progress Bar */}
            {orcamento > 0 && (
              <div style={{ marginBottom: "1.5rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                    fontSize: "0.9rem",
                  }}
                >
                  <span>Progresso do Orçamento</span>
                  <span>{progressoOrcamento.toFixed(1)}%</span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "8px",
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min(progressoOrcamento, 100)}%`,
                      height: "100%",
                      background:
                        progressoOrcamento > 90
                          ? "linear-gradient(to right, #ef4444, #dc2626)"
                          : "linear-gradient(to right, #10b981, #059669)",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <button
                onClick={gerarPDF}
                disabled={listaCompras.length === 0}
                style={{
                  background: "rgba(71, 85, 105, 0.8)",
                  color: "white",
                  padding: "0.5rem 1rem",
                  border: "none",
                  borderRadius: "6px",
                  cursor: listaCompras.length === 0 ? "not-allowed" : "pointer",
                  opacity: listaCompras.length === 0 ? 0.5 : 1,
                  fontSize: "0.9rem",
                }}
              >
                📄 PDF
              </button>

              <button
                onClick={compartilharWhatsApp}
                disabled={listaCompras.length === 0}
                style={{
                  background: "rgba(34, 197, 94, 0.8)",
                  color: "white",
                  padding: "0.5rem 1rem",
                  border: "none",
                  borderRadius: "6px",
                  cursor: listaCompras.length === 0 ? "not-allowed" : "pointer",
                  opacity: listaCompras.length === 0 ? 0.5 : 1,
                  fontSize: "0.9rem",
                }}
              >
                💬 WhatsApp
              </button>

              <button
                onClick={gerarSugestaoIA}
                style={{
                  background: "rgba(59, 130, 246, 0.8)",
                  color: "white",
                  padding: "0.5rem 1rem",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                🧠 IA
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2rem" }}>
          {/* Adicionar Produto */}
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              padding: "2rem",
              borderRadius: "16px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <h2
              style={{
                fontSize: "1.3rem",
                fontWeight: "bold",
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              ➕ Adicionar Produto
              <span
                style={{
                  background: "rgba(59, 130, 246, 0.2)",
                  color: "#60a5fa",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "12px",
                  fontSize: "0.7rem",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                }}
              >
                ⚡ IA
              </span>
            </h2>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem" }}>Nome do Produto</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="text"
                  value={nomeProduto}
                  onChange={(e) => setNomeProduto(e.target.value)}
                  placeholder="Ex: Arroz 5kg"
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: "rgba(255,255,255,0.1)",
                    color: "white",
                    fontSize: "1rem",
                  }}
                  onKeyPress={(e) => e.key === "Enter" && adicionarProduto()}
                />
                <button
                  onClick={iniciarReconhecimentoVoz}
                  disabled={isListening}
                  style={{
                    background: isListening ? "rgba(239, 68, 68, 0.8)" : "rgba(59, 130, 246, 0.8)",
                    color: "white",
                    padding: "0.75rem",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  {isListening ? "🔴" : "🎤"}
                </button>
              </div>
              {isListening && (
                <div style={{ fontSize: "0.8rem", color: "#60a5fa", marginTop: "0.5rem" }}>
                  🎤 Escutando... Fale o nome do produto
                </div>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem" }}>Quantidade</label>
                <input
                  type="number"
                  value={quantidade}
                  onChange={(e) => setQuantidade(Number.parseInt(e.target.value) || 1)}
                  min="1"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: "rgba(255,255,255,0.1)",
                    color: "white",
                    fontSize: "1rem",
                  }}
                  onKeyPress={(e) => e.key === "Enter" && adicionarProduto()}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem" }}>Valor (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  placeholder="0,00"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: "rgba(255,255,255,0.1)",
                    color: "white",
                    fontSize: "1rem",
                  }}
                  onKeyPress={(e) => e.key === "Enter" && adicionarProduto()}
                />
              </div>
            </div>

            <button
              onClick={adicionarProduto}
              disabled={!nomeProduto.trim() || !valor || Number.parseFloat(valor) <= 0}
              style={{
                width: "100%",
                padding: "1rem",
                background: "linear-gradient(to right, #10b981, #059669)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1.1rem",
                fontWeight: "bold",
                cursor: !nomeProduto.trim() || !valor || Number.parseFloat(valor) <= 0 ? "not-allowed" : "pointer",
                opacity: !nomeProduto.trim() || !valor || Number.parseFloat(valor) <= 0 ? 0.5 : 1,
                transition: "all 0.3s ease",
              }}
            >
              ➕ Adicionar à Lista ✨
            </button>
          </div>

          {/* Categorias */}
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              padding: "2rem",
              borderRadius: "16px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <h2
              style={{
                fontSize: "1.3rem",
                fontWeight: "bold",
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              📦 Categorias Inteligentes
            </h2>

            <div style={{ space: "1rem" }}>
              {Object.entries(categorias).map(([categoria, produtos]) => (
                <div
                  key={categoria}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "8px",
                    marginBottom: "0.5rem",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <button
                    onClick={() => toggleCategoria(categoria)}
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "1rem",
                      background: "transparent",
                      border: "none",
                      color: "white",
                      cursor: "pointer",
                      fontSize: "1rem",
                    }}
                  >
                    <span style={{ fontWeight: "500" }}>{categoria}</span>
                    <span>{categoriasExpandidas.includes(categoria) ? "▲" : "▼"}</span>
                  </button>

                  {categoriasExpandidas.includes(categoria) && (
                    <div
                      style={{
                        padding: "0 1rem 1rem 1rem",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                        gap: "0.5rem",
                      }}
                    >
                      {produtos.map((produto) => (
                        <button
                          key={produto}
                          onClick={() => selecionarProduto(produto)}
                          style={{
                            padding: "0.5rem",
                            background: "rgba(124, 58, 237, 0.1)",
                            border: "1px solid rgba(124, 58, 237, 0.3)",
                            borderRadius: "6px",
                            color: "#a855f7",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                            transition: "all 0.2s ease",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = "rgba(124, 58, 237, 0.2)"
                            e.currentTarget.style.color = "#c084fc"
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = "rgba(124, 58, 237, 0.1)"
                            e.currentTarget.style.color = "#a855f7"
                          }}
                        >
                          {produto}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lista de Compras */}
        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            padding: "2rem",
            borderRadius: "16px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.1)",
            marginTop: "2rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.3rem",
              fontWeight: "bold",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            🛒 Lista Inteligente
          </h2>

          {listaCompras.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", opacity: 0.7 }}>
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🛒</div>
              <p style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>Sua lista está esperando</p>
              <p style={{ fontSize: "0.9rem", color: "#cbd5e1" }}>Adicione produtos e veja a mágica acontecer ✨</p>

              <div
                style={{ marginTop: "2rem", display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}
              >
                <button
                  onClick={gerarSugestaoIA}
                  style={{
                    background: "rgba(59, 130, 246, 0.8)",
                    color: "white",
                    padding: "0.5rem 1rem",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                  }}
                >
                  💡 Sugestão IA
                </button>
                <button
                  onClick={iniciarReconhecimentoVoz}
                  style={{
                    background: "rgba(124, 58, 237, 0.8)",
                    color: "white",
                    padding: "0.5rem 1rem",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                  }}
                >
                  🎤 Falar
                </button>
              </div>
            </div>
          ) : (
            <div style={{ space: "1rem" }}>
              {listaCompras.map((produto, index) => (
                <div
                  key={produto.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1rem",
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "8px",
                    marginBottom: "0.5rem",
                    border: "1px solid rgba(255,255,255,0.1)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)"
                    e.currentTarget.style.transform = "translateY(-2px)"
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)"
                    e.currentTarget.style.transform = "translateY(0)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1 }}>
                    <div style={{ fontSize: "2rem" }}>{produto.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "bold" }}>{produto.nome}</h3>
                      <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.9rem", color: "#cbd5e1" }}>
                        Qtd: {produto.quantidade} | R$ {produto.valor.toFixed(2)} cada
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.25rem" }}>
                        <span
                          style={{
                            background: "rgba(124, 58, 237, 0.2)",
                            color: "#a855f7",
                            padding: "0.125rem 0.5rem",
                            borderRadius: "12px",
                            fontSize: "0.7rem",
                            border: "1px solid rgba(124, 58, 237, 0.3)",
                          }}
                        >
                          {produto.categoria || "Outros"}
                        </span>
                        <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>
                          {new Date(produto.adicionadoEm).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#10b981" }}>
                        R$ {produto.total.toFixed(2)}
                      </div>
                    </div>
                    <button
                      onClick={() => removerProduto(produto.id)}
                      style={{
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "0.5rem",
                        cursor: "pointer",
                        fontSize: "1rem",
                        transition: "all 0.2s ease",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = "#dc2626"
                        e.currentTarget.style.transform = "scale(1.1)"
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = "#ef4444"
                        e.currentTarget.style.transform = "scale(1)"
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}

              {/* Total */}
              <div
                style={{
                  borderTop: "2px solid rgba(255,255,255,0.2)",
                  paddingTop: "1rem",
                  marginTop: "1rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{ fontSize: "1.3rem", fontWeight: "bold" }}>Total Geral:</span>
                  <span
                    style={{
                      background: "linear-gradient(to right, #10b981, #059669)",
                      color: "white",
                      padding: "0.5rem 1rem",
                      borderRadius: "20px",
                      fontSize: "0.9rem",
                    }}
                  >
                    {listaCompras.length} {listaCompras.length === 1 ? "item" : "itens"}
                  </span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "2rem", fontWeight: "bold", color: "#10b981" }}>
                    R$ {totalGasto.toFixed(2)}
                  </span>
                  {orcamento > 0 && (
                    <div style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>
                      {((totalGasto / orcamento) * 100).toFixed(1)}% do orçamento
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal de Estatísticas */}
        {showEstatisticas && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              style={{
                background: "rgba(30, 41, 59, 0.95)",
                padding: "2rem",
                borderRadius: "16px",
                maxWidth: "600px",
                width: "90%",
                maxHeight: "80vh",
                overflow: "auto",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "2rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    margin: 0,
                  }}
                >
                  📊 Estatísticas & Conquistas
                </h3>
                <button
                  onClick={() => setShowEstatisticas(false)}
                  style={{
                    background: "rgba(239, 68, 68, 0.8)",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    padding: "0.5rem",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Estatísticas Gerais */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                  gap: "1rem",
                  marginBottom: "2rem",
                }}
              >
                <div
                  style={{
                    background: "rgba(59, 130, 246, 0.1)",
                    padding: "1rem",
                    borderRadius: "8px",
                    textAlign: "center",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                  }}
                >
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#60a5fa" }}>{listaCompras.length}</div>
                  <div style={{ fontSize: "0.8rem", color: "#93c5fd" }}>Total de Itens</div>
                </div>

                <div
                  style={{
                    background: "rgba(16, 185, 129, 0.1)",
                    padding: "1rem",
                    borderRadius: "8px",
                    textAlign: "center",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                  }}
                >
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#34d399" }}>
                    R$ {listaCompras.length > 0 ? (totalGasto / listaCompras.length).toFixed(2) : "0.00"}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#6ee7b7" }}>Ticket Médio</div>
                </div>

                <div
                  style={{
                    background: "rgba(124, 58, 237, 0.1)",
                    padding: "1rem",
                    borderRadius: "8px",
                    textAlign: "center",
                    border: "1px solid rgba(124, 58, 237, 0.3)",
                  }}
                >
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#a855f7" }}>
                    {formatarTempo(tempoSessao)}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#c084fc" }}>Tempo de Sessão</div>
                </div>
              </div>

              {/* Conquistas */}
              <h4 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem", color: "white" }}>
                🏆 Conquistas
              </h4>
              <div style={{ space: "1rem" }}>
                {conquistasDesbloqueadas.map((conquista) => (
                  <div
                    key={conquista.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "1rem",
                      background: conquista.desbloqueada ? "rgba(245, 158, 11, 0.1)" : "rgba(255,255,255,0.05)",
                      borderRadius: "8px",
                      marginBottom: "0.5rem",
                      border: conquista.desbloqueada
                        ? "1px solid rgba(245, 158, 11, 0.3)"
                        : "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "2rem",
                        filter: conquista.desbloqueada ? "none" : "grayscale(100%)",
                      }}
                    >
                      {conquista.icone}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h5
                        style={{
                          margin: 0,
                          fontSize: "1rem",
                          fontWeight: "bold",
                          color: conquista.desbloqueada ? "#f59e0b" : "white",
                        }}
                      >
                        {conquista.titulo}
                      </h5>
                      <p
                        style={{
                          margin: "0.25rem 0 0 0",
                          fontSize: "0.8rem",
                          color: "#cbd5e1",
                        }}
                      >
                        {conquista.descricao}
                      </p>
                      {conquista.progresso !== undefined && conquista.meta && (
                        <div style={{ marginTop: "0.5rem" }}>
                          <div
                            style={{
                              width: "100%",
                              height: "4px",
                              background: "rgba(255,255,255,0.1)",
                              borderRadius: "2px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${(conquista.progresso / conquista.meta) * 100}%`,
                                height: "100%",
                                background: "linear-gradient(to right, #f59e0b, #d97706)",
                                transition: "width 0.3s ease",
                              }}
                            />
                          </div>
                          <div
                            style={{
                              fontSize: "0.7rem",
                              color: "#94a3b8",
                              marginTop: "0.25rem",
                            }}
                          >
                            {conquista.progresso}/{conquista.meta}
                          </div>
                        </div>
                      )}
                    </div>
                    {conquista.desbloqueada && <div style={{ color: "#f59e0b", fontSize: "1.2rem" }}>✓</div>}
                  </div>
                ))}
              </div>

              <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <button
                  onClick={() => setShowEstatisticas(false)}
                  style={{
                    background: "linear-gradient(to right, #124, 58, 237, #3b82f6)",
                    color: "white",
                    padding: "0.75rem 1.5rem",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  👁️ Entendi!
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
