# 📋 GUIA: Configurar Google Sheets como Banco de Dados

Este guia explica como configurar o Google Sheets para gerenciar os produtos do catálogo.

---

## 🚀 PASSO 1: Criar a Planilha

1. Acesse [sheets.google.com](https://sheets.google.com)
2. Clique em **"+ Em branco"** para criar nova planilha
3. Renomeie para **"Catálogo RD Volantes"**

---

## 📑 PASSO 2: Criar as Abas

Crie 4 abas na planilha (clique no "+" no canto inferior):
- `passeio` (volantes de passeio)
- `pesado` (volantes pesados)
- `cubos` (cubos adaptadores)
- `coloridos` (volantes coloridos)

---

## 📝 PASSO 3: Configurar os Cabeçalhos

Em **CADA ABA**, na **linha 1**, coloque estes cabeçalhos:

### Para abas SEM cores (passeio, pesado, cubos):
| A | B | C | D |
|---|---|---|---|
| codigo | descricao | preco | imagem |

### Para aba COM cores (coloridos):
| A | B | C | D | E |
|---|---|---|---|---|
| codigo | descricao | preco | imagem | cores |

**IMPORTANTE:** Os nomes devem ser exatamente esses (minúsculos, sem acento)!

---

## 📥 PASSO 4: Importar os Dados Existentes

Criei arquivos CSV na pasta `dados_para_planilha/` para você importar:

### Para cada aba:
1. Abra a aba correspondente (ex: `passeio`)
2. Vá em **Arquivo → Importar**
3. Clique em **Upload** → selecione o arquivo CSV correspondente:
   - `passeio.csv` → aba `passeio`
   - `pesado.csv` → aba `pesado`
   - `cubos.csv` → aba `cubos`
   - `coloridos.csv` → aba `coloridos` (este tem a coluna de cores!)
4. Em "Local de importação" escolha: **Substituir dados na planilha atual**
5. Clique em **Importar dados**

---

## 🌐 PASSO 5: Publicar a Planilha

### 5.1 Publicar na Web
1. Clique em **Arquivo → Compartilhar → Publicar na web**
2. Em "Documento inteiro" mantenha selecionado
3. Clique em **Publicar**
4. Confirme clicando em **OK**

### 5.2 Compartilhar com Qualquer Pessoa
1. Clique no botão verde **Compartilhar** (canto superior direito)
2. Clique em **"Alterar para qualquer pessoa com o link"**
3. Certifique-se que está como **"Leitor"**
4. Clique em **Concluído**

---

## 🔑 PASSO 6: Copiar o ID da Planilha

O ID está na URL da planilha:

```
https://docs.google.com/spreadsheets/d/1ABC123xyz789_exemplo/edit
                                        └─────────────────────┘
                                              ESTE É O ID
```

Copie apenas o ID (o texto entre `/d/` e `/edit`).

---

## ⚙️ PASSO 7: Configurar no Site

1. Abra o arquivo `script.js`
2. Procure por esta linha no início:
   ```javascript
   const GOOGLE_SHEETS_ID = 'COLE_SEU_ID_AQUI';
   ```
3. Substitua `COLE_SEU_ID_AQUI` pelo ID que você copiou:
   ```javascript
   const GOOGLE_SHEETS_ID = '1ABC123xyz789_exemplo';
   ```
4. Salve o arquivo

---

## ✅ PASSO 8: Testar

1. Abra o site no navegador
2. Vá para uma página de catálogo
3. Verifique se os produtos aparecem
4. Abra o Console (F12 → Console) e veja se aparece:
   ```
   ✅ X produtos carregados do Google Sheets (passeio)
   ```

---

## 📝 Como Adicionar/Editar/Remover Produtos

Agora é só editar a planilha do Google Sheets!

### Adicionar produto:
1. Vá para a aba correspondente
2. Adicione uma nova linha com: codigo, descricao, preco, imagem
3. As alterações aparecem no site automaticamente!

### Editar produto:
1. Encontre o produto na planilha
2. Altere o que precisar
3. Salve (automático)

### Remover produto:
1. Encontre a linha do produto
2. Clique com botão direito → Excluir linha

---

## 🎨 Produtos com Variações de Cores (aba coloridos)

A aba `coloridos` tem uma coluna extra chamada `cores` onde você define as variações.

### Formato SIMPLES da coluna cores:
```
NomeCor:CodigoProduto:CodigoHex
```

Separe cada cor por vírgula. Exemplo com 3 cores:
```
Preto:VE001PT:#000000, Cinza:VE001CZ:#808080, Vermelho:VE001VM:#d84040
```

### Como adicionar um produto com cores:
1. Preencha as colunas A, B, C, D normalmente
2. Na coluna E (cores), escreva as cores no formato acima
3. Pode adicionar **quantas cores quiser**, só separar por vírgula!

### Exemplo com 5 cores:
```
Preto:VE001PT:#000000, Cinza:VE001CZ:#808080, Vermelho:VE001VM:#d84040, Azul:VE001AZ:#0066cc, Verde:VE001VD:#008000
```

### Exemplo com 10 cores:
```
Preto:VE001PT:#000000, Branco:VE001BR:#ffffff, Cinza:VE001CZ:#808080, Vermelho:VE001VM:#d84040, Azul:VE001AZ:#0066cc, Verde:VE001VD:#008000, Amarelo:VE001AM:#ffd700, Laranja:VE001LR:#ff8c00, Rosa:VE001RS:#ff69b4, Roxo:VE001RX:#800080
```

### Códigos de cores comuns:
| Cor | Código Hex |
|-----|------------|
| Preto | #000000 |
| Branco | #ffffff |
| Cinza | #808080 |
| Vermelho | #d84040 |
| Azul | #0066cc |
| Verde | #008000 |
| Amarelo | #ffd700 |
| Laranja | #ff8c00 |
| Rosa | #ff69b4 |
| Roxo | #800080 |
| Marrom | #8b4513 |

💡 **Dica:** Para encontrar outras cores, use: [htmlcolorcodes.com](https://htmlcolorcodes.com/pt/)

---

## 📸 Sobre as Imagens

As imagens precisam estar no servidor/pasta do site. O campo `imagem` na planilha 
deve ser o caminho relativo, por exemplo:
- `volantes/passeio/uno vivace VI0270TB.png`
- `volantes/pesada/1620 grande VI0655TB.png`

Se quiser usar imagens de outro lugar (ex: Google Drive), será preciso configurar
o compartilhamento correto.

---

## ❓ Problemas Comuns

### "Produtos não aparecem"
- Verifique se a planilha está publicada
- Verifique se o ID está correto no script.js
- Abra o Console (F12) e veja se há erros

### "Erro ao carregar planilha"
- A planilha precisa estar pública (qualquer pessoa com link)
- Os nomes das abas devem ser exatamente: passeio, pesado, cubos, coloridos

### "Imagem não aparece"
- Verifique se o caminho da imagem está correto
- A imagem precisa existir na pasta do site

---

## 🔄 Voltando para JSON (Backup)

Se precisar voltar a usar os arquivos JSON locais:

1. Abra `script.js`
2. Mude a linha:
   ```javascript
   const USAR_GOOGLE_SHEETS = true;
   ```
   Para:
   ```javascript
   const USAR_GOOGLE_SHEETS = false;
   ```

---

Pronto! Agora o cliente pode gerenciar os produtos diretamente pela planilha! 🎉
