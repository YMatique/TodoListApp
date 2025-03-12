import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [tarefa, setTarefa] = useState('');
  const [listaTarefas, setListaTarefas] = useState([]);

  // Carregar tarefas salvas ao iniciar o app
  useEffect(() => {
    const carregarTarefas = async () => {
      try {
        const tarefasSalvas = await AsyncStorage.getItem('tarefas');
        if (tarefasSalvas) {
          setListaTarefas(JSON.parse(tarefasSalvas));
        }
      } catch (error) {
        console.log('Erro ao carregar tarefas:', error);
      }
    };
    carregarTarefas();
  }, []);

  // Salvar tarefas sempre que a lista mudar
  useEffect(() => {
    const salvarTarefas = async () => {
      try {
        await AsyncStorage.setItem('tarefas', JSON.stringify(listaTarefas));
      } catch (error) {
        console.log('Erro ao salvar tarefas:', error);
      }
    };
    salvarTarefas();
  }, [listaTarefas]);

  const adicionarTarefa = () => {
    if (tarefa.trim() === '') return;
    setListaTarefas([
      ...listaTarefas,
      { id: Date.now().toString(), texto: tarefa, concluida: false },
    ]);
    setTarefa('');
  };

  const toggleConcluida = (id) => {
    setListaTarefas(
      listaTarefas.map((item) =>
        item.id === id ? { ...item, concluida: !item.concluida } : item
      )
    );
  };

  const removerTarefa = (id) => {
    setListaTarefas(listaTarefas.filter((item) => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de Tarefas</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite uma tarefa"
          value={tarefa}
          onChangeText={setTarefa}
        />
        <TouchableOpacity style={styles.botaoAdicionar} onPress={adicionarTarefa}>
          <Text style={styles.textoBotao}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={listaTarefas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemTarefa}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => toggleConcluida(item.id)}
            >
              <Text style={styles.checkboxTexto}>
                {item.concluida ? '✓' : ' '}
              </Text>
            </TouchableOpacity>
            <Text
              style={[
                styles.textoTarefa,
                item.concluida && styles.textoConcluido,
              ]}
            >
              {item.texto}
            </Text>
            <TouchableOpacity
              style={styles.botaoRemover}
              onPress={() => removerTarefa(item.id)}
            >
              <Text style={styles.textoBotaoRemover}>X</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhuma tarefa ainda</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
  },
  botaoAdicionar: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    justifyContent: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
  },
  itemTarefa: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#2196F3',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxTexto: {
    fontSize: 16,
    color: '#2196F3',
  },
  textoTarefa: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  textoConcluido: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  botaoRemover: {
    backgroundColor: '#f44336',
    padding: 5,
    borderRadius: 5,
  },
  textoBotaoRemover: {
    color: '#fff',
    fontWeight: 'bold',
  },
  vazio: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});