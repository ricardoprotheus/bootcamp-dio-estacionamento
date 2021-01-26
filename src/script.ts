// Definição da Interface do Objeto Veiculo
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

    // Objeto Patio com os seus Métodos
    function patio() {

        // Método ler() Veiculo
        function ler(): Veiculo[] {
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }

        // Método salvar() Veiculo
        function salvar(veiculo: Veiculo[]) {
            localStorage.setItem("patio", JSON.stringify(veiculo));
        }

        // Método adicionar Veiculo
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

            // Verifica de Salva nova Inclusão de Veiculo
            if (salva) {
                salvar([...ler(), veiculo])
            };
        }

        // Deleta o veiculo
        function remover(placa: string) {
            const { entrada, nome } = ler().find(veiculo => veiculo.placa === placa);
            // Calcula o tempo no patio
            const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime());

            // Confirma remoção do veiculo
            if (confirm(`O veiculo ${nome} ${placa} permaneceu por ${tempo} !  Deseja encerrar?`)) {
                salvar(ler().filter((veiculo) => veiculo.placa !== placa));
                render();
            } else {
                return;
            }
        }

        // Método render() para Reconstruir a Tela
        function render() {
            $("#patio")!.innerHTML = "";
            const patio = ler();

            // Verifica se existem Veiculos para cadastrar
            if (patio.length) {
                patio.forEach((veiculo) => adicionar(veiculo));
            }
        }

        // Executa os Métodos do Objeto Veiculo
        return { ler, adicionar, remover, salvar, render };
    }
    
    // Reconstroi a Tela
    patio().render();

    // Ao pressionar o Button Cadastrar, é verificado se os campos
    // nome e placa estão devidamente preenchidos, e realizamos a validação
    $("#cadastrar")?.addEventListener("click", () => {
        const nome = $("#nome")?.value;
        const placa = $("#placa")?.value;

        // Se alguam campo obrigatório não estiver preenchido, envia mensagem de erro
        if (!nome || !placa) {
            alert("Os campos nome e placa sao obrigatorios !");
            return;
        }

        // Adiciona novo Veiculo ao Armazenamento Local
        // Ferramentas do Desenvolvedor -> Aplicativo -> Armazenamento -> Armazenamento Local -> LocalHost
        patio().adicionar({ nome, placa, entrada: new Date().toISOString()}, true);
    });

})();