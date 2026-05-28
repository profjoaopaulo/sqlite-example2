# 🐾 App Controle de Pets (CRUD) — React Native & Expo SQLite (JSI)

Este é um projeto pedagógico e de demonstração prática para um aplicativo de gerenciamento e controle de pets (CRUD), desenvolvido em **React Native** com a plataforma **Expo**. O aplicativo utiliza o **Expo Router** para uma navegação estruturada via menu lateral (*Drawer Layout*) e adota os componentes visuais do **React Native Paper**, totalmente alinhados às diretrizes do Material Design 3.

O diferencial técnico deste projeto está na implementação da persistência local utilizando o motor de banco de dados relacional **SQLite** rodando em modo síncrono de alta performance através da arquitetura **JSI**, além da manipulação avançada de datas nativas com o **DateTimePicker**.

---

## 🗄️ Arquitetura do Banco de Dados: O Novo Expo SQLite

Historicamente, as operações de banco de dados no React Native sofriam gargalos devido à antiga *Bridge* (Ponte), que exigia que os dados fossem serializados em strings JSON para trafegar entre a camada JavaScript e a camada nativa do banco (escrita em C).

Este projeto utiliza a versão moderna do **`expo-sqlite`**, que redesenhou completamente essa integração adotando a **JSI (JavaScript Interface)**:

* **Acesso Direto à Memória:** Através do JSI, o motor JavaScript do app possui referências diretas em memória para as funções nativas em C++ do SQLite.
* **Execução Síncrona (`Sync`):** Métodos como `db.runSync` e `db.getAllSync` executam consultas complexas em microssegundos. Como o banco de dados é local (*in-process*), o processamento síncrono elimina o overhead de gerenciar Promises e estados de `loading` para operações simples de CRUD.
* **Tipagem Estrita e Higienização:** Utilização de *Prepared Statements* (passagem de argumentos via arrays `[param1, param2]`) para mitigar completamente riscos de ataques por **SQL Injection**.

---

## 🛠️ Instalação e Configuração de Dependências

Certifique-se de possuir o ambiente Expo configurado globalmente. Para instalar todas as dependências nativas e bibliotecas de interface necessárias para este ecossistema, execute os comandos abaixo no terminal:

### 1. Clonar e instalar módulos base
```bash
npm install
```
### 2. Instalação dos pacotes obrigatórios do projeto - Caso precise reconstruir ou adicionar os recursos nativos individualmente, utilize o CLI do Expo para garantir as versões corretas de cada biblioteca:
```bash
# 🗄️ Banco de Dados Relacional Nativo
npx expo install expo-sqlite

# 📅 Manipulação de Interface de Calendário
npx expo install @react-native-community/datetimepicker

# 🎨 Componentes Visuais e Ícones (Material Design 3)
npx expo install react-native-paper react-native-vector-icons

# 🚏 Sistema de Navegação Avançada (Drawer & Router)
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar 
```

