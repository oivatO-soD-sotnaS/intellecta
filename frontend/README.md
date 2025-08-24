## Tecnologias Utilizadas

- [Next.js 14](https://nextjs.org/docs/getting-started)
- [HeroUI v2](https://heroui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [next-themes](https://github.com/pacocoursey/next-themes)

## Como Usar
### Instale as Dependências

Você pode usar um deles: `npm`, `yarn`, `pnpm`, `bun`. Exemplo utilizando `npm`:

```bash
npm install
```

### Execute o Servidor de Desenvolvimento

```bash
npm run dev
```

### Configurar pnpm (Opcional)

Se você estiver utilizando `pnpm`, é necessário adicionar o seguinte código ao seu arquivo `.npmrc`:

```bash
public-hoist-pattern[]=*@heroui/*
```

Após modificar o arquivo `.npmrc`, você precisará executar `pnpm install` novamente para garantir que as dependências sejam instaladas corretamente.