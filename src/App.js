import React from 'react';

function TodoListItem(props) {
  return (
    <li data-id={props.id} className={props.isChecked + " " + props.isEditing + " " + props.isHidden} onDoubleClick={props.onDoubleClick}>
      <div className="view">
        <input className="toggle" type="checkbox" checked={props.isChecked ? 'checked' : ''} onChange={props.onChange}/>        
        <label>{props.todoItem}</label>
        <button className="destroy" onClick={props.onClick} />
      </div>
      <input value={props.isEditing === 'editing' ? props.tempItem : props.todoItem} onChange={props.onValueChange} className="edit" onKeyDown={props.onKeyDown} onKeyPress={props.onKeyPress}/>
    </li>
  );
}


class TodoLists extends React.Component {
  render() {
    const todoList = this.props.todoList;
    const todoListItems = todoList.map((value, index) => ((
      <TodoListItem 
      isChecked={value.isChecked ? 'completed':''} 
      isHidden={value.isHidden ? 'hidden' : ''}
      onChange={() => this.props.onChange(index)} 
      onClick={() => this.props.onClick(index)}
      onDoubleClick={(event) => this.props.onDoubleClick(event, index)}
      isEditing={value.isEditing ? 'editing' : ''}
      id={value.todoId}
      todoItem={value.todoItem} 
      tempItem={value.tempItem}
      onKeyPress={(event) => this.props.onKeyPress(event, index)}
      onKeyDown={(event) => this.props.onKeyDown(event, index)}
      onValueChange={(event) => this.props.onValueChange(event, index)}
      />
    )));
    return (
      <ul className="todo-list">
        {todoListItems}
    </ul>
    )
  }
}

class App extends React.Component {
  constructor(props){
    super(props);
    this.ref = React.createRef();
    const getState = JSON.parse(localStorage.getItem('state'));
    // console.log(getState);
    this.state = getState || {
      todoList: [],
      istoggle: false,
      currentFilterHref: '#/',
    };
    
    this.handleEnterKeyPress = this.handleEnterKeyPress.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.countItemLeft = this.countItemLeft.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.clearCompleted = this.clearCompleted.bind(this);
    this.handleClickClear = this.handleClickClear.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);

