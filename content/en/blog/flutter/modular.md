---
title: "Gerenciamento de rotas com Flutter Modular"
date: 2024-08-04T18:54:33+08:00
draft: false
author: "Luizera do taticão"
categories: "flutter"
tags: ["flutter", "code"]
thumbnail: "/image/default/flutter_img.jpg"
headline: true
---
A ferramenta de injeção de dependências e gerenciamento de rotas.
<!--more-->


{{< figure src="https://raw.githubusercontent.com/Flutterando/modular/master/flutter_modular.png" title="Flutter Modular" >}}

Salve rapeize, neste post vou falar um pouco sobre o **Flutter Modular**, um package estou usando no trabalho e em projetos pessoais, e que te ajuda a modularizar a aplicação, ou seja, faz com que cada módulo de sua aplicação seja considerado uma aplicação individual, permitindo o reaproveitamento de todo o módulo de forma bem simples e eficaz.

## Surgimento

O Flutter Modular surgiu como uma solução para estruturar e organizar aplicativos Flutter de maneira mais eficiente e modular. Ele foi desenvolvido para ajudar os desenvolvedores a gerenciar a injeção de dependências e a navegação de maneira mais clara e intuitiva. O principal objetivo do Flutter Modular é facilitar o desenvolvimento de aplicações complexas, dividindo-as em módulos menores e independentes, o que melhora a manutenibilidade e a escalabilidade do código. Nesse post vou falar brevemente sobre isso com um exemplo, mas a documentação completa também pode ser consultada aqui: [Modular Documentation](https://modular.flutterando.com.br/docs/flutter_modular/start/)

## Utilização do Flutter Modular

Inicialmente, após a instalação do package através do pubspec.yaml, deve-se definir o ModularApp como o **Widget root da aplicação** para configurar todas as questões de módulos e receber o módulo principal da aplicação, onde ficarão todos os módulos da aplicação como um todo.

**main.dart**
```dart

void main() {
  runApp(
    ModularApp(
      module: AppModule(),
      child: const AppWidget(),
    ),
  );
}
```

O ModularApp deve receber um **module** e um **child**, sendo:

- **module: AppModule()**: a classe responsável por ser o módulo principal;

**app_module.dart
```dart
import 'package:my_app/modules/auth/auth_module.dart';
import 'package:flutter_modular/flutter_modular.dart';

class AppModule extends Module {

  @override
  List<Module> get imports => [
    AuthModule(), // injeções do módulo de autenticação
    CoreModule(), // injeções globais (se aplicam a todos os módulos)
  ]

  @override
  void routes(r) {
    r.module('/', module: AuthModule());
  }
}
```

- **child: AppWidget()**: é onde fica a aplicação do MaterialApp ou do CupertinoApp.

**app_widget.dart**
```dart

import 'package:my_app/shared/core/theme/app_theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_modular/flutter_modular.dart';

class AppWidget extends StatelessWidget {
  const AppWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'My App',
      theme: AppTheme.defaultTheme,
      debugShowCheckedModeBanner: false,
      routerConfig: Modular.routerConfig,
      builder: (context, child) {
        return child ?? Container();
      },
    );
  }
}

```

Dessa forma, a aplicação já está pronta para receber outros módulos. 

Cada feature da aplicação deve ser pensada de forma isolada, como se fosse uma aplicação única. Ou seja, devemos criar pastas separadas para cada feature da aplicação, e colocando dentro delas, apenas o necessário para o funcionamento exclusivo da feature. O **Modular** servirá para auxiliar na modularização de cada uma dessas features.

O exemplo a seguir mostra a criação de um fluxo de autenticação feito com Modular:

### [Passo 1] - AuthModule()

Primeiro devemos criar uma pasta para cada módulo criado, neste exemplo, estamos criando o módulo de autenticação e dentro da pasta, criar o arquivo de módulo da feature:

**auth_module.dart**
```dart 

import 'package:my_app/modules/auth/presenter/pages/sign-in/sign_in_page.dart';
import 'package:my_app/modules/auth/presenter/pages/sign_up/sign_up_page.dart';
import 'package:flutter_modular/flutter_modular.dart';

class AuthModule extends Module {

    // Registro de camadas e injeções para outros módulos
  @override
  void exportedBinds(Injector i) {
    i.add<AuthService>(FirebaseAuthService.new);
    i.addSingleton(GoogleSignIn.new);
    i.addInstance(FirebaseAuth.instance);
  }

  // Registro de camadas e injeções locais
  @override
  void binds(Injector i) {

  }

 // Rotas
  @override
  void routes(r) { // aqui ficam todas as rotas relacionadas ao módulo de autenticação,
  // como registro de usuário, esqueci minha senha, entre outros...
    r.child('/', child: (context) => const SignInPage());
    r.child('/register', child: (context) => const RegisterPage());
  }
}

```

Neste caso, criamos duas rotas para o módulo de autenticação: **/** para Login e **/registro** para o registro de novo usuário.

### [Passo 2] - CoreModule()

Uma boa prática também é criar um módulo **Core** que é o responsável por armazenar todas as injeções globais que serão utilizadas em todos os módulos.

**core_module.dart**
```dart
import 'package:dio/dio.dart';
import 'package:flutter_modular/flutter_modular.dart';

class CoreModule extends Module {

    @override
    void exportedBinds(Injector i) {
        i.add(Dio.new);
    }
}
```
importando este módulo nos outros módulos individuais, é possível utilizar todas as injeções que foram inseridas aqui, nos outros módulos.

Vale ressaltar que devemos sempre manter a organização dos arquivos e pastas, mantendo cada módulo apenas com suas responsabilidades.

Se pareceu um pouco confuso, provavelmente foi pela minha falta de costume em tentar explicar conteúdos através de texto. É algo que estou tentando melhorar e me ajuda também a fixar os conteúdos que estou estudando.