// =============================
// LISTA DE PRODUTOS (APENAS AQUI)
// =============================
const produtos = [
    {
        id: 1,
        nome: "Produto 1",
        preco: 29.90,
        imagem: "img/produto1.jpg",
        descricao: "Descrição curta do Produto 1"
    },
    {
        id: 2,
        nome: "Produto 2",
        preco: 49.90,
        imagem: "img/produto2.jpg",
        descricao: "Descrição curta do Produto 2"
    },
    {
        id: 3,
        nome: "Produto 3",
        preco: 59.90,
        imagem: "img/produto3.jpg",
        descricao: "Descrição curta do Produto 3"
    }
];

// ===========================================================
// CARREGA PRODUTOS NA TELA (SUBSTITUI QUALQUER HTML MANUAL)
// ===========================================================
function carregarProdutos() {
    const catalogo = document.getElementById("catalogo");
    catalogo.innerHTML = "";

    produtos.forEach(prod => {
        const item = document.createElement("div");
        item.classList.add("item-card");

        item.innerHTML = `
            <img src="${prod.imagem}" alt="${prod.nome}">
            <h3>${prod.nome}</h3>
            <p>${prod.descricao}</p>
            <span class="preco">R$ ${prod.preco.toFixed(2)}</span>
            <button onclick="adicionarAoCarrinho(${prod.id})">Adicionar ao Carrinho</button>
        `;

        catalogo.appendChild(item);
    });
}

// ==================================
// ANIMAÇÃO DO HEADER AO ROLAR
// ==================================
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ==================================
// SISTEMA DE CARRINHO UNIFICADO
// ==================================

// Helper seguro para ler/escrever carrinho
function safeGetCarrinho() {
    try {
        const raw = localStorage.getItem("carrinho");
        if (!raw) return [];
        return JSON.parse(raw);
    } catch (err) {
        console.warn("Carrinho corrompido — resetando", err);
        localStorage.removeItem("carrinho");
        return [];
    }
}

function safeSaveCarrinho(carrinho) {
    try {
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
        return true;
    } catch (err) {
        console.error("Falha ao salvar carrinho", err);
        return false;
    }
}

// Animação de item voando para o carrinho
function animarParaCarrinho(img) {
    const carrinhoEl = document.querySelector("#icone-carrinho, .carrinho-flutuante");
    if (!carrinhoEl || !img) return;

    const imgRect = img.getBoundingClientRect();
    const cartRect = carrinhoEl.getBoundingClientRect();

    const clone = img.cloneNode(true);
    clone.classList.add("fly-img");
    clone.style.position = "fixed";
    clone.style.left = imgRect.left + "px";
    clone.style.top = imgRect.top + "px";
    clone.style.width = imgRect.width + "px";
    clone.style.height = imgRect.height + "px";
    clone.style.zIndex = "9999";
    clone.style.pointerEvents = "none";
    clone.style.transition = "transform .75s cubic-bezier(.2,.9,.2,1), opacity .6s ease";

    document.body.appendChild(clone);
    clone.getBoundingClientRect();

    const translateX = (cartRect.left + cartRect.width / 2) - (imgRect.left + imgRect.width / 2);
    const translateY = (cartRect.top + cartRect.height / 2) - (imgRect.top + imgRect.height / 2);

    requestAnimationFrame(() => {
        clone.style.transform = `translate(${translateX}px, ${translateY}px) scale(.22)`;
        clone.style.opacity = "0";
    });

    setTimeout(() => {
        try { clone.remove(); } catch(e) {}
    }, 780);
}

// Delegação de clique para botões .btn-add-carrinho
document.addEventListener("click", (ev) => {
    const btn = ev.target.closest(".btn-add-carrinho, .btn-add");
    if (!btn) return;

    ev.preventDefault();
    ev.stopPropagation();

    const card = btn.closest(".item-card");
    
    // Verificar se o produto tem cores disponíveis
    const coresData = btn.dataset.cores;
    if (coresData) {
        try {
            const cores = JSON.parse(coresData);
            console.log("🎨 Abrindo seletor de cores:", cores);
            mostrarPopupCores(btn, card, cores);
        } catch (e) {
            console.error("Erro ao parsear cores:", e);
            adicionarAoCarrinhoDirecto(card, btn);
        }
        return;
    }

    // Fluxo normal sem cores
    adicionarAoCarrinhoDirecto(card, btn);
});

