// MODO CLARO E ESCURO

var corpo = document.body;
var botaoTema = document.getElementById('botao-tema');

if (localStorage.getItem('tema-gamma') === 'claro')
{
    corpo.classList.add('claro');
}

atualizarTema();

botaoTema.addEventListener('click', function()
{
    corpo.classList.toggle('claro');

    if (corpo.classList.contains('claro'))
    {
        localStorage.setItem('tema-gamma', 'claro');
    }
    else
    {
        localStorage.setItem('tema-gamma', 'escuro');
    }

    atualizarTema();
});

function atualizarTema()
{
    if (corpo.classList.contains('claro'))
    {
        botaoTema.setAttribute('aria-label', 'Ativar modo escuro');
        botaoTema.querySelector('img').src = 'imagens/lua.svg';
    }
    else
    {
        botaoTema.setAttribute('aria-label', 'Ativar modo claro');
        botaoTema.querySelector('img').src = 'imagens/sol.svg';
    }
}


// MENU E BUSCA

var botaoMenu = document.getElementById('botao-menu');
var navegacao = document.getElementById('navegacao');
var botaoBusca = document.getElementById('botao-busca');
var painelBusca = document.getElementById('busca-painel');

botaoMenu.addEventListener('click', function()
{
    navegacao.classList.toggle('aberta');
    botaoMenu.setAttribute('aria-expanded', navegacao.classList.contains('aberta'));
});

botaoBusca.addEventListener('click', function()
{
    painelBusca.classList.toggle('aberto');
    botaoBusca.setAttribute('aria-expanded', painelBusca.classList.contains('aberto'));

    if (painelBusca.classList.contains('aberto'))
    {
        botaoBusca.setAttribute('aria-label', 'Esconder busca');
        document.getElementById('campo-busca').focus();
    }
    else
    {
        botaoBusca.setAttribute('aria-label', 'Mostrar busca');
    }
});

var avisoBusca = document.getElementById('aviso-busca');
var termoBusca = new URLSearchParams(window.location.search).get('busca');

if (avisoBusca && termoBusca !== null && termoBusca.trim() !== '')
{
    var termo = termoBusca.trim().toLowerCase();
    var totalEncontrado = 0;

    document.getElementById('campo-busca').value = termoBusca;
    painelBusca.classList.add('aberto');
    botaoBusca.setAttribute('aria-expanded', 'true');
    botaoBusca.setAttribute('aria-label', 'Esconder busca');

    document.querySelectorAll('.categoria-menu').forEach(function(categoria)
    {
        var encontrados = 0;

        categoria.querySelectorAll('.produto').forEach(function(produto)
        {
            var nome = produto.querySelector('h3').textContent.toLowerCase();
            var descricao = produto.querySelector('p').textContent.toLowerCase();
            var mostrar = nome.indexOf(termo) !== -1 || descricao.indexOf(termo) !== -1;

            produto.hidden = !mostrar;
            if (mostrar)
            {
                encontrados++;
            }
        });

        categoria.hidden = encontrados === 0;
        totalEncontrado += encontrados;
    });

    if (totalEncontrado === 0)
    {
        avisoBusca.textContent = 'Nenhum produto encontrado.';
    }
    else
    {
        avisoBusca.textContent = totalEncontrado + ' produto(s) encontrado(s).';
    }

    avisoBusca.hidden = false;
}


// MODAIS

var fundoCarrinho = document.createElement('div');
fundoCarrinho.className = 'fundo-modal';
fundoCarrinho.innerHTML =
    '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="titulo-carrinho">' +
        '<div class="modal-topo">' +
            '<h2 id="titulo-carrinho">Seu carrinho</h2>' +
            '<button class="botao-icone fechar-modal" type="button" aria-label="Fechar carrinho">' +
                '<img class="icone" src="imagens/fechar.svg" alt="">' +
            '</button>' +
        '</div>' +
        '<div id="conteudo-carrinho"></div>' +
        '<form id="formulario-pedido">' +
            '<label for="pedido-cliente">Seu nome</label>' +
            '<input id="pedido-cliente" type="text" maxlength="60" required>' +
            '<label for="pedido-endereco">Endereço de entrega</label>' +
            '<input id="pedido-endereco" type="text" maxlength="100" required>' +
            '<button class="botao largo" type="submit">Finalizar e baixar pedido</button>' +
        '</form>' +
    '</div>';
