var React = require('react');
var Instatype = require('instatype');
var SimpleTable = require('react-simple-table');
var request = require('superagent');
var moment = require('moment');

Array.prototype.contains = function(v) {
    for(var i = 0; i < this.length; i++) {
        if(this[i].name === v) return true;
    }
    return false;
};

Array.prototype.unique = function() {
    var arr = [];
    for(var i = 0; i < this.length; i++) {
        if(!arr.contains(this[i].name)) {
            arr.push(this[i]);
        }
    }
    return arr; 
}

var Logger = React.createClass({
    getInitialState: function() {
        return {data: [], origData: [],
                editing: false,
                food: [],
                searchFood: "",
                message: ""}
    },
    componentDidMount: function () {
        this.clickHandler();
    },
    clickHandler: function () {
        requestData(function (err, data) {
          if (err) { console.log(err); return; }
          this.setState({
            data: data,
            origData: data
          });
        }.bind(this));
    },

    typeAhead: function(query, limit, callback){
        $.getJSON("https://test.holmusk.com/food/search?q=" + query
            , function(results){
                    var res = results.map(function(item){
                        item.id = item._id;
                        return item;
                  });
                  callback(res.unique().slice(0, 10));
        });
    },
    foodChosen: function(result){
        this.setState({editing: false,
                        food: result,
                        data: this.state.origData,
                        message: result.name});
    },
    inputHasFocus: function(){
        this.setState({editing: true});
    },
    foodLogged: function(){
        postData(this.state.food.name, function (err, data) {
          if (err) { console.log(err); return; }
          requestData(function(err, data){
            if (err) { console.log(err); return; }
                this.setState({
                    data: data,
                    origData: data,
                    searchFood: "",
                    message: ""
                  });  
                  alert('Your Meal has been logged successfully!');          
          }.bind(this));
        }.bind(this));
    },


    filterData: function(){
            this.setState({
                data: this.state.origData,
                origData: this.state.origData
              });
            temp=[];
            var currentData = this.state.data;
            var searchCriteria = this.refs.searchFood.getDOMNode().value;
             if (searchCriteria != undefined && searchCriteria.trim() != '' && currentData.length > 0)
             {
                for (var i = 0; i < currentData.length; i++) 
                {
                    if (currentData[i].Logged_Meals.toUpperCase().search(searchCriteria.toUpperCase()) >= 0)
                    {
                        temp.push(currentData[i]);
                    }
                }
                this.setState({
                    data: temp,
                    origData: this.state.origData
                  });
             }
    },
    renderDisplay: function() {
        return (
            <div>
            <table className="table table-striped">
              <tbody>
                <tr>
                    <td>
                        <input id="foodSelected" ref="foodSelected" defaultValue={this.state.message} onFocus={this.inputHasFocus}
                         className="form-control-alt" placeholder="Log A Meal" />
                    </td>
                    <td>
                        <button className="btn btn-primary btn-lg" onClick={this.foodLogged} >Add</button>
                    </td>
                </tr>
               </tbody>
            </table>
            <h2 className="sub-header"> Logged Meals </h2>
            <input type="text" ref="searchFood" defaultValue={this.state.searchFood} className="form-control" placeholder="Search Food Name" onKeyUp={this.filterData} />
              <SimpleTable ref="loggedMeals" className="table table-striped" columns={[{columnHeader: 'Logged Meals', path: 'Logged_Meals'},
                //{columnHeader: 'Logged_Date', format: function(row){return moment(row.Logged_Date).format()}}]} data={this.state.data} />
                {columnHeader: 'Logged_Date', path: 'Logged_Date'}]} data={this.state.data} />
            </div>
            );
    },
    renderForm: function() {
        return (
            <div>
            <table className="table table-striped">
              <tbody>
                <tr>
                    <td>
                        <Instatype id="food" ref="food" requestHandler={this.typeAhead} selectedHandler={this.foodChosen} placeholder="Log A Meal" />
                    </td>
                    <td>
                        <button className="btn btn-primary btn-lg" disabled="true" >Add</button>
                    </td>
                </tr>
               </tbody>
            </table>
            <h2 className="sub-header"> Logged Meals </h2>
              
              <SimpleTable ref="loggedMeals" className="table table-striped" columns={[{columnHeader: 'Logged Meals', path: 'Logged_Meals'},
                //{columnHeader: 'Logged_Date', format: function(row){return moment(row.Logged_Date).format()}}]} data={this.state.data} />
                {columnHeader: 'Logged_Date', path: 'Logged_Date'}]} data={this.state.origData} />
            </div>
            );
    },
    render: function() {
            if (this.state.editing) 
                return this.renderForm();
            else 
                return this.renderDisplay();
    }
});

function requestData (callback) {
  request.get('/api/logs')
    .end(function (err, res) {
      callback(err, pipeline(res.body));
    });
}

function postData (mealName, callback) {
  request.post('/api/logs')
    .send({ name: mealName, loggedDate: moment().format() })
    .end(function (err, res) {
      callback(err, res.body);
    });
}

function transformToObject(data) {
  return {
    'Logged_Meals': data.name,
    'Logged_Date': data.loggedDate
  };
}

function pipeline (data) {
  var data = data.map(transformToObject);
  return data;
}


React.render(<Logger/>, 
    document.getElementById('react-container'));