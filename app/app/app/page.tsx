"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShoppingCart, Plus, Trash2 } from 'lucide-react'

interface Produto {
  id: number
  nome: string
  quantidade: number
  valor: number
  total: number
}

export default function ComprinhasApp() {
  const [listaCompras, setListaCompras] = useState<Produto[]>([])
  const [nomeProduto, setNomeProduto] = useState("")
  const [quantidade, setQuantidade] = useState(1)
  const [valor, setValor] = useState("")

  const totalGasto = listaCompras.reduce((sum, produto) => sum + produto.total, 0)

  const adicionarProduto = () => {
    if (!nomeProduto.trim() || !valor || Number.parseFloat(valor) <= 0) return

    const novoProduto: Produto = {
      id: Date.now(),
      nome: nomeProduto.trim(),
      quantidade,
      valor: Number.parseFloat(valor),
      total: quantidade * Number.parseFloat(valor),
    }

    setListaCompras((prev) => [...prev, novoProduto])
    setNomeProduto("")
    setQuantidade(1)
    setValor("")
  }

  const removerProduto = (id: number) => {
    setListaCompras((prev) => prev.filter((produto) => produto.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="bg-slate-800/50 border-slate-600 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <ShoppingCart className="h-6 w-6 text-purple-400" />
              Comprinhas Inteligentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Nome do Produto</Label>
                <Input
                  value={nomeProduto}
                  onChange={(e) => setNomeProduto(e.target.value)}
                  placeholder="Ex: Arroz 5kg"
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Quantidade</Label>
                <Input
                  type="number"
                  value={quantidade}
                  onChange={(e) => setQuantidade(Number.parseInt(e.target.value) || 1)}
                  min="1"
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Valor (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  placeholder="0,00"
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
            </div>
            <Button onClick={adicionarProduto} className="w-full bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar à Lista
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-600 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Lista de Compras</CardTitle>
          </CardHeader>
          <CardContent>
            {listaCompras.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <ShoppingCart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Sua lista está vazia</p>
              </div>
            ) : (
              <div className="space-y-3">
                {listaCompras.map((produto) => (
                  <div key={produto.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div>
                      <h3 className="font-medium text-white">{produto.nome}</h3>
                      <p className="text-sm text-slate-400">
                        Qtd: {produto.quantidade} | R$ {produto.valor.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-green-400">R$ {produto.total.toFixed(2)}</span>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removerProduto(produto.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="border-t border-slate-600 pt-4 flex justify-between items-center">
                  <span className="text-lg font-semibold text-white">Total Geral:</span>
                  <span className="text-2xl font-bold text-green-400">R$ {totalGasto.toFixed(2)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