// Função para adicionar ao carrinho (sem pop-up de cores)
function adicionarAoCarrinhoDirecto(card, btn, codigoOverride = null, corNome = null) {
    let descricao = (btn.dataset.descricao || card?.querySelector(".titulo")?.innerText || "").trim();
    let codigo = codigoOverride || (btn.dataset.codigo || card?.querySelector(".codigo")?.innerText || "").trim();
    const precoRaw = (btn.dataset.preco || card?.querySelector(".preco")?.dataset?.preco || card?.querySelector(".preco")?.innerText || "0")
        .replace(/[^\d.,]/g, "").replace(",", ".").trim();
    const preco = Number(precoRaw) || 0;
    const qtdInput = card?.querySelector(".item-qtd");
    let qtd = qtdInput ? parseInt(qtdInput.value, 10) || 1 : 1;
    if (qtd < 1) qtd = 1;
    if (!codigo) codigo = `item-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;

    // Adicionar nome da cor à descrição se existir
    if (corNome) {
        descricao = `${descricao} - ${corNome}`;
    }

    const carrinho = safeGetCarrinho();
    const existente = carrinho.find(it => it.codigo === codigo);
    
    if (existente) {
        existente.qtd = (Number(existente.qtd) || 0) + qtd;
    } else {
        carrinho.push({ codigo, descricao, preco, qtd });
    }

    if (!safeSaveCarrinho(carrinho)) {
        alert("Erro ao salvar item no carrinho.");
        return;
    }
    
    console.log("✅ Item adicionado:", { codigo, descricao, preco, qtd });

    try {
        const img = card?.querySelector("img") || card?.querySelector(".item-img");
        if (img) animarParaCarrinho(img);
    } catch (e) {}
}

// Função para adicionar cubo ao carrinho (página categoria-cubos)
function adicionarCuboAoCarrinho(codigo, descricao) {
    const carrinho = safeGetCarrinho();
    const existente = carrinho.find(it => it.codigo === codigo);
    
    if (existente) {
        existente.qtd = (Number(existente.qtd) || 0) + 1;
    } else {
        carrinho.push({ 
            codigo: codigo, 
            descricao: descricao, 
            preco: 0, // Preço sob consulta
            qtd: 1 
        });
    }

    if (!safeSaveCarrinho(carrinho)) {
        alert("Erro ao salvar item no carrinho.");
        return;
    }
    
    console.log("✅ Cubo adicionado:", { codigo, descricao });
    
    // Feedback visual
    const icone = document.getElementById('icone-carrinho');
    if (icone) {
        icone.style.transform = 'scale(1.3)';
        icone.style.background = '#28a745';
        setTimeout(() => {
            icone.style.transform = 'scale(1)';
            icone.style.background = '';
        }, 300);
    }
    
    // Toast de confirmação
    mostrarToast(`${codigo} adicionado ao carrinho!`);
}

// Toast de feedback
function mostrarToast(mensagem) {
    const toast = document.createElement('div');
    toast.className = 'toast-carrinho';
    toast.textContent = mensagem;
    toast.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        background: linear-gradient(135deg, #28a745, #1e7e34);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: bold;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// Mostrar pop-up de seleção de cores
function mostrarPopupCores(btn, card, cores) {
    // Remover pop-up existente se houver
    document.querySelectorAll('.color-popup-overlay').forEach(p => p.remove());

    const rect = btn.getBoundingClientRect();
    
    const overlay = document.createElement('div');
    overlay.className = 'color-popup-overlay';
    
    const popup = document.createElement('div');
    popup.className = 'color-popup';
    
    // Posicionar ao lado do botão
    popup.style.top = `${rect.top}px`;
    popup.style.left = `${rect.right + 10}px`;
    
    // Parar propagação de cliques no popup
    popup.addEventListener('click', (e) => e.stopPropagation());
    
    let coresHTML = cores.map(cor => `
        <button class="color-option" 
                data-codigo="${cor.codigo}" 
                data-nome="${cor.nome}"
                style="background-color: ${cor.hex};"
                title="${cor.nome}">
            <span class="color-name">${cor.nome}</span>
        </button>
    `).join('');

    popup.innerHTML = `
        <div class="color-popup-header">
            <span>Selecione a cor</span>
            <button class="color-popup-close">&times;</button>
        </div>
        <div class="color-options">
            ${coresHTML}
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(popup);
    
    // Ajustar posição se sair da tela
    const popupRect = popup.getBoundingClientRect();
    if (popupRect.right > window.innerWidth) {
        popup.style.left = `${rect.left - popupRect.width - 10}px`;
    }
    if (popupRect.bottom > window.innerHeight) {
        popup.style.top = `${window.innerHeight - popupRect.height - 10}px`;
    }
    
    console.log("🎨 Pop-up criado e adicionado ao DOM");

    // Fechar pop-up ao clicar no overlay (fora do popup)
    overlay.addEventListener('click', () => {
        overlay.remove();
        popup.remove();
    });

    // Fechar pop-up pelo X
    popup.querySelector('.color-popup-close').addEventListener('click', () => {
        overlay.remove();
        popup.remove();
    });

    // Selecionar cor
    popup.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', () => {
            const codigoCor = option.dataset.codigo;
            const nomeCor = option.dataset.nome;
            overlay.remove();
            popup.remove();
            adicionarAoCarrinhoDirecto(card, btn, codigoCor, nomeCor);
        });
    });
}

