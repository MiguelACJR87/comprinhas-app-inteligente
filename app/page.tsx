"use client";

// Importações de React e bibliotecas
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Inter } from 'next/font/google';
import { cn } from "@/lib/utils"; // Assumindo que seu utils.ts está em lib/

// Importações de Componentes (shadcn/ui, etc.)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Toaster, toast } from "sonner";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

// Importações de Ícones (lucide-react)
import {
  ShoppingCart, Plus, Trash2, Share2, Settings, Mic, Sun, Moon,
  ChevronDown, ChevronUp, History, Users, BarChart3, Package,
  DollarSign, Target, Copy, Check, X, RefreshCw, Store, Percent,
  ArrowUpDown, Zap, Search, LayoutDashboard, Menu, Wallet
} from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

// Interfaces (mantidas no mesmo arquivo conforme solicitado)
interface Produto {
  id: number;
  nome: string;
  quantidade: number;
  valor: number;
  total: number;
  categoria: string;
  adicionadoEm: Date;
}

interface ListaCompras {
  id: string;
  nome: string;
  produtos: Produto[];
  criadaEm: Date;
  totalGasto: number;
  orcamento: number;
}

// Constantes (mantidas no mesmo arquivo)
const CATEGORIAS = {
  "Hortifrúti": "🍎",
  "Laticínios": "🥛",
  "Proteínas": "🥩",
  "Cereais & Grãos": "🌾",
  "Padaria": "🍞",
  "Bebidas": "☕",
  "Limpeza": "🧽",
  "Outros": "🛒"
};

