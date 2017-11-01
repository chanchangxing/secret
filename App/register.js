import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    AsyncStorage
} from 'react-native';

import Storage from 'react-native-storage';

var storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,

})

export default class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: ''
        }
    }


    static navigationOptions = ({navigation}) => {

        let navigate = navigation

        let register = () => {
            let formData = new FormData()
            formData.append('name', 'chan')
            formData.append('password', 'ccc')
            return fetch("http://127.0.0.1:8080/user/register", {
                method: 'post',
                headers: {
                    'Content-Type': 'form-data'
                },
                body: formData
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    storage.save({
                        key: 'loginState',
                        data: {
                            userid: responseJson.id
                        }
                    }).then(function () {
                        navigate.goBack()
                    })
                })
        }

        return {
            headerRight: (
                <TouchableOpacity onPress={register}>
                    <Text style={{marginRight: 16, color: '#3399FF'}}>注册</Text>
                </TouchableOpacity>
            )
        }
    }

    render() {
        return (
            <View>
                <View style={styleSheet._input_layout}>
                    <Text style={styleSheet._title}>账号</Text>
                    <TextInput style={styleSheet._input}/>
                </View>
                <View style={styleSheet._input_layout}>
                    <Text style={styleSheet._title}>密码</Text>
                    <TextInput style={styleSheet._input}/>
                </View>
            </View>
        )
    }
}

const styleSheet = StyleSheet.create({
    _input_layout: {
        marginTop: 16,
        marginRight: 16,
        marginLeft: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center'
    },
    _title: {
        flex: 1,
        marginTop: 10
    },
    _input: {
        backgroundColor: '#ffffff',
        height: 40,
        flex: 5,
        paddingLeft: 16,
        marginRight: 16,
        borderRadius: 5
    }
})

