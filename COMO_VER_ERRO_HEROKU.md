# 🔍 Como Ver o Erro Real do Heroku

## Opção 1: Via Heroku CLI (no seu terminal LOCAL)

```bash
# Ver logs completos
heroku logs -n 200

# Ver logs em tempo real
heroku logs --tail
```

## Opção 2: Entrar no container (RECOMENDADO)

**No seu terminal LOCAL:**
```bash
heroku run bash
```

**Depois que aparecer `~ $` (você está DENTRO do Heroku), execute:**
```bash
ls -la dist/
node dist/index.js
```

Isso vai mostrar o erro real!

## Opção 3: Executar direto

**No seu terminal LOCAL:**
```bash
heroku run "node dist/index.js"
```

## ⚠️ IMPORTANTE

- Comandos `heroku` só funcionam no seu **terminal LOCAL**
- Dentro do bash do Heroku (quando vê `~ $`), execute **SEM** `heroku run`
- Se ver `~ $` você está DENTRO do Heroku

## Exemplo

**❌ ERRADO (dentro do Heroku):**
```bash
~ $ heroku run "node dist/index.js"  # NÃO FUNCIONA
```

**✅ CORRETO (dentro do Heroku):**
```bash
~ $ node dist/index.js  # FUNCIONA
```

**✅ CORRETO (terminal local):**
```bash
$ heroku run "node dist/index.js"  # FUNCIONA
```