// ==================================
// RENDERIZAÇÃO DA PÁGINA DO CARRINHO
// ==================================
function renderCarrinhoPage() {
    const container = document.getElementById("listaCarrinho") || document.getElementById("carrinho-itens");
    if (!container) return;

    const carrinho = safeGetCarrinho();
    container.innerHTML = "";

    if (!carrinho.length) {
        container.innerHTML = "<p>Carrinho vazio.</p>";
        const totalEl = document.getElementById("valorTotal");
        if (totalEl) totalEl.textContent = "R$ 0,00";
        return;
    }

    carrinho.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("carrinho-item");
        div.style.cssText = "display:flex; gap:12px; align-items:center; padding:12px; border-bottom:1px solid #eee;";
        div.innerHTML = `
            <span style="flex:2;">${item.descricao}</span>
            <span style="flex:1;">Código: ${item.codigo}</span>
            <input type="number" min="1" value="${item.qtd}" 
                   style="width:70px; padding:6px;"
                   onchange="updateItemQuantity('${item.codigo}', this.value)">
            <span style="flex:1;">R$ ${(Number(item.preco) || 0).toFixed(2)}</span>
            <button class="btn-remove" onclick="removeItem('${item.codigo}')">Remover</button>
        `;
        container.appendChild(div);
    });

    const total = carrinho.reduce((s, it) => s + ((Number(it.preco) || 0) * (Number(it.qtd) || 0)), 0);
    const totalEl = document.getElementById("valorTotal");
    if (totalEl) totalEl.textContent = `R$ ${total.toFixed(2)}`;
}

function updateItemQuantity(codigo, novaQtd) {
    const carrinho = safeGetCarrinho();
    const idx = carrinho.findIndex(i => i.codigo === codigo);
    if (idx === -1) return;
    carrinho[idx].qtd = Math.max(1, Number(novaQtd) || 1);
    safeSaveCarrinho(carrinho);
    renderCarrinhoPage();
}

function removeItem(codigo) {
    let carrinho = safeGetCarrinho();
    carrinho = carrinho.filter(i => i.codigo !== codigo);
    safeSaveCarrinho(carrinho);
    renderCarrinhoPage();
}

