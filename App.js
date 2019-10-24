import React from 'react';
import { StyleSheet, TextInput, View, SafeAreaView,
  FlatList, TouchableOpacity, Text } from 'react-native';

import firebase from 'firebase';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAOFAGqFifSkvI4jRvR8Nq3Dus2JAyvPfQ",
  authDomain: "lesson07-firebasedemo.firebaseapp.com",
  databaseURL: "https://lesson07-firebasedemo.firebaseio.com",
  projectId: "lesson07-firebasedemo",
  storageBucket: "lesson07-firebasedemo.appspot.com",
  messagingSenderId: "1085673325819",
  appId: "1:1085673325819:web:9f32eac784f4117e825c5e"
};

export default class CRUD_AddToFirebase extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      theList: [],
      inputText: ''
    }

    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    this.itemsRef = db.collection('items');
    this.itemsRef.get().then(queryRef => {
      let initList = [];
      queryRef.forEach(item => {
        let tempItem = {
          text: item.data().text,
          key: item.id
        };
        initList.push(tempItem);
      });
      this.setState({theList: initList});
    });
  }

  handleChangeText = (text) =>  {
    this.setState({inputText: text});
  }

  handleButtonPress = () => {
    let newItem = {text: this.state.inputText};
    this.itemsRef.add(newItem).then(doc => {
      newItem.key = doc.id;
      let tempList = this.state.theList.slice(); // clone
      tempList.push(newItem);
      this.setState({
        theList: tempList,
        inputText: ''
      });
    });
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.list}>
        <FlatList
          data={this.state.theList}
          renderItem={({item})=>{
              return  (<Text>{item.text}</Text>)
            }
          }
        />
        </View>
        <TextInput
          placeholder='Enter Item'
          onChangeText={this.handleChangeText}
          value={this.state.inputText}/>
        <TouchableOpacity
          onPress={this.handleButtonPress}>
          <Text>Add Item</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}


///////// DELETE /////////
function deleteFromListByKey(list, key) {
  for (let i = 0; i < list.length; i++) { // look for the match
    if (list[i].key === key) { // find the match
      list.splice(i, 1); // remove the match
      break;
    }
  }
  // list is modified in place, nothing to return
}

export class CRUD_DeleteFromAppAndFirebase extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      theList: [],
      inputText: ''
    }

    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    this.itemsRef = db.collection('items');
    this.itemsRef.get().then(queryRef => {
      let initList = [];
      queryRef.forEach(item => {
        let tempItem = {
          text: item.data().text,
          key: item.id
        };
        initList.push(tempItem);
      });
      this.setState({theList: initList});
    });
  }

  handleChangeText = (text) =>  {
    this.setState({inputText: text});
  }

  handleButtonPress = () => {
    let newItem = {text: this.state.inputText};
    this.itemsRef.add(newItem).then(doc => {
      newItem.key = doc.id;
      let tempList = this.state.theList.slice(); // clone
      tempList.push(newItem);
      this.setState({
        theList: tempList,
        inputText: ''
      });
    });
  }

  handleDelete = (key) => {
    this.itemsRef.doc(key).delete().then(() => {
        let tempList = this.state.theList.slice(); // clone
        deleteFromListByKey(tempList, key);
        this.setState({theList: tempList});
      }
    )
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.list}>
        <FlatList
          data={this.state.theList}
          renderItem={({item})=>{
              return  (
                <View style={styles.listRow}>
                  <Text>{item.text}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.handleDelete(item.key);
                    }}>
                    <Text>Delete</Text>
                  </TouchableOpacity>
                </View>
              )
            }
          }
        />
        </View>
        <TextInput
          placeholder='Enter Item'
          onChangeText={this.handleChangeText}
          value={this.state.inputText}/>
        <TouchableOpacity
          onPress={this.handleButtonPress}>
          <Text>Add Item</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

///////// DELETE - REFACTORED /////////

class ListItem extends React.Component {
  constructor(props) {
    super(props);

    this.parent = this.props.parent;
    this.item = this.props.item;  
    this.itemsRef = this.parent.itemsRef;
  }

  handleDelete = () => {
    this.itemsRef.doc(this.item.key).delete().then(() => {
        let tempList = this.parent.state.theList.slice(); // clone
        deleteFromListByKey(tempList, this.item.key);
        this.parent.setState({theList: tempList});
      }
    )
  }

  render() {
    return (
      <View style={styles.listRow}>
        <Text>{this.item.text}</Text>
        <TouchableOpacity
          onPress={() => {
            this.handleDelete(this.item.key);
          }}>
          <Text>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export class CRUD_DeleteWithRefactor extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      theList: [],
      inputText: ''
    }

    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    this.itemsRef = db.collection('items');
    this.itemsRef.get().then(queryRef => {
      let initList = [];
      queryRef.forEach(item => {
        let tempItem = {
          text: item.data().text,
          key: item.id
        };
        initList.push(tempItem);
      });
      this.setState({theList: initList});
    });
  }

  handleChangeText = (text) =>  {
    this.setState({inputText: text});
  }

  handleButtonPress = () => {
    let newItem = {text: this.state.inputText};
    this.itemsRef.add(newItem).then(doc => {
      newItem.key = doc.id;
      let tempList = this.state.theList.slice(); // clone
      tempList.push(newItem);
      this.setState({
        theList: tempList,
        inputText: ''
      });
    });
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.list}>
        <FlatList
          data={this.state.theList}
          renderItem={({item})=>{
              return  (
                <ListItem
                  parent={this}
                  item={item}
                />
              );
            }
          }
        />
        </View>
        <TextInput
          placeholder='Enter Item'
          onChangeText={this.handleChangeText}
          value={this.state.inputText}/>
        <TouchableOpacity
          onPress={this.handleButtonPress}>
          <Text>Add Item</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    flex: 0.7
  },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 30,
    padding: 10
  }
});
