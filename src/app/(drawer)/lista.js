import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Alert, Platform } from 'react-native';
import { List, Avatar, IconButton, Text, Portal, Dialog, TextInput, Button, SegmentedButtons } from 'react-native-paper';
// Importação do hook para acessar o contexto do SQLite
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ListaScreen() {
  // Acessando o contexto do SQLite para realizar operações no banco de dados
  const db = useSQLiteContext();
  const [pets, setPets] = useState([]);

  // Estados para controle do Modal de Edição e DatePicker
  const [editVisible, setEditVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [petEditando, setPetEditando] = useState({ id: '', nome: '', especie: 'dog', dataNasc: '' });

  // Funções Utilitárias para Tratamento de Datas
  const formatarData = (data) => {
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  const converterStringParaData = (stringData) => {
    if (!stringData) return new Date();
    const partes = stringData.split('/');
    if (partes.length !== 3) return new Date();

    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1; // Meses no JS são base zero (0-11)
    const ano = parseInt(partes[2], 10);

    return new Date(ano, mes, dia);
  };

  // Carga de dados do SQLite
  const carregarPets = useCallback(() => {
    try {
      // Execução síncrona do comando SELECT para obter todos os pets cadastrados
      const result = db.getAllSync('SELECT * FROM pets ORDER BY id DESC');
      setPets(result);
    } catch (error) {
      console.error('Erro ao buscar pets:', error);
    }
  }, [db]);

  // Recarrega a lista de pets toda vez que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      carregarPets();
    }, [carregarPets])
  );


  const abrirEdicao = (pet) => {
    setPetEditando(pet);
    setEditVisible(true);
  };

  const fecharEdicao = () => {
    setEditVisible(false);
    setShowDatePicker(false);
  };

  const handleUpdate = () => {
    if (!petEditando.nome.trim()) {
      Alert.alert('Aviso', 'O nome do pet não pode ficar vazio.');
      return;
    }

    try {
      // Execução síncrona do comando UPDATE
      db.runSync(
        'UPDATE pets SET nome = ?, especie = ?, dataNasc = ? WHERE id = ?',
        [petEditando.nome, petEditando.especie, petEditando.dataNasc, petEditando.id]
      );

      fecharEdicao();
      carregarPets();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar os dados do pet.');
      console.error(error);
    }
  };

  const confirmarExclusao = (id) => {
    Alert.alert('Atenção', 'Deseja realmente remover este pet?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          // Execução síncrona do comando DELETE para remover o pet do banco de dados
          db.runSync('DELETE FROM pets WHERE id = ?', [id]);
          carregarPets();
        }
      }
    ]);
  };

  const getIconeEspecie = (especie) => {
    switch (especie) {
      case 'cat': return 'cat';
      case 'bird': return 'bird';
      default: return 'dog';
    }
  };

  return (
    <View style={styles.container}>
      {pets.length === 0 ? (
        <View style={styles.empty}>
          <Text variant="titleMedium">Nenhum pet cadastrado.</Text>
        </View>
      ) : (
        <FlatList
          data={pets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <List.Item
              title={item.nome}
              description={`Espécie: ${item.especie === 'dog' ? 'Cachorro' : item.especie === 'cat' ? 'Gato' : 'Papagaio'} | Nasc: ${item.dataNasc}`}
              left={props => (
                <Avatar.Icon
                  {...props}
                  icon={getIconeEspecie(item.especie)}
                  style={{ backgroundColor: '#3bee00' }}
                />
              )}
              right={props => (
                <View style={styles.actions}>
                  <IconButton
                    icon="pencil"
                    iconColor="#6200ee"
                    onPress={() => abrirEdicao(item)}
                  />
                  <IconButton
                    icon="delete"
                    iconColor="#b00020"
                    onPress={() => confirmarExclusao(item.id)}
                  />
                </View>
              )}
              style={styles.item}
            />
          )}
        />
      )}

      {/* Dialog de Edição (Modal) */}
      <Portal>
        <Dialog visible={editVisible} onDismiss={fecharEdicao} style={styles.dialog}>
          <Dialog.Title>Editar Pet</Dialog.Title>
          <Dialog.Content>

            {/* Seleção de Espécie via SegmentedButtons */}
            <SegmentedButtons
              value={petEditando.especie}
              onValueChange={val => setPetEditando({ ...petEditando, especie: val })}
              buttons={[
                { value: 'dog', label: 'Cão', icon: 'dog' },
                { value: 'cat', label: 'Gato', icon: 'cat' },
                { value: 'bird', label: 'Ave', icon: 'bird' },
              ]}
              style={styles.inputSpacing}
            />

            <TextInput
              label="Nome do Pet"
              mode="outlined"
              value={petEditando.nome}
              onChangeText={t => setPetEditando({ ...petEditando, nome: t })}
              style={styles.inputSpacing}
            />

            {/* Campo de Data bloqueado para escrita, aberto via ícone */}
            <TextInput
              label="Data de Nascimento"
              mode="outlined"
              value={petEditando.dataNasc}
              editable={false}
              right={
                <TextInput.Icon
                  icon="calendar"
                  onPress={() => setShowDatePicker(true)}
                />
              }
            />

            {showDatePicker && (
              <DateTimePicker
                value={converterStringParaData(petEditando.dataNasc)}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                maximumDate={new Date()}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setPetEditando({
                      ...petEditando,
                      dataNasc: formatarData(selectedDate)
                    });
                  }
                }}
              />
            )}

          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={fecharEdicao}>Cancelar</Button>
            <Button mode="contained" onPress={handleUpdate}>Atualizar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  item: { borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  actions: { flexDirection: 'row', alignItems: 'center' },
  dialog: { borderRadius: 12 },
  inputSpacing: { marginBottom: 16 }
});
