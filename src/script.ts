// Defini��o da Interface do Objeto Veiculo
interface Veiculo {
    nome: string;
    placa: string;
    entrada: Date | string;
};

(function() {

    // Constante com o resultado do Objeto querySelector
    const $ = (query: string): HTMLInputElement | null => document.querySelector(query);

    // Calcula o tempo do veiculo no patio
    function calcTempo(milisegundos: number) {
        const minutos = Math.floor(milisegundos / 60000);
        const segundos = Math.floor(milisegundos % 60000 / 1000);

        return `${minutos}m e ${segundos}s`;
    }

    // Objeto Patio com os seus M�todos
    function patio() {

        // M�todo ler() Veiculo
        function ler(): Veiculo[] {
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }

        // M�todo salvar() Veiculo
        function salvar(veiculo: Veiculo[]) {
            localStorage.setItem("patio", JSON.stringify(veiculo));
        }

        // M�todo adicionar Veiculo
        function adicionar(veiculo: Veiculo, salva?: boolean) {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${veiculo.nome}</td>
                <td>${veiculo.placa}</td>
                <td>${veiculo.entrada}</td>
                <td><button class="delete" data-placa="${veiculo.placa}">X</button></td>
            `;

            row.querySelector(".delete")?.addEventListener("click", function() {
                remover(this.dataset.placa);
            });

            $("#patio")?.appendChild(row);

            // Verifica de Salva nova Inclus�o de Veiculo
            if (salva) {
                salvar([...ler(), veiculo])
            };
        }

        // Deleta o veiculo
        function remover(placa: string) {
            const { entrada, nome } = ler().find(veiculo => veiculo.placa === placa);
            // Calcula o tempo no patio
            const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime());

            // Confirma remo��o do veiculo
            if (confirm(`O veiculo ${nome} ${placa} permaneceu por ${tempo} !  Deseja encerrar?`)) {
                salvar(ler().filter((veiculo) => veiculo.placa !== placa));
                render();
            } else {
                return;
            }
        }

        // M�todo render() para Reconstruir a Tela
        function render() {
            $("#patio")!.innerHTML = "";
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
    $("#cadastrar")?.addEventListener("click", () => {
        const nome = $("#nome")?.value;
        const placa = $("#placa")?.value;

        // Se alguam campo obrigat�rio n�o estiver preenchido, envia mensagem de erro
        if (!nome || !placa) {
            alert("Os campos nome e placa sao obrigatorios !");
            return;
        }

        // Adiciona novo Veiculo ao Armazenamento Local
        // Ferramentas do Desenvolvedor -> Aplicativo -> Armazenamento -> Armazenamento Local -> LocalHost
        patio().adicionar({ nome, placa, entrada: new Date().toISOString()}, true);
    });

})();