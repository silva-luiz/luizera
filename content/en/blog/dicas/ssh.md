---
title: "SSH"
date: 2025-08-15T22:00:00+08:00
draft: false
author: "Luizera do taticão"
categories: "ssh"
tags: ["dicas", "IT"]
thumbnail: "/image/default/ssh.jpeg"
headline: true
---

**Chave SSH**: para que serve e como criar a sua.

<!--more-->

Se você trabalha com servidores, deploys ou repositórios Git, provavelmente já ouviu falar em chaves SSH. Elas são uma forma segura e prática de autenticação, que substitui o uso de senhas tradicionais.

Com uma chave SSH configurada, você consegue se conectar a servidores ou enviar código para o Git sem precisar digitar senha toda hora — e ainda ganha um bom reforço de segurança no processo.

Neste post, vou mostrar como criar a sua chave SSH e configurá-la para que seu fluxo de trabalho fique mais ágil e protegido.

## O surgimento do SSH

O **SSH** (Secure Shell) surgiu na década de 1990, criado pelo pesquisador finlandês **Tatu Ylönen**. Na época, muitos administradores e desenvolvedores ainda utilizavam protocolos como Telnet e FTP para acessar servidores remotamente — e o problema é que esses protocolos transmitiam informações, incluindo senhas, em **texto puro**, sem qualquer criptografia.

Isso tornava as conexões extremamente vulneráveis, já que qualquer interceptação na rede poderia revelar dados sensíveis.

O SSH veio para resolver exatamente essa falha, trazendo **comunicação criptografada ponta a ponta**, permitindo que duas máquinas troquem informações de forma segura, mesmo por redes inseguras como a internet.

## Para que serve a chave SSH

Além da criptografia, o SSH trouxe um recurso essencial: o **uso de chaves criptográficas** como forma de autenticação.

As **chaves SSH** funcionam em pares:

- **Chave privada:** você guarda em seu computador.
- **Chave pública:** você coloca no servidor ou serviço com o qual deseja se conectar.

Quando você tenta acessar o destino, o SSH compara as chaves e, se elas corresponderem, a conexão é liberada sem a necessidade de senha.

## Vantagens do uso de chaves SSH

O uso de chaves SSH oferece:

- **Mais segurança:** não há senha para ser interceptada.
- **Mais praticidade:** você não precisa digitar nada a cada acesso.

Hoje, o SSH é amplamente utilizado para:

- Conexão segura a servidores remotos.
- Automação de deploys.
- Integração com repositórios Git.
- Transferência de arquivos com criptografia (via SCP ou SFTP).


## Como criar uma chave SSH?

Aqui vou exemplificar a criação de uma chave SSH, pra que você possa fazer ai no seu PC também. Quem me ensinou a criar uma chave, e pra que ela servia foi o lendário [umgeher](http://umgeher.org), e você pode encontrar mais conteúdos como esse acessando o blog dele.

### Gerando o par de chaves

Primeiramente, para gerar seu par de chaves, execute o seguinte comando no terminal:

```shell
ssh-keygen -t ed25519
```
Ao executar o comando, você define onde será salva sua chave. Como já possuo uma, criei uma test-key para que a minha não seja sobrescrita. Porém, se é a sua primeira vez, aceite a opção padrão.

Algumas observações importantes:
- Use uma senha forte, mas que você não esqueça, porque depois não tem como recuperar a senha (não adianta chorar);
- Use sempre a criptografia ed25519 e nunca RSA, pois a ed25519 é mais segura, mais rápida e mais compacta;
- NUNCA passe sua chave privada para ninguém, a única chave que deve ser compartilhada é a chave de formato **.pub**

{{< figure src="/image/default/ssh-create.png" title="Chave criada" >}}

Feito isso, será gerado seu par de chaves no endereço definido no passo acima (no meu caso, os arquivos **test-key** e **test-key.pub**), e você pode ver o conteúdo da chave executando o seguinte comando:

```shell
cat .\test-key.pub
```
O comando cat exibe o conteúdo do arquivo escolhido
{{< figure src="/image/default/my-ssh-key.png" title="Chave criada" >}}

Este é o conteúdo da sua chave pública e deve ser compartilhado apenas com servidores ou serviços nos quais você deseja se autenticar, como por exemplo (GitHub, GitLab, servidores SSH, etc...).

### Adicionando a chave no GitHub

Como exemplo, vou adicionar essa a chave criada no GitHub pra autenticar meu computador com minha conta sem a necessidade de digitar a minha senha em cada operação feita. 
O primeiro passo é ir nas configurações (Settings), e em seguida escolher a opção **'SSH and GPG keys'**.
Em seguida, **'New SSH key'**

{{< figure src="/image/default/ssh-github-config.png" title="Chave criada" >}}

E por fim, adicione a sua chave pública e salve para finalizar o processo