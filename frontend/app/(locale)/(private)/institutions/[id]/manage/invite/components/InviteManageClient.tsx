// app/(locale)/(private)/institutions/[id]/manage/invite/InviteManageClient.tsx
"use client"

import { useMemo, useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { Separator } from "@/components/ui/separator"
import { Users2, Clock, CheckCircle2, ListChecks, Search } from "lucide-react"
import { Invitation } from "./types"
import { MOCK_INVITATIONS } from "./mocks"
import InviteForm from "./InviteForm"
import InvitesTable from "./InvitesTable"
import InviteDetailsSheet from "./InviteDetailsSheet"
import Back from "../../_components/Back"


export default function InviteManageClient({
  institutionId,
}: {
  institutionId: string
}) {
 
   // MOCK de dados usando o schema fornecido
   const [invites, setInvites] = useState<Invitation[]>(MOCK_INVITATIONS)
   const [query, setQuery] = useState("")
   const [active, setActive] = useState<
     "pending" | "accepted" | "expired" | "all"
   >("pending")
   const [details, setDetails] = useState<Invitation | null>(null)
 
   // Filtros simples
   const filtered = useMemo(() => {
     const now = new Date()
     const base = invites.filter((i) =>
       [i.email, i.invited_by_user?.full_name, i.role]
         .join(" ")
         .toLowerCase()
         .includes(query.toLowerCase())
     )
     switch (active) {
       case "pending":
         return base.filter(
           (i) => !i.accepted_at && new Date(i.expires_at) > now
         )
       case "accepted":
         return base.filter((i) => !!i.accepted_at)
       case "expired":
         return base.filter(
           (i) => new Date(i.expires_at) <= now && !i.accepted_at
         )
       case "all":
       default:
         return base
     }
   }, [invites, query, active])
 
   // KPIs
   const kpis = useMemo(() => {
     const now = new Date()
     const pend = invites.filter(
       (i) => !i.accepted_at && new Date(i.expires_at) > now
     ).length
     const expSoon = invites.filter((i) => {
       if (i.accepted_at) return false
       const diff = +new Date(i.expires_at) - +now
       const days = diff / (1000 * 60 * 60 * 24)
       return days >= 0 && days <= 3
     }).length
     const accepted7d = invites.filter((i) => {
       if (!i.accepted_at) return false
       const diff = +now - +new Date(i.accepted_at)
       const days = diff / (1000 * 60 * 60 * 24)
       return days <= 7
     }).length
     return { pend, expSoon, accepted7d, total: invites.length }
   }, [invites])
 
   // Handlers mockados (troque por mutations depois)
   const handleRevoke = (id: string) =>
     setInvites((prev) => prev.filter((i) => i.invitation_id !== id))
   const handleResend = (_id: string) => {
     // noop: simular toast depois
   }
   const handleCopy = (_id: string) => {
     // noop: navigator.clipboard.writeText(link)
   }
   const handleOpen = (row: Invitation) => setDetails(row)
   const handleClose = () => setDetails(null)
 
   return (
     <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 space-y-6">
       <div className="space-x-4">
         <Back
           hrefFallback={`/institutions/${institutionId}/manage`}/>
       </div>
       {/* KPIs */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <Card className="rounded-2xl">
           <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium flex items-center gap-2">
               <Users2 className="h-4 w-4" />
               Pendentes
             </CardTitle>
           </CardHeader>
           <CardContent>
             <p className="text-2xl font-semibold">{kpis.pend}</p>
           </CardContent>
         </Card>
         <Card className="rounded-2xl">
           <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium flex items-center gap-2">
               <Clock className="h-4 w-4" />
               Expiram ≤ 3 dias
             </CardTitle>
           </CardHeader>
           <CardContent>
             <p className="text-2xl font-semibold">{kpis.expSoon}</p>
           </CardContent>
         </Card>
         <Card className="rounded-2xl">
           <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium flex items-center gap-2">
               <CheckCircle2 className="h-4 w-4" />
               Aceitos (7d)
             </CardTitle>
           </CardHeader>
           <CardContent>
             <p className="text-2xl font-semibold">{kpis.accepted7d}</p>
           </CardContent>
         </Card>
         <Card className="rounded-2xl">
           <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium flex items-center gap-2">
               <ListChecks className="h-4 w-4" />
               Total
             </CardTitle>
           </CardHeader>
           <CardContent>
             <p className="text-2xl font-semibold">{kpis.total}</p>
           </CardContent>
         </Card>
       </div>

       {/* Grid principal: Form à esquerda | Lista à direita */}
       <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
         <InviteForm
           institutionId={institutionId}
           onCreated={(newOnes) => setInvites((prev) => [...newOnes, ...prev])}
         />

         <Card className="rounded-2xl">
           <CardHeader className="pb-3">
             <div className="flex flex-wrap items-center justify-between gap-3">
               <div>
                 <CardTitle className="text-base">Convites</CardTitle>
                 <p className="text-sm text-muted-foreground">
                   Gerencie convites enviados para sua instituição
                 </p>
               </div>
               <div className="relative">
                 <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                 <Input
                   value={query}
                   onChange={(e) => setQuery(e.target.value)}
                   placeholder="Buscar por e-mail, papel ou quem convidou…"
                   className="pl-8 w-[240px]"
                 />
               </div>
             </div>
             <Separator className="mt-3" />
           </CardHeader>

           <CardContent>
             <Tabs
               value={active}
               onValueChange={(v) => setActive(v as any)}
               className="w-full"
             >
               <TabsList className="mb-3">
                 <TabsTrigger value="pending">Pendentes</TabsTrigger>
                 <TabsTrigger value="accepted">Aceitos</TabsTrigger>
                 <TabsTrigger value="expired">Expirados</TabsTrigger>
                 <TabsTrigger value="all">Todos</TabsTrigger>
               </TabsList>

               <TabsContent value="pending" className="mt-0">
                 <InvitesTable
                   data={filtered}
                   onOpen={handleOpen}
                   onRevoke={handleRevoke}
                   onResend={handleResend}
                   onCopy={handleCopy}
                 />
               </TabsContent>
               <TabsContent value="accepted" className="mt-0">
                 <InvitesTable
                   data={filtered}
                   onOpen={handleOpen}
                   onRevoke={handleRevoke}
                   onResend={handleResend}
                   onCopy={handleCopy}
                 />
               </TabsContent>
               <TabsContent value="expired" className="mt-0">
                 <InvitesTable
                   data={filtered}
                   onOpen={handleOpen}
                   onRevoke={handleRevoke}
                   onResend={handleResend}
                   onCopy={handleCopy}
                 />
               </TabsContent>
               <TabsContent value="all" className="mt-0">
                 <InvitesTable
                   data={filtered}
                   onOpen={handleOpen}
                   onRevoke={handleRevoke}
                   onResend={handleResend}
                   onCopy={handleCopy}
                 />
               </TabsContent>
             </Tabs>
           </CardContent>
         </Card>
       </div>

       <InviteDetailsSheet
         open={!!details}
         invitation={details}
         onOpenChange={(o) => !o && handleClose()}
       />
     </div>
   )
}
