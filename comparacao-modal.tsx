"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Minus, Eye } from "lucide-react"

interface ComparacaoPreco {
  produto: string
  precoAnterior: number
  precoAtual: number
  diferenca: number
  percentual: number
  tendencia: "subiu" | "desceu" | "igual"
}

interface ComparacaoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  comparacoes: ComparacaoPreco[]
  cidade: string
  estado: string
}

export function ComparacaoModal({ open, onOpenChange, comparacoes, cidade, estado }: ComparacaoModalProps) {
  const economiaTotal = comparacoes.reduce((acc, comp) => acc + (comp.diferenca < 0 ? Math.abs(comp.diferenca) : 0), 0)
  const gastoExtra = comparacoes.reduce((acc, comp) => acc + (comp.diferenca > 0 ? comp.diferenca : 0), 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-800 border-slate-600">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-amber-400" />
            Comparação de Preços - {cidade}, {estado}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-green-600/20 border-green-500/30">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-300">R$ {economiaTotal.toFixed(2)}</div>
                <div className="text-sm text-green-200">Economia Possível</div>
                <TrendingDown className="h-4 w-4 text-green-400 mx-auto mt-1" />
              </CardContent>
            </Card>

            <Card className="bg-red-600/20 border-red-500/30">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-300">R$ {gastoExtra.toFixed(2)}</div>
                <div className="text-sm text-red-200">Gasto Extra</div>
                <TrendingUp className="h-4 w-4 text-red-400 mx-auto mt-1" />
              </CardContent>
            </Card>

            <Card className="bg-blue-600/20 border-blue-500/30">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-300">{comparacoes.length}</div>
                <div className="text-sm text-blue-200">Produtos Comparados</div>
                <Eye className="h-4 w-4 text-blue-400 mx-auto mt-1" />
              </CardContent>
            </Card>
          </div>

          {/* Lista de Comparações */}
          <div className="space-y-3">
            {comparacoes.map((comp, index) => (
              <Card key={index} className="bg-slate-700/50 border-slate-600">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{comp.produto}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="text-slate-400">Seu preço: R$ {comp.precoAnterior.toFixed(2)}</span>
                        <span className="text-slate-400">Mercado: R$ {comp.precoAtual.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div
                          className={`text-lg font-bold ${
                            comp.tendencia === "desceu"
                              ? "text-green-400"
                              : comp.tendencia === "subiu"
                                ? "text-red-400"
                                : "text-slate-400"
                          }`}
                        >
                          {comp.tendencia === "desceu" ? "-" : comp.tendencia === "subiu" ? "+" : ""}
                          R$ {Math.abs(comp.diferenca).toFixed(2)}
                        </div>
                        <div className="text-xs text-slate-400">{comp.percentual.toFixed(1)}%</div>
                      </div>

                      <Badge
                        variant={
                          comp.tendencia === "desceu"
                            ? "default"
                            : comp.tendencia === "subiu"
                              ? "destructive"
                              : "secondary"
                        }
                        className="flex items-center gap-1"
                      >
                        {comp.tendencia === "desceu" && <TrendingDown className="h-3 w-3" />}
                        {comp.tendencia === "subiu" && <TrendingUp className="h-3 w-3" />}
                        {comp.tendencia === "igual" && <Minus className="h-3 w-3" />}
                        {comp.tendencia === "desceu" ? "Economia" : comp.tendencia === "subiu" ? "Mais caro" : "Igual"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button onClick={() => onOpenChange(false)} className="bg-purple-600 hover:bg-purple-700">
              <Eye className="mr-2 h-4 w-4" />
              Entendi!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