corpo.appendChild(fundoCarrinho);

document.getElementById('botao-carrinho').addEventListener('click', function()
{
    fundoCarrinho.classList.add('aberto');
});

var cadastro = document.getElementById('modal-cadastro');

if (cadastro)
{
    document.querySelector('[data-abrir-cadastro]').addEventListener('click', function(evento)
    {
        evento.preventDefault();
        cadastro.classList.add('aberto');
    });

    if (window.location.hash === '#cadastro')
    {
        cadastro.classList.add('aberto');
    }
}

document.querySelectorAll('.fundo-modal').forEach(function(fundo)
{
    fundo.addEventListener('click', function(evento)
    {
        if (evento.target === fundo || evento.target.closest('.fechar-modal'))
        {
            fundo.classList.remove('aberto');
        }
    });
});

document.addEventListener('keydown', function(evento)
{
    if (evento.key === 'Escape')
    {
        document.querySelectorAll('.fundo-modal').forEach(function(fundo)
        {
            fundo.classList.remove('aberto');
        });
    }
});


// CARRINHO E PEDIDO EM JSON

var carrinho = JSON.parse(localStorage.getItem('carrinho-gamma') || '[]');
atualizarCarrinho();

document.querySelectorAll('[data-produto]').forEach(function(botao)
{
    botao.addEventListener('click', function()
    {
        var nome = botao.getAttribute('data-produto');
        var preco = Number(botao.getAttribute('data-preco'));
        var produtoExistente = null;

        for (var i = 0; i < carrinho.length; i++)
        {
            if (carrinho[i].nome === nome)
            {
                produtoExistente = carrinho[i];
                break;
            }
        }

        if (produtoExistente)
        {
            produtoExistente.quantidade++;
        }
        else
        {
            carrinho.push({nome: nome, preco: preco, quantidade: 1});
        }

        salvarCarrinho();
        fundoCarrinho.classList.add('aberto');
    });
});

fundoCarrinho.addEventListener('click', function(evento)
{
    var botao = evento.target.closest('[data-acao]');

    if (!botao)
    {
        return;
    }

    var indice = Number(botao.getAttribute('data-indice'));
    var acao = botao.getAttribute('data-acao');

    if (acao === 'mais')
    {
        carrinho[indice].quantidade++;
    }
    else if (acao === 'menos')
    {
        carrinho[indice].quantidade--;

        if (carrinho[indice].quantidade === 0)
        {
            carrinho.splice(indice, 1);
        }
    }
    else if (acao === 'remover')
    {
        carrinho.splice(indice, 1);
    }

    salvarCarrinho();
});

function salvarCarrinho()
{
    localStorage.setItem('carrinho-gamma', JSON.stringify(carrinho));
    atualizarCarrinho();
}

function atualizarCarrinho()
{
    var conteudo = document.getElementById('conteudo-carrinho');
    var formulario = document.getElementById('formulario-pedido');
    var total = 0;

    conteudo.innerHTML = '';

    if (carrinho.length === 0)
    {
        conteudo.innerHTML = '<p class="carrinho-vazio">Seu carrinho está vazio.</p>' +
            '<a class="botao largo" href="cardapio.html">Ver cardápio</a>';
        formulario.style.display = 'none';
        return;
    }

    var lista = document.createElement('ul');
    lista.className = 'carrinho-lista';

    for (var i = 0; i < carrinho.length; i++)
    {
        var item = carrinho[i];
        var linha = document.createElement('li');
        total += item.preco * item.quantidade;
        linha.className = 'carrinho-item';
        linha.innerHTML =
            '<div><strong></strong><small></small></div>' +
            '<div class="carrinho-controles">' +
                '<button type="button" data-acao="menos" data-indice="' + i + '" aria-label="Diminuir quantidade">' +
                    '<img src="imagens/menos.svg" alt="">' +
                '</button>' +
                '<span>' + item.quantidade + '</span>' +
                '<button type="button" data-acao="mais" data-indice="' + i + '" aria-label="Aumentar quantidade">' +
                    '<img src="imagens/mais.svg" alt="">' +
                '</button>' +
                '<button type="button" data-acao="remover" data-indice="' + i + '" aria-label="Remover produto">' +
                    '<img src="imagens/lixeira.svg" alt="">' +
                '</button>' +
            '</div>';
        linha.querySelector('strong').textContent = item.nome;
        linha.querySelector('small').textContent = formatarPreco(item.preco);
        lista.appendChild(linha);
    }

    conteudo.appendChild(lista);
    var linhaTotal = document.createElement('p');
    linhaTotal.className = 'carrinho-total';
    linhaTotal.innerHTML = '<span>Total</span><span>' + formatarPreco(total) + '</span>';
    conteudo.appendChild(linhaTotal);
    formulario.style.display = 'block';
}

