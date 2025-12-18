/* ====== ELEMENTOS ====== */
const modal = document.getElementById("modal");
const abrirModal = document.getElementById("abrirModal");
const fecharModal = document.getElementById("fecharModal");
const form = document.getElementById("formConfirmacao");
const mensagem = document.getElementById("mensagemSucesso");
const btnEnviar = document.getElementById("btnEnviar");

const nomeInput = document.getElementById("nomeConvidado");
const responsavelInput = document.getElementById("nomeResponsavel");
const telefoneInput = document.getElementById("telefone");

/* ====== MODAL ====== */
abrirModal.onclick = () => {
    modal.style.display = "block";
};

fecharModal.onclick = () => {
    modal.style.display = "none";
};

window.onclick = (e) => {
    if (e.target == modal) modal.style.display = "none";
};

/* ====== STORAGE ====== */
const getConvidados = () => JSON.parse(localStorage.getItem("convidados")) || [];
const salvarConvidados = (lista) => localStorage.setItem("convidados", JSON.stringify(lista));

/* ====== FORM SUBMIT ====== */
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = nomeInput.value.trim();
    const responsavel = responsavelInput.value.trim();
    const telefoneValor = telefoneInput.value.trim();

    // Feedback no botão
    btnEnviar.innerText = "Confirmando...";
    btnEnviar.disabled = true;

    let convidados = getConvidados();
    const novoConvidado = {
        id: convidados.length + 1,
        convidado: nome,
        responsavel: responsavel,
        telefone: telefoneValor
    };

    convidados.push(novoConvidado);
    salvarConvidados(convidados);

    // Enviar Telegram
    enviarTelegram(convidados);

    // Sucesso
    setTimeout(() => {
        mensagem.innerHTML = `Olá, <strong>${nome}</strong> sua presença foi confirmada! 🎉`;
        form.reset();
        
        // Fecha o modal após 2.5 segundos
        setTimeout(() => {
            modal.style.display = "none";
            mensagem.innerHTML = "";
            btnEnviar.innerText = "Confirmar";
            btnEnviar.disabled = false;
        }, 2500);
    }, 800);
});

/* ====== TELEGRAM API ====== */
function enviarTelegram(convidados) {
    let lista = convidados.map(c =>
        `${c.id}. 👤 ${c.convidado}\n   🧑 ${c.responsavel}\n   📱 ${c.telefone}`
    ).join("\n\n");

    const texto = `🎉 *Lista de Presença*\n\n${lista}\n\n📊 Total: ${convidados.length}`;

    fetch("https://api.telegram.org/bot8565805611:AAHm5YcRmp3v_Qr5gOjf1TJAt4z8E0Vmyls/sendMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: "6847464964",
            text: texto,
            parse_mode: "Markdown"
        })
    });
}