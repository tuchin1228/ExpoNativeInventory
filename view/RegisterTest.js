import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button,
  ScrollViewComponent,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Modal from 'react-native-modal';
import {useNavigation} from '@react-navigation/native';
// import axios from 'axios';


export default RegisterTest = ({route}) => {
    const navigation = useNavigation();

    const [name, setName] = useState(''); 
    const [phone, setPhone] = useState(''); 
    const [phoneCode, setPhoneCode] = useState(''); 
    const [password, setPassword] = useState(''); 



    return (
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 5,
            paddingTop: 10,
            paddingBottom: 50,
          }}>
    
          <View>
            <Text style={styles.TextLabel}>手機號碼(+886)</Text>
            <TextInput
              style={[styles.input, styles.SearchInput]}
              onChangeText={text => setPhone(text)}
              value={phone}
            />
            <TouchableOpacity
              style={[
                styles.LoginBtnContainer,{backgroundColor: '#3dbf47'} ,
              ]}
              onPress={() => alert('簡訊已送出！')}>
              <Text style={styles.LoginBtn}>發送簡訊驗證碼</Text>
            </TouchableOpacity>
    
            <Text style={styles.TextLabel}>簡訊驗證碼</Text>
            <TextInput
              style={[styles.input, styles.SearchInput]}
              onChangeText={text => setPhoneCode(text)}
              value={phoneCode}
            />

            <Text style={styles.TextLabel}>姓名</Text>
            <TextInput
              style={[styles.input, styles.SearchInput]}
              onChangeText={text => setName(text)}
              value={name}
            />

            <Text style={styles.TextLabel}>密碼</Text>
            <TextInput
              style={[styles.input, styles.SearchInput]}
              onChangeText={text => setPassword(text)}
              value={password}
            />

            <TouchableOpacity
              style={[
                styles.LoginBtnContainer,
                {backgroundColor: '#3dbf47'} ,
              ]}
              onPress={() => alert('簡訊驗證碼錯誤')}>
              <Text style={styles.LoginBtn}>註冊</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={[
              styles.LoginBtnContainer,
              {backgroundColor: '#3dbf47'},
            ]}
            onPress={() => {
              navigation.navigate('Login', {
                routeName: 'Login',
                transitionStyle: 'horizontal',
              });
            }}>
            <Text style={styles.LoginBtn}>回登入</Text>
          </TouchableOpacity>
          </View>
    
          <View>
          </View>
        </ScrollView>
      );
};



const styles = StyleSheet.create({
    FlexContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    TextLabel: {
      fontWeight: 'bold',
      fontSize: 20,
    },
    LoginTypeBtnContainer: {
      backgroundColor: '#9c9c9c',
      paddingVertical: 10,
      marginTop: 5,
      marginBottom: 15,
      width: '50%',
    },
    LoginTypeBtn: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    input: {
      borderWidth: 1,
      padding: 7,
      fontSize: 15,
      borderColor: '#bebebe',
      marginBottom: 10,
    },
    LoginBtnContainer: {
      backgroundColor: '#3dbf47',
      paddingVertical: 10,
      marginTop: 5,
      marginBottom: 15,
      width: '100%',
    },
    LoginBtn: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });