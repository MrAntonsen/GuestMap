import React from 'react';
import Joi from 'joi';
import logo from './logo.svg';
import L from 'leaflet';
import './App.css';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import { Card, Button, CardTitle, CardText, Form, FormGroup, Label, Input } from 'reactstrap';
import iconUrl from '../src/user-pin.png';
import userIconUrl from '../src/other-users-pin.png';


const myIcon = L.icon({
    iconUrl: iconUrl,
    iconSize: [44, 64],
    iconAnchor: [12.5, 41],
    popupAnchor: [0, -41],

});
let othersIcon = L.icon({
  iconUrl: userIconUrl,
  iconSize: [44, 64],
  iconAnchor: [12.5, 41],
  popupAnchor: [0, -41]

});

const schema = Joi.object().keys({
  name: Joi.string().regex(/^[A-zÀ-ú -_]{1,70}$/).min(2).max(30).required(),
  message: Joi.string().min(1).max(300).required()
});

const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000/api/v1/messages' : 'production-url-her';
//-----------------------APP----------------------------------//
class App extends React.Component {
  state ={
    location: {
      lat: 51.505,
      lng: -0.09,
    },
    haveUserLocation: false,
    zoom: 3,
    userMessage: {
      name: '',
      message: ''
    },
    sendingMessage : false,
    sentMessage: false,
    messages: []
  }
  
  componentDidMount(){
    //Henter tidligere meldinger på siden
    fetch(API_URL)
    .then(res => res.json())
    .then(messages =>{
      this.setState({
        messages
      });
    });
    navigator.geolocation.getCurrentPosition((position)=> {
                 this.setState({
                   location: {
                     lat: position.coords.latitude,
                     lng: position.coords.longitude
                   },
                   haveUserLocation: true,
                   zoom: 13
                 });
            },() =>{
              console.log('No Location given');
              fetch('https://ipapi.co/json')
              //turning response into json
              .then(res => res.json())
              .then(location => {
                this.setState({
                  location: {
                    lat: location.latitude,
                    lng: location.longitude
                  },
                  haveUserLocation: true,
                  zoom: 13
                });
              });
            });
  }
  formIsValid = () =>{
    const userMessage = 
    {
      name: this.state.userMessage.name,
      message: this.state.userMessage.message
    };
    const result = Joi.validate(userMessage, schema);

    return !result.error && this.state.haveUserLocation ? true : false;
  }

  formSubmitted = event =>{
    event.preventDefault()
    if(this.formIsValid()){
      this.setState({
        sendingMessage : true
      });
      fetch(API_URL, {
        method: 'POST',
        headers: {
          'content-type' : 'application/json'
        },
        body: JSON.stringify({
          name: this.state.userMessage.name,
          message: this.state.userMessage.message,
          latitude : this.state.location.lat,
          longitude: this.state.location.lng
        })
      }).then(res => res.json())
      .then(message =>{
        console.log(message);
        setTimeout(() => {
            this.setState({
                sendingMessage : false,
                sentMessage: true
            });
        }, 4000);

      });
    }
  };


  valueChanged = (event) => {
    const {name, value} = event.target;
    this.setState((previousState) => ({
      userMessage: {
        ...previousState.userMessage,
        [name]: value
      }
    })); 
  };

  render(){
  const position = [this.state.location.lat, this.state.location.lng];

  return (
    <div className="map">
    <Map className="map" center={position} zoom={this.state.zoom}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {
          this.state.haveUserLocation ?
            <Marker position={position}
                      icon={myIcon}>

            </Marker> : ''
        }
        {this.state.messages.map(message =>(
          <Marker 
          key={message._id}
          position={[message.latitude, message.longitude]}
          className="marker"
                      icon={othersIcon}>
                                <Popup>
                                    {message.name}: {message.message}
                                 </Popup>
            </Marker>
        ))} 
      </Map>
      <Card body className="message-form">
        <CardTitle>Finn hverandre!</CardTitle>
        {
          !this.state.sendingMessage && !this.state.sentMessage && this.state.haveUserLocation ? 
        <Form onSubmit={this.formSubmitted} >
        <FormGroup>
          <Label for="name">Navn</Label>
          <Input
            onChange={this.valueChanged}
            type="text"
            name="name"
            id="name"
            placeholder="Skriv inn ditt navn" />
        </FormGroup>
        <FormGroup>
          <Label for="message">Melding</Label>
          <Input
            onChange={this.valueChanged}
            type="textarea"
            name="message"
            id="message"
            placeholder="Din melding" />
        </FormGroup>
        <Button type="submit" color="info" disabled={!this.formIsValid()}>Send</Button>
      </Form> :
       this.state.sendingMessage  || !this.state.haveUserLocation?
          <video autoPlay loop src="https://media.giphy.com/media/BCIRKxED2Y2JO/giphy.mp4"></video>:
          <CardText>Din melding er registrert.</CardText>
        }
      </Card>
      </div>
        );
  }
}

export default App;