// Componente Principal
export default function ComprinhasAppUIUX() {
  // =================================================================================
  // ESTADO E LÓGICA
  // =================================================================================
  const [listaAtual, setListaAtual] = useState<ListaCompras>({
    id: Date.now().toString(),
    nome: "Minhas Compras",
    produtos: [],
    criadaEm: new Date(),
    totalGasto: 0,
    orcamento: 750,
  });

  const [nomeProduto, setNomeProduto] = useState("");
  const [valor, setValor] = useState("");
  const [showSplash, setShowSplash] = useState(true);
  const [tema, setTema] = useState<"light" | "dark">("dark");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Efeito da tela de Splash
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Efeito para tema
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(tema);
  }, [tema]);

  // Funções Core
  const adicionarProduto = useCallback(() => {
    if (!nomeProduto.trim() || !valor || Number.parseFloat(valor) <= 0) {
      toast.error("Ops! Preencha o nome e o valor do produto.");
      return;
    }

    // IA Simples para detectar categoria
    let categoriaDetectada: keyof typeof CATEGORIAS = "Outros";
    const nomeLower = nomeProduto.toLowerCase();
    if (nomeLower.includes("leite") || nomeLower.includes("queijo")) categoriaDetectada = "Laticínios";
    if (nomeLower.includes("maçã") || nomeLower.includes("banana")) categoriaDetectada = "Hortifrúti";
    if (nomeLower.includes("pão")) categoriaDetectada = "Padaria";
    if (nomeLower.includes("arroz") || nomeLower.includes("feijão")) categoriaDetectada = "Cereais & Grãos";
    if (nomeLower.includes("frango") || nomeLower.includes("carne")) categoriaDetectada = "Proteínas";

    const novoProduto: Produto = {
      id: Date.now(),
      nome: nomeProduto.trim(),
      quantidade: 1, // Simplificado para o quick add
      valor: Number.parseFloat(valor),
      total: Number.parseFloat(valor),
      categoria: categoriaDetectada,
      adicionadoEm: new Date(),
    };

    setListaAtual(prev => ({
      ...prev,
      produtos: [novoProduto, ...prev.produtos],
      totalGasto: prev.totalGasto + novoProduto.total,
    }));

    toast.success(`${novoProduto.nome} foi adicionado à lista!`);
    setNomeProduto("");
    setValor("");
  }, [nomeProduto, valor]);

  const removerProduto = useCallback((id: number) => {
    let produtoRemovido;
    setListaAtual(prev => {
      produtoRemovido = prev.produtos.find(p => p.id === id);
      if (!produtoRemovido) return prev;
      return {
        ...prev,
        produtos: prev.produtos.filter(p => p.id !== id),
        totalGasto: prev.totalGasto - produtoRemovido.total,
      };
    });
    if (produtoRemovido) {
      toast.info(`${produtoRemovido.nome} removido da lista.`);
    }
  }, []);

  // Agrupamento de produtos por categoria para renderização
  const produtosAgrupados = useMemo(() => {
    return listaAtual.produtos.reduce((acc, produto) => {
      const categoria = produto.categoria;
      if (!acc[categoria]) {
        acc[categoria] = [];
      }
      acc[categoria].push(produto);
      return acc;
    }, {} as Record<string, Produto[]>);
  }, [listaAtual.produtos]);

  const [categoriasExpandidas, setCategoriasExpandidas] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const novasCategorias: Record<string, boolean> = {};
    Object.keys(produtosAgrupados).forEach(cat => {
      novasCategorias[cat] = categoriasExpandidas[cat] ?? true;
    });
    setCategoriasExpandidas(novasCategorias);
  }, [produtosAgrupados]);


  // =================================================================================
  // RENDERIZAÇÃO
  // =================================================================================

  if (showSplash) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-900 gap-4">
        <div className="text-7xl">
          <div className="animate-bounce">🛒</div>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tighter">Comprinhas</h1>
        <p className="text-slate-400">Sua lista de compras inteligente.</p>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" richColors theme={tema} />
      <div className={cn(
        "min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300",
        inter.className
      )}>
        <div className="flex">
          {/* --- SIDEBAR --- */}
          <aside className={cn(
            "fixed lg:relative lg:translate-x-0 h-screen bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out z-20",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}>
            <nav className="p-4 flex flex-col h-full">
              <div className="flex items-center gap-2 mb-8">
                <LayoutDashboard className="text-purple-500" />
                <h1 className="text-xl font-bold text-slate-800 dark:text-white">Comprinhas</h1>
              </div>
              <ul className="space-y-2">
                <li><Button variant="ghost" className="w-full justify-start gap-2"><LayoutDashboard /> Painel</Button></li>
                <li><Button variant="ghost" className="w-full justify-start gap-2"><History /> Histórico</Button></li>
                <li><Button variant="ghost" className="w-full justify-start gap-2"><Users /> Colaboradores</Button></li>
                <li><Button variant="ghost" className="w-full justify-start gap-2"><BarChart3 /> Análises</Button></li>
              </ul>
              <div className="mt-auto">
                 <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => setTema(tema === 'dark' ? 'light' : 'dark')}>
                  {tema === 'dark' ? <Sun /> : <Moon />}
                  Alternar Tema
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-2"><Settings /> Configurações</Button>
              </div>
            </nav>
          </aside>
          
          <div className="flex-1">
            {/* --- HEADER --- */}
            <header className="sticky top-0 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 p-4 z-10">
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
                  <Menu />
                </Button>
                 <div className="flex-1 text-center lg:text-left">
                  <h2 className="text-xl font-semibold text-slate-800 dark:text-white">{listaAtual.nome}</h2>
                 </div>
                <div className="flex items-center gap-2">
                   <Button size="sm" className="bg-purple-600 hover:bg-purple-700"><Share2 className="h-4 w-4 mr-2" /> Compartilhar</Button>
                </div>
              </div>
            </header>
            
            {/* --- MAIN CONTENT --- */}
            <main className="p-4 sm:p-6 lg:p-8">
              {/* --- Resumo Financeiro --- */}
              <Card className="mb-8 border-none bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-lg">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                     <span className="font-medium">Resumo Financeiro</span>
                     <Wallet/>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    <div className="flex flex-col gap-1">
                       <Label className="text-purple-200">Orçamento</Label>
                       <p className="text-3xl font-bold tracking-tighter">R$ {listaAtual.orcamento.toFixed(2)}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                       <Label className="text-purple-200">Total Gasto</Label>
                       <p className="text-3xl font-bold tracking-tighter">R$ {listaAtual.totalGasto.toFixed(2)}</p>
                    </div>
                     <div className="flex flex-col gap-1">
                       <Label className="text-purple-200">Restante</Label>
                       <p className="text-3xl font-bold tracking-tighter text-green-300">R$ {(listaAtual.orcamento - listaAtual.totalGasto).toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Progress value={(listaAtual.totalGasto / listaAtual.orcamento) * 100} className="bg-white/20 h-2 [&>div]:bg-white" />
                    <div className="flex justify-between text-xs mt-2 text-purple-200">
                      <span>0%</span>
                      <span>{((listaAtual.totalGasto / listaAtual.orcamento) * 100).toFixed(0)}% Gasto</span>
                      <span>100%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* --- Lista de Produtos --- */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Sua Lista</h3>
                  <div className="flex items-center gap-2 p-1 bg-slate-200 dark:bg-slate-800 rounded-lg">
                     <Input placeholder="Buscar na lista..." className="h-8 border-none bg-transparent focus:ring-0" />
                     <Search className="h-4 w-4 text-slate-500"/>
                  </div>
                </div>

                {listaAtual.produtos.length === 0 ? (
                  <div className="text-center py-20 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-800">
                    <ShoppingCart className="mx-auto h-12 w-12 text-slate-400" />
                    <h3 className="mt-4 text-lg font-medium text-slate-800 dark:text-white">Sua lista está vazia</h3>
                    <p className="mt-1 text-sm text-slate-500">Adicione seu primeiro produto abaixo.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(produtosAgrupados).map(([categoria, produtos]) => (
                      <div key={categoria}>
                        <button 
                          className="w-full flex items-center justify-between py-2"
                          onClick={() => setCategoriasExpandidas(prev => ({...prev, [categoria]: !prev[categoria]}))}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{CATEGORIAS[categoria as keyof typeof CATEGORIAS]}</span>
                            <span className="font-bold text-lg text-slate-800 dark:text-white">{categoria}</span>
                            <Badge variant="secondary">{produtos.length}</Badge>
                          </div>
                          <ChevronDown className={cn("transition-transform", {"rotate-180": categoriasExpandidas[categoria]})}/>
                        </button>
                        
                        {categoriasExpandidas[categoria] && (
                          <div className="space-y-2 mt-2">
                          {produtos.map(produto => (
                            <Card key={produto.id} className="bg-white dark:bg-slate-800/50 hover:shadow-md transition-shadow animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                              <CardContent className="p-3 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="font-medium text-slate-800 dark:text-white">{produto.nome}</div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="text-slate-600 dark:text-slate-300 font-semibold">R$ {produto.valor.toFixed(2)}</div>
                                  <Button onClick={() => removerProduto(produto.id)} variant="ghost" size="icon" className="text-slate-500 hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-500">
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>

        {/* --- Quick Add Flutuante --- */}
         <div className="sticky bottom-0 p-4 bg-transparent lg:hidden">
            <Drawer>
                <DrawerTrigger asChild>
                    <Button className="w-full h-14 rounded-full bg-purple-600 hover:bg-purple-700 shadow-2xl shadow-purple-500/50 text-lg">
                        <Plus className="h-6 w-6 mr-2"/> Adicionar Item
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <div className="p-4 space-y-4">
                         <h3 className="font-semibold text-center">Adicionar Novo Item</h3>
                        <Input 
                            placeholder="Nome do produto (ex: Leite Integral)" 
                            value={nomeProduto}
                            onChange={e => setNomeProduto(e.target.value)}
                        />
                        <Input 
                            type="number" 
                            placeholder="Valor (R$)"
                            value={valor}
                            onChange={e => setValor(e.target.value)}
                        />
                        <Button onClick={adicionarProduto} className="w-full">Adicionar à Lista</Button>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>

        {/* Quick Add para Desktop */}
         <div className="hidden lg:block fixed bottom-8 right-8 z-10">
              <Card className="w-96 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg shadow-xl border-slate-200 dark:border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-base">Adicionar Item Rápido</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                      <Input 
                          placeholder="Nome do produto" 
                          value={nomeProduto}
                          onChange={e => setNomeProduto(e.target.value)}
                          onKeyPress={e => e.key === 'Enter' && adicionarProduto()}
                      />
                       <Input 
                          type="number" 
                          placeholder="Valor (R$)"
                          value={valor}
                          onChange={e => setValor(e.target.value)}
                          onKeyPress={e => e.key === 'Enter' && adicionarProduto()}
                      />
                       <Button onClick={adicionarProduto} className="w-full bg-purple-600 hover:bg-purple-700">
                         <Plus className="h-4 w-4 mr-2"/> Adicionar
                       </Button>
                  </CardContent>
              </Card>
        </div>
      </div>
    </>
  );
}