// ==================================
// GERAR PDF DO CARRINHO
// ==================================
function setupPdfButton() {
    const btnPdf = document.getElementById("btn-gerar-pdf") || document.getElementById("btnPdf");
    
    if (!btnPdf) return;
    
    btnPdf.addEventListener("click", async () => {
        const clienteNome = (document.getElementById("clienteNome")?.value || "").trim();
        const clienteCNPJ = (document.getElementById("clienteCNPJ")?.value || "").trim();
        const clienteEmail = (document.getElementById("clienteEmail")?.value || "").trim();
        const clienteTelefone = (document.getElementById("clienteTelefone")?.value || "").trim();

        if (!window.jspdf?.jsPDF) {
            alert("jsPDF não disponível.");
            return;
        }

        const carrinho = safeGetCarrinho();
        if (!carrinho.length) {
            alert("Carrinho vazio — adicione itens antes de gerar o PDF.");
            return;
        }

        const doc = new window.jspdf.jsPDF();

        const marginLeft = 14;
        const colDesc = 70;
        const colQtd = 140;
        const colPreco = 170;
        let y = 18;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Orçamento", doc.internal.pageSize.getWidth() / 2, 12, { align: "center" });
        y += 6;
        doc.setFontSize(10);

        doc.setFont("courier", "normal");
        if (clienteNome) {
            doc.text(`Cliente: ${clienteNome}`, marginLeft, y);
            y += 5;
        }
        if (clienteCNPJ) {
            doc.text(`CNPJ: ${clienteCNPJ}`, marginLeft, y);
            y += 5;
        }
        if (clienteEmail) {
            doc.text(`E-mail: ${clienteEmail}`, marginLeft, y);
            y += 5;
        }
        if (clienteTelefone) {
            doc.text(`Telefone: ${clienteTelefone}`, marginLeft, y);
            y += 5;
        }
        if (clienteNome || clienteCNPJ || clienteEmail || clienteTelefone) y += 4;

        doc.setFont("courier", "bold");
        doc.text("Código", marginLeft, y);
        doc.text("Descrição", colDesc, y);
        doc.text("Qtd", colQtd, y);
        doc.text("Preço", colPreco, y);
        y += 6;
        doc.setFont("courier", "normal");

        const descColWidth = colQtd - colDesc - 6;
        const lineHeight = 5;

        for (let i = 0; i < carrinho.length; i++) {
            const item = carrinho[i];
            const descricao = (item.descricao || "").replace(/\s+/g, " ").trim();
            const codigo = item.codigo || "";
            const qtd = Number(item.qtd) || 1;
            const preco = Number(item.preco) || 0;

            const descLines = doc.splitTextToSize(descricao, descColWidth);
            if (y + descLines.length * lineHeight > 277) {
                doc.addPage();
                y = 18;
            }

            doc.text(codigo, marginLeft, y);
            doc.text(descLines, colDesc, y);
            doc.text(String(qtd), colQtd, y);
            doc.text(`R$ ${preco.toFixed(2)}`, colPreco, y);

            y += descLines.length * lineHeight;
            y += 2;
        }

        const total = carrinho.reduce((s, it) => s + ((Number(it.preco) || 0) * (Number(it.qtd) || 0)), 0);
        doc.setFontSize(12);
        doc.text(`Total: R$ ${total.toFixed(2)}`, marginLeft, y + 8);

        doc.save("Orçamento.pdf");
    });
}

// ==================================
// VÍDEO DE INTRODUÇÃO
// ==================================
function setupIntroVideo() {
    const introOverlay = document.getElementById("intro-overlay");
    const introVideo = document.getElementById("intro-video");
    
    const INTRO_LAST_KEY = "introLastShown";
    const INTRO_COOLDOWN = 2 * 60 * 1000;
    const lastShown = Number(localStorage.getItem(INTRO_LAST_KEY) || 0);
    
    if (Date.now() - lastShown < INTRO_COOLDOWN) {
        if (introOverlay) introOverlay.style.display = "none";
        if (introVideo) introVideo.style.display = "none";
    } else {
        const hideIntro = () => {
            if (introOverlay) {
                introOverlay.style.opacity = "0";
                setTimeout(() => {
                    introOverlay.style.display = "none";
                }, 600);
            }
            localStorage.setItem(INTRO_LAST_KEY, String(Date.now()));
        };

        if (introVideo) {
            introVideo.play().catch(() => {
                if (introOverlay) introOverlay.style.display = "none";
            });
            setTimeout(hideIntro, 3000);
        } else {
            setTimeout(hideIntro, 500);
        }
    }
}

