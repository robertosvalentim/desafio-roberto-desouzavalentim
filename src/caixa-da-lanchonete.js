import { cardapio } from "./cardapio.js";
class CaixaDaLanchonete {

    calcularValorDaCompra(metodoDePagamento, itens) {
        let mensagem = "";

        mensagem = this.validarItens(itens);

        if (mensagem) {
            return mensagem;
        }

        switch (metodoDePagamento) {
            case "dinheiro":
                const valorSemDesconto = this.processarItensDoPedido(itens);
                const valorComDesconto = valorSemDesconto - (valorSemDesconto * 0.05);
                mensagem = formatter.format(Number.parseFloat(valorComDesconto).toFixed(2));
                break;
            case "debito":
                const valorCheio = this.processarItensDoPedido(itens);
                mensagem = formatter.format(Number.parseFloat(valorCheio).toFixed(2));
                break;
            case "credito":
                const valorSemJuros = this.processarItensDoPedido(itens);
                const valorComJuros = valorSemJuros + (valorSemJuros * 0.03);
                mensagem = formatter.format(Number.parseFloat(valorComJuros).toFixed(2));
                break;
            default:
                mensagem = "Forma de pagamento inválida!";
        }
        return mensagem;
    }

    processarItensDoPedido(itensDoPedido) {
        let valorTotal = 0.0;
        for (let i = 0; i < itensDoPedido.length; i++) {
            const item = itensDoPedido[i].split(",");
            const codigo = item[0];
            const quantidade = parseInt(item[1]);

            let valor = 0.0;
            for (const index in cardapio) {
                if (cardapio[index].codigo == codigo) {
                    valor = cardapio[index].valor;
                }
            }

            valorTotal = valorTotal + (valor * quantidade);
        }

        return valorTotal;
    }

    validarItens(itens) {
        if (itens.length == 0) {
            return "Não há itens no carrinho de compra!";
        }

        for (let i = 0; i < itens.length; i++) {
            const item = itens[i].split(",");
            const codigo = item[0];
            const quantidade = parseInt(item[1]);

            if (quantidade == 0) {
                return "Quantidade inválida!";
            }
            let itemEncontrado = false;
            let mensagemItemExtra = "";
            for (const index in cardapio) {
                if (cardapio[index].codigo == codigo) {
                    itemEncontrado = true;

                    let descricaoItemExtra = cardapio[index].descricao;
                    if (descricaoItemExtra.includes("extra")) {
                        mensagemItemExtra = this.validarItemExtra(descricaoItemExtra, itens);
                    }
                    break;
                }
            }

            if (mensagemItemExtra) {
                return mensagemItemExtra;
            }
            if (!itemEncontrado) {
                return "Item inválido!";
            }

        }
    }

    validarItemExtra(descricaoItemExtra, itens) {
        let codigo = "";

        if (descricaoItemExtra.includes("extra do Café")) {
            codigo = "cafe";
        } else if (descricaoItemExtra.includes("extra do Sanduíche")) {
            codigo = "sanduiche";
        }

        let valido = false;
        for (let i = 0; i < itens.length; i++) {
            const itemCodigo = itens[i].split(",")[0];
            if (itemCodigo == codigo) {
                valido = true;
                break;
            }
        }

        if (!valido) {
            return "Item extra não pode ser pedido sem o principal";
        }
    }



}

const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
});

export { CaixaDaLanchonete };
