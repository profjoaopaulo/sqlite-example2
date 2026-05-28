import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
// Importações dos componentes do React Native Paper para construção da interface
import { TextInput, Button, SegmentedButtons, Card, Title, Snackbar } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
// Importação do hook para acessar o contexto do SQLite
import { useSQLiteContext } from 'expo-sqlite';

export default function FormularioScreen() {
  // Acessando o contexto do SQLite para realizar operações no banco de dados
  const db = useSQLiteContext();
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('dog');
  const [dataNasc, setDataNasc] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mensagem, setMensagem] = useState('');

  // Função para formatar a data no formato DD/MM/YYYY
  const formatarData = (data) => {
    return `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')}/${data.getFullYear()}`;
  };

  const handleSalvar = () => {
    if (!nome.trim()) {
      setMensagem('Informe o nome do pet!');
      return;
    }

    try {
      // Inserindo os dados do pet no banco de dados SQLite usando o método runSync do contexto do SQLite
      db.runSync(
        'INSERT INTO pets (nome, especie, dataNasc) VALUES (?, ?, ?)',
        [nome, especie, formatarData(dataNasc)]
      );

      setMensagem('Pet cadastrado com sucesso!');
      setNome('');
      setEspecie('dog');
      setDataNasc(new Date());
    } catch (error) {
      setMensagem('Erro ao salvar no banco.');
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Dados do Animal</Title>

          <SegmentedButtons
            value={especie}
            onValueChange={setEspecie}
            buttons={[
              { value: 'dog', label: 'Cachorro', icon: 'dog' },
              { value: 'cat', label: 'Gato', icon: 'cat' },
              { value: 'bird', label: 'Papagaio', icon: 'bird' },
            ]}
            style={styles.input}
          />

          <TextInput
            label="Nome do Pet"
            mode="outlined"
            value={nome}
            onChangeText={setNome}
            style={styles.input}
          />

          <View style={styles.dateContainer}>
            <TextInput
              label="Data de Nascimento"
              mode="outlined"
              value={formatarData(dataNasc)}
              editable={false}
              style={{ flex: 1, marginRight: 10 }}
            />
            <Button mode="tonal" onPress={() => setShowDatePicker(true)} style={styles.dateBtn}>
              Escolher
            </Button>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={dataNasc}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDataNasc(selectedDate);
              }}
            />
          )}

          <Button mode="contained" onPress={handleSalvar} style={styles.btnSalvar}>
            Salvar Pet
          </Button>
        </Card.Content>
      </Card>

      <Snackbar visible={!!mensagem} onDismiss={() => setMensagem('')} duration={3000}>
        {mensagem}
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  card: { borderRadius: 12, elevation: 3 },
  title: { textAlign: 'center', marginBottom: 20 },
  input: { marginBottom: 16 },
  dateContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  dateBtn: { justifyContent: 'center', height: 50, marginTop: 6 },
  btnSalvar: { marginTop: 10, paddingVertical: 6 }
});
