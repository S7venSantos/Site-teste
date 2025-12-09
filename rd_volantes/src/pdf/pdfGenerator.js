// src/pdf/pdfGenerator.js

// Função para gerar PDF com os itens selecionados
function generatePDF(selectedItems) {
    const { jsPDF } = window.jspdf; // Acessa a biblioteca jsPDF
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Itens Selecionados", 10, 10);

    let y = 20; // Posição vertical inicial
    selectedItems.forEach(item => {
        doc.setFontSize(12);
        doc.text(`Descrição: ${item.descricao}`, 10, y);
        doc.text(`Código: ${item.codigo}`, 10, y + 10);
        doc.text(`Preço: R$ ${item.preco}`, 10, y + 20);
        y += 30; // Espaço entre os itens
    });

    doc.save("itens_selecionados.pdf"); // Salva o PDF com o nome especificado
}

// Exporta a função para uso em outros arquivos
export { generatePDF };