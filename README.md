# FinPlan IA — Planejador Financeiro Inteligente & Otimizador de Dívidas (2026-2027)

> Aplicativo completo de planejamento financeiro pessoal, auditoria bancária e comitê de Agentes de IA para otimização de fluxo de caixa, quitação acelerada de dívidas e formação de Reserva de Emergência.

---

## 🎯 Principais Funcionalidades

- 📊 **Orçamento Multianual Dinâmico (2026 e 2027):** Visão completa de 16 meses (Setembro/26 a Dezembro/27) com recálculos automáticos de receitas, despesas e resultado líquido.
- ✍️ **Edição Completa Inline:** Edição direta de nomes de despesas/receitas, valores célula por célula, categorias e bancos vinculados com persistência em `localStorage`.
- ➕ **Gestão de Itens:** Adicionar e excluir despesas e receitas facilmente com botões diretos e atalhos rápidos (ex: *Modelo Rápido de Reserva de Emergência*).
- 🚗 **Agrupamento Estruturado de Veículos:** Organização automática com o bloco de **IPVAs** (MOBI, C3, SHINERAY) seguido imediatamente pelo bloco de **Licenciamentos**.
- 🛡️ **Categoria Especial de Reserva de Emergência:** Destaque visual luminoso com projeção de acúmulo a 100% do CDI com liquidez diária.
- 🤖 **Comitê de 4 Agentes de IA Especialistas:**
  - **Dr. Marcelo Carvalho** (Estrategista Chefe de Dívidas / Método Avalanche)
  - **Beatriz Mendes** (Analista de Taxas Bancárias & Bacen)
  - **Carlos Peixoto** (Otimizador de Fluxo de Caixa)
  - **Sofia Ribeiro** (Assistente de Negociação & Amortização com Desconto Art. 52 CDC)
  - *Suporte nativo a análise contextual das perguntas + Conexão opcional com Google Gemini API.*
- ⚖️ **Simulador de Quitação de Dívidas:** Comparação prática entre **Método Avalanche** (maior juro primeiro), **Método Bola de Neve** (menor saldo devedor total primeiro) e o **Plano FinPlan IA**.
- 🏦 **Pesquisa e Comparador de Taxas Bacen:** Auditoria de taxas de rotativo, parcelamento e empréstimos para **Bradesco, Nubank, C6 Bank e Mercado Pago**, incluindo simulações práticas de custo real e teto da Lei 14.690/23.
- 📜 **Roteiros de Negociação:** Scripts jurídicos prontos para copiar e colar no chat ou app dos bancos, fundamentados no Art. 52 do Código de Defesa do Consumidor.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/) + Design Moderno Dark Mode
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Matemática Financeira:** Funções amortização SAC/Price, VPL, juros compostos e teto de juros da Lei 14.690/23.
- **Armazenamento:** LocalStorage reativo.

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- Node.js (v18+) instalado
- npm ou yarn

### Instalação e Execução

```bash
# 1. Clonar o repositório
git clone <URL_DO_SEU_REPOSITORIO_GITHUB>

# 2. Acessar a pasta do projeto
cd planejador-financeiro-ia

# 3. Instalar as dependências
npm install

# 4. Iniciar o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:5173/](http://localhost:5173/) no seu navegador.

---

## 📦 Build para Produção

```bash
npm run build
```

Gera os arquivos otimizados prontos para deploy na pasta `dist/`.

---

## 📄 Licença

Distribuído sob a licença MIT.
