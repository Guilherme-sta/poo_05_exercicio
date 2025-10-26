class Cliente {
    id: number; 
    nome: string; 
    cpf: string; 
    dataNascimento: Date; 
    contas: Conta[] = []; 

    constructor(id: number, nome: string, cpf: string, dataNascimento: Date) {
        this.id = id;
        this.nome = nome;
        this.cpf = cpf;
        this.dataNascimento = dataNascimento;
    }
}

class Conta {
    id: number; 
    numero: string; 
    cliente!: Cliente; 
    dataAbertura: Date; 
    saldo: number;

    constructor(id: number, numero: string, dataAbertura: Date, saldoInicial: number) {
        this.id = id;
        this.numero = numero;
        this.dataAbertura = dataAbertura;
        this.saldo = saldoInicial;
    }

    depositar(valor: number): void { this.saldo = this.saldo + valor; }

    sacar(valor: number): void { this.saldo = this.saldo - valor; }

    transferir(contaDestino: Conta, valor: number): void {
        this.sacar(valor);
        contaDestino.depositar(valor);
    }

    consultarSaldo(): number {
        return this.saldo;
    }
}

class Banco {
    contas: Conta[] = [];
    clientes: Cliente[] = []; 
    
    inserirCliente(cliente: Cliente): void {
        const clienteExistenteId = this.clientes.find(c => c.id === cliente.id);
        const clienteExistenteCpf = this.clientes.find(c => c.cpf === cliente.cpf);

        if (clienteExistenteId || clienteExistenteCpf) {
            console.log(`Erro: Cliente com ID ${cliente.id} ou CPF ${cliente.cpf} já cadastrado.`);
            return; 
        }
        
        this.clientes.push(cliente);
        console.log(`Cliente ${cliente.nome} inserido com sucesso.`);
    }

    inserirConta(conta: Conta): void {
        const contaExistenteId = this.contas.find(c => c.id === conta.id);
        const contaExistenteNumero = this.contas.find(c => c.numero === conta.numero);

        if (contaExistenteId || contaExistenteNumero) {
            console.log(`Erro: Conta com ID ${conta.id} ou Número ${conta.numero} já cadastrada.`);
            return; 
        }

        this.contas.push(conta);
        console.log(`Conta ${conta.numero} inserida com sucesso.`);
    }

    consultarCliente(cpf: string): Cliente | undefined {
        return this.clientes.find(c => c.cpf === cpf); 
    }

    consultarPorNumero(numero: string): Conta | undefined {
        return this.contas.find(c => c.numero === numero);
    }

    listarContasCliente(cpf: string): Conta[] {
        const cliente = this.consultarCliente(cpf);
        if (cliente) {
            return cliente.contas;
        }
        console.log("Cliente não encontrado.");
        return [];
    }

    associarContaCliente(numeroConta: string, cpfCliente: string): void {
        const cliente = this.consultarCliente(cpfCliente); 
        const conta = this.consultarPorNumero(numeroConta); 

        if (cliente && conta) {
            if (conta.cliente) {
                console.log(`Erro: A conta ${numeroConta} já está associada ao cliente ${conta.cliente.nome}.`);
                return;
            }

            const clienteJaPossuiConta = cliente.contas.find(c => c.numero === numeroConta);
            if (clienteJaPossuiConta) {
                console.log(`Erro: O cliente ${cliente.nome} já possui a conta ${numeroConta}.`);
                return;
            }

            conta.cliente = cliente;
            cliente.contas.push(conta);
            console.log(`Conta ${numeroConta} associada ao cliente ${cliente.nome}.`);
        } else {
            console.log("Erro: Cliente ou conta não encontrado para associação.");
        }
    }

    totalizarSaldoCliente(cpf: string): number {
        const cliente = this.consultarCliente(cpf);
        if (cliente) {
            const total = cliente.contas.reduce((soma, conta) => soma + conta.consultarSaldo(), 0);
            return total;
        }
        console.log("Cliente não encontrado para totalizar saldo.");
        return 0;
    }