function formatarPreco(valor)
{
    return 'R$ ' + valor.toFixed(2).replace('.', ',');
}

document.getElementById('formulario-pedido').addEventListener('submit', function(evento)
{
    evento.preventDefault();

    if (carrinho.length === 0)
    {
        return;
    }

    var itens = [];
    var total = 0;

    for (var i = 0; i < carrinho.length; i++)
    {
        itens.push(carrinho[i].quantidade + 'x ' + carrinho[i].nome);
        total += carrinho[i].preco * carrinho[i].quantidade;
    }

    var pedido = {
        PedidoId: Date.now(),
        Cliente: document.getElementById('pedido-cliente').value.trim(),
        Endereco: document.getElementById('pedido-endereco').value.trim(),
        Itens: itens.join('; '),
        Total: Number(total.toFixed(2))
    };

    if (!pedido.Cliente || !pedido.Endereco)
    {
        return;
    }

    var arquivo = new Blob([JSON.stringify([pedido], null, 2)], {type: 'application/json'});
    var enderecoArquivo = URL.createObjectURL(arquivo);
    var link = document.createElement('a');
    link.href = enderecoArquivo;
    link.download = 'pedido-' + pedido.PedidoId + '.json';
    link.click();

    setTimeout(function()
    {
        URL.revokeObjectURL(enderecoArquivo);
    }, 1000);

    carrinho = [];
    salvarCarrinho();
    fundoCarrinho.classList.remove('aberto');
    window.alert('Pedido salvo em JSON. Importe o arquivo no aplicativo GAMMA.');
});


// MASCARAS E FORMULARIOS

if (cadastro)
{
    var telefone = document.getElementById('cadastro-telefone');
    var cpf = document.getElementById('cadastro-cpf');

    telefone.addEventListener('input', function()
    {
        var numeros = telefone.value.replace(/\D/g, '').slice(0, 11);

        if (numeros.length > 6)
        {
            telefone.value = '(' + numeros.slice(0, 2) + ') ' +
                numeros.slice(2, 7) + '-' + numeros.slice(7);
        }
        else if (numeros.length > 2)
        {
            telefone.value = '(' + numeros.slice(0, 2) + ') ' + numeros.slice(2);
        }
        else
        {
            telefone.value = numeros.length ? '(' + numeros : '';
        }
    });

    cpf.addEventListener('input', function()
    {
        var numeros = cpf.value.replace(/\D/g, '').slice(0, 11);
        var texto = numeros.slice(0, 3);

        if (numeros.length > 3)
        {
            texto += '.' + numeros.slice(3, 6);
        }

        if (numeros.length > 6)
        {
            texto += '.' + numeros.slice(6, 9);
        }

        if (numeros.length > 9)
        {
            texto += '-' + numeros.slice(9, 11);
        }

        cpf.value = texto;
    });

    document.getElementById('formulario-cadastro').addEventListener('submit', function(evento)
    {
        evento.preventDefault();
        var aviso = document.getElementById('aviso-cadastro');

        if (telefone.value.replace(/\D/g, '').length !== 11 ||
            cpf.value.replace(/\D/g, '').length !== 11)
        {
            aviso.textContent = 'Confira o telefone e o CPF.';
        }
        else if (document.getElementById('cadastro-senha').value !==
            document.getElementById('cadastro-confirmar').value)
        {
            aviso.textContent = 'As senhas precisam ser iguais.';
        }
        else
        {
            aviso.textContent = 'Dados conferidos. O cadastro estará disponível em breve.';
        }
    });

    document.getElementById('formulario-login').addEventListener('submit', function(evento)
    {
        evento.preventDefault();
        document.getElementById('aviso-login').textContent = 'Entrada disponível em breve.';
    });
}

var formularioContato = document.getElementById('formulario-contato');

if (formularioContato)
{
    formularioContato.addEventListener('submit', function(evento)
    {
        evento.preventDefault();
        document.getElementById('aviso-contato').textContent =
            'Mensagem conferida. O envio estará disponível em breve.';
    });
}
