import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Picker } from 'react-native';
import { ScrollView, TextInput, BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import api from '../../services/api';

import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';

import styles from './styles';

function TeacherList() {
   const [teachers, setTeachers] = useState([]);
   const [favorites, setFavorites] = useState<number[]>([]);
   const [isFiltersVisible, setIsFiltersVisible] = useState(false);

   const [subject, setSubject] = useState(-1);
   const [week_day, setWeekDay] = useState(-1);
   const [time, setTime] = useState('');

   function loadFavorites() {
      AsyncStorage.getItem('favorites').then((response) => {
         if (response) {
            const favoredTeachers = JSON.parse(response);
            const favoredTeachersIds = favoredTeachers.map((teacher: Teacher) => {
               return teacher.id;
            });

            setFavorites(favoredTeachersIds);
         }
      });
   }

   useFocusEffect(() => {
      loadFavorites;
   });

   function handleToggleFiltersVisible() {
      setIsFiltersVisible(!isFiltersVisible);
   }

   async function handleFiltersSubmit() {
      loadFavorites();

      const response = await api.get('/classes', { params: { subject, week_day, time } });

      setIsFiltersVisible(false);
      setTeachers(response.data);
   }

   return (
      <KeyboardAvoidingView
         behavior="position"
         keyboardVerticalOffset={70}
         style={styles.container}
      >
         <PageHeader
            title="Proffys disponíveis"
            headerRight={
               <BorderlessButton onPress={handleToggleFiltersVisible}>
                  <Feather name="filter" size={20} color="#fff"></Feather>
               </BorderlessButton>
            }
         >
            {isFiltersVisible && (
               <View style={styles.searchForm}>
                  <Text style={styles.label}>Matéria</Text>
                  <View style={styles.input}>
                     <Picker
                        selectedValue={subject}
                        onValueChange={(subjectItem, index) => setSubject(subjectItem)}
                        style={{ width: 270 }}
                     >
                        <Picker.Item label="Matéria" value="-1" />
                        <Picker.Item label="Artes" value="Artes" />
                        <Picker.Item label="Biologia" value="Biologia" />
                        <Picker.Item label="Educação Física" value="Educação Física" />
                        <Picker.Item label="Física" value="Física" />
                        <Picker.Item label="Geografia" value="Geografia" />
                        <Picker.Item label="História" value="História" />
                        <Picker.Item label="Literatura" value="Literatura" />
                        <Picker.Item label="Matemática" value="Matemática" />
                        <Picker.Item label="Português" value="Português" />
                        <Picker.Item label="Química" value="Química" />
                     </Picker>
                  </View>

                  <View style={styles.inputGroup}>
                     <View style={styles.inputBlock}>
                        <Text style={styles.label}>Dia da semana</Text>
                        <View style={styles.input}>
                           <Picker
                              selectedValue={week_day}
                              onValueChange={(day, index) => setWeekDay(day)}
                              style={{ width: 130 }}
                           >
                              <Picker.Item label="Dia" value="-1" />
                              <Picker.Item label="Domingo" value="0" />
                              <Picker.Item label="Segunda-feira" value="1" />
                              <Picker.Item label="Terça-feira" value="2" />
                              <Picker.Item label="Quarta-feira" value="3" />
                              <Picker.Item label="Quinta-feira" value="4" />
                              <Picker.Item label="Sexta-feira" value="5" />
                              <Picker.Item label="Sábado" value="6" />
                           </Picker>
                        </View>
                     </View>

                     <View style={styles.inputBlock}>
                        <Text style={styles.label}>Horário</Text>
                        <TextInput
                           style={styles.input}
                           value={time}
                           onChangeText={(text) => setTime(text)}
                           placeholder="Horário"
                           placeholderTextColor="#000"
                        ></TextInput>
                     </View>
                  </View>

                  <RectButton style={styles.submitButton} onPress={handleFiltersSubmit}>
                     <Text style={styles.submitButtonText}>Filtrar</Text>
                  </RectButton>
               </View>
            )}
         </PageHeader>

         <ScrollView
            style={styles.teacherList}
            contentContainerStyle={{
               paddingHorizontal: 16,
            }}
         >
            {teachers.map((teacher: Teacher) => {
               return (
                  <TeacherItem
                     key={teacher.id}
                     teacher={teacher}
                     favored={favorites.includes(teacher.id)}
                  />
               );
            })}
         </ScrollView>
      </KeyboardAvoidingView>
   );
}

export default TeacherList;
