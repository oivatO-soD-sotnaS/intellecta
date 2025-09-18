import InstitutionClient from "./InstitutionClient"
import CoursesList from "./components/CoursesList" // se existir; caso não, remova

export default function InstitutionPage() {
  return (
    <InstitutionClient>
      {/* Conteúdo inicial (pode ser Overview) até ligarmos o Dashboard definitivo */}
      <section className="space-y-6">
        <header>
          <h1 className="text-xl font-semibold">Início</h1>
          <p className="text-sm text-muted-foreground">
            Bem-vindo à sua instituição.
          </p>
        </header>
        e{/* Exemplo de uso do CourseCard grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Substitua por CoursesList quando estiver pronto */}
        </div>
      </section>
    </InstitutionClient>
  )
}
