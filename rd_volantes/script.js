// script.js

document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.btn-add-carrinho');
    const cartItems = [];

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemCard = button.closest('.item-card');
            const itemDescription = button.getAttribute('data-descricao');
            const itemCode = button.getAttribute('data-codigo');
            const itemPrice = button.getAttribute('data-preco');
            const itemQuantity = itemCard.querySelector('.item-qtd').value;

            const cartItem = {
                description: itemDescription,
                code: itemCode,
                price: parseFloat(itemPrice),
                quantity: parseInt(itemQuantity)
            };

            cartItems.push(cartItem);
            alert(`${itemDescription} adicionado ao carrinho!`);
        });
    });

    document.getElementById('icone-carrinho').addEventListener('click', function() {
        generatePDF(cartItems);
    });
});

function generatePDF(cartItems) {
    if (cartItems.length === 0) {
        alert('Nenhum item no carrinho para gerar PDF.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('Itens do Carrinho', 10, 10);
    doc.setFontSize(12);

    let y = 20;
    cartItems.forEach(item => {
        doc.text(`${item.description} (Código: ${item.code}) - R$ ${item.price.toFixed(2)} x ${item.quantity}`, 10, y);
        y += 10;
    });

    doc.save('carrinho.pdf');
}