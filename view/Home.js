
import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button,
  ScrollViewComponent,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
// import Modal from 'react-native-modal';
// import { NavigationContainer } from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';




export default Home = ({route }) => {
    const navigation = useNavigation();
    const [employeeId, setEmployeeId] = useState('');
    const [supplierId, setSupplierId] = useState('');
    // useEffect(() => {
    //   console.log('window.ip,', window.ip);
    //   GetEmployee();
    //   console.log('route', route);
    // }, [route]);
  
    React.useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        console.log('window.ip,', window.ip);
        GetEmployee();
        console.log('route', route);
      });
  
      return unsubscribe;
    }, [navigation]);
  
    // 取得登入資訊
    const GetEmployee = async () => {
      let supplierId = await AsyncStorage.getItem('supplierId');
      let employeeId = await AsyncStorage.getItem('employeeId');
      if (!supplierId && !employeeId) {
        console.log('無登入資訊');
        navigation.navigate('Login', {
          routeName: 'Login',
          transitionStyle: 'horizontal',
        });
      }
      setEmployeeId(employeeId);
      setSupplierId(supplierId);
  
      console.log(supplierId, employeeId);
    };
  
    const logout = async () => {
      await AsyncStorage.removeItem('supplierId');
      await AsyncStorage.removeItem('employeeId');
      await AsyncStorage.removeItem('ip');
      navigation.navigate('Login', {
        routeName: 'Login',
        transitionStyle: 'horizontal',
      });
    };
    return (
      <>
        <ScrollView style={{flex: 1}}>
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.btnContent, {backgroundColor: '#0088ff'}]}
              onPress={() =>
                navigation.navigate('Purchase_Add', {
                  routeName: 'Purchase_Add',
                  transitionStyle: 'horizontal',
                })
              }>
              <Text style={styles.btnFont}>進貨</Text>
            </TouchableOpacity>
            {supplierId ? (
              <Text />
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.btnContent, {backgroundColor: '#0bae00'}]}
                  onPress={() =>
                    navigation.navigate('Eliminate_Add', {
                      routeName: 'Eliminate_Add',
                      transitionStyle: 'horizontal',
                    })
                  }>
                  <Text style={styles.btnFont}>銷貨</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btnContent, {backgroundColor: '#ff4c4c'}]}
                  onPress={() =>
                    navigation.navigate('Return_Add', {
                      routeName: 'Return_Add',
                      transitionStyle: 'horizontal',
                    })
                  }>
                  <Text style={styles.btnFont}>退貨</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btnContent, {backgroundColor: '#723eb8'}]}
                  onPress={() =>
                    navigation.navigate('Discard_Add', {
                      routeName: 'Discard_Add',
                      transitionStyle: 'horizontal',
                    })
                  }>
                  <Text style={styles.btnFont}>報廢</Text>
                </TouchableOpacity>
  
                <TouchableOpacity
                  style={[styles.btnContent, {backgroundColor: '#864707'}]}
                  onPress={() =>
                    navigation.navigate('Inventory_Add', {
                      routeName: 'Inventory_Add',
                      transitionStyle: 'horizontal',
                    })
                  }>
                  <Text style={styles.btnFont}>盤點</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('CreateProduct', {
                      routeName: 'CreateProduct',
                      transitionStyle: 'horizontal',
                    })
                  }
                  style={[styles.btnContent, {backgroundColor: '#fbbf24'}]}>
                  <Text style={styles.btnFont}>主檔建檔</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('CreatePpProduct', {
                      routeName: 'CreatePpProduct',
                      transitionStyle: 'horizontal',
                    })
                  }
                  style={[styles.btnContent, {backgroundColor: '#fbbf24'}]}>
                  <Text style={styles.btnFont}>子檔建檔</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Scanner', {
                      routeName: 'Scanner',
                      transitionStyle: 'horizontal',
                    })
                  }
                  style={[styles.btnContent, {backgroundColor: '#fbbf24'}]}>
                  <Text style={styles.btnFont}>掃描測試</Text>
                </TouchableOpacity> */}
              </>
            )}
            <TouchableOpacity
              onPress={() => logout()}
              style={[styles.btnContent, {backgroundColor: '#909090'}]}>
              <Text style={styles.btnFont}>登出</Text>
            </TouchableOpacity>
  
            <TouchableOpacity style={[styles.btnContent]} />
          </View>
        </ScrollView>
      </>
    );
};



const styles = StyleSheet.create({
    btnContent: {
      width: '45%',
      paddingVertical: 30,
  
      margin: 5,
  
      borderRadius: 5,
    },
    btnFont: {
      textAlign: 'center',
      fontSize: 25,
      fontWeight: 'bold',
      color: 'white',
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginVertical: 10,
    },
    label: {
      textAlign: 'center',
      marginBottom: 10,
      fontSize: 24,
    },
  });
  