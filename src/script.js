;
(function () {
    var _a;
    // Constante com o resultado do Objeto querySelector
    const $ = (query) => document.querySelector(query);
    // Calcula o tempo do veiculo no patio
    function calcTempo(milisegundos) {
        const minutos = Math.floor(milisegundos / 60000);
        const segundos = Math.floor(milisegundos % 60000 / 1000);
        return `${minutos}m e ${segundos}s`;
    }
    // Objeto Patio com os seus M�todos
    function patio() {
        // M�todo ler() Veiculo
        function ler() {
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }
        // M�todo salvar() Veiculo
        function salvar(veiculo) {
            localStorage.setItem("patio", JSON.stringify(veiculo));
        }
        // M�todo adicionar Veiculo
        function adicionar(veiculo, salva) {
            var _a, _b;
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${veiculo.nome}</td>
                <td>${veiculo.placa}</td>
                <td>${veiculo.entrada}</td>
                <td><button class="delete" data-placa="${veiculo.placa}">X</button></td>
            `;
            (_a = row.querySelector(".delete")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
                remover(this.dataset.placa);
            });
            (_b = $("#patio")) === null || _b === void 0 ? void 0 : _b.appendChild(row);
            // Verifica de Salva nova Inclus�o de Veiculo
            if (salva) {
                salvar([...ler(), veiculo]);
            }
            ;
        }
        function remover(placa) {
            const { entrada, nome } = ler().find(veiculo => veiculo.placa === placa);
            // Calcula o tempo no patio
            const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime());
            if (confirm(`O veiculo ${nome} ${placa} permaneceu por ${tempo} !  Deseja encerrar?`)) {
                salvar(ler().filter((veiculo) => veiculo.placa !== placa));
                render();
            }
            else {
                return;
            }
        }
        // M�todo render() para Reconstruir a Tela
        function render() {
            $("#patio").innerHTML = "";
            const patio = ler();
            // Verifica se existem Veiculos para cadastrar
            if (patio.length) {
                patio.forEach((veiculo) => adicionar(veiculo));
            }
        }
        // Executa os M�todos do Objeto Veiculo
        return { ler, adicionar, remover, salvar, render };
    }
    // Reconstroi a Tela
    patio().render();
    // Ao pressionar o Button Cadastrar, � verificado se os campos
    // nome e placa est�o devidamente preenchidos, e realizamos a valida��o
    (_a = $("#cadastrar")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        var _a, _b;
        const nome = (_a = $("#nome")) === null || _a === void 0 ? void 0 : _a.value;
        const placa = (_b = $("#placa")) === null || _b === void 0 ? void 0 : _b.value;
        // Se alguam campo obrigat�rio n�o estiver preenchido, envia mensagem de erro
        if (!nome || !placa) {
            alert("Os campos nome e placa sao obrigatorios !");
            return;
        }
        // Adiciona novo Veiculo ao Armazenamento Local
        // Ferramentas do Desenvolvedor -> Aplicativo -> Armazenamento -> Armazenamento Local -> LocalHost
        patio().adicionar({ nome, placa, entrada: new Date().toISOString() }, true);
    });
})();
