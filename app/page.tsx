"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

// UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Icons
import { ShoppingCart, Plus, Trash2, Search, X, LayoutGrid, List, PiggyBank, Target, Flame, Snowflake, Bot } from "lucide-react"

// Types
interface Produto {
  id: number;
  nome: string;
  quantidade: number;
  valor: number;
  categoria: string;
}

interface Categoria {
  nome: string;
  emoji: string;
  items: Produto[];
}

// Mock Data & Helpers
const CATEGORIAS_MAP: Record<string, string> = {
  Hortifruti: "🍎",
  Laticínios: "🧀",
  Carnes: "🥩",
  Padaria: "🍞",
  Bebidas: "🥤",
  Limpeza: "🧼",
  Outros: "🛒",
};

const detectCategory = (nome: string): string => {
  const lowerCaseName = nome.toLowerCase();
  if (lowerCaseName.includes("leite") || lowerCaseName.includes("queijo") || lowerCaseName.includes("iogurte")) return "Laticínios";
  if (lowerCaseName.includes("maçã") || lowerCaseName.includes("banana") || lowerCaseName.includes("alface")) return "Hortifruti";
  if (lowerCaseName.includes("frango") || lowerCaseName.includes("carne") || lowerCaseName.includes("peixe")) return "Carnes";
  if (lowerCaseName.includes("pão") || lowerCaseName.includes("bolo")) return "Padaria";
  if (lowerCaseName.includes("coca-cola") || lowerCaseName.includes("suco") || lowerCaseName.includes("água")) return "Bebidas";
  if (lowerCaseName.includes("sabão") || lowerCaseName.includes("detergente") || lowerCaseName.includes("amaciante")) return "Limpeza";
  return "Outros";
};

