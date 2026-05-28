import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
// Importação do SQLiteProvider para gerenciamento do banco de dados
import { SQLiteProvider } from 'expo-sqlite';
import { Slot } from 'expo-router';

// Função para criar a tabela na primeira execução
const initializeDatabase = async (db) => {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS pets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      especie TEXT NOT NULL,
      dataNasc TEXT NOT NULL
    );
  `);
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={MD3LightTheme}>
        {/* Envolvendo a aplicação com o SQLiteProvider para fornecer acesso ao banco de dados em toda a hierarquia de componentes */}
        <SQLiteProvider databaseName="pets.db" onInit={initializeDatabase}>
          <Slot />
        </SQLiteProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
