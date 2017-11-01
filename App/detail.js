import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    TouchableOpacity,
    TextInput,
    Platform,
    Keyboard,
    ActionSheetIOS,
    AsyncStorage
} from 'react-native';
import Storage from 'react-native-storage';

var storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
})

class Img extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let status = this.props.status === null || this.props.status === 0 ? 0 : 1
        return status === 0 ? <Image source={require('../img/like.png')} style={styles._like}/> :
            <Image source={require('../img/liked.png')} style={styles._like}/>
    }
}

export default class Detail extends Component {

    constructor(props) {
        super(props)

        this.state = {
            keybardSpace: 0,
            reply_name: '',
            userid: 0,
            detail: "",
            content: "",
            comment: "",
        }

        this.keyboardShow = Platform.OS === 'ios' ?
            Keyboard.addListener('keyboardWillShow', this.updateKeyboardSpace.bind(this)) : Keyboard.addListener('keyboardDidShow', this.updateKeyboardSpace.bind(this));

        this.keyboardHide = Platform.OS === 'ios' ?
            Keyboard.addListener('keyboardWillHide', this.resetKeyboardSpace.bind(this)) : Keyboard.addListener('keyboardDidHide', this.resetKeyboardSpace.bind(this));

        this._onPressItem.bind(this)

        fetch("http://127.0.0.1:8080/posts/detail?user_id=" + 33 + "&posts_id=" + this.props.navigation.state.params.postsId, {
            headers: 'Get'
        })
            .then(response => response.json())
            .then(responseJson => {
                console.log(responseJson)
                this.setState(() => {
                    return {detail: responseJson}
                })
            })
            .catch(err => {
                alert("失败")
                console.log(err)
            })

        fetch("http://127.0.0.1:8080/posts/comment?posts_id=" + this.props.navigation.state.params.postsId, {
            headers: 'Get'
        })
            .then(response => response.json())
            .then(responseJson => {
                this.setState({
                    comment: responseJson
                })
            })
            .catch(err => {
                alert("失败")
                console.log(err)
            })
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <View style={{flex: 1}}>
                    <Text style={styles._content}>{this.state.detail.content}</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10}}>
                        <TouchableOpacity onPress={this._onPressLike}>
                            <Img status={this.state.detail.status}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles._border}/>
                    <FlatList
                        data={this.state.comment}
                        renderItem={({item}) => this._item(item)}>
                    </FlatList>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff'}}>
                    <TextInput
                        style={styles._text_input}
                        placeholder={this.state.reply_name}
                        onChangeText={(content) => this.setState({content})}>
                    </TextInput>
                    <TouchableOpacity onPress={() => this._onPressSend(this.props.navigation.state.params.postsId)}>
                        <Text style={styles._send}>发送</Text>
                    </TouchableOpacity>
                </View>
                <KeyboardSpacer keyboardSpace={this.state.keyboardSpace}/>
            </View>
        )
    }

    _item = (item) => {
        return (
            <TouchableOpacity onPress={this._onPressItem} onLongPress={this._onLongPressItem}>
                <View style={{flexDirection: 'row', margin: 16}}>
                    <Image
                        source={require('../img/head.png')}
                        style={styles._header} />
                    <View style={{flex: 1, flexDirection: 'column', marginLeft: 16}}>
                        <Text style={styles._comment_title}>{item.name}</Text>
                        <Text style={styles._comment_content}>{item.content}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    _onPressLike() {
        alert("like")
    }

    _onPressSend(postId) {
        alert(this.state.content)

        var formData = new FormData()
        formData.append("user_id", 33)
        formData.append("posts_id", postId)
        formData.append("content", this.state.content)

        fetch("http://127.0.0.1:8080/posts/comment", {
            method: 'post',
            headers: {
                'Content-Type': 'form-data'
            },
            body: formData
        })
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson.data = "成功") {
                    alert("成功")
                } else {
                    alert("失败")
                }
            })
            .catch(err => {
                alert("错误")
                console.log(err)
            })
    }

    _onPressItem = () => {
        this.setState({
            reply_name: 'fuck you'
        })
    }

    _onLongPressItem() {
        ActionSheetIOS.showActionSheetWithOptions({
            options: [
                '回复',
                '查看对话',
                '取消'
            ],
            cancelButtonIndex: 3,
            destructiveButtonIndex: 0
        }, function (index) {
            alert('您刚才点击的按钮索引是：' + index);
        })
    }

    updateKeyboardSpace(frames) {
        if (!frames.endCoordinates) {
            return;
        }
        let keyboardSpace = frames.endCoordinates.height;//获取键盘高度

        this.setState({
            keyboardSpace: keyboardSpace
        })
    }

    resetKeyboardSpace(frames) {
        if (!frames.endCoordinates) {
            return;
        }

        this.setState({
            keyboardSpace: 0
        })
    }


}

class KeyboardSpacer extends Component {
    constructor() {
        super();
    }

    static propTypes = {
        keyboardSpace: 200
    };

    static defaultProps = {
        keyboardSpace: 0
    };

    render() {

        let {keyboardSpace} = this.props;
        return (
            <View style={[styles.container, {height: ~~keyboardSpace}]}/>
        );
    }
}

const styles = StyleSheet.create({
    _title: {
        fontSize: 16,
        margin: 16
    },

    _content: {
        fontSize: 12,
        marginTop: 16,
        marginLeft: 16,
        marginRight: 16,
        marginBottom: 16,
        color: '#666666'
    },

    _border: {
        height: 0.3,
        backgroundColor: '#666666'
    },

    _header: {
        width: 40,
        height: 40,
        borderRadius: 20
    },
    _comment_name: {
        fontSize: 14,
        marginTop: 5
    },

    _comment_content: {
        fontSize: 12,
        marginTop: 5,
        color: '#666666'
    },

    _like: {
        width: 20,
        height: 20,
        marginRight: 16,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },

    _comment: {
        width: 20,
        height: 20,
        marginRight: 16
    },

    _text_input: {
        height: 30,
        backgroundColor: '#ffffff',
        margin: 10,
        paddingLeft: 15,
        fontSize: 14,
        borderStyle: 'solid',
        borderColor: '#666666',
        borderWidth: 0.5,
        borderRadius: 15,
        flex: 1
    },

    _send: {
        color: '#3399FF',
        justifyContent: 'center',
        marginRight: 16,
    },

    container: {
        left: 0,
        right: 0,
        bottom: 0
    }
})