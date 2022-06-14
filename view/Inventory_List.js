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


export default Inventory_List = ({route}) => {
    const navigation = useNavigation();
    const [employeeId, setEmployeeId] = useState('');
    const [supplierId, setSupplierId] = useState('');
    const [area, setArea] = useState([]); //盤點區域
    const [ActiveArea, setActiveArea] = useState(''); //選擇的盤點區域
    const [product, setProduct] = useState([]);
    const [InventoryList, setInventoryList] = useState([]);
    const [deliveryDate, setDeliveryDate] = useState('');
    const [remark, setRemark] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    useEffect(() => {
        GetEmployee();
        GetInvArea();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          GetEmployee();
          GetInvArea();
          GetInventoryList();
        });
        return unsubscribe;
    }, [navigation, route]);

    useEffect(() => {
        GetInventoryList();
      }, [employeeId, supplierId]);
    
      //撈盤點區域
      const GetInvArea = async () => {
        let res = await axios.get(
          `${window.httpMethod}://${window.ip}${window.API_FOLDER}inventoryArea`,
        );
        console.log(res);
        if (res.data.success) {
          setArea(res.data.area);
          setActiveArea(res.data.area[0].id);
        }
      };
      // 取得登入資訊
      const GetEmployee = async () => {
        console.log('GetEmployee');
        let supplierId = await AsyncStorage.getItem('supplierId');
        let employeeId = await AsyncStorage.getItem('employeeId');
        setEmployeeId(employeeId);
        setSupplierId(supplierId);
        console.log(supplierId, employeeId);
      };
      //取得暫存
      const GetInventoryList = async () => {
        let res = await axios.post(
          `${window.httpMethod}://${window.ip}${window.API_FOLDER}get_inventoryTemp`,
          {
            employeeId: employeeId,
          },
        );
        console.log('res', res.data);
        if (res.data.success) {
          setInventoryList(res.data.product);
        } else {
        }
      };
    
      const GoEdit = (ean, productId, productDetailId, areaId) => {
        if (ean) {
          navigation.navigate('Inventory_Add', {
            routeName: 'Inventory_Add',
            ean: ean,
            productId: productId,
            productDetailId: productDetailId,
            areaId: areaId,
            transitionStyle: 'horizontal',
          });
        } else {
          navigation.navigate('Inventory_Add', {
            routeName: 'Inventory_Add',
            productId: productId,
            productDetailId: productDetailId,
            areaId: areaId,
            transitionStyle: 'horizontal',
          });
        }
    
        // console.log('go ean', ean);
      };
    
      const RemoveProduct = async (areaId, productId, productDetailId) => {
        let res = await axios
          .post(
            `${window.httpMethod}://${window.ip}${window.API_FOLDER}delete_inventoryTemp`,
            {
              employeeId: employeeId,
              area: areaId,
              productId: productId,
              productDetailId: productDetailId,
            },
          )
          .catch(err => {
            alert('移除錯誤');
          });
        console.log(res);
        if (res.data.success) {
          GetInventoryList();
          // vm.inTempProduct = false
        } else {
          alert('移除錯誤');
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
    
      const InventoryArea = id => {
        let res = area
          .filter(item => {
            return item.id == id;
          })
          .map(function (obj) {
            return obj.area;
          });
        return res[0];
      };
    
      const SubmitInventoryList = async () => {
        let res = await axios
          .post(
            `${window.httpMethod}://${window.ip}${window.API_FOLDER}submit_inventoryTemp`,
            {
              employeeId: employeeId,
            },
          )
          .catch(err => {
            alert('錯誤');
          });
        console.log(res);
        if (res.data.success) {
          alert('成功送出');
          navigation.navigate('Home', {
            routeName: 'Home',
            transitionStyle: 'horizontal',
          });
        } else {
          alert('錯誤');
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
            <>
              <View>
                {InventoryList.map(item => {
                  if (item.quantity) {
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
                          {item.productName}{' '}
                          {item.ProductFreebieType == 1 ? '(贈)' : ''}
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
                            {item.quantity ? (
                              <Text
                                style={[
                                  styles.ppStyle,
                                  {
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#d6d6d6',
                                  },
                                ]}>
                                {item.pp}入 * {item.quantity ? item.quantity : 0}
                              </Text>
                            ) : (
                              <Text style={styles.ppStyle}>無</Text>
                            )}
                            <Text style={[styles.ppStyle]}>
                              {InventoryArea(item.areaId)}
                            </Text>
                          </View>
                          <View style={{width: '50%', marginHorizontal: 1}}>
                            <TouchableOpacity
                              style={[
                                styles.BtnContainer,
                                {backgroundColor: '#ffd100'},
                              ]}
                              onPress={() =>
                                GoEdit(
                                  item.ean,
                                  item.productId,
                                  item.productDetailId,
                                  item.areaId,
                                )
                              }>
                              <Text style={[styles.Btn, {color: 'black'}]}>
                                編輯
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[
                                styles.BtnContainer,
                                {backgroundColor: 'red'},
                              ]}
                              onPress={() =>
                                RemoveProduct(
                                  item.areaId,
                                  item.productId,
                                  item.productDetailId,
                                )
                              }>
                              <Text style={styles.Btn}>刪除</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    );
                  }
    
                  // :<Text></Text>
                })}
              </View>
              {InventoryList && InventoryList.length > 0 ? (
                <TouchableOpacity
                  style={[styles.BtnContainer, {backgroundColor: 'red'}]}
                  onPress={() => SubmitInventoryList()}>
                  <Text style={styles.Btn}>送出</Text>
                </TouchableOpacity>
              ) : (
                <Text />
              )}
              {!InventoryList || (InventoryList && InventoryList.length == 0) ? (
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 30,
                    color: '#7fcda0',
                    fontWeight: 'bold',
                    marginTop: 30,
                  }}>
                  無盤點紀錄
                </Text>
              ) : (
                <Text />
              )}
            </>
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
                onPress={() => {
                  navigation.navigate('Inventory_Add', {
                    routeName: 'Inventory_Add',
                    transitionStyle: 'horizontal',
                  });
                }}>
                <Text style={styles.FixTabBtn}>盤點</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
    );

};


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