import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Button,
    AsyncStorage
} from 'react-native';

import Storage from 'react-native-storage';

var storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
})

export default class Publish extends Component {

    constructor(props) {
        super(props);

        this.state = {content: 'fff', userid: ''}

        storage.load({
            key: 'loginState'
        }).then(ret => {
            this.setState({userid: ret.userid})
        }).catch(err => {
            alert("读取信息错误")
        })
    }

    render() {
        let content = this.state.content
        let userid = this.state.userid

        const {goBack} = this.props.navigation

        function publish() {
            let formData = new FormData()
            formData.append("content", content)
            formData.append("user_id", userid)

            fetch("http://127.0.0.1:8080/posts/create", {
                method: 'Post',
                headers: {
                    'Content-Type': 'form-data'
                },
                body: formData
            })
                .then((response) => {
                    response.json()
                })
                .then(() => {
                    goBack()
                })
                .catch((err) => {
                    alert(err)
                })
        }

        return (
            <View>
                <TextInput
                    style={styles._input}
                    multiline={true}
                    placeholder={"今天要吐槽点啥？"}
                    onChangeText={(content) => this.setState({'content': content})}
                    value={this.state.content}/>
                <Button
                    title='发布喽！'
                    color='#239300'
                    onPress={publish}/>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    _input: {
        height: 150,
        backgroundColor: '#ffffff',
        paddingTop: 16,
        paddingLeft: 16,
        paddingBottom: 16,
        paddingRight: 16
    },
})