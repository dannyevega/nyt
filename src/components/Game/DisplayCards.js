import React, { Component } from 'react';
import TimerContainer from '../Timer/Timer';
import '../../index.css';

export default class DisplayCards extends Component {
  constructor(props){
    super(props);
    
    this.state = {
      cards: props.cards,
      selectedCards: [],
      correctCards: [],
      isGameStarted: false
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.cards !== this.props.cards){
      this.setState({cards: nextProps.cards });
    }
  }  

  resetGame = (e) => {
    e.preventDefault();
    this.setState({
      cards: [],
      selectedCards: [],
      correctCards: [],
      isGameStarted: false
    });
  }

  // Logic for game flow
  selectCard(key){
    const { cards, selectedCards, isGameStarted } = this.state;
    if(isGameStarted === false){ // Check for game start to initialize timer
      this.setState({ isGameStarted: true })
    }    
    if(selectedCards.length === 0){ // Player is selecting their first card
      this.setState((prevState) => {
        return {
          selectedCards: prevState.selectedCards.concat(key)
        }
      });
    } else if(selectedCards.length === 1){ // Player is selecting their second card
      // Second selection is a match. Add selected cards to 'correctCards' state and reset 'selectedCards' state
      if (cards[selectedCards[0]] === cards[key]) {
        this.setState((prevState) => {
          return {
            correctCards: prevState.correctCards.concat(selectedCards[0], key),
            selectedCards: []
          }
        });
      } else {
        // Second selection is not a match. Set 'selectedCards' for quick display then reset for more guesses
        this.setState((prevState) => {
          return {
            selectedCards: prevState.selectedCards.concat(selectedCards[0], key)
          }
        });        
        setTimeout(() => {
          this.setState({ selectedCards: [] });
        }, 1500);
      }
    }
  }  

  render() {
    const { cards, selectedCards, correctCards, isGameStarted } = this.state;    
    const gameDone = (cards.length === correctCards.length); // Check if game is finished

    return (
      <div className='card-container'>        
        <ul className='card-gallery'>
          {cards.map((card, idx) => {
            let isSelected = selectedCards.includes(idx);
            let isCorrect = correctCards.includes(idx);
            return (
              <li
                className='card'
                key={idx}
                onClick={() => {
                  if(!isSelected && !isCorrect){ // Check if card isn't currently selected AND not correct
                    this.selectCard(idx);
                  } 
                }}
              >
                <p style={{ visibility: (isSelected || isCorrect ) ? 'visible' : 'hidden' }}>{card}</p>
              </li>
            )
          })}
        </ul>
        {isGameStarted ? <TimerContainer stop={gameDone} /> : ""}
        {isGameStarted ?
          <form className='reset' onSubmit={this.resetGame}>
            <button>Reset</button>
          </form> :
          ""                  
        }        
      </div>
    )
  }
}