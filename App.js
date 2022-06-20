import React, { useState, useEffect, useRef } from 'react';
import { Button, View, Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, useNavigation, useNavigationContainerRef } from '@react-navigation/native';
import './url.js';
import Home from './view/Home';
import Login from './view/Login';
import Purchase_Add from './view/Purchase_Add';
import Purchase_List from './view/Purchase_List';
import Eliminate_Add from './view/Eliminate_Add';
import Eliminate_List from './view/Eliminate_List';
import Return_Add from './view/Return_Add';
import Return_List from './view/Return_List';
import Discard_Add from './view/Discard_Add';
import Discard_List from './view/Discard_List';
import Inventory_Add from './view/Inventory_Add';
import Inventory_List from './view/Inventory_List';
import CreateProduct from './view/CreateProduct';
import CreatePpProduct from './view/CreatePpProduct';
import RegisterTest from './view/RegisterTest';
import Scanner from './view/Scanner';
import AsyncStorage from '@react-native-async-storage/async-storage';


function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}

const Drawer = createDrawerNavigator();

export default function App() {

  const [employeeId, setEmployeeId] = useState('');
  const [supplierId, setSupplierId] = useState('');
  // const navigationRef = useNavigationContainerRef();
  // const routeNameRef = useRef();
  useEffect(() => {
    GetEmployee();
  }, []);


  // 取得登入資訊
  const GetEmployee = async () => {
    let supplierId = await AsyncStorage.getItem('supplierId');
    let employeeId = await AsyncStorage.getItem('employeeId');

    setEmployeeId(employeeId);
    setSupplierId(supplierId);

    console.log('取得廠商編號', supplierId, employeeId);
  };

  const EmployeeDrawerNavigator = () => {
    return (
      <NavigationContainer
        onStateChange={() => {
          GetEmployee()
        }}>
        <Drawer.Navigator
          useLegacyImplementation
          initialRouteName="Login"
          backBehavior="history"
          screenOptions={{ headerShown: true }}>
          <Drawer.Screen
            name="Home"
            component={Home}
            options={{
              title: '大立生鮮超市',
              headerStyle: {
                backgroundColor: '#3dbf47',
              }, headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 25,
              },
              headerTitleAlign: 'center',
              headerTintColor: '#fff',
            }} />


          <Drawer.Screen
            name="Purchase_Add"
            component={Purchase_Add}
            options={{
              title: '進貨',
              headerStyle: {
                backgroundColor: '#3dbf47',
              },
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 25,
              },
              headerTitleAlign: 'center',
              headerTintColor: '#fff',
            }}
          />

          <Drawer.Screen
            name="Purchase_List"
            component={Purchase_List}
            options={{
              title: '進貨紀錄',
              headerStyle: {
                backgroundColor: '#3dbf47',
              },
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 25,
              },
              headerTitleAlign: 'center',
              headerTintColor: '#fff',
            }}
          />
          <Drawer.Screen
            name="Eliminate_Add"
            component={Eliminate_Add}
            options={{
              title: '銷貨',
              headerStyle: {
                backgroundColor: '#3dbf47',
              },
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 25,
              },
              headerTitleAlign: 'center',
              headerTintColor: '#fff',
            }}
          />
          <Drawer.Screen
            name="Eliminate_List"
            component={Eliminate_List}
            options={{
              title: '銷貨紀錄',
              headerStyle: {
                backgroundColor: '#3dbf47',
              },
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 25,
              },
              headerTitleAlign: 'center',
              headerTintColor: '#fff',
            }}
          />
          <Drawer.Screen
            name="Return_Add"
            component={Return_Add}
            options={{
              title: '退貨',
              headerStyle: {
                backgroundColor: '#3dbf47',
              },
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 25,
              },
              headerTitleAlign: 'center',
              headerTintColor: '#fff',
            }}
          />
          <Drawer.Screen
            name="Return_List"
            component={Return_List}
            options={{
              title: '退貨紀錄',
              headerStyle: {
                backgroundColor: '#3dbf47',
              },
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 25,
              },
              headerTitleAlign: 'center',
              headerTintColor: '#fff',
            }}
          />
          <Drawer.Screen
            name="Discard_Add"
            component={Discard_Add}
            options={{
              title: '報廢',
              headerStyle: {
                backgroundColor: '#3dbf47',
              },
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 25,
              },
              headerTitleAlign: 'center',
              headerTintColor: '#fff',
            }}
          />
          <Drawer.Screen
            name="Discard_List"
            component={Discard_List}
            options={{
              title: '報廢紀錄',
              headerStyle: {
                backgroundColor: '#3dbf47',
              },
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 25,
              },
              headerTitleAlign: 'center',
              headerTintColor: '#fff',
            }}
          />
          <Drawer.Screen
            name="Inventory_Add"
            component={Inventory_Add}
            options={{
              title: '盤點',
              headerStyle: {
                backgroundColor: '#3dbf47',
              },
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 25,
              },
              headerTitleAlign: 'center',
              headerTintColor: '#fff',
            }}
          />
          <Drawer.Screen
            name="Inventory_List"
            component={Inventory_List}
            options={{
              title: '盤點紀錄',
              headerStyle: {
                backgroundColor: '#3dbf47',
              },
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 25,
              },
              headerTitleAlign: 'center',
              headerTintColor: '#fff',
            }}
          />
          <Drawer.Screen
            name="CreateProduct"
            component={CreateProduct}
            options={{
              title: '商品建檔',
              headerStyle: {
                backgroundColor: '#3dbf47',
              },
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 25,
              },
              headerTitleAlign: 'center',
              headerTintColor: '#fff',
            }}
          />
          <Drawer.Screen
            name="CreatePpProduct"
            component={CreatePpProduct}
            options={{
              title: '子檔建檔',
              headerStyle: {
                backgroundColor: '#3dbf47',
              },
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 25,
              },
              headerTitleAlign: 'center',
              headerTintColor: '#fff',
            }}
          />

          <Drawer.Screen
            name="RegisterTest"
            component={RegisterTest}
            options={{
              title: '註冊',
              headerLeft: () => null,
              gestureEnabled: false,
              swipeEnabled: false,
              headerStyle: {
                backgroundColor: '#3dbf47',
              },
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 25,
              },
              headerTitleAlign: 'center',
              headerTintColor: '#fff',
              drawerItemStyle: { display: 'none' },
            }} />
          <Drawer.Screen
            name="Login"
            component={Login}
            options={{
              title: '登入',
              headerLeft: () => null,
              gestureEnabled: false,
              swipeEnabled: false,
              headerStyle: {
                backgroundColor: '#3dbf47',
              },
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 25,
              },
              headerTitleAlign: 'center',
              headerTintColor: '#fff',
              drawerItemStyle: { display: 'none' },
            }} />
          <Drawer.Screen name="NotificationsTest" component={NotificationsScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    )
  }

  const SupplierDrawerNavigator = () => {
    return (
      <NavigationContainer
        onStateChange={() => {
          GetEmployee()
        }}>
        <Drawer.Navigator
          useLegacyImplementation
          initialRouteName="Login"
          backBehavior="history"
          screenOptions={{ headerShown: true }}>
          <Drawer.Screen
            name="Home"
            component={Home}
            options={{
              title: '大立生鮮超市',
              headerStyle: {
                backgroundColor: '#3dbf47',
              },
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 25,
              },
              headerTitleAlign: 'center',
              headerTintColor: '#fff',
            }} />


          <Drawer.Screen
            name="Purchase_Add"
            component={Purchase_Add}
            options={{
              title: '進貨',
              headerStyle: {
                backgroundColor: '#3dbf47',
              },
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 25,
              },
              headerTitleAlign: 'center',
              headerTintColor: '#fff',
            }}
          />

          <Drawer.Screen
            name="Purchase_List"
            component={Purchase_List}
            options={{
              title: '進貨紀錄',
              headerStyle: {
                backgroundColor: '#3dbf47',
              },
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 25,
              },
              headerTitleAlign: 'center',
              headerTintColor: '#fff',
            }}
          />
          <Drawer.Screen
            name="Return_Add"
            component={Return_Add}
            options={{
              title: '退貨',
              headerStyle: {
                backgroundColor: '#3dbf47',
              },
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 25,
              },
              headerTitleAlign: 'center',
              headerTintColor: '#fff',
            }}
          />
          <Drawer.Screen
            name="Return_List"
            component={Return_List}
            options={{
              title: '退貨紀錄',
              headerStyle: {
                backgroundColor: '#3dbf47',
              },
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 25,
              },
              headerTitleAlign: 'center',
              headerTintColor: '#fff',
            }}
          />


          <Drawer.Screen
            name="RegisterTest"
            component={RegisterTest}
            options={{
              title: '註冊',
              headerLeft: () => null,
              gestureEnabled: false,
              swipeEnabled: false,
              headerStyle: {
                backgroundColor: '#3dbf47',
              },
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 25,
              },
              headerTitleAlign: 'center',
              headerTintColor: '#fff',
              drawerItemStyle: { display: 'none' },
            }} />

          <Drawer.Screen
            name="Login"
            component={Login}
            options={{
              title: '登入',
              headerLeft: () => null,
              gestureEnabled: false,
              swipeEnabled: false,
              headerStyle: {
                backgroundColor: '#3dbf47',
              },
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 25,
              },
              headerTitleAlign: 'center',
              headerTintColor: '#fff',
              drawerItemStyle: { display: 'none' },
            }} />

          <Drawer.Screen name="NotificationsTest" component={NotificationsScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    )
  }


  return (
    <>
      {
        supplierId ? <>{SupplierDrawerNavigator()}</> : <>{EmployeeDrawerNavigator()}</>
      }


    </>
  );
}
