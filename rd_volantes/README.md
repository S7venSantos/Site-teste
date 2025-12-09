# RD Volantes

Este projeto é um catálogo online de volantes automotivos, permitindo que os usuários visualizem diferentes modelos e adicionem itens ao carrinho de compras. O projeto inclui funcionalidades para gerar um PDF com os itens selecionados.

## Estrutura do Projeto

- **psdpass.html**: Estrutura HTML da página principal do catálogo de volantes, exibindo os itens e botões para adicionar ao carrinho.
- **carrinho.html**: Página do carrinho de compras, onde os itens selecionados são exibidos.
- **styles.css**: Estilos CSS para a formatação visual das páginas HTML.
- **script.js**: Lógica JavaScript para interatividade nas páginas, como adicionar itens ao carrinho.
- **src/pdf/pdfGenerator.js**: Responsável por gerar o PDF com os itens selecionados, utilizando a biblioteca jsPDF.
- **src/pdf/libs/jspdf.umd.min.js**: Biblioteca jsPDF, que fornece funcionalidades para a criação de documentos PDF em JavaScript.
- **package.json**: Arquivo de configuração do npm, listando as dependências do projeto e scripts para facilitar o desenvolvimento.

## Instruções de Uso

1. **Instalação**: Clone o repositório e instale as dependências usando `npm install`.
2. **Execução**: Abra o arquivo `psdpass.html` em um navegador para visualizar o catálogo.
3. **Adicionar ao Carrinho**: Selecione os itens desejados e clique no botão "Adicionar" para incluí-los no carrinho.
4. **Gerar PDF**: Utilize a funcionalidade implementada em `src/pdf/pdfGenerator.js` para criar um PDF com os itens selecionados.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests para melhorias e correções.