// ==================================
// CARREGAMENTO DINÂMICO DE CATÁLOGO VIA JSON
// ==================================
async function carregarCatalogoJSON(arquivoJSON, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`Container ${containerId} não encontrado`);
        return;
    }

    try {
        const response = await fetch(arquivoJSON);
        if (!response.ok) throw new Error(`Erro ao carregar ${arquivoJSON}`);
        
        const produtos = await response.json();
        console.log(`✅ ${produtos.length} produtos carregados de ${arquivoJSON}`);

        container.innerHTML = ''; // Limpa o container

        produtos.forEach(produto => {
            const card = document.createElement('div');
            card.classList.add('item-card');
            
            // Verificar se o produto tem variações de cores
            const temCores = produto.cores && produto.cores.length > 0;
            const coresAttr = temCores ? `data-cores='${JSON.stringify(produto.cores)}'` : '';
            
            card.innerHTML = `
                <img src="${produto.imagem}" alt="${produto.descricao}">
                <div class="titulo">${produto.descricao}</div>
                <div class="preco" data-preco="${produto.preco}">R$ ${produto.preco.toFixed(2)}</div>
                <div class="codigo">${produto.codigo}</div>
                <div class="card-bottom-actions">
                    <input type="number" min="1" value="1" class="item-qtd">
                    <button class="btn-add-carrinho"
                        data-descricao="${produto.descricao}"
                        data-codigo="${produto.codigo}"
                        data-preco="${produto.preco}"
                        ${coresAttr}>
                        Adicionar
                    </button>
                </div>
            `;
            
            container.appendChild(card);
        });

    } catch (error) {
        console.error(`Erro ao carregar catálogo:`, error);
        container.innerHTML = '<p>Erro ao carregar produtos. Tente novamente mais tarde.</p>';
    }
}

// ==================================
// DETECTA QUAL PÁGINA E CARREGA O JSON CORRESPONDENTE
// ==================================
function inicializarCatalogo() {
    const pathname = window.location.pathname;
    const filename = pathname.substring(pathname.lastIndexOf('/') + 1);

    // Mapeamento: página → arquivo JSON
    const catalogoMap = {
        'psdpass.html': 'catalogo-pesado.json',
        'categoria-passeio.html': 'catalogo-passeio.json',
        'categoria-cubos.html': 'catalogo-cubos.json'
    };

    const arquivoJSON = catalogoMap[filename];

    // Categoria Passeio: carregar padrão e coloridos
    if (filename === 'categoria-passeio.html') {
        const padraoId = 'catalogo-padrao';
        const coloridosId = 'catalogo-coloridos';
        carregarCatalogoJSON('catalogo-passeio.json', padraoId); // carrega apenas o padrão inicialmente

        let coloridosCarregado = false;

        // Submenu toggling com lazy load
        const links = document.querySelectorAll('.catalog-submenu .subcat-link');
        const padrao = document.getElementById(padraoId);
        const coloridos = document.getElementById(coloridosId);

        links.forEach(link => {
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                links.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                const target = link.getAttribute('href');

                if (target === '#catalogo-coloridos') {
                    // Esconde padrão e mostra coloridos
                    padrao.style.display = 'none';
                    coloridos.style.display = 'grid';
                    coloridos.hidden = false;
                    
                    // Carrega JSON apenas na primeira vez
                    if (!coloridosCarregado) {
                        await carregarCatalogoJSON('passeio-coloridos.json', coloridosId);
                        coloridosCarregado = true;
                    }
                } else {
                    // Esconde coloridos e mostra padrão
                    coloridos.style.display = 'none';
                    padrao.style.display = 'grid';
                    padrao.hidden = false;
                }
            });
        });
        return;
    }

    // Demais páginas: comportamento padrão único
    const catalogoContainer = document.querySelector('.catalogo');
    if (arquivoJSON && catalogoContainer) {
        console.log(`📂 Carregando catálogo: ${arquivoJSON}`);
        carregarCatalogoJSON(arquivoJSON, catalogoContainer.id || 'catalogo-container');
    }
}

// ==================================
// INICIALIZAÇÃO
// ==================================
document.addEventListener("DOMContentLoaded", () => {
    setupIntroVideo();
    setupPdfButton();
    inicializarCatalogo(); // Carrega o catálogo via JSON
    
    if (document.getElementById("listaCarrinho") || document.getElementById("carrinho-itens")) {
        console.log("🔍 Página do carrinho detectada");
        console.log("📦 Carrinho no localStorage:", localStorage.getItem("carrinho"));
        console.log("📋 Carrinho parseado:", safeGetCarrinho());
        renderCarrinhoPage();
    }
});
