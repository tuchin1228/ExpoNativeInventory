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
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Modal from 'react-native-modal';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';


export default Login = ({route}) => {
    const navigation = useNavigation();
    const [loginType, setLoginType] = useState(0); //0員工 1廠商
    const [account, setAccount] = useState(''); //帳號 廠商統編
    const [password, setPassword] = useState(''); //員工密碼
    // const [ip, setIp] = useState('192.168.0.149');
    const [ip, setIp] = useState('dali-mart.com');
  
    React.useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        AsyncStorage.removeItem('supplierId');
        AsyncStorage.removeItem('employeeId');
      });
  
      return unsubscribe;
    }, [navigation, route]);
  
    useEffect(() => {
      window.ip = ip;
      console.log(`${window.httpMethod}://${window.ip}${window.API_FOLDER}login`);
    }, [ip]);
  
    const changeLoginMethod = type => {
      setLoginType(type);
      setAccount('')
      setPassword('')
    };
  
    const GoIndex = () => {
      navigation.navigate('Home', {
        routeName: 'Home',
        transitionStyle: 'horizontal',
      });
    };
  
    const login = async () => {
      let res = null;
      console.log('登入', loginType);
      // alert(`${window.httpMethod}://${window.ip}${window.API_FOLDER}login`);
  
      res = await axios
        //   .post('http://192.168.0.83/dalimarket/public/api/PhonePos/login', {
        .post(`${window.httpMethod}://${window.ip}${window.API_FOLDER}login`, {
          loginType: loginType ? 1 : 0,
          account: account,
          password: password,
        })
        .catch(error => {
          alert('錯誤');
          console.log('錯誤ㄌ', error.response.status);
        });
  
      // alert('res', res.data);
      console.log('登入結果', res.data);
      // alert(456456);
      if (res.data.success) {
        alert('登入成功');
        console.log('登入成功');
        // localStorage.setItem('ip', vm.ip);
        await AsyncStorage.setItem('ip', ip);
        if (res.data.info.supplierId) {
          //     廠商
          console.log('廠商登入');
          await AsyncStorage.setItem('supplierId', res.data.info.supplierId);
          await AsyncStorage.removeItem('employeeId');
        } else if (res.data.info.employeeId) {
          console.log('員工登入');
          //     員工
          await AsyncStorage.setItem('employeeId', res.data.info.employeeId);
          await AsyncStorage.removeItem('supplierId');
        }
        GoIndex();
        //   location.href = './index.html';
      } else {
        alert('登入錯誤');
      }
    };
  
    return (
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 5,
          paddingTop: 10,
          paddingBottom: 50,
        }}>
        <View style={styles.FlexContainer}>
          <TouchableOpacity
            style={[
              styles.LoginTypeBtnContainer,
              loginType ? {} : {backgroundColor: '#3dbf47'},
            ]}
            onPress={() => changeLoginMethod(0)}>
            <Text style={styles.LoginTypeBtn}>員工</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.LoginTypeBtnContainer,
              loginType ? {backgroundColor: '#3dbf47'} : {},
            ]}
            onPress={() => changeLoginMethod(1)}>
            <Text style={styles.LoginTypeBtn}>廠商</Text>
          </TouchableOpacity>
        </View>
  
        <View>
          <Text style={styles.TextLabel}>IP</Text>
          <TextInput
            style={[styles.input, styles.SearchInput]}
            onChangeText={text => setIp(text)}
            value={ip}
          />
          {loginType == 0 ? (
            <Text style={styles.TextLabel}>員工手機</Text>
          ) : (
            <Text style={styles.TextLabel}>廠商編號</Text>
          )}
          <TextInput
            style={[styles.input, styles.SearchInput]}
            onChangeText={text => setAccount(text)}
            value={account}
            keyboardType="number-pad"
          />
          {loginType == 0 ? (
            <>
              <Text style={styles.TextLabel}>密碼</Text>
              <TextInput
                style={[styles.input, styles.SearchInput]}
                onChangeText={text => setPassword(text)}
                value={password}
                keyboardType="number-pad"
              />
            </>
          ) : (
            <Text />
          )}
  
          <TouchableOpacity
            style={[
              styles.LoginBtnContainer,
              loginType ? {backgroundColor: '#3dbf47'} : {},
            ]}
            onPress={() => login()}>
            <Text style={styles.LoginBtn}>登入</Text>
          </TouchableOpacity>
        </View>
  
        <View>
          {/* <Text>廠商規則:統編 ，測試用:565、40123654</Text>
          <Text>
            員工規則:手機+密碼 0900000000+123456{'\n'}008+123{'\n'}0987654321+123
          </Text> */}
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