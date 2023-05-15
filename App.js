import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import WebView from 'react-native-webview';
import React, { useEffect,useRef } from 'react';
import * as Location from 'expo-location';



export default function App() {

  // tạo ref để truy cập vào webview
  const webviewRef = useRef(null);
  async function getLocationAsync() {
    // kiểm tra quyền truy cập vị trí
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') 
    {
      console.log('Permission to access location was denied');
      return;
    }
    // lấy vị trí hiện tại
    let location = await Location.getCurrentPositionAsync({});
    // gửi vị trí hiện tại lên webview
    sendDataToWebView(location);
  }
 
  useEffect(() => {
    setInterval (() => {
      // gửi vị trí hiện tại lên webview sau mỗi 5s
      getLocationAsync();
    }, 5000);
  });
  const sendDataToWebView = (message) => {
    // gửi message lên webview
    webviewRef.current?.injectJavaScript(`
      window.postMessage(${JSON.stringify(message)}, '*');
    `);
  };
  // nhận message từ webview
  const handleWebViewMessage = event => {
    const message = JSON.parse(event.nativeEvent.data);
    console.log('Received message from webview:', message);
  };
  return (
    
    <View style={{ flex: 1 }}>
    <WebView
      ref={webviewRef}
      source={{ uri: 'https://nctuanit.github.io/MyGoongMap/' }}
      mixedContentMode='always'
      geolocationEnabled={true}
      geoLocationEnabledAndroid={true}
      locationEnabled={true}
      allowFileAccess={true}
      allowUniversalAccessFromFileURLs={true}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      sharedCookiesEnabled={true}
      thirdPartyCookiesEnabled={true}
      useWebKit={true}
      cacheEnabled={false}
      onMessage={handleWebViewMessage}
    />
  </View>
    
  );
}
