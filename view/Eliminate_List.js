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
import Modal from 'react-native-modal';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import axios from 'axios';

export default  Eliminate_List = ({route}) => {
    const navigation = useNavigation();
    const [employeeId, setEmployeeId] = useState('');
    const [supplierId, setSupplierId] = useState('');
    const [EliminateList, setEliminateList] = useState([]);
    const [deliveryDate, setDeliveryDate] = useState('');
    const [remark, setRemark] = useState('');
    const [step, setStep] = useState(1);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          GetEmployee();
          // GetEliminateList();
        });
        return unsubscribe;
    }, [navigation, route]);

    // 取得登入資訊
    const GetEmployee = async () => {
        console.log('GetEmployee');
        let supplierId = await AsyncStorage.getItem('supplierId');
        let employeeId = await AsyncStorage.getItem('employeeId');
        await setEmployeeId(employeeId);
        await setSupplierId(supplierId);
        console.log(supplierId, employeeId);
        GetEliminateList(supplierId, employeeId);
    };


      //取得暫存
  const GetEliminateList = async (supplierId, employeeId) => {
    console.log('GetEliminateList', employeeId, supplierId);
    let res = null;
    if (employeeId) {
      console.log('employeeId');
      res = await axios
        .post(`${window.httpMethod}://${window.ip}${window.API_FOLDER}get_storeTemp`, {
          employeeId: employeeId,
          billTyle: 4,
        })
        .catch(error => {
          alert('讀取失敗');
        });
    } else {
      console.log('supplierId');
      res = await axios
        .post(`${window.httpMethod}://${window.ip}${window.API_FOLDER}get_storeTemp`, {
          supplierId: supplierId,
          billTyle: 4,
        })
        .catch(error => {
          alert('讀取失敗');
        });
    }
    console.log(res.data);
    if (res.data.success) {
      setEliminateList(res.data.product);
    } else {
      setEliminateList([]);
    }
  };

  const GoEdit = ean => {
    navigation.navigate('Eliminate_Add', {
      routeName: 'Eliminate_Add',
      ean: ean,
      transitionStyle: 'horizontal',
    });
    // console.log('go ean', ean);
  };

  const RemoveProduct = async ean => {
    let res = null;
    if (employeeId) {
      res = await axios
        .post(`${window.httpMethod}://${window.ip}${window.API_FOLDER}removeTemp`, {
          employeeId: employeeId,
          ean: ean,
          billTyle: 4,
        })
        .catch(error => {
          alert('刪除失敗');
        });
    } else {
      res = await axios
        .post(`${window.httpMethod}://${window.ip}${window.API_FOLDER}removeTemp`, {
          supplierId: supplierId,
          ean: ean,
          billTyle: 4,
        })
        .catch(error => {
          alert('刪除失敗');
        });
    }
    console.log(res);
    if (res.data.success) {
      alert('成功刪除');
      GetEliminateList(supplierId, employeeId);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    // console.warn('A date has been picked: ', date);
    let d = formatDate(date);
    setDeliveryDate(d);
    hideDatePicker();
  };

  const formatDate = date => {
    var date = new Date(date);
    var YY = date.getFullYear();
    var MM =
      date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1;
    var DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var hh =
      (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var mm =
      (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
      ':';
    var ss =
      date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return YY + '-' + MM + '-' + DD;
  };

  const SubmitEliminateList = async () => {
    if (!deliveryDate) {
      alert('銷貨日期為必填');
      return null;
    }
    let res = null;
    let year = new Date(deliveryDate).getFullYear();
    let month = new Date(deliveryDate).getMonth() + 1;
    if (employeeId) {
      res = await axios
        .post(`${window.httpMethod}://${window.ip}${window.API_FOLDER}submitTemp`, {
          employeeId: employeeId,
          deliveryDate: deliveryDate,
          year: year,
          month: month,
          remark: remark,
          purchaseList: EliminateList,
          billTyle: 4, //0進貨單
          billState: 0, //0未審單
        })
        .catch(error => {
          alert('錯誤');
        });
    } else {
      res = await axios
        .post(`${window.httpMethod}://${window.ip}${window.API_FOLDER}submitTemp`, {
          supplierId: supplierId,
          deliveryDate: deliveryDate,
          year: year,
          month: month,
          remark: remark,
          purchaseList: EliminateList,
          billTyle: 4, //0進貨單
          billState: 0, //0未審單
        })
        .catch(error => {
          alert('錯誤');
        });
    }
    console.log(res);
    if (res.data.success) {
      navigation.navigate('Home', {
        routeName: 'Home',
        transitionStyle: 'horizontal',
      });
    } else {
      alert('res.data.msg');
    }
  };


  return (
    <>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 5,
          paddingTop: 10,
          paddingBottom: 50,
        }}>
        <View>
          {step == 1 && EliminateList ? (
            EliminateList.map(item => {
              return (
                <View
                  key={item.id}
                  style={{
                    padding: 10,
                    borderWidth: 1,
                    borderColor: '#d6d6d6',
                    borderRadius: 5,
                    marginVertical: 5,
                  }}>
                  <Text style={{fontSize: 20, marginVertical: 3}}>
                    {item.name} {item.ProductFreebieType == 1 ? '(贈)' : ''}
                  </Text>
                  <View style={styles.listStyle}>
                    <View
                      style={{
                        width: '50%',
                        borderRadius: 5,
                        borderWidth: 1,
                        borderColor: '#d6d6d6',
                        marginHorizontal: 1,
                      }}>
                      <Text
                        style={[
                          styles.ppStyle,
                          {borderBottomWidth: 1, borderBottomColor: '#d6d6d6'},
                        ]}>
                        {item.minQuity ? item.minQuity : 0}* {item.minUnit}(
                        {item.minPP}入)
                      </Text>
                      {item.maxQuity ? (
                        <Text style={styles.ppStyle}>
                          {item.maxQuity} *{item.maxUnit}({item.maxPP}入)
                        </Text>
                      ) : (
                        <Text style={styles.ppStyle}>無</Text>
                      )}
                    </View>
                    <View style={{width: '50%', marginHorizontal: 1}}>
                      <TouchableOpacity
                        style={[
                          styles.BtnContainer,
                          {backgroundColor: '#ffd100'},
                        ]}
                        onPress={() => GoEdit(item.ean)}>
                        <Text style={[styles.Btn, {color: 'black'}]}>編輯</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.BtnContainer, {backgroundColor: 'red'}]}
                        onPress={() => RemoveProduct(item.ean)}>
                        <Text style={styles.Btn}>刪除</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })
          ) : (
            <Text />
          )}
        </View>
        {step == 1 && EliminateList && EliminateList.length > 0 ? (
          <TouchableOpacity
            style={[styles.BtnContainer, {backgroundColor: '#1d4ed8'}]}
            onPress={() => setStep(step + 1)}>
            <Text style={styles.Btn}>下一步</Text>
          </TouchableOpacity>
        ) : (
          <Text />
        )}

        {step == 2 ? (
          <>
            <Text style={{fontSize: 24, fontWeight: 'bold'}}>
              銷貨日期：{deliveryDate}
            </Text>
            <TouchableOpacity
              style={[styles.BtnContainer, {backgroundColor: '#fbbf24'}]}
              onPress={showDatePicker}>
              <Text style={[styles.Btn, {color: 'black'}]}>選擇銷貨日期</Text>
            </TouchableOpacity>
            {/* <Text>{JSON.stringify(deliveryDate)}</Text> */}
            <DateTimePickerModal
              minimumDate={new Date()}
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
            <Text style={{fontSize: 24, fontWeight: 'bold'}}>備註：</Text>
            <TextInput
              style={[styles.input, styles.SearchInput]}
              onChangeText={text => setRemark(text)}
              placeholder={'備註'}
              multiline
              numberOfLines={4}
            />

            <TouchableOpacity
              style={[styles.BtnContainer, {backgroundColor: '#1d4ed8'}]}
              onPress={() => setStep(step - 1)}>
              <Text style={styles.Btn}>上一步</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.BtnContainer, {backgroundColor: 'red'}]}
              onPress={() => SubmitEliminateList()}>
              <Text style={styles.Btn}>送出</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text />
        )}
      </ScrollView>
      {/* 底部連結 */}
      <View style={{flex: 1}}>
        <View style={styles.FixTab}>
          <TouchableOpacity
            style={styles.FixTabBtnContainer}
            onPress={() =>
              navigation.navigate('Home', {
                routeName: 'Home',
                transitionStyle: 'horizontal',
              })
            }>
            <Text style={styles.FixTabBtn}>首頁</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.FixTabBtnContainer}
            onPress={() =>
              navigation.navigate('Eliminate_Add', {
                routeName: 'Eliminate_Add',
                transitionStyle: 'horizontal',
              })
            }>
            <Text style={styles.FixTabBtn}>銷貨</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

}




const styles = StyleSheet.create({
    // 底部連結
    FixTab: {
      position: 'absolute',
      left: 0,
      bottom: 0,
      width: '100%',
      alignSelf: 'flex-end',
      flex: 1,
      flexDirection: 'row',
      borderRadius: 0,
    },
    FixTabBtnContainer: {
      width: '50%',
      backgroundColor: '#3dbf47',
      paddingVertical: 10,
    },
    FixTabBtn: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    BtnContainer: {
      backgroundColor: '#9c9c9c',
      paddingVertical: 3,
      width: '100%',
      marginVertical: 2,
      borderRadius: 5,
    },
    Btn: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      paddingVertical: 8,
    },
    ppStyle: {
      fontSize: 18,
      fontWeight: 'bold',
      paddingVertical: 10,
      paddingHorizontal: 5,
    },
    listStyle: {
      flex: 1,
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
    },
    input: {
      borderWidth: 1,
      padding: 7,
      fontSize: 15,
      borderColor: '#bebebe',
    },
    SearchInput: {
      width: '100%',
      margin: 0,
    },
});