// Main App Component
export default function ComprinhasProApp() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [orcamento, setOrcamento] = useState(800);
  const [nomeProduto, setNomeProduto] = useState("");
  const [valorProduto, setValorProduto] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isGrid, setIsGrid] = useState(true);

  const totalGasto = useMemo(() => produtos.reduce((acc, p) => acc + p.valor * p.quantidade, 0), [produtos]);
  const percentualGasto = useMemo(() => (totalGasto / orcamento) * 100, [totalGasto, orcamento]);

  const adicionarProduto = () => {
    if (!nomeProduto || !valorProduto) return;
    const newProduct: Produto = {
      id: Date.now(),
      nome: nomeProduto,
      valor: parseFloat(valorProduto),
      quantidade: 1,
      categoria: detectCategory(nomeProduto),
    };
    setProdutos(prev => [newProduct, ...prev]);
    setNomeProduto("");
    setValorProduto("");
  };

  const removerProduto = (id: number) => {
    setProdutos(prev => prev.filter(p => p.id !== id));
  };
  
  const filteredProdutos = useMemo(() => {
    return produtos.filter(p => p.nome.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [produtos, searchTerm]);

  const produtosAgrupados = useMemo(() => {
    const grupos: Record<string, Categoria> = {};
    filteredProdutos.forEach(produto => {
      if (!grupos[produto.categoria]) {
        grupos[produto.categoria] = {
          nome: produto.categoria,
          emoji: CATEGORIAS_MAP[produto.categoria] || "🛒",
          items: [],
        };
      }
      grupos[produto.categoria].items.push(produto);
    });
    return Object.values(grupos);
  }, [filteredProdutos]);

  const getFinancialStatus = () => {
    if (percentualGasto < 50) return { color: "text-green-400", bgColor: "bg-green-500", icon: <Snowflake className="h-8 w-8" /> };
    if (percentualGasto < 85) return { color: "text-yellow-400", bgColor: "bg-yellow-500", icon: <Target className="h-8 w-8" /> };
    return { color: "text-red-400", bgColor: "bg-red-500", icon: <Flame className="h-8 w-8" /> };
  };
  
  const { color, bgColor, icon } = getFinancialStatus();

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-sans">
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-4 md:p-8 max-w-[1600px] mx-auto">
        
        {/* Coluna Central: Lista de Compras */}
        <div className="lg:col-span-8 xl:col-span-6">
          <header className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter text-slate-900 dark:text-white">Sua Lista de Compras</h1>
              <p className="text-slate-500 dark:text-slate-400">Adicione, remova e organize seus itens.</p>
            </div>
             <div className="flex items-center gap-2 p-1 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg">
                <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                         <Button variant="ghost" size="icon" onClick={() => setIsGrid(true)} className={isGrid ? 'bg-slate-100 dark:bg-slate-800' : ''}>
                           <LayoutGrid className="h-4 w-4"/>
                         </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Visualização em Grade</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                         <Button variant="ghost" size="icon" onClick={() => setIsGrid(false)} className={!isGrid ? 'bg-slate-100 dark:bg-slate-800' : ''}>
                           <List className="h-4 w-4"/>
                         </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Visualização em Lista</p></TooltipContent>
                    </Tooltip>
                </TooltipProvider>
              </div>
          </header>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"/>
            <Input 
              placeholder="Buscar na lista..." 
              className="pl-10 h-12 text-base bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <AnimatePresence>
            {produtosAgrupados.length > 0 ? (
              <motion.div layout>
                 <Accordion type="multiple" defaultValue={produtosAgrupados.map(g => g.nome)} className="space-y-4">
                  <AnimatePresence>
                  {produtosAgrupados.map((grupo) => (
                    <motion.div key={grupo.nome} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <AccordionItem value={grupo.nome} className="border-none">
                             <Card className="bg-white dark:bg-slate-900/50 overflow-hidden">
                               <AccordionTrigger className="p-4 hover:no-underline">
                                 <div className="flex items-center gap-4">
                                   <span className="text-2xl">{grupo.emoji}</span>
                                   <h3 className="font-bold text-lg">{grupo.nome}</h3>
                                   <Badge variant="secondary">{grupo.items.length}</Badge>
                                 </div>
                               </AccordionTrigger>
                               <AccordionContent className="px-4">
                                 <motion.div 
                                    className={isGrid ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-2"}
                                  >
                                    <AnimatePresence>
                                       {grupo.items.map((produto) => (
                                          <motion.div
                                            key={produto.id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.2 }}
                                            className="relative group"
                                          >
                                              <Card className="hover:border-purple-500 dark:hover:border-purple-500 transition-colors bg-slate-50 dark:bg-slate-800/80">
                                                <CardContent className="p-4 flex items-center justify-between">
                                                  <span className="font-semibold">{produto.nome}</span>
                                                  <span className="font-mono font-bold text-purple-500">R${produto.valor.toFixed(2)}</span>
                                                </CardContent>
                                              </Card>
                                              <Button 
                                                onClick={() => removerProduto(produto.id)}
                                                variant="destructive" size="icon" 
                                                className="absolute -top-2 -right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                              >
                                                <X className="h-4 w-4" />
                                              </Button>
                                          </motion.div>
                                       ))}
                                    </AnimatePresence>
                                  </motion.div>
                               </AccordionContent>
                             </Card>
                        </AccordionItem>
                    </motion.div>
                  ))}
                  </AnimatePresence>
                 </Accordion>
              </motion.div>
            ) : (
               <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-20 rounded-2xl bg-white dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800"
               >
                  <ShoppingCart className="h-16 w-16 text-slate-400 dark:text-slate-600 mb-4"/>
                  <h2 className="text-xl font-bold">Sua lista está vazia</h2>
                  <p className="text-slate-500 dark:text-slate-400">Comece adicionando seu primeiro produto no painel ao lado.</p>
               </motion.div>
            )}
            </AnimatePresence>
        </div>

        {/* Coluna Direita: Ações e Resumo */}
        <div className="lg:col-span-4 xl:col-span-4 lg:sticky top-8 self-start space-y-8">
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 text-white shadow-2xl shadow-slate-900/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Resumo Financeiro</CardTitle>
                <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }} transition={{ duration: 0.5 }}>
                  {icon}
                </motion.div>
              </CardHeader>
              <CardContent className="space-y-6">
                  <div className="flex justify-between items-baseline">
                    <span className="text-slate-400">Total Gasto</span>
                    <span className="text-4xl font-bold tracking-tighter">R$ {totalGasto.toFixed(2)}</span>
                  </div>
                   <div className="flex justify-between items-baseline">
                    <span className="text-slate-400">Orçamento</span>
                     <Input 
                        type="number" 
                        value={orcamento}
                        onChange={(e) => setOrcamento(parseFloat(e.target.value) || 0)}
                        className="w-28 bg-transparent border-slate-700 text-right text-lg font-bold"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Progress value={percentualGasto} className={`h-3 ${bgColor}`} indicatorClassName={color} />
                     <div className="flex justify-between text-sm font-medium">
                        <span className="text-slate-400">Gasto: {percentualGasto.toFixed(1)}%</span>
                        <span className={color}>Restante: R$ {(orcamento - totalGasto).toFixed(2)}</span>
                     </div>
                  </div>
              </CardContent>
            </Card>

             <Card className="bg-white dark:bg-slate-900/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Plus/> Adicionar Novo Item</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label htmlFor="productName" className="text-sm font-medium text-slate-700 dark:text-slate-300">Nome do Produto</label>
                    <Input 
                      id="productName"
                      placeholder="Ex: Leite Integral" 
                      className="mt-1 bg-slate-50 dark:bg-slate-800/80"
                      value={nomeProduto}
                      onChange={(e) => setNomeProduto(e.target.value)}
                    />
                  </div>
                   <div>
                    <label htmlFor="productValue" className="text-sm font-medium text-slate-700 dark:text-slate-300">Valor (R$)</label>
                    <Input 
                      id="productValue"
                      type="number" 
                      placeholder="Ex: 5.99" 
                      className="mt-1 bg-slate-50 dark:bg-slate-800/80"
                      value={valorProduto}
                      onChange={(e) => setValorProduto(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && adicionarProduto()}
                    />
                  </div>
                  <Button onClick={adicionarProduto} size="lg" className="w-full bg-purple-600 hover:bg-purple-700 dark:text-white">Adicionar à Lista</Button>
                </CardContent>
             </Card>
             <div className="text-center text-xs text-slate-400 dark:text-slate-600 flex items-center justify-center gap-2">
                <Bot className="h-4 w-4"/>
                <span>Design recriado com IA para máxima produtividade.</span>
            </div>
        </div>
      </main>
    </div>
  )
}