    this.handleCompletedClick = this.handleCompletedClick.bind(this);
    this.handleAllClick = this.handleAllClick.bind(this);
    this.handleActiveClick = this.handleActiveClick.bind(this);
  }

  handleEnterKeyPress(e) {
    if(e.key == 'Enter' && e.target.value !== "") {
      const newItem = e.target.value;
      const prevTodoList = this.state.todoList.slice();
      const randomNum = Math.floor(Math.random()*1000000)+this.state.todoList.length;
      const pushValue = { 
        todoId: randomNum, 
        todoItem: newItem, 
        tempItem: '', 
        isChecked: this.state.istoggle ? true : false, 
        isEditing: false, 
        isHidden: this.state.currentFilterHref === '#/completed' && this.state.istoggle === false || this.state.currentFilterHref === '#/active' && this.state.istoggle === true ? true : false,
      };
      prevTodoList.push(pushValue);
      this.setState({ todoList: prevTodoList });
      e.target.value = '';
    }
  }

  handleValueChange(e, index) {
    const prevTodoList = this.state.todoList.slice();
    prevTodoList[index].tempItem = e.target.value;
    this.setState({ todoList: prevTodoList });
  }

  handleKeyPress(e, index){
    const changedValue = e.target.value;
    const prevTodoList = this.state.todoList.slice();
    
    if(e.key == 'Enter' && changedValue !== "") {
      console.log(changedValue + " 인덱스는 " + index)
      const fixedTodoList = prevTodoList[index];
      fixedTodoList.todoItem = changedValue;
      fixedTodoList.isEditing = false;
      this.setState({ todoList: prevTodoList });
    }else if(e.key == 'Enter' && changedValue === "") {
      prevTodoList.splice(index,1);
      this.setState({ todoList: prevTodoList });
    }
  }

  handleKeyDown(e, index) {
    const prevTodoList = this.state.todoList.slice();

    if(e.key == 'Escape') {
      prevTodoList[index].isEditing = false;
      this.setState({ todoList: prevTodoList });
    }
  }

  handleClick(itemIndex) {
    const prevTodoList = this.state.todoList.slice();
    const removedItem = prevTodoList.splice(itemIndex,1);
    this.setState({ todoList: prevTodoList });
  }

  handleChange(itemIndex) {
    const prevTodoList = this.state.todoList.slice();
    prevTodoList[itemIndex].isChecked = prevTodoList[itemIndex].isChecked ? false : true;
    if(this.state.currentFilterHref === '#/active') {
      prevTodoList.map((value) => value.isChecked ? value.isHidden = true : false);
    }else if(this.state.currentFilterHref === '#/completed') {
      prevTodoList.map((value) => !value.isChecked ? value.isHidden = true : false); 
    }else {
    prevTodoList.map((value) => value.isHidden = false);
    }
    const toggleValue = prevTodoList.filter((value) => !value.isChecked).length === 0 ? true : false;
    this.setState({ todoList: prevTodoList, istoggle: toggleValue });
  }

  handleDoubleClick(e, itemIndex) {
    const prevTodoList = this.state.todoList.slice();
    prevTodoList[itemIndex].tempItem = prevTodoList[itemIndex].todoItem;
    prevTodoList[itemIndex].isEditing = true;
    e.target.focus();
    this.setState({ todoList: prevTodoList });
  }

  handleToggle() {
    const prevTodoList = this.state.todoList.slice();
    const toggleValue = !this.state.istoggle;
    prevTodoList.map((value, index) => {
      value.isChecked = toggleValue
      if(this.state.currentFilterHref === '#/') {
        value.isHidden = false;
      }else if(this.state.currentFilterHref === '#/active') {
        value.isHidden = toggleValue;
      }else {
        value.isHidden = !toggleValue
      }
    });
    console.log('토글의 상태는 ' + toggleValue);
    this.setState({ todoList: prevTodoList, istoggle: toggleValue });
  }

  handleClickClear() {
    const prevTodoList = this.state.todoList.slice();
    const clearItemArr = [];
    prevTodoList.map(function(value){
      value.isChecked ? clearItemArr.push(value) : null;
    });
    clearItemArr.forEach((value) => prevTodoList.splice(prevTodoList.indexOf(value),1));
    this.setState({ todoList: prevTodoList });
  }

  countItemLeft() {
    const itemLeft = this.state.todoList.filter((v) => !v.isChecked);
    return itemLeft.length;
  }

  clearCompleted() {
    const prevTodoList = this.state.todoList.slice();
    const checkedItem = prevTodoList.filter(v => v.isChecked).length;
    return checkedItem > 0 ? 'Clear completed' : ''
  }

  handleAllClick() {
    const prevTodoList = this.state.todoList.slice();
    prevTodoList.map((value) => value.isHidden = false);
    this.setState({ todoList: prevTodoList, currentFilterHref: '#/'});
  }

  handleActiveClick() {
    const prevTodoList = this.state.todoList.slice();
    prevTodoList.map((value) => value.isChecked ? value.isHidden = true : value.isHidden = false);
    this.setState({ todoList: prevTodoList, currentFilterHref: '#/active' });
  }

  handleCompletedClick() {
    const prevTodoList = this.state.todoList.slice();
    prevTodoList.map((value) => !value.isChecked ? value.isHidden = true : value.isHidden = false);
    this.setState({ todoList: prevTodoList, currentFilterHref: '#/completed' });
  }

  componentDidUpdate() {
    localStorage.setItem('state', JSON.stringify(this.state));
    console.log(this.state);
  }

  render() {
    return (
      <div>
        <section className="todoapp">
          <header className="header">
            <h1>todos</h1>
            <input 
              className="new-todo" 
              placeholder="What needs to be done?" 
              onKeyPress={this.handleEnterKeyPress}
              autofocus 
            />
          </header>
          <section className="main">
            <input id="toggle-all" className="toggle-all" type="checkbox" checked={this.state.istoggle ? 'checked' : ''}/>
            <label htmlFor="toggle-all" onClick={this.handleToggle}>Mark all as complete</label>
            <TodoLists
              todoList={this.state.todoList}
              onClick={this.handleClick} 
              onChange={this.handleChange}
              onDoubleClick={this.handleDoubleClick}
              onKeyPress={this.handleKeyPress}
              onKeyDown={this.handleKeyDown}
              onValueChange={this.handleValueChange}
            />
          </section>
          <footer className="footer">
            <span className="todo-count"><strong>{this.countItemLeft()}</strong> item left</span>
            <ul className="filters">
              <li onClick={this.handleAllClick}>
                <a className={this.state.currentFilterHref=== '#/' ? 'selected' : ''} href="#/">All</a>
              </li>
              <li onClick={this.handleActiveClick}>
                <a className={this.state.currentFilterHref=== '#/active' ? 'selected' : ''} href="#/active">Active</a>
              </li>
              <li onClick={this.handleCompletedClick}>
                <a className={this.state.currentFilterHref=== '#/completed' ? 'selected' : ''} href="#/completed">Completed</a>
              </li>
            </ul>
            <button className="clear-completed" onClick={this.handleClickClear}>{this.clearCompleted()}</button>
          </footer>
        </section>
      </div>
    );
  }
}


export default App;