    alterar(conta: Conta): void {
        let contaProcurada = this.consultarPorNumero(conta.numero);

        if (contaProcurada) {
            contaProcurada.cliente = conta.cliente;
            contaProcurada.dataAbertura = conta.dataAbertura;
            contaProcurada.saldo = conta.saldo;
        }
    }

    excluir(numero: string): void {
        let indice = this.contas.findIndex( c => c.numero == numero);

        if (indice >= 0) {
            const conta = this.contas[indice];
            
            if (conta.cliente) {
                const cliente = conta.cliente;
                const indiceContaCliente = cliente.contas.findIndex(c => c.numero === numero);
                if (indiceContaCliente >= 0) {
                    cliente.contas.splice(indiceContaCliente, 1);
                }
            }
            
            this.contas.splice(indice, 1);
            console.log(`Conta ${numero} excluída.`);
        } else {
            console.log(`Conta ${numero} não encontrada para exclusão.`);
        }
    } 

    depositar(numero: string, valor: number): void {
        let conta = this.consultarPorNumero(numero);
        if (conta) {
            conta.depositar(valor);
            console.log(`Depósito de R$${valor} realizado na conta ${numero}. Novo saldo: R$${conta.consultarSaldo()}`);
        } else {
            console.log(`Conta ${numero} não encontrada para depósito.`);
        }
    }
}

let banco = new Banco();
let cliente1 = new Cliente(1, "Guilherme Alves", "111.111.111-11", new Date("2006-11-15"));
let cliente2 = new Cliente(2, "Eduardo Silva", "222.222.222-22", new Date("1976-06-29"));
let cliente3 = new Cliente(1, "Thiago Elias", "333.333.333-33", new Date("1992-02-02"));
let cliente4 = new Cliente(3, "Marcos Victor", "111.111.111-11", new Date("2001-01-01"));
banco.inserirCliente(cliente1); 
banco.inserirCliente(cliente2);
banco.inserirCliente(cliente3); 
banco.inserirCliente(cliente4); 

console.log("Clientes no banco:", banco.clientes.map(c => c.nome));
console.log("Consultando o CPF '222.222.222-22':", banco.consultarCliente("222.222.222-22")?.nome); 
console.log("Consultando o CPF '999.999.999-99':", banco.consultarCliente("999.999.999-99")?.nome); 

let conta1 = new Conta(1, "C1", new Date(), 100);
let conta2 = new Conta(2, "C2", new Date(), 500);
let conta3 = new Conta(1, "C3", new Date(), 0);
let conta4 = new Conta(3, "C1", new Date(), 0);
banco.inserirConta(conta1); 
banco.inserirConta(conta2); 
banco.inserirConta(conta3); 
banco.inserirConta(conta4); 

console.log("Contas no banco:", banco.contas.map(c => c.numero));

banco.associarContaCliente("C1", "111.111.111-11");
banco.associarContaCliente("C2", "111.111.111-11"); 
banco.associarContaCliente("C1", "222.222.222-22"); 
banco.associarContaCliente("C2", "111.111.111-11"); 
banco.associarContaCliente("C9", "111.111.111-11"); 
banco.associarContaCliente("C1", "999.999.999-99"); 

let contasAna = banco.listarContasCliente("111.111.111-11");
console.log(`Contas do Guilherme:`, contasAna.map(c => c.numero)); 
let contasBruno = banco.listarContasCliente("222.222.222-22");
console.log(`Contas do Eduardo:`, contasBruno.map(c => c.numero)); 
console.log("Associação no Cliente:", cliente1.contas.length);
console.log("Associação na Conta:", conta1.cliente.nome); 

let totalAna = banco.totalizarSaldoCliente("111.111.111-11");
console.log(`Saldo total do Guilherme: R$${totalAna}`); 

banco.depositar("C1", 150); 
totalAna = banco.totalizarSaldoCliente("111.111.111-11");
console.log(`Novo saldo total do Guilherme: R$${totalAna}`); 

banco.excluir("C1"); 
totalAna = banco.totalizarSaldoCliente("111.111.111-11");
console.log(`Saldo total do Guilherme após excluir C1: R$${totalAna}`); 
console.log("Contas restantes do Guilherme:", cliente1.contas.map(c => c.numero)); 
console.log("Contas restantes no banco:", banco.contas.map(c => c.numero)); 