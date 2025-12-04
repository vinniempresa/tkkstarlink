# 🔍 Diagnóstico do Erro H10 no Heroku

O erro **H10 "App crashed"** significa que a aplicação travou ao iniciar. Precisamos ver o erro real.

## 📊 Passo 1: Ver logs completos

Execute este comando e **me envie a saída completa**:

```bash
heroku logs --tail
```

Deixe rodando, depois tente acessar o site. Você verá o erro exato aparecer.

## 🔐 Passo 2: Verificar variáveis de ambiente

Confirme que as variáveis estão configuradas:

```bash
heroku config
```

Deve aparecer:
- `FOUR_M_API_KEY`
- `SESSION_SECRET`

Se não aparecer, configure:

```bash
heroku config:set FOUR_M_API_KEY=3mpag_p7czqd3yk_mfr1pvd2
heroku config:set SESSION_SECRET=$(openssl rand -base64 32)
```

## 📦 Passo 3: Verificar build

Ver os logs de build:

```bash
heroku logs --source app -n 200
```

Procure por mensagens de erro durante o build.

## 🔄 Passo 4: Forçar novo build

Se necessário, force um novo deploy:

```bash
git commit --allow-empty -m "Forçar rebuild"
git push heroku main
```

## 🐛 Erros comuns e soluções

### Erro: "Cannot find module"
**Solução:** Problema com o build. Verifique se `build.js` existe e está correto.

### Erro: "FOUR_M_API_KEY não configurada"
**Solução:** Configure a variável:
```bash
heroku config:set FOUR_M_API_KEY=3mpag_p7czqd3yk_mfr1pvd2
```

### Erro: "EADDRINUSE" ou "port already in use"
**Solução:** Isso NÃO deve acontecer no Heroku. Se aparecer, há problema no código.

### Erro relacionado a "dist/public"
**Solução:** O build não criou a pasta correta. Problema com o build.

## 🚨 O que eu preciso ver:

**Me envie a saída COMPLETA deste comando:**

```bash
heroku logs --tail
```

Ou pelo menos:

```bash
heroku logs -n 200
```

Com isso consigo identificar o erro exato! 🔍
