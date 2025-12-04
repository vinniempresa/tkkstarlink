# 🆘 Erro Heroku - Diagnóstico Final

## O problema

O app está travando com `Process exited with status 1`, mas os logs não mostram o erro real.

## 🔍 Método 1: Ver erro real (RECOMENDADO)

Entre no container do Heroku:

```bash
heroku run bash
```

Dentro do bash, execute linha por linha:

```bash
# 1. Ver arquivos
ls -la

# 2. Verificar se dist existe
ls -la dist/

# 3. Tentar rodar o app manualmente (vai mostrar o erro!)
node dist/index.js
```

**Me envie a saída do passo 3!** 

## 🔍 Método 2: Ver logs de build

```bash
heroku logs --source heroku --tail
```

Procure por mensagens de erro durante o build.

## 🔍 Método 3: Informações do release

```bash
heroku releases
heroku releases:info
```

## 🎯 Possíveis problemas e soluções

### Problema 1: "Cannot find module"
**Causa:** dist/index.js não existe  
**Solução:** Build não executou. Confirme que `heroku-postbuild` existe no package.json

### Problema 2: "FOUR_M_API_KEY não configurada"
**Causa:** Variável de ambiente faltando  
**Solução:**
```bash
heroku config:set FOUR_M_API_KEY=3mpag_p7czqd3yk_mfr1pvd2
```

### Problema 3: "Error: ENOENT: no such file or directory"
**Causa:** Build criou arquivos no lugar errado  
**Solução:** Problema com o build.js

## ✅ Checklist

- [ ] Variáveis configuradas: `heroku config`
- [ ] Build executado: `heroku logs --source heroku`
- [ ] Pasta dist existe: `heroku run "ls -la dist/"`
- [ ] App roda: `heroku run "node dist/index.js"`

## 🚨 AÇÃO IMEDIATA

Execute agora:

```bash
heroku run bash
```

Depois:

```bash
node dist/index.js 2>&1
```

**Me mostre o erro que aparecer!** 🔍
