import React, { Component } from 'react';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Linking,
    TouchableOpacity,
    ImageBackground,
    FlatList
} from 'react-native';
import axios from 'axios'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 1
    },
    contactsContainer: {
        flex: 14,
        padding: 10
    },
    mainTitle: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 22,
        padding: 5
    },
    searchInput: {
        borderRadius: 3,
        borderColor: '#cecece',
        borderWidth: 1,
        height: 45,
        fontSize: 16
    },
    contact: {
        flex: 1,
        flexDirection: 'column',
        margin: 1
    },
    imageBackground: {
        justifyContent: 'flex-end',
        height: 100,
    },
    name: {
        padding: 5,
        fontWeight: 'bold',
        color: '#FFF',
        textShadowRadius: 1.5,
        textShadowColor: '#000'
    }
})

const columns = 3
export default class extends Component {
    handleSearch = (text) => {
        const filteredContacts = this.state.contacts.filter(contact => contact.toLowerCase().indexOf(text.toLowerCase()) > -1)
        this.setState({
            contactsToDisplay: this.formatContacts(filteredContacts)
        })
    }
    contactItem = ({item}) => {
        if (item.isFillContact) {
            return (
                <View style={styles.contact}>
                    <ImageBackground style={styles.imageBackground} source={require('./img/white.png')}></ImageBackground>
                </View>
            )
        }
        else {
            return (
                <View style={styles.contact}>
                    <ImageBackground style={styles.imageBackground} source={{uri: item.img}}>
                        <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.cellphone}`)}>
                            <Text style={styles.name}>{item.name}</Text>
                        </TouchableOpacity>
                    </ImageBackground>
                </View>
            )
        }
    }
    renderContacts = () => {
        if(this.state.request.status) {
            if(this.state.contactsToDisplay.length) {
                return (
                    <View style={styles.contactsContainer}>
                        <FlatList
                            data={this.state.contactsToDisplay.sort()}
                            renderItem={item => this.contactItem(item)}
                            keyExtractor={item => item.id}
                            numColumns={columns}
                        />
                    </View>
                )
            }
            else {
                return(
                    <View style={styles.contactsContainer}>
                        <Text>Sin coincidencias de busqueda</Text>
                    </View>
                )
            }
        }
        else {
            return (
                <View style={styles.contactsContainer}>
                    <Text>{this.state.request.text}</Text>
                </View>
            )
        }
    }
    formatContacts = (contacts) => {
        //Agrega imagen y numero de celular
        let formattedContacts = contacts.map((value, index) => {
            return {
                id: index,
                name: value,
                cellphone: `${Math.floor(1000 + Math.random() * 9000)}00${index}`,
                img: `https://picsum.photos/id/${index+10}/100`,
                isFillContact: false
            }
        })
        //Rellena cuadros
        const completedRows = Math.floor(contacts.length / columns)
        let fillCount = columns - (contacts.length - (completedRows * columns)) 
        if(fillCount === columns) {
            fillCount = 0
        }
        for(let i = 0; i  < (fillCount); i++) {
            formattedContacts = [...formattedContacts, {id: formattedContacts.length, isFillContact: true}]
        }
        return formattedContacts
    }
    state = {
        request: {
            status : false,
            text   : 'Cargando contactos...' 
        },
        contacts : [],
        contactsToDisplay: [],
        searchValue : ''
    }
    componentDidMount = () => {
        axios.get('https://api.fungenerators.com/name/generate?category=pirate&limit=19')
        .then((response) => {
            try {
                if(response.status === 200) {
                    if(response.data.contents.names.length) {
                        const formattedContacts = this.formatContacts(response.data.contents.names)
                        this.setState({
                            request: {
                                status: true,
                            },
                            contacts: response.data.contents.names,
                            contactsToDisplay: formattedContacts
                        })
                    }
                    else {
                        this.setState({
                            request: {
                                status : false,
                                text   : 'Sin contactos disponibles por el momento'
                            }
                        })
                    }
                }
            }
            catch(err) {
                console.log('Error al procesar la petición >>', err)
                this.setState({
                    request: {
                        status : false,
                        text   : 'Ocurrió un error al procesar la lista de contactos' 
                    }
                })
            }
        })
        .catch((response) => {
            console.log('Error en la petición >>', response)
            this.setState({
                request: {
                    status : false,
                    text   : 'Ocurrió un error al obtener la lista de contactos' 
                }
            })
        })
    } 
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    <Text style={styles.mainTitle}>Contactos</Text>
                </View>
                <View style={{...styles.container, paddingLeft: 10, paddingRight: 10}}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar contactos"
                        onChangeText={text => this.handleSearch(text)}
                    />
                </View>
                {this.renderContacts()}
            </View>
        )
    }
}

