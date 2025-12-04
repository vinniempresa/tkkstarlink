# 🚀 Deploy no Heroku - Guia Completo

## ⚠️ IMPORTANTE: Leia primeiro o CORRIGIR_HEROKU.md

Antes de fazer o deploy, você **PRECISA** modificar o `package.json` conforme instruções em `CORRIGIR_HEROKU.md`.

## Pré-requisitos

1. ✅ Conta no Heroku (https://heroku.com)
2. ✅ Heroku CLI instalado (https://devcenter.heroku.com/articles/heroku-cli)
3. ✅ Git instalado
4. ✅ **Modificações no package.json feitas** (veja CORRIGIR_HEROKU.md)

## 🔧 Passo a passo

### 1. Modificar package.json (OBRIGATÓRIO)

Veja instruções detalhadas em `CORRIGIR_HEROKU.md`

**Resumo:**
- Mudar linha `build` para: `"build": "vite build && node build.js"`
- Adicionar: `"heroku-postbuild": "npm run build"`

### 2. Preparar Git

```bash
git init
git add .
git commit -m "Preparar para deploy no Heroku"
```

### 3. Criar aplicação no Heroku

```bash
# Login no Heroku
heroku login

# Criar aplicação (substitua pelo nome desejado)
heroku create nome-da-sua-app
```

### 4. Configurar variáveis de ambiente

```bash
# API Key da 4mpagamentos (use sua chave real)
heroku config:set FOUR_M_API_KEY=sua_chave_aqui

# Chave secreta para sessões
heroku config:set SESSION_SECRET=$(openssl rand -base64 32)
```

**⚠️ IMPORTANTE:** Nunca compartilhe sua FOUR_M_API_KEY publicamente!

### 5. Deploy

```bash
git push heroku main
```

### 6. Abrir aplicação

```bash
heroku open
```

## 📊 Verificar logs

```bash
heroku logs --tail
```

## 🔧 Comandos úteis

```bash
# Ver status
heroku ps

# Reiniciar
heroku restart

# Ver configurações
heroku config
```

## ✅ Checklist de deploy

- [ ] Modificou o package.json (veja CORRIGIR_HEROKU.md)
- [ ] Fez commit das mudanças
- [ ] Criou app no Heroku
- [ ] Configurou FOUR_M_API_KEY
- [ ] Configurou SESSION_SECRET
- [ ] Fez push para o Heroku
- [ ] Verificou os logs

## 🆘 Problemas?

Consulte `CORRIGIR_HEROKU.md` para troubleshooting detalhado.

---

## 📝 Histórico de Correções

### ✅ Correção do valor de pagamento (11/10/2025)

**Problema:** Página de pagamento exibia R$64,90 ao invés do valor correto (R$99,80).

**Causa:** API da 4mpagamentos espera `amount` como STRING em REAIS, não centavos.

**Solução aplicada:**
- Alterado `CheckoutModal.tsx`: `amount: total.toFixed(2)` (retorna string "99.80")
- Antes era: `Math.round(total * 100).toString()` (retornava "9980" - centavos)
- Email normalizado para remover acentos (ex: "João" → "joao")

**Para aplicar no Heroku:**
```bash
git add .
git commit -m "Fix: Corrigir formato de amount para API (REAIS como string)"
git push heroku main
```
