import React from "react"
import {InputMoment, BigInputMoment, DatePicker, TimePicker} from 'react-input-moment';
import moment from 'moment'

class App extends React.Component {
  state = {
    name: ""
  }
  

  constructor(props) {
    super(props);
    this.state = {
      startTime: 0,
      endTime: 0,
      bedTime: moment().hour(22).minute(0).second(0),
      totalPay: 0,
      preBedTimePay: 0,
      postBedTimePay: 0,
      postMidnightHours: 0,
      hoursWorked: 0,
    };
    this.calculatePay = this.calculatePay.bind(this);
    this.updateStartTime = this.updateStartTime.bind(this)
    this.updateEndTime = this.updateEndTime.bind(this)
  }

  updateStartTime(event) {
    this.setState({startTime: event.target.value})
  }

  updateEndTime(event) {
    this.setState({endTime: event.target.value})

  }

  calculatePay() {
      let startTime;


      if(this.state.startTime.split(":")[0] < 17 && this.state.startTime.split(":")[0] >= 0) {
        startTime = moment().add(1, 'days').hour(this.state.startTime.split(":")[0]).minute(0).second(0)
      }
      else {
        startTime = moment().hour(this.state.startTime.split(":")[0]).minute(0).second(0)
      }

      

      if (startTime < moment().hour(17).minute(0).second(0) || startTime > moment().add(1, 'days').hour(4).minute(0).second(0)) {
        alert('start time must not be before 5pm')
        return
      }
      console.log(startTime)
      let endTime;



      if(this.state.endTime.split(":")[0] < 17) {
        endTime = moment().add(1, 'days').hour(this.state.endTime.split(":")[0]).minute(this.state.endTime.split(":")[1]).second(0)
      }
      else {
        endTime = moment().hour(this.state.endTime.split(":")[0]).minute(this.state.endTime.split(":")[1]).second(0)
      }

      if (endTime < moment().hour(17).minute(1).second(0) || endTime > moment().add(1, 'days').hour(4).minutes(0).second(0)) {
        alert('End time cannot be later than 4am')
        return
      }

      if (endTime.minutes() > 0) {
        endTime = endTime.add(1, 'hour').subtract(endTime.minutes(), 'minutes')
      }

      let bedTime = this.state.bedTime
      let hoursWorked = endTime.diff(startTime, 'hours')
      let midnightTime = moment().add(1, 'days').hour(0).minute(0).second(0)
      let totalPay = 0
      let preBedTimePay = 0
      let postBedTimePay = 0
      let postMidnightPay = 0
  
      if (endTime > bedTime) {
          let hoursOfWork;
          if (startTime == moment().hour(17).minute(0).second(0)) {
            hoursOfWork = 5
          } else if (startTime > moment().hour(23).minute(59).second(59)) {
            hoursOfWork = 0
          }
          else {
            hoursOfWork = bedTime.hour() - startTime.hour()
            if (hoursOfWork < 0) {
              hoursOfWork = 0
            }
          }
          preBedTimePay = hoursOfWork * 12
          totalPay += preBedTimePay
  
          if (endTime > midnightTime ) {
            let preMidnightHours
            let postMidnightHours

              if (startTime > bedTime && startTime < midnightTime) {
                preMidnightHours = 24 - startTime.hour()
              } else if (startTime.hour() >= 0 && startTime.hour() <= 4) {
                preMidnightHours = 0
              } else {
                preMidnightHours = 2
              }
              postBedTimePay = (preMidnightHours) * 8
              if(postBedTimePay < 0 || postBedTimePay > 16) {
                postBedTimePay = 0
              }
              totalPay += postBedTimePay
  
              if (startTime.hour() > 0 && startTime.hour() < 4) {
                postMidnightHours = endTime.hour() - startTime.hour()
              }
              else {
                postMidnightHours = endTime.hour()
              } 
              postMidnightPay = postMidnightHours * 16
              if (postMidnightPay < 0) {
                postMidnightPay = 0
              }
              totalPay += postMidnightPay
  
  
          } else {
              let preMidnightHours = endTime.hour() - bedTime.hour()
              postBedTimePay = preMidnightHours * 8
              if(postBedTimePay < 0) {
                postBedTimePay = 0
              }
              totalPay += postBedTimePay
              
          }
  
  
      } else {
          let hoursOfWork = endTime.hour() - startTime.hour()
          preBedTimePay = hoursOfWork * 12
          totalPay += preBedTimePay
          this.setState({hoursWorked: hoursWorked})
          this.setState({preBedTimePay: preBedTimePay})
          this.setState({totalPay: totalPay})
          // return {
          //     hoursWorked: hoursOfWork,
          //     preBedTimePay: preBedTimePay, 
          //     postBedTimePay: 0,
          //     postMidnightPay: 0,
          //     totalPay: totalPay
          // }
      }
        
      this.setState({hoursWorked: hoursWorked})
      this.setState({preBedTimePay: preBedTimePay})
      this.setState({postBedTimePay: postBedTimePay})
      this.setState({postMidnightPay: postMidnightPay})
      this.setState({totalPay: totalPay})
      // return {
      //     hoursWorked: hoursWorked,
      //     preBedTimePay: preBedTimePay, 
      //     postBedTimePay: postBedTimePay,
      //     postMidnightPay: postMidnightPay,
      //     totalPay: totalPay
      // }
  }
  

  componentDidMount() {
    fetch("http://localhost:3000")
      .then(res => res.json())
      .then(data => this.setState({ name: data.name }))
  }

  render() {
    return (
      <body>
      <div id = 'payWrapper'>
      <label for="startTime">Choose a time for your meeting:</label>

      <div id='timeWrapper'>

        <div id='startTimeWrapper' class='inputWrapper'>
          <h2>Start Time</h2>
          <input type="time" data-testid="startTime" id="startTime" name="startTime" min="0:00" max="23:59" onChange={this.updateStartTime}></input>
        </div>

        <div id='endTimeWrapper' class='inputWrapper'>
          <h2>End Time</h2>
          <input type="time" id="endTime" data-testid='endTime' name="endTime" min="0:00" max="23:59" onChange={this.updateEndTime}></input>
        </div>
      </div>

      <button data-testid='button' onClick={this.calculatePay}>
      Calculate Pay
      </button>

      
      <small>start time cannot be before 5pm and end time cannot be later than 4am</small>

      <h1 data-testid='totalPay'>Total Pay: $ {this.state.totalPay}!</h1>

      </div>
      </body>
    )
  }
}

export default App
