import React, { Component } from 'react';
import DisplayCards from './DisplayCards';

const getCardData = () => { // Get data from provided endpoint
  return fetch("https://web-code-test-dot-nyt-games-prd.appspot.com/cards.json")
    .then(response => {
      return response.json();
    })
    .catch(e => console.log(e.message));
};

export default class Game extends Component {
  constructor(props){
    super(props);

    this.state = {
      cards: [],
      isGameOn: false
    }
  }

  updateCards = (cards) => {
    this.setState({
      cards,
      isGameOn: true
    });
  }

  startGame = (e) => { // Return correct data depending on players difficulty choice
    e.preventDefault();
    let cards, update = this.updateCards;
    getCardData().then(results => {
      cards = (this.difficulty === 'easy') ? results.levels[0].cards : results.levels[1].cards;
    }).then(function(){
      cards.sort(() => 0.5 - Math.random()); // Randomize cards for every new game
      update(cards); // Set state on cards and isGameOn to display cards
    });
  }

  render(){
    const { cards, isGameOn } = this.state;
    return (
      <div className='container'>
        <h1>Memory Game</h1>
        <form className='difficulty' onSubmit={this.startGame}>
          <button
            onClick={() => this.difficulty = 'easy'}
          >
            Easy
          </button>
          <button
            onClick={() => this.difficulty = 'hard'}
          >
            Hard
          </button>
        </form>
        <div className='game-board'>
          {isGameOn ?
            <DisplayCards
              cards={cards}
            /> :
            ""
          }
        </div>
      </div>
    )
  